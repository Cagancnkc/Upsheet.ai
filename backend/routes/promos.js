'use strict';
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const PROMO_CODES = {
  'MOCK100': {
    description: '1 ay Claude Pro ücretsiz',
    type: 'claude_pro_1month',
    max_uses: 100,
    reward: 'pro_1month'
  }
};

// Promo kodu doğrula (giriş gerektirmez)
router.post('/validate', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Kod gerekli' });

  const promo = PROMO_CODES[code.toUpperCase()];
  if (!promo) {
    return res.status(404).json({ valid: false, error: 'Geçersiz kod' });
  }

  try {
    const { count } = await supabase
      .from('promo_uses')
      .select('*', { count: 'exact', head: true })
      .eq('code', code.toUpperCase());

    if (count >= promo.max_uses) {
      return res.status(410).json({ valid: false, error: 'Bu promosyon kodu doldu' });
    }

    res.json({ valid: true, description: promo.description, remaining: promo.max_uses - (count || 0) });
  } catch {
    res.json({ valid: true, description: promo.description });
  }
});

// Promo kodu kullan (giriş gerektirir)
router.post('/redeem', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Giriş gerekli' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Geçersiz token' });

    const { code } = req.body;
    const promo = PROMO_CODES[code?.toUpperCase()];
    if (!promo) return res.status(404).json({ error: 'Geçersiz kod' });

    const { data: existing } = await supabase
      .from('promo_uses')
      .select('id')
      .eq('user_id', user.id)
      .eq('code', code.toUpperCase())
      .single();

    if (existing) {
      return res.status(409).json({ error: 'Bu kodu daha önce kullandınız' });
    }

    const { error: insertError } = await supabase.from('promo_uses').insert({
      user_id: user.id,
      code: code.toUpperCase(),
      reward: promo.reward,
      used_at: new Date().toISOString()
    });

    if (insertError) {
      console.error('[promos/redeem] insert error:', insertError.message);
      return res.status(500).json({ error: 'Kod aktive edilemedi, lütfen tekrar deneyin' });
    }

    const planEnd = new Date();
    planEnd.setMonth(planEnd.getMonth() + 1);

    const { error: upsertError } = await supabase.from('user_usage').upsert({
      user_id: user.id,
      plan: 'pro',
      subscription_status: 'active',
      plan_started_at: new Date().toISOString(),
      plan_ends_at: planEnd.toISOString(),
      subscription_period: 'promo'
    }, { onConflict: 'user_id' });

    if (upsertError) {
      console.error('[promos/redeem] upsert error:', upsertError.message);
      return res.status(500).json({ error: 'Plan güncellenemedi, lütfen destek ile iletişime geçin' });
    }

    res.json({
      success: true,
      message: '🎉 1 ay Claude Pro hediyeniz aktive edildi!',
      plan_ends_at: planEnd.toISOString()
    });
  } catch (err) {
    console.error('[promos/redeem] unexpected error:', err.message);
    res.status(500).json({ error: 'Beklenmeyen hata oluştu' });
  }
});

module.exports = router;
