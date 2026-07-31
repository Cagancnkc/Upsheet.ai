'use strict';
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');
const { checkLimit, incrementUsage } = require('../middleware/limits');
const { retrieveShopifyExamples } = require('../rag/shopifyRetrieval');

const router = express.Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

let _supabase = null;
function db() {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  }
  return _supabase;
}

const SYSTEM_PROMPT = `Sen Mocksheets AI Copilot'sun — Türkçe konuşan, Shopify mağaza yönetimi konusunda uzman bir e-ticaret asistanısın.

## ÖNCELİK SIRASI
1. **Shopify mağaza yönetimi** (birinci öncelik): ürün, varyant, koleksiyon, envanter, sipariş, iade, kargo, SEO, indirim, tema, ödeme, KDV, entegrasyon, müşteri, marketing.
2. **E-ticaret operasyonları** (ikinci öncelik): fiyatlandırma stratejisi, dönüşüm optimizasyonu, e-fatura, muhasebe.
3. **Excel/Sheets formülü** sadece kullanıcı açıkça isterse — tercih Shopify native çözüm ya da app önerisi.

## STIL
- Doğrudan ve öz konuş — gereksiz doldurma yapma.
- Adım adım anlatım için numaralı liste: "1. Products → 2. Bulk edit → ..."
- Shopify admin yollarını belirt (Örn: Settings → Taxes and duties).
- App önerirken hem native hem 3rd-party seçenek ver.
- Kod veya formül istenirse markdown code block içinde ver.
- Bilmiyorsan "emin değilim" de — uydurma.

## FORMAT
- Kısa cevaplar için düz metin, uzunlar için markdown başlık/liste.
- Emoji minimum — sadece durum işaretleri için (✓, ⚠️, ❌).
- Türkçe karakterleri doğru kullan (ç, ğ, ı, ö, ş, ü).`;

function buildRagBlock(examples) {
  if (!examples || examples.length === 0) return '';
  const lines = examples.slice(0, 3).map((e, i) =>
    `${i + 1}. Benzer soru: "${e.command}"${e.response_hint ? `\n   İpucu: ${e.response_hint}` : ''}${e.category ? `\n   Kategori: ${e.category}` : ''}`
  );
  return `## İLGİLİ SHOPIFY BİLGİSİ (bağlam için — kullanıcıya doğrudan tekrar etme)\n${lines.join('\n\n')}`;
}

function deriveTitle(msg) {
  const clean = String(msg || '').trim().replace(/\s+/g, ' ');
  return clean.slice(0, 60) || 'Yeni Sohbet';
}

// === Session CRUD ===

router.get('/sessions', checkLimit, async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'Yetkisiz' });
    const { data, error } = await db()
      .from('chat_sessions')
      .select('id, title, created_at, updated_at')
      .eq('user_id', req.user.id)
      .order('updated_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    res.json({ sessions: data || [] });
  } catch (err) {
    console.error('[chat] sessions list error:', err);
    res.status(500).json({ error: 'Oturumlar yüklenemedi' });
  }
});

router.post('/sessions', checkLimit, async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'Yetkisiz' });
    const title = deriveTitle(req.body?.title);
    const { data, error } = await db()
      .from('chat_sessions')
      .insert({ user_id: req.user.id, title })
      .select('id, title, created_at, updated_at')
      .single();
    if (error) throw error;
    res.json({ session: data });
  } catch (err) {
    console.error('[chat] session create error:', err);
    res.status(500).json({ error: 'Oturum oluşturulamadı' });
  }
});

router.get('/sessions/:id/messages', checkLimit, async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'Yetkisiz' });
    const { data, error } = await db()
      .from('chat_messages')
      .select('id, role, content, created_at')
      .eq('session_id', req.params.id)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: true });
    if (error) throw error;
    res.json({ messages: data || [] });
  } catch (err) {
    console.error('[chat] messages fetch error:', err);
    res.status(500).json({ error: 'Mesajlar yüklenemedi' });
  }
});

