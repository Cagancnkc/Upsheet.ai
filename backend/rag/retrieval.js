const { createEmbedding } = require('./embeddings');
const { searchSimilar } = require('./vectorStore');

async function retrieveRelevantExamples(userCommand) {
  try {
    const queryEmbedding = await createEmbedding(userCommand);
    const results = await searchSimilar(queryEmbedding, 5);
    return results.map(r => ({
      command: r.user_command,
      logic: r.logic,
      output: r.output,
      category: r.category,
      similarity: r.similarity
    }));
  } catch (error) {
    console.error('Retrieval hatası:', error.message);
    return [];
  }
}

module.exports = { retrieveRelevantExamples };
