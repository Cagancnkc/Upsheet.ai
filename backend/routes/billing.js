'use strict';
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { getPolar } = require('../services/polar');
const { validateEvent, WebhookVerificationError } = require('@polar-sh/sdk/webhooks');

function getSb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
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
    res.status(401).json({ error: 'Geçersiz oturum.' });
    return null;
  }
  return user;
}

const POLAR_PRODUCT_IDS = {
  pro:         { monthly: process.env.POLAR_PRODUCT_ID_PRO_MONTHLY,  yearly: process.env.POLAR_PRODUCT_ID_PRO_YEARLY  },
  ultra:       { monthly: process.env.POLAR_PRODUCT_ID_ULTRA_MONTHLY, yearly: process.env.POLAR_PRODUCT_ID_ULTRA_YEARLY },
};

// POST /api/billing/checkout
router.post('/checkout', async (req, res) => {
  try {
    const user = await authenticate(req, res);
    if (!user) return;

    const { plan, period } = req.body;
    const safePeriod = (period === 'yearly') ? 'yearly' : 'monthly';
    const productId = POLAR_PRODUCT_IDS[plan]?.[safePeriod];

    if (!productId) {
      return res.status(400).json({ error: 'Geçersiz plan veya ürün ID tanımlı değil' });
    }

    const checkout = await getPolar().checkouts.create({
      products: [{ productId }],
      customerEmail: user.email,
      successUrl: 'https://www.mocksheets.com/app?polar_checkout=success',
      metadata: {
        mocksheets_user_id: user.id,
        plan,
        period: safePeriod,
      },
    });

    res.json({ checkoutUrl: checkout.url });
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

module.exports = router;
