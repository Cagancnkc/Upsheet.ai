'use strict';
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const requireProMax = require('../middleware/requireProMax');
const { runAgent, runAgentWithMemory, getUserMemory } = require('../services/agentService');
const { scheduleOne } = require('../services/schedulerService');

let _supabase = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  }
  return _supabase;
}

// ─── Public: herkes görebilir ─────────────────────────────────────────────────

// GET /api/agents/templates
router.get('/templates', async (req, res) => {
  const { data, error } = await getSupabase()
    .from('agent_templates')
    .select('id, slug, title, description, prompt, category, icon')
    .eq('is_public', true)
    .order('category');
  if (error) return res.status(500).json({ error: 'Şablonlar alınamadı' });
  res.json({ templates: data || [] });
});

// ─── Protected: requireProMax ─────────────────────────────────────────────────

router.use(requireProMax);

// POST /api/agents/run-template — Şablondan agent çalıştır
router.post('/run-template', async (req, res) => {
  const { template_id, context } = req.body;
  if (!template_id) return res.status(400).json({ error: 'template_id zorunludur' });

  const sb = getSupabase();
  const { data: tpl, error: tplErr } = await sb
    .from('agent_templates')
    .select('prompt, title')
    .eq('id', template_id)
    .single();

  if (tplErr || !tpl) return res.status(404).json({ error: 'Şablon bulunamadı' });

  const { data: run, error } = await sb
    .from('agent_runs')
    .insert({ user_id: req.user.id, title: tpl.title, prompt: tpl.prompt, status: 'pending', steps: [] })
    .select('id, status')
    .single();

  if (error) return res.status(500).json({ error: 'Agent oluşturulamadı' });

  runAgentWithMemory(run.id, req.user.id, tpl.prompt, context || {}).catch(err =>
    console.error(`[agent] run-template failed run=${run.id}:`, err.message)
  );

  res.json({ run_id: run.id, status: 'running' });
});

// POST /api/agents/schedules — Schedule oluştur
router.post('/schedules', async (req, res) => {
  const { prompt, cron_expr, label, context, template_id } = req.body;
  if (!prompt || !cron_expr) return res.status(400).json({ error: 'prompt ve cron_expr zorunludur' });

  const sb = getSupabase();
  const { data: schedule, error } = await sb
    .from('agent_schedules')
    .insert({ user_id: req.user.id, prompt, cron_expr, label, context: context || {}, template_id: template_id || null, is_active: true })
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Schedule oluşturulamadı' });

  scheduleOne(schedule);
  res.json({ schedule_id: schedule.id });
});

// GET /api/agents/schedules — Kullanıcının schedule'larını listele
router.get('/schedules', async (req, res) => {
  const { data, error } = await getSupabase()
    .from('agent_schedules')
    .select('id, prompt, cron_expr, label, is_active, last_run, created_at')
    .eq('user_id', req.user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: 'Schedule listesi alınamadı' });
  res.json({ schedules: data || [] });
});

// DELETE /api/agents/schedules/:scheduleId — Schedule durdur
router.delete('/schedules/:scheduleId', async (req, res) => {
  const { scheduleId } = req.params;
  const { error } = await getSupabase()
    .from('agent_schedules')
    .update({ is_active: false })
    .eq('id', scheduleId)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: 'Schedule durdurulamadı' });
  res.json({ paused: true });
});

// GET /api/agents/memory — Kullanıcı belleği
router.get('/memory', async (req, res) => {
  const memory = await getUserMemory(req.user.id);
  res.json({ memory });
});

// DELETE /api/agents/memory/:key — Bellek kaydı sil
router.delete('/memory/:key', async (req, res) => {
  const { error } = await getSupabase()
    .from('agent_memory')
    .delete()
    .eq('user_id', req.user.id)
    .eq('key', decodeURIComponent(req.params.key));

  if (error) return res.status(500).json({ error: 'Bellek kaydı silinemedi' });
  res.json({ deleted: true });
});

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
