-- Migration: Gamification & Tokenomics Improvements
-- Timestamp: 20250415225827 UTC
-- Purpose: Enhance schema for collaborative teams, Fibonacci token minting, group actions, and referral/collaboration bonuses
--
-- Affected Tables: public.teams, public.team_memberships, public.group_actions, public.fibonacci_token_rewards, public.collaboration_bonuses, public.referral_bonuses, public.xp_multipliers
-- Special Considerations: All tables have RLS enabled with granular policies. Destructive: Drops and recreates public.teams table.

-- 1. Teams Table (collaborative mechanics)
drop table if exists public.teams cascade;
create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

-- Enable RLS only after confirming column exists
alter table public.teams enable row level security;

-- RLS Policies for teams (references created_by, which now exists)
create policy "Allow select for authenticated" on public.teams for select using (auth.role() = 'authenticated');
create policy "Allow insert for authenticated" on public.teams for insert with check (auth.role() = 'authenticated');
create policy "Allow update for team creator" on public.teams for update using (created_by = auth.uid());
create policy "Allow delete for team creator" on public.teams for delete using (created_by = auth.uid());

-- 2. Team Memberships Table
create table if not exists public.team_memberships (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (team_id, user_id)
);

alter table public.team_memberships enable row level security;

create policy "Allow select for authenticated" on public.team_memberships for select using (auth.role() = 'authenticated');
create policy "Allow insert for authenticated" on public.team_memberships for insert with check (auth.role() = 'authenticated');
create policy "Allow delete for self" on public.team_memberships for delete using (user_id = auth.uid());

-- 3. Fibonacci Token Rewards Table
create table if not exists public.fibonacci_token_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  action_id uuid references public.user_actions(id) on delete set null,
  team_id uuid references public.teams(id) on delete set null,
  tokens_awarded numeric not null,
  reward_type text not null, -- e.g., 'individual', 'team', 'collaboration', 'referral'
  awarded_at timestamptz not null default now()
);

alter table public.fibonacci_token_rewards enable row level security;

create policy "Allow select for authenticated" on public.fibonacci_token_rewards for select using (auth.role() = 'authenticated');
create policy "Allow insert for system" on public.fibonacci_token_rewards for insert with check (false); -- Only functions/triggers

-- 4. Group Actions Table
create table if not exists public.group_actions (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade,
  action_type text not null,
  performed_by uuid references auth.users(id),
  metadata jsonb,
  performed_at timestamptz not null default now()
);

alter table public.group_actions enable row level security;

create policy "Allow select for authenticated" on public.group_actions for select using (auth.role() = 'authenticated');
create policy "Allow insert for authenticated" on public.group_actions for insert with check (auth.role() = 'authenticated');

-- 5. Collaboration Bonuses Table
create table if not exists public.collaboration_bonuses (
  id uuid primary key default gen_random_uuid(),
  group_action_id uuid references public.group_actions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  bonus_amount numeric not null,
  awarded_at timestamptz not null default now()
);

alter table public.collaboration_bonuses enable row level security;

create policy "Allow select for authenticated" on public.collaboration_bonuses for select using (auth.role() = 'authenticated');
create policy "Allow insert for system" on public.collaboration_bonuses for insert with check (false); -- Only functions/triggers

-- 6. Referral Bonuses Table
create table if not exists public.referral_bonuses (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references auth.users(id) on delete cascade,
  referred_id uuid references auth.users(id) on delete cascade,
  bonus_amount numeric not null,
  awarded_at timestamptz not null default now()
);

alter table public.referral_bonuses enable row level security;

create policy "Allow select for authenticated" on public.referral_bonuses for select using (auth.role() = 'authenticated');
create policy "Allow insert for system" on public.referral_bonuses for insert with check (false); -- Only functions/triggers

-- 7. XP Multipliers Table (for custom event multipliers)
create table if not exists public.xp_multipliers (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  multiplier numeric not null check (multiplier > 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.xp_multipliers enable row level security;

create policy "Allow select for authenticated" on public.xp_multipliers for select using (auth.role() = 'authenticated');
create policy "Allow insert for admin" on public.xp_multipliers for insert with check (auth.role() = 'service_role');
create policy "Allow update for admin" on public.xp_multipliers for update using (auth.role() = 'service_role');
create policy "Allow delete for admin" on public.xp_multipliers for delete using (auth.role() = 'service_role');

-- End of migration
