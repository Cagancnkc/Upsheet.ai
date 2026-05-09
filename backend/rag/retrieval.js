const { createEmbedding } = require('./embeddings');
const { searchSimilar } = require('./vectorStore');
const { bm25Search, normalizeBm25Scores } = require('./hybridSearch');

// Türkçe eş anlamlı sözlük — query expansion için
const TURKISH_SYNONYMS = {
  'sırala': ['listele', 'düzenle'],
  'topla': ['toplamını hesapla', 'sum al'],
  'sil': ['kaldır', 'temizle'],
  'göster': ['filtrele', 'listele'],
  'karşılaştır': ['kıyasla', 'farkını bul'],
  'analiz et': ['incele', 'değerlendir'],
  'tahmin': ['öngör', 'projeksiyon'],
  'anomali': ['aykırı değer', 'outlier'],
  'boya': ['renklendir', 'vurgula'],
  'hesapla': ['bul', 'çıkar'],
  'filtrele': ['göster', 'bul'],
  'grupla': ['kategorize et', 'ayır'],
  'temizle': ['düzelt', 'normalize et'],
  'çıkar': ['ayıkla', 'bul'],
  'ortalama': ['mean', 'ortalama hesapla'],
  'heatmap': ['ısıl harita', 'renk skalası'],
};

// Kategori boost — nadir/kritik kategorilere öncelik
const CATEGORY_BOOST = {
  finance: 1.05,
  hr: 1.05,
  formula: 1.03,
  heatmap: 1.02,
  forecast: 1.02,
  anomaly_detection: 1.02,
  compare: 1.02,
  sentiment_analysis: 1.02,
};

function expandQuery(userCommand) {
  const variants = [userCommand];
  const lower = userCommand.toLowerCase();

  for (const [keyword, synonyms] of Object.entries(TURKISH_SYNONYMS)) {
    if (lower.includes(keyword)) {
      for (const syn of synonyms) {
        const expanded = lower.replace(keyword, syn);
        if (!variants.includes(expanded)) variants.push(expanded);
        if (variants.length >= 3) break;
      }
    }
    if (variants.length >= 3) break;
  }

  return variants.slice(0, 3);
}

function deduplicateResults(allResults) {
  const seen = new Map();
  for (const r of allResults) {
    const key = r.user_command?.toLowerCase().trim();
    if (!seen.has(key) || r.similarity > seen.get(key).similarity) {
      seen.set(key, r);
    }
  }
  return Array.from(seen.values());
}

function rerankResults(results, userCommand) {
  const lowerCmd = userCommand.toLowerCase();
  const userWords = lowerCmd.split(/\s+/).filter(w => w.length > 1);

  return results.map(r => {
    let score = r.hybridScore ?? r.similarity ?? 0;

    // Category boost
    const boost = CATEGORY_BOOST[r.category] || 1.0;
    score *= boost;

    // Keyword bonus: +0.05 eğer kullanıcı kelimesi stored command'da geçiyorsa
    const storedLower = (r.user_command || '').toLowerCase();
    const overlap = userWords.filter(w => storedLower.includes(w)).length;
    if (overlap > 0) score += 0.05 * Math.min(overlap, 2);

    return { ...r, finalScore: score };
  }).sort((a, b) => b.finalScore - a.finalScore);
}

async function retrieveRelevantExamples(userCommand) {
  try {
    const queries = expandQuery(userCommand);

    // Paralel embedding + vektör arama
    const [embeddingResults, ...extraResults] = await Promise.all(
      queries.map(async (q) => {
        const emb = await createEmbedding(q);
        return searchSimilar(emb, 10);
      })
    );

    const allVectorResults = [...embeddingResults, ...extraResults.flat()];
    const deduped = deduplicateResults(allVectorResults);

    // In-memory BM25 arama
    const bm25Raw = bm25Search(userCommand, 10);
    const bm25Normalized = normalizeBm25Scores(bm25Raw);
    const bm25Map = new Map(bm25Normalized.map(r => [r.user_command.toLowerCase().trim(), r.bm25ScoreNorm]));

    // Hybrid fusion: 0.7 * vector + 0.3 * BM25
    const fused = deduped.map(r => {
      const key = (r.user_command || '').toLowerCase().trim();
      const bm25Score = bm25Map.get(key) || 0;
      const hybridScore = 0.7 * (r.similarity || 0) + 0.3 * bm25Score;
      return { ...r, hybridScore };
    });

    // BM25-only yüksek skorlu sonuçları ekle (domain terimleri için)
    for (const b of bm25Normalized) {
      if (b.bm25ScoreNorm > 0.5) {
        const key = b.user_command.toLowerCase().trim();
        const already = fused.some(r => (r.user_command || '').toLowerCase().trim() === key);
        if (!already) {
          fused.push({ user_command: b.user_command, category: b.category, similarity: 0, hybridScore: 0.3 * b.bm25ScoreNorm });
        }
      }
    }

    // Rerank + slice top 5
    const reranked = rerankResults(fused, userCommand).slice(0, 5);

    return reranked.map(r => ({
      command: r.user_command,
      logic: r.logic,
      output: r.output,
      category: r.category,
      similarity: r.finalScore ?? r.hybridScore ?? r.similarity
    }));

  } catch (error) {
    console.error('Retrieval hatası:', error.message);
    return [];
  }
}

module.exports = { retrieveRelevantExamples, expandQuery };
