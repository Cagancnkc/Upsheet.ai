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

// ── Entegrasyon tetikleme ─────────────────────────────────────────────────────
async function fireRuleIntegration(rule, matchingRows, headers) {
  const { integration, action_config } = rule;
  const intKey = `int_${integration}`;
  const config = JSON.parse(localStorage.getItem(intKey) || 'null');

  if (!config) {
    console.warn(`[Otomasyon] ${integration} entegrasyonu yapılandırılmamış, kural atlanıyor.`);
    return;
  }

  // Mesaj şablonunu ilk eşleşen satır için doldur
  const firstRow = matchingRows[0];
  const filledMessage = (action_config.message || '').replace(
    /\{([^}]+)\}/g,
    (_, col) => {
      const idx = headers.indexOf(col);
      return idx >= 0 ? String(firstRow[idx] ?? '') : '';
    }
  );

  // Her entegrasyon için payload oluştur
  const payload = buildPayload(rule, matchingRows, headers, filledMessage);

  const BACKEND = window.BACKEND_URL || 'http://localhost:3001';
  const token = getAuthToken();

  try {
    let endpoint = '';
    let body = {};

    switch (integration) {
      case 'make':
        endpoint = `${BACKEND}/api/integrations/make/trigger`;
        body = { webhookUrl: config.url, event: action_config.event || 'auto_trigger', data: payload };
        break;
      case 'slack':
        endpoint = `${BACKEND}/api/integrations/slack/notify`;
        body = {
          webhookUrl: config.url,
          title: rule.name,
          message: filledMessage,
          fields: buildFields(firstRow, headers, action_config.include_columns)
        };
        break;
      case 'teams':
        endpoint = `${BACKEND}/api/integrations/teams/notify`;
        body = {
          webhookUrl: config.url,
          title: rule.name,
          message: filledMessage,
          fields: buildFields(firstRow, headers, action_config.include_columns)
        };
        break;
      case 'webhook':
        endpoint = `${BACKEND}/api/integrations/webhook/send`;
        body = {
          url: config.url,
          secret: config.secret,
          event: action_config.event || 'auto_trigger',
          data: payload
        };
        break;
      case 'notion':
        endpoint = `${BACKEND}/api/integrations/notion/export`;
        body = {
          token: config.token,
          dbId: config.dbId,
          headers,
          data: matchingRows.map(r => (action_config.include_columns || headers)
            .map(col => r[headers.indexOf(col)] ?? ''))
        };
        break;
      case 'airtable':
        endpoint = `${BACKEND}/api/integrations/airtable/export`;
        body = {
          token: config.token,
          baseId: config.baseId,
          tableName: config.tableName,
          headers: action_config.include_columns || headers,
          data: matchingRows
        };
        break;
      default:
        console.warn(`[Otomasyon] Desteklenmeyen entegrasyon: ${integration}`);
        return;
    }

    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });

    console.log(`[Otomasyon] "${rule.name}" tetiklendi → ${integration}`);
  } catch (e) {
    console.error(`[Otomasyon] Tetikleme hatası (${rule.name}):`, e.message);
  }
}

function buildPayload(rule, matchingRows, headers, message) {
  return {
    rule_name: rule.name,
    integration: rule.integration,
    event: rule.action_config?.event || 'auto_trigger',
    message,
    matching_row_count: matchingRows.length,
    timestamp: new Date().toISOString(),
    rows: matchingRows.slice(0, 10).map(row => {
      const obj = {};
      (rule.action_config?.include_columns || headers).forEach(col => {
        const idx = headers.indexOf(col);
        if (idx >= 0) obj[col] = row[idx] ?? '';
      });
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
    const colIdx = headers.indexOf(trigger_config.column);
    if (colIdx < 0) continue; // sütun bu tabloda yok

    const matchingRows = dataRows.filter(row =>
      evaluateCondition(row[colIdx], trigger_config.operator, trigger_config.value)
    );

    if (!matchingRows.length) continue;

    setThrottle(rule.id);
    await logRuleFired(rule.id);
    await fireRuleIntegration(rule, matchingRows, headers);

    // UI'da bildirim göster (app.js'de tanımlanmış showToast varsa)
    if (typeof showToast === 'function') {
      showToast(`Otomasyon tetiklendi: ${rule.name}`, 'info');
    }
  }
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
