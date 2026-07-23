'use strict';
const MSFT_TENANT = 'common';
const MSFT_SCOPES = 'Files.ReadWrite User.Read offline_access';
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const tokenManager = require('../services/tokenManager');
const { createClient: _createSbClient } = require('@supabase/supabase-js');

function _getSb() {
  return _createSbClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Giriş gerekli' });
  const sb = _getSb();
  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Geçersiz token' });
  req.user = user;
  next();
}

// Exponential backoff — harici API rate limit (429/503) durumunda retry
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i <= maxRetries; i++) {
    const r = await fetch(url, options);
    if (r.status !== 429 && r.status !== 503) return r;
    if (i === maxRetries) return r;
    const delay = parseInt(r.headers.get('Retry-After') || '0') * 1000
      || Math.min(1000 * Math.pow(2, i), 10000);
    await new Promise(res => setTimeout(res, delay));
  }
}
// ── Google Sheets: CSV export (JSON response) ────
router.post('/sheets/export', async (req, res) => {
  const { sheetId, data, sheetName } = req.body;
  if (!data?.length) {
    return res.status(400).json({ error: 'Dışa aktarılacak veri yok' });
  }

  const match = sheetId ? sheetId.match(/\/d\/([a-zA-Z0-9-_]+)/) : null;
  const id = match ? match[1] : (sheetId || '').trim();

  const csv = '\uFEFF' + data.map(row =>
    (row || []).map(cell => {
      let str = String(cell ?? '');
      if (/^[=+\-@\t\r]/.test(str)) str = "'" + str;
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    }).join(',')
  ).join('\r\n');

  res.json({
    success: true,
    csv,
    sheetUrl: id ? 'https://docs.google.com/spreadsheets/d/' + id : null,
    rows: data.length,
    sheetId: id || null
  });
});

// ── Google Sheets: URL test ───────────────────────
router.post('/sheets/test', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL gerekli' });

  const isGoogleSheets = url.includes('docs.google.com/spreadsheets') ||
                          url.includes('sheets.google.com');
  if (!isGoogleSheets) {
    return res.status(400).json({
      error: 'Geçersiz Google Sheets URL\'si. docs.google.com/spreadsheets ile başlamalı.'
    });
  }

  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) return res.status(400).json({ error: 'Spreadsheet ID bulunamadı' });

  const spreadsheetId = match[1];
  const testUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=0`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(testUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mocksheets/1.0' }
    });
    clearTimeout(timeout);

    if (response.status === 401 || response.status === 403) {
      return res.json({
        success: false,
        error: 'Erişim reddedildi. Dosyayı "Bağlantıya sahip herkes görebilir" olarak paylaşın.',
        hint: 'Sheets → Paylaş → "Bağlantıya sahip herkes" → "Görüntüleyici"'
      });
    }

    if (response.ok) {
      const text = await response.text();
      const rowCount = text.split('\n').length;
      return res.json({ success: true, message: `✅ Bağlantı başarılı! ~${rowCount} satır tespit edildi.`, spreadsheetId, rowCount });
    }

    res.json({ success: false, error: `HTTP ${response.status}: Dosyaya erişilemiyor` });
  } catch (err) {
    if (err.name === 'AbortError') return res.json({ success: false, error: 'Bağlantı zaman aşımına uğradı (8sn)' });
    res.json({ success: false, error: 'Bağlantı hatası: ' + err.message });
  }
});

// ── Google Sheets: Veri çek ──────────────────────
router.post('/sheets/import', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL gerekli' });

  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) return res.status(400).json({ error: 'Geçersiz URL' });

  const gidMatch = url.match(/[#&?]gid=(\d+)/);
  const gid = gidMatch ? gidMatch[1] : '0';
  const csvUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv&gid=${gid}`;

  try {
    const response = await fetch(csvUrl, { headers: { 'User-Agent': 'Mocksheets/1.0' } });
    if (!response.ok) {
      return res.status(response.status).json({
        error: response.status === 403
          ? 'Dosya herkese açık değil. Paylaşım ayarlarını kontrol edin.'
          : `HTTP ${response.status}`
      });
    }

    const csv = await response.text();
    const rows = csv.split('\n').map(line => {
      const cells = [];
      let inQuote = false, cell = '';
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') { inQuote = !inQuote; continue; }
        if (line[i] === ',' && !inQuote) { cells.push(cell.trim()); cell = ''; continue; }
        cell += line[i];
      }
      cells.push(cell.trim());
      return cells;
    }).filter(row => row.some(c => c));

    res.json({ success: true, data: rows, rowCount: rows.length, colCount: rows[0]?.length || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Google Sheets: OAuth ile veri çek ────────────
router.post('/sheets/import-oauth', requireAuth, async (req, res) => {
  const { spreadsheet_url, range } = req.body;
  if (!spreadsheet_url) return res.status(400).json({ error: 'spreadsheet_url zorunludur' });

  const match = spreadsheet_url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) return res.status(400).json({ error: 'Geçersiz Google Sheets URL' });
  const spreadsheetId = match[1];

  const accessToken = await tokenManager.getValidAccessToken(req.user.id, 'google-sheets');
  if (!accessToken) return res.status(401).json({ error: 'Google hesabı bağlı değil', connect_required: true });

  const tokenRow = await tokenManager.getToken(req.user.id, 'google-sheets');

  try {
    const { google } = require('googleapis');
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: tokenRow?.refreshToken,
      expiry_date: tokenRow?.expires_at ? new Date(tokenRow.expires_at).getTime() : null
    });

    const sheetsApi = google.sheets({ version: 'v4', auth: oauth2Client });
    const effectiveRange = range || 'A1:ZZ10000';

    const response = await sheetsApi.spreadsheets.values.get({ spreadsheetId, range: effectiveRange });
    const values = response.data.values || [];

    if (values.length === 0) {
      return res.json({ success: true, headers: [], rows: [], total_rows: 0, imported_at: new Date().toISOString() });
    }

    const headers = values[0].map(h => h || '');
    const rows = values.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i] ?? ''; });
      return obj;
    });

    try {
      await _getSb().from('sheets_imports').upsert({
        user_id: req.user.id,
        spreadsheet_id: spreadsheetId,
        spreadsheet_url,
        sheet_name: range || null,
        last_imported: new Date().toISOString(),
        row_count: rows.length,
        headers
      }, { onConflict: 'user_id,spreadsheet_id' });
    } catch (_) {}

    res.json({
      success: true,
      spreadsheet_id: spreadsheetId,
      sheet_name: response.data.range || effectiveRange,
      headers,
      rows,
      total_rows: rows.length,
      imported_at: new Date().toISOString()
    });

  } catch (err) {
    const status = err.code || err.response?.status;
    if (status === 401) return res.status(401).json({ error: 'Google oturumu sona erdi, tekrar bağlanın', connect_required: true });
    if (status === 403) return res.status(403).json({ error: 'Bu tabloya erişim izniniz yok' });
    if (status === 404) return res.status(404).json({ error: 'Spreadsheet bulunamadı' });
    res.status(500).json({ error: err.message });
  }
});

// ── Notion: Token test ───────────────────────────
router.post('/notion/test', async (req, res) => {
  const { token, dbId } = req.body;
  if (!token) return res.status(400).json({ error: 'Token giriniz' });

  try {
    const userRes = await fetch('https://api.notion.com/v1/users/me', {
      headers: { 'Authorization': 'Bearer ' + token, 'Notion-Version': '2022-06-28' }
    });

    if (!userRes.ok) {
      const err = await userRes.json().catch(() => ({}));
      return res.status(400).json({ error: 'Geçersiz token: ' + (err.message || 'Yetkilendirme başarısız') });
    }

    if (dbId && dbId.trim()) {
      const cleanId = dbId.replace(/-/g, '');
      const formatted = cleanId.length === 32
        ? [cleanId.slice(0,8), cleanId.slice(8,12), cleanId.slice(12,16), cleanId.slice(16,20), cleanId.slice(20)].join('-')
        : dbId.trim();

      const dbRes = await fetch('https://api.notion.com/v1/databases/' + formatted, {
        headers: { 'Authorization': 'Bearer ' + token, 'Notion-Version': '2022-06-28' }
      });

      if (!dbRes.ok) {
        const err = await dbRes.json().catch(() => ({}));
        return res.status(400).json({ error: 'Database bulunamadı: ' + (err.message || 'ID hatalı veya entegrasyona erişim verilmemiş') });
      }

      const dbData = await dbRes.json();
      const dbName = dbData.title?.[0]?.plain_text || 'Veritabanı';
      return res.json({ success: true, dbName });
    }

    res.json({ success: true, message: 'Token geçerli' });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası: ' + err.message });
  }
});

// ── Notion: Export ───────────────────────────────
router.post('/notion/export', async (req, res) => {
  const { token, databaseId, headers, rows } = req.body;

  if (!token) return res.status(400).json({ error: 'Token giriniz' });
  if (!databaseId) return res.status(400).json({ error: 'Database ID giriniz' });
  if (!headers?.length) return res.status(400).json({ error: 'Sütun başlıkları yok' });
  if (!rows?.length) return res.status(400).json({ error: 'Aktarılacak veri yok' });

  const cleanId = databaseId.replace(/-/g, '');
  const formattedId = cleanId.length === 32
    ? [cleanId.slice(0,8), cleanId.slice(8,12), cleanId.slice(12,16), cleanId.slice(16,20), cleanId.slice(20)].join('-')
    : databaseId.trim();

  const dbCheck = await fetch('https://api.notion.com/v1/databases/' + formattedId, {
    headers: { 'Authorization': 'Bearer ' + token, 'Notion-Version': '2022-06-28' }
  }).catch(() => null);

  if (!dbCheck || !dbCheck.ok) {
    return res.status(400).json({ error: "Database erişimi başarısız. Token ve ID'yi kontrol edin." });
  }

  let count = 0;
  const errors = [];
  const toExport = rows.slice(0, 500);

  for (const row of toExport) {
    try {
      const properties = {};
      headers.forEach((header, i) => {
        if (!header?.trim()) return;
        const val = String(row?.[i] ?? '').trim();
        const propName = header.trim();

        if (i === 0) {
          properties[propName] = { title: [{ type: 'text', text: { content: val.slice(0, 2000) } }] };
          return;
        }

        const numStr = val.replace(/[₺$€,\s]/g, '');
        const num = parseFloat(numStr);
        if (val !== '' && !isNaN(num) && isFinite(num)) {
          properties[propName] = { number: num };
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
          properties[propName] = { date: { start: val } };
        } else if (/^\d{2}[.\-/]\d{2}[.\-/]\d{4}$/.test(val)) {
          const parts = val.split(/[.\-/]/);
          properties[propName] = { date: { start: parts[2] + '-' + parts[1] + '-' + parts[0] } };
        } else {
          properties[propName] = { rich_text: [{ type: 'text', text: { content: val.slice(0, 2000) } }] };
        }
      });

      const pageRes = await fetchWithRetry('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ parent: { database_id: formattedId }, properties })
      });

      if (pageRes.ok) count++;
      else { const e = await pageRes.json().catch(() => ({})); errors.push(e.message || 'Satır hatası'); }

      await new Promise(r => setTimeout(r, 340));
    } catch (e) { errors.push(e.message); }
  }

  res.json({ success: count > 0, count, total: toExport.length, errors: errors.slice(0, 5) });
});

function isPrivateHost(hostname) {
  return /^(localhost|127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|0\.|::1$|fc00:|fe80:)/i.test(hostname);
}

// ── Webhook: Send ────────────────────────────────
router.post('/webhook/send', async (req, res) => {
  const { url, event, data, secret } = req.body;
  if (!url) return res.status(400).json({ error: 'URL gerekli' });

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return res.status(400).json({ error: 'Geçersiz URL protokolü' });
    }
    if (isPrivateHost(parsed.hostname)) {
      return res.status(400).json({ error: 'İç ağ adreslerine istek yapılamaz' });
    }
  } catch {
    return res.status(400).json({ error: 'Geçersiz URL formatı' });
  }

  const payload = {
    source: 'Mocksheets',
    event: event || 'manual',
    timestamp: new Date().toISOString(),
    data: data || {}
  };

  const reqHeaders = { 'Content-Type': 'application/json', 'User-Agent': 'Mocksheets-Webhook/1.0' };
  if (secret) {
    const crypto = require('crypto');
    reqHeaders['X-Mocksheets-Signature'] = 'sha256=' + crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const r = await fetch(url, { method: 'POST', headers: reqHeaders, body: JSON.stringify(payload), signal: controller.signal });
    clearTimeout(timeoutId);
    res.json({ success: true, status: r.status, message: `✅ Webhook gönderildi (HTTP ${r.status})` });
  } catch (err) {
    if (err.name === 'AbortError') return res.status(408).json({ error: 'Zaman aşımı: endpoint yanıt vermedi' });
    res.status(500).json({ error: err.message });
  }
});

