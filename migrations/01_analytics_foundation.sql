-- Analytics events table
CREATE TABLE analytics_events (
  id           BIGSERIAL PRIMARY KEY,
  shop_domain  TEXT NOT NULL,
  event_type   TEXT NOT NULL,
  page_url     TEXT,
  element_id   TEXT,
  product_id   TEXT,
  scroll_depth INTEGER,
  session_id   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_shop_created ON analytics_events(shop_domain, created_at DESC);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Add tracking columns to shopify_connections
ALTER TABLE shopify_connections
  ADD COLUMN IF NOT EXISTS tracking_enabled    BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS tracking_script_id  TEXT;
