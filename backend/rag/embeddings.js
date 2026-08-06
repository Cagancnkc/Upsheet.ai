const OpenAI = require('openai');

let _openai = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

// In-memory LRU embedding cache — aynı query için OpenAI'a tekrar gitmez
const _embCache = new Map();
const _EMB_CACHE_MAX = 500;

async function createEmbedding(text) {
  if (_embCache.has(text)) return _embCache.get(text);
  const response = await getOpenAI().embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float'
  });
  const emb = response.data[0].embedding;
  if (_embCache.size >= _EMB_CACHE_MAX) {
    _embCache.delete(_embCache.keys().next().value);
  }
  _embCache.set(text, emb);
  return emb;
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
