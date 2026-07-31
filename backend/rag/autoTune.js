'use strict';

// autoTune.js — son 7 günün rag_feedback kayıtlarından CATEGORY_BOOST öğrenir.
// Çıktı: backend/rag/categoryBoost.json (shopifyRetrieval.js boot'ta okur).
// Kullanım: node backend/rag/autoTune.js
// Cron: Her Cumartesi 09:07'de otomatik çalışır.

require('dotenv').config({ path: require('path').join(__dirname, '../../backend/.env') });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const OUTPUT_PATH = path.join(__dirname, 'categoryBoost.json');
const BOOST_STEP = 0.05;
const BOOST_MIN = 0.80;
const BOOST_MAX = 1.50;

const DEFAULT_BOOST = {
  mocksheets_feature: 1.20,
  seo: 1.15,
  kdv: 1.15,
  pricing: 1.10,
  integration: 1.10,
  discount: 1.08,
  inventory: 1.05,
};

async function main() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('shopify_rag_feedback')
    .select('top_category, rating')
    .gte('created_at', since)
    .not('top_category', 'is', null);

  if (error) {
    console.error('[autoTune] Supabase sorgusu başarısız:', error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log('[autoTune] Son 7 günde feedback yok — boost değiştirilmedi.');
    return;
  }

  // Her kategori için toplam ve sayı
  const stats = {};
  for (const row of data) {
    const cat = row.top_category;
    if (!stats[cat]) stats[cat] = { sum: 0, count: 0 };
    stats[cat].sum += row.rating;
    stats[cat].count += 1;
  }

  // Mevcut boost'u oku
  let current = { ...DEFAULT_BOOST };
  if (fs.existsSync(OUTPUT_PATH)) {
    try { current = { ...current, ...JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8')) }; } catch { /* ignore */ }
  }

  const updated = { ...current };
  const changes = [];

  for (const [cat, { sum, count }] of Object.entries(stats)) {
    if (count < 3) continue; // Yetersiz örnek — atla
    const avgRating = sum / count;
    const delta = avgRating > 0 ? BOOST_STEP : avgRating < 0 ? -BOOST_STEP : 0;
    if (delta === 0) continue;
    const prev = current[cat] || 1.0;
    const next = Math.min(BOOST_MAX, Math.max(BOOST_MIN, +(prev + delta).toFixed(2)));
    if (next !== prev) {
      updated[cat] = next;
      changes.push(`  ${cat}: ${prev} → ${next} (avg=${avgRating.toFixed(2)}, n=${count})`);
    }
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(updated, null, 2));

  if (changes.length > 0) {
    console.log('[autoTune] CATEGORY_BOOST güncellendi:');
    changes.forEach(c => console.log(c));
  } else {
    console.log('[autoTune] Değişiklik yok (eşik altında veya nötr feedback).');
  }
  console.log('[autoTune] Yazıldı:', OUTPUT_PATH);
}

main().catch(err => {
  console.error('[autoTune] Hata:', err.message);
  process.exit(1);
});
