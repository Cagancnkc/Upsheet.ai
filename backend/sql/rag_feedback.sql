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