router.delete('/sessions/:id', checkLimit, async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'Yetkisiz' });
    const { error } = await db()
      .from('chat_sessions')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (err) {
    console.error('[chat] session delete error:', err);
    res.status(500).json({ error: 'Oturum silinemedi' });
  }
});

// === Message send ===

router.post('/message', checkLimit, async (req, res) => {
  const t0 = Date.now();
  try {
    const { message, history = [], sessionId: incomingSessionId = null, useEmbeddingContext = true } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Mesaj boş olamaz', code: 'EMPTY_MESSAGE' });
    }

    const trimmed = message.trim().slice(0, 4000);
    const userId = req.user?.id || null;

    // Session hazırlığı
    let sessionId = incomingSessionId;
    if (userId) {
      if (sessionId) {
        const { data: existing } = await db()
          .from('chat_sessions')
          .select('id')
          .eq('id', sessionId)
          .eq('user_id', userId)
          .maybeSingle();
        if (!existing) sessionId = null;
      }
      if (!sessionId) {
        const { data: created, error: createErr } = await db()
          .from('chat_sessions')
          .insert({ user_id: userId, title: deriveTitle(trimmed) })
          .select('id')
          .single();
        if (createErr) throw createErr;
        sessionId = created.id;
      }
    }

    // RAG (Shopify)
    let ragResult = { examples: [], confidence: 0 };
    if (useEmbeddingContext) {
      try {
        ragResult = retrieveShopifyExamples(trimmed, 5);
      } catch (e) {
        console.warn('[chat] Shopify retrieval skipped:', e.message);
      }
    }
    const ragUsed = ragResult.confidence >= 0.3 && ragResult.examples.length > 0;
    const ragBlock = ragUsed ? buildRagBlock(ragResult.examples) : '';

    // Persist edilmiş history varsa DB'den al, yoksa istemciden
    let historyMessages = [];
    if (userId && sessionId) {
      const { data: past } = await db()
        .from('chat_messages')
        .select('role, content')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(20);
      historyMessages = (past || []).map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));
    } else {
      const priorTurns = Array.isArray(history) ? history.slice(-10) : [];
      historyMessages = priorTurns
        .filter(h => h && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string')
        .map(h => ({ role: h.role, content: h.content.slice(0, 2000) }));
    }

    const userContent = ragBlock
      ? [
          { type: 'text', text: ragBlock, cache_control: { type: 'ephemeral' } },
          { type: 'text', text: trimmed }
        ]
      : [{ type: 'text', text: trimmed }];

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      temperature: 0.4,
      system: [
        { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }
      ],
      messages: [
        ...historyMessages,
        { role: 'user', content: userContent }
      ]
    });

    const reply = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n')
      .trim() || 'Üzgünüm, cevap üretemedim.';

    // Persist user + assistant messages, bump session
    if (userId && sessionId) {
      const now = new Date().toISOString();
      await db().from('chat_messages').insert([
        { session_id: sessionId, user_id: userId, role: 'user', content: trimmed },
        { session_id: sessionId, user_id: userId, role: 'assistant', content: reply }
      ]);
      await db().from('chat_sessions').update({ updated_at: now }).eq('id', sessionId).eq('user_id', userId);
    }

    if (userId) {
      incrementUsage(userId).catch(err => console.warn('[chat] usage increment failed:', err.message));
    }

    const ms = Date.now() - t0;
    console.log(`[chat] ${ms}ms | in=${response.usage.input_tokens} out=${response.usage.output_tokens} cache_read=${response.usage.cache_read_input_tokens || 0}`);

    res.json({
      reply,
      sessionId,
      ragUsed,
      ragConfidence: ragResult.confidence,
      ragTopCategory: ragUsed ? (ragResult.examples[0]?.category || null) : null,
      ragQuery: ragUsed ? trimmed : null,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        cache_read_tokens: response.usage.cache_read_input_tokens || 0
      }
    });
  } catch (err) {
    console.error('[chat] error:', err);
    res.status(500).json({
      error: 'Chat cevap üretilemedi',
      code: 'CHAT_ERROR',
      detail: err.message?.slice(0, 200)
    });
  }
});

module.exports = router;
