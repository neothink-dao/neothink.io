-- Migration: Advanced Gamification, Tokenomics, DAO/Coop, and Census
-- Timestamp: 20250415230635 UTC
-- Purpose: Enable flawless, positive-sum, network-state-ready mechanics for Subscribers, Participants, Contributors (and Contributor Teams), DAO/Coop, Fibonacci tokenomics, and census.
--
-- Affected Tables: public.user_roles, public.teams, public.team_memberships, public.proposals, public.votes, public.crowdfunding, public.xp_events, public.token_events, public.badge_events, public.fibonacci_token_rewards, public.census_snapshots
-- Special Considerations: All tables have RLS enabled with granular, role-based policies. Destructive: Drops and recreates public.teams table. Uses dynamic policy creation for idempotency.

-- 1. Users Table (roles, status, profile)
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_subscriber boolean not null default false,
  is_participant boolean not null default false,
  is_contributor boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.user_roles enable row level security;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Allow select for authenticated') THEN
    EXECUTE 'create policy "Allow select for authenticated" on public.user_roles for select using (auth.role() = ''authenticated'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Allow update for self') THEN
    EXECUTE 'create policy "Allow update for self" on public.user_roles for update using (user_id = auth.uid())';
  END IF;
END $$;

-- 2. Teams Table (Contributor teams, DAO/coop metadata)
drop table if exists public.teams cascade;
create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_by uuid not null references auth.users(id),
  governance_model text default 'founder', -- e.g., founder, multisig, dao
  mission text,
  admission_criteria text,
  virtual_capital text, -- e.g., Discord, VR link
  physical_footprint jsonb, -- locations, assets
  census_data jsonb, -- latest census snapshot
  created_at timestamptz not null default now()
);
alter table public.teams enable row level security;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'teams' AND policyname = 'Allow select for authenticated') THEN
    EXECUTE 'create policy "Allow select for authenticated" on public.teams for select using (auth.role() = ''authenticated'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'teams' AND policyname = 'Allow insert for authenticated') THEN
    EXECUTE 'create policy "Allow insert for authenticated" on public.teams for insert with check (auth.role() = ''authenticated'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'teams' AND policyname = 'Allow update for team creator') THEN
    EXECUTE 'create policy "Allow update for team creator" on public.teams for update using (created_by = auth.uid())';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'teams' AND policyname = 'Allow delete for team creator') THEN
    EXECUTE 'create policy "Allow delete for team creator" on public.teams for delete using (created_by = auth.uid())';
  END IF;
END $$;

-- 3. Team Memberships (multi-role, multi-team)
create table if not exists public.team_memberships (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'member', -- member, admin, ambassador, etc.
  joined_at timestamptz not null default now(),
  unique (team_id, user_id)
);

alter table public.team_memberships enable row level security;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'team_memberships' AND policyname = 'Allow select for authenticated') THEN
    EXECUTE 'create policy "Allow select for authenticated" on public.team_memberships for select using (auth.role() = ''authenticated'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'team_memberships' AND policyname = 'Allow insert for authenticated') THEN
    EXECUTE 'create policy "Allow insert for authenticated" on public.team_memberships for insert with check (auth.role() = ''authenticated'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'team_memberships' AND policyname = 'Allow delete for self') THEN
    EXECUTE 'create policy "Allow delete for self" on public.team_memberships for delete using (user_id = auth.uid())';
  END IF;
END $$;

-- 4. DAO/Coop: Proposals, Votes, Crowdfunding
create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade,
  created_by uuid references auth.users(id),
  title text not null,
  description text,
  proposal_type text not null, -- quest, funding, governance, etc.
  status text not null default 'open',
  metadata jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid references public.proposals(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  vote_value text not null, -- yes, no, abstain
  voted_at timestamptz not null default now(),
  unique (proposal_id, user_id)
);
create table if not exists public.crowdfunding (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade,
  proposal_id uuid references public.proposals(id) on delete set null,
  user_id uuid references auth.users(id) on delete cascade,
  amount numeric not null,
  contributed_at timestamptz not null default now()
);

