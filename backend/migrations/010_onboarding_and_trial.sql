-- 010_onboarding_and_trial.sql
-- Adds user_onboarding step tracking + trial columns on user_usage.
-- Safe to re-run.

create table if not exists user_onboarding (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_step text not null default 'welcome',
  store_connected_at timestamptz,
  first_scan_at timestamptz,
  first_value_at timestamptz,
  upgrade_prompt_seen_at timestamptz,
  dismissed_at timestamptz,
  scanned_products int not null default 0,
  recommendations_viewed int not null default 0,
  recommendations_applied int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table user_usage
  add column if not exists trial_started_at timestamptz,
  add column if not exists trial_ends_at timestamptz,
  add column if not exists trial_used boolean not null default false;

-- allowed steps: welcome | store_connected | scan_complete | first_value | activated
create index if not exists idx_user_onboarding_step on user_onboarding(current_step);
create index if not exists idx_user_usage_trial_ends on user_usage(trial_ends_at) where trial_ends_at is not null;
