'use strict';
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');
const fetch = require('node-fetch');

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Giriş gerekli' });

  const sb = getSupabase();
  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Geçersiz token' });

  req.user = user;
  req.supabase = sb;
  req.authToken = token;
  next();
}

// Execute a single action against the backend integrations API
// userId is only needed when authToken is the service key (scheduler context)
async function executeAction(action, matchedRows, authToken, backendUrl, userId) {
  const base = backendUrl || process.env.BACKEND_URL || 'http://localhost:3001';
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` };
  if (userId) headers['x-user-id'] = userId;
  const type = action.type;

  try {
    if (type === 'gmail') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/gmail/send`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          to: interpolate(action.to),
          subject: interpolate(action.subject),
          body: interpolate(action.body || action.message || ''),
        }),
      });
      const data = await resp.json();
      return { type, status: resp.ok ? 'success' : 'error', result: data };
    }

    if (type === 'slack') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const cfg = action.webhookUrl
        ? { webhookUrl: action.webhookUrl, title: interpolate(action.subject || action.title || 'Otomasyon'), message: interpolate(action.body || action.message || '') }
        : null;
      if (!cfg) return { type, status: 'skipped', result: { reason: 'No webhook URL' } };
      const resp = await fetch(`${base}/api/integrations/slack/notify`, { method: 'POST', headers, body: JSON.stringify(cfg) });
      const data = await resp.json();
      return { type, status: resp.ok ? 'success' : 'error', result: data };
    }

    if (type === 'webhook') {
      const row = matchedRows[0] || {};
      const resp = await fetch(`${base}/api/integrations/webhook/send`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ url: action.url, secret: action.secret, event: action.event || 'automation.triggered', data: { rows: matchedRows, ...row } }),
      });
      const data = await resp.json();
      return { type, status: resp.ok ? 'success' : 'error', result: data };
    }

    if (type === 'make') {
      const resp = await fetch(`${base}/api/integrations/make/trigger`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ webhookUrl: action.webhookUrl, event: action.event || 'automation', data: { rows: matchedRows } }),
      });
      const data = await resp.json();
      return { type, status: resp.ok ? 'success' : 'error', result: data };
    }

    if (type === 'notion' || type === 'notion_page') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/notion/export`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          dbId: action.dbId,
          headers: Object.keys(row),
          data: matchedRows,
          pageTitle: interpolate(action.title || 'Otomasyon Kaydı'),
        }),
      });
      const data = await resp.json();
      return { type, status: resp.ok ? 'success' : 'error', result: data };
    }

    if (type === 'notification') {
      return { type, status: 'success', result: { message: action.message || 'Otomasyon tetiklendi', rows: matchedRows.length } };
    }

    return { type, status: 'skipped', result: { reason: `Unknown action type: ${type}` } };
  } catch (err) {
    return { type, status: 'error', error: err.message };
  }
}

// Evaluate condition_config against sheet data, return matching rows
function evaluateConditions(sheetData, triggerConfig, conditionConfig) {
  if (!sheetData || sheetData.length < 2) return [];
  const [headers, ...rows] = sheetData;

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
      case 'is_not_empty':  return val != null && val !== '';
      case 'date_passed':   return val && new Date(val) < new Date();
      case 'date_is_today': {
        const today = new Date().toDateString();
        return val && new Date(val).toDateString() === today;
      }
      default: return false;
    }
  };

  const rowObjs = rows.map(r => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = r[i] ?? ''; });
    return obj;
  });

  // Filter by trigger condition first
  let matched = rowObjs;
  if (triggerConfig?.column && triggerConfig?.operator) {
    matched = matched.filter(row => check(row, triggerConfig));
  }

  // Apply extra conditions (AND logic by default)
  if (Array.isArray(conditionConfig) && conditionConfig.length > 0) {
    matched = matched.filter(row => conditionConfig.every(cond => check(row, cond)));
  }

  return matched;
}

// Log a run to workflow_runs table
async function logRun(sb, { ruleId, userId, status, triggeredBy, triggerData, actionResults, errorMessage, durationMs }) {
  await sb.from('workflow_runs').insert({
    rule_id: ruleId,
    user_id: userId,
    status,
    triggered_by: triggeredBy,
    trigger_data: triggerData || null,
    action_results: actionResults || null,
    error_message: errorMessage || null,
    duration_ms: durationMs,
    completed_at: new Date().toISOString(),
  });
}

// ── GET /api/automations ─────────────────────────────────────────────────────
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase
    .from('automation_rules')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ rules: data || [] });
});

// ── POST /api/automations ────────────────────────────────────────────────────
router.post('/', requireAuth, async (req, res) => {
  const { name, integration, trigger_config, condition_config, action_config, throttle_seconds, enabled, description, template_id } = req.body;

  if (!name || !trigger_config || !action_config) {
    return res.status(400).json({ error: 'name, trigger_config, action_config zorunludur' });
  }

  const { data, error } = await req.supabase
    .from('automation_rules')
    .insert({
      user_id: req.user.id,
      name,
      description: description || null,
      integration: integration || 'webhook',
      trigger_config,
      condition_config: condition_config || [],
      action_config: Array.isArray(action_config) ? action_config : [action_config],
      throttle_seconds: throttle_seconds ?? 3600,
      enabled: enabled !== false,
      template_id: template_id || null,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Register schedule if applicable
  try {
    if (data.trigger_config?.type === 'schedule' && data.enabled) {
      const scheduler = require('../services/scheduler');
      scheduler.scheduleRule(data);
    }
  } catch (err) { console.warn('[automations] Scheduler register failed:', err.message); }

  res.json({ rule: data });
});

// ── PUT /api/automations/:id ─────────────────────────────────────────────────
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const updates = {};
  const allowed = ['name', 'enabled', 'integration', 'trigger_config', 'condition_config', 'action_config', 'throttle_seconds', 'description', 'template_id'];
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  if (!Object.keys(updates).length) {
    return res.status(400).json({ error: 'Güncellenecek alan yok' });
  }
  updates.updated_at = new Date().toISOString();

  const { data, error } = await req.supabase
    .from('automation_rules')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Kural bulunamadı' });

  // Update scheduler
  try {
    const scheduler = require('../services/scheduler');
    scheduler.unschedule(id);
    if (data.trigger_config?.type === 'schedule' && data.enabled) {
      scheduler.scheduleRule(data);
    }
  } catch (err) { console.warn('[automations] Scheduler update failed:', err.message); }

  res.json({ rule: data });
});

// ── DELETE /api/automations/:id ──────────────────────────────────────────────
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  const { error } = await req.supabase
    .from('automation_rules')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });

  try { require('../services/scheduler').unschedule(id); } catch (err) { console.warn('[automations] Scheduler unschedule failed:', err.message); }

  res.json({ success: true });
});

// ── POST /api/automations/suggest ────────────────────────────────────────────
router.post('/suggest', requireAuth, async (req, res) => {
  const { headers, integration } = req.body;

  if (!headers || !Array.isArray(headers) || !headers.length) {
    return res.status(400).json({ error: 'headers array gerekli' });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `Bir Türk kullanıcı "${integration || 'Make'}" entegrasyonu kuruyor.
