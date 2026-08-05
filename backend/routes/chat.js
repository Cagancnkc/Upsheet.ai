'use strict';
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { checkLimit, incrementUsage } = require('../middleware/limits');
const { retrieveShopifyExamples } = require('../rag/shopifyRetrieval');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024, files: 5 } });

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
- Türkçe karakterleri doğru kullan (ç, ğ, ı, ö, ş, ü).

## ÖZEL EYLEM ÇIKTILARI
Kullanıcı slayt, sunum, PowerPoint veya presentation isterse, önce Türkçe açıklama yaz, sonra cevabının en sonuna şu bloğu ekle:
<ACTION>{"type":"slide","slides":[{"title":"Başlık","subtitle":"Alt başlık","bullets":["Madde 1","Madde 2"]}],"filename":"sunum.html"}</ACTION>

Kullanıcı Excel, tablo dosyası veya XLSX isterse, önce açıklama yaz, sonra:
<ACTION>{"type":"excel","headers":["Sütun1","Sütun2","Sütun3"],"rows":[["değer1","değer2","değer3"]],"sheetName":"Sayfa1","filename":"tablo.xlsx"}</ACTION>

Kullanıcı satış tahmini, öngörü, forecast veya projeksiyon isterse, önce açıklama yaz, sonra:
<ACTION>{"type":"forecast","labels":["Ağu 2026","Eyl 2026","Eki 2026"],"values":[15000,18000,21000],"metric":"Tahmini Satış (₺)","trend":"up","note":"Tahmin genel e-ticaret büyüme trendlerine dayanmaktadır."}</ACTION>

Kural: Her zaman önce açıklayıcı Türkçe metin, <ACTION> bloğu en sona. JSON içinde çift tırnak kullan, tek tırnak kullanma.`;

const DEEP_SYSTEM_PROMPT = `${SYSTEM_PROMPT}

## DERİN ARAŞTIRMA MODU
Bu modda çok daha kapsamlı, analitik bir yaklaşım benimse:
- Soruyu en az 3 farklı perspektiften incele (maliyet/verimlilik/risk gibi).
- Varsayımları açıkça belirt ve sorgula.
- Somut rakamlar, oranlar veya benchmarklar ile destekle.
- Adım adım düşünce zinciri göster — ara sonuçları da paylaş.
- Olası tuzakları ve alternatifleri mutlaka belirt.
- Bilmediğin veya emin olmadığın kısımları net olarak işaretle.`;

const SKILL_PROMPTS = {
  formula: `\n\n## AKTİF SKILL: Formül Üreteci\nExcel ve Google Sheets formülleri konusunda uzmanlaş. Her formülü adım adım açıkla, alternatif yaklaşımlar öner, IFERROR/IF/VLOOKUP/INDEX-MATCH gibi hata yönetimi dahil et. Varsa örnek veri ile nasıl çalıştığını göster.`,
  analysis: `\n\n## AKTİF SKILL: Veri Analizi\nVeri analizi uzmanı olarak istatistiksel kavramlar (ortalama, medyan, standart sapma, korelasyon), trend analizi, pivot tablo tasarımı, grafik seçimi ve KPI hesaplamalarında derinlemesine rehberlik et. Formülü ve yorumunu birlikte ver.`,
  ecommerce: `\n\n## AKTİF SKILL: E-ticaret Uzmanı\nShopify, WooCommerce, Trendyol, Hepsiburada gibi platformlarda ürün listeleme, toplu fiyat güncelleme, envanter optimizasyonu, kargo entegrasyonu, dönüşüm oranı iyileştirme ve satış analizi konularında uygulamalı rehberlik sun.`,
  content: `\n\n## AKTİF SKILL: İçerik Yazarı\nÜrün açıklamaları, e-posta kampanyaları, sosyal medya paylaşımları, SEO başlıkları ve meta açıklamalar yaz. Türkçe doğal, ikna edici dil kullan; marka tonu ile uyumlu ol. İstenirse A/B test için iki versiyon üret.`,
};

function buildRagBlock(examples) {
  if (!examples || examples.length === 0) return '';
  const lines = examples.slice(0, 3).map((e, i) =>
    `${i + 1}. Benzer soru: "${e.command}"${e.response_hint ? `\n   İpucu: ${e.response_hint}` : ''}${e.category ? `\n   Kategori: ${e.category}` : ''}`
  );
  return `## İLGİLİ SHOPIFY BİLGİSİ (bağlam için — kullanıcıya doğrudan tekrar etme)\n${lines.join('\n\n')}`;
}

