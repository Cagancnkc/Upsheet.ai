'use strict';
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── Auth middleware ──────────────────────────────
async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });

  req.user = user;
  next();
}

// ── Log helper ───────────────────────────────────
async function logEvent(userId, provider, event, status, details = {}, rows = 0) {
  try {
    await supabase.from('integration_logs').insert({
      user_id: userId,
      provider,
      event,
      status,
      details,
      rows_affected: rows
    });
  } catch (e) { /* non-blocking */ }
}

// ── GET /api/integrations ─────────────────────────
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('user_integrations')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// ── POST /api/integrations/save ───────────────────
router.post('/save', requireAuth, async (req, res) => {
  const { provider, config } = req.body;

  const VALID = ['google_sheets', 'notion', 'webhook'];
  if (!VALID.includes(provider)) {
    return res.status(400).json({ error: 'Invalid provider' });
  }

  const { data, error } = await supabase
    .from('user_integrations')
    .upsert({
      user_id: req.user.id,
      provider,
      config,
      status: 'active',
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,provider' })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  await logEvent(req.user.id, provider, 'save', 'success');
  res.json(data);
});

// ── DELETE /api/integrations/:provider ───────────
router.delete('/:provider', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('user_integrations')
    .update({ status: 'inactive', config: {} })
    .eq('user_id', req.user.id)
    .eq('provider', req.params.provider);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ── POST /api/integrations/notion/test ───────────
router.post('/notion/test', requireAuth, async (req, res) => {
  const { token, dbId } = req.body;
  if (!token) return res.status(400).json({ error: 'Token required' });

  try {
    const url = dbId
      ? `https://api.notion.com/v1/databases/${dbId}`
      : 'https://api.notion.com/v1/users/me';

    const r = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28'
      }
    });
    const data = await r.json();

    if (!r.ok) {
      await logEvent(req.user.id, 'notion', 'test', 'error', { error: data.message });
      return res.status(400).json({ error: data.message || 'Invalid credentials' });
    }

    await logEvent(req.user.id, 'notion', 'test', 'success');
    res.json({
      success: true,
      name: data.title?.[0]?.plain_text || 'Connected'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/integrations/notion/export ─────────
router.post('/notion/export', requireAuth, async (req, res) => {
  const { token, databaseId, headers, rows } = req.body;

  if (!token || !databaseId || !headers || !rows) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Verify DB access
  const dbCheck = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28'
    }
  });
  if (!dbCheck.ok) {
    const err = await dbCheck.json();
    return res.status(400).json({
      error: 'Database access failed: ' + (err.message || 'Check token and database ID')
    });
  }

  let count = 0;
  const errors = [];
  const toExport = rows.slice(0, 100);

  for (const row of toExport) {
    try {
      const properties = {};
      headers.forEach((header, i) => {
        if (!header?.trim()) return;
        const val = String(row[i] ?? '').trim();

        if (i === 0) {
          properties[header] = {
            title: [{ type: 'text', text: { content: val.slice(0, 2000) } }]
          };
        } else {
          const num = parseFloat(val.replace(',', '.'));
          if (!isNaN(num) && val !== '') {
            properties[header] = { number: num };
          } else if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
            properties[header] = { date: { start: val } };
          } else {
            properties[header] = {
              rich_text: [{ type: 'text', text: { content: val.slice(0, 2000) } }]
            };
          }
        }
      });

      const r = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ parent: { database_id: databaseId }, properties })
      });

      if (r.ok) { count++; }
      else { const e = await r.json(); errors.push(e.message); }

      await new Promise(resolve => setTimeout(resolve, 340));
    } catch (e) { errors.push(e.message); }
  }

  await logEvent(req.user.id, 'notion', 'export',
    count > 0 ? 'success' : 'error',
    { errors: errors.slice(0, 3) }, count);

  await supabase.from('user_integrations')
    .update({ last_used_at: new Date().toISOString() })
    .eq('user_id', req.user.id)
    .eq('provider', 'notion');

  res.json({ success: true, count, total: toExport.length, errors: errors.slice(0, 5) });
});

// ── POST /api/integrations/sheets/export ─────────
router.post('/sheets/export', requireAuth, async (req, res) => {
  const { sheetId, data, sheetName } = req.body;
  if (!sheetId || !data) {
    return res.status(400).json({ error: 'sheetId and data required' });
  }

  const match = sheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  const id = match ? match[1] : sheetId;

  const csv = '\uFEFF' + data.map(row =>
    (row || []).map(c => '"' + String(c ?? '').replace(/"/g, '""') + '"').join(',')
  ).join('\n');

  await logEvent(req.user.id, 'google_sheets', 'export', 'success',
    { sheetId: id, sheetName }, data.length);

  await supabase.from('user_integrations')
    .update({ last_used_at: new Date().toISOString() })
    .eq('user_id', req.user.id)
    .eq('provider', 'google_sheets');

  res.json({
    success: true,
    csv,
    sheetUrl: `https://docs.google.com/spreadsheets/d/${id}`
  });
});

// ── POST /api/integrations/webhook/send ──────────
router.post('/webhook/send', requireAuth, async (req, res) => {
  const { url, event, data } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  const payload = {
    source: 'Mocksheet',
    event: event || 'manual',
    user_id: req.user.id,
    timestamp: new Date().toISOString(),
    data: data || {}
  };

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });

    await logEvent(req.user.id, 'webhook', 'webhook_sent',
      r.ok ? 'success' : 'error', { url, status: r.status });

    await supabase.from('user_integrations')
      .update({ last_used_at: new Date().toISOString() })
      .eq('user_id', req.user.id)
      .eq('provider', 'webhook');

    res.json({ success: true, status: r.status });
  } catch (err) {
    await logEvent(req.user.id, 'webhook', 'webhook_sent', 'error',
      { url, error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/integrations/logs ────────────────────
router.get('/logs', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('integration_logs')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

module.exports = router;
