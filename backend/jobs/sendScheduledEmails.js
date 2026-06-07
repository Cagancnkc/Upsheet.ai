'use strict';
const { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

async function runSendScheduledEmails() {
  const supabase = getSupabase();
  const { data: pending, error } = await supabase
    .from('email_queue')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduled_at', new Date().toISOString())
    .limit(50);

  if (error) { console.error('[email-job] fetch error:', error.message); return; }
  if (!pending || pending.length === 0) return;

  // Mail gönderimi henüz yapılandırılmadı — Loops entegrasyonu eklenecek
  for (const item of pending) {
    console.log('[email-job] pending (skipped, no mailer configured):', item.email, item.template_id);
  }
}

module.exports = { runSendScheduledEmails };
