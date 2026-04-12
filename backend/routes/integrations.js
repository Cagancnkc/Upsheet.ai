'use strict';
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
// ── Google Sheets: CSV download ──────────────────
router.post('/sheets/export', async (req, res) => {
  const { sheetData, fileName } = req.body;
  if (!sheetData?.length) {
    return res.status(400).json({ error: 'Dışa aktarılacak veri yok' });
  }

  const csv = sheetData.map(row =>
    (row || []).map(cell => {
      const str = String(cell ?? '');
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    }).join(',')
  ).join('\n');

  const bom = '\uFEFF';
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName || 'mocksheets-export'}.csv"`);
  res.send(bom + csv);
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
  const toExport = rows.slice(0, 100);

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

      const pageRes = await fetch('https://api.notion.com/v1/pages', {
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

// ── Webhook: Send ────────────────────────────────
router.post('/webhook/send', async (req, res) => {
  const { url, event, data, secret } = req.body;
  if (!url) return res.status(400).json({ error: 'URL gerekli' });

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return res.status(400).json({ error: 'Geçersiz URL protokolü' });
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

module.exports = router;
