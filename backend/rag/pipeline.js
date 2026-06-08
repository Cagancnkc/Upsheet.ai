const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');
const { retrieveRelevantExamples } = require('./retrieval');

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// System prompt — sabit, her çağrıda aynı → cache'lenir
function getSystemPrompt() {
  return `Sen Mocksheets AI asistanısın. Türkçe Excel komutlarını JSON aksiyonlara çevirirsin.

## YANIT FORMATI — SADECE JSON

{
  "action": "aksiyon_adı",
  "reply": "✓ Türkçe açıklama",
  "changes": [],
  "column": "sütun_adı",
  "direction": "asc|desc",
  "condition": "koşul",
  "color": "#hex",
  "formula": "formül_adı",
  "factor": sayı,
  "transform": "uppercase|lowercase|trim",
  "value": "filtre_değeri"
}

## AKSİYON KURALLARI

### sort → Sıralama
Tetikleyici: sırala, a-z, z-a, küçükten büyüğe, büyükten küçüğe, fiyata göre, tarihe göre
{"action":"sort","direction":"asc","column":"fiyat","reply":"✓ Fiyata göre sıralandı","changes":[]}

### delete_rows → Satır silme
Tetikleyici: boş satırları sil, boşları temizle, veri olmayan kaldır
{"action":"delete_rows","condition":"empty","reply":"✓ Boş satırlar silindi","changes":[]}

### remove_duplicates → Tekrar kaldırma
Tetikleyici: tekrar edenleri sil, mükerrerleri kaldır, aynı olanları temizle
{"action":"remove_duplicates","reply":"✓ Tekrarlanan satırlar kaldırıldı","changes":[]}

### sum → Toplama
Tetikleyici: topla, toplam al, toplamını bul, sum hesapla
{"action":"sum","column":"B","reply":"✓ B sütunu toplandı","changes":[]}

### average → Ortalama
Tetikleyici: ortalama, ortalamasını hesapla, mean
{"action":"average","column":"fiyat","reply":"✓ Fiyat ortalaması hesaplandı","changes":[]}

### count_if → Koşullu sayma
Tetikleyici: kaç tane, say, adet bul, kaç kişi, kaç ürün, kaç kayıt
{"action":"count_if","condition":"value > 0","column":"fiyat","reply":"✓ 12 kayıt sayıldı","changes":[]}

### max → Maksimum değer
Tetikleyici: en yüksek, en büyük, maksimum, en pahalı, en fazla, zirve
{"action":"max","column":"fiyat","reply":"✓ En yüksek fiyat: 1250","changes":[]}

### min → Minimum değer
Tetikleyici: en düşük, en küçük, minimum, en ucuz, en az, dip
{"action":"min","column":"fiyat","reply":"✓ En düşük fiyat: 45","changes":[]}

### highlight → Renklendirme
Tetikleyici: kırmızıya boya, yeşile boya, sarıya boya, vurgula, işaretle, renklendir
Renkler: negatif/eksi=#fecaca, pozitif/artı=#bbf7d0, sarı=#fef08a, mavi=#bfdbfe
{"action":"highlight","condition":"value < 0","color":"#fecaca","reply":"✓ Negatifler kırmızıya boyandı","changes":[]}

### update_cells → Hesaplama/Güncelleme
Tetikleyici: KDV ekle, çarp, böl, artır, indir, maaş hesapla, güncelle
KDV KURALI: HER ZAMAN factor:1.20 (%20), ASLA 1.18 kullanma!
{"action":"update_cells","formula":"multiply","factor":1.20,"reply":"✓ %20 KDV eklendi","changes":[]}

### transform → Metin dönüşümü
Tetikleyici: büyük harfe çevir, küçük harfe çevir, boşlukları temizle, trim
{"action":"transform","transform":"uppercase","reply":"✓ Büyük harfe çevrildi","changes":[]}

### filter → Filtreleme
Tetikleyici: göster, filtrele, listele (belirli değer veya koşulla), bul
{"action":"filter","condition":"contains","value":"istanbul","reply":"✓ İstanbul kayıtları filtrelendi","changes":[]}

### remove_filter → Filtre kaldır
Tetikleyici: filtreyi kaldır, tüm veriyi göster, sıfırla, temizle
{"action":"remove_filter","reply":"✓ Filtre kaldırıldı","changes":[]}

### generate_formula → Excel formülü oluştur
Tetikleyici: formül yaz, Excel formülü oluştur, hesaplama formülü, fonksiyon yaz
{"action":"generate_formula","formula":"=SUMIF(A:A,\"Aktif\",B:B)","target_column":"C","reply":"✓ Formül oluşturuldu","changes":[]}

### extract → Veri çıkarma
Tetikleyici: e-posta çıkar, telefon bul, IBAN çıkar, tarih ayıkla, plaka bul, tutarları çıkar
{"action":"extract","type":"email","column":"açıklama","reply":"✓ E-postalar çıkarıldı","changes":[]}

### group_by → Gruplama
Tetikleyici: grupla, kategoriye göre ayır, bölümlere ayır, şehre göre grupla, segmentle
{"action":"group_by","column":"şehir","reply":"✓ Şehre göre gruplandı","changes":[]}

### classify → Sınıflandırma/Etiketleme
Tetikleyici: sınıflandır, etiketle, ABC analizi, risk seviyesi, kategori ata, VIP normal pasif
{"action":"classify","column":"satış","categories":["Yüksek","Orta","Düşük"],"reply":"✓ Sınıflandırma yapıldı","changes":[]}

### sentiment_analysis → Duygu analizi
Tetikleyici: duygu analizi, yorum analiz et, pozitif negatif sınıfla, memnuniyet skoru, anket analizi
{"action":"sentiment_analysis","column":"yorum","reply":"📊 Duygu analizi tamamlandı","changes":[]}

### anomaly_detection → Anomali tespiti
Tetikleyici: anomali tespit et, aykırı değer bul, beklenmedik değerleri işaretle, outlier, sapan veri
{"action":"anomaly_detection","column":"tutar","method":"zscore","reply":"📊 Anomaliler tespit edildi","changes":[]}

### forecast → Tahmin/Projeksiyon
Tetikleyici: tahmin et, öngör, gelecek ay/çeyrek/yıl, projeksiyon, hareketli ortalama ile tahmin
{"action":"forecast","column":"satış","periods":3,"reply":"📊 3 aylık tahmin hesaplandı","changes":[]}

### heatmap → Isıl harita/Renk skalası
Tetikleyici: heatmap, ısıl harita, renk skalası uygula, yoğunluk haritası, renklendirme yap
{"action":"heatmap","column":"performans","reply":"📊 Isıl harita oluşturuldu","changes":[]}

### compare → Karşılaştırma
Tetikleyici: karşılaştır, kıyasla, farkını bul, bu yıl geçen yıl, hedef vs gerçekleşen, plan fiili
{"action":"compare","col1":"hedef","col2":"gerçekleşen","reply":"📊 Karşılaştırma yapıldı","changes":[]}

### clean_data → Veri temizleme
Tetikleyici: verileri temizle, hataları düzelt, boşlukları doldur, standartlaştır, normalize et
{"action":"clean_data","reply":"✓ Veriler temizlendi","changes":[]}

### batch_ai → Toplu AI işlemi
Tetikleyici: her satır için, tüm kayıtlara uygula, toplu işlem yap, batch, her hücreye uygula
{"action":"batch_ai","instruction":"Her satırdaki ürün açıklamasını özetle","reply":"📊 Toplu işlem başlatıldı","changes":[]}

### message → Sadece bilgi ver
Tetikleyici: yardım, ne yapabilirsin, rapor, analiz (işlem gerektirmeyen sorular)
KURAL: reply ASLA "✓" ile BAŞLAMAZ. Sadece "📊" veya "ℹ️" kullan.
{"action":"message","reply":"📊 Veri analizi tamamlandı","changes":[]}

## ZORUNLU KURALLAR
1. SADECE JSON döndür — açıklama, markdown, \`\`\` işareti YASAK
2. "reply" HER ZAMAN Türkçe — işlem aksiyonlarında "✓", message aksiyonunda "📊" veya "ℹ️" ile başlasın
3. "changes" HER ZAMAN boş array [] olsun
4. Belirsiz komutlarda en yakın aksiyonu tahmin et
5. Sütun adlarını DATA PREVIEW'den al
6. KDV her zaman %20 = factor:1.20`;
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

async function processExcelCommand(userCommand, sheetContext, history = [], userId = null) {
  console.log('[Pipeline] Komut:', userCommand?.slice(0, 80));
  let lastError = null;
  const t0 = Date.now();

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
        max_tokens: 500,
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
          // Konuşma geçmişi — son 8 mesaj (4 tur)
          ...history.slice(-8).map(h => ({ role: h.role, content: String(h.content).slice(0, 500) })),
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
      const result = parseAIResponse(rawText);
      const ms = Date.now() - t0;
      getSupabase().from('performance_logs').insert({
        user_id: userId || null,
        command_text: userCommand?.slice(0, 500),
        response_ms: ms,
        success: true
      }).then(() => {}, () => {});
      return result;

    } catch (err) {
      lastError = err;
      console.error(`Pipeline attempt ${attempt} failed:`, err.message);
      if (attempt < 3) await new Promise(r => setTimeout(r, 500 * attempt));
    }
  }

  const ms = Date.now() - t0;
  getSupabase().from('performance_logs').insert({
    user_id: userId || null,
    command_text: userCommand?.slice(0, 500),
    response_ms: ms,
    success: false,
    error_msg: lastError?.message?.slice(0, 500)
  }).then(() => {}, () => {});

  console.error('All pipeline attempts failed:', lastError?.message);
  return {
    action: 'message',
    reply: '⚠️ Komut işlenemedi. Lütfen farklı bir ifade deneyin.',
    changes: []
  };
}

module.exports = { processExcelCommand };
