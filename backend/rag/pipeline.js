const Anthropic = require('@anthropic-ai/sdk');
const { retrieveRelevantExamples } = require('./retrieval');
const { buildExcelPrompt } = require('../prompts/excelPrompt');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

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

      const prompt = buildExcelPrompt(userCommand, sheetContext || '', ragContext);

      const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        temperature: 0.1,
        system: 'Sen bir Excel AI motorusun. SADECE geçerli JSON döndür. Asla açıklama yapma.',
        messages: [{ role: 'user', content: prompt }]
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
