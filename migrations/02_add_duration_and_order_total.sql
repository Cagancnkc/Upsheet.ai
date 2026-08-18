ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;
ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS order_total NUMERIC;
