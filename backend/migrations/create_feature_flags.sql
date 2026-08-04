-- Feature flag tablosu: plan bazlı özellik erişim kontrolü
-- Kullanım: isFeatureEnabledForPlan(key, userPlan) — backend/middleware/limits.js
CREATE TABLE IF NOT EXISTS feature_flags (
  key        text    PRIMARY KEY,
  min_plan   text    NOT NULL,   -- 'free' | 'pro' | 'promax' | 'business' | 'ultra'
  enabled    boolean NOT NULL DEFAULT true
);

-- Seed: Ultra kullanıcılar için erken özellik erişimi
INSERT INTO feature_flags (key, min_plan, enabled) VALUES
  ('early_access', 'ultra', true)
ON CONFLICT (key) DO NOTHING;
