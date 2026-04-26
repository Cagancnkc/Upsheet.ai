require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { EXCEL_DATASET } = require('./dataset');
const { createEmbedding } = require('./embeddings');
const { insertCommand } = require('./vectorStore');

async function ingestDataset() {
  console.log(`${EXCEL_DATASET.length} komut yükleniyor...`);

  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { count } = await supabase
    .from('excel_commands')
    .select('*', { count: 'exact', head: true });
  console.log('Mevcut kayıt:', count);
  if (count >= EXCEL_DATASET.length) {
    console.log('✓ Zaten yüklü, atlanıyor.');
    return;
  }

  for (let i = 0; i < EXCEL_DATASET.length; i++) {
    const cmd = EXCEL_DATASET[i];
    try {
      const text = `${cmd.user_command} ${cmd.logic}`;
      const embedding = await createEmbedding(text);
      await insertCommand(cmd, embedding);
      console.log(`✓ ${i + 1}/${EXCEL_DATASET.length}: ${cmd.user_command}`);
      await new Promise(r => setTimeout(r, 200));
    } catch (error) {
      console.error(`✗ Hata: ${cmd.user_command}:`, error.message);
    }
  }

  console.log('Dataset yükleme tamamlandı!');
}

ingestDataset().catch(console.error);
