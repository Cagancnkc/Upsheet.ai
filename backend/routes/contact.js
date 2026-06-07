'use strict';
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Çok fazla istek gönderildi. Lütfen 5 dakika sonra tekrar deneyin.' }
});

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
}

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

  if (process.env.MAIL_USER && process.env.MAIL_PASS) {
    try {
      const transporter = getTransporter();
      const subjectLabel = subject ? `[${subject.toUpperCase()}] ` : '';

      await transporter.sendMail({
        from: `"Mocksheets İletişim" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_USER,
        subject: `${subjectLabel}${name} — Mocksheets İletişim Formu`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#16a34a">Yeni İletişim Formu Mesajı</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px;font-weight:bold;width:100px">Ad:</td><td style="padding:8px">${name}</td></tr>
              <tr><td style="padding:8px;font-weight:bold">E-posta:</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:8px;font-weight:bold">Konu:</td><td style="padding:8px">${subject || '—'}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;vertical-align:top">Mesaj:</td><td style="padding:8px;white-space:pre-wrap">${message}</td></tr>
              <tr><td style="padding:8px;font-weight:bold">Tarih:</td><td style="padding:8px">${new Date().toLocaleString('tr-TR')}</td></tr>
            </table>
          </div>
        `
      });

      await transporter.sendMail({
        from: `"Mocksheets Destek" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Mesajınızı aldık — Mocksheets',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#16a34a">Merhaba ${name},</h2>
            <p>Mesajınız bize ulaştı. En kısa sürede size dönüş yapacağız.</p>
            <p style="color:#6B7280;font-size:13px">Destek: <a href="mailto:helpmocksheets@gmail.com">helpmocksheets@gmail.com</a></p>
            <hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0">
            <p style="font-size:11px;color:#9CA3AF">
              Bu maili siz talep ettiniz. Yanıtlamak istemiyorsanız görmezden gelebilirsiniz.<br>
              <a href="https://mocksheets.com" style="color:#9CA3AF">mocksheets.com</a>
            </p>
          </div>
        `
      });
    } catch (mailErr) {
      console.error('[contact] Mail send failed:', mailErr.message);
    }
  }

  res.json({ success: true, message: 'Mesajınız iletildi.' });
});

module.exports = router;
