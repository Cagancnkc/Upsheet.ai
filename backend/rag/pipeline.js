const Anthropic = require('@anthropic-ai/sdk');
const { retrieveRelevantExamples } = require('./retrieval');
const { buildExcelPrompt } = require('../prompts/excelPrompt');
const { validateAndFix } = require('../utils/jsonValidator');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function processExcelCommand(userCommand, sheetContext = '') {
  try {
    const examples = await retrieveRelevantExamples(userCommand);
    console.log(`RAG: ${examples.length} örnek bulundu`);

    const prompt = buildExcelPrompt(userCommand, examples, sheetContext);

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      temperature: 0.1,
      system: 'Sen bir Excel AI motorusun. SADECE geçerli JSON döndür. Asla açıklama yapma.',
      messages: [{ role: 'user', content: prompt }]
    });

    const rawText = response.content[0].text;
    const result = validateAndFix(rawText);

    if (!result.valid) {
      console.warn('JSON geçersiz, fallback kullanılıyor');
    }

    return result.data;

  } catch (error) {
    console.error('Pipeline hatası:', error.message);
    return {
      action: 'message',
      changes: [],
      reply: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      error: error.message
    };
  }
}

module.exports = { processExcelCommand };
