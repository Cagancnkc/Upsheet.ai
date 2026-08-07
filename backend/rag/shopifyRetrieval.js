'use strict';

// Shopify chat retrieval — in-memory BM25 + Türkçe hafif stemmer + kategori boost.
// Returns { examples: [...], confidence: number } — çağıran confidence'a göre karar verir.

const fs = require('fs');
const path = require('path');
const dataset = require('./shopifyDataset');

const STOPWORDS = new Set([
  've','veya','ile','için','bir','bu','şu','o','de','da','mi','mı','mu','mü',
  'ne','nasıl','neden','niye','ki','ise','çok','en','daha','hem','ama','fakat',
  'the','a','an','is','are','how','what','why','to','of','in','on','for'
]);

// Türkçe hafif suffix stemmer — en uzundan kısaya denenir, kök ≥3 harf kalmalı
const TR_SUFFIXES = [
  'larımızdan','lerimizden','larınızdan','lerinizden',
  'larımızda','lerimizde','larınızda','lerinizde',
  'larımıza','lerimize','larınıza','lerinize',
  'larımızı','lerimizi','larınızı','lerinizi',
  'larımız','lerimiz','larınız','leriniz',
  'larından','lerinden','larına','lerine',
  'larında','lerinde',
  'ların','lerin','lardan','lerden','larda','lerde',
  'ları','leri','lara','lere','lar','ler',
  'ımızdan','imizden','umuzdan','ümüzden',
  'ımızda','imizde','umuzda','ümüzde',
  'ımıza','imize','umuza','ümüze',
  'ımızı','imizi','umuzu','ümüzü',
  'ımız','imiz','umuz','ümüz',
  'ından','inden','undan','ünden',
  'ında','inde','unda','ünde',
  'ına','ine','una','üne',
  'ını','ini','unu','ünü',
  'mış','miş','muş','müş',
  'dan','den','tan','ten',
  'nın','nin','nun','nün',
  'da','de','ta','te',
  'sı','si','su','sü',
  'dı','di','du','dü',
  'tı','ti','tu','tü',
  'ın','in','un','ün',
  'ım','im','um','üm',
  'ı','i','u','ü',
  'a','e',
];

function stem(word) {
  if (word.length < 5) return word;
  for (const suf of TR_SUFFIXES) {
    if (word.endsWith(suf) && word.length - suf.length >= 3) {
      return word.slice(0, word.length - suf.length);
    }
  }
  return word;
}

// categoryBoost.json varsa oku (autoTune tarafından yazılır), yoksa default kullan
let CATEGORY_BOOST = {
  mocksheets_feature: 1.20,
  seo: 1.15,
  kdv: 1.15,
  tax: 1.15,
  pricing: 1.10,
  integration: 1.10,
  automation: 1.10,
  customer_retention: 1.10,
  discount: 1.08,
  localization: 1.08,
  inventory: 1.05,
  returns: 1.05,
};
try {
  const boostPath = path.join(__dirname, 'categoryBoost.json');
  if (fs.existsSync(boostPath)) {
    CATEGORY_BOOST = { ...CATEGORY_BOOST, ...JSON.parse(fs.readFileSync(boostPath, 'utf8')) };
  }
} catch { /* use defaults */ }

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t))
    .map(stem);
}

// BM25 hazırlığı — boot anında bir kez hesaplanır
const docs = dataset.map((entry, idx) => {
  const tokens = tokenize(entry.user_command);
  return { idx, entry, tokens, len: tokens.length };
});
const N = docs.length;
const avgLen = docs.reduce((s, d) => s + d.len, 0) / N || 1;

const df = new Map();
for (const d of docs) {
  const seen = new Set(d.tokens);
  for (const t of seen) df.set(t, (df.get(t) || 0) + 1);
}

const idf = new Map();
for (const [t, freq] of df.entries()) {
  idf.set(t, Math.log(1 + (N - freq + 0.5) / (freq + 0.5)));
}

const K1 = 1.5;
const B = 0.75;
const ABSOLUTE_MIN_SCORE = 8.0;

function bm25Score(queryTokens, doc) {
  const tf = new Map();
  for (const t of doc.tokens) tf.set(t, (tf.get(t) || 0) + 1);
  let score = 0;
  for (const q of queryTokens) {
    const f = tf.get(q);
    if (!f) continue;
    const w = idf.get(q) || 0;
    const norm = f * (K1 + 1) / (f + K1 * (1 - B + B * doc.len / avgLen));
    score += w * norm;
  }
  return score;
}

function retrieveShopifyExamples(query, k = 5) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return { examples: [], confidence: 0 };

  const scored = docs.map(d => {
    const raw = bm25Score(queryTokens, d);
    const boost = CATEGORY_BOOST[d.entry.category] || 1.0;
    return { entry: d.entry, score: raw * boost };
  });

  const maxScore = scored.reduce((m, s) => Math.max(m, s.score), 0);
  if (maxScore <= 0) return { examples: [], confidence: 0 };

  const examples = scored
    .filter(s => s.score >= ABSOLUTE_MIN_SCORE && s.score >= maxScore * 0.22)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(s => ({
      command: s.entry.user_command,
      response_hint: s.entry.response_hint,
      category: s.entry.category,
      score: Number(s.score.toFixed(3))
    }));

  const ragUsed = examples.length > 0;
  return { examples, confidence: Number(maxScore.toFixed(3)), ragUsed };
}

module.exports = { retrieveShopifyExamples };
