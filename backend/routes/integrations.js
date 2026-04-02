'use strict';
const express = require('express');
const router  = express.Router();
const fetch   = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── Soft auth (optional) ─────────────────────────
async function getUser(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser(token);
    return user || null;
  } catch { return null; }
}

// ── Log helper (non-blocking) ────────────────────
async function logEvent(userId, provider, event, status, details = {}, rows = 0) {
  if (!userId) return;
  try {
    await supabase.from('integration_logs').insert({
      user_id: userId, provider, event, status, details, rows_affected: rows
    });
  } catch {}
}

// ── Format Notion DB ID ──────────────────────────
function formatNotionId(raw) {
  const clean = raw.replace(/-/g, '').replace(/[^a-f0-9]/gi, '');
  if (clean.length !== 32) return raw;
  return `${clean.slice(0,8)}-${clean.slice(8,12)}-${clean.slice(12,16)}-${clean.slice(16,20)}-${clean.slice(20)}`;
}

// ════════════════════════════════════════════════
//  GET /api/integrations  — saved configs
// ════════════════════════════════════════════════
router.get('/', async (req, res) => {
  const user = await getUser(req);
  if (!user) return res.json([]);

  const { data, error } = await supabase
    .from('user_integrations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// ════════════════════════════════════════════════
//  POST /api/integrations/save
// ════════════════════════════════════════════════
router.post('/save', async (req, res) => {
  const user = await getUser(req);
  const { provider, config } = req.body;
  const VALID = ['google_sheets', 'notion', 'webhook'];
  if (!VALID.includes(provider)) return res.status(400).json({ error: 'Geçersiz provider' });

  if (user) {
    const { data, error } = await supabase
      .from('user_integrations')
      .upsert({
        user_id: user.id, provider, config,
        status: 'active', updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,provider' })
      .select().single();
    if (error) return res.status(500).json({ error: error.message });
    await logEvent(user.id, provider, 'save', 'success');
    return res.json(data);
  }

  res.json({ success: true, provider });
});

// ════════════════════════════════════════════════
//  GET /api/integrations/logs
// ════════════════════════════════════════════════
router.get('/logs', async (req, res) => {
  const user = await getUser(req);
  if (!user) return res.json([]);

  const { data, error } = await supabase
    .from('integration_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// ════════════════════════════════════════════════
//  POST /api/integrations/notion/test
// ════════════════════════════════════════════════
router.post('/notion/test', async (req, res) => {
  const { token, dbId } = req.body;
  if (!token) return res.status(400).json({ error: 'Token gerekli' });

  const user = await getUser(req);

  try {
    // 1. Token kontrolü
    const userRes = await fetch('https://api.notion.com/v1/users/me', {
      headers: { 'Authorization': 'Bearer ' + token, 'Notion-Version': '2022-06-28' }
    });

    if (!userRes.ok) {
      const err = await userRes.json();
      return res.status(400).json({ error: 'Geçersiz token: ' + (err.message || 'Yetkilendirme hatası') });
    }

    // 2. Database kontrolü (varsa)
    if (dbId) {
      const formatted = formatNotionId(dbId);
      const dbRes = await fetch('https://api.notion.com/v1/databases/' + formatted, {
        headers: { 'Authorization': 'Bearer ' + token, 'Notion-Version': '2022-06-28' }
      });

      if (!dbRes.ok) {
        const err = await dbRes.json();
        return res.status(400).json({
          error: 'Database bulunamadı: ' + (err.message || 'ID hatalı veya erişim yok')
        });
      }

      const dbData = await dbRes.json();
      await logEvent(user?.id, 'notion', 'test', 'success');
      return res.json({
        success: true,
        dbName: dbData.title?.[0]?.plain_text || 'Database bulundu'
      });
    }

    await logEvent(user?.id, 'notion', 'test', 'success');
    res.json({ success: true, message: 'Token geçerli' });

  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası: ' + err.message });
  }
});

// ════════════════════════════════════════════════
//  POST /api/integrations/notion/export
// ════════════════════════════════════════════════
router.post('/notion/export', async (req, res) => {
  const { token, databaseId, headers, rows } = req.body;

  if (!token)      return res.status(400).json({ error: 'Token gerekli' });
  if (!databaseId) return res.status(400).json({ error: 'Database ID gerekli' });
  if (!headers?.length) return res.status(400).json({ error: 'Header yok' });
  if (!rows?.length)    return res.status(400).json({ error: 'Veri yok' });

  const user = await getUser(req);
  const formattedId = formatNotionId(databaseId);

  // DB erişim kontrolü
  const dbRes = await fetch('https://api.notion.com/v1/databases/' + formattedId, {
    headers: { 'Authorization': 'Bearer ' + token, 'Notion-Version': '2022-06-28' }
  });

  if (!dbRes.ok) {
    const err = await dbRes.json();
    return res.status(400).json({ error: 'Database erişim hatası: ' + (err.message || 'Yetki yok') });
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

        // Sayı
        const numStr = val.replace(/[₺$€,\s]/g, '').replace(',', '.');
        const num = Number(numStr);
        if (val !== '' && !isNaN(num) && isFinite(num)) {
          properties[propName] = { number: num };
        // ISO tarih
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
          properties[propName] = { date: { start: val } };
        // Türkçe tarih GG.AA.YYYY
        } else if (/^\d{2}\.\d{2}\.\d{4}$/.test(val)) {
          const [d, m, y] = val.split('.');
          properties[propName] = { date: { start: `${y}-${m}-${d}` } };
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

      if (pageRes.ok) { count++; }
      else { const e = await pageRes.json(); errors.push(e.message || 'Satır hatası'); }

      // Rate limit: ~3 req/s
      await new Promise(r => setTimeout(r, 350));

    } catch (e) { errors.push(e.message); }
  }

  await logEvent(user?.id, 'notion', 'export',
    count > 0 ? 'success' : 'error',
    { errors: errors.slice(0, 3) }, count);

  res.json({ success: count > 0, count, total: toExport.length, errors: errors.slice(0, 5) });
});

// ════════════════════════════════════════════════
//  POST /api/integrations/sheets/export
// ════════════════════════════════════════════════
router.post('/sheets/export', async (req, res) => {
  const { sheetId, data, sheetName } = req.body;
  if (!sheetId || !data?.length) {
    return res.status(400).json({ error: 'Sheet ID ve veri gerekli' });
  }

  const user = await getUser(req);
  const match = sheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  const id = match ? match[1] : sheetId;

  // BOM ile UTF-8 CSV (Türkçe karakter desteği)
  const csv = '\uFEFF' + data.map(row =>
    (row || []).map(c => '"' + String(c ?? '').replace(/"/g, '""') + '"').join(',')
  ).join('\r\n');

  await logEvent(user?.id, 'google_sheets', 'export', 'success',
    { sheetId: id, sheetName }, data.length);

  res.json({
    success: true,
    csv,
    rows: data.length,
    sheetName: sheetName || 'Sheet1',
    sheetUrl: `https://docs.google.com/spreadsheets/d/${id}`
  });
});

// ════════════════════════════════════════════════
//  POST /api/integrations/webhook/send
// ════════════════════════════════════════════════
router.post('/webhook/send', async (req, res) => {
  const { url, event, data, secret } = req.body;
  if (!url) return res.status(400).json({ error: 'URL gerekli' });

  // Güvenlik: sadece http/https
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return res.status(400).json({ error: 'Geçersiz URL protokolü' });
    }
  } catch {
    return res.status(400).json({ error: 'Geçersiz URL formatı' });
  }

  const user = await getUser(req);

  const payload = {
    source: 'Mocksheet',
    event: event || 'manual',
    timestamp: new Date().toISOString(),
    data: data || {}
  };

  const hdrs = { 'Content-Type': 'application/json' };
  if (secret) hdrs['X-Webhook-Secret'] = secret;

  try {
    const controller = new (require('abort-controller'))();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const r = await fetch(url, {
      method: 'POST', headers: hdrs,
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeout);

    await logEvent(user?.id, 'webhook', 'webhook_sent',
      r.ok ? 'success' : 'error', { url, status: r.status });

    res.json({ success: true, status: r.status });

  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(408).json({ error: 'Timeout: endpoint yanıt vermedi (10s)' });
    }
    await logEvent(user?.id, 'webhook', 'webhook_sent', 'error', { url, error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════
//  DELETE /api/integrations/:provider
// ════════════════════════════════════════════════
router.delete('/:provider', async (req, res) => {
  const user = await getUser(req);
  if (!user) return res.json({ success: true });

  const { error } = await supabase
    .from('user_integrations')
    .update({ status: 'inactive', config: {} })
    .eq('user_id', user.id)
    .eq('provider', req.params.provider);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
