const { EXCEL_DATASET } = require('./dataset');

// BM25 parameters (standard Okapi BM25)
const K1 = 1.5;
const B = 0.75;

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\sığüşöçİĞÜŞÖÇ]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

let index = null;

function buildIndex() {
  const docs = EXCEL_DATASET.map(item => ({
    id: item.user_command,
    category: item.category,
    tokens: tokenize(item.user_command + ' ' + (item.logic || ''))
  }));

  const df = {};
  for (const doc of docs) {
    const seen = new Set(doc.tokens);
    for (const t of seen) {
      df[t] = (df[t] || 0) + 1;
    }
  }

  const N = docs.length;
  const avgdl = docs.reduce((s, d) => s + d.tokens.length, 0) / N;

  return { docs, df, N, avgdl };
}

function getIndex() {
  if (!index) index = buildIndex();
  return index;
}

function bm25Search(queryText, topK = 10) {
  const { docs, df, N, avgdl } = getIndex();
  const queryTokens = tokenize(queryText);

  const scores = docs.map(doc => {
    const tf = {};
    for (const t of doc.tokens) tf[t] = (tf[t] || 0) + 1;

    let score = 0;
    for (const qt of queryTokens) {
      if (!tf[qt]) continue;
      const idf = Math.log((N - (df[qt] || 0) + 0.5) / ((df[qt] || 0) + 0.5) + 1);
      const tfNorm = (tf[qt] * (K1 + 1)) / (tf[qt] + K1 * (1 - B + B * doc.tokens.length / avgdl));
      score += idf * tfNorm;
    }

    return { user_command: doc.id, category: doc.category, bm25Score: score };
  });

  return scores
    .filter(s => s.bm25Score > 0)
    .sort((a, b) => b.bm25Score - a.bm25Score)
    .slice(0, topK);
}

function normalizeBm25Scores(results) {
  if (!results.length) return results;
  const max = results[0].bm25Score;
  if (max === 0) return results.map(r => ({ ...r, bm25ScoreNorm: 0 }));
  return results.map(r => ({ ...r, bm25ScoreNorm: r.bm25Score / max }));
}

module.exports = { bm25Search, normalizeBm25Scores, buildIndex };
