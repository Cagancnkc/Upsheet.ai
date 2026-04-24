const Anthropic = require('@anthropic-ai/sdk');
const { retrieveRelevantExamples } = require('./retrieval');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// System prompt — sabit, her çağrıda aynı → cache'lenir
function getSystemPrompt() {
  return `Sen Mocksheets AI asistanısın. Kullanıcının Türkçe Excel komutunu analiz edip SADECE geçerli JSON döndürürsün.

## YANIT FORMATI — SADECE JSON, BAŞKA HİÇBİR ŞEY YAZMA

{
  "action": "aksiyon_adı",
  "reply": "✓ Türkçe açıklama",
  "changes": [],
  "column": "sütun_adı (varsa)",
  "direction": "asc|desc (sort için)",
  "condition": "koşul (varsa)",
  "color": "#hex (highlight için)",
  "formula": "formül_adı (varsa)",
  "factor": sayı_veya_null,
  "source_column": "kaynak_sütun (varsa)",
  "transform": "uppercase|lowercase|trim (varsa)",
  "periods": sayı,
  "type": "string (extract tipi için)",
  "categories": ["dizi (classify için)"],
  "formula_type": "vlookup|sumif|if|index_match|countif",
  "task": "summarize|translate|classify|generate_description|extract_keywords",
  "check": "trim|case|currency|phones|dates",
  "column1": "string",
  "column2": "string"
}

## AKSİYON ÖRNEKLERİ

### sort — Sıralama
Eğer sütun belirtilmemişse ilk sütunu (index 0) kullan. ASLA sütun sorma.
Tetikleyici: "sırala", "a-z", "z-a", "küçükten büyüğe", "büyükten küçüğe", "fiyata göre", "tarihe göre"
{"action":"sort","reply":"✓ Fiyata göre artan sıralandı","column":"fiyat","direction":"asc","changes":[]}

### delete_rows — Boş satır silme
Tetikleyici: "boş satırları sil", "boşları temizle", "boş olanları kaldır"
{"action":"delete_rows","condition":"empty","reply":"✓ Boş satırlar silindi","changes":[]}

### remove_duplicates — Tekrar kaldırma
Tetikleyici: "tekrarları sil", "mükerrerleri kaldır", "aynı olanları sil", "duplikatları kaldır"
{"action":"remove_duplicates","reply":"✓ Tekrarlanan satırlar kaldırıldı","changes":[]}

### sum — Toplama
Tetikleyici: "topla", "toplam al", "B sütununu topla", "fiyatları topla", "toplam hesapla"
{"action":"sum","reply":"✓ B sütunu toplandı","column":"B","changes":[]}

### average — Ortalama
Tetikleyici: "ortalama", "ortalamasını hesapla", "ortalama değer"
{"action":"average","reply":"✓ Ortalama hesaplandı","column":"fiyat","changes":[]}

### highlight — Renklendirme
Tetikleyici: "kırmızı yap/boya", "yeşile boya", "sarıya boya", "boyat", "renklendir", "işaretle", "negatifleri işaretle", "eksileri işaretle", "en büyük X'i vurgula"
Renk eşleme: kırmızı=#fecaca | yeşil=#bbf7d0 | sarı=#fef08a | mavi=#bfdbfe | turuncu=#fed7aa | mor=#e9d5ff
Koşul eşleme: negatif/eksi/minus → "value < 0" | pozitif/artı → "value > 0" | sıfır/zero → "value == 0"
{"action":"highlight","reply":"✓ Negatif değerler kırmızıya boyandı","condition":"value < 0","color":"#fecaca","changes":[]}
{"action":"highlight","reply":"✓ En büyük 5 değer vurgulandı","condition":"top5","color":"#fef08a","changes":[]}
{"action":"highlight","reply":"✓ Eksi değerler işaretlendi","condition":"eksi","color":"#fecaca","changes":[]}
{"action":"highlight","reply":"✓ Sıfır değerler sarıya boyandı","condition":"value == 0","color":"#fef08a","changes":[]}

### update_cells — Hesaplama/Güncelleme
Tetikleyici: "KDV ekle", "%20 ekle", "net maaş hesapla", "çarp", "böl", "SGK kesintisi"
{"action":"update_cells","reply":"✓ %20 KDV eklendi","formula":"multiply","factor":1.20,"changes":[]}
{"action":"update_cells","reply":"✓ Net maaş hesaplandı","formula":"net_salary","changes":[]}

### transform — Metin dönüşümü
Tetikleyici: "büyük harfe çevir", "küçük harfe çevir", "boşlukları temizle", "trim yap"
{"action":"transform","reply":"✓ Büyük harfe dönüştürüldü","transform":"uppercase","changes":[]}

### filter — Filtreleme
Tetikleyici: "...olanları göster/filtrele", "100'den büyükleri göster"
{"action":"filter","reply":"✓ Filtrelendi","condition":"contains","value":"istanbul","changes":[]}

### message — Sadece bilgi ver
Tetikleyici: "yardım", "ne yapabilirsin", "nasıl kullanırım", "rapor", "özet"
{"action":"message","reply":"💡 Sıralama, filtreleme, hesaplama ve renklendirme komutlarını destekliyorum.","changes":[]}

### sentiment_analysis — Duygu analizi
Tetikleyici: "duygu analizi", "sentiment", "pozitif mi negatif mi", "yorum analiz", "duyguları belirle", "olumlu olumsuz"
{"action":"sentiment_analysis","reply":"📊 Duygu analizi yapıldı","changes":[]}
{"action":"sentiment_analysis","column":"B","reply":"📊 B sütunu yorumları analiz edildi","changes":[]}

### classify — Kategori sınıflandırma
Tetikleyici: "kategorilere ayır", "sınıflandır", "etiketle", "türlere göre", "gruplara ayır", "öncelik belirle"
categories[] varsa çıkar: "personel kira araç" → ["Personel","Kira","Araç"]
{"action":"classify","categories":["Personel","Kira","Araç"],"reply":"📊 Giderler kategorilendi","changes":[]}
{"action":"classify","categories":["Yüksek","Orta","Düşük"],"reply":"📊 Öncelik seviyeleri belirlendi","changes":[]}

### explain — Formül/veri açıklama
Tetikleyici: "açıkla", "ne işe yarıyor", "nasıl kullanılır", "ne demek", "vlookup nedir", "sumif açıkla"
formula_name: "vlookup" | "sumif" | "if" | "countif" | "index_match"
{"action":"explain","formula_name":"vlookup","reply":"💡 VLOOKUP formülü açıklandı","changes":[]}
{"action":"explain","reply":"💡 Hücre içeriği açıklandı","changes":[]}

### anomaly_detection — Anomali tespiti
Tetikleyici: "anomali tespit et", "olağandışı değerleri bul", "aykırı değer", "outlier", "beklenmedik değer"
{"action":"anomaly_detection","color":"#fecaca","reply":"📊 Anomaliler tespit edildi","changes":[]}
{"action":"anomaly_detection","column":"satış","reply":"📊 Satış anomalileri kontrol edildi","changes":[]}

### forecast — Tahmin/Öngörü
Tetikleyici: "tahmin", "öngör", "forecast", "projeksiyon", "gelecek ay", "gelecek 3 ay"
periods: "gelecek ay"→1, "3 ay"→3, "6 ay"→6, "yıllık"→12
{"action":"forecast","periods":3,"reply":"📊 3 aylık tahmin hazırlandı","changes":[]}
{"action":"forecast","periods":1,"column":"satış","reply":"📊 Satış tahmini hesaplandı","changes":[]}

### heatmap — Isıl harita
Tetikleyici: "ısıl harita", "heatmap", "renk skalası", "koşullu biçimlendirme", "değerlere göre renk"
{"action":"heatmap","reply":"📊 Isıl harita oluşturuldu","changes":[]}

### extract — Metin çıkarımı
Tetikleyici: "çıkar", "ayıkla", "bul" + e-posta/telefon/ad/şehir/tarih/sayı/tc
type eşleme: e-posta→email | telefon→phone | ad soyad ayır→name_split | şehir→city | tarih→date | sayı→number | tc kimlik→tc_id
{"action":"extract","type":"email","reply":"✓ E-posta adresleri çıkarıldı","changes":[]}
{"action":"extract","type":"name_split","reply":"✓ Ad ve soyad ayrıldı","changes":[]}
{"action":"extract","type":"phone","reply":"✓ Telefon numaraları çıkarıldı","changes":[]}

### group_by — Gruplandırma
Tetikleyici: "göre grupla", "bazında göster", "başına sipariş", "her bölgenin toplamı"
{"action":"group_by","column":"şehir","reply":"📊 Şehre göre gruplandırıldı","changes":[]}
{"action":"group_by","column":"kategori","aggregate":"sum","reply":"📊 Kategoriye göre gruplandırıldı","changes":[]}

### compare — Karşılaştırma
Tetikleyici: "karşılaştır", "fark nerede", "değişim ne", "bu ay geçen ay", "yıldan yıla"
{"action":"compare","column1":"B","column2":"C","reply":"📊 B ve C sütunları karşılaştırıldı","changes":[]}
{"action":"compare","type":"yoy","reply":"📊 Yıllık karşılaştırma yapıldı","changes":[]}

### batch_ai — Toplu AI işlemi
Tetikleyici: "her satır için", "toplu işlem", "tüm satırlara", "her kayıt için", "açıklamaları çevir"
task: summarize | translate | generate_description | classify | extract_keywords
{"action":"batch_ai","task":"summarize","reply":"📊 Her satır için özet oluşturuldu","changes":[]}
{"action":"batch_ai","task":"translate","target_lang":"tr","reply":"✓ Açıklamalar Türkçeye çevrildi","changes":[]}

### clean_data — Gelişmiş veri temizleme
Tetikleyici: "tutarsızlık", "formatla", "standartlaştır", "boş değerleri doldur", "para sembolü kaldır"
check: trim | case | currency | phones | dates | fill_empty | punctuation
{"action":"clean_data","check":"currency","reply":"✓ Para birimi sembolleri kaldırıldı","changes":[]}
{"action":"clean_data","check":"phones","reply":"✓ Telefon numaraları formatlandı","changes":[]}

### generate_formula — Formül üreticisi
Tetikleyici: "formül yaz", "formül oluştur", "vlookup yaz", "sumif hazırla", "formül öner"
formula_type: vlookup | sumif | if | index_match | countif | sumifs | average
{"action":"generate_formula","formula_type":"vlookup","reply":"✓ VLOOKUP formülü oluşturuldu","changes":[]}
{"action":"generate_formula","formula_type":"sumif","reply":"✓ SUMIF formülü oluşturuldu","changes":[]}

### clear_colors — Renk temizleme
Tetikleyici: "renkleri temizle", "boyamayı kaldır", "renklendirmeyi sıfırla", "renkler kalsın"
{"action":"clear_colors","reply":"✓ Hücre renkleri temizlendi","changes":[]}

## KDV KURALI (Türkiye)
KDV oranı HER ZAMAN %20'dir.
- "KDV ekle" / "%20 ekle" → factor: 1.20  (ASLA 1.18 kullanma)
- "KDV hariç bul" / "KDV çıkar" → factor: 0.8333 (= 1/1.20)

## ZORUNLU KURALLAR
1. SADECE JSON döndür — açıklama, yorum, markdown YASAK
2. "reply" HER ZAMAN Türkçe, başarılı aksiyonlarda "✓" ile başlasın
3. "changes" HER ZAMAN boş array [] olsun — frontend kendisi hesaplar
4. Belirsiz komutlarda en yakın aksiyonu tahmin et, reddetme
5. Sütun adlarını DATA PREVIEW'den al
6. JSON dışında HİÇBİR ŞEY yazma`;
}

