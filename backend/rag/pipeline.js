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
  "transform": "uppercase|lowercase|trim (varsa)"
}

## AKSİYON ÖRNEKLERİ

### sort — Sıralama
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
Tetikleyici: "kırmızı yap/boya", "yeşile boya", "sarıya boya", "negatifleri işaretle", "en büyük 5'i vurgula"
Renk eşleme: kırmızı=#fecaca | yeşil=#bbf7d0 | sarı=#fef08a | mavi=#bfdbfe | turuncu=#fed7aa
{"action":"highlight","reply":"✓ Negatif değerler kırmızıya boyandı","condition":"value < 0","color":"#fecaca","changes":[]}
{"action":"highlight","reply":"✓ En büyük 5 değer vurgulandı","condition":"top5","color":"#fef08a","changes":[]}

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
    return 'ÖRNEK KOMUTLAR: Sıralama, toplama, silme, renklendirme, hesaplama komutlarını destekliyorum.';
  }
  return 'BENZER ÖRNEKLER:\n' +
    ragContext.map(r =>
      `- "${r.user_command || r.command}" → ${JSON.stringify(r.output)}`
    ).join('\n');
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
