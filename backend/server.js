require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { processExcelCommand } = require('./rag/pipeline');

const UPSHEET_KNOWLEDGE_BASE = {

  excel_formulas: {
    TOPLA: "=SUM(A1:A10) — Belirtilen aralığın toplamı",
    ORTALAMA: "=AVERAGE(A1:A10) — Ortalama değer",
    EĞER: "=IF(A1>0,'Pozitif','Negatif') — Koşullu değer",
    DÜŞEY_ARA: "=VLOOKUP(aranan,tablo,sütun,0) — Dikey arama",
    YATAY_ARA: "=HLOOKUP(aranan,tablo,satır,0) — Yatay arama",
    BAĞ_DEĞ_SAY: "=COUNTIF(A1:A10,'>0') — Koşullu sayma",
    ETOPLA: "=SUMIF(A1:A10,'>0',B1:B10) — Koşullu toplama",
    MAKS: "=MAX(A1:A10) — En büyük değer",
    MIN: "=MIN(A1:A10) — En küçük değer",
    UZUNLUK: "=LEN(A1) — Karakter sayısı",
    KIRP: "=TRIM(A1) — Baştaki/sondaki boşlukları kaldır",
    BİRLEŞTİR: "=CONCATENATE(A1,' ',B1) — Hücreleri birleştir",
    METNE_ÇEVİR: "=TEXT(A1,'DD.MM.YYYY') — Tarihi metne çevir",
    PARÇAAL: "=MID(A1,2,3) — Metinden parça al",
    BÜYÜKHARF: "=UPPER(A1) — Büyük harfe çevir",
    KÜÇÜKHARF: "=LOWER(A1) — Küçük harfe çevir",
    YUVARLAK: "=ROUND(A1,2) — Yuvarla",
    MUTLAK: "=ABS(A1) — Mutlak değer",
    BUGÜN: "=TODAY() — Bugünün tarihi",
    ŞİMDİ: "=NOW() — Şimdiki tarih ve saat",
  },

  accounting_terms: {
    KDV: "Katma Değer Vergisi — Türkiye'de %20 (genel), %10 (indirimli), %1 (özel)",
    KDV_HESAP: "KDV Dahil = Net Tutar × 1.20 | KDV Hariç = KDV Dahil / 1.20",
    BRÜT_MAAŞ: "Çalışanın işverene toplam maliyeti (SGK dahil)",
    NET_MAAŞ: "Çalışanın eline geçen tutar (kesintiler sonrası)",
    SGK_İŞÇİ: "İşçi SGK payı: %14 (emeklilik %9 + sağlık %5)",
    SGK_İŞVEREN: "İşveren SGK payı: %20.5",
    GELİR_VERGİSİ: "Dilimler: %15, %20, %27, %35, %40",
    ASGARI_ÜCRET: "2025: 22.104 TL (brüt)",
    KAR_MARJI: "(Gelir - Gider) / Gelir × 100",
    CARİ_ORAN: "Dönen Varlıklar / Kısa Vadeli Borçlar",
    ROI: "(Kazanç - Maliyet) / Maliyet × 100",
    EBITDA: "Faiz, Vergi, Amortisman Öncesi Kâr",
  },

  colors: {
    kırmızı: "#fecaca",
    turuncu: "#fed7aa",
    sarı: "#fef08a",
    yeşil: "#bbf7d0",
    mavi: "#bfdbfe",
    mor: "#e9d5ff",
    pembe: "#fce7f3",
    gri: "#f3f4f6",
    siyah: "#000000",
    beyaz: "#ffffff",
  },

  date_formats: {
    tr_short: "GG.AA.YYYY",
    tr_long: "GG MMMM YYYY",
    tr_months: {
      1: "Ocak", 2: "Şubat", 3: "Mart", 4: "Nisan",
      5: "Mayıs", 6: "Haziran", 7: "Temmuz", 8: "Ağustos",
      9: "Eylül", 10: "Ekim", 11: "Kasım", 12: "Aralık"
    }
  },

  common_tasks: {
    monthly_report: [
      "Aylık satış toplamı",
      "Ürün bazlı grupla",
      "Önceki ayla karşılaştır",
      "Grafik oluştur"
    ],
    data_cleaning: [
      "Boş satırları sil",
      "Tekrar edenleri kaldır",
      "Format düzelt",
      "Büyük/küçük harf normalize et"
    ],
    financial_analysis: [
      "Gelir-gider tablosu",
      "KDV hesaplama",
      "Kâr marjı analizi",
      "Bütçe vs gerçek karşılaştırma"
    ]
  }
};

const app    = express();
const port   = process.env.PORT || 3001;
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'https://upsheet-ai.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS hatası'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Upsheet API', version: '1.0.0' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), anthropic: !!process.env.ANTHROPIC_API_KEY });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, sheetContext } = req.body;
    if (!message || !message.trim())
      return res.status(400).json({ error: 'Mesaj boş olamaz' });
    const result = await processExcelCommand(message.trim(), sheetContext || '');
    res.json(result);
  } catch (error) {
    console.error('/api/chat hatası:', error);
    res.status(500).json({ action: 'message', changes: [], reply: 'Sunucu hatası. Lütfen tekrar deneyin.' });
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => console.log(`ExcelAI backend → http://localhost:${port}`));
