-- Migration: Enable Realtime on all gamification event tables
-- Created: 2025-04-15 23:53:49 UTC
-- Purpose: Enable Realtime for xp_events, badge_events, fibonacci_token_rewards, census_snapshots
--
-- Affected Tables: public.xp_events, public.badge_events, public.fibonacci_token_rewards, public.census_snapshots
-- Special Considerations: This migration is non-destructive and safe for production. RLS is already enabled and policies are in place for these tables.

-- Enable Realtime on xp_events
drop publication if exists supabase_realtime;
create publication supabase_realtime;
alter publication supabase_realtime add table public.xp_events;

-- Enable Realtime on badge_events
alter publication supabase_realtime add table public.badge_events;

-- Enable Realtime on fibonacci_token_rewards
alter publication supabase_realtime add table public.fibonacci_token_rewards;

-- Enable Realtime on census_snapshots
alter publication supabase_realtime add table public.census_snapshots;
