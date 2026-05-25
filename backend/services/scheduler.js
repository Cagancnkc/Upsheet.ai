'use strict';
const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');

let _sb = null;
function getSb() {
  if (!_sb) _sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  return _sb;
}

// ruleId → cron.Task
const activeCrons = new Map();

// Map human-readable schedule names to cron expressions
function toCronExpr(scheduleConfig) {
  if (!scheduleConfig) return null;

  const { cronExpr, frequency, time } = scheduleConfig;
  if (cronExpr && cron.validate(cronExpr)) return cronExpr;

  const [hour = '9', minute = '0'] = (time || '09:00').split(':').map(s => s.trim());

  switch (frequency) {
    case 'every_5m':    return '*/5 * * * *';
    case 'every_15m':   return '*/15 * * * *';
    case 'every_hour':  return `${minute} * * * *`;
    case 'every_day':   return `${minute} ${hour} * * *`;
    case 'every_week':  return `${minute} ${hour} * * 1`;
    case 'every_month': return `${minute} ${hour} 1 * *`;
    default: return null;
  }
}

async function runRuleServerSide(rule) {
  const sb = getSb();
  const startedAt = Date.now();

  try {
    // Try to fetch sheet data from Google Sheets if sheetId is configured
    let sheetData = [];
    const sheetId = rule.trigger_config?.sheetId;
    if (sheetId && rule.user_id) {
      try {
        const { getValidAccessToken } = require('./tokenManager');
        const accessToken = await getValidAccessToken(rule.user_id, 'google-sheets');
        if (accessToken) {
          const { google } = require('googleapis');
          const auth = new google.auth.OAuth2();
          auth.setCredentials({ access_token: accessToken });
          const sheets = google.sheets({ version: 'v4', auth });
          const resp = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'A1:Z1000' });
          sheetData = resp.data.values || [];
        }
      } catch (e) {
        console.error(`[scheduler] Sheet fetch failed for rule ${rule.id}:`, e.message);
      }
    }

    // Import evaluation logic inline (mirrors js/automations.js logic)
    const headers = sheetData[0] || [];
    const rows = sheetData.slice(1);
    const rowObjs = rows.map(r => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = r[i] ?? ''; });
      return obj;
    });

    const check = (rowObj, cond) => {
      const val = rowObj[cond.column];
      const num = parseFloat(val);
      const condNum = parseFloat(cond.value);
      switch (cond.operator) {
        case 'less_than':     return !isNaN(num) && num < condNum;
        case 'greater_than':  return !isNaN(num) && num > condNum;
        case 'equals':        return String(val).toLowerCase() === String(cond.value).toLowerCase();
        case 'not_equals':    return String(val).toLowerCase() !== String(cond.value).toLowerCase();
        case 'contains':      return String(val).toLowerCase().includes(String(cond.value).toLowerCase());
        case 'is_empty':      return val == null || val === '';
        case 'date_passed':   return val && new Date(val) < new Date();
        case 'date_is_today': return val && new Date(val).toDateString() === new Date().toDateString();
        default: return false;
      }
    };

    let matched = rowObjs;
    const tc = rule.trigger_config;
    if (tc?.column && tc?.operator) {
      matched = matched.filter(row => check(row, tc));
    }
    if (Array.isArray(rule.condition_config) && rule.condition_config.length > 0) {
      matched = matched.filter(row => rule.condition_config.every(c => check(row, c)));
    }

    // Execute actions
    const actions = Array.isArray(rule.action_config) ? rule.action_config : [rule.action_config];
    const actionResults = [];
    let overallStatus = 'success';

    const base = process.env.BACKEND_URL || 'http://localhost:3001';

    for (const action of actions) {
      const row = matched[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);

      try {
        let result = null;
        if (action.type === 'notification') {
          result = { message: interpolate(action.message || 'Otomasyon tetiklendi') };
          actionResults.push({ type: action.type, status: 'success', result });
        } else {
          actionResults.push({ type: action.type, status: 'skipped', result: { reason: 'Server-side execution limited to notification type for schedule triggers' } });
        }
      } catch (e) {
        overallStatus = 'error';
        actionResults.push({ type: action.type, status: 'error', error: e.message });
      }
    }

    const durationMs = Date.now() - startedAt;

    await sb.from('workflow_runs').insert({
      rule_id: rule.id,
      user_id: rule.user_id,
      status: overallStatus,
      triggered_by: 'schedule',
      trigger_data: { matched_rows: matched.length, sheet_id: sheetId },
      action_results: actionResults,
      duration_ms: durationMs,
      completed_at: new Date().toISOString(),
    });

    await sb.from('automation_rules')
      .update({ last_fired: new Date().toISOString(), run_count: (rule.run_count || 0) + 1 })
      .eq('id', rule.id);

    console.log(`[scheduler] Rule "${rule.name}" fired — ${matched.length} rows matched, status: ${overallStatus}`);
  } catch (err) {
    console.error(`[scheduler] Rule ${rule.id} execution error:`, err.message);
    await sb.from('workflow_runs').insert({
      rule_id: rule.id,
      user_id: rule.user_id,
      status: 'error',
      triggered_by: 'schedule',
      error_message: err.message,
      duration_ms: Date.now() - startedAt,
      completed_at: new Date().toISOString(),
    });
  }
}

function scheduleRule(rule) {
  const expr = toCronExpr(rule.trigger_config);
  if (!expr) {
    console.warn(`[scheduler] Rule ${rule.id} has invalid schedule config, skipping`);
    return;
  }

  if (activeCrons.has(rule.id)) {
    activeCrons.get(rule.id).destroy();
  }

  const task = cron.schedule(expr, () => runRuleServerSide(rule), { timezone: 'Europe/Istanbul' });
  activeCrons.set(rule.id, task);
  console.log(`[scheduler] Scheduled rule "${rule.name}" (${rule.id}) with cron: ${expr}`);
}

function unschedule(ruleId) {
  const task = activeCrons.get(ruleId);
  if (task) {
    task.destroy();
    activeCrons.delete(ruleId);
    console.log(`[scheduler] Unscheduled rule ${ruleId}`);
  }
}

async function loadAndScheduleAll() {
  const sb = getSb();
  const { data, error } = await sb
    .from('automation_rules')
    .select('*')
    .eq('enabled', true)
    .eq('trigger_config->>type', 'schedule');

  if (error) {
    console.error('[scheduler] Failed to load scheduled rules:', error.message);
    return;
  }

  const rules = data || [];
  console.log(`[scheduler] Loading ${rules.length} scheduled rule(s)`);
  for (const rule of rules) {
    scheduleRule(rule);
  }
}

module.exports = { loadAndScheduleAll, scheduleRule, unschedule };