Tablolarındaki sütun başlıkları: ${headers.filter(Boolean).join(', ')}

Bu başlıklara göre:
1. Kullanıcının hangi iş türünde olduğunu tespit et (stok, spor salonu, muhasebe, personel, satış, proje, diğer)
2. Bu entegrasyon için maksimum 3 adet somut otomasyon kuralı öner

Sadece şu JSON formatında yanıt ver:
{
  "business_type": "stok",
  "business_label": "Stok Yönetimi",
  "suggestions": [
    {
      "name": "Kural adı (Türkçe, 50 char max)",
      "description": "Ne yapar (1 cümle)",
      "trigger_config": {
        "type": "cell_condition",
        "column": "tam sütun adı",
        "operator": "less_than|greater_than|equals|not_equals|contains|is_empty|date_is_today|date_passed|changed",
        "value": "eşik değeri veya boş string"
      },
      "action_config": [
        {
          "type": "gmail|slack|webhook|make|notification|notion_page",
          "subject": "Mesaj başlığı, {SütunAdı} kullanılabilir",
          "body": "Mesaj içeriği"
        }
      ],
      "throttle_seconds": 3600
    }
  ]
}`;

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    });

    const raw = response.content[0].text.trim();
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: 'AI yanıtı parse edilemedi' });

    let result;
    try { result = JSON.parse(match[0]); }
    catch { return res.status(500).json({ error: 'AI yanıtı geçersiz JSON döndürdü' }); }
    res.json(result);
  } catch (e) {
    console.error('/api/automations/suggest hatası:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ── POST /api/automations/generate — NL → Workflow ───────────────────────────
router.post('/generate', requireAuth, async (req, res) => {
  const { query } = req.body;
  if (!query || !query.trim()) return res.status(400).json({ error: 'query zorunludur' });

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `Sen bir otomasyon sistemi tasarımcısısın. Kullanıcının Türkçe isteğini yapılandırılmış bir iş akışına dönüştür.

