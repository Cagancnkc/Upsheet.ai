'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const DATASET_PATH = path.join(__dirname, '../rag/shopifyDataset.js');

const NEW_CATEGORIES = [
  'marketplace_integration',
  'content_marketing',
  'customer_lifecycle',
  'product_photography',
  'supplier_management',
  'gdpr_kvkk',
  'brand_building',
  'competitive_analysis',
  'upsell_cross_sell',
  'store_speed',
];

const TARGET_PER_CATEGORY = 100;
const BATCH_SIZE = 20;

const CAT_CONTEXT = {
  marketplace_integration:
    'Shopify mağazasını Türk ve global pazaryerlerine entegre etme: Trendyol, Hepsiburada, N11, GittiGidiyor, Amazon Türkiye. Ürün listeleme, stok senkronizasyonu, sipariş yönetimi, fiyat politikaları, komisyon hesaplama, kategori eşleştirme, teslimat entegrasyonu.',
  content_marketing:
    'Shopify mağazası için içerik pazarlaması: blog yazarlığı, SEO odaklı içerik, YouTube/TikTok ürün videoları, Instagram/Pinterest görsel içerik, influencer işbirlikleri, e-posta bülteni, podcast, müşteri hikayeleri, sosyal medya takvimi.',
  customer_lifecycle:
    'Müşteri yaşam döngüsü yönetimi: yeni müşteri kazanımı, ilk satın alma, tekrar satın alma, kayıp önleme, reakquisition. RFM segmentasyonu (Recency/Frequency/Monetary), cohort analizi, CLV hesaplama, churn tahmini, NPS ölçümü, müşteri sağlık skoru.',
  product_photography:
    'E-ticaret ürün fotoğrafçılığı: beyaz zemin standardı, lifestyle çekimleri, 360 derece görsel, video loop, zoom özelliği, mobil uyumlu görseller, dosya boyutu optimizasyonu, alt text yazımı, görselden ürün bilgisi çıkarma, görsel A/B testi.',
  supplier_management:
    'Tedarikçi ve tedarik zinciri yönetimi: tedarikçi araştırma ve değerlendirme, fiyat müzakeresi, minimum sipariş miktarı (MOQ), lead time optimizasyonu, çoklu tedarikçi stratejisi, kalite kontrolü, Aliexpress/Alibaba dropshipping, yerli tedarikçi bulma.',
  gdpr_kvkk:
    'Türk ve AB veri koruma mevzuatına uyum: KVKK (Kişisel Verilerin Korunması Kanunu) yükümlülükleri, GDPR gereksinimleri, çerez politikası, gizlilik bildirimi, veri saklama süreleri, müşteri onay mekanizmaları, veri ihlali bildirimi, VERBİS kaydı.',
  brand_building:
    'Shopify mağazası için marka oluşturma: marka kimliği, logo ve renk paleti, marka sesi ve tonu, hikaye anlatımı (brand storytelling), misyon/vizyon/değerler, ambalaj tasarımı, marka tutarlılığı, premium algı yaratma, marka topluluk oluşturma.',
  competitive_analysis:
    'E-ticaret rakip analizi: rakip fiyat izleme, ürün karşılaştırma, pazar payı analizi, rakip trafik tahmini, sosyal medya benchmark, müşteri yorumlarından içgörü, boşluk analizi, farklılaşma stratejisi, rakip strateji tahmini.',
  upsell_cross_sell:
    'Gelir artırma teknikleri: upsell (daha pahalı ürün önerisi), cross-sell (tamamlayıcı ürün), bundle ürün paketleri, ürün önerisi widgetları, sepet toplam artırma, post-purchase upsell, "Frequently bought together", kişiselleştirilmiş öneri algoritması.',
  store_speed:
    'Shopify mağaza hız optimizasyonu: Core Web Vitals (LCP/FID/CLS), Lighthouse skoru, görsel sıkıştırma ve lazy loading, tema optimizasyonu, kullanılmayan uygulama temizleme, CDN kullanımı, JavaScript küçültme, font optimizasyonu, mobil hız, Google PageSpeed.',
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
- Yarısı emir/komut cümlesi olsun ("rakip fiyatlarını izle", "tedarikçi listesini güncelle")
- Yarısı doğal chat sorusu olsun ("rakiplerim ne kadar satıyor?", "tedarikçimle nasıl anlaşırım?")

Her örneğin response_hint'i gerçekçi, uygulanabilir ve Shopify ekosistemi odaklı olsun.
Türk e-ticaret bağlamına uygun olsun (Türk pazaryerleri, KVKK, TL, KDV vb).

Kesinlikle JSON array döndür (başka metin yok): [{ "user_command": "...", "category": "${cat}", "response_hint": "..." }]`,
    }],
  });
  const text = msg.content[0].text;
  const m = text.match(/\[[\s\S]*\]/);
  if (!m) throw new Error(`JSON array bulunamadı (${cat})`);
  const parsed = JSON.parse(m[0]);
  return parsed.filter(e => e.user_command && e.category && e.response_hint);
}

async function generateCategory(cat) {
  const results = [];
  let remaining = TARGET_PER_CATEGORY;
  let failures = 0;
  while (remaining > 0 && failures < 3) {
    const ask = Math.min(BATCH_SIZE, remaining);
    try {
      const batch = await generateBatch(cat, ask);
      results.push(...batch.slice(0, ask));
      remaining -= ask;
      failures = 0;
      process.stdout.write(`  ${cat}: ${results.length}/${TARGET_PER_CATEGORY}\r`);
    } catch (e) {
      failures++;
      console.error(`\n  [hata ${failures}/3] ${cat} batch: ${e.message}`);
    }
  }
  return results;
}

async function main() {
  // eslint-disable-next-line import/no-dynamic-require
  const current = require(DATASET_PATH);
  console.log(`\n[expand-dataset] Mevcut: ${current.length} örnek`);
  console.log(`[expand-dataset] Hedef: ${NEW_CATEGORIES.length} yeni kategori × ${TARGET_PER_CATEGORY} = ${NEW_CATEGORIES.length * TARGET_PER_CATEGORY} yeni örnek\n`);

  const allNew = [];

  for (const cat of NEW_CATEGORIES) {
    console.log(`\n[expand-dataset] → ${cat} üretiliyor...`);
    const batch = await generateCategory(cat);
    allNew.push(...batch);
    console.log(`\n[expand-dataset] ✓ ${cat}: +${batch.length}`);
  }

  const finalDataset = [...current, ...allNew];

  const jsLines = finalDataset.map(e =>
    `  { user_command: ${JSON.stringify(e.user_command)}, category: ${JSON.stringify(e.category)}, response_hint: ${JSON.stringify(e.response_hint)} }`
  ).join(',\n');
  fs.writeFileSync(DATASET_PATH, `module.exports = [\n${jsLines}\n];\n`, 'utf8');

  const catCount = {};
  finalDataset.forEach(e => { catCount[e.category] = (catCount[e.category] || 0) + 1; });

  console.log(`\n[expand-dataset] TAMAMLANDI`);
  console.log(`  Önceki: ${current.length} → Sonraki: ${finalDataset.length}`);
  console.log(`  Eklenen: ${allNew.length} örnek`);
  console.log(`  Toplam kategori: ${Object.keys(catCount).length}`);
  console.log('\n  Yeni kategoriler:');
  NEW_CATEGORIES.forEach(cat => console.log(`    ${cat}: ${catCount[cat] || 0}`));
}

main().catch(e => { console.error('[expand-dataset] Fatal:', e); process.exit(1); });
