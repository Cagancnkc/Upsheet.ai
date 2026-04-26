-- ============================================================
-- user_usage tablosu — Supabase Dashboard > SQL Editor'da çalıştır
-- ============================================================

create table if not exists user_usage (
  id          bigserial primary key,
  user_id     uuid unique not null references auth.users(id) on delete cascade,
  plan        text not null default 'free',

  -- Günlük / aylık sayaçlar
  ai_commands_used_today  int not null default 0,
  ai_commands_used_month  int not null default 0,

  -- Sıfırlama tarihleri
  last_command_date  date,
  last_reset_month   int,

  -- Abonelik
  subscription_status  text default 'inactive',
  plan_ends_at         timestamptz,

  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Row Level Security
alter table user_usage enable row level security;

create policy "Kullanıcı kendi kaydını okuyabilir"
  on user_usage for select
  using (auth.uid() = user_id);

-- Service key bypass için policy gerekmez (service key RLS'yi bypass eder)

-- ============================================================
-- increment_usage fonksiyonu
-- SADECE bu fonksiyon +1 artırır. Başka hiçbir şey artırmamalı.
-- ============================================================

create or replace function increment_usage(p_user_id uuid)
returns void
language sql
security definer
as $$
  update user_usage
  set
    ai_commands_used_today  = ai_commands_used_today + 1,
    ai_commands_used_month  = ai_commands_used_month + 1,
    updated_at              = now()
  where user_id = p_user_id;
$$;

-- ============================================================
-- KONTROL: Mevcut fonksiyonun tanımını görmek için:
-- SELECT prosrc FROM pg_proc WHERE proname = 'increment_usage';
-- VEYA:
-- SELECT routine_definition
-- FROM information_schema.routines
-- WHERE routine_name = 'increment_usage';
-- ============================================================
