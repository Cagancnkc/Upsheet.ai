'use strict';
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
const { sendEvent: loopsEvent } = require('../services/mailchimp');

let _stripe = null;
function getStripe() {
  if (!_stripe) _stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  return _stripe;
}

function getSb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

const PRICE_MAP = {
  pro_normal_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
  pro_normal_yearly:  process.env.STRIPE_PRICE_PRO_YEARLY,
  pro_max_monthly:    process.env.STRIPE_PRICE_PRO_MAX_MONTHLY,
  pro_max_yearly:     process.env.STRIPE_PRICE_PRO_MAX_YEARLY,
  team_monthly:       process.env.STRIPE_PRICE_TEAM_MONTHLY || process.env.STRIPE_PRICE_BIZ_MONTHLY,
  team_yearly:        process.env.STRIPE_PRICE_TEAM_YEARLY  || process.env.STRIPE_PRICE_BIZ_YEARLY,
};

// internal plan name → display key
const PLAN_DISPLAY = { free: 'free', pro: 'pro_normal', pro_max: 'pro_max', business: 'team' };

async function authenticate(req, res) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  const token = auth.split(' ')[1];
  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user) {
    res.status(401).json({ error: 'Geçersiz oturum.' });
    return null;
  }
  return user;
}

// GET /api/subscription/status
router.get('/status', async (req, res) => {
  const user = await authenticate(req, res);
  if (!user) return;

  const sb = getSb();
  const { data: usage, error } = await sb
    .from('user_usage')
    .select('plan, subscription_status, stripe_customer_id, stripe_subscription_id, plan_ends_at, subscription_period')
    .eq('user_id', user.id)
    .single();

  if (error || !usage) {
    return res.json({ plan: 'free', displayPlan: 'free', subscriptionStatus: 'inactive', planEndsAt: null, stripe: null });
  }

  let stripeDetails = null;
  const subId = usage.stripe_subscription_id;
  if (subId && process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('BURAYA')) {
    try {
      const sub = await getStripe().subscriptions.retrieve(subId);
      stripeDetails = {
        currentPeriodEnd: sub.current_period_end,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        interval: sub.items.data[0]?.price?.recurring?.interval || usage.subscription_period,
        status: sub.status,
      };
    } catch (e) {
      console.error('[subscription/status] Stripe error:', e.message);
    }
  }

  return res.json({
    plan: usage.plan || 'free',
    displayPlan: PLAN_DISPLAY[usage.plan] || usage.plan || 'free',
    subscriptionStatus: usage.subscription_status || 'inactive',
    planEndsAt: usage.plan_ends_at,
    stripe: stripeDetails,
  });
});

// POST /api/subscription/change
router.post('/change', async (req, res) => {
  const user = await authenticate(req, res);
  if (!user) return;

  const { targetPlan } = req.body;
  if (!targetPlan) return res.status(400).json({ error: 'targetPlan gerekli.' });

  const newPriceId = PRICE_MAP[targetPlan];
  if (!newPriceId || newPriceId.includes('BURAYA')) {
    return res.status(400).json({ error: `${targetPlan} için Stripe Price ID henüz ayarlanmamış.` });
  }

  const sb = getSb();
  const { data: usage } = await sb
    .from('user_usage')
    .select('plan, stripe_customer_id, stripe_subscription_id')
    .eq('user_id', user.id)
    .single();

  // map targetPlan key → internal plan name
  let newInternalPlan = 'pro';
  if (targetPlan.startsWith('pro_max')) newInternalPlan = 'pro_max';
  else if (targetPlan.startsWith('team')) newInternalPlan = 'business';
  const newPeriod = targetPlan.endsWith('yearly') ? 'yearly' : 'monthly';

  // Senaryo A: abonelik yok → checkout session aç
  if (!usage?.stripe_subscription_id) {
    try {
      const sessionConfig = {
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: newPriceId, quantity: 1 }],
        success_url: (process.env.CLIENT_URL || 'https://mocksheets.com') + '/app.html?subscription=success',
        cancel_url:  (process.env.CLIENT_URL || 'https://mocksheets.com') + '/app.html',
        metadata: { userId: user.id, targetPlan, plan: newInternalPlan, period: newPeriod },
        subscription_data: { metadata: { userId: user.id, targetPlan, plan: newInternalPlan, period: newPeriod } },
        allow_promotion_codes: true,
        locale: 'tr',
      };
      if (usage?.stripe_customer_id) {
        sessionConfig.customer = usage.stripe_customer_id;
      } else if (user.email) {
        sessionConfig.customer_email = user.email;
      }
      const session = await getStripe().checkout.sessions.create(sessionConfig);
      return res.json({ success: true, checkoutUrl: session.url });
    } catch (err) {
      console.error('[subscription/change] Checkout error:', err.message);
      return res.status(500).json({ error: 'Checkout oluşturulamadı: ' + err.message });
    }
  }

  // Senaryo B: mevcut aboneliği güncelle
  try {
    const subscription = await getStripe().subscriptions.retrieve(usage.stripe_subscription_id);
    const currentItemId = subscription.items.data[0].id;

    const updated = await getStripe().subscriptions.update(usage.stripe_subscription_id, {
      items: [{ id: currentItemId, price: newPriceId }],
      proration_behavior: 'create_prorations',
    });

    await sb.from('user_usage').update({
      plan: newInternalPlan,
      subscription_period: newPeriod,
      plan_ends_at: new Date(updated.current_period_end * 1000).toISOString(),
    }).eq('user_id', user.id);

    return res.json({ success: true, message: 'Planın güncellendi.' });
  } catch (err) {
    console.error('[subscription/change] Update error:', err.message);
    return res.status(500).json({ error: 'Plan değiştirilemedi: ' + err.message });
  }
});

