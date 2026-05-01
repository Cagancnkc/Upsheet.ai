'use strict';
const express = require('express');
const multer  = require('multer');
const Anthropic = require('@anthropic-ai/sdk');
const { checkLimit, incrementUsage } = require('../middleware/limits');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Sadece PDF dosyaları kabul edilir'), false);
    }
    cb(null, true);
  }
});

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PDF_SYSTEM_PROMPT = `Sen bir PDF belge analiz uzmanısın. Görevin: verilen PDF belgesini görsel olarak analiz etmek, içindeki tabloları ve yapılandırılmış verileri tespit etmek ve bunları JSON formatında çıkarmaktır.

ZORUNLU KURALLAR:
1. Yanıtın SADECE geçerli bir JSON nesnesi olmalı. Markdown, açıklama veya \`\`\` işareti KESİNLİKLE YASAK.
2. Tablo verilerini SATIR SATIR çıkar. Başlık satırı (headers) ayrı, veri satırları (rows) ayrı olmalı.
3. Hücre değerlerini TAM OLARAK al — sayılar, tarihler, para birimleri orijinal formatlarıyla korunmalı.
4. Birden fazla tablo tespit edilirse HEPSİNİ listele; birini seçme, hepsini döndür.
5. Tablo bulunamazsa "tables" alanını boş dizi [] olarak bırak.

JSON ŞEMASI (bu yapıya TAM OLARAK uy):
{
  "document_summary": {
    "type": "fatura|rapor|tablo|form|bordro|stok|banka|diğer",
    "page_count": <sayı>,
    "language": "tr|en|diğer",
    "description": "<Belgenin 1-2 cümlelik Türkçe özeti>"
  },
  "tables": [
    {
      "id": 1,
      "title": "<Tablo başlığı veya 'Tablo 1'>",
      "page": <sayfa numarası veya null>,
      "row_count": <veri satırı sayısı>,
      "col_count": <sütun sayısı>,
      "headers": ["Sütun1", "Sütun2"],
      "rows": [["değer1", "değer2"], ["değer1", "değer2"]],
      "notes": "<varsa not, yoksa null>"
    }
  ],
  "extraction_quality": "yüksek|orta|düşük",
  "warnings": ["<varsa uyarılar>"]
}`;

function parsePdfResponse(rawText) {
  let jsonStr = rawText.trim();
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) jsonStr = fenceMatch[1].trim();
  const objMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (objMatch) jsonStr = objMatch[0];

  try {
    const parsed = JSON.parse(jsonStr);

    if (!parsed.document_summary) {
      parsed.document_summary = { type: 'diğer', page_count: null, language: 'tr', description: '' };
    }
    if (!Array.isArray(parsed.tables)) parsed.tables = [];
    if (!parsed.extraction_quality) parsed.extraction_quality = 'orta';
    if (!Array.isArray(parsed.warnings)) parsed.warnings = [];

    parsed.tables = parsed.tables.map((t, i) => ({
      id: t.id ?? (i + 1),
      title: t.title || `Tablo ${i + 1}`,
      page: t.page ?? null,
      row_count: Array.isArray(t.rows) ? t.rows.length : 0,
      col_count: Array.isArray(t.headers) ? t.headers.length : 0,
      headers: Array.isArray(t.headers) ? t.headers.map(String) : [],
      rows: Array.isArray(t.rows) ? t.rows.map(r => (Array.isArray(r) ? r : [r]).map(String)) : [],
      notes: t.notes ?? null
    }));

    return parsed;
  } catch (e) {
    console.error('[PDF] JSON parse failed:', e.message);
    return {
      error: 'PDF analiz sonucu okunamadı. Lütfen tekrar deneyin.',
      document_summary: null,
      tables: [],
      extraction_quality: 'düşük',
      warnings: ['Yanıt ayrıştırma hatası']
    };
  }
}

router.post('/extract', checkLimit, upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'PDF dosyası gerekli' });
  }

  const fileSizeMB = req.file.size / (1024 * 1024);
  const base64 = req.file.buffer.toString('base64');

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: [
        {
          type: 'text',
          text: PDF_SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' }
        }
      ],
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: base64
            }
          },
          {
            type: 'text',
            text: 'Bu PDF belgesini analiz et ve tüm tabloları JSON formatında çıkar. Sistem promptundaki JSON şemasına tam olarak uy.'
          }
        ]
      }]
    });

    const result = parsePdfResponse(response.content[0].text);

    if (!result.error) {
      await incrementUsage(req.user.id);
    }

    res.json(result);
  } catch (err) {
    console.error('[PDF] Claude API error:', err.message);
    res.status(500).json({ error: 'AI analiz hatası: ' + (err.message || 'Bilinmeyen hata') });
  }
});

// Multer hata yakalayıcı
router.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: `Dosya çok büyük. Maksimum boyut 30MB'tır. Dosyanız: ${(req.file?.size / (1024*1024) || 0).toFixed(1)}MB`
    });
  }
  if (err.message === 'Sadece PDF dosyaları kabul edilir') {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = router;