Kullanıcı isteği: "${query.trim()}"

Geçerli trigger tipleri: cell_condition, schedule, threshold, date_arrived, row_added, value_changed
Geçerli action tipleri: gmail, slack, webhook, make, notification, notion_page, sheets_update

Yalnızca şu JSON formatında yanıt ver (başka hiçbir şey yazma):
{
  "name": "Otomasyon adı (Türkçe, kısa)",
  "description": "Ne yapar (1 cümle)",
  "trigger_config": {
    "type": "cell_condition",
    "column": "Sütun Adı",
    "operator": "less_than",
    "value": "20"
  },
  "condition_config": [],
  "action_config": [
    {
      "type": "gmail",
      "to": "ornek@email.com",
      "subject": "Uyarı: {Sütun Adı} düştü",
      "body": "Merhaba,\\n{Sütun Adı} değeri {Değer} seviyesine düştü."
    }
  ]
}`;

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }]
    });

    const raw = response.content[0].text.trim();
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: 'AI yanıtı parse edilemedi' });

    let workflow;
    try { workflow = JSON.parse(match[0]); }
    catch { return res.status(500).json({ error: 'AI yanıtı geçersiz JSON döndürdü' }); }
    res.json({ workflow });
  } catch (e) {
    console.error('/api/automations/generate hatası:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ── GET /api/automations/runs — Run history ───────────────────────────────────
router.get('/runs', requireAuth, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = parseInt(req.query.offset) || 0;
  const ruleId = req.query.rule_id;

  let q = req.supabase
    .from('workflow_runs')
    .select(`
      id, rule_id, status, triggered_by, action_results, error_message, duration_ms, started_at, completed_at,
      automation_rules(name)
    `)
    .eq('user_id', req.user.id)
    .order('started_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (ruleId) q = q.eq('rule_id', ruleId);

  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ runs: data || [] });
});

// ── POST /api/automations/:id/run — Manual trigger ────────────────────────────
router.post('/:id/run', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { sheet_data } = req.body;
  const startedAt = Date.now();

  const { data: rule, error: ruleErr } = await req.supabase
    .from('automation_rules')
    .select('*')
    .eq('id', id)
    .eq('user_id', req.user.id)
    .single();

  if (ruleErr || !rule) return res.status(404).json({ error: 'Kural bulunamadı' });

  const matchedRows = sheet_data ? evaluateConditions(sheet_data, rule.trigger_config, rule.condition_config) : [];
  const actions = Array.isArray(rule.action_config) ? rule.action_config : [rule.action_config];

  const actionResults = [];
  let overallStatus = 'success';

  for (const action of actions) {
    const result = await executeAction(action, matchedRows, req.authToken);
    actionResults.push(result);
    if (result.status === 'error') overallStatus = 'error';
  }

  const durationMs = Date.now() - startedAt;

  await logRun(req.supabase, {
    ruleId: id,
    userId: req.user.id,
    status: overallStatus,
    triggeredBy: 'manual',
    triggerData: { matched_rows: matchedRows.length },
    actionResults,
    durationMs,
  });

  // Update last_fired + run_count
  await req.supabase
    .from('automation_rules')
    .update({ last_fired: new Date().toISOString(), run_count: (rule.run_count || 0) + 1 })
    .eq('id', id)
    .eq('user_id', req.user.id);

  res.json({ status: overallStatus, matched_rows: matchedRows.length, action_results: actionResults, duration_ms: durationMs });
});

// ── POST /api/automations/:id/log — legacy compat ────────────────────────────
router.post('/:id/log', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await req.supabase
    .from('automation_rules')
    .update({ last_fired: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, last_fired: data?.last_fired });
});

module.exports = router;
module.exports.executeAction = executeAction;
