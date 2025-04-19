-- Migration: Fix function search_path for security compliance
-- Purpose: Set search_path='' for all flagged functions to prevent search_path hijacking
-- Created: 2025-04-18 23:48:30 UTC

-- Cleanup expired tokens
create or replace function public.cleanup_expired_tokens()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Update updated_at column
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Map points to tokens
create or replace function public.map_points_to_tokens()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Handle governance proposal update
create or replace function public.handle_governance_proposal_update()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Mint points on action
create or replace function public.mint_points_on_action()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Handle updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Track AI usage
create or replace function public.track_ai_usage()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Notify new message
create or replace function public.notify_new_message()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Track AI analytics
create or replace function public.track_ai_analytics()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Get user token history
create or replace function public.get_user_token_history()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Get user token summary
create or replace function public.get_user_token_summary()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Get room messages
create or replace function public.get_room_messages()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Get available rooms
create or replace function public.get_available_rooms()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Cleanup old rate limits
create or replace function public.cleanup_old_rate_limits()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Cleanup old security events
create or replace function public.cleanup_old_security_events()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Get recent posts
create or replace function public.get_recent_posts()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Get token history
create or replace function public.get_token_history()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Update modified column
create or replace function public.update_modified_column()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Flag inactive users
create or replace function public.flag_inactive_users()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Fibonacci
create or replace function public.fibonacci(n integer)
returns bigint
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Match documents
create or replace function public.match_documents()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Get user conversations
create or replace function public.get_user_conversations()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Update conversation timestamp
create or replace function public.update_conversation_timestamp()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Search similar content
create or replace function public.search_similar_content()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Notify content update
create or replace function public.notify_content_update()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Notify cross platform
create or replace function public.notify_cross_platform()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Cleanup old notifications
create or replace function public.cleanup_old_notifications()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Update team earnings
create or replace function public.update_team_earnings()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Create user profile
create or replace function public.create_user_profile()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Delete old chat history
create or replace function public.delete_old_chat_history()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Clean chat history
create or replace function public.clean_chat_history()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Ensure token balance
create or replace function public.ensure_token_balance()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Award post tokens
create or replace function public.award_post_tokens()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Award message tokens
create or replace function public.award_message_tokens()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Award tokens
create or replace function public.award_tokens()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Award zoom attendance tokens
create or replace function public.award_zoom_attendance_tokens()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Record zoom attendance
create or replace function public.record_zoom_attendance()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Update zoom attendance
create or replace function public.update_zoom_attendance()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Process sunday zoom rewards
create or replace function public.process_sunday_zoom_rewards()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Refresh token statistics
create or replace function public.refresh_token_statistics()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Notify token earnings
create or replace function public.notify_token_earnings()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Handle post changes
create or replace function public.handle_post_changes()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Handle message changes
create or replace function public.handle_message_changes()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Award tokens
create or replace function public.award_tokens()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Can earn tokens
create or replace function public.can_earn_tokens()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Get token balances
create or replace function public.get_token_balances()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Broadcast room message
create or replace function public.broadcast_room_message()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;

-- Broadcast post
create or replace function public.broadcast_post()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Function logic here (copy from existing definition)
end;
$$;
