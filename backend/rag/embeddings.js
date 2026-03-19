const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function createEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float'
  });
  return response.data[0].embedding;
}

async function createBatchEmbeddings(texts) {
  const embeddings = [];
  for (const text of texts) {
    const embedding = await createEmbedding(text);
    embeddings.push(embedding);
    await new Promise(r => setTimeout(r, 100));
  }
  return embeddings;
}

module.exports = { createEmbedding, createBatchEmbeddings };
