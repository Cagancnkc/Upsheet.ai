-- Mocksheets Automation Platform — Migration
-- Supabase Dashboard > SQL Editor'de çalıştırın

-- ── automation_rules ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS automation_rules (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name             text NOT NULL,
  description      text,
  trigger_config   jsonb NOT NULL DEFAULT '{}',
  condition_config jsonb NOT NULL DEFAULT '[]',
  action_config    jsonb NOT NULL DEFAULT '[]',
  integration      text NOT NULL DEFAULT 'webhook',
  throttle_seconds int DEFAULT 3600,
  enabled          boolean DEFAULT true,
  last_fired       timestamptz,
  run_count        int DEFAULT 0,
  template_id      text,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- Mevcut tablolara eksik kolon ekle (yeniden çalıştırma güvenli)
ALTER TABLE automation_rules ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE automation_rules ADD COLUMN IF NOT EXISTS template_id text;

ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own rules" ON automation_rules
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_auto_rules_user
  ON automation_rules(user_id, created_at DESC);

-- ── workflow_runs ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workflow_runs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id        uuid REFERENCES automation_rules(id) ON DELETE CASCADE,
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status         text NOT NULL DEFAULT 'pending',
  triggered_by   text,
  trigger_data   jsonb,
  action_results jsonb,
  error_message  text,
  duration_ms    int,
  started_at     timestamptz DEFAULT now(),
  completed_at   timestamptz
);

ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own runs" ON workflow_runs
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_runs_rule
  ON workflow_runs(rule_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_runs_user
  ON workflow_runs(user_id, started_at DESC);
