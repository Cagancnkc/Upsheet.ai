'use strict';
const nodemailer = require('nodemailer');

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, subject, message } = req.body || {};

  if (!name || name.trim().length < 2)
    return res.status(400).json({ error: 'Ad en az 2 karakter olmalıdır.' });
  if (!email || !emailRe.test(email))
    return res.status(400).json({ error: 'Geçerli bir e-posta adresi girin.' });
  if (!message || message.trim().length < 10)
    return res.status(400).json({ error: 'Mesaj en az 10 karakter olmalıdır.' });

  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.error('[contact] MAIL_USER veya MAIL_PASS env eksik');
    return res.status(500).json({
      error: 'Sunucu yapılandırma hatası. helpmocksheets@gmail.com adresine yazın.'
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: 'helpmocksheets@gmail.com',
      replyTo: email,
      subject: `[Mocksheets İletişim] ${subject || 'Mesaj'} — ${name.trim()}`,
      html: `
        <h3>Yeni iletişim mesajı</h3>
        <p><strong>İsim:</strong> ${name.trim()}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Konu:</strong> ${subject || '-'}</p>
        <p><strong>Mesaj:</strong></p>
        <p style="white-space:pre-wrap;background:#f9fafb;padding:12px;border-radius:6px">${message.trim()}</p>
        <hr>
        <small>${new Date().toLocaleString('tr-TR')}</small>
      `
    });

    await transporter.sendMail({
      from: `"Mocksheets" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Mesajınızı aldık — Mocksheets',
      html: `
        <p>Merhaba ${name.trim()},</p>
        <p>Mesajınız bize ulaştı. En kısa sürede dönüş yapacağız.</p>
        <br>
        <p>— Mocksheets Ekibi</p>
        <p><a href="https://mocksheets.com">mocksheets.com</a></p>
      `
    });
  } catch (mailErr) {
    console.error('[contact] Mail hatası:', mailErr.message);
    return res.status(500).json({
      error: 'Mesaj gönderilemedi. helpmocksheets@gmail.com adresine yazın.'
    });
  }

  return res.status(200).json({ success: true, message: 'Mesajınız iletildi.' });
};
