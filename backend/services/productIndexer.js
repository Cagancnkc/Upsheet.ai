const { createEmbedding } = require('../rag/embeddings');
const { createClient } = require('@supabase/supabase-js');

const BATCH_SIZE = 50;
const INDEX_THRESHOLD = 500;

function getSb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

async function indexProductsForRAG(userId, sheetRows) {
  if (!sheetRows || sheetRows.length < 2) return { indexed: 0 };
  const headers = sheetRows[0];
  const dataRows = sheetRows.slice(1);
  if (dataRows.length < INDEX_THRESHOLD) return { indexed: 0, skipped: true };

  const titleIdx  = headers.findIndex(h => /ürün adı|title|başlık/i.test(h));
  const vendorIdx = headers.findIndex(h => /vendor|marka|brand/i.test(h));
  const descIdx   = headers.findIndex(h => /açıklama|description/i.test(h));
  const tagsIdx   = headers.findIndex(h => /etiket|tags?/i.test(h));

  const sb = getSb();
  let indexed = 0;

  for (let i = 0; i < dataRows.length; i += BATCH_SIZE) {
    const batch = dataRows.slice(i, i + BATCH_SIZE);
    const records = [];
    for (let j = 0; j < batch.length; j++) {
      const row = batch[j];
      const parts = [
        titleIdx  !== -1 ? row[titleIdx]  : '',
        vendorIdx !== -1 ? row[vendorIdx] : '',
        descIdx   !== -1 ? row[descIdx]   : '',
        tagsIdx   !== -1 ? row[tagsIdx]   : '',
      ].filter(Boolean);
      const summary = parts.join(' — ') || `Satır ${i + j + 1}`;
      const embedding = await createEmbedding(summary);
      records.push({
        user_id: userId,
        product_row_index: i + j,
        content_summary: summary,
        embedding,
        updated_at: new Date().toISOString(),
      });
    }
    await sb.from('product_embeddings')
      .upsert(records, { onConflict: 'user_id,product_row_index' });
    indexed += records.length;
  }
  return { indexed };
}

module.exports = { indexProductsForRAG, INDEX_THRESHOLD };
