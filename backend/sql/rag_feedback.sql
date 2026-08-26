-- RAG feedback tablosu — kullanıcı 👍/👎 ile hangi kategori örneğinin işe yaradığını bildirir.
-- autoTune.js bu tabloyu okuyarak CATEGORY_BOOST'u haftalık günceller.

create table if not exists shopify_rag_feedback (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        references auth.users(id),
  query        text        not null,
  matched_examples jsonb   not null,
  top_category text,
  rating       smallint    check (rating in (-1, 1)),
  created_at   timestamptz default now()
);

create index if not exists shopify_rag_feedback_category_rating_idx
  on shopify_rag_feedback(top_category, rating);

create index if not exists shopify_rag_feedback_created_idx
  on shopify_rag_feedback(created_at desc);

-- RLS: kullanıcılar yalnızca kendi satırlarını görebilir/ekleyebilir.
-- Backend service key ile RLS'i bypass eder, bu politikalar frontend erişimini kısıtlar.
alter table shopify_rag_feedback enable row level security;

create policy "users_select_own_feedback"
  on shopify_rag_feedback for select
  using (auth.uid() = user_id);

create policy "users_insert_own_feedback"
  on shopify_rag_feedback for insert
  with check (auth.uid() = user_id);
