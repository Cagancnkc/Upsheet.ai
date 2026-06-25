'use strict';
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

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
  next();
}

// GET /api/workflows
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase
    .from('workflows')
    .select('id, name, enabled, last_run, run_count, created_at, updated_at')
    .eq('user_id', req.user.id)
    .order('updated_at', { ascending: false });

  if (error) return res.status(500).json({ error: 'Workflow listesi alınamadı' });
  res.json({ workflows: data || [] });
});

// POST /api/workflows
router.post('/', requireAuth, async (req, res) => {
  const { name, nodes, edges } = req.body;

  const { data, error } = await req.supabase
    .from('workflows')
    .insert({
      user_id: req.user.id,
      name: name || 'Yeni Workflow',
      nodes: nodes || [],
      edges: edges || [],
      enabled: false,
    })
    .select('id, name, nodes, edges, enabled, created_at')
    .single();

  if (error) return res.status(500).json({ error: 'Workflow oluşturulamadı' });
  res.status(201).json(data);
});

// PUT /api/workflows/:id
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { name, nodes, edges } = req.body;

  const updates = { updated_at: new Date().toISOString() };
  if (name !== undefined) updates.name = name;
  if (nodes !== undefined) updates.nodes = nodes;
  if (edges !== undefined) updates.edges = edges;

  const { data, error } = await req.supabase
    .from('workflows')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select('id, name, nodes, edges, enabled, updated_at')
    .single();

  if (error) return res.status(500).json({ error: 'Workflow güncellenemedi' });
  if (!data) return res.status(404).json({ error: 'Workflow bulunamadı' });
  res.json(data);
});

// DELETE /api/workflows/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  const { error } = await req.supabase
    .from('workflows')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: 'Workflow silinemedi' });
  res.json({ deleted: true });
});

// POST /api/workflows/:id/run
router.post('/:id/run', requireAuth, async (req, res) => {
  const { id } = req.params;
  const sb = req.supabase;

  const { data: wf } = await sb
    .from('workflows')
    .select('id')
    .eq('id', id)
    .eq('user_id', req.user.id)
    .single();

  if (!wf) return res.status(404).json({ error: 'Workflow bulunamadı' });

  const { data: run, error: runErr } = await sb
    .from('workflow_runs')
    .insert({ workflow_id: id, user_id: req.user.id, status: 'running' })
    .select('id')
    .single();

  if (runErr) return res.status(500).json({ error: 'Run oluşturulamadı' });

  await sb
    .from('workflows')
    .update({ last_run: new Date().toISOString(), run_count: sb.rpc ? undefined : undefined })
    .eq('id', id);

  // Mark run as done (stub — no actual execution)
  sb.from('workflow_runs').update({ status: 'done' }).eq('id', run.id).then(() => {});

  res.json({ run_id: run.id, status: 'running' });
});

// POST /api/workflows/:id/toggle
router.post('/:id/toggle', requireAuth, async (req, res) => {
  const { id } = req.params;
  const sb = req.supabase;

  const { data: wf } = await sb
    .from('workflows')
    .select('enabled')
    .eq('id', id)
    .eq('user_id', req.user.id)
    .single();

  if (!wf) return res.status(404).json({ error: 'Workflow bulunamadı' });

  const { data, error } = await sb
    .from('workflows')
    .update({ enabled: !wf.enabled, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, enabled')
    .single();

  if (error) return res.status(500).json({ error: 'Toggle başarısız' });
  res.json({ id: data.id, enabled: data.enabled });
});

module.exports = router;
