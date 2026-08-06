'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const DATASET_PATH = path.join(__dirname, '../rag/shopifyDataset.js');
const SUMMARY_PATH = path.join(__dirname, '../.generation-summary');

const CATEGORIES = [
  'product', 'pricing', 'inventory', 'orders', 'seo',
  'marketing', 'analytics', 'kdv', 'customer', 'fulfillment',
  'discount', 'integration', 'cro',
];

const TARGET = 200;
const PER_CAT = Math.ceil(TARGET / CATEGORIES.length); // ~16

async function generateForCategory(cat, count) {
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `Shopify e-ticaret platformu için ${count} adet Türkçe soru-cevap çifti üret. Kategori: "${cat}".\nJSON array döndür: [{ "user_command": "...", "category": "${cat}", "response_hint": "..." }]\nAçıklama ekleme, sadece array.`,
    }],
  });
  const text = msg.content[0].text;
  const m = text.match(/\[[\s\S]*\]/);
  if (!m) throw new Error(`JSON array bulunamadı (${cat})`);
  const parsed = JSON.parse(m[0]);
  return parsed.filter(e => e.user_command && e.category && e.response_hint);
}

async function main() {
  const allNew = [];

  for (const cat of CATEGORIES) {
    if (allNew.length >= TARGET) break;
    const needed = Math.min(PER_CAT, TARGET - allNew.length);
    try {
      const batch = await generateForCategory(cat, needed);
      const take = batch.slice(0, needed);
      allNew.push(...take);
      console.log(`[generate-dataset] ${cat}: +${take.length}`);
    } catch (e) {
      console.error(`[generate-dataset] ${cat} hata:`, e.message);
    }
  }

  if (allNew.length === 0) {
    console.error('[generate-dataset] Hiç örnek üretilemedi — çıkılıyor');
    process.exit(1);
  }

  const content = fs.readFileSync(DATASET_PATH, 'utf8');
  const lastClose = content.lastIndexOf('];');
  if (lastClose === -1) throw new Error('Dataset dosyasında kapanış ]; bulunamadı');

  const jsLines = allNew.map(e =>
    `  { user_command: ${JSON.stringify(e.user_command)}, category: ${JSON.stringify(e.category)}, response_hint: ${JSON.stringify(e.response_hint)} }`
  ).join(',\n');

  const updated =
    content.slice(0, lastClose) +
    `,\n${jsLines}\n];` +
    content.slice(lastClose + 2);

  fs.writeFileSync(DATASET_PATH, updated, 'utf8');

  const summary = `${allNew.length} examples added at ${new Date().toISOString()}`;
  fs.writeFileSync(SUMMARY_PATH, summary);
  console.log('[generate-dataset]', summary);
}

main().catch(e => { console.error('[generate-dataset] Fatal:', e); process.exit(1); });
