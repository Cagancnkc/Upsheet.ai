'use strict';
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const requireProMax = require('../middleware/requireProMax');
const { runAgent } = require('../services/agentService');

let _supabase = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  }
  return _supabase;
}

router.use(requireProMax);

// POST /api/agents/run — Yeni agent başlat
router.post('/run', async (req, res) => {
  const { prompt, context } = req.body;
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'prompt zorunludur' });
  }

  const sb = getSupabase();
  const { data: run, error } = await sb
    .from('agent_runs')
    .insert({
      user_id: req.user.id,
      title: prompt.slice(0, 120),
      prompt,
      status: 'pending',
      steps: [],
    })
    .select('id, status')
    .single();

  if (error) return res.status(500).json({ error: 'Agent oluşturulamadı' });

  // Arka planda çalıştır — await yok
  runAgent(run.id, req.user.id, prompt, context || {}).catch(err => {
    console.error(`[agent] runAgent failed run=${run.id}:`, err.message);
  });

  res.json({ run_id: run.id, status: 'running' });
});

// GET /api/agents/run/:runId — Durum + adım logları
router.get('/run/:runId', async (req, res) => {
  const { runId } = req.params;
  const sb = getSupabase();

  const { data: run, error: runErr } = await sb
    .from('agent_runs')
    .select('*')
    .eq('id', runId)
    .eq('user_id', req.user.id)
    .single();

  if (runErr || !run) return res.status(404).json({ error: 'Run bulunamadı' });

  const { data: steps } = await sb
    .from('agent_step_logs')
    .select('*')
    .eq('run_id', runId)
    .order('step_index', { ascending: true });

  res.json({ run, steps: steps || [] });
});

// GET /api/agents/history — Son 20 run
router.get('/history', async (req, res) => {
  const { data: runs, error } = await getSupabase()
    .from('agent_runs')
    .select('id, title, status, created_at, updated_at')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) return res.status(500).json({ error: 'Geçmiş alınamadı' });
  res.json({ runs: runs || [] });
});

// DELETE /api/agents/run/:runId — Run sil
router.delete('/run/:runId', async (req, res) => {
  const { runId } = req.params;
  const sb = getSupabase();

  const { data: run } = await sb
    .from('agent_runs')
    .select('id')
    .eq('id', runId)
    .eq('user_id', req.user.id)
    .single();

  if (!run) return res.status(404).json({ error: 'Run bulunamadı' });

  const { error } = await sb
    .from('agent_runs')
    .delete()
    .eq('id', runId);

  if (error) return res.status(500).json({ error: 'Silinemedi' });
  res.json({ deleted: true });
});

module.exports = router;