alter table public.proposals enable row level security;
alter table public.votes enable row level security;
alter table public.crowdfunding enable row level security;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'proposals' AND policyname = 'Allow select for authenticated') THEN
    EXECUTE 'create policy "Allow select for authenticated" on public.proposals for select using (auth.role() = ''authenticated'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'proposals' AND policyname = 'Allow insert for authenticated') THEN
    EXECUTE 'create policy "Allow insert for authenticated" on public.proposals for insert with check (auth.role() = ''authenticated'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'proposals' AND policyname = 'Allow update for creator') THEN
    EXECUTE 'create policy "Allow update for creator" on public.proposals for update using (created_by = auth.uid())';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'proposals' AND policyname = 'Allow delete for creator') THEN
    EXECUTE 'create policy "Allow delete for creator" on public.proposals for delete using (created_by = auth.uid())';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'votes' AND policyname = 'Allow select for authenticated') THEN
    EXECUTE 'create policy "Allow select for authenticated" on public.votes for select using (auth.role() = ''authenticated'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'votes' AND policyname = 'Allow insert for authenticated') THEN
    EXECUTE 'create policy "Allow insert for authenticated" on public.votes for insert with check (auth.role() = ''authenticated'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'crowdfunding' AND policyname = 'Allow select for authenticated') THEN
    EXECUTE 'create policy "Allow select for authenticated" on public.crowdfunding for select using (auth.role() = ''authenticated'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'crowdfunding' AND policyname = 'Allow insert for authenticated') THEN
    EXECUTE 'create policy "Allow insert for authenticated" on public.crowdfunding for insert with check (auth.role() = ''authenticated'')';
  END IF;
END $$;

-- 5. XP, Tokenomics, Badges, Fibonacci Rewards
create table if not exists public.xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  event_type text not null, -- action, referral, bonus, etc.
  xp_amount numeric not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.token_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  event_type text not null, -- mint, transfer, bonus, etc.
  token_amount numeric not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.badge_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  badge_id uuid,
  event_type text not null, -- earned, upgraded, etc.
  metadata jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.fibonacci_token_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  action_id uuid,
  team_id uuid references public.teams(id) on delete set null,
  tokens_awarded numeric not null,
  reward_type text not null, -- individual, team, collaboration, referral
  awarded_at timestamptz not null default now()
);

alter table public.xp_events enable row level security;
alter table public.token_events enable row level security;
alter table public.badge_events enable row level security;
alter table public.fibonacci_token_rewards enable row level security;
DO $$ BEGIN
  -- xp_events
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'xp_events' AND policyname = 'Allow select for authenticated') THEN
    EXECUTE 'create policy "Allow select for authenticated" on public.xp_events for select using (auth.role() = ''authenticated'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'xp_events' AND policyname = 'Allow insert for system') THEN
    EXECUTE 'create policy "Allow insert for system" on public.xp_events for insert with check (false)';
  END IF;
  -- token_events
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'token_events' AND policyname = 'Allow select for authenticated') THEN
    EXECUTE 'create policy "Allow select for authenticated" on public.token_events for select using (auth.role() = ''authenticated'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'token_events' AND policyname = 'Allow insert for system') THEN
    EXECUTE 'create policy "Allow insert for system" on public.token_events for insert with check (false)';
  END IF;
  -- badge_events
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'badge_events' AND policyname = 'Allow select for authenticated') THEN
    EXECUTE 'create policy "Allow select for authenticated" on public.badge_events for select using (auth.role() = ''authenticated'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'badge_events' AND policyname = 'Allow insert for system') THEN
    EXECUTE 'create policy "Allow insert for system" on public.badge_events for insert with check (false)';
  END IF;
  -- fibonacci_token_rewards
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'fibonacci_token_rewards' AND policyname = 'Allow select for authenticated') THEN
    EXECUTE 'create policy "Allow select for authenticated" on public.fibonacci_token_rewards for select using (auth.role() = ''authenticated'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'fibonacci_token_rewards' AND policyname = 'Allow insert for system') THEN
    EXECUTE 'create policy "Allow insert for system" on public.fibonacci_token_rewards for insert with check (false)';
  END IF;
END $$;

-- 6. Census Snapshots
create table if not exists public.census_snapshots (
  id uuid primary key default gen_random_uuid(),
  scope text not null, -- network, team, app, etc.
  scope_id uuid,
  population integer not null,
  assets numeric,
  activity_count integer,
  snapshot_at timestamptz not null default now(),
  metadata jsonb
);

alter table public.census_snapshots enable row level security;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'census_snapshots' AND policyname = 'Allow select for authenticated') THEN
    EXECUTE 'create policy "Allow select for authenticated" on public.census_snapshots for select using (auth.role() = ''authenticated'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'census_snapshots' AND policyname = 'Allow insert for system') THEN
    EXECUTE 'create policy "Allow insert for system" on public.census_snapshots for insert with check (false)';
  END IF;
END $$;

-- End of migration
