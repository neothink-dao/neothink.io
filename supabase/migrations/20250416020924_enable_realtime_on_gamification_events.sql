-- Migration: Enable Realtime on gamification_events table
-- Created: 2025-04-16 02:09:24 UTC
-- Purpose: Add public.gamification_events to supabase_realtime publication for live dashboards and notifications
--
-- This migration ensures that all token actions (earn, spend, convert, collaboration, etc.) are broadcast in real time for analytics, admin dashboards, and user feedback.
--
-- Non-destructive: This migration does not modify data or remove any tables.

-- Safely create publication only if it does not exist
DO $$
BEGIN
  CREATE PUBLICATION supabase_realtime;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Enable Realtime on gamification_events
ALTER PUBLICATION supabase_realtime ADD TABLE public.gamification_events;

-- RLS and policies are already enabled for this table (see previous migrations).
-- No changes to RLS or policies are required.

-- End of migration
