'use strict';
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const _getSb = () => createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Yetkisiz' });
  }
  const token = auth.slice(7);
  const sb = _getSb();
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: 'Geçersiz token' });
  }
  req.user = data.user;
  next();
}

// GET /api/workflows
router.get('/', requireAuth, async (req, res) => {
  try {
    const sb = _getSb();
    const { data, error } = await sb
      .from('workflows')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ workflows: data || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/workflows
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;
    const sb = _getSb();
    const { data, error } = await sb
      .from('workflows')
      .insert({
        user_id: req.user.id,
        name: name || 'Yeni Workflow',
        nodes: nodes || [],
        edges: edges || [],
        enabled: false,
      })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/workflows/:id
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { name, nodes, edges, enabled } = req.body;
    const sb = _getSb();
    const { data, error } = await sb
      .from('workflows')
      .update({
        name,
        nodes: nodes || [],
        edges: edges || [],
        enabled: enabled ?? false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/workflows/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const sb = _getSb();
    const { error } = await sb
      .from('workflows')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/workflows/:id/toggle
router.post('/:id/toggle', requireAuth, async (req, res) => {
  try {
    const sb = _getSb();
    const { data: current } = await sb
      .from('workflows')
      .select('enabled')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();
    const { data, error } = await sb
      .from('workflows')
      .update({ enabled: !current?.enabled })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/workflows/:id/run
router.post('/:id/run', requireAuth, async (req, res) => {
  try {
    const sb = _getSb();

    const { data: wf, error: wfErr } = await sb
      .from('workflows')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();
    if (wfErr || !wf) {
      return res.status(404).json({ error: 'Workflow bulunamadı' });
    }

    const { data: run, error: runErr } = await sb
      .from('workflow_runs')
      .insert({
        workflow_id: req.params.id,
        user_id: req.user.id,
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (runErr) throw runErr;

    const nodes = wf.nodes || [];
    const nodeResults = {};

    for (const node of nodes) {
      try {
        nodeResults[node.id] = await executeNode(node, req.user.id, nodeResults, sb);
      } catch (nodeErr) {
        nodeResults[node.id] = { error: nodeErr.message };
      }
    }

    await sb
      .from('workflow_runs')
      .update({
        status: 'success',
        completed_at: new Date().toISOString(),
        node_results: nodeResults,
      })
      .eq('id', run.id);

    await sb
      .from('workflows')
      .update({
        run_count: (wf.run_count || 0) + 1,
        last_run: new Date().toISOString(),
      })
      .eq('id', req.params.id);

    res.json({ success: true, run_id: run.id, results: nodeResults });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

async function executeNode(node, userId, previousResults, sb) {
  const { integrationId, operationId, config } = node;
  const prevOutput = Object.values(previousResults).slice(-1)[0];

  switch (integrationId) {

    case 'slack': {
      if (operationId === 'send_message') {
        const { data: integ } = await sb
          .from('user_integrations')
          .select('access_token, metadata')
          .eq('user_id', userId)
          .eq('integration_type', 'slack')
          .single();

        if (!integ?.access_token) return { error: 'Slack bağlı değil' };

        const message = config?.message ||
          (prevOutput ? JSON.stringify(prevOutput).slice(0, 500) : 'Mocksheets workflow çalıştı ✓');
        const channel = config?.channel || '#general';

        const slackRes = await fetch('https://slack.com/api/chat.postMessage', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${integ.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ channel, text: message }),
        });
        const slackData = await slackRes.json();
        return { sent: slackData.ok, channel, message };
      }
      return { skipped: true };
    }

    case 'gmail': {
      if (operationId === 'send_email') {
        const tokenManager = require('../services/tokenManager');
        const tokens = await tokenManager.getToken(userId, 'google');
        if (!tokens) return { error: 'Gmail bağlı değil' };

        const { google } = require('googleapis');
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET
        );
        oauth2Client.setCredentials(tokens);
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        const to = config?.to || '';
        const subject = config?.subject || 'Mocksheets Raporu';
        const body = config?.body ||
          (prevOutput ? JSON.stringify(prevOutput) : 'Workflow tamamlandı');

        const message = [
          `To: ${to}`,
          `Subject: ${subject}`,
          'Content-Type: text/plain; charset=utf-8',
          '',
          body,
        ].join('\n');

        const encoded = Buffer.from(message).toString('base64url');
        await gmail.users.messages.send({
          userId: 'me',
          requestBody: { raw: encoded },
        });
        return { sent: true, to, subject };
      }
      return { skipped: true };
    }

    case 'google_sheets': {
      if (operationId === 'get_rows') {
        const tokenManager = require('../services/tokenManager');
        const tokens = await tokenManager.getToken(userId, 'google');
        if (!tokens) return { error: 'Google Sheets bağlı değil' };

        const { google } = require('googleapis');
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET
        );
        oauth2Client.setCredentials(tokens);
        const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

        const urlMatch = (config?.url || '').match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (!urlMatch) return { error: 'Geçersiz Sheets URL' };

        const spreadsheetId = urlMatch[1];
        const range = config?.range || 'A1:Z1000';

        const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
        const rows = response.data.values || [];
        return { rows, rowCount: rows.length };
      }
      return { skipped: true };
    }

    case 'mocksheets_ai': {
      if (['analyze', 'summarize', 'filter'].includes(operationId)) {
        const data = prevOutput?.rows || prevOutput?.data || prevOutput;
        const prompt = config?.prompt || config?.condition || 'Veriyi özetle';

        const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: `Aşağıdaki veriyi analiz et:\n\n${JSON.stringify(data).slice(0, 3000)}\n\nGörev: ${prompt}`,
            }],
          }),
        });
        const aiData = await anthropicRes.json();
        const result = aiData.content?.[0]?.text || 'Analiz tamamlandı';
        return { analysis: result };
      }
      return { skipped: true };
    }

    case 'trigger_schedule':
    case 'trigger_webhook':
      return { skipped: true, reason: 'Trigger node' };

    default:
      return { skipped: true, reason: `${integrationId} executor henüz yok` };
  }
}

module.exports = router;
