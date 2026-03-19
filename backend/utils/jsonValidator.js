function validateAndFix(rawResponse) {
  try {
    let clean = rawResponse
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      clean = clean.substring(start, end + 1);
    }

    const parsed = JSON.parse(clean);

    if (!parsed.action) parsed.action = 'message';
    if (!parsed.changes) parsed.changes = [];
    if (!parsed.reply) parsed.reply = 'İşlem tamamlandı';

    return { valid: true, data: parsed };
  } catch (error) {
    return {
      valid: false,
      data: {
        action: 'message',
        changes: [],
        reply: 'Komut anlaşılamadı. Lütfen tekrar deneyin.',
        error: error.message
      }
    };
  }
}

module.exports = { validateAndFix };
