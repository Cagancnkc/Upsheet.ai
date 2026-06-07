-- ================================================================
-- Mocksheets — Supabase Migration
-- Supabase Dashboard → SQL Editor'a yapıştırın ve çalıştırın
-- ================================================================

-- Contact form submissions tablosu
CREATE TABLE IF NOT EXISTS contact_submissions (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT        NOT NULL,
  email        TEXT        NOT NULL,
  subject      TEXT,
  message      TEXT        NOT NULL,
  ip_address   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  responded    BOOLEAN     DEFAULT FALSE
);

-- Onboarding email kuyruğu
CREATE TABLE IF NOT EXISTS email_queue (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID,
  email        TEXT        NOT NULL,
  template_id  TEXT        NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  sent_at      TIMESTAMPTZ,
  status       TEXT        DEFAULT 'pending'  -- pending | sent | error
);

-- İndeksler (performans için)
CREATE INDEX IF NOT EXISTS idx_email_queue_status_scheduled
  ON email_queue (status, scheduled_at)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created
  ON contact_submissions (created_at DESC);
