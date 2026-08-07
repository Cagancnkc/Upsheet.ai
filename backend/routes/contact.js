'use strict';
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
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

function escHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
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

  // Supabase'e kaydet
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

  // Email bildirimleri gönder (MAIL_USER/MAIL_PASS yoksa sessizce geç)
  if (process.env.MAIL_USER && process.env.MAIL_PASS) {
    try {
      const transporter = getTransporter();

      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: 'cagncnkc@gmail.com',
        replyTo: email,
        subject: `[Mocksheets İletişim] ${subject || 'Mesaj'} — ${name.trim()}`,
        html: `
          <h3>Yeni iletişim mesajı</h3>
          <p><strong>İsim:</strong> ${escHtml(name.trim())}</p>
          <p><strong>E-posta:</strong> ${escHtml(email)}</p>
          <p><strong>Konu:</strong> ${escHtml(subject || '-')}</p>
          <p><strong>Mesaj:</strong></p>
          <p style="white-space:pre-wrap;background:#f9fafb;padding:12px;border-radius:6px">${escHtml(message.trim())}</p>
          <hr>
          <small>${new Date().toLocaleString('tr-TR')}</small>
        `
      });

      await transporter.sendMail({
        from: `"Mocksheets" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Mesajınızı aldık — Mocksheets',
        html: `
          <p>Merhaba ${escHtml(name.trim())},</p>
          <p>Mesajınız bize ulaştı. En kısa sürede dönüş yapacağız.</p>
          <br>
          <p>— Mocksheets Ekibi</p>
          <p><a href="https://mocksheets.com">mocksheets.com</a></p>
        `
      });
    } catch (mailErr) {
      console.error('[contact] Mail gönderme hatası:', mailErr.message);
    }
  }

  res.json({ success: true, message: 'Mesajınız iletildi.' });
});

module.exports = router;
