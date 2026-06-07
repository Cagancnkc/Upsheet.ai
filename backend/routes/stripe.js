'use strict';
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');

// stripe instance — lazily initialized so module loads even without env vars
let _stripe = null;
function getStripe() {
  if (!_stripe) _stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  return _stripe;
}

// Fiyat planları
const PLANS = {
  pro: {
    weekly:  { priceId: process.env.STRIPE_PRICE_PRO_WEEKLY,  name: 'Pro Haftalık',  amount: 14900, currency: 'try' },
    monthly: { priceId: process.env.STRIPE_PRICE_PRO_MONTHLY, name: 'Pro Aylık',     amount: 49900, currency: 'try' },
    yearly:  { priceId: process.env.STRIPE_PRICE_PRO_YEARLY,  name: 'Pro Yıllık',    amount: 29900, currency: 'try' }
  },
  business: {
    weekly:  { priceId: process.env.STRIPE_PRICE_BIZ_WEEKLY,  name: 'İş Haftalık',   amount: 34900, currency: 'try' },
    monthly: { priceId: process.env.STRIPE_PRICE_BIZ_MONTHLY, name: 'İş Aylık',      amount: 109900, currency: 'try' },
    yearly:  { priceId: process.env.STRIPE_PRICE_BIZ_YEARLY,  name: 'İş Yıllık',     amount: 69900, currency: 'try' }
  }
};

// ── Checkout Session oluştur ─────────────────────
router.post('/create-checkout-session', async (req, res) => {
  const { plan, period, userEmail, userId, quantity } = req.body;

  if (!plan || !period) {
    return res.status(400).json({ error: 'Plan ve periyot gerekli' });
  }

  const planData = PLANS[plan]?.[period];
  if (!planData) {
    return res.status(400).json({ error: 'Geçersiz plan veya periyot' });
  }

  if (!planData.priceId || planData.priceId.includes('BURAYA')) {
    return res.status(400).json({
      error: 'Stripe Price ID henüz ayarlanmamış. .env dosyasını güncelleyin.'
    });
  }

  try {
    const sessionConfig = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: planData.priceId,
        quantity: quantity || 1
      }],
      success_url: process.env.CLIENT_URL +
        '/payment-success.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: process.env.CLIENT_URL +
        '/index.html#pricing',
      metadata: {
        plan,
        period,
        userId: userId || '',
      },
      subscription_data: {
        metadata: {
          plan,
          period,
          userId: userId || ''
        }
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      locale: 'tr',
    };

    if (userEmail) {
      sessionConfig.customer_email = userEmail;
    }

    const session = await getStripe().checkout.sessions.create(sessionConfig);
    res.json({ url: session.url, sessionId: session.id });

  } catch (err) {
    console.error('Stripe checkout error:', err);
    res.status(500).json({ error: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
  }
});

