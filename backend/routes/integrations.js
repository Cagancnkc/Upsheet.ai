'use strict';
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// ── Notion: Token test ───────────────────────────
router.post('/notion/test', async (req, res) => {
  const { token, dbId } = req.body;
  if (!token) return res.status(400).json({ error: 'Token giriniz' });

  try {
    const userRes = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Notion-Version': '2022-06-28'
      }
    });

    if (!userRes.ok) {
      const err = await userRes.json().catch(() => ({}));
      return res.status(400).json({
        error: 'Geçersiz token: ' + (err.message || 'Yetkilendirme başarısız')
      });
    }

    if (dbId && dbId.trim()) {
      const cleanId = dbId.replace(/-/g, '');
      const formatted = cleanId.length === 32
        ? [cleanId.slice(0,8), cleanId.slice(8,12),
           cleanId.slice(12,16), cleanId.slice(16,20),
           cleanId.slice(20)].join('-')
        : dbId.trim();

      const dbRes = await fetch('https://api.notion.com/v1/databases/' + formatted, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Notion-Version': '2022-06-28'
        }
      });

      if (!dbRes.ok) {
        const err = await dbRes.json().catch(() => ({}));
        return res.status(400).json({
          error: 'Database bulunamadı: ' + (err.message ||
            'ID hatalı veya entegrasyona erişim verilmemiş')
        });
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
    ? [cleanId.slice(0,8), cleanId.slice(8,12),
       cleanId.slice(12,16), cleanId.slice(16,20),
       cleanId.slice(20)].join('-')
    : databaseId.trim();

  const dbCheck = await fetch('https://api.notion.com/v1/databases/' + formattedId, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Notion-Version': '2022-06-28'
    }
  }).catch(() => null);

  if (!dbCheck || !dbCheck.ok) {
    return res.status(400).json({
      error: "Database erişimi başarısız. Token ve ID'yi kontrol edin."
    });
  }

  let count = 0;
  const errors = [];
  const MAX = 100;
  const toExport = rows.slice(0, MAX);

  for (const row of toExport) {
    try {
      const properties = {};

      headers.forEach((header, i) => {
        if (!header?.trim()) return;
        const val = String(row?.[i] ?? '').trim();
        const propName = header.trim();

        if (i === 0) {
          properties[propName] = {
            title: [{ type: 'text', text: { content: val.slice(0, 2000) } }]
          };
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
          const iso = parts[2] + '-' + parts[1] + '-' + parts[0];
          properties[propName] = { date: { start: iso } };
        } else {
          properties[propName] = {
            rich_text: [{ type: 'text', text: { content: val.slice(0, 2000) } }]
          };
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

      if (pageRes.ok) {
        count++;
      } else {
        const e = await pageRes.json().catch(() => ({}));
        errors.push(e.message || 'Satır hatası');
      }

      await new Promise(r => setTimeout(r, 340));
    } catch (e) {
      errors.push(e.message);
    }
  }

  res.json({ success: count > 0, count, total: toExport.length, errors: errors.slice(0, 5) });
});

// ── Google Sheets: CSV export ────────────────────
router.post('/sheets/export', async (req, res) => {
  const { sheetId, data, sheetName } = req.body;
  if (!sheetId || !data?.length) {
    return res.status(400).json({ error: 'Sheet ID ve veri gerekli' });
  }

  const match = sheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  const id = match ? match[1] : sheetId.trim();

  const csv = '\uFEFF' + data.map(row =>
    (row || []).map(c =>
      '"' + String(c ?? '').replace(/"/g, '""') + '"'
    ).join(',')
  ).join('\r\n');

  res.json({
    success: true,
    csv,
    sheetUrl: 'https://docs.google.com/spreadsheets/d/' + id,
    rows: data.length,
    sheetName: sheetName || 'Sheet1',
    sheetId: id
  });
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
    source: 'Mocksheet',
    event: event || 'manual',
    timestamp: new Date().toISOString(),
    data: data || {}
  };

  const reqHeaders = { 'Content-Type': 'application/json' };
  if (secret) reqHeaders['X-Webhook-Secret'] = secret;

  try {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 10000) : null;

    const fetchOpts = { method: 'POST', headers: reqHeaders, body: JSON.stringify(payload) };
    if (controller) fetchOpts.signal = controller.signal;

    const r = await fetch(url, fetchOpts);
    if (timeoutId) clearTimeout(timeoutId);

    res.json({ success: true, status: r.status });
  } catch (err) {
    if (err.name === 'AbortError') {
      res.status(408).json({ error: 'Zaman aşımı: endpoint yanıt vermedi' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// ── Slack: Test ──────────────────────────────────
router.post('/slack/test', async (req, res) => {
  const { webhookUrl, message } = req.body;
  if (!webhookUrl) {
    return res.status(400).json({ error: 'Slack webhook URL giriniz' });
  }

  const payload = {
    text: message || '✅ Mocksheet bağlantı testi başarılı!',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*🔗 Mocksheet Bağlantı Testi*\n' +
                (message || 'Slack entegrasyonu başarıyla kuruldu!')
        }
      },
      {
        type: 'context',
        elements: [{
          type: 'mrkdwn',
          text: '📅 ' + new Date().toLocaleString('tr-TR') + ' • Mocksheet'
        }]
      }
    ]
  };

  try {
    const r = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await r.text();
    if (text === 'ok' || r.ok) {
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Slack hatası: ' + text });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Slack: Notify ────────────────────────────────
router.post('/slack/notify', async (req, res) => {
  const { webhookUrl, title, message, fields } = req.body;
  if (!webhookUrl) return res.status(400).json({ error: 'Webhook URL gerekli' });

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: title || 'Mocksheet Bildirimi', emoji: true }
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: message || '' }
    }
  ];

  if (fields?.length) {
    blocks.push({
      type: 'section',
      fields: fields.map(f => ({
        type: 'mrkdwn',
        text: '*' + f.label + ':*\n' + f.value
      }))
    });
  }

  blocks.push({ type: 'divider' });
  blocks.push({
    type: 'context',
    elements: [{
      type: 'mrkdwn',
      text: '📅 ' + new Date().toLocaleString('tr-TR') + ' • Mocksheet'
    }]
  });

  try {
    const r = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: title || 'Mocksheet', blocks })
    });
    const text = await r.text();
    res.json({ success: text === 'ok' || r.ok });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
