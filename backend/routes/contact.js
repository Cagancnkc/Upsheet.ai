'use strict';
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Çok fazla istek gönderildi. Lütfen 5 dakika sonra tekrar deneyin.' }
});

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

router.post('/', limiter, async (req, res) => {
  const { name, email, subject, message } = req.body;
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;

  if (!name || name.trim().length < 2)
    return res.status(400).json({ error: 'Ad en az 2 karakter olmalıdır.' });

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRe.test(email))
    return res.status(400).json({ error: 'Geçerli bir e-posta adresi girin.' });

  if (!message || message.trim().length < 10)
    return res.status(400).json({ error: 'Mesaj en az 10 karakter olmalıdır.' });

  try {
    const supabase = getSupabase();
    await supabase.from('contact_submissions').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject || null,
      message: message.trim(),
      ip_address: ip
    });
  } catch (dbErr) {
    console.error('[contact] DB insert failed:', dbErr.message);
  }

  res.json({ success: true, message: 'Mesajınız iletildi.' });
});

module.exports = router;
