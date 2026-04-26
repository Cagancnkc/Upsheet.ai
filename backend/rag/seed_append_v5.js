require('dotenv').config({ path: './.env' });

const { EXCEL_DATASET } = require('./dataset');
const { EXCEL_DATASET_V5 } = require('./dataset_v5');
const { createEmbedding } = require('./embeddings');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function seedAppendV5() {
  const ALL_NEW = [...EXCEL_DATASET_V5];
  console.log('V5 yeni örnek sayısı:', ALL_NEW.length);

  const { data: existing } = await supabase
    .from('excel_commands').select('user_command');
  const existingSet = new Set(
    (existing || []).map(r => r.user_command.toLowerCase().trim())
  );
  console.log('Supabase mevcut kayıt:', existingSet.size);

  const toAdd = ALL_NEW.filter(
    item => !existingSet.has(item.user_command.toLowerCase().trim())
  );
  console.log('Eklenecek yeni kayıt:', toAdd.length);

  let loaded = 0;
  for (const item of toAdd) {
    try {
      const embedding = await createEmbedding(item.user_command);
      const { error } = await supabase.from('excel_commands').insert({
        user_command: item.user_command,
        logic: item.logic || '',
        output: JSON.stringify(item.output || {}),
        category: item.category || 'genel',
        embedding
      });
      if (!error) {
        loaded++;
        process.stdout.write(`\r✓ ${loaded}/${toAdd.length}`);
      }
      await new Promise(r => setTimeout(r, 60));
    } catch (e) {
      console.error('\nHata:', item.user_command, e.message);
    }
  }
  console.log('\n✓ V5 ekleme tamamlandı. Eklenen:', loaded);
  console.log('✓ Önceki veriler korundu.');
}

seedAppendV5().catch(console.error);