function buildProductBlock(products) {
  if (!Array.isArray(products) || products.length === 0) return '';
  const rows = products.map(p => {
    const parts = [`"${String(p.title || '').slice(0, 60)}"`];
    if (p.sku) parts.push(`SKU: ${p.sku}`);
    if (p.price) parts.push(`₺${p.price}`);
    if (p.compare_at_price) parts.push(`liste: ₺${p.compare_at_price}`);
    if (p.status) parts.push(p.status);
    if (p.inventory != null) parts.push(`stok: ${p.inventory}`);
    if (p.vendor) parts.push(`marka: ${p.vendor}`);
    if (p.type) parts.push(`tür: ${p.type}`);
    if (p.tags) parts.push(`etiket: ${p.tags.slice(0, 60)}`);
    return parts.join(' | ');
  });
  return `## KULLANICININ SHOPIFY KATALOĞU (${products.length} ürün)\nAşağıdaki gerçek ürün listesini kullan — fiyat, stok, SKU sorularını buradan yanıtla:\n${rows.join('\n')}`;
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

router.post('/message', checkLimit, upload.array('files', 5), async (req, res) => {
  const t0 = Date.now();
  try {
    const body = req.body || {};
    const { message = '', history = [], sessionId: incomingSessionId = null, useEmbeddingContext = true } = body;
    const mode = body.mode === 'deep' ? 'deep' : 'normal';
    const skill = ['formula', 'analysis', 'ecommerce', 'content'].includes(body.skill) ? body.skill : null;
    const links = (body.links ? [].concat(body.links) : []).slice(0, 5).filter(l => typeof l === 'string');
    const files = req.files || [];
    const rawProducts = body.shopifyProducts
      ? (typeof body.shopifyProducts === 'string' ? JSON.parse(body.shopifyProducts) : body.shopifyProducts)
      : [];
    const shopifyProducts = Array.isArray(rawProducts) ? rawProducts.slice(0, 80) : [];

    const trimmed = String(message).trim().slice(0, 4000);
    if (!trimmed && files.length === 0 && links.length === 0) {
      return res.status(400).json({ error: 'Mesaj boş olamaz', code: 'EMPTY_MESSAGE' });
    }
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

    const userContent = [];
    const productBlock = buildProductBlock(shopifyProducts);
    if (productBlock) userContent.push({ type: 'text', text: productBlock, cache_control: { type: 'ephemeral' } });
    if (ragBlock)     userContent.push({ type: 'text', text: ragBlock,     cache_control: { type: 'ephemeral' } });
    if (trimmed)      userContent.push({ type: 'text', text: trimmed });
    if (links.length > 0) {
      userContent.push({ type: 'text', text: `Kullanıcı şu bağlantıları paylaştı:\n${links.join('\n')}\n(Bu URL'leri analiz et ve mesajla ilgili bağlamda değerlendir.)` });
    }
    const SUPPORTED_IMAGES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    for (const file of files) {
      if (SUPPORTED_IMAGES.includes(file.mimetype)) {
        userContent.push({ type: 'image', source: { type: 'base64', media_type: file.mimetype, data: file.buffer.toString('base64') } });
      } else {
        userContent.push({ type: 'text', text: `[Dosya: ${file.originalname}]\n${file.buffer.toString('utf-8').slice(0, 8000)}` });
      }
    }
    if (userContent.length === 0) userContent.push({ type: 'text', text: '(Mesaj yok)' });

    let sysPrompt = mode === 'deep' ? DEEP_SYSTEM_PROMPT : SYSTEM_PROMPT;
    if (skill) sysPrompt += SKILL_PROMPTS[skill];
    const maxTokens = mode === 'deep' ? 4096 : 1024;
    const temperature = mode === 'deep' ? 0.2 : 0.4;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      temperature,
      system: [
        { type: 'text', text: sysPrompt, cache_control: { type: 'ephemeral' } }
      ],
      messages: [
        ...historyMessages,
        { role: 'user', content: userContent }
      ]
    });

    const rawReply = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n')
      .trim() || 'Üzgünüm, cevap üretemedim.';

    // ACTION bloğunu parse et
    let parsedAction = null;
    const actionMatch = rawReply.match(/<ACTION>([\s\S]*?)<\/ACTION>/);
    const reply = actionMatch
      ? rawReply.replace(/<ACTION>[\s\S]*?<\/ACTION>/, '').trim()
      : rawReply;
    if (actionMatch) {
      try { parsedAction = JSON.parse(actionMatch[1]); } catch (e) { /* ignore */ }
    }

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
    console.log(`[chat] ${ms}ms | mode=${mode} skill=${skill || '-'} files=${files.length} | in=${response.usage.input_tokens} out=${response.usage.output_tokens} cache_read=${response.usage.cache_read_input_tokens || 0}`);

    res.json({
      reply,
      action: parsedAction,
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
