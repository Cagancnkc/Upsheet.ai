require('dotenv').config({ path: './.env' });

const { EXCEL_DATASET } = require('./dataset');
const { createEmbedding } = require('./embeddings');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function seedAppend() {
  console.log('Dataset boyutu:', EXCEL_DATASET.length, 'örnek');

  const { data: existing } = await supabase
    .from('excel_commands')
    .select('user_command');

  const existingSet = new Set(
    (existing || []).map(r => r.user_command.toLowerCase().trim())
  );

  console.log('Supabase mevcut kayıt:', existingSet.size);

  const newItems = EXCEL_DATASET.filter(item =>
    !existingSet.has(item.user_command.toLowerCase().trim())
  );

  console.log('Eklenecek YENİ kayıt:', newItems.length);

  if (newItems.length === 0) {
    console.log('✓ Tüm örnekler zaten yüklü, ekleme yapılmadı');
    return;
  }

  let loaded = 0;
  let errors = 0;

  for (const item of newItems) {
    try {
      const embedding = await createEmbedding(item.user_command);

      const { error } = await supabase
        .from('excel_commands')
        .insert({
          user_command: item.user_command,
          logic:        item.logic || item.intent || '',
          output:       JSON.stringify(item.output || {}),
          category:     item.category || item.output?.action || 'genel',
          embedding:    embedding
        });

      if (error) {
        console.error('Insert hata:', item.user_command, error.message);
        errors++;
      } else {
        loaded++;
        process.stdout.write(`\r✓ ${loaded}/${newItems.length} yeni kayıt eklendi`);
      }

      await new Promise(r => setTimeout(r, 60));

    } catch (e) {
      console.error('\nEmbedding hata:', item.user_command, e.message);
      errors++;
    }
  }

  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✓ Append tamamlandı');
  console.log('  Yeni eklenen:', loaded);
  console.log('  Hata:', errors);
  console.log('  Önceki kayıtlar korundu ✓');
}

seedAppend().catch(console.error);
