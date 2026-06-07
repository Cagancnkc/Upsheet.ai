'use strict';
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });
}

const SUBJECTS = {
  welcome:       'Mocksheets\'e Hoş Geldiniz! 🎉',
  first_command: 'İlk komutunuzu denediniz mi? — Mocksheets',
  pdf_feature:   'PDF\'den tablo çıkarma özelliğini biliyor muydunuz? — Mocksheets',
  case_study:    'Gerçek bir kullanıcı hikayesi — Mocksheets',
  pro_upgrade:   'Pro\'ya geçmek ister misiniz? — Mocksheets'
};

function loadTemplate(templateId, vars) {
  const tmplPath = path.join(__dirname, '../../templates/emails', templateId + '.html');
  let html = fs.existsSync(tmplPath)
    ? fs.readFileSync(tmplPath, 'utf8')
    : `<p>Merhaba ${vars.name || ''},</p><p>Mocksheets ekibinden selamlar!</p>`;
  Object.entries(vars).forEach(([k, v]) => {
    html = html.replaceAll(`{{${k}}}`, v);
  });
  return html;
}

async function runSendScheduledEmails() {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) return;

  const supabase = getSupabase();
  const { data: pending, error } = await supabase
    .from('email_queue')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduled_at', new Date().toISOString())
    .limit(50);

  if (error) { console.error('[email-job] fetch error:', error.message); return; }
  if (!pending || pending.length === 0) return;

  const transporter = getTransporter();

  for (const item of pending) {
    try {
      const html = loadTemplate(item.template_id, { name: item.email.split('@')[0] });
      await transporter.sendMail({
        from: `"Mocksheets" <${process.env.MAIL_USER}>`,
        to: item.email,
        subject: SUBJECTS[item.template_id] || 'Mocksheets',
        html
      });
      await supabase
        .from('email_queue')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', item.id);
    } catch (err) {
      console.error('[email-job] send failed for', item.email, ':', err.message);
      await supabase
        .from('email_queue')
        .update({ status: 'error' })
        .eq('id', item.id);
    }
  }
}

module.exports = { runSendScheduledEmails };
