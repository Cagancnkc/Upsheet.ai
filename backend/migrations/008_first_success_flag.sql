ALTER TABLE user_usage
  ADD COLUMN IF NOT EXISTS first_success_shown BOOLEAN DEFAULT false;
