'use strict';
const { createClient } = require('@supabase/supabase-js');

function getSb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

async function runStillFree3d() {
  const sb = getSb();
  const cutoff = new Date(Date.now() - 3 * 86400000).toISOString();
  const { data: rows } = await sb.from('user_usage')
    .select('user_id')
    .eq('plan', 'free')
    .lte('created_at', cutoff)
    .eq('still_free_3d_sent', false);

  const { sendScenarioEmail } = require('../services/brevo');
  for (const row of rows || []) {
    try {
      const { data: { user } } = await sb.auth.admin.getUserById(row.user_id);
      if (user?.email) {
        const fn = user.user_metadata?.full_name || user.email.split('@')[0];
        await sendScenarioEmail(user.email, 'still_free_after_3_days');
        await sb.from('user_usage').update({ still_free_3d_sent: true }).eq('user_id', row.user_id);
      }
    } catch (e) { console.error('[emailTriggers] still_free_3d:', e.message); }
  }
}

async function runWinback7d() {
  const sb = getSb();
  const from = new Date(Date.now() - 8 * 86400000).toISOString();
  const to = new Date(Date.now() - 7 * 86400000).toISOString();
  const { data: rows } = await sb.from('user_usage')
    .select('user_id')
    .gte('cancelled_at', from)
    .lte('cancelled_at', to)
    .eq('winback_7d_sent', false);

  const { sendScenarioEmail } = require('../services/brevo');
  for (const row of rows || []) {
    try {
      const { data: { user } } = await sb.auth.admin.getUserById(row.user_id);
      if (user?.email) {
        const fn = user.user_metadata?.full_name || user.email.split('@')[0];
        await sendScenarioEmail(user.email, 'winback_offer_7d');
        await sb.from('user_usage').update({ winback_7d_sent: true }).eq('user_id', row.user_id);
      }
    } catch (e) { console.error('[emailTriggers] winback_7d:', e.message); }
  }
}

async function runWinback30d() {
  const sb = getSb();
  const from = new Date(Date.now() - 31 * 86400000).toISOString();
  const to = new Date(Date.now() - 30 * 86400000).toISOString();
  const { data: rows } = await sb.from('user_usage')
    .select('user_id')
    .gte('cancelled_at', from)
    .lte('cancelled_at', to)
    .eq('winback_30d_sent', false);

  const { sendScenarioEmail } = require('../services/brevo');
  for (const row of rows || []) {
    try {
      const { data: { user } } = await sb.auth.admin.getUserById(row.user_id);
      if (user?.email) {
        const fn = user.user_metadata?.full_name || user.email.split('@')[0];
        await sendScenarioEmail(user.email, 'winback_offer_30d');
        await sb.from('user_usage').update({ winback_30d_sent: true }).eq('user_id', row.user_id);
      }
    } catch (e) { console.error('[emailTriggers] winback_30d:', e.message); }
  }
}

async function runInactive14d() {
  const sb = getSb();
  const cutoff = new Date(Date.now() - 14 * 86400000).toISOString();
  const { data: rows } = await sb.from('user_usage')
    .select('user_id')
    .lt('last_active_at', cutoff)
    .eq('inactive_14d_sent', false);

  const { sendScenarioEmail } = require('../services/brevo');
  for (const row of rows || []) {
    try {
      const { data: { user } } = await sb.auth.admin.getUserById(row.user_id);
      if (user?.email) {
        const fn = user.user_metadata?.full_name || user.email.split('@')[0];
        await sendScenarioEmail(user.email, 'user_inactive_14d');
        await sb.from('user_usage').update({ inactive_14d_sent: true }).eq('user_id', row.user_id);
      }
    } catch (e) { console.error('[emailTriggers] inactive_14d:', e.message); }
  }
}

async function runInactive30d() {
  const sb = getSb();
  const cutoff = new Date(Date.now() - 30 * 86400000).toISOString();
  const { data: rows } = await sb.from('user_usage')
    .select('user_id')
    .lt('last_active_at', cutoff)
    .eq('inactive_30d_sent', false);

  const { sendScenarioEmail } = require('../services/brevo');
  for (const row of rows || []) {
    try {
      const { data: { user } } = await sb.auth.admin.getUserById(row.user_id);
      if (user?.email) {
        const fn = user.user_metadata?.full_name || user.email.split('@')[0];
        await sendScenarioEmail(user.email, 'user_inactive_30d');
        await sb.from('user_usage').update({ inactive_30d_sent: true }).eq('user_id', row.user_id);
      }
    } catch (e) { console.error('[emailTriggers] inactive_30d:', e.message); }
  }
}

module.exports = { runStillFree3d, runWinback7d, runWinback30d, runInactive14d, runInactive30d };
