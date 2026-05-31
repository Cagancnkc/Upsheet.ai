'use strict';

// ── Otomasyon Kuralları Motoru ────────────────────────────────────────────────
//
// Desteklenen operatörler: less_than, greater_than, equals, not_equals,
//   contains, is_empty, date_is_today, date_passed, changed
//
// Tetikleme noktaları: applyAction(), hücre düzenleme, import tamamlama
// ─────────────────────────────────────────────────────────────────────────────

const AUTOMATIONS_API = '/api/automations';

function getAuthToken() {
  try {
    // app.js pattern: sb-*-auth-token
    const sbKey = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (sbKey) {
      const p = JSON.parse(localStorage.getItem(sbKey));
      if (p?.access_token) return p.access_token;
    }
    // integrations.html fallback keys
    const raw = localStorage.getItem('sb-access-token') || localStorage.getItem('supabase.auth.token');
    if (raw) {
      const p = JSON.parse(raw);
      return p?.access_token || p?.currentSession?.access_token || null;
    }
    return null;
  } catch { return null; }
}

// ── Kural yükleme (Supabase'den) ─────────────────────────────────────────────
async function loadAutomationRules() {
  const token = getAuthToken();
  if (!token) return [];

  try {
    const res = await fetch(AUTOMATIONS_API, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return [];
    const { rules } = await res.json();
    return rules || [];
  } catch {
    return [];
  }
}

// ── Kural kaydet (Supabase) ──────────────────────────────────────────────────
async function saveAutomationRule(rule) {
  const token = getAuthToken();
  if (!token) throw new Error('Giriş gerekli');

  const res = await fetch(AUTOMATIONS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(rule)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Kural kaydedilemedi');
  return data.rule;
}

// ── Kural güncelle ───────────────────────────────────────────────────────────
async function updateAutomationRule(id, updates) {
  const token = getAuthToken();
  if (!token) throw new Error('Giriş gerekli');

  const res = await fetch(`${AUTOMATIONS_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(updates)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Kural güncellenemedi');
  return data.rule;
}

// ── Kural sil ────────────────────────────────────────────────────────────────
async function deleteAutomationRule(id) {
  const token = getAuthToken();
  if (!token) throw new Error('Giriş gerekli');

  const res = await fetch(`${AUTOMATIONS_API}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Kural silinemedi');
  }
  return true;
}

// ── Tetiklenme zamanını logla ─────────────────────────────────────────────────
async function logRuleFired(id) {
  const token = getAuthToken();
  if (!token) return;

  try {
    await fetch(`${AUTOMATIONS_API}/${id}/log`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch { /* sessiz hata */ }
}

// ── AI öneri al ──────────────────────────────────────────────────────────────
async function suggestAutomationRules(headers, integration) {
  const token = getAuthToken();
  if (!token) throw new Error('Giriş gerekli');

  const res = await fetch(`${AUTOMATIONS_API}/suggest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ headers, integration })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Öneri alınamadı');
  return data;
}

// ── Koşul değerlendirme ──────────────────────────────────────────────────────
function evaluateCondition(cellValue, operator, threshold) {
  const val = String(cellValue ?? '').trim();
  const num = parseFloat(val.replace(',', '.'));

  switch (operator) {
    case 'less_than':
      return !isNaN(num) && num < parseFloat(threshold);
    case 'greater_than':
      return !isNaN(num) && num > parseFloat(threshold);
    case 'equals':
      return val.toLowerCase() === String(threshold).toLowerCase();
    case 'not_equals':
      return val.toLowerCase() !== String(threshold).toLowerCase();
    case 'contains':
      return val.toLowerCase().includes(String(threshold).toLowerCase());
    case 'is_empty':
      return val === '';
    case 'date_is_today': {
      const today = new Date().toLocaleDateString('tr-TR');
      const cellDate = parseDate(val);
      if (!cellDate) return false;
      return cellDate.toLocaleDateString('tr-TR') === today;
    }
    case 'date_passed': {
      const cellDate = parseDate(val);
      if (!cellDate) return false;
      return cellDate < new Date(new Date().setHours(0, 0, 0, 0));
    }
    case 'changed':
      return true; // always true when row changes — caller filters changed rows
    default:
      return false;
  }
}

function parseDate(str) {
  if (!str) return null;
  // GG.AA.YYYY veya YYYY-MM-DD
  const tr = str.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (tr) return new Date(+tr[3], +tr[2] - 1, +tr[1]);
  const iso = new Date(str);
  return isNaN(iso) ? null : iso;
}

// ── Throttle kontrolü (localStorage) ─────────────────────────────────────────
function isThrottled(ruleId, throttleSeconds) {
  if (!throttleSeconds) return false;
  const key = `auto_throttle_${ruleId}`;
  const lastFired = localStorage.getItem(key);
  if (!lastFired) return false;
  return Date.now() - parseInt(lastFired) < throttleSeconds * 1000;
}

function setThrottle(ruleId) {
  localStorage.setItem(`auto_throttle_${ruleId}`, String(Date.now()));
}

// ── Tek aksiyon tetikleme ─────────────────────────────────────────────────────
// action: { type, ...config } — action_config dizisinden gelen tek eleman
async function fireAction(action, rule, matchingRows, headers) {
  const BACKEND = (typeof API_URL !== 'undefined' && API_URL)
    || window.BACKEND_URL
    || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://upsheet-ai.onrender.com');
  const token = getAuthToken();
  const firstRow = matchingRows[0] || [];

  const interp = (s) => (s || '').replace(/\{([^}]+)\}/g, (_, col) => {
    const idx = headers.indexOf(col);
    return idx >= 0 ? String(firstRow[idx] ?? '') : '';
  });

  const lsGet = (key) => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } };

  try {
    switch (action.type) {
      case 'slack': {
        const webhookUrl = action.webhookUrl || action.url || lsGet('int_slack')?.url;
        if (!webhookUrl) { console.warn('[Otomasyon] Slack webhook URL eksik'); return; }
        await fetch(`${BACKEND}/api/integrations/slack/notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ webhookUrl, title: rule.name, message: interp(action.message), fields: buildFields(firstRow, headers, action.include_columns) })
        });
        break;
      }
      case 'teams': {
        const webhookUrl = action.webhookUrl || action.url || lsGet('int_teams')?.url;
        if (!webhookUrl) { console.warn('[Otomasyon] Teams webhook URL eksik'); return; }
        await fetch(`${BACKEND}/api/integrations/teams/notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ webhookUrl, title: rule.name, message: interp(action.message), fields: buildFields(firstRow, headers, action.include_columns) })
        });
        break;
      }
      case 'webhook': {
        const url = action.url || lsGet('int_webhook')?.url;
        if (!url) { console.warn('[Otomasyon] Webhook URL eksik'); return; }
        await fetch(`${BACKEND}/api/integrations/webhook/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ url, secret: action.secret, event: action.event || 'auto_trigger', data: buildPayload(rule, matchingRows, headers, interp(action.message || '')) })
        });
        break;
      }
      case 'gmail': {
        await fetch(`${BACKEND}/api/integrations/gmail/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ to: interp(action.to), subject: interp(action.subject), body: interp(action.body) })
        });
        break;
      }
      case 'make': {
        const webhookUrl = action.webhookUrl || action.url || lsGet('int_make')?.url;
        if (!webhookUrl) { console.warn('[Otomasyon] Make webhook URL eksik'); return; }
        await fetch(`${BACKEND}/api/integrations/make/trigger`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ webhookUrl, event: action.event || 'auto_trigger', data: buildPayload(rule, matchingRows, headers, interp(action.message || '')) })
        });
        break;
      }
      case 'notion': {
        const cfg = lsGet('int_notion') || {};
        await fetch(`${BACKEND}/api/integrations/notion/export`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ token: action.token || cfg.token, dbId: action.dbId || cfg.dbId, headers, data: matchingRows.map(r => (action.include_columns || headers).map(col => r[headers.indexOf(col)] ?? '')) })
        });
        break;
      }
      case 'airtable': {
        const cfg = lsGet('int_airtable') || {};
        await fetch(`${BACKEND}/api/integrations/airtable/export`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ token: action.token || cfg.token, baseId: action.baseId || cfg.baseId, tableName: action.tableName || cfg.tableName, headers: action.include_columns || headers, data: matchingRows })
        });
        break;
      }
      case 'update_cells': {
        if (typeof sheets === 'undefined' || typeof activeSheet === 'undefined') break;
        const colIdx = headers.indexOf(action.column);
        if (colIdx < 0) { console.warn(`[Otomasyon] Sütun bulunamadı: ${action.column}`); break; }
        const data = sheets[activeSheet];
        matchingRows.forEach(mRow => {
          const rowIdx = data.indexOf(mRow);
          if (rowIdx >= 0) data[rowIdx][colIdx] = String(action.value || '');
        });
        if (typeof buildGrid === 'function') buildGrid();
        break;
      }
      case 'notification': {
        if (typeof showToast === 'function') showToast(interp(action.message || rule.name), 'info');
        break;
      }
      default:
        console.warn(`[Otomasyon] Desteklenmeyen aksiyon tipi: ${action.type}`);
    }
    console.log(`[Otomasyon] "${rule.name}" → ${action.type} tamamlandı`);
  } catch (e) {
    console.error(`[Otomasyon] Aksiyon hatası (${rule.name} → ${action.type}):`, e.message);
  }
}

function buildPayload(rule, matchingRows, headers, message) {
  return {
    rule_name: rule.name,
    event: 'auto_trigger',
    message,
    matching_row_count: matchingRows.length,
    timestamp: new Date().toISOString(),
    rows: matchingRows.slice(0, 10).map(row => {
      const obj = {};
      headers.forEach((col, idx) => { obj[col] = row[idx] ?? ''; });
      return obj;
    })
  };
}

function buildFields(row, headers, includeColumns) {
  const cols = includeColumns || headers.slice(0, 6);
  return cols.map(col => {
    const idx = headers.indexOf(col);
    return { label: col, value: idx >= 0 ? String(row[idx] ?? '') : '' };
  });
}

// ── ANA MOTOR: Kuralları değerlendir ve tetikle ──────────────────────────────
//
// Çağrı: evaluateAutomationRules(sheetData)
// sheetData = [[header1, header2, ...], [val1, val2, ...], ...]
//
async function evaluateAutomationRules(sheetData) {
  if (!sheetData || sheetData.length < 2) return;

  const rules = await loadAutomationRules();
  if (!rules.length) return;

  const headers = sheetData[0] || [];
  const dataRows = sheetData.slice(1).filter(row => row && row.some(c => c !== '' && c != null));

  for (const rule of rules) {
    if (!rule.enabled) continue;
    if (isThrottled(rule.id, rule.throttle_seconds)) continue;

    const { trigger_config } = rule;
    // schedule tipi kurallar backend'de çalışır, client atlar
    if (!trigger_config || trigger_config.type === 'schedule') continue;

    const colIdx = headers.indexOf(trigger_config.column);
    if (colIdx < 0) continue;

    let matchingRows = dataRows.filter(row =>
      evaluateCondition(row[colIdx], trigger_config.operator, trigger_config.value)
    );

    const { condition_config } = rule;
    if (Array.isArray(condition_config) && condition_config.length > 0) {
      matchingRows = matchingRows.filter(row =>
        condition_config.every(cond => {
          const ci = headers.indexOf(cond.column);
          return ci < 0 || evaluateCondition(row[ci], cond.operator, cond.value);
        })
      );
    }

    if (!matchingRows.length) continue;

    setThrottle(rule.id);
    await logRuleFired(rule.id);

    // action_config hem array hem tek obje olabilir (backwards compat)
    const actions = Array.isArray(rule.action_config)
      ? rule.action_config
      : (rule.action_config ? [rule.action_config] : []);

    for (const action of actions) {
      if (action) await fireAction(action, rule, matchingRows, headers);
    }

    if (typeof showToast === 'function') {
      showToast(`Otomasyon tetiklendi: ${rule.name}`, 'info');
    }
  }
  window.dispatchEvent(new CustomEvent('automations:evaluated'));
}

// ── Dışa aç ──────────────────────────────────────────────────────────────────
window.Automations = {
  evaluate: evaluateAutomationRules,
  load: loadAutomationRules,
  save: saveAutomationRule,
  update: updateAutomationRule,
  remove: deleteAutomationRule,
  suggest: suggestAutomationRules
};
