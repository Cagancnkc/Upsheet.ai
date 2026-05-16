require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');
const { createEmbedding } = require('../rag/embeddings');
const { insertCommand } = require('../rag/vectorStore');
const fs = require('fs');
const path = require('path');

const DATASET_PATH = path.join(__dirname, '../rag/dataset.js');

async function getSupabaseCount() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { count } = await supabase
    .from('excel_commands')
    .select('*', { count: 'exact', head: true });
  return count || 0;
}

async function generateExamples(existingCommands) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const sample = existingCommands.slice(0, 150).join('\n');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    messages: [{
      role: 'user',
      content: `Sen bir Excel veri seti üretecisisin. Türkçe Excel komutları için RAG veri seti oluşturuyoruz.

Aşağıdaki mevcut komutları TEKRAR ETME:
${sample}

Tam olarak 100 adet YENİ Türkçe Excel komutu örneği üret. Her satır bu formatta olmalı (virgülle bitmeli):
  { user_command: "...", logic: "...", category: "...", output: { action: "...", reply: "...", changes: [] } },

Action tipleri ve formatları:
- sort: { action: "sort", direction: "asc"/"desc", column: "...", reply: "✅ ..." }
- sum/average/max/min/count: { action: "sum", column: "...", reply: "✅ ..." }
- filter: { action: "filter", condition: "...", column: "...", value: "...", reply: "✅ ..." }
- remove_filter: { action: "remove_filter", reply: "✅ ..." }
- highlight: { action: "highlight", condition: "...", color: "#hex", reply: "✅ ..." }
- update_cells: { action: "update_cells", formula: "...", reply: "✅ ..." }
- delete_rows: { action: "delete_rows", condition: "...", reply: "🗑️ ..." }
- remove_duplicates: { action: "remove_duplicates", reply: "✅ ..." }
- transform: { action: "transform", transform: "uppercase"/"lowercase"/"trim", reply: "✅ ..." }
- add_row: { action: "add_row", reply: "➕ ..." }
- message: { action: "message", reply: "ℹ️ ..." }

Kurallar:
1. user_command: Türkçe, doğal konuşma dili, kısa
2. logic: İngilizce (embedding için)
3. reply: Türkçe, emoji ile başlasın
4. Çeşitlilik: muhasebe, bordro, stok, satış, KDV (%18/%20), SGK, e-fatura, depo, tedarik konuları
5. SADECE satırları yaz, başka hiçbir şey yazma (açıklama, başlık, kod bloğu yok)
6. Her satır iki boşlukla girintili ve virgülle bitsin`
    }]
  });

  return message.content[0].text.trim();
}

function parseGeneratedLines(text) {
  return text
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('{') && l.includes('user_command'));
}

async function appendToDataset(lines) {
  const content = fs.readFileSync(DATASET_PATH, 'utf8');
  const today = new Date().toISOString().split('T')[0];
  const insertPoint = content.lastIndexOf('\n];');

  const block = `\n  // ──────────────────────────────────────────────────────────\n  // AUTO-GENERATED ${today}\n  // ──────────────────────────────────────────────────────────\n  ${lines.join('\n  ')}\n`;

  const newContent = content.slice(0, insertPoint) + block + content.slice(insertPoint);
  fs.writeFileSync(DATASET_PATH, newContent, 'utf8');
}

async function ingestNewExamples(startIndex) {
  // Clear require cache so we get the updated dataset
  delete require.cache[require.resolve(DATASET_PATH)];
  const { EXCEL_DATASET } = require(DATASET_PATH);
  const newExamples = EXCEL_DATASET.slice(startIndex);

  console.log(`${newExamples.length} yeni örnek Supabase'e yükleniyor...`);
  let success = 0;
  for (const cmd of newExamples) {
    try {
      const text = `${cmd.user_command} ${cmd.logic}`;
      const embedding = await createEmbedding(text);
      await insertCommand(cmd, embedding);
      success++;
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.error(`✗ ${cmd.user_command}: ${err.message}`);
    }
  }
  return success;
}

async function main() {
  console.log('=== Mocksheets Günlük Dataset Üretimi ===');

  const beforeCount = await getSupabaseCount();
  console.log(`Mevcut Supabase kayıt sayısı: ${beforeCount}`);

  // Read existing commands for dedup
  const rawContent = fs.readFileSync(DATASET_PATH, 'utf8');
  const existingCommands = [...rawContent.matchAll(/user_command:\s*"([^"]+)"/g)].map(m => m[1]);
  console.log(`Mevcut dataset örnek sayısı: ${existingCommands.length}`);

  console.log('Claude API ile 100 yeni örnek üretiliyor...');
  const generated = await generateExamples(existingCommands);
  const lines = parseGeneratedLines(generated);
  console.log(`Üretilen geçerli satır sayısı: ${lines.length}`);

  if (lines.length === 0) {
    console.error('Hiç geçerli satır üretilemedi, çıkılıyor.');
    process.exit(1);
  }

  await appendToDataset(lines);
  console.log('✓ dataset.js güncellendi');

  const ingested = await ingestNewExamples(beforeCount);
  console.log(`✓ Supabase ingest tamamlandı`);

  const total = existingCommands.length + lines.length;
  console.log(`\n=== ÖZET ===`);
  console.log(`Eklenen: ${lines.length}`);
  console.log(`Supabase'e yüklenen: ${ingested}`);
  console.log(`Toplam dataset: ${total}`);

  // Write summary to file for workflow email step
  const summary = `Eklenen: ${lines.length} örnek\nSupabase'e yüklenen: ${ingested}\nToplam dataset: ${total} örnek\nTarih: ${new Date().toISOString().split('T')[0]}`;
  fs.writeFileSync(path.join(__dirname, '../.generation-summary'), summary);
}

main().catch(err => {
  console.error('Hata:', err);
  process.exit(1);
});
