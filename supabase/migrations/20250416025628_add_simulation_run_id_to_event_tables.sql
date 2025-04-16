-- Migration: Add simulation_run_id to event tables for safe simulation/production separation
-- Created: 2025-04-16 02:56:28 UTC
-- Purpose: Allow all simulation data to be tagged and isolated from real user data, enabling safe parallel simulation and analytics.

-- Add nullable simulation_run_id to all event tables
alter table public.gamification_events add column if not exists simulation_run_id text;
alter table public.token_sinks add column if not exists simulation_run_id text;
alter table public.token_conversions add column if not exists simulation_run_id text;
alter table public.xp_events add column if not exists simulation_run_id text;
alter table public.badge_events add column if not exists simulation_run_id text;
alter table public.fibonacci_token_rewards add column if not exists simulation_run_id text;
alter table public.census_snapshots add column if not exists simulation_run_id text;

-- Index for efficient analytics
create index if not exists gamification_events_sim_run_idx on public.gamification_events(simulation_run_id);
create index if not exists token_sinks_sim_run_idx on public.token_sinks(simulation_run_id);
create index if not exists token_conversions_sim_run_idx on public.token_conversions(simulation_run_id);
create index if not exists xp_events_sim_run_idx on public.xp_events(simulation_run_id);
create index if not exists badge_events_sim_run_idx on public.badge_events(simulation_run_id);
create index if not exists fibonacci_token_rewards_sim_run_idx on public.fibonacci_token_rewards(simulation_run_id);
create index if not exists census_snapshots_sim_run_idx on public.census_snapshots(simulation_run_id);

-- RLS and all existing policies remain unaffected.
-- This migration is non-destructive and safe for production.
