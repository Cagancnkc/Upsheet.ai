'use strict';
const { createClient } = require('@supabase/supabase-js');

function getSb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

async function createNotification(userId, title, body, type, sb) {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const { count } = await sb.from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', todayStart.toISOString());
  if ((count || 0) >= 5) return;
  await sb.from('notifications').insert({ user_id: userId, title, body, type });
}

module.exports = { createNotification, getSb };
