-- Migration: Improve gamification and tokenomics for positive-sum game theory
-- Created: 2025-04-15 21:30 UTC
-- Purpose: Enhance tracking of token events, add site/app context, and enforce positive-sum policies
--
-- Affected Tables: public.gamification_events
-- Special Considerations: All inserts must be positive-sum (amount >= 0). Append-only event log (no update/delete allowed). RLS enabled with granular policies.

-- 1. Create a generic gamification_events table for all token actions
create table if not exists public.gamification_events (
  id bigserial primary key,
  user_id uuid not null references public.users(id),
  persona text not null,
  site text not null, -- e.g. 'hub', 'ascenders', etc.
  event_type text not null, -- e.g. 'collaboration', 'reward', 'spend', etc.
  token_type text not null check (token_type in ('LIVE', 'LOVE', 'LIFE', 'LUCK')),
  amount numeric not null check (amount >= 0),
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- 2. Add indices for analytics
create index if not exists gamification_events_user_id_idx on public.gamification_events(user_id);
create index if not exists gamification_events_site_idx on public.gamification_events(site);
create index if not exists gamification_events_event_type_idx on public.gamification_events(event_type);

-- 3. Add RLS for positive-sum enforcement
alter table public.gamification_events enable row level security;

-- Allow select for all authenticated users (per-site analytics)
create policy "Select gamification_events for authenticated" on public.gamification_events
  for select using (auth.role() = 'authenticated');

-- Allow insert only if amount >= 0 (positive-sum)
create policy "Insert positive-sum events" on public.gamification_events
  for insert using (
    auth.role() = 'authenticated' and amount >= 0
  );

-- Disallow update/delete for now (append-only event log)
create policy "No update or delete" on public.gamification_events
  for update using (false);
create policy "No delete" on public.gamification_events
  for delete using (false);

-- 4. (Optional) Add site/app context columns to other relevant tables as needed
-- (e.g. add 'site' column to user_rewards, engagement_metrics, etc. if they exist)

-- End of migration
