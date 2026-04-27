'use strict';
const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const pdfParse = require('pdf-parse');
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Sadece PDF dosyası yüklenebilir'), false);
  }
});

router.post('/extract', upload.single('pdf'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'PDF dosyası gerekli' });

  try {
    const pdfData = await pdfParse(req.file.buffer);
    const rawText = pdfData.text?.trim();

    if (!rawText || rawText.length < 10) {
      return res.status(422).json({ error: 'PDF içeriği okunamadı. Taranmış görsel PDF olabilir.' });
    }

    const prompt = `Aşağıdaki PDF metninden yapılandırılmış tablo verisi çıkar.

PDF METNİ:
${rawText.slice(0, 8000)}

GÖREV:
Bu metni analiz et ve içindeki tablo/liste/veri yapısını tespit et.
Fatura, bordro, stok listesi, satış raporu, banka ekstresi vb. olabilir.

YANIT FORMATI — SADECE JSON:
{
  "document_type": "fatura|bordro|stok|rapor|banka|genel",
  "title": "Belge başlığı",
  "headers": ["Sütun1", "Sütun2", "Sütun3"],
  "rows": [
    ["değer1", "değer2", "değer3"],
    ["değer1", "değer2", "değer3"]
  ],
  "summary": {
    "total_rows": 5,
    "key_info": "Önemli bilgiler (toplam tutar, tarih, firma adı vb.)"
  }
}

Eğer birden fazla tablo varsa en önemli/büyük olanı al.
Boş satırları dahil etme.
Para birimi sembollerini koru (₺, $, €).
Tarih formatlarını koru.
SADECE JSON döndür, başka açıklama yazma.`;

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    });

    const raw = response.content[0].text.trim();
    const jsonStr = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      const lines = rawText.split('\n').filter(l => l.trim()).slice(0, 100);
      parsed = {
        document_type: 'genel',
        title: req.file.originalname,
        headers: ['İçerik'],
        rows: lines.map(l => [l.trim()]),
        summary: { total_rows: lines.length, key_info: 'Ham metin olarak aktarıldı' }
      };
    }

    res.json({
      success: true,
      filename: req.file.originalname,
      pages: pdfData.numpages,
      ...parsed
    });

  } catch (err) {
    console.error('[PDF Extract Error]', err.message);
    res.status(500).json({ error: 'PDF işlenirken hata: ' + err.message });
  }
});

module.exports = router;
