'use strict';
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');
const PDFDocument = require('pdfkit');
const requireProMax = require('../middleware/requireProMax');
const { sendScenarioEmail } = require('../services/loops');

let _supabase = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  }
  return _supabase;
}

let _anthropic = null;
function getAnthropic() {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropic;
}

const SYSTEM_PROMPT = "Sen Mocksheets AI Agent'ısın. Türkçe konuşan, e-ticaret ve operasyon ekiplerine yardım eden bir yapay zeka asistanısın. Kullanıcı sorularına net, kısa ve pratik cevaplar ver. Excel, Google Sheets, CSV, stok takibi, sipariş yönetimi ve genel iş süreçleri konularında yardımcı ol.";

router.use(requireProMax);

// GET /api/agent/conversations
router.get('/conversations', async (req, res) => {
  const { data, error } = await getSupabase()
    .from('agent_conversations')
    .select('id, title, updated_at')
    .eq('user_id', req.user.id)
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: 'Sohbetler alınamadı' });
  res.json({ conversations: data || [] });
});

// GET /api/agent/conversations/:id
router.get('/conversations/:id', async (req, res) => {
  const sb = getSupabase();
  const { data: conv, error: convErr } = await sb
    .from('agent_conversations')
    .select('id, title')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (convErr || !conv) return res.status(404).json({ error: 'Sohbet bulunamadı' });

  const { data: messages } = await sb
    .from('agent_messages')
    .select('role, content, created_at')
    .eq('conversation_id', req.params.id)
    .order('created_at', { ascending: true });

  res.json({ conversation: conv, messages: messages || [] });
});

// POST /api/agent/chat
router.post('/chat', async (req, res) => {
  const { message, conversationId } = req.body;
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message zorunludur' });
  }

  const sb = getSupabase();
  let convId = conversationId;
  let convTitle = null;

  if (!convId) {
    convTitle = message.trim().slice(0, 50);
    const { data: newConv, error: convErr } = await sb
      .from('agent_conversations')
      .insert({ user_id: req.user.id, title: convTitle })
      .select('id')
      .single();
    if (convErr || !newConv) return res.status(500).json({ error: 'Sohbet oluşturulamadı' });
    convId = newConv.id;
  } else {
    const { data: existing } = await sb
      .from('agent_conversations')
      .select('id')
      .eq('id', convId)
      .eq('user_id', req.user.id)
      .single();
    if (!existing) return res.status(404).json({ error: 'Sohbet bulunamadı' });
  }

  const { data: history } = await sb
    .from('agent_messages')
    .select('role, content')
    .eq('conversation_id', convId)
    .order('created_at', { ascending: true })
    .limit(20);

  const messages = (history || []).map(m => ({ role: m.role, content: m.content }));
  messages.push({ role: 'user', content: message });

  let reply;
  try {
    const resp = await getAnthropic().messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages
    });
    reply = (resp.content || []).map(b => b.text || '').join('').trim() || '(boş yanıt)';
  } catch (err) {
    console.error('[agent/chat] Claude error:', err.message);
    return res.status(500).json({ error: 'AI yanıtı alınamadı' });
  }

  await sb.from('agent_messages').insert([
    { conversation_id: convId, user_id: req.user.id, role: 'user', content: message },
    { conversation_id: convId, user_id: req.user.id, role: 'assistant', content: reply }
  ]);

  await sb
    .from('agent_conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', convId);

  res.json({ reply, conversationId: convId, title: convTitle });
});

router.patch('/conversations/:id', async (req, res) => {
  try {
    const title = (req.body?.title || '').trim().slice(0, 100);
    if (!title) return res.status(400).json({ error: 'Başlık gerekli' });
    const sb = getSupabase();
    const { error } = await sb.from('agent_conversations')
      .update({ title })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/agent/track-cancel-intent
router.post('/track-cancel-intent', async (req, res) => {
  const { reason } = req.body || {};
  try {
    sendScenarioEmail(req.user.email, 'cancel_intent')
      .catch(e => console.error('[brevo] cancel_intent:', e.message));
    res.json({ ok: true });
  } catch (e) {
    console.error('[agent/track-cancel-intent]', e.message);
    res.status(500).json({ error: 'Hata kaydedilemedi' });
  }
});

// POST /api/agent/export-pdf
router.post('/export-pdf', async (req, res) => {
  try {
    const { content, title } = req.body;
    if (!content) return res.status(400).json({ error: 'İçerik gerekli' });
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const buf = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="' + (title || 'mocksheets-rapor') + '.pdf"');
      res.send(buf);
    });
    doc.fontSize(18).text(title || 'Mocksheets Raporu', { align: 'left' });
    doc.moveDown();
    doc.fontSize(11).text(content, { align: 'left', lineGap: 4 });
    doc.end();
  } catch(e) {
    console.error('[agent/export-pdf]', e.message);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
