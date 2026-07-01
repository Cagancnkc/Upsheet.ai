'use strict';
const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/translate
// Body: { text: string | string[], from: 'tr'|'en', to: 'tr'|'en' }
router.post('/', async (req, res) => {
  try {
    const { text, from = 'tr', to = 'en' } = req.body;
    if (!text) return res.status(400).json({ error: 'text gerekli' });

    const isArray = Array.isArray(text);
    const items = isArray ? text : [text];

    if (items.length > 50) {
      return res.status(400).json({ error: 'Max 50 öğe çevrilebilir' });
    }

    const langNames = { tr: 'Türkçe', en: 'İngilizce' };

    const prompt = `Aşağıdaki ${items.length} metni ${langNames[from]}'den ${langNames[to]}'ye çevir.
Her metni aynı sırada döndür.
Sadece çevirileri döndür, başka hiçbir şey yazma.
Her çeviriyi yeni satıra yaz.

${items.map((t, i) => `${i + 1}. ${String(t).slice(0, 2000)}`).join('\n')}`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].text;
    const lines = responseText
      .split('\n')
      .filter(l => l.trim())
      .map(l => l.replace(/^\d+\.\s*/, '').trim());

    const translated = isArray ? lines : lines[0];
    res.json({ translated, from, to });

  } catch (e) {
    console.error('Translate error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
