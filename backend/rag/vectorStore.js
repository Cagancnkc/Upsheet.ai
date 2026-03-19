const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function insertCommand(command, embedding) {
  const { data, error } = await supabase
    .from('excel_commands')
    .insert({
      user_command: command.user_command,
      logic: command.logic,
      output: command.output,
      category: command.category,
      embedding
    });
  if (error) throw error;
  return data;
}

async function searchSimilar(queryEmbedding, limit = 5) {
  const { data, error } = await supabase.rpc('search_commands', {
    query_embedding: queryEmbedding,
    match_threshold: 0.6,
    match_count: limit
  });
  if (error) throw error;
  return data || [];
}

module.exports = { insertCommand, searchSimilar };
