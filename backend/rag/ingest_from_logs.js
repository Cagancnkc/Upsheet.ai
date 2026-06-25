require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { createEmbedding } = require('./embeddings');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function ingestFromLogs() {
  const { data, error } = await supabase
    .from('rag_feedback')
    .select('*')
    .eq('ingested', false)
    .limit(500);
  if (error) throw error;
  console.log(`${data.length} yeni log kaydı bulundu.`);
  if (data.length === 0) { console.log('✓ Yeni kayıt yok.'); return; }

  let ok = 0, fail = 0;
  for (const row of data) {
    try {
      const text = `${row.user_command} ${row.action}`;
      const embedding = await createEmbedding(text);
      const { error: insertErr } = await supabase.from('excel_commands').insert({
        user_command: row.user_command,
        logic: row.action,
        output: JSON.stringify(row.output || {}),
        category: row.category || row.action,
        embedding
      });
      if (insertErr) throw insertErr;

      await supabase.from('rag_feedback').update({ ingested: true }).eq('id', row.id);
      ok++;
      if (ok % 10 === 0) console.log(`  ${ok}/${data.length} eklendi...`);
      await new Promise(r => setTimeout(r, 150));
    } catch (err) {
      fail++;
      console.error(`✗ [${row.user_command}]: ${err.message}`);
    }
  }
  console.log(`\n✓ Tamamlandı. Eklenen: ${ok}, Hatalı: ${fail}`);
}

ingestFromLogs().catch(console.error);
