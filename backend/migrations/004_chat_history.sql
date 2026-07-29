-- Chat memory: multi-session persistent chat history for AI Chat page
-- Separate from agent_conversations (003) to avoid coupling with agent flow

create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Yeni Sohbet',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chat_sessions_user_updated_idx
  on chat_sessions(user_id, updated_at desc);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references chat_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_session_created_idx
  on chat_messages(session_id, created_at asc);

alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;

drop policy if exists "own sessions" on chat_sessions;
create policy "own sessions" on chat_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own messages" on chat_messages;
create policy "own messages" on chat_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