// ── Subscription durumu kontrol et ──────────────
router.get('/subscription/:sessionId', async (req, res) => {
  try {
    const session = await getStripe().checkout.sessions.retrieve(
      req.params.sessionId, {
        expand: ['subscription', 'subscription.default_payment_method']
      }
    );

    if (!session) {
      return res.status(404).json({ error: 'Session bulunamadı' });
    }

    const sub = session.subscription;
    res.json({
      status: sub?.status || 'unknown',
      plan: session.metadata?.plan,
      period: session.metadata?.period,
      currentPeriodEnd: sub?.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null,
      cancelAtPeriodEnd: sub?.cancel_at_period_end || false,
      customerId: session.customer
    });

  } catch (err) {
    res.status(500).json({ error: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
  }
});

// ── Customer Portal (iptal/güncelleme) ──────────
router.post('/customer-portal', async (req, res) => {
  const { customerId } = req.body;
  if (!customerId) {
    return res.status(400).json({ error: 'Customer ID gerekli' });
  }

  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.CLIENT_URL + '/app.html'
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
  }
});

// ── Webhook handler ──────────────────────────────
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
      event = getStripe().webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature error:', err.message);
      return res.status(400).send('Webhook Error: ' + err.message);
    }

    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object;
        const { createClient } = require('@supabase/supabase-js');
        const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        const period = session.metadata?.period;

        if (userId && plan) {
          let planEndsAt = null;
          const now = new Date();
          if (period === 'weekly') {
            planEndsAt = new Date(now.setDate(now.getDate() + 7));
          } else if (period === 'monthly') {
            planEndsAt = new Date(now.setMonth(now.getMonth() + 1));
          } else if (period === 'yearly') {
            planEndsAt = new Date(now.setFullYear(now.getFullYear() + 1));
          }

          await sb.from('user_usage').upsert({
            user_id: userId,
            plan: plan,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            subscription_status: 'active',
            subscription_period: period,
            plan_started_at: new Date().toISOString(),
            plan_ends_at: planEndsAt?.toISOString()
          }, { onConflict: 'user_id' });

          console.log(`✅ Plan güncellendi: ${userId} → ${plan} (${period})`);

          if (session.customer_email && process.env.LOOPS_API_KEY) {
            fetch('https://app.loops.so/api/v1/contacts/update', {
              method: 'PUT',
              headers: { Authorization: `Bearer ${process.env.LOOPS_API_KEY}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: session.customer_email, userGroup: plan })
            }).catch(e => console.error('[loops] contact update failed:', e.message));
          }
        } else {
          console.log('✅ Ödeme tamamlandı:', session.customer_email);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        console.log('📦 Abonelik güncellendi:', sub.id, sub.status);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const { createClient: createClientDel } = require('@supabase/supabase-js');
        const sbDel = createClientDel(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

        await sbDel.from('user_usage')
          .update({ plan: 'free', subscription_status: 'canceled', plan_ends_at: null })
          .eq('stripe_subscription_id', sub.id);

        console.log(`❌ Abonelik iptal: ${sub.id} → free plan`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('💳 Ödeme başarısız:', invoice.customer_email);
        if (invoice.subscription) {
          const { createClient: sbFail } = require('@supabase/supabase-js');
          const sbF = sbFail(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
          await sbF.from('user_usage')
            .update({ subscription_status: 'past_due' })
            .eq('stripe_subscription_id', invoice.subscription);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log('💰 Fatura ödendi:', invoice.amount_paid / 100);
        break;
      }

      default:
        console.log('Unhandled event:', event.type);
    }

    res.json({ received: true });
  }
);

// ── Ödeme linklerini döndür (frontend'e production URL'leri sağlar) ─────────
router.get('/links', (req, res) => {
  res.json({
    pro: {
      weekly:  process.env.STRIPE_PRO_LINK_WEEKLY  || '',
      monthly: process.env.STRIPE_PRO_LINK_MONTHLY || '',
      yearly:  process.env.STRIPE_PRO_LINK_YEARLY  || ''
    },
    business: {
      weekly:  process.env.STRIPE_BIZ_LINK_WEEKLY  || '',
      monthly: process.env.STRIPE_BIZ_LINK_MONTHLY || '',
      yearly:  process.env.STRIPE_BIZ_LINK_YEARLY  || ''
    }
  });
});

// ── Plan bilgilerini getir ───────────────────────
router.get('/plans', (req, res) => {
  res.json({
    pro: {
      weekly:  { amount: 149, currency: '₺', period: 'hafta' },
      monthly: { amount: 499, currency: '₺', period: 'ay' },
      yearly:  { amount: 299, currency: '₺', period: 'yıl', note: 'Yıllık ödeme' }
    },
    business: {
      weekly:  { amount: 349, currency: '₺', period: 'hafta' },
      monthly: { amount: 1099, currency: '₺', period: 'ay' },
      yearly:  { amount: 699, currency: '₺', period: 'yıl', note: 'Yıllık ödeme' }
    }
  });
});

module.exports = router;
