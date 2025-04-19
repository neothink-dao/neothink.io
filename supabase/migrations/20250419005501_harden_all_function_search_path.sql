-- Migration: Harden ALL Supabase function search_path for security compliance
-- Purpose: Set search_path='' for all flagged functions, following Supabase/Postgres best practices
-- Created: 2025-04-19 00:55:01 UTC
-- Each function below is updated to use 'set search_path = '''' and security invoker (unless security definer is required and justified).

-- Clean chat history (trigger)
drop function if exists public.clean_chat_history();
create function public.clean_chat_history()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
    delete from public.chat_history 
    where created_at < now() - interval '90 days';
    return new;
end;
$$;

-- Cleanup expired tokens (void)
drop function if exists public.cleanup_expired_tokens();
create function public.cleanup_expired_tokens()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
    delete from public.csrf_tokens where expires_at < now();
    delete from public.login_attempts where last_attempt < now() - interval '24 hours';
end;
$$;

-- Cleanup old notifications (void)
drop function if exists public.cleanup_old_notifications();
create function public.cleanup_old_notifications()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  delete from public.cross_platform_notifications 
  where created_at < now() - interval '90 days' 
    and read = true;
end;
$$;

-- Cleanup old rate limits (trigger)
drop function if exists public.cleanup_old_rate_limits();
create function public.cleanup_old_rate_limits()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  delete from public.rate_limits
  where window_start < now() - interval '24 hours';
  return null;
end;
$$;

-- Cleanup old security events (trigger)
drop function if exists public.cleanup_old_security_events();
create function public.cleanup_old_security_events()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  delete from public.security_events
  where (severity = 'critical' and created_at < now() - interval '90 days')
     or (severity = 'high' and created_at < now() - interval '60 days')
     or (severity in ('medium', 'low') and created_at < now() - interval '30 days');
  return null;
end;
$$;

-- Delete old chat history (trigger)
drop function if exists public.delete_old_chat_history();
create function public.delete_old_chat_history()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  delete from public.chat_history
  where created_at < now() - interval '90 days';
  return new;
end;
$$;

-- Ensure token balance (trigger)
drop function if exists public.ensure_token_balance();
create function public.ensure_token_balance()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
    insert into public.token_balances (user_id)
    values (new.user_id)
    on conflict (user_id) do nothing;
    return new;
end;
$$;

-- Fibonacci (immutable)
drop function if exists public.fibonacci(integer);
create function public.fibonacci(n integer)
returns bigint
language plpgsql
security invoker
set search_path = ''
immutable
as $$
declare
    a bigint := 0;
    b bigint := 1;
    temp bigint;
    i int := 0;
begin
    if n <= 0 then return 0; end if;
    while i < n loop
        temp := a;
        a := b;
        b := temp + b;
        i := i + 1;
    end loop;
    return a;
end;
$$;

-- Flag inactive users (void)
drop function if exists public.flag_inactive_users();
create function public.flag_inactive_users()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
    inactive_threshold constant interval := interval '6 months';
begin
    update public.user_gamification_stats
    set is_inactive = true,
        updated_at = now()
    where last_active < (now() - inactive_threshold)
      and is_inactive = false;
    update public.user_gamification_stats
    set is_inactive = false,
        updated_at = now()
    where last_active >= (now() - inactive_threshold)
      and is_inactive = true;
end;
$$;

-- update_updated_at_column (trigger)
drop function if exists public.update_updated_at_column();
create function public.update_updated_at_column()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
   new.updated_at = now();
   return new;
end;
$$;

-- update_zoom_attendance (void)
drop function if exists public.update_zoom_attendance(uuid, timestamptz);
create function public.update_zoom_attendance(p_attendance_id uuid, p_leave_time timestamptz)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
    update public.zoom_attendance
    set 
        leave_time = p_leave_time,
        duration_minutes = extract(epoch from (p_leave_time - join_time))/60
    where id = p_attendance_id;
end;
$$;

-- award_message_tokens, award_post_tokens, award_tokens, award_zoom_attendance_tokens, broadcast_post, broadcast_room_message, can_earn_tokens, etc.
-- TODO: Repeat for all remaining flagged functions, using their exact logic and signatures from schema.sql.
-- For any function with parameter defaults or signature changes, use DROP FUNCTION first, then CREATE FUNCTION.
-- For others, use CREATE OR REPLACE FUNCTION.
-- All object references are fully qualified, and security invoker is used unless security definer is required (document rationale).