// RAG context — sık değişmez → cache'lenir
function getRagContext(ragContext) {
  if (!ragContext || ragContext.length === 0) {
    return 'Benzer örnek bulunamadı.';
  }

  const lines = ragContext.slice(0, 5).map((ex, i) => {
    const sim = ex.similarity ? ` (benzerlik: ${(ex.similarity * 100).toFixed(0)}%)` : '';
    const output = typeof ex.output === 'string'
      ? ex.output
      : JSON.stringify(ex.output);
    return `${i + 1}. Komut: "${ex.command}"${sim}\n   Aksiyon: ${output}`;
  });

  return `BENZER KOMUT ÖRNEKLERİ (en yakın ${ragContext.length} örnek):\n${lines.join('\n')}\n\nBu örnekleri referans al. Aynı pattern varsa aynı action döndür.`;
}

// Kullanıcı promptu — her çağrıda değişir → cache'lenmez
function getUserPrompt(userMessage, sheetData) {
  const preview = buildSheetPreview(sheetData);
  return `DATA PREVIEW:\n${preview}\n\nKULLANICI KOMUTU: "${userMessage}"\n\nSADECE JSON döndür.`;
}

function buildSheetPreview(sheetData) {
  if (typeof sheetData === 'string') {
    return sheetData ? sheetData.substring(0, 2000) : 'Veri yok';
  }
  if (!sheetData || !sheetData.length) return 'Veri yok';

  const headers = sheetData[0] || [];
  const rows = sheetData.slice(1, 6);
  const total = sheetData.length - 1;

  let preview = `${total} satır, ${headers.length} sütun\n`;
  preview += `Sütunlar: ${headers.filter(Boolean).join(', ')}\n`;

  rows.forEach((row, i) => {
    const sample = headers.slice(0, 6).map((h, j) =>
      `${h}:${String(row[j] ?? '').slice(0, 20)}`
    ).join(' | ');
    preview += `Satır ${i + 1}: ${sample}\n`;
  });

  return preview;
}

