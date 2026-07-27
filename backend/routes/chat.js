'use strict';
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { checkLimit, incrementUsage } = require('../middleware/limits');
const { retrieveRelevantExamples } = require('../rag/retrieval');

const router = express.Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Sen Mocksheets AI Copilot'sun — Türkçe konuşan, uzman bir iş asistanısın.

## GÖREV
Kullanıcılar sana Excel/Google Sheets, Shopify e-ticaret operasyonları, ürün açıklamaları, SEO, fiyatlandırma, KDV/vergi, envanter yönetimi, veri analizi, formül yazımı ve genel iş operasyonları hakkında sorular sorar. Onlara net, uygulanabilir ve Türkçe cevaplar ver.

## STIL
- Doğrudan ve öz konuş — gereksiz doldurma yapma.
- Adım adım anlatım gerektiğinde numaralı liste kullan.
- Excel/Sheets formülü verirken kod bloğu içinde ver: \`=DÜŞEYARA(A2;Sheet2!A:B;2;YANLIŞ)\`
- Shopify sorularında pratik dashboard/API yollarını belirt.
- Kod veya JSON istenirse markdown code block içinde ver.
- Bilmiyorsan "emin değilim" de — uydurma.

## FORMAT
- Kısa cevaplar için düz metin, uzunlar için markdown başlık/liste.
- Emoji minimum — sadece durum işaretleri için (✓, ⚠️, ❌).
- Türkçe karakterleri doğru kullan (ç, ğ, ı, ö, ş, ü).`;

function buildRagBlock(examples) {
  if (!examples || examples.length === 0) return '';
  const lines = examples.slice(0, 3).map((e, i) =>
    `${i + 1}. Örnek komut: "${e.command || ''}"${e.output ? `\n   Beklenen çıktı: ${JSON.stringify(e.output).slice(0, 200)}` : ''}${e.category ? `\n   Kategori: ${e.category}` : ''}`
  );
  return `## İLGİLİ ÖRNEKLER (bağlam için — kullanıcıya doğrudan tekrar etme)\n${lines.join('\n\n')}`;
}

router.post('/message', checkLimit, async (req, res) => {
  const t0 = Date.now();
  try {
    const { message, history = [], useEmbeddingContext = true } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Mesaj boş olamaz', code: 'EMPTY_MESSAGE' });
    }

    const trimmed = message.trim().slice(0, 4000);

    let ragExamples = [];
    if (useEmbeddingContext) {
      try {
        ragExamples = await retrieveRelevantExamples(trimmed);
      } catch (e) {
        console.warn('[chat] RAG retrieval skipped:', e.message);
      }
    }

    const ragBlock = buildRagBlock(ragExamples);

    const priorTurns = Array.isArray(history) ? history.slice(-10) : [];
    const historyMessages = priorTurns
      .filter(h => h && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string')
      .map(h => ({ role: h.role, content: h.content.slice(0, 2000) }));

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

    if (req.user?.id) {
      incrementUsage(req.user.id).catch(err => console.warn('[chat] usage increment failed:', err.message));
    }

    const ms = Date.now() - t0;
    console.log(`[chat] ${ms}ms | in=${response.usage.input_tokens} out=${response.usage.output_tokens} cache_read=${response.usage.cache_read_input_tokens || 0}`);

    res.json({
      reply,
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
