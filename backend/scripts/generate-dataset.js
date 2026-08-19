'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const DATASET_PATH = path.join(__dirname, '../rag/shopifyDataset.js');

// Legacy Excel/spreadsheet categories — remove entirely
const LEGACY_CATEGORIES = new Set(['slides', 'sunum', 'tablo_olustur', 'rapor', 'sunung']);

// New system categories (behavior-data features)
const NEW_CATEGORIES = ['behavior_tracking', 'growth_opportunities', 'ai_diagnosis'];

const BOOST_THRESHOLD = 50; // boost any category below this to 50

// Extra context for new categories
const CAT_CONTEXT = {
  behavior_tracking:
    'Shopify mağazasında ziyaretçi davranışı izleme: hangi ürünlere bakıldı, kaç saniye incelendi, sepete eklenip eklenmedi, hangi sayfalarda bounce yaşandı, tıklama ısı haritası verileri.',
  growth_opportunities:
    'AI tarafından tespit edilen büyüme fırsatları: dönüşüm oranı düşük ürünler, kaçırılan satış anları, çapraz satış önerileri, fiyat optimizasyonu, terk edilmiş segmentler.',
  ai_diagnosis:
    '"Bu ürün neden satılmıyor?" teşhis akışı: başlık/açıklama kalite skoru, fotoğraf eksikliği, rekabet fiyat karşılaştırması, SEO açığı, sipariş dönüşüm hunisi analizi.',
};

async function generateBatch(cat, count) {
  const extra = CAT_CONTEXT[cat] ? `\nKategori bağlamı: ${CAT_CONTEXT[cat]}\n` : '';
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `Shopify mağaza yönetimi için TAM OLARAK ${count} adet Türkçe örnek üret. Kategori: "${cat}".${extra}
Denge kuralı:
- Yarısı emir/komut cümlesi olsun ("izleme raporunu göster", "dönüşümü düşük ürünleri listele")
- Yarısı doğal chat sorusu olsun ("hangi ürünlerim neden satılmıyor?", "büyüme fırsatlarımı analiz et")

Kesinlikle JSON array döndür (başka metin yok): [{ "user_command": "...", "category": "${cat}", "response_hint": "..." }]`,
    }],
  });
  const text = msg.content[0].text;
  const m = text.match(/\[[\s\S]*\]/);
  if (!m) throw new Error(`JSON array bulunamadı (${cat})`);
  const parsed = JSON.parse(m[0]);
  return parsed.filter(e => e.user_command && e.category && e.response_hint);
}

async function generateToTarget(cat, currentCount) {
  const needed = BOOST_THRESHOLD - currentCount;
  if (needed <= 0) return [];
  const results = [];
  // Generate in batches of 20 to stay within token limits
  const BATCH = 20;
  let remaining = needed;
  while (remaining > 0) {
    const ask = Math.min(BATCH, remaining);
    try {
      const batch = await generateBatch(cat, ask);
      results.push(...batch.slice(0, ask));
      remaining -= ask;
      process.stdout.write(`  ${cat}: ${results.length}/${needed}\r`);
    } catch (e) {
      console.error(`\n  [hata] ${cat} batch: ${e.message}`);
      break;
    }
  }
  return results;
}

async function main() {
  // Load current dataset
  // eslint-disable-next-line import/no-dynamic-require
  const current = require(DATASET_PATH);
  console.log(`\n[ultra-dataset] Mevcut: ${current.length} örnek`);

  // 1. Remove legacy categories
  const cleaned = current.filter(e => !LEGACY_CATEGORIES.has(e.category));
  const removedCount = current.length - cleaned.length;
  console.log(`[ultra-dataset] Kaldırıldı: ${removedCount} Excel kalıntısı (${[...LEGACY_CATEGORIES].join(', ')})`);

  // 2. Count per category in cleaned dataset
  const catCount = {};
  cleaned.forEach(e => { catCount[e.category] = (catCount[e.category] || 0) + 1; });

  // 3. Find categories below threshold (excluding legacy)
  const toBoost = Object.entries(catCount)
    .filter(([, count]) => count < BOOST_THRESHOLD)
    .sort((a, b) => a[1] - b[1]);

  console.log(`[ultra-dataset] Güçlendirilecek: ${toBoost.length} kategori`);
  toBoost.forEach(([c, n]) => console.log(`  ${c}: ${n} → ${BOOST_THRESHOLD} (+${BOOST_THRESHOLD - n})`));
  console.log(`[ultra-dataset] Yeni kategori: ${NEW_CATEGORIES.join(', ')}\n`);

  const allNew = [];

  // 4. Boost thin categories
  for (const [cat, count] of toBoost) {
    const batch = await generateToTarget(cat, count);
    allNew.push(...batch);
    console.log(`\n[ultra-dataset] ✓ ${cat}: +${batch.length}`);
  }

  // 5. Add new system categories
  for (const cat of NEW_CATEGORIES) {
    const batch = await generateToTarget(cat, 0);
    allNew.push(...batch);
    console.log(`\n[ultra-dataset] ✓ YENİ ${cat}: +${batch.length}`);
  }

  // 6. Merge and sparse-hole check
  const finalDataset = [...cleaned, ...allNew];
  let holes = 0;
  for (let i = 0; i < finalDataset.length; i++) if (!(i in finalDataset)) holes++;
  if (holes > 0) console.warn(`[ultra-dataset] UYARI: ${holes} sparse hole`);

  // 7. Write back complete dataset
  const jsLines = finalDataset.map(e =>
    `  { user_command: ${JSON.stringify(e.user_command)}, category: ${JSON.stringify(e.category)}, response_hint: ${JSON.stringify(e.response_hint)} }`
  ).join(',\n');
  fs.writeFileSync(DATASET_PATH, `module.exports = [\n${jsLines}\n];\n`, 'utf8');

  // 8. Summary
  const finalCatCount = {};
  finalDataset.forEach(e => { finalCatCount[e.category] = (finalCatCount[e.category] || 0) + 1; });
  console.log(`\n[ultra-dataset] TAMAMLANDI`);
  console.log(`  Önceki: ${current.length} → Sonraki: ${finalDataset.length}`);
  console.log(`  Kaldırılan: ${removedCount} | Eklenen: ${allNew.length}`);
  console.log(`  Kategori sayısı: ${Object.keys(finalCatCount).length}`);
}

main().catch(e => { console.error('[ultra-dataset] Fatal:', e); process.exit(1); });
