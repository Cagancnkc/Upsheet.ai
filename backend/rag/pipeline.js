const Anthropic = require('@anthropic-ai/sdk');
const { retrieveRelevantExamples } = require('./retrieval');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// System prompt — sabit, her çağrıda aynı → cache'lenir
function getSystemPrompt() {
  return `Sen Mocksheet AI asistanısın.
Excel verilerini Türkçe doğal dil komutlarıyla yönetiyorsun.

GÖREVIN:
Kullanıcının Türkçe komutunu analiz et ve
SADECE geçerli JSON döndür.

DESTEKLENEN AKSİYONLAR:
- sort: Sıralama (direction: asc/desc, column)
- sum: Toplama (column, target_cell)
- average: Ortalama (column)
- delete_rows: Satır silme (condition: empty/duplicate)
- remove_duplicates: Tekrar kaldırma
- highlight: Renklendirme (condition, color hex)
- update_cells: Hücre güncelleme (formula, factor)
- filter: Filtreleme (condition, value)
- transform: Dönüşüm (transform: uppercase/lowercase/trim)
- message: Sadece mesaj (bilgi ver)

YANIT FORMATI:
{
  "action": "aksiyon_adı",
  "reply": "✓ Türkçe açıklama",
  "column": "sütun (varsa)",
  "direction": "asc|desc (sort için)",
  "condition": "koşul (varsa)",
  "color": "#hex (highlight için)",
  "formula": "formül (varsa)",
  "factor": null,
  "source_column": "kaynak",
  "target_cell": "hedef hücre",
  "transform": "dönüşüm tipi",
  "changes": []
}

KURALLAR:
1. SADECE JSON döndür — başka hiçbir şey yazma
2. reply her zaman Türkçe olsun
3. Başarılı aksiyonlar "✓" ile başlasın
4. Belirsiz komutlarda en yakın aksiyonu seç
5. changes array'i her zaman [] döndür`;
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
  return `VERİ:\n${preview}\n\nKOMUT: "${userMessage}"`;
}

function buildSheetPreview(sheetData) {
  if (typeof sheetData === 'string') {
    return sheetData ? sheetData.substring(0, 2000) : 'Veri yok';
  }
  if (!sheetData || !sheetData.length) return 'Veri yok';

  const headers = sheetData[0] || [];
  const rows = sheetData.slice(1, 4);
  const total = sheetData.length - 1;

  let preview = `${total} satır, ${headers.length} sütun\n`;
  preview += `Sütunlar: ${headers.filter(Boolean).join(', ')}\n`;

  rows.forEach((row, i) => {
    const sample = headers.slice(0, 4).map((h, j) =>
      `${h}:${String(row[j] || '').slice(0, 15)}`
    ).join(' | ');
    preview += `Satır ${i + 1}: ${sample}\n`;
  });

  return preview;
}

function parseAIResponse(rawText) {
  if (!rawText?.trim()) {
    return { action: 'message', reply: '⚠️ Boş yanıt', changes: [] };
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
    if (!parsed.action) parsed.action = 'message';
    if (!parsed.reply) parsed.reply = '✓ İşlem tamamlandı';
    if (!parsed.changes) parsed.changes = [];
    return parsed;
  } catch (e) {
    console.warn('JSON parse failed:', e.message, 'Raw:', rawText.slice(0, 200));
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
