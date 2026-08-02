'use strict';
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { validateEvent, WebhookVerificationError } = require('@polar-sh/sdk/webhooks');

function getSb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

const POLAR_API = 'https://api.polar.sh';

async function cancelSubscriptionInternal(userId, sb, immediate = false) {
  const { data: usage } = await sb
    .from('user_usage')
    .select('polar_subscription_id')
    .eq('user_id', userId)
    .single();

  const subId = usage?.polar_subscription_id;
  if (!subId) return { skipped: true };

  const headers = {
    'Authorization': `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };

  let cancelPeriodEnd = null;

  if (immediate) {
    await fetch(`${POLAR_API}/v1/subscriptions/${subId}`, { method: 'DELETE', headers });
  } else {
    const resp = await fetch(`${POLAR_API}/v1/subscriptions/${subId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ cancel_at_period_end: true }),
    });
    const data = await resp.json();
    cancelPeriodEnd = data?.current_period_end ?? null;
  }

  await sb.from('user_usage').update({
    cancel_at_period_end: true,
    cancel_period_end: cancelPeriodEnd,
  }).eq('user_id', userId);

  return { success: true, cancel_period_end: cancelPeriodEnd };
}

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
    console.warn('[authenticate:billing] Token reddedildi:', error?.message || 'kullanıcı bulunamadı');
    res.status(401).json({ error: 'Geçersiz oturum.' });
    return null;
  }
  return user;
}

const POLAR_CHECKOUT_LINKS = {
  pro:   { monthly: process.env.POLAR_PRODUCT_ID_PRO_MONTHLY,   yearly: process.env.POLAR_PRODUCT_ID_PRO_YEARLY   },
  ultra: { monthly: process.env.POLAR_PRODUCT_ID_ULTRA_MONTHLY, yearly: process.env.POLAR_PRODUCT_ID_ULTRA_YEARLY },
};

// POST /api/billing/checkout
router.post('/checkout', async (req, res) => {
  try {
    const user = await authenticate(req, res);
    if (!user) return;

    const { plan, period } = req.body;
    const safePeriod = (period === 'yearly') ? 'yearly' : 'monthly';
    const checkoutUrl = POLAR_CHECKOUT_LINKS[plan]?.[safePeriod];

    if (!checkoutUrl) {
      return res.status(400).json({ error: 'Geçersiz plan veya checkout linki tanımlı değil' });
    }

    res.json({ checkoutUrl });
  } catch (e) {
    console.error('[Polar checkout] hata:', e);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/billing/webhook — raw body, public (imza doğrulaması ile korunuyor)
router.post('/webhook', async (req, res) => {
  try {
    const secret = process.env.POLAR_WEBHOOK_SECRET;
    if (!secret) {
      console.error('[Polar webhook] POLAR_WEBHOOK_SECRET tanımlı değil');
      return res.status(500).json({ error: 'Webhook yapılandırması eksik' });
    }

    let event;
    try {
      event = validateEvent(req.body, req.headers, secret);
    } catch (e) {
      if (e instanceof WebhookVerificationError) {
        console.error('[Polar webhook] imza doğrulama hatası:', e.message);
        return res.status(400).json({ error: 'Webhook doğrulanamadı' });
      }
      throw e;
    }

    const sb = getSb();

    if (
      (event.type === 'subscription.created' || event.type === 'subscription.updated') &&
      event.data.status === 'active'
    ) {
      const userId = event.data.metadata?.mocksheets_user_id;
      const plan = event.data.metadata?.plan;
      if (userId && plan) {
        await sb.from('user_usage').update({
          plan,
          polar_subscription_id: event.data.id,
        }).eq('user_id', userId);
      }
    }

    if (event.type === 'subscription.canceled' || event.type === 'subscription.revoked') {
      const userId = event.data.metadata?.mocksheets_user_id;
      if (userId) {
        await sb.from('user_usage').update({ plan: 'free' }).eq('user_id', userId);
      }
    }

    res.status(200).json({ received: true });
  } catch (e) {
    console.error('[Polar webhook] işleme hatası:', e);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// GET /api/billing/subscription-status
router.get('/subscription-status', async (req, res) => {
  try {
    const user = await authenticate(req, res);
    if (!user) return;
    const sb = getSb();
    const { data } = await sb
      .from('user_usage')
      .select('plan, cancel_at_period_end, cancel_period_end')
      .eq('user_id', user.id)
      .single();
    res.json({
      plan: data?.plan ?? 'free',
      cancel_at_period_end: data?.cancel_at_period_end ?? false,
      cancel_period_end: data?.cancel_period_end ?? null,
    });
  } catch (e) {
    console.error('[billing/subscription-status] hata:', e);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/billing/cancel-subscription
router.post('/cancel-subscription', async (req, res) => {
  try {
    const user = await authenticate(req, res);
    if (!user) return;
    const result = await cancelSubscriptionInternal(user.id, getSb(), false);
    res.json(result);
  } catch (e) {
    console.error('[billing/cancel-subscription] hata:', e);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/billing/uncancel-subscription
router.post('/uncancel-subscription', async (req, res) => {
  try {
    const user = await authenticate(req, res);
    if (!user) return;
    const sb = getSb();
    const { data: usage } = await sb
      .from('user_usage')
      .select('polar_subscription_id')
      .eq('user_id', user.id)
      .single();
    const subId = usage?.polar_subscription_id;
    if (!subId) return res.status(400).json({ error: 'Aktif abonelik bulunamadı.' });

    await fetch(`${POLAR_API}/v1/subscriptions/${subId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cancel_at_period_end: false }),
    });

    await sb.from('user_usage').update({
      cancel_at_period_end: false,
      cancel_period_end: null,
    }).eq('user_id', user.id);

    res.json({ success: true });
  } catch (e) {
    console.error('[billing/uncancel-subscription] hata:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
module.exports.cancelSubscriptionInternal = cancelSubscriptionInternal;
