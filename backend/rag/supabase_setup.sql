-- Excel komutları vektör tablosu
create table if not exists excel_commands (
  id bigserial primary key,
  user_command text not null,
  logic text not null,
  output jsonb not null,
  category text not null,
  embedding vector(1536),
  created_at timestamptz default now()
);

-- Vektör indeksi (hızlı arama)
create index on excel_commands
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Benzerlik arama fonksiyonu
create or replace function search_commands(
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count int default 5
)
returns table (
  id bigint,
  user_command text,
  logic text,
  output jsonb,
  category text,
  similarity float
)
language sql stable
as $$
  select
    excel_commands.id,
    excel_commands.user_command,
    excel_commands.logic,
    excel_commands.output,
    excel_commands.category,
    1 - (excel_commands.embedding <=> query_embedding) as similarity
  from excel_commands
  where 1 - (excel_commands.embedding <=> query_embedding) > match_threshold
  order by excel_commands.embedding <=> query_embedding
  limit match_count;
$$;
