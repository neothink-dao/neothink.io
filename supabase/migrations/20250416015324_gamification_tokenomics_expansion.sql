-- Migration: Gamification & Tokenomics Expansion
-- Created: 2025-04-16 01:53 UTC
-- Purpose: Expand schema for advanced gamification/tokenomics, per-site/app tuning, and analytics

-- 1. Expand gamification_events for all token actions
create table if not exists public.gamification_events (
  id bigserial primary key,
  user_id uuid not null references auth.users(id),
  persona text not null,
  site text not null, -- e.g. 'hub', 'ascenders', etc.
  event_type text not null, -- e.g. 'collaboration', 'reward', 'spend', 'convert', etc.
  token_type text not null check (token_type in ('LIVE', 'LOVE', 'LIFE', 'LUCK')),
  amount numeric not null check (amount >= 0),
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- 2. Token sinks: Where tokens are spent
create table if not exists public.token_sinks (
  id bigserial primary key,
  site text not null,
  sink_type text not null, -- e.g. 'feature_unlock', 'raffle', 'donation'
  token_type text not null check (token_type in ('LIVE', 'LOVE', 'LIFE', 'LUCK')),
  description text,
  created_at timestamptz not null default now()
);

-- 3. Token conversions: Track conversions between tokens
create table if not exists public.token_conversions (
  id bigserial primary key,
  user_id uuid not null references auth.users(id),
  from_token text not null check (from_token in ('LIVE', 'LOVE', 'LIFE', 'LUCK')),
  to_token text not null check (to_token in ('LIVE', 'LOVE', 'LIFE', 'LUCK')),
  amount numeric not null check (amount > 0),
  rate numeric not null, -- conversion rate
  site text not null,
  created_at timestamptz not null default now()
);

-- 4. Site/app settings for gamification
create table if not exists public.site_settings (
  site text primary key,
  base_reward numeric not null default 100,
  collab_bonus numeric not null default 25,
  streak_bonus numeric not null default 50,
  diminishing_threshold numeric not null default 1000,
  conversion_rates jsonb,
  created_at timestamptz not null default now()
);

-- 5. Indices for analytics
create index if not exists gamification_events_site_idx on public.gamification_events(site);
create index if not exists gamification_events_event_type_idx on public.gamification_events(event_type);
create index if not exists token_sinks_site_idx on public.token_sinks(site);
create index if not exists token_conversions_site_idx on public.token_conversions(site);

-- 6. Enable RLS and policies
alter table public.gamification_events enable row level security;
alter table public.token_sinks enable row level security;
alter table public.token_conversions enable row level security;
alter table public.site_settings enable row level security;

-- Policies: Authenticated users can select and insert (positive-sum only)
create policy "Select gamification_events for authenticated" on public.gamification_events for select using (auth.role() = 'authenticated');
create policy "Insert positive-sum events" on public.gamification_events for insert with check (auth.role() = 'authenticated' and amount >= 0);
create policy "No update or delete" on public.gamification_events for update using (false);
create policy "No delete" on public.gamification_events for delete using (false);

create policy "Select token_sinks for authenticated" on public.token_sinks for select using (auth.role() = 'authenticated');
create policy "Insert token_sinks for authenticated" on public.token_sinks for insert with check (auth.role() = 'authenticated');
create policy "No update or delete token_sinks" on public.token_sinks for update using (false);
create policy "No delete token_sinks" on public.token_sinks for delete using (false);

create policy "Select token_conversions for authenticated" on public.token_conversions for select using (auth.role() = 'authenticated');
create policy "Insert token_conversions for authenticated" on public.token_conversions for insert with check (auth.role() = 'authenticated');
create policy "No update or delete token_conversions" on public.token_conversions for update using (false);
create policy "No delete token_conversions" on public.token_conversions for delete using (false);

create policy "Select site_settings for authenticated" on public.site_settings for select using (auth.role() = 'authenticated');
create policy "Insert site_settings for authenticated" on public.site_settings for insert with check (auth.role() = 'authenticated');
create policy "No update or delete site_settings" on public.site_settings for update using (false);
create policy "No delete site_settings" on public.site_settings for delete using (false);

-- 7. Set search_path for all functions to '' and use fully qualified names
-- (see function definitions for details)

-- End of migration
