require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { EXCEL_DATASET } = require('./dataset');
const { createEmbedding } = require('./embeddings');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function seed() {
  console.log('🗑️  Eski kayıtlar siliniyor...');
  const { error: delError } = await supabase
    .from('excel_commands')
    .delete()
    .neq('id', 0);
  if (delError) {
    console.error('Silme hatası:', delError.message);
    process.exit(1);
  }
  console.log('✓ Eski kayıtlar silindi');
  console.log(`\n📦 ${EXCEL_DATASET.length} komut yükleniyor...\n`);

  let ok = 0, fail = 0;
  for (let i = 0; i < EXCEL_DATASET.length; i++) {
    const cmd = EXCEL_DATASET[i];
    try {
      const text = `${cmd.user_command} ${cmd.logic}`;
      const embedding = await createEmbedding(text);
      const { error } = await supabase.from('excel_commands').insert({
        user_command: cmd.user_command,
        logic:        cmd.logic || '',
        output:       JSON.stringify(cmd.output || {}),
        category:     cmd.category || 'genel',
        embedding
      });
      if (error) throw error;
      ok++;
      console.log(`✓ ${i + 1}/${EXCEL_DATASET.length}: ${cmd.user_command}`);
      await new Promise(r => setTimeout(r, 150));
    } catch (err) {
      fail++;
      console.error(`✗ ${i + 1}/${EXCEL_DATASET.length}: ${cmd.user_command} — ${err.message}`);
    }
  }

  console.log(`\n✅ Tamamlandı: ${ok} başarılı, ${fail} hatalı`);
}

seed().catch(console.error);