// POST /api/subscription/cancel
router.post('/cancel', async (req, res) => {
  const user = await authenticate(req, res);
  if (!user) return;

  const sb = getSb();
  const { data: usage } = await sb
    .from('user_usage')
    .select('stripe_subscription_id, plan')
    .eq('user_id', user.id)
    .single();

  if (!usage?.stripe_subscription_id) {
    return res.status(400).json({ error: 'Aktif abonelik bulunamadı.' });
  }

  try {
    const sub = await getStripe().subscriptions.update(usage.stripe_subscription_id, {
      cancel_at_period_end: true,
    });
    const endDate = new Date(sub.current_period_end * 1000).toLocaleDateString('tr-TR');

    // Loops: subscription_cancelled event
    try {
      const { data: { user: cUser } } = await sb.auth.admin.getUserById(user.id);
      if (cUser?.email) {
        const firstName = cUser.user_metadata?.full_name || cUser.email.split('@')[0];
        loopsEvent(cUser.email, 'subscription_cancelled', {
          firstName, previousPlan: usage?.plan || 'pro', endDate
        });
      }
    } catch (e) { console.error('[loops] cancel event:', e.message); }

    return res.json({ success: true, endDate, message: `Aboneliğin ${endDate} tarihinde sona erecek.` });
  } catch (err) {
    console.error('[subscription/cancel] Error:', err.message);
    return res.status(500).json({ error: 'İptal edilemedi: ' + err.message });
  }
});

// POST /api/subscription/reactivate
router.post('/reactivate', async (req, res) => {
  const user = await authenticate(req, res);
  if (!user) return;

  const sb = getSb();
  const { data: usage } = await sb
    .from('user_usage')
    .select('stripe_subscription_id')
    .eq('user_id', user.id)
    .single();

  if (!usage?.stripe_subscription_id) {
    return res.status(400).json({ error: 'Aktif abonelik bulunamadı.' });
  }

  try {
    await getStripe().subscriptions.update(usage.stripe_subscription_id, {
      cancel_at_period_end: false,
    });
    return res.json({ success: true, message: 'Aboneliğin yeniden aktif edildi.' });
  } catch (err) {
    console.error('[subscription/reactivate] Error:', err.message);
    return res.status(500).json({ error: 'Yeniden aktif edilemedi: ' + err.message });
  }
});

// POST /api/subscription/portal
router.post('/portal', async (req, res) => {
  const user = await authenticate(req, res);
  if (!user) return;

  const sb = getSb();
  const { data: usage } = await sb
    .from('user_usage')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();

  if (!usage?.stripe_customer_id) {
    return res.status(400).json({ error: 'no_customer' });
  }

  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: usage.stripe_customer_id,
      return_url: (process.env.CLIENT_URL || 'https://mocksheets.com') + '/app.html'
    });
    return res.json({ url: session.url });
  } catch (err) {
    console.error('[subscription/portal] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
