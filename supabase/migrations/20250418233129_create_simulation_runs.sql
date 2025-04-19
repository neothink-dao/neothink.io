-- Migration: Create simulation_runs table for tracking simulation scenarios and results
-- Purpose: Enable robust tracking, analysis, and iteration of simulation runs for gamification/tokenomics improvements
-- Affected: Adds new table, RLS policies, and indexes
-- Created: 2025-04-18 23:31:29 UTC

-- 1. Create simulation_runs table
create table if not exists public.simulation_runs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  scenario_name text not null,
  parameters jsonb not null default '{}',
  result_summary jsonb,
  detailed_results jsonb,
  status text not null default 'completed',
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Enable Row Level Security (RLS)
alter table public.simulation_runs enable row level security;

-- 3. RLS Policies
-- Users can view their own simulation runs
create policy "Users can view their own simulation runs"
  on public.simulation_runs
  for select
  using (auth.uid() = user_id);

-- Users can insert their own simulation runs
create policy "Users can insert their own simulation runs"
  on public.simulation_runs
  for insert
  with check (auth.uid() = user_id);

-- Users can update their own simulation runs
create policy "Users can update their own simulation runs"
  on public.simulation_runs
  for update
  using (auth.uid() = user_id);

-- Admins can view all simulation runs
create policy "Admins can view all simulation runs"
  on public.simulation_runs
  for select
  using (auth.role() = 'service_role' or auth.role() = 'authenticated');

-- 4. Index for querying by user and scenario
create index if not exists idx_simulation_runs_user_id on public.simulation_runs(user_id);
create index if not exists idx_simulation_runs_scenario_name on public.simulation_runs(scenario_name);

-- 5. Comments
comment on table public.simulation_runs is 'Tracks simulation scenarios, parameters, results, and metadata for gamification/tokenomics analysis and iteration.';
comment on column public.simulation_runs.parameters is 'Input parameters for the simulation scenario.';
comment on column public.simulation_runs.result_summary is 'High-level summary of simulation results.';
comment on column public.simulation_runs.detailed_results is 'Full details of simulation outputs, e.g., per-user or per-step data.';
comment on column public.simulation_runs.status is 'Status: pending, running, completed, failed.';
