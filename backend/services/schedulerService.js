'use strict';
const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');
const { runAgentWithMemory } = require('./agentService');

let _sb = null;
function getSupabase() {
  if (!_sb) _sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  return _sb;
}

// scheduleId → cron.Task
const activeAgentCrons = new Map();

function scheduleOne(schedule) {
  if (!cron.validate(schedule.cron_expr)) {
    console.warn(`[agentScheduler] Invalid cron "${schedule.cron_expr}" for schedule ${schedule.id}`);
    return;
  }

  if (activeAgentCrons.has(schedule.id)) {
    activeAgentCrons.get(schedule.id).destroy();
  }

  const task = cron.schedule(schedule.cron_expr, async () => {
    const sb = getSupabase();
    try {
      const { data: run, error } = await sb
        .from('agent_runs')
        .insert({
          user_id: schedule.user_id,
          title: `[Otomatik] ${schedule.label || schedule.prompt.slice(0, 60)}`,
          prompt: schedule.prompt,
          status: 'pending',
          steps: [],
        })
        .select('id')
        .single();

      if (error || !run) {
        console.error(`[agentScheduler] Run insert failed for schedule ${schedule.id}:`, error?.message);
        return;
      }

      await runAgentWithMemory(run.id, schedule.user_id, schedule.prompt, schedule.context || {});

      await sb
        .from('agent_schedules')
        .update({ last_run: new Date().toISOString() })
        .eq('id', schedule.id);
    } catch (e) {
      console.error(`[agentScheduler] Schedule ${schedule.id} execution error:`, e.message);
    }
  }, { timezone: 'Europe/Istanbul' });

  activeAgentCrons.set(schedule.id, task);
  console.log(`[agentScheduler] Scheduled agent "${schedule.label || schedule.id}" with cron: ${schedule.cron_expr}`);
}

function unscheduleOne(scheduleId) {
  const task = activeAgentCrons.get(scheduleId);
  if (task) {
    task.destroy();
    activeAgentCrons.delete(scheduleId);
  }
}

async function loadAndScheduleAll() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('agent_schedules')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('[agentScheduler] Failed to load schedules:', error.message);
    return;
  }

  const schedules = data || [];
  console.log(`[agentScheduler] Loading ${schedules.length} agent schedule(s)`);
  for (const s of schedules) {
    scheduleOne(s);
  }
}

module.exports = { loadAndScheduleAll, scheduleOne, unscheduleOne };
