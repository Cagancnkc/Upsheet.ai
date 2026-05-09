require('dotenv').config({ path: './.env' });

const { EXCEL_DATASET } = require('./dataset');
const { createEmbedding } = require('./embeddings');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const NEW_CATEGORIES = ['extract', 'anomaly_detection', 'classify', 'sentiment_analysis', 'compare', 'forecast', 'ai'];

async function seedAppendV7() {
  const NEW_EXAMPLES = EXCEL_DATASET.filter(item => NEW_CATEGORIES.includes(item.category));
  console.log('V7 hedef kategori örnek sayısı:', NEW_EXAMPLES.length);

  const { data: existing, error: fetchError } = await supabase
    .from('excel_commands').select('user_command');
  if (fetchError) { console.error('Supabase okuma hatası:', fetchError.message); process.exit(1); }

  const existingSet = new Set((existing || []).map(r => r.user_command.toLowerCase().trim()));
  console.log('Supabase mevcut kayıt:', existingSet.size);

  const toAdd = NEW_EXAMPLES.filter(
    item => !existingSet.has(item.user_command.toLowerCase().trim())
  );
  console.log('Eklenecek yeni kayıt:', toAdd.length);

  if (toAdd.length === 0) {
    console.log('Eklenecek yeni kayıt yok. Çıkılıyor.');
    return;
  }

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
      } else {
        console.error('\nInsert hatası:', item.user_command, error.message);
      }
      await new Promise(r => setTimeout(r, 60));
    } catch (e) {
      console.error('\nHata:', item.user_command, e.message);
    }
  }
  console.log(`\n✓ V7 ekleme tamamlandı. Eklenen: ${loaded}/${toAdd.length}`);
  console.log('✓ Önceki veriler korundu.');
}

seedAppendV7().catch(console.error);
