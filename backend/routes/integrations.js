'use strict';
const MSFT_TENANT = 'common';
const MSFT_SCOPES = 'Files.ReadWrite User.Read offline_access';
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const tokenManager = require('../services/tokenManager');

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
      const str = String(cell ?? '');
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

module.exports = router;
