require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { EXCEL_DATASET } = require('./dataset');
const { createEmbedding } = require('./embeddings');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function ingestDelta() {
  // Mevcut user_command'leri çek
  console.log('Mevcut kayıtlar sorgulanıyor...');
  let existing = new Set();
  let from = 0;
  const PAGE = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('excel_commands')
      .select('user_command')
      .range(from, from + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    data.forEach(r => existing.add(r.user_command.trim().toLowerCase()));
    if (data.length < PAGE) break;
    from += PAGE;
  }
  console.log(`Supabase'de ${existing.size} benzersiz komut mevcut.`);

  const newEntries = EXCEL_DATASET.filter(e =>
    !existing.has(e.user_command.trim().toLowerCase())
  );
  console.log(`Eklenecek yeni giriş: ${newEntries.length}`);

  if (newEntries.length === 0) {
    console.log('✓ Tüm girişler zaten yüklü.');
    return;
  }

  let ok = 0, fail = 0;
  for (let i = 0; i < newEntries.length; i++) {
    const cmd = newEntries[i];
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
      if (ok % 10 === 0) console.log(`  ${ok}/${newEntries.length} eklendi...`);
      await new Promise(r => setTimeout(r, 150));
    } catch (err) {
      fail++;
      console.error(`✗ Hata [${cmd.user_command}]: ${err.message}`);
    }
  }

  console.log(`\n✓ Tamamlandı. Eklenen: ${ok}, Hatalı: ${fail}`);
}

ingestDelta().catch(console.error);