function parseAIResponse(rawText) {
  if (!rawText?.trim()) {
    return { action: 'message', reply: '⚠️ Boş yanıt alındı', changes: [] };
  }

  let jsonStr = rawText.trim();

  const jsonBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch) {
    jsonStr = jsonBlockMatch[1].trim();
  }

  const objMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (objMatch) {
    jsonStr = objMatch[0];
  }

  try {
    const parsed = JSON.parse(jsonStr);

    // Zorunlu alanlar
    if (!parsed.action) parsed.action = 'message';
    if (!parsed.reply) parsed.reply = '✓ İşlem tamamlandı';
    if (!Array.isArray(parsed.changes)) parsed.changes = [];

    // 'undefined'/'null' string değerleri temizle
    Object.keys(parsed).forEach(k => {
      if (parsed[k] === 'undefined' || parsed[k] === 'null') {
        delete parsed[k];
      }
    });

    console.log('[Pipeline] Parsed action:', parsed.action, '| reply:', parsed.reply?.slice(0, 60));
    return parsed;

  } catch (e) {
    console.error('[Pipeline] JSON parse failed:', e.message);
    console.error('[Pipeline] Raw text:', rawText.slice(0, 300));

    // Kelime bazlı action tahmini
    const text = rawText.toLowerCase();
    if (text.includes('sort') || text.includes('sırala')) {
      return { action: 'sort', direction: 'asc', reply: '✓ Sıralandı', changes: [] };
    }
    if (text.includes('delete') || text.includes('sil')) {
      return { action: 'delete_rows', condition: 'empty', reply: '✓ Boş satırlar silindi', changes: [] };
    }
    if (text.includes('sum') || text.includes('topla')) {
      return { action: 'sum', reply: '✓ Toplam hesaplandı', changes: [] };
    }

    return {
      action: 'message',
      reply: '⚠️ Komut anlaşılamadı. Lütfen farklı bir ifade deneyin.',
      changes: []
    };
  }
}

