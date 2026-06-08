-- ================================================================
-- Mocksheets — Supabase Migration 002
-- Supabase Dashboard → SQL Editor'a yapıştırın ve çalıştırın
-- ================================================================

-- 1. users tablosuna subscription kolonları (stripe.js webhook için gerekli)
ALTER TABLE users ADD COLUMN IF NOT EXISTS
  subscription_status TEXT DEFAULT 'free'
  CHECK (subscription_status IN ('free', 'pro', 'business'));

ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;

ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;

-- 2. AI komut performans logları
CREATE TABLE IF NOT EXISTS performance_logs (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID,
  command_text TEXT,
  response_ms  INTEGER,
  success      BOOLEAN,
  error_msg    TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_perf_logs_user
  ON performance_logs (user_id, created_at DESC);

-- 3. Footer email subscribe formu için
CREATE TABLE IF NOT EXISTS email_subscribers (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  source     TEXT DEFAULT 'footer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