// ── Slack: Test ──────────────────────────────────
router.post('/slack/test', async (req, res) => {
  const { webhookUrl, message } = req.body;
  if (!webhookUrl) return res.status(400).json({ error: 'Slack webhook URL giriniz' });

  const payload = {
    text: message || '✅ Mocksheets bağlantı testi başarılı!',
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: '*🔗 Mocksheets Bağlantı Testi*\n' + (message || 'Slack entegrasyonu başarıyla kuruldu!') } },
      { type: 'context', elements: [{ type: 'mrkdwn', text: '📅 ' + new Date().toLocaleString('tr-TR') + ' • Mocksheets' }] }
    ]
  };

  try {
    const r = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await r.text();
    if (text === 'ok' || r.ok) res.json({ success: true });
    else res.status(400).json({ error: 'Slack hatası: ' + text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Slack: Notify ────────────────────────────────
router.post('/slack/notify', async (req, res) => {
  const { webhookUrl, title, message, fields } = req.body;
  if (!webhookUrl) return res.status(400).json({ error: 'Webhook URL gerekli' });

  try {
    const parsed = new URL(webhookUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) return res.status(400).json({ error: 'Geçersiz URL protokolü' });
    if (isPrivateHost(parsed.hostname)) return res.status(403).json({ error: 'Private host hedefleri yasaklıdır', code: 'SSRF_BLOCKED' });
  } catch { return res.status(400).json({ error: 'Geçersiz URL formatı' }); }

  const blocks = [
    { type: 'header', text: { type: 'plain_text', text: title || 'Mocksheets Bildirimi', emoji: true } },
    { type: 'section', text: { type: 'mrkdwn', text: message || '' } }
  ];

  if (fields?.length) {
    blocks.push({ type: 'section', fields: fields.map(f => ({ type: 'mrkdwn', text: '*' + f.label + ':*\n' + f.value })) });
  }

  blocks.push({ type: 'divider' });
  blocks.push({ type: 'context', elements: [{ type: 'mrkdwn', text: '📅 ' + new Date().toLocaleString('tr-TR') + ' • Mocksheets' }] });

  try {
    const r = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: title || 'Mocksheets', blocks })
    });
    const text = await r.text();
    res.json({ success: text === 'ok' || r.ok });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Airtable: Token test ─────────────────────────
router.post('/airtable/test', async (req, res) => {
  const { token, baseId, tableName } = req.body;
  if (!token) return res.status(400).json({ error: 'Personal Access Token giriniz' });
  if (!baseId) return res.status(400).json({ error: 'Base ID giriniz' });

  try {
    const tbl = (tableName || 'Table 1').trim();
    const url = `https://api.airtable.com/v0/${baseId.trim()}/${encodeURIComponent(tbl)}?maxRecords=1`;
    const r = await fetch(url, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (r.status === 401 || r.status === 403) return res.status(400).json({ error: 'Geçersiz token veya erişim reddedildi' });
    if (r.status === 404) return res.status(400).json({ error: 'Base veya tablo bulunamadı. Base ID ve tablo adını kontrol edin.' });
    if (!r.ok) return res.status(400).json({ error: `HTTP ${r.status}` });
    const data = await r.json();
    res.json({ success: true, message: `✅ Bağlantı başarılı! Tablo: ${tbl}`, recordCount: data.records?.length || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Airtable: Export ─────────────────────────────
router.post('/airtable/export', async (req, res) => {
  const { token, baseId, tableName, headers, rows } = req.body;
  if (!token) return res.status(400).json({ error: 'Token gerekli' });
  if (!baseId) return res.status(400).json({ error: 'Base ID gerekli' });
  if (!headers?.length || !rows?.length) return res.status(400).json({ error: 'Veri yok' });

  const tbl = encodeURIComponent((tableName || 'Table 1').trim());
  const url = `https://api.airtable.com/v0/${baseId.trim()}/${tbl}`;
  const toExport = rows.slice(0, 300);
  let count = 0;
  const errors = [];

  for (const row of toExport) {
    try {
      const fields = {};
      headers.forEach((h, i) => { if (h?.trim()) fields[h.trim()] = String(row?.[i] ?? ''); });
      const r = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
      });
      if (r.ok) count++;
      else { const e = await r.json().catch(() => ({})); errors.push(e.error?.message || 'Satır hatası'); }
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (e) { errors.push(e.message); }
  }

  res.json({ success: count > 0, count, total: toExport.length, errors: errors.slice(0, 5) });
});

// ── Make: Webhook tetikle ────────────────────────
router.post('/make/trigger', async (req, res) => {
  const { url, event, data } = req.body;
  if (!url) return res.status(400).json({ error: 'Webhook URL gerekli' });

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return res.status(400).json({ error: 'Geçersiz URL' });
    if (isPrivateHost(parsed.hostname)) return res.status(403).json({ error: 'Private host hedefleri yasaklıdır', code: 'SSRF_BLOCKED' });
  } catch { return res.status(400).json({ error: 'Geçersiz URL formatı' }); }

  const payload = { source: 'Mocksheets', event: event || 'manual', timestamp: new Date().toISOString(), data: data || {} };

  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 10000);
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mocksheets-Make/1.0' }, body: JSON.stringify(payload), signal: controller.signal });
    clearTimeout(tid);
    res.json({ success: true, status: r.status, message: `✅ Make senaryosu tetiklendi (HTTP ${r.status})` });
  } catch (err) {
    if (err.name === 'AbortError') return res.status(408).json({ error: 'Zaman aşımı' });
    res.status(500).json({ error: err.message });
  }
});

// ── Google Drive: CSV yükle ──────────────────────
router.post('/drive/upload', async (req, res) => {
  const { token, fileName, csv } = req.body;
  if (!token) return res.status(400).json({ error: 'Access token gerekli' });
  if (!csv) return res.status(400).json({ error: 'Veri yok' });

  const name = (fileName || 'Mocksheets_Export') + '.csv';
  const metadata = JSON.stringify({ name, mimeType: 'text/csv' });
  const boundary = '-------mocksheets_boundary';
  const body = `--${boundary}\r\nContent-Type: application/json\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: text/csv\r\n\r\n${csv}\r\n--${boundary}--`;

  try {
    const r = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': `multipart/related; boundary="${boundary}"` },
      body
    });
    if (!r.ok) { const e = await r.json().catch(() => ({})); return res.status(400).json({ error: e.error?.message || `HTTP ${r.status}` }); }
    const file = await r.json();
    res.json({ success: true, fileId: file.id, fileName: name, message: `✅ "${name}" Drive'a yüklendi` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Microsoft Teams: Test ────────────────────────
router.post('/teams/test', async (req, res) => {
  const { webhookUrl } = req.body;
  if (!webhookUrl) return res.status(400).json({ error: 'Webhook URL giriniz' });

  const payload = {
    '@type': 'MessageCard',
    '@context': 'http://schema.org/extensions',
    summary: 'Mocksheets Bağlantı Testi',
    themeColor: '6264A7',
    sections: [{ activityTitle: '🔗 Mocksheets Bağlantı Testi', activitySubtitle: 'Teams entegrasyonu başarıyla kuruldu!', facts: [{ name: 'Zaman', value: new Date().toLocaleString('tr-TR') }, { name: 'Kaynak', value: 'Mocksheets' }] }]
  };

  try {
    const r = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const text = await r.text();
    if (r.ok || text === '1') res.json({ success: true });
    else res.status(400).json({ error: 'Teams hatası: ' + text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Microsoft Teams: Bildirim gönder ────────────
router.post('/teams/notify', async (req, res) => {
  const { webhookUrl, title, message, fields } = req.body;
  if (!webhookUrl) return res.status(400).json({ error: 'Webhook URL gerekli' });

  try {
    const parsed = new URL(webhookUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) return res.status(400).json({ error: 'Geçersiz URL protokolü' });
    if (isPrivateHost(parsed.hostname)) return res.status(403).json({ error: 'Private host hedefleri yasaklıdır', code: 'SSRF_BLOCKED' });
  } catch { return res.status(400).json({ error: 'Geçersiz URL formatı' }); }

  const facts = (fields || []).map(f => ({ name: f.label, value: f.value }));
  facts.push({ name: 'Zaman', value: new Date().toLocaleString('tr-TR') });

  const payload = {
    '@type': 'MessageCard',
    '@context': 'http://schema.org/extensions',
    summary: title || 'Mocksheets Bildirimi',
    themeColor: '6264A7',
    sections: [{ activityTitle: title || 'Mocksheets Bildirimi', activityText: message || '', facts }]
  };

  try {
    const r = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const text = await r.text();
    res.json({ success: r.ok || text === '1' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Trello: Board test ───────────────────────────
router.post('/trello/test', async (req, res) => {
  const { apiKey, token, boardId } = req.body;
  if (!apiKey || !token) return res.status(400).json({ error: 'API Key ve Token gerekli' });
  if (!boardId) return res.status(400).json({ error: 'Board ID gerekli' });

  try {
    const r = await fetch(`https://api.trello.com/1/boards/${boardId.trim()}?key=${apiKey}&token=${token}`);
    if (r.status === 401) return res.status(400).json({ error: 'Geçersiz API Key veya Token' });
    if (r.status === 404) return res.status(400).json({ error: 'Board bulunamadı' });
    if (!r.ok) return res.status(400).json({ error: `HTTP ${r.status}` });
    const data = await r.json();
    res.json({ success: true, boardName: data.name, message: `✅ Board bulundu: ${data.name}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Trello: Export ───────────────────────────────
router.post('/trello/export', async (req, res) => {
  const { apiKey, token, boardId, listName, headers, rows } = req.body;
  if (!apiKey || !token || !boardId) return res.status(400).json({ error: 'API Key, Token ve Board ID gerekli' });
  if (!rows?.length) return res.status(400).json({ error: 'Veri yok' });

  try {
    const listsRes = await fetch(`https://api.trello.com/1/boards/${boardId.trim()}/lists?key=${apiKey}&token=${token}`);
    if (!listsRes.ok) return res.status(400).json({ error: 'Listeler alınamadı' });
    const lists = await listsRes.json();

    const targetList = listName
      ? lists.find(l => l.name.toLowerCase() === listName.toLowerCase()) || lists[0]
      : lists[0];
    if (!targetList) return res.status(400).json({ error: 'Uygun liste bulunamadı' });

    const toExport = rows.slice(0, 100);
    let count = 0;
    const errors = [];

    for (const row of toExport) {
      try {
        const cardName = String(row?.[0] ?? '').trim() || 'Kart';
        const desc = headers && headers.length > 1
          ? headers.slice(1).map((h, i) => `${h}: ${row?.[i + 1] ?? ''}`).join('\n')
          : '';
        const r = await fetchWithRetry(`https://api.trello.com/1/cards?key=${apiKey}&token=${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: cardName, desc, idList: targetList.id })
        });
        if (r.ok) count++;
        else { const e = await r.json().catch(() => ({})); errors.push(e.message || 'Kart hatası'); }
        await new Promise(resolve => setTimeout(resolve, 150));
      } catch (e) { errors.push(e.message); }
    }

    res.json({ success: count > 0, count, total: toExport.length, listName: targetList.name, errors: errors.slice(0, 5) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Google Sheets: Gerçek yazma (Sheets API v4) ─
router.post('/sheets/write', async (req, res) => {
  const { accessToken: bodyAccessToken, refreshToken: bodyRefreshToken, tokenExpiry, sheetId, sheetName, startCell, data } = req.body;

  if (!data?.length) return res.status(400).json({ error: 'Dışa aktarılacak veri yok' });

  let { google } = require('googleapis');
  const redirectUri = (process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`)
    + '/api/integrations/sheets/callback';

  // DB token öncelikli, fallback request body (backward compat)
  let accessToken = bodyAccessToken;
  let refreshToken = bodyRefreshToken;
  if (req.user?.id) {
    const dbToken = await tokenManager.getValidAccessToken(req.user.id, 'google-sheets').catch(() => null);
    if (dbToken) {
      accessToken = dbToken;
      refreshToken = null; // DB handles refresh
    }
  }

  if (!accessToken && !refreshToken) {
    return res.status(400).json({ error: 'Google token gerekli. Önce "Google ile Bağlan" butonuna tıklayın.' });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
  oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken, expiry_date: tokenExpiry });

  let newAccessToken = null;
  oauth2Client.on('tokens', (t) => { if (t.access_token) newAccessToken = t.access_token; });

  const match = sheetId ? sheetId.match(/\/d\/([a-zA-Z0-9-_]+)/) : null;
  const spreadsheetId = match ? match[1] : (sheetId || '').trim();
  if (!spreadsheetId) return res.status(400).json({ error: 'Geçersiz Google Sheets URL veya ID' });

  const tab = sheetName || 'Sheet1';
  const cell = startCell || 'A1';
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

  try {
    await sheets.spreadsheets.values.clear({ spreadsheetId, range: tab });
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${tab}!${cell}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: data.map(row => (row || []).map(cell => cell ?? '')) }
    });

    const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
    res.json({
      success: true,
      rows: data.length,
      cols: data[0]?.length || 0,
      sheetUrl,
      message: `✅ ${data.length} satır Google Sheets'e yazıldı`,
      ...(newAccessToken ? { newAccessToken } : {})
    });
  } catch (err) {
    const status = err.code || err.status;
    if (status === 401) return res.status(401).json({ error: 'Google token süresi dolmuş. Lütfen tekrar bağlanın.', code: 'TOKEN_EXPIRED' });
    if (status === 403) return res.status(403).json({ error: "Yetersiz izin. Spreadsheet'e yazma erişiminiz yok.", code: 'PERMISSION_DENIED' });
    if (status === 404) return res.status(404).json({ error: "Spreadsheet bulunamadı. URL veya ID'yi kontrol edin." });
    res.status(500).json({ error: 'Google Sheets yazma hatası: ' + err.message });
  }
});

// ── Excel Online: Microsoft Graph API + Azure AD OAuth2 ──────────────────────
// /excel/auth ve /excel/callback route'ları server.js'de kayıtlı (auth middleware'den önce)

// Token yenile (access token süresi ~1 saat)
router.post('/excel/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken gerekli' });

  try {
    const r = await fetch(`https://login.microsoftonline.com/${MSFT_TENANT}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.MSFT_CLIENT_ID,
        client_secret: process.env.MSFT_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        scope: MSFT_SCOPES
      })
    });
    const tokens = await r.json();
    if (!tokens.access_token) return res.status(401).json({ error: 'Token yenilenemedi. Lütfen tekrar bağlanın.', code: 'TOKEN_EXPIRED' });

    res.json({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || refreshToken,
      expiry: Date.now() + (tokens.expires_in || 3600) * 1000
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kullanıcı profili al (bağlantı testi)
router.post('/excel/me', async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) return res.status(400).json({ error: 'accessToken gerekli' });

  try {
    const r = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (r.status === 401) return res.status(401).json({ error: 'Token geçersiz veya süresi dolmuş', code: 'TOKEN_EXPIRED' });
    const profile = await r.json();
    res.json({ success: true, name: profile.displayName, email: profile.mail || profile.userPrincipalName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OneDrive'a Excel/CSV dosyası yükle (veya mevcut dosyanın üzerine yaz)
router.post('/excel/upload', async (req, res) => {
  const { accessToken, fileName, data } = req.body;
  if (!accessToken) return res.status(400).json({ error: 'accessToken gerekli. Önce Microsoft ile bağlanın.' });
  if (!data?.length) return res.status(400).json({ error: 'Dışa aktarılacak veri yok' });

  const name = (fileName || 'mocksheets-export').replace(/\.xlsx?$/i, '') + '.xlsx';

  // SheetJS'siz basit CSV olarak kaydet (OneDrive destekler)
  const csv = '\uFEFF' + data.map(row =>
    (row || []).map(cell => {
      const str = String(cell ?? '');
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(',')
  ).join('\r\n');

  const csvName = name.replace(/\.xlsx?$/i, '.csv');

  try {
    // OneDrive basit yükleme (< 4MB için uygundur)
    const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/${encodeURIComponent(csvName)}:/content`;
    const r = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'text/csv; charset=utf-8'
      },
      body: csv
    });

    if (r.status === 401) return res.status(401).json({ error: 'Microsoft token süresi dolmuş. Lütfen tekrar bağlanın.', code: 'TOKEN_EXPIRED' });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      return res.status(r.status).json({ error: 'OneDrive yükleme hatası: ' + (err.error?.message || r.statusText) });
    }

    const file = await r.json();
    res.json({
      success: true,
      rows: data.length,
      fileName: csvName,
      fileId: file.id,
      webUrl: file.webUrl,
      message: `✅ ${data.length} satır OneDrive'a yüklendi: ${csvName}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OneDrive'daki CSV/Excel dosyasını oku
router.post('/excel/read', async (req, res) => {
  const { accessToken, fileId, fileName } = req.body;
  if (!accessToken) return res.status(400).json({ error: 'accessToken gerekli' });
  if (!fileId && !fileName) return res.status(400).json({ error: 'fileId veya fileName gerekli' });

  try {
    let downloadUrl;
    if (fileId) {
      downloadUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/content`;
    } else {
      downloadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/${encodeURIComponent(fileName)}:/content`;
    }

    const r = await fetch(downloadUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (r.status === 401) return res.status(401).json({ error: 'Token süresi dolmuş', code: 'TOKEN_EXPIRED' });
    if (r.status === 404) return res.status(404).json({ error: 'Dosya bulunamadı' });
    if (!r.ok) return res.status(r.status).json({ error: 'Dosya okunamadı: ' + r.statusText });

    const text = await r.text();
    // CSV parse (basit)
    const rows = text.split(/\r?\n/).filter(l => l.trim()).map(line => {
      const cells = [];
      let cur = '', inQ = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') { inQ = !inQ; continue; }
        if (ch === ',' && !inQ) { cells.push(cur); cur = ''; continue; }
        cur += ch;
      }
      cells.push(cur);
      return cells;
    });

    res.json({ success: true, data: rows, rowCount: rows.length, colCount: rows[0]?.length || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OneDrive dosya listesi (son değiştirilen CSV/XLSX dosyaları)
router.post('/excel/files', async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) return res.status(400).json({ error: 'accessToken gerekli' });

  try {
    const r = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/root/children?$filter=file ne null&$select=id,name,webUrl,lastModifiedDateTime,size&$orderby=lastModifiedDateTime desc&$top=20`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (r.status === 401) return res.status(401).json({ error: 'Token süresi dolmuş', code: 'TOKEN_EXPIRED' });
    const result = await r.json();
    const files = (result.value || [])
      .filter(f => /\.(csv|xlsx?|ods)$/i.test(f.name))
      .map(f => ({ id: f.id, name: f.name, url: f.webUrl, modified: f.lastModifiedDateTime, size: f.size }));
    res.json({ success: true, files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Push endpoints (dropdown quick-share) ────────────────────────────────────

function rowsToCsv(headers, rows) {
  const escape = v => { const s = String(v ?? ''); return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s; };
  return [headers, ...rows].map(r => (r || []).map(escape).join(',')).join('\n');
}

function rowsToHtmlTable(headers, rows) {
  const th = (headers || []).map(h => `<th style="border:1px solid #ccc;padding:6px 10px;background:#f5f5f5">${String(h ?? '')}</th>`).join('');
  const trs = (rows || []).map(r => '<tr>' + (r || []).map(c => `<td style="border:1px solid #ccc;padding:6px 10px">${String(c ?? '')}</td>`).join('') + '</tr>').join('');
  return `<table style="border-collapse:collapse;font-family:sans-serif;font-size:13px"><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>`;
}

router.post('/slack/push', async (req, res) => {
  const { headers, rows } = req.body;
  const tokenData = await tokenManager.getToken(req.user.id, 'slack').catch(() => null);
  if (!tokenData?.accessToken) return res.status(401).json({ error: 'Slack bağlı değil. Önce Slack webhook URL kaydedin.' });
  const webhookUrl = tokenData.metadata?.webhookUrl || tokenData.accessToken;
  const preview = rowsToCsv(headers, (rows || []).slice(0, 5));
  const payload = {
    text: '📊 Mocksheets verisi',
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: '📊 Mocksheets Veri Paylaşımı', emoji: true } },
      { type: 'section', text: { type: 'mrkdwn', text: `*${(rows || []).length} satır, ${(headers || []).length} sütun*\n\`\`\`${preview}\`\`\`` } },
      { type: 'context', elements: [{ type: 'mrkdwn', text: '📅 ' + new Date().toLocaleString('tr-TR') + ' • Mocksheets' }] }
    ]
  };
  try {
    const r = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const text = await r.text();
    if (text === 'ok' || r.ok) res.json({ success: true, message: `✅ Slack'e ${(rows || []).length} satır gönderildi` });
    else res.status(400).json({ error: 'Slack hatası: ' + text });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/teams/push', async (req, res) => {
  const { headers, rows } = req.body;
  const tokenData = await tokenManager.getToken(req.user.id, 'teams').catch(() => null);
  if (!tokenData?.accessToken) return res.status(401).json({ error: 'Teams bağlı değil. Önce webhook URL kaydedin.' });
  const webhookUrl = tokenData.metadata?.webhookUrl || tokenData.accessToken;
  const preview = rowsToCsv(headers, (rows || []).slice(0, 5));
  const payload = {
    '@type': 'MessageCard', '@context': 'http://schema.org/extensions',
    summary: 'Mocksheets Veri Paylaşımı', themeColor: '6264A7',
    sections: [{ activityTitle: '📊 Mocksheets Veri Paylaşımı', activitySubtitle: `${(rows || []).length} satır, ${(headers || []).length} sütun`, text: `<pre>${preview}</pre>`, facts: [{ name: 'Tarih', value: new Date().toLocaleString('tr-TR') }] }]
  };
  try {
    const r = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const text = await r.text();
    if (r.ok || text === '1') res.json({ success: true, message: `✅ Teams'e ${(rows || []).length} satır gönderildi` });
    else res.status(400).json({ error: 'Teams hatası: ' + text });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/make/push', async (req, res) => {
  const { headers, rows } = req.body;
  const tokenData = await tokenManager.getToken(req.user.id, 'make').catch(() => null);
  if (!tokenData?.accessToken) return res.status(401).json({ error: 'Make.com bağlı değil. Önce webhook URL kaydedin.' });
  const webhookUrl = tokenData.metadata?.webhookUrl || tokenData.accessToken;
  try {
    const parsed = new URL(webhookUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) return res.status(400).json({ error: 'Geçersiz URL' });
    if (isPrivateHost(parsed.hostname)) return res.status(403).json({ error: 'Private host hedefleri yasaklıdır', code: 'SSRF_BLOCKED' });
  } catch { return res.status(400).json({ error: 'Geçersiz webhook URL' }); }
  const payload = { source: 'Mocksheets', event: 'push', timestamp: new Date().toISOString(), data: { headers, rows } };
  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 10000);
    const r = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mocksheets-Make/1.0' }, body: JSON.stringify(payload), signal: controller.signal });
    clearTimeout(tid);
    res.json({ success: true, message: `✅ Make senaryosu tetiklendi (${(rows || []).length} satır)` });
  } catch (err) {
    if (err.name === 'AbortError') return res.status(408).json({ error: 'Zaman aşımı' });
    res.status(500).json({ error: err.message });
  }
});

router.post('/google-drive/push', async (req, res) => {
  const { headers, rows } = req.body;
  const accessToken = await tokenManager.getValidAccessToken(req.user.id, 'google-drive').catch(() => null);
  if (!accessToken) return res.status(401).json({ error: 'Google Drive bağlı değil. Önce Google hesabınızı bağlayın.' });
  const csv = '\uFEFF' + rowsToCsv(headers, rows);
  const name = `Mocksheets_${new Date().toISOString().slice(0,10)}.csv`;
  const metadata = JSON.stringify({ name, mimeType: 'text/csv' });
  const boundary = '-------mocksheets_boundary';
  const body = `--${boundary}\r\nContent-Type: application/json\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: text/csv\r\n\r\n${csv}\r\n--${boundary}--`;
  try {
    const r = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': `multipart/related; boundary="${boundary}"` },
      body
    });
    if (!r.ok) { const e = await r.json().catch(() => ({})); return res.status(400).json({ error: e.error?.message || `HTTP ${r.status}` }); }
    const file = await r.json();
    res.json({ success: true, message: `✅ "${name}" Google Drive'a yüklendi` });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/google-sheets/push', async (req, res) => {
  const { headers, rows, spreadsheetUrl } = req.body;
  if (!spreadsheetUrl) return res.status(400).json({ error: 'Spreadsheet URL gerekli' });
  const match = spreadsheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) return res.status(400).json({ error: 'Geçersiz Google Sheets URL' });
  const spreadsheetId = match[1];
  const accessToken = await tokenManager.getValidAccessToken(req.user.id, 'google-sheets').catch(() => null);
  if (!accessToken) return res.status(401).json({ error: 'Google Sheets bağlı değil. Önce Google hesabınızı bağlayın.' });
  const { google } = require('googleapis');
  const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  oauth2Client.setCredentials({ access_token: accessToken });
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
  const data = [headers, ...rows].map(r => (r || []).map(c => c ?? ''));
  try {
    await sheets.spreadsheets.values.clear({ spreadsheetId, range: 'Sheet1' });
    await sheets.spreadsheets.values.update({ spreadsheetId, range: 'Sheet1!A1', valueInputOption: 'USER_ENTERED', requestBody: { values: data } });
    res.json({ success: true, message: `✅ ${rows.length} satır Google Sheets'e yazıldı` });
  } catch (err) {
    const code = err.code || err.status;
    if (code === 401) return res.status(401).json({ error: 'Google token süresi doldu. Lütfen yeniden bağlanın.' });
    if (code === 403) return res.status(403).json({ error: "Spreadsheet'e yazma erişiminiz yok." });
    if (code === 404) return res.status(404).json({ error: 'Spreadsheet bulunamadı.' });
    res.status(500).json({ error: err.message });
  }
});

router.post('/gmail/push', async (req, res) => {
  const { headers, rows, to } = req.body;
  if (!to) return res.status(400).json({ error: 'Alıcı e-posta adresi gerekli' });
  const accessToken = await tokenManager.getValidAccessToken(req.user.id, 'gmail').catch(() => null);
  if (!accessToken) return res.status(401).json({ error: 'Gmail bağlı değil. Önce Gmail hesabınızı bağlayın.' });
  const { google } = require('googleapis');
  const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  oauth2Client.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const htmlTable = rowsToHtmlTable(headers, rows);
  const subject = `Mocksheets Verisi — ${new Date().toLocaleDateString('tr-TR')}`;
  const boundary = 'mocksheets_' + Date.now();
  const rawBody = [
    `To: ${to}`, `Subject: ${subject}`, 'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`, '',
    `--${boundary}`, 'Content-Type: text/plain; charset=UTF-8', '',
    `${(rows || []).length} satır, ${(headers || []).length} sütun — Mocksheets`, '',
    `--${boundary}`, 'Content-Type: text/html; charset=UTF-8', '',
    `<p>${(rows || []).length} satır, ${(headers || []).length} sütun</p>${htmlTable}`, '',
    `--${boundary}--`
  ].join('\r\n');
  try {
    const raw = Buffer.from(rawBody).toString('base64url');
    await gmail.users.messages.send({ userId: 'me', requestBody: { raw } });
    res.json({ success: true, message: `✅ ${(rows || []).length} satır ${to} adresine gönderildi` });
  } catch (err) {
    const code = err.code || err.status;
    if (code === 401) return res.status(401).json({ error: 'Gmail token süresi doldu. Lütfen yeniden bağlanın.' });
    res.status(500).json({ error: 'Gmail gönderim hatası: ' + err.message });
  }
});

router.post('/airtable/push', async (req, res) => {
  const { headers, rows, baseId, tableName } = req.body;
  if (!baseId) return res.status(400).json({ error: 'Base ID gerekli' });
  if (!headers?.length || !rows?.length) return res.status(400).json({ error: 'Veri yok' });
  const tokenData = await tokenManager.getToken(req.user.id, 'airtable').catch(() => null);
  if (!tokenData?.accessToken) return res.status(401).json({ error: 'Airtable bağlı değil. Önce API token kaydedin.' });
  const token = tokenData.accessToken;
  const tbl = encodeURIComponent((tableName || 'Table 1').trim());
  const url = `https://api.airtable.com/v0/${baseId.trim()}/${tbl}`;
  const toExport = rows.slice(0, 300);
  let count = 0; const errors = [];
  for (const row of toExport) {
    try {
      const fields = {};
      headers.forEach((h, i) => { if (h?.trim()) fields[h.trim()] = String(row?.[i] ?? ''); });
      const r = await fetchWithRetry(url, { method: 'POST', headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ fields }) });
      if (r.ok) count++; else { const e = await r.json().catch(() => ({})); errors.push(e.error?.message || 'Satır hatası'); }
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (e) { errors.push(e.message); }
  }
  res.json({ success: count > 0, count, total: toExport.length, message: count > 0 ? `✅ ${count} kayıt Airtable'a aktarıldı` : '❌ Aktarım başarısız', errors: errors.slice(0, 5) });
});

router.post('/trello/push', async (req, res) => {
  const { headers, rows, apiKey, boardId } = req.body;
  if (!apiKey || !boardId) return res.status(400).json({ error: 'API Key ve Board ID gerekli' });
  if (!rows?.length) return res.status(400).json({ error: 'Veri yok' });
  const tokenData = await tokenManager.getToken(req.user.id, 'trello').catch(() => null);
  if (!tokenData?.accessToken) return res.status(401).json({ error: 'Trello bağlı değil. Önce Trello token kaydedin.' });
  const token = tokenData.accessToken;
  try {
    const listsRes = await fetch(`https://api.trello.com/1/boards/${boardId.trim()}/lists?key=${apiKey}&token=${token}`);
    if (!listsRes.ok) return res.status(400).json({ error: 'Listeler alınamadı. Board ID veya API Key hatalı olabilir.' });
    const lists = await listsRes.json();
    const targetList = lists[0];
    if (!targetList) return res.status(400).json({ error: 'Board\'da liste bulunamadı' });
    const toExport = rows.slice(0, 100);
    let count = 0; const errors = [];
    for (const row of toExport) {
      try {
        const cardName = String(row?.[0] ?? '').trim() || 'Kart';
        const desc = headers && headers.length > 1 ? headers.slice(1).map((h, i) => `${h}: ${row?.[i + 1] ?? ''}`).join('\n') : '';
        const r = await fetchWithRetry(`https://api.trello.com/1/cards?key=${apiKey}&token=${token}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: cardName, desc, idList: targetList.id }) });
        if (r.ok) count++; else { const e = await r.json().catch(() => ({})); errors.push(e.message || 'Kart hatası'); }
        await new Promise(resolve => setTimeout(resolve, 150));
      } catch (e) { errors.push(e.message); }
    }
    res.json({ success: count > 0, count, total: toExport.length, message: count > 0 ? `✅ ${count} kart Trello'ya oluşturuldu` : '❌ Aktarım başarısız', errors: errors.slice(0, 5) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Integration Status (tüm providerlar) ─────────────────────────────────────
router.get('/status', async (req, res) => {
  try {
    const statuses = await tokenManager.getAllStatuses(req.user.id);
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Disconnect ────────────────────────────────────────────────────────────────
router.delete('/:provider/disconnect', async (req, res) => {
  try {
    await tokenManager.deleteToken(req.user.id, req.params.provider);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Save config (webhook URL, API key, personal token) ────────────────────────
router.post('/:provider/save-config', async (req, res) => {
  const { provider } = req.params;
  const { webhookUrl, token, apiKey, metadata } = req.body;
  const accessToken = token || apiKey || webhookUrl;
  if (!accessToken) return res.status(400).json({ error: 'Token, apiKey veya webhookUrl gerekli' });

  try {
    await tokenManager.saveToken(req.user.id, provider, {
      accessToken,
      refreshToken: null,
      expiresAt: null,
      scopes: [],
      metadata: metadata || (webhookUrl ? { webhookUrl } : {}),
      status: 'active',
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Gmail: E-posta gönder ─────────────────────────────────────────────────────
router.post('/gmail/send', async (req, res) => {
  const { to, subject, body, html } = req.body;
  if (!to || !subject) return res.status(400).json({ error: 'to ve subject zorunlu' });

  const accessToken = await tokenManager.getValidAccessToken(req.user.id, 'gmail').catch(() => null);
  if (!accessToken) return res.status(401).json({ error: 'Gmail bağlı değil. Önce Gmail hesabınızı bağlayın.' });

  try {
    const { google } = require('googleapis');
    const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
    oauth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const boundary = 'mocksheets_' + Date.now();
    const contentType = html ? `multipart/alternative; boundary="${boundary}"` : 'text/plain; charset=UTF-8';
    let rawBody;

    if (html) {
      rawBody = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'MIME-Version: 1.0',
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        'Content-Type: text/plain; charset=UTF-8',
        '',
        body || '',
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset=UTF-8',
        '',
        html,
        '',
        `--${boundary}--`,
      ].join('\r\n');
    } else {
      rawBody = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'MIME-Version: 1.0',
        `Content-Type: ${contentType}`,
        '',
        body || '',
      ].join('\r\n');
    }

    const raw = Buffer.from(rawBody).toString('base64url');
    await gmail.users.messages.send({ userId: 'me', requestBody: { raw } });
    res.json({ ok: true });
  } catch (err) {
    const code = err.code || err.status;
    if (code === 401) return res.status(401).json({ error: 'Gmail token süresi doldu. Lütfen yeniden bağlanın.', code: 'TOKEN_EXPIRED' });
    res.status(500).json({ error: 'Gmail gönderim hatası: ' + err.message });
  }
});

// ── Gmail: Taslak oluştur ─────────────────────────────────────────────────────
router.post('/gmail/draft', async (req, res) => {
  const { to, subject, body, html } = req.body;
  if (!subject) return res.status(400).json({ error: 'subject zorunlu' });

  const accessToken = await tokenManager.getValidAccessToken(req.user.id, 'gmail').catch(() => null);
  if (!accessToken) return res.status(401).json({ error: 'Gmail bağlı değil.' });

  try {
    const { google } = require('googleapis');
    const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
    oauth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const rawBody = [
      to ? `To: ${to}` : '',
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      '',
      body || '',
    ].filter(Boolean).join('\r\n');

    const raw = Buffer.from(rawBody).toString('base64url');
    const draft = await gmail.users.drafts.create({ userId: 'me', requestBody: { message: { raw } } });
    res.json({ ok: true, draftId: draft.data.id });
  } catch (err) {
    res.status(500).json({ error: 'Taslak oluşturma hatası: ' + err.message });
  }
});

// ── Drive: Dosya listesi (DB token kullanarak) ────────────────────────────────
router.get('/drive/files', async (req, res) => {
  const accessToken = await tokenManager.getValidAccessToken(req.user.id, 'google-drive').catch(() => null);
  if (!accessToken) return res.status(401).json({ error: 'Google Drive bağlı değil.' });

  try {
    const { google } = require('googleapis');
    const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
    oauth2Client.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const result = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.spreadsheet' or mimeType='text/csv'",
      fields: 'files(id,name,webViewLink,modifiedTime)',
      orderBy: 'modifiedTime desc',
      pageSize: 20,
    });

    res.json({ success: true, files: result.data.files || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SSRF helper for webhook URL routes
function ssrfCheck(url) {
  const parsed = new URL(url);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Geçersiz protokol');
  if (isPrivateHost(parsed.hostname)) throw new Error('İç ağ adreslerine istek yapılamaz');
}

// ── Discord ────────────────────────────────────────────────────────────────────
router.post('/discord/notify', requireAuth, async (req, res) => {
  const { webhookUrl, title, message, color } = req.body;
  if (!webhookUrl) return res.status(400).json({ error: 'Discord Webhook URL gerekli' });
  try {
    ssrfCheck(webhookUrl);
    const payload = { embeds: [{ title: title || 'Mocksheets Bildirimi', description: message || '', color: color || 5763719 }] };
    const r = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(8000) });
    if (!r.ok) { const t = await r.text(); return res.status(400).json({ error: `Discord hatası: ${t}` }); }
    res.json({ success: true, message: '✅ Discord mesajı gönderildi' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Google Chat ────────────────────────────────────────────────────────────────
router.post('/google-chat/notify', requireAuth, async (req, res) => {
  const { webhookUrl, message } = req.body;
  if (!webhookUrl) return res.status(400).json({ error: 'Google Chat Webhook URL gerekli' });
  try {
    ssrfCheck(webhookUrl);
    const r = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: message || 'Mocksheets bildirimi' }), signal: AbortSignal.timeout(8000) });
    if (!r.ok) { const t = await r.text(); return res.status(400).json({ error: `Google Chat hatası: ${t}` }); }
    res.json({ success: true, message: '✅ Google Chat mesajı gönderildi' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── n8n ───────────────────────────────────────────────────────────────────────
router.post('/n8n/trigger', requireAuth, async (req, res) => {
  const { webhookUrl, event, data } = req.body;
  if (!webhookUrl) return res.status(400).json({ error: 'n8n Webhook URL gerekli' });
  try {
    ssrfCheck(webhookUrl);
    const r = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: 'Mocksheets', event: event || 'automation', timestamp: new Date().toISOString(), data: data || {} }), signal: AbortSignal.timeout(10000) });
    res.json({ success: true, status: r.status, message: `✅ n8n workflow tetiklendi (HTTP ${r.status})` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Pipedream ─────────────────────────────────────────────────────────────────
router.post('/pipedream/trigger', requireAuth, async (req, res) => {
  const { webhookUrl, event, data } = req.body;
  if (!webhookUrl) return res.status(400).json({ error: 'Pipedream Webhook URL gerekli' });
  try {
    ssrfCheck(webhookUrl);
    const r = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: 'Mocksheets', event: event || 'automation', timestamp: new Date().toISOString(), data: data || {} }), signal: AbortSignal.timeout(10000) });
    res.json({ success: true, status: r.status, message: `✅ Pipedream tetiklendi (HTTP ${r.status})` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Zapier ────────────────────────────────────────────────────────────────────
router.post('/zapier/trigger', requireAuth, async (req, res) => {
  const { webhookUrl, data } = req.body;
  if (!webhookUrl) return res.status(400).json({ error: 'Zapier Webhook URL gerekli' });
  try {
    ssrfCheck(webhookUrl);
    const r = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: 'Mocksheets', timestamp: new Date().toISOString(), ...(data || {}) }), signal: AbortSignal.timeout(10000) });
    res.json({ success: true, status: r.status, message: `✅ Zapier Zap tetiklendi (HTTP ${r.status})` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── IFTTT ─────────────────────────────────────────────────────────────────────
router.post('/ifttt/trigger', requireAuth, async (req, res) => {
  const { key, event, value1, value2, value3 } = req.body;
  if (!key || !event) return res.status(400).json({ error: 'IFTTT Key ve Event adı gerekli' });
  try {
    const url = `https://maker.ifttt.com/trigger/${encodeURIComponent(event)}/with/key/${encodeURIComponent(key)}`;
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value1: value1 || '', value2: value2 || '', value3: value3 || '' }), signal: AbortSignal.timeout(8000) });
    if (!r.ok) { const t = await r.text(); return res.status(400).json({ error: `IFTTT hatası: ${t}` }); }
    res.json({ success: true, message: '✅ IFTTT Applet tetiklendi' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── SendGrid ──────────────────────────────────────────────────────────────────
router.post('/sendgrid/send', requireAuth, async (req, res) => {
  const { apiKey, to, from, subject, body } = req.body;
  if (!apiKey || !to || !subject) return res.status(400).json({ error: 'apiKey, to ve subject gerekli' });
  try {
    const payload = {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from || 'noreply@mocksheets.com' },
      subject,
      content: [{ type: 'text/plain', value: body || subject }]
    };
    const r = await fetch('https://api.sendgrid.com/v3/mail/send', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(payload), signal: AbortSignal.timeout(10000) });
    if (!r.ok) { const j = await r.json().catch(() => ({})); return res.status(400).json({ error: j.errors?.[0]?.message || `SendGrid hatası: HTTP ${r.status}` }); }
    res.json({ success: true, message: `✅ SendGrid e-postası gönderildi → ${to}` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Mailchimp ─────────────────────────────────────────────────────────────────
router.post('/mailchimp/subscribe', requireAuth, async (req, res) => {
  const { apiKey, listId, email } = req.body;
  if (!apiKey || !listId || !email) return res.status(400).json({ error: 'apiKey, listId ve email gerekli' });
  const dc = apiKey.split('-').pop();
  if (!dc) return res.status(400).json({ error: 'Geçersiz Mailchimp API Key formatı' });
  try {
    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`;
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}` }, body: JSON.stringify({ email_address: email, status: 'subscribed' }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok && j.title !== 'Member Exists') return res.status(400).json({ error: j.detail || j.title || 'Mailchimp hatası' });
    res.json({ success: true, message: `✅ Mailchimp'e eklendi → ${email}` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Brevo ─────────────────────────────────────────────────────────────────────
router.post('/brevo/send', requireAuth, async (req, res) => {
  const { apiKey, to, subject, body } = req.body;
  if (!apiKey || !to || !subject) return res.status(400).json({ error: 'apiKey, to ve subject gerekli' });
  try {
    const payload = { sender: { email: 'noreply@mocksheets.com', name: 'Mocksheets' }, to: [{ email: to }], subject, textContent: body || subject };
    const r = await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { 'Content-Type': 'application/json', 'api-key': apiKey }, body: JSON.stringify(payload), signal: AbortSignal.timeout(10000) });
    if (!r.ok) { const j = await r.json().catch(() => ({})); return res.status(400).json({ error: j.message || `Brevo hatası: HTTP ${r.status}` }); }
    res.json({ success: true, message: `✅ Brevo e-postası gönderildi → ${to}` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Twilio SMS ────────────────────────────────────────────────────────────────
router.post('/twilio/send', requireAuth, async (req, res) => {
  const { accountSid, authToken, from, to, message } = req.body;
  if (!accountSid || !authToken || !from || !to || !message) return res.status(400).json({ error: 'accountSid, authToken, from, to ve message gerekli' });
  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const body = new URLSearchParams({ From: from, To: to, Body: message });
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}` }, body: body.toString(), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(400).json({ error: j.message || `Twilio hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ SMS gönderildi → ${to} (SID: ${j.sid})` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Telegram ──────────────────────────────────────────────────────────────────
router.post('/telegram/send', requireAuth, async (req, res) => {
  const { botToken, chatId, message } = req.body;
  if (!botToken || !chatId || !message) return res.status(400).json({ error: 'botToken, chatId ve message gerekli' });
  try {
    const url = `https://api.telegram.org/bot${encodeURIComponent(botToken)}/sendMessage`;
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }), signal: AbortSignal.timeout(8000) });
    const j = await r.json();
    if (!j.ok) return res.status(400).json({ error: j.description || 'Telegram hatası' });
    res.json({ success: true, message: `✅ Telegram mesajı gönderildi → chat ${chatId}` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Jira ──────────────────────────────────────────────────────────────────────
router.post('/jira/create-issue', requireAuth, async (req, res) => {
  const { email, apiToken, domain, projectKey, summary, description, issueType } = req.body;
  if (!email || !apiToken || !domain || !projectKey || !summary) return res.status(400).json({ error: 'email, apiToken, domain, projectKey ve summary gerekli' });
  try {
    const url = `https://${domain}.atlassian.net/rest/api/3/issue`;
    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
    const payload = { fields: { project: { key: projectKey }, summary, description: { type: 'doc', version: 1, content: [{ type: 'paragraph', content: [{ type: 'text', text: description || summary }] }] }, issuetype: { name: issueType || 'Task' } } };
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` }, body: JSON.stringify(payload), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(400).json({ error: j.errorMessages?.[0] || Object.values(j.errors || {})[0] || `Jira hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ Jira issue oluşturuldu: ${j.key}`, issueKey: j.key });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Linear ────────────────────────────────────────────────────────────────────
router.post('/linear/create-issue', requireAuth, async (req, res) => {
  const { apiKey, teamId, title, description } = req.body;
  if (!apiKey || !teamId || !title) return res.status(400).json({ error: 'apiKey, teamId ve title gerekli' });
  try {
    const query = `mutation CreateIssue($teamId:String!,$title:String!,$description:String){issueCreate(input:{teamId:$teamId,title:$title,description:$description}){success issue{identifier title url}}}`;
    const r = await fetch('https://api.linear.app/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: apiKey }, body: JSON.stringify({ query, variables: { teamId, title, description: description || '' } }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (j.errors?.length) return res.status(400).json({ error: j.errors[0].message });
    if (!j.data?.issueCreate?.success) return res.status(400).json({ error: 'Linear issue oluşturulamadı' });
    const issue = j.data.issueCreate.issue;
    res.json({ success: true, message: `✅ Linear issue oluşturuldu: ${issue.identifier}`, url: issue.url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GitHub Issues ─────────────────────────────────────────────────────────────
router.post('/github/create-issue', requireAuth, async (req, res) => {
  const { token, owner, repo, title, body } = req.body;
  if (!token || !owner || !repo || !title) return res.status(400).json({ error: 'token, owner, repo ve title gerekli' });
  try {
    const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues`;
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'User-Agent': 'Mocksheets/1.0', Accept: 'application/vnd.github+json' }, body: JSON.stringify({ title, body: body || '' }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(400).json({ error: j.message || `GitHub hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ GitHub issue oluşturuldu: #${j.number}`, url: j.html_url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── ClickUp ───────────────────────────────────────────────────────────────────
router.post('/clickup/create-task', requireAuth, async (req, res) => {
  const { apiKey, listId, name, description } = req.body;
  if (!apiKey || !listId || !name) return res.status(400).json({ error: 'apiKey, listId ve name gerekli' });
  try {
    const url = `https://api.clickup.com/api/v2/list/${encodeURIComponent(listId)}/task`;
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: apiKey }, body: JSON.stringify({ name, description: description || '' }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(400).json({ error: j.err || `ClickUp hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ ClickUp görevi oluşturuldu: ${j.name}`, url: j.url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Asana ─────────────────────────────────────────────────────────────────────
router.post('/asana/create-task', requireAuth, async (req, res) => {
  const { token, projectId, name, notes } = req.body;
  if (!token || !projectId || !name) return res.status(400).json({ error: 'token, projectId ve name gerekli' });
  try {
    const r = await fetch('https://app.asana.com/api/1.0/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ data: { name, notes: notes || '', projects: [projectId] } }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(400).json({ error: j.errors?.[0]?.message || `Asana hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ Asana görevi oluşturuldu: ${j.data?.name}`, url: `https://app.asana.com/0/${projectId}/${j.data?.gid}` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Monday.com ────────────────────────────────────────────────────────────────
router.post('/monday/create-item', requireAuth, async (req, res) => {
  const { apiKey, boardId, itemName } = req.body;
  if (!apiKey || !boardId || !itemName) return res.status(400).json({ error: 'apiKey, boardId ve itemName gerekli' });
  try {
    const query = `mutation { create_item (board_id: ${parseInt(boardId)}, item_name: "${itemName.replace(/"/g, '\\"')}") { id name } }`;
    const r = await fetch('https://api.monday.com/v2', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: apiKey }, body: JSON.stringify({ query }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (j.errors?.length) return res.status(400).json({ error: j.errors[0].message });
    res.json({ success: true, message: `✅ Monday.com öğesi oluşturuldu: ${j.data?.create_item?.name}` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── HubSpot ───────────────────────────────────────────────────────────────────
router.get('/hubspot/pull-data', requireAuth, async (req, res) => {
  try {
    const sb = _getSb();
    const { data: integ } = await sb
      .from('user_integrations')
      .select('access_token')
      .eq('user_id', req.user.id)
      .eq('provider', 'hubspot')
      .single();
    if (!integ?.access_token) return res.status(404).json({ error: 'HubSpot bağlantısı bulunamadı' });

    const { decrypt } = require('../services/encryption');
    const token = decrypt(integ.access_token);

    const hsRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts?limit=100&properties=firstname,lastname,email,phone,lifecyclestage', {
      headers: { 'Authorization': 'Bearer ' + token },
    });
    if (!hsRes.ok) return res.status(hsRes.status).json({ error: 'HubSpot API hatası' });
    const hsData = await hsRes.json();

    const rows = (hsData.results || []).map(c => ([
      c.properties.firstname || '',
      c.properties.lastname || '',
      c.properties.email || '',
      c.properties.phone || '',
      c.properties.lifecyclestage || '',
    ]));

    res.json({ sheets: [{ name: 'HubSpot Contactlar', rows: [['Ad', 'Soyad', 'Email', 'Telefon', 'Aşama'], ...rows] }] });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/hubspot/create-contact', requireAuth, async (req, res) => {
  const { token, email, firstName, lastName } = req.body;
  if (!token || !email) return res.status(400).json({ error: 'token ve email gerekli' });
  try {
    const properties = { email };
    if (firstName) properties.firstname = firstName;
    if (lastName) properties.lastname = lastName;
    const r = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ properties }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(400).json({ error: j.message || `HubSpot hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ HubSpot contact oluşturuldu: ${email}` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── HubSpot: Deal oluştur ─────────────────────────────────────────────────────
router.post('/hubspot/create-deal', requireAuth, async (req, res) => {
  const { token, dealName, amount, pipelineId, stageId } = req.body;
  if (!token || !dealName) return res.status(400).json({ error: 'token ve dealName gerekli' });
  try {
    const r = await fetch('https://api.hubapi.com/crm/v3/objects/deals', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ properties: { dealname: dealName, amount: amount || '', pipeline: pipelineId || 'default', dealstage: stageId || 'appointmentscheduled' } }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.message || `HubSpot hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ HubSpot deal oluşturuldu: ${dealName}`, dealId: j.id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── HubSpot: Contact güncelle ─────────────────────────────────────────────────
router.post('/hubspot/update-contact', requireAuth, async (req, res) => {
  const { token, email, firstName, lastName, phone } = req.body;
  if (!token || !email) return res.status(400).json({ error: 'token ve email gerekli' });
  try {
    // Search for contact by email first
    const searchR = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }] }), signal: AbortSignal.timeout(10000) });
    const searchJ = await searchR.json();
    if (!searchR.ok) return res.status(searchR.status).json({ error: searchJ.message || 'HubSpot arama hatası' });
    const contactId = searchJ.results?.[0]?.id;
    if (!contactId) return res.status(404).json({ error: `${email} e-postasına ait contact bulunamadı` });
    const properties = {};
    if (firstName) properties.firstname = firstName;
    if (lastName) properties.lastname = lastName;
    if (phone) properties.phone = phone;
    const r = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ properties }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.message || `HubSpot hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ HubSpot contact güncellendi: ${email}` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── HubSpot: Not ekle ─────────────────────────────────────────────────────────
router.post('/hubspot/add-note', requireAuth, async (req, res) => {
  const { token, contactEmail, noteBody } = req.body;
  if (!token || !contactEmail || !noteBody) return res.status(400).json({ error: 'token, contactEmail ve noteBody gerekli' });
  try {
    // Search for contact
    const searchR = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: contactEmail }] }] }), signal: AbortSignal.timeout(10000) });
    const searchJ = await searchR.json();
    if (!searchR.ok) return res.status(searchR.status).json({ error: searchJ.message || 'HubSpot arama hatası' });
    const contactId = searchJ.results?.[0]?.id;
    if (!contactId) return res.status(404).json({ error: `${contactEmail} e-postasına ait contact bulunamadı` });
    // Create note engagement
    const r = await fetch('https://api.hubapi.com/crm/v3/objects/notes', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ properties: { hs_note_body: noteBody, hs_timestamp: Date.now() }, associations: [{ to: { id: contactId }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }] }] }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.message || `HubSpot hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ HubSpot nota eklendi`, noteId: j.id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Jira: Yorum ekle ──────────────────────────────────────────────────────────
router.post('/jira/add-comment', requireAuth, async (req, res) => {
  const { email, apiToken, domain, issueKey, comment } = req.body;
  if (!email || !apiToken || !domain || !issueKey || !comment) return res.status(400).json({ error: 'Tüm alanlar gerekli' });
  try {
    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
    const r = await fetch(`https://${domain}.atlassian.net/rest/api/3/issue/${issueKey}/comment`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` }, body: JSON.stringify({ body: { type: 'doc', version: 1, content: [{ type: 'paragraph', content: [{ type: 'text', text: comment }] }] } }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.errorMessages?.[0] || `Jira hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ Jira issue ${issueKey} için yorum eklendi`, commentId: j.id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Jira: Transition uygula ───────────────────────────────────────────────────
router.post('/jira/transition', requireAuth, async (req, res) => {
  const { email, apiToken, domain, issueKey, transitionName } = req.body;
  if (!email || !apiToken || !domain || !issueKey || !transitionName) return res.status(400).json({ error: 'Tüm alanlar gerekli' });
  const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
  const base = `https://${domain}.atlassian.net/rest/api/3`;
  try {
    const tr = await fetch(`${base}/issue/${issueKey}/transitions`, { headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' }, signal: AbortSignal.timeout(10000) });
    const td = await tr.json();
    const transition = (td.transitions || []).find(t => t.name.toLowerCase() === transitionName.toLowerCase());
    if (!transition) return res.status(404).json({ error: `Transition '${transitionName}' bulunamadı` });
    const r = await fetch(`${base}/issue/${issueKey}/transitions`, { method: 'POST', headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ transition: { id: transition.id } }), signal: AbortSignal.timeout(10000) });
    if (r.status === 204) return res.json({ success: true, message: `✅ Jira issue ${issueKey} → ${transitionName}` });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.errorMessages?.[0] || `Jira hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ Jira issue ${issueKey} → ${transitionName}` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Jira: Issue ata ───────────────────────────────────────────────────────────
router.post('/jira/assign', requireAuth, async (req, res) => {
  const { email, apiToken, domain, issueKey, assigneeEmail } = req.body;
  if (!email || !apiToken || !domain || !issueKey || !assigneeEmail) return res.status(400).json({ error: 'Tüm alanlar gerekli' });
  try {
    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
    const base = `https://${domain}.atlassian.net/rest/api/3`;
    // Find accountId by email
    const userR = await fetch(`${base}/user/search?query=${encodeURIComponent(assigneeEmail)}`, { headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' }, signal: AbortSignal.timeout(10000) });
    const users = await userR.json();
    const accountId = Array.isArray(users) ? users[0]?.accountId : null;
    if (!accountId) return res.status(404).json({ error: `${assigneeEmail} kullanıcısı bulunamadı` });
    const r = await fetch(`${base}/issue/${issueKey}/assignee`, { method: 'PUT', headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ accountId }), signal: AbortSignal.timeout(10000) });
    if (r.status === 204) return res.json({ success: true, message: `✅ Jira issue ${issueKey} → ${assigneeEmail} atandı` });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.errorMessages?.[0] || `Jira hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ Jira issue ${issueKey} → ${assigneeEmail} atandı` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GitHub: Yorum ekle ────────────────────────────────────────────────────────
router.post('/github/add-comment', requireAuth, async (req, res) => {
  const { token, owner, repo, issueNumber, body } = req.body;
  if (!token || !owner || !repo || !issueNumber || !body) return res.status(400).json({ error: 'token, owner, repo, issueNumber ve body gerekli' });
  try {
    const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues/${encodeURIComponent(issueNumber)}/comments`;
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'User-Agent': 'Mocksheets/1.0', Accept: 'application/vnd.github+json' }, body: JSON.stringify({ body }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.message || `GitHub hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ GitHub issue #${issueNumber} için yorum eklendi`, url: j.html_url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GitHub: Issue kapat ───────────────────────────────────────────────────────
router.post('/github/close-issue', requireAuth, async (req, res) => {
  const { token, owner, repo, issueNumber } = req.body;
  if (!token || !owner || !repo || !issueNumber) return res.status(400).json({ error: 'token, owner, repo ve issueNumber gerekli' });
  try {
    const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues/${encodeURIComponent(issueNumber)}`;
    const r = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'User-Agent': 'Mocksheets/1.0', Accept: 'application/vnd.github+json' }, body: JSON.stringify({ state: 'closed' }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.message || `GitHub hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ GitHub issue #${issueNumber} kapatıldı`, url: j.html_url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GitHub: PR oluştur ────────────────────────────────────────────────────────
router.post('/github/create-pr', requireAuth, async (req, res) => {
  const { token, owner, repo, title, head, base, body } = req.body;
  if (!token || !owner || !repo || !title || !head) return res.status(400).json({ error: 'token, owner, repo, title ve head gerekli' });
  try {
    const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls`;
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'User-Agent': 'Mocksheets/1.0', Accept: 'application/vnd.github+json' }, body: JSON.stringify({ title, head, base: base || 'main', body: body || '' }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.message || `GitHub hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ GitHub PR oluşturuldu: #${j.number}`, url: j.html_url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Trello: Kart oluştur ──────────────────────────────────────────────────────
router.post('/trello/create-card', requireAuth, async (req, res) => {
  const { apiKey, token, listId, name, desc } = req.body;
  if (!apiKey || !token || !listId || !name) return res.status(400).json({ error: 'apiKey, token, listId ve name gerekli' });
  try {
    const url = `https://api.trello.com/1/cards?key=${encodeURIComponent(apiKey)}&token=${encodeURIComponent(token)}`;
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idList: listId, name, desc: desc || '' }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.message || `Trello hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ Trello kartı oluşturuldu: ${name}`, url: j.url, cardId: j.id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Trello: Yorum ekle ────────────────────────────────────────────────────────
router.post('/trello/add-comment', requireAuth, async (req, res) => {
  const { apiKey, token, cardId, text } = req.body;
  if (!apiKey || !token || !cardId || !text) return res.status(400).json({ error: 'apiKey, token, cardId ve text gerekli' });
  try {
    const url = `https://api.trello.com/1/cards/${encodeURIComponent(cardId)}/actions/comments?key=${encodeURIComponent(apiKey)}&token=${encodeURIComponent(token)}`;
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.message || `Trello hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ Trello kartına yorum eklendi` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Trello: Kart taşı ────────────────────────────────────────────────────────
router.post('/trello/move-card', requireAuth, async (req, res) => {
  const { apiKey, token, cardId, listId } = req.body;
  if (!apiKey || !token || !cardId || !listId) return res.status(400).json({ error: 'apiKey, token, cardId ve listId gerekli' });
  try {
    const url = `https://api.trello.com/1/cards/${encodeURIComponent(cardId)}?key=${encodeURIComponent(apiKey)}&token=${encodeURIComponent(token)}`;
    const r = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idList: listId }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.message || `Trello hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ Trello kartı taşındı`, url: j.url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── ClickUp: Görev güncelle ───────────────────────────────────────────────────
router.post('/clickup/update-task', requireAuth, async (req, res) => {
  const { apiKey, taskId, status, name } = req.body;
  if (!apiKey || !taskId) return res.status(400).json({ error: 'apiKey ve taskId gerekli' });
  try {
    const payload = {};
    if (status) payload.status = status;
    if (name) payload.name = name;
    if (!Object.keys(payload).length) return res.status(400).json({ error: 'Güncellenecek alan (status veya name) gerekli' });
    const url = `https://api.clickup.com/api/v2/task/${encodeURIComponent(taskId)}`;
    const r = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: apiKey }, body: JSON.stringify(payload), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.err || `ClickUp hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ ClickUp görevi güncellendi: ${j.name}`, url: j.url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── ClickUp: Yorum ekle ───────────────────────────────────────────────────────
router.post('/clickup/add-comment', requireAuth, async (req, res) => {
  const { apiKey, taskId, comment } = req.body;
  if (!apiKey || !taskId || !comment) return res.status(400).json({ error: 'apiKey, taskId ve comment gerekli' });
  try {
    const url = `https://api.clickup.com/api/v2/task/${encodeURIComponent(taskId)}/comment`;
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: apiKey }, body: JSON.stringify({ comment_text: comment }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.err || `ClickUp hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ ClickUp görevine yorum eklendi` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Asana: Görevi tamamla ─────────────────────────────────────────────────────
router.post('/asana/complete-task', requireAuth, async (req, res) => {
  const { token, taskId } = req.body;
  if (!token || !taskId) return res.status(400).json({ error: 'token ve taskId gerekli' });
  try {
    const r = await fetch(`https://app.asana.com/api/1.0/tasks/${encodeURIComponent(taskId)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ data: { completed: true } }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.errors?.[0]?.message || `Asana hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ Asana görevi tamamlandı: ${j.data?.name}` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Asana: Yorum ekle ─────────────────────────────────────────────────────────
router.post('/asana/add-comment', requireAuth, async (req, res) => {
  const { token, taskId, text } = req.body;
  if (!token || !taskId || !text) return res.status(400).json({ error: 'token, taskId ve text gerekli' });
  try {
    const r = await fetch(`https://app.asana.com/api/1.0/tasks/${encodeURIComponent(taskId)}/stories`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ data: { text } }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.errors?.[0]?.message || `Asana hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ Asana görevine yorum eklendi` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Notion: Sayfa güncelle ────────────────────────────────────────────────────
router.get('/notion/pull-data', requireAuth, async (req, res) => {
  try {
    const sb = _getSb();
    const { data: integ } = await sb
      .from('user_integrations')
      .select('access_token')
      .eq('user_id', req.user.id)
      .eq('provider', 'notion')
      .single();
    if (!integ?.access_token) return res.status(404).json({ error: 'Notion bağlantısı bulunamadı' });

    const { decrypt } = require('../services/encryption');
    const token = decrypt(integ.access_token);
    const notionHeaders = { 'Authorization': 'Bearer ' + token, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' };

    const searchRes = await fetch('https://api.notion.com/v1/search', {
      method: 'POST',
      headers: notionHeaders,
      body: JSON.stringify({ filter: { property: 'object', value: 'database' } }),
    });
    const searchData = await searchRes.json();
    const firstDb = (searchData.results || [])[0];
    if (!firstDb) return res.json({ sheets: [{ name: 'Notion', rows: [['Veritabanı bulunamadı']] }] });

    const queryRes = await fetch(`https://api.notion.com/v1/databases/${firstDb.id}/query`, {
      method: 'POST', headers: notionHeaders,
    });
    const queryData = await queryRes.json();
    const dbName = firstDb.title?.[0]?.plain_text || 'Database';

    const propKeys = Object.keys(firstDb.properties || {});
    const rows = (queryData.results || []).map(page => propKeys.map(key => {
      const p = page.properties[key];
      if (!p) return '';
      if (p.type === 'title') return p.title?.[0]?.plain_text || '';
      if (p.type === 'rich_text') return p.rich_text?.[0]?.plain_text || '';
      if (p.type === 'number') return p.number != null ? String(p.number) : '';
      if (p.type === 'select') return p.select?.name || '';
      if (p.type === 'multi_select') return (p.multi_select || []).map(s => s.name).join(', ');
      if (p.type === 'date') return p.date?.start || '';
      if (p.type === 'email') return p.email || '';
      if (p.type === 'phone_number') return p.phone_number || '';
      if (p.type === 'checkbox') return p.checkbox ? 'Evet' : 'Hayır';
      return '';
    }));

    res.json({ sheets: [{ name: 'Notion — ' + dbName, rows: [propKeys, ...rows] }] });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/notion/update-page', requireAuth, async (req, res) => {
  const { token, pageId, properties } = req.body;
  if (!token || !pageId) return res.status(400).json({ error: 'token ve pageId gerekli' });
  let props = {};
  try { props = typeof properties === 'string' ? JSON.parse(properties) : (properties || {}); }
  catch (e) { return res.status(400).json({ error: 'Geçersiz JSON properties' }); }
  try {
    const r = await fetch(`https://api.notion.com/v1/pages/${pageId}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' }, body: JSON.stringify({ properties: props }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.message || `Notion hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ Notion sayfası güncellendi` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Airtable: Kayıt güncelle ──────────────────────────────────────────────────
router.post('/airtable/update-record', requireAuth, async (req, res) => {
  const { token, baseId, tableName, recordId, fields } = req.body;
  if (!token || !baseId || !tableName || !recordId) return res.status(400).json({ error: 'token, baseId, tableName ve recordId gerekli' });
  let fieldObj = {};
  try { fieldObj = typeof fields === 'string' ? JSON.parse(fields) : (fields || {}); }
  catch (e) { return res.status(400).json({ error: 'Geçersiz JSON fields' }); }
  try {
    const r = await fetch(`https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableName)}/${encodeURIComponent(recordId)}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: fieldObj }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.error?.message || `Airtable hatası: HTTP ${r.status}` });
    res.json({ success: true, message: `✅ Airtable kaydı güncellendi`, recordId: j.id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Monday.com: Öğe güncelle ──────────────────────────────────────────────────
router.post('/monday/update-item', requireAuth, async (req, res) => {
  const { apiKey, boardId, itemId, columnId, value } = req.body;
  if (!apiKey || !boardId || !itemId || !columnId || value === undefined) return res.status(400).json({ error: 'apiKey, boardId, itemId, columnId ve value gerekli' });
  try {
    const columnValue = JSON.stringify(typeof value === 'string' ? { label: value } : value);
    const query = `mutation { change_column_value (board_id: ${parseInt(boardId)}, item_id: ${parseInt(itemId)}, column_id: "${columnId.replace(/"/g, '\\"')}", value: ${JSON.stringify(columnValue)}) { id } }`;
    const r = await fetch('https://api.monday.com/v2', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: apiKey }, body: JSON.stringify({ query }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (j.errors?.length) return res.status(400).json({ error: j.errors[0].message });
    res.json({ success: true, message: `✅ Monday.com öğesi güncellendi` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Linear: Issue güncelle ────────────────────────────────────────────────────
router.post('/linear/update-issue', requireAuth, async (req, res) => {
  const { apiKey, issueId, stateId, priority } = req.body;
  if (!apiKey || !issueId) return res.status(400).json({ error: 'apiKey ve issueId gerekli' });
  try {
    const input = {};
    if (stateId) input.stateId = stateId;
    if (priority) input.priority = parseInt(priority);
    const query = `mutation UpdateIssue($issueId:String!,$input:IssueUpdateInput!){issueUpdate(id:$issueId,input:$input){success issue{identifier title url}}}`;
    const r = await fetch('https://api.linear.app/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: apiKey }, body: JSON.stringify({ query, variables: { issueId, input } }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (j.errors?.length) return res.status(400).json({ error: j.errors[0].message });
    if (!j.data?.issueUpdate?.success) return res.status(400).json({ error: 'Linear issue güncellenemedi' });
    const issue = j.data.issueUpdate.issue;
    res.json({ success: true, message: `✅ Linear issue güncellendi: ${issue.identifier}`, url: issue.url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Linear: Yorum ekle ────────────────────────────────────────────────────────
router.post('/linear/add-comment', requireAuth, async (req, res) => {
  const { apiKey, issueId, body } = req.body;
  if (!apiKey || !issueId || !body) return res.status(400).json({ error: 'apiKey, issueId ve body gerekli' });
  try {
    const query = `mutation AddComment($issueId:String!,$body:String!){commentCreate(input:{issueId:$issueId,body:$body}){success comment{id}}}`;
    const r = await fetch('https://api.linear.app/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: apiKey }, body: JSON.stringify({ query, variables: { issueId, body } }), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (j.errors?.length) return res.status(400).json({ error: j.errors[0].message });
    if (!j.data?.commentCreate?.success) return res.status(400).json({ error: 'Linear yorumu eklenemedi' });
    res.json({ success: true, message: `✅ Linear issue için yorum eklendi` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Gmail: Taslak oluştur (otomasyon) ────────────────────────────────────────
router.post('/gmail/create-draft', async (req, res) => {
  const { to, subject, body } = req.body;
  if (!subject) return res.status(400).json({ error: 'subject zorunlu' });
  const accessToken = await tokenManager.getValidAccessToken(req.user.id, 'gmail').catch(() => null);
  if (!accessToken) return res.status(401).json({ error: 'Gmail bağlı değil. Önce Gmail hesabınızı bağlayın.' });
  try {
    const { google } = require('googleapis');
    const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
    oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const rawBody = [
      to ? `To: ${to}` : '',
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      '',
      body || '',
    ].filter(Boolean).join('\r\n');
    const raw = Buffer.from(rawBody).toString('base64url');
    const draft = await gmail.users.drafts.create({ userId: 'me', requestBody: { message: { raw } } });
    res.json({ ok: true, draftId: draft.data.id, message: '✅ Gmail taslağı oluşturuldu' });
  } catch (err) {
    const code = err.code || err.status;
    if (code === 401) return res.status(401).json({ error: 'Gmail token süresi doldu. Lütfen yeniden bağlanın.', code: 'TOKEN_EXPIRED' });
    res.status(500).json({ error: 'Taslak oluşturma hatası: ' + err.message });
  }
});

// ── PagerDuty ─────────────────────────────────────────────────────────────────
router.post('/pagerduty/trigger', requireAuth, async (req, res) => {
  const { routingKey, summary, severity } = req.body;
  if (!routingKey || !summary) return res.status(400).json({ error: 'routingKey ve summary gerekli' });
  try {
    const payload = { routing_key: routingKey, event_action: 'trigger', payload: { summary, severity: severity || 'warning', source: 'Mocksheets', timestamp: new Date().toISOString() } };
    const r = await fetch('https://events.pagerduty.com/v2/enqueue', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(400).json({ error: j.message || `PagerDuty hatası: HTTP ${r.status}` });
    res.json({ success: true, message: '✅ PagerDuty incident tetiklendi', dedupKey: j.dedup_key });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Smartsheet ────────────────────────────────────────────────────────────────
router.post('/smartsheet/add-row', requireAuth, async (req, res) => {
  const { apiKey, sheetId, values } = req.body;
  if (!apiKey || !sheetId) return res.status(400).json({ error: 'apiKey ve sheetId gerekli' });
  try {
    const colRes = await fetch(`https://api.smartsheet.com/2.0/sheets/${encodeURIComponent(sheetId)}/columns`, { headers: { Authorization: `Bearer ${apiKey}` }, signal: AbortSignal.timeout(8000) });
    if (!colRes.ok) { const j = await colRes.json(); return res.status(400).json({ error: j.message || 'Smartsheet sheet bulunamadı' }); }
    const cols = (await colRes.json()).data || [];
    const vals = Object.values(values || {});
    const cells = cols.slice(0, vals.length).map((col, i) => ({ columnId: col.id, value: vals[i] || '' }));
    const rowRes = await fetch(`https://api.smartsheet.com/2.0/sheets/${encodeURIComponent(sheetId)}/rows`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` }, body: JSON.stringify([{ toBottom: true, cells }]), signal: AbortSignal.timeout(10000) });
    const j = await rowRes.json();
    if (!rowRes.ok) return res.status(400).json({ error: j.message || `Smartsheet hatası: HTTP ${rowRes.status}` });
    res.json({ success: true, message: "✅ Smartsheet'e satır eklendi" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── WhatsApp Cloud API: Mesaj gönder ──────────────────────────────────────────
router.post('/whatsapp/send', requireAuth, async (req, res) => {
  const { phoneNumberId, to, message, accessToken } = req.body;
  if (!phoneNumberId || !to || !message || !accessToken) {
    return res.status(400).json({ error: 'phoneNumberId, to, message ve accessToken gerekli' });
  }
  try {
    const url = `https://graph.facebook.com/v19.0/${encodeURIComponent(phoneNumberId)}/messages`;
    const payload = { messaging_product: 'whatsapp', to, type: 'text', text: { body: message } };
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` }, body: JSON.stringify(payload), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.error?.message || `WhatsApp hatası: HTTP ${r.status}`, detail: j });
    res.json({ success: true, message: `✅ WhatsApp mesajı gönderildi → ${to}`, messageId: j.messages?.[0]?.id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Google Calendar: Etkinlik oluştur ─────────────────────────────────────────
router.post('/google-calendar/create', requireAuth, async (req, res) => {
  const { calendarId, summary, description, start, end } = req.body;
  if (!summary || !start || !end) {
    return res.status(400).json({ error: 'summary, start ve end gerekli' });
  }
  const accessToken = await tokenManager.getValidAccessToken(req.user.id, 'google').catch(() => null)
    || await tokenManager.getValidAccessToken(req.user.id, 'gmail').catch(() => null);
  if (!accessToken) return res.status(401).json({ error: 'Google hesabı bağlı değil. Önce Google\'ı bağlayın.' });
  try {
    const cal = encodeURIComponent(calendarId || 'primary');
    const toISO = (v) => {
      const d = new Date(v);
      return isNaN(d.getTime()) ? v : d.toISOString();
    };
    const payload = {
      summary,
      description: description || '',
      start: { dateTime: toISO(start) },
      end: { dateTime: toISO(end) },
    };
    const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${cal}/events`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` }, body: JSON.stringify(payload), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.error?.message || `Google Calendar hatası: HTTP ${r.status}`, detail: j });
    res.json({ success: true, message: `✅ Takvim etkinliği oluşturuldu: ${j.summary}`, eventId: j.id, htmlLink: j.htmlLink });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Salesforce: Lead oluştur ──────────────────────────────────────────────────
router.post('/salesforce/create-lead', requireAuth, async (req, res) => {
  const { instanceUrl, accessToken, firstName, lastName, company, email } = req.body;
  if (!instanceUrl || !accessToken || !lastName || !company) {
    return res.status(400).json({ error: 'instanceUrl, accessToken, lastName ve company gerekli' });
  }
  try {
    const base = instanceUrl.replace(/\/+$/, '');
    const payload = { FirstName: firstName || '', LastName: lastName, Company: company, Email: email || '' };
    const r = await fetch(`${base}/services/data/v58.0/sobjects/Lead`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` }, body: JSON.stringify(payload), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) {
      const errMsg = Array.isArray(j) ? (j[0]?.message || j[0]?.errorCode) : (j.message || `Salesforce hatası: HTTP ${r.status}`);
      return res.status(r.status).json({ error: errMsg, detail: j });
    }
    res.json({ success: true, message: `✅ Salesforce lead oluşturuldu: ${lastName}`, leadId: j.id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Pipedrive: Deal oluştur ───────────────────────────────────────────────────
router.post('/pipedrive/create-deal', requireAuth, async (req, res) => {
  const { apiToken, title, value, currency } = req.body;
  if (!apiToken || !title) return res.status(400).json({ error: 'apiToken ve title gerekli' });
  try {
    const url = `https://api.pipedrive.com/v1/deals?api_token=${encodeURIComponent(apiToken)}`;
    const numericValue = value !== undefined && value !== null && value !== '' ? Number(String(value).replace(',', '.')) : undefined;
    const payload = { title };
    if (numericValue !== undefined && !isNaN(numericValue)) payload.value = numericValue;
    if (currency) payload.currency = currency;
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok || j.success === false) return res.status(r.ok ? 400 : r.status).json({ error: j.error || `Pipedrive hatası: HTTP ${r.status}`, detail: j.error_info });
    res.json({ success: true, message: `✅ Pipedrive deal oluşturuldu: ${title}`, dealId: j.data?.id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── HubSpot: Ticket oluştur ───────────────────────────────────────────────────
router.post('/hubspot/create-ticket', requireAuth, async (req, res) => {
  const { apiKey, subject, content, priority } = req.body;
  if (!apiKey || !subject) return res.status(400).json({ error: 'apiKey ve subject gerekli' });
  try {
    const priorityMap = { LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH' };
    const mappedPriority = priorityMap[String(priority || 'MEDIUM').toUpperCase()] || 'MEDIUM';
    const payload = {
      properties: {
        subject,
        content: content || '',
        hs_pipeline: '0',
        hs_pipeline_stage: '1',
        hs_ticket_priority: mappedPriority,
      },
    };
    const r = await fetch('https://api.hubapi.com/crm/v3/objects/tickets', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(payload), signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: j.message || `HubSpot hatası: HTTP ${r.status}`, detail: j });
    res.json({ success: true, message: `✅ HubSpot ticket oluşturuldu: ${subject}`, ticketId: j.id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Jira: Öncelik ayarla ──────────────────────────────────────────────────────
router.post('/jira/set-priority', requireAuth, async (req, res) => {
  const { email, apiToken, domain, issueKey, priority } = req.body;
  if (!email || !apiToken || !domain || !issueKey || !priority) {
    return res.status(400).json({ error: 'email, apiToken, domain, issueKey ve priority gerekli' });
  }
  try {
    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
    const url = `https://${domain}.atlassian.net/rest/api/3/issue/${encodeURIComponent(issueKey)}`;
    const payload = { fields: { priority: { name: priority } } };
    const r = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` }, body: JSON.stringify(payload), signal: AbortSignal.timeout(10000) });
    if (r.status === 204) return res.json({ success: true, message: `✅ Jira issue ${issueKey} → öncelik: ${priority}` });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(r.status).json({ error: j.errorMessages?.[0] || Object.values(j.errors || {})[0] || `Jira hatası: HTTP ${r.status}`, detail: j });
    res.json({ success: true, message: `✅ Jira issue ${issueKey} → öncelik: ${priority}` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── HubSpot OAuth ─────────────────────────────────────────────────────────
router.get('/hubspot/connect', async (req, res) => {
  const { token } = req.query;
  if (!process.env.HUBSPOT_CLIENT_ID || !process.env.HUBSPOT_REDIRECT_URI) {
    return res.status(500).send('HubSpot yapılandırılmadı (env eksik)');
  }
  const state = Buffer.from(JSON.stringify({ token })).toString('base64');
  res.redirect(
    'https://app.hubspot.com/oauth/authorize' +
    '?client_id=' + encodeURIComponent(process.env.HUBSPOT_CLIENT_ID) +
    '&redirect_uri=' + encodeURIComponent(process.env.HUBSPOT_REDIRECT_URI) +
    '&scope=' + encodeURIComponent('crm.objects.contacts.read crm.objects.contacts.write') +
    '&state=' + encodeURIComponent(state)
  );
});

router.get('/hubspot/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const { token } = JSON.parse(Buffer.from(state, 'base64').toString());
    const sb = _getSb();
    const { data: { user } } = await sb.auth.getUser(token);
    if (!user) return res.status(401).send('Geçersiz oturum');
    const t = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.HUBSPOT_CLIENT_ID,
        client_secret: process.env.HUBSPOT_CLIENT_SECRET,
        redirect_uri: process.env.HUBSPOT_REDIRECT_URI,
        code
      })
    }).then(r => r.json());
    if (!t.access_token) return res.status(400).send('HubSpot token alınamadı: ' + (t.message || ''));
    await sb.from('user_integrations').upsert({
      user_id: user.id, provider: 'hubspot', status: 'active',
      metadata: {
        access_token: t.access_token,
        refresh_token: t.refresh_token,
        expires_at: Date.now() + (t.expires_in || 0) * 1000
      }
    }, { onConflict: 'user_id,provider' });
    res.redirect((process.env.CLIENT_URL || '') + '/app.html?integration=hubspot');
  } catch (e) {
    console.error('[hubspot/callback]', e);
    res.status(500).send('HubSpot bağlantı hatası: ' + e.message);
  }
});

// ── Stripe Connect OAuth ──────────────────────────────────────────────────
router.get('/stripe-connect/connect', async (req, res) => {
  const { token } = req.query;
  if (!process.env.STRIPE_CONNECT_CLIENT_ID) {
    return res.status(500).send('Stripe Connect yapılandırılmadı (env eksik)');
  }
  const state = Buffer.from(JSON.stringify({ token })).toString('base64');
  res.redirect(
    'https://connect.stripe.com/oauth/authorize' +
    '?response_type=code' +
    '&client_id=' + encodeURIComponent(process.env.STRIPE_CONNECT_CLIENT_ID) +
    '&scope=read_write' +
    '&state=' + encodeURIComponent(state)
  );
});

router.get('/stripe-connect/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const { token } = JSON.parse(Buffer.from(state, 'base64').toString());
    const sb = _getSb();
    const { data: { user } } = await sb.auth.getUser(token);
    if (!user) return res.status(401).send('Geçersiz oturum');
    const resp = await fetch('https://connect.stripe.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_secret: process.env.STRIPE_SECRET_KEY,
        code, grant_type: 'authorization_code'
      })
    }).then(r => r.json());
    if (!resp.access_token) return res.status(400).send('Stripe token alınamadı: ' + (resp.error_description || ''));
    await sb.from('user_integrations').upsert({
      user_id: user.id, provider: 'stripe-connect', status: 'active',
      metadata: {
        stripe_user_id: resp.stripe_user_id,
        access_token: resp.access_token,
        refresh_token: resp.refresh_token
      }
    }, { onConflict: 'user_id,provider' });
    res.redirect((process.env.CLIENT_URL || '') + '/app.html?integration=stripe');
  } catch (e) {
    console.error('[stripe-connect/callback]', e);
    res.status(500).send('Stripe bağlantı hatası: ' + e.message);
  }
});

// ── Notion token save ─────────────────────────────────────────────────────
router.post('/notion/save-token', requireAuth, async (req, res) => {
  const { token: notionToken } = req.body;
  if (!notionToken || !notionToken.startsWith('secret_')) {
    return res.status(400).json({ error: 'Geçersiz Notion token' });
  }
  try {
    const test = await fetch('https://api.notion.com/v1/users/me', {
      headers: { 'Authorization': 'Bearer ' + notionToken, 'Notion-Version': '2022-06-28' }
    });
    if (!test.ok) return res.status(400).json({ error: 'Notion doğrulanamadı' });
    const sb = _getSb();
    await sb.from('user_integrations').upsert({
      user_id: req.user.id, provider: 'notion', status: 'active',
      metadata: { token: notionToken }
    }, { onConflict: 'user_id,provider' });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Favorite Commands ─────────────────────────────────────────────────────
router.get('/favorite-commands', requireAuth, async (req, res) => {
  try {
    const sb = _getSb();
    const { data, error } = await sb
      .from('favorite_commands')
      .select('id, command_text')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    if (error) throw error;
    res.json({ favorites: data || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/favorite-commands', requireAuth, async (req, res) => {
  try {
    const { command_text } = req.body;
    if (!command_text) return res.status(400).json({ error: 'Komut metni gerekli' });
    const sb = _getSb();
    const { data, error } = await sb
      .from('favorite_commands')
      .insert({ user_id: req.user.id, command_text })
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/favorite-commands/:id', requireAuth, async (req, res) => {
  try {
    const sb = _getSb();
    await sb.from('favorite_commands').delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/health-snapshot', requireAuth, async (req, res) => {
  try {
    const { score, totalProducts } = req.body;
    if (typeof score !== 'number') return res.status(400).json({ error: 'score required' });
    const sb = _getSb();
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const { data: existing } = await sb
      .from('health_score_snapshots')
      .select('id')
      .eq('user_id', req.user.id)
      .gte('recorded_at', todayStart.toISOString())
      .maybeSingle();
    if (existing) {
      await sb.from('health_score_snapshots')
        .update({ score, total_products: totalProducts })
        .eq('id', existing.id);
    } else {
      await sb.from('health_score_snapshots')
        .insert({ user_id: req.user.id, score, total_products: totalProducts });
    }
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/health-history', requireAuth, async (req, res) => {
  try {
    const sb = _getSb();
    const { data, error } = await sb
      .from('health_score_snapshots')
      .select('score, recorded_at')
      .eq('user_id', req.user.id)
      .order('recorded_at', { ascending: true })
      .limit(30);
    if (error) throw error;
    res.json({ history: data || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/ai-visibility-check', requireAuth, async (req, res) => {
  try {
    const { query_text, platform, mocksheets_mentioned, position_note } = req.body;
    const sb = _getSb();
    const { data, error } = await sb
      .from('ai_visibility_checks')
      .insert({ user_id: req.user.id, query_text, platform, mocksheets_mentioned, position_note })
      .select().single();
    if (error) throw error;
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/ai-visibility-checks', requireAuth, async (req, res) => {
  try {
    const sb = _getSb();
    const { data, error } = await sb
      .from('ai_visibility_checks')
      .select('*')
      .eq('user_id', req.user.id)
      .order('checked_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    res.json({ checks: data || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