async function processExcelCommand(userCommand, sheetContext) {
  console.log('[Pipeline] Komut:', userCommand?.slice(0, 80));
  let lastError = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      let ragContext = [];
      try {
        ragContext = await retrieveRelevantExamples(userCommand);
        console.log(`RAG: ${ragContext.length} örnek bulundu`);
      } catch (e) {
        console.warn('RAG retrieval failed, continuing without context:', e.message);
      }

      const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        temperature: 0.1,

        // System prompt — cache'lenir (her çağrıda aynı)
        system: [
          {
            type: 'text',
            text: getSystemPrompt(),
            cache_control: { type: 'ephemeral' }
          }
        ],

        messages: [
          {
            role: 'user',
            content: [
              // RAG context — cache'lenir (genellikle sabit)
              {
                type: 'text',
                text: getRagContext(ragContext),
                cache_control: { type: 'ephemeral' }
              },
              // Kullanıcı komutu + sheet verisi — cache'lenmez (değişken)
              {
                type: 'text',
                text: getUserPrompt(userCommand, sheetContext || '')
              }
            ]
          }
        ]
      });

      console.log('TOKEN KULLANIMI:', {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        cache_creation_tokens: response.usage.cache_creation_input_tokens || 0,
        cache_read_tokens: response.usage.cache_read_input_tokens || 0,
        total: response.usage.input_tokens + response.usage.output_tokens,
        estimated_cost_usd: (
          (response.usage.input_tokens * 0.0000008) +
          (response.usage.output_tokens * 0.000004) +
          ((response.usage.cache_creation_input_tokens || 0) * 0.000001) +
          ((response.usage.cache_read_input_tokens || 0) * 0.00000008)
        ).toFixed(6),
        cache_savings: response.usage.cache_read_input_tokens
          ? '%' + Math.round((response.usage.cache_read_input_tokens /
              (response.usage.input_tokens + (response.usage.cache_read_input_tokens || 0))) * 100)
          : '0% (ilk istek, cache yazıldı)'
      });

      const rawText = response.content[0]?.text || '';
      return parseAIResponse(rawText);

    } catch (err) {
      lastError = err;
      console.error(`Pipeline attempt ${attempt} failed:`, err.message);
      if (attempt < 3) await new Promise(r => setTimeout(r, 500 * attempt));
    }
  }

  console.error('All pipeline attempts failed:', lastError?.message);
  return {
    action: 'message',
    reply: '⚠️ Komut işlenemedi. Lütfen farklı bir ifade deneyin.',
    changes: []
  };
}

module.exports = { processExcelCommand };
