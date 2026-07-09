-- Agent chat sohbet + mesaj tabloları
-- Route: backend/routes/agent.js (singular) — requireProMax korumalı
-- Backend SUPABASE_SERVICE_KEY kullandığı için RLS bypass edilir; RLS savunma katmanı.

create table if not exists agent_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text default 'Yeni Sohbet',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table agent_conversations enable row level security;

drop policy if exists "own_conversations" on agent_conversations;
create policy "own_conversations" on agent_conversations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_agent_conversations_user_updated
  on agent_conversations (user_id, updated_at desc);

create table if not exists agent_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references agent_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz default now()
);

alter table agent_messages enable row level security;

drop policy if exists "own_messages" on agent_messages;
create policy "own_messages" on agent_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_agent_messages_conv_time
  on agent_messages (conversation_id, created_at);
