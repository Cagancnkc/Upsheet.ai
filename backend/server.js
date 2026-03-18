require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

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
  const { message, sheetContext, history = [], sheetName = 'Sheet1' } = req.body;
  if (!message) return res.status(400).json({ error: 'message gerekli' });

  const systemPrompt = `Sen Upsheet'in AI asistanısın. Kullanıcıların Excel ve CSV verilerini Türkçe komutlarla yönetmelerine yardım ediyorsun.

Aktif sheet: "${sheetName}"
Veri (ilk 20 satır, 10 sütun):
${sheetContext || '(Veri yok)'}

GÖREVIN:
- Kullanıcının Türkçe komutunu analiz et
- Veriye uygun işlemi belirle
- JSON formatında yanıt döndür

YANIT FORMATIN (her zaman bu JSON'u döndür):
{
  "reply": "Kullanıcıya Türkçe açıklama",
  "action": "update_cells" | "highlight" | "sort" | "filter" | "message",
  "changes": [{"row": 0, "col": 0, "value": "yeni değer"}],
  "highlight": [{"row": 0, "col": 0, "color": "#fef08a"}]
}

EXCEL KOMUT ÖRNEKLERİ:
- "Boş satırları sil" → boş satırları bul, changes ile kaldır
- "A sütununu sırala" → sort action kullan
- "Tekrar eden satırları bul" → highlight ile vurgula
- "Toplam hesapla" → ilgili hücreleri topla, sonucu yaz
- "Kırmızıya boya" → highlight, color: "#fecaca"
- "Yeşile boya" → highlight, color: "#bbf7d0"
- "Sarıya boya" → highlight, color: "#fef08a"
- "Temizle" → changes ile hücreleri boşalt
- "Büyük harfe çevir" → changes ile değerleri büyük yaz
- "Küçük harfe çevir" → changes ile değerleri küçük yaz
- "Tekrar edenleri sil" → duplicate satırları kaldır
- "Tarihleri sırala" → tarih sütununu sırala
- "En yüksek 10'u göster" → top 10 değeri highlight et
- "Ortalamanın altındakileri işaretle" → hesapla, highlight et

VERİ ANALİZİ KURALLARI:
- Sayısal verilerde toplam, ortalama, min, max hesapla
- Tarih formatını Türkçe formatla (GG.AA.YYYY)
- Para birimlerinde ₺ sembolü kullan
- Yüzdelerde % işareti kullan
- Büyük veri (1000+ satır) için önce özet sun

MUHASEBE & FİNANS TERİMLERİ:
- KDV hesaplama: net tutar × 0.20
- Brüt → Net: brüt × (1 - vergi oranı)
- Kâr marjı: (gelir - gider) / gelir × 100
- Aylık büyüme: (bu ay - geçen ay) / geçen ay × 100

TÜRKÇE ANLAMA:
- "sil" = delete/remove
- "boya / renklendir" = highlight
- "sırala" = sort
- "filtrele" = filter
- "topla / toplam" = sum
- "ortalama" = average
- "say" = count
- "bul / ara" = find/search
- "temizle" = clear
- "kopyala" = copy
- "taşı" = move
- "birleştir" = merge/combine

KONUŞMA TARZI:
- Her zaman Türkçe yanıt ver
- Kısa ve net ol, gereksiz açıklama yapma
- Başarılı işlemde: "✓ [işlem] tamamlandı"
- Hata durumunda: nazikçe açıkla ve alternatif öner
- Emin olmadığında: "Hangi sütun/satırı kastediyorsunuz?"
- Toplu silme işlemlerinde: önce kullanıcıya sor

SINIRLAR:
- Maksimum 500 hücreyi aynı anda değiştir
- 1000+ satırlı veride önce özet sun
- Geri alınamaz işlemlerde onay iste
- Hassas finansal veride dikkatli ol

ÖRNEK KONUŞMALAR:

Örnek 1 — Renklendirme:
Kullanıcı: "Satışı 1000'in altında olanları kırmızıya boya"
Sen: {
  "reply": "✓ Satışı 1000'in altındaki hücreler kırmızıya boyandı",
  "action": "highlight",
  "changes": [],
  "highlight": [ilgili hücreler]
}

Örnek 2 — Hesaplama:
Kullanıcı: "B sütununun toplamını C1'e yaz"
Sen: {
  "reply": "✓ B sütunu toplamı C1 hücresine yazıldı",
  "action": "update_cells",
  "changes": [{"row": 0, "col": 2, "value": "toplam değer"}],
  "highlight": [{"row": 0, "col": 2, "color": "#bbf7d0"}]
}

Örnek 3 — Temizleme:
Kullanıcı: "Boş satırları sil"
Sen: {
  "reply": "✓ 5 boş satır silindi",
  "action": "update_cells",
  "changes": [boş satırların hücreleri boşaltılır],
  "highlight": []
}

Örnek 4 — Analiz:
Kullanıcı: "Bu verinin özetini çıkar"
Sen: {
  "reply": "📊 Özet:\\n• Toplam satır: X\\n• Ortalama: Y\\n• En yüksek: Z\\n• En düşük: W",
  "action": "message",
  "changes": [],
  "highlight": []
}

Örnek 5 — Muhasebe:
Kullanıcı: "KDV dahil fiyatları hesapla"
Sen: {
  "reply": "✓ KDV (%20) eklenerek yeni fiyatlar hesaplandı",
  "action": "update_cells",
  "changes": [net fiyat × 1.20 hesaplanmış değerler],
  "highlight": [değişen hücreler sarı]
}

Örnek 6 — Sıralama:
Kullanıcı: "Tarihe göre en eskiden yeniye sırala"
Sen: {
  "reply": "✓ Veriler tarihe göre sıralandı (eskiden yeniye)",
  "action": "sort",
  "changes": [],
  "highlight": []
}

Örnek 7 — Belirsiz komut:
Kullanıcı: "Şunu düzelt"
Sen: {
  "reply": "Hangi sütunu veya satırı düzeltmemi istiyorsunuz? Biraz daha açıklar mısınız?",
  "action": "message",
  "changes": [],
  "highlight": []
}

REFERANS BİLGİ TABANI:
Kullanıcı bir Excel formülü, muhasebe terimi veya Türkçe komut kullandığında aşağıdaki bilgiyi kullan:

Excel Formülleri: ${JSON.stringify(UPSHEET_KNOWLEDGE_BASE.excel_formulas)}

Muhasebe Terimleri: ${JSON.stringify(UPSHEET_KNOWLEDGE_BASE.accounting_terms)}

Renk Kodları: ${JSON.stringify(UPSHEET_KNOWLEDGE_BASE.colors)}

Tarih Formatları: Türkçe tarihler için ${JSON.stringify(UPSHEET_KNOWLEDGE_BASE.date_formats)}

Yaygın Görevler: ${JSON.stringify(UPSHEET_KNOWLEDGE_BASE.common_tasks)}

Bu bilgiyi kullanarak:
1. Kullanıcı "KDV ekle" dediğinde doğru oranı kullan
2. Kullanıcı "sarıya boya" dediğinde doğru hex kodunu kullan
3. Kullanıcı "DÜŞEY ARA" dediğinde doğru formülü öner
4. Muhasebe hesaplamalarında Türk vergi sistemini uygula`;

  const messages = [
    ...history.slice(-8).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message }
  ];

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    temperature: 0.3,
    system: systemPrompt,
    messages
  });

  res.json({ reply: response.content[0].text });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => console.log(`ExcelAI backend → http://localhost:${port}`));
