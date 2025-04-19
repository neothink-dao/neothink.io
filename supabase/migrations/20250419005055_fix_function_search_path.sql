-- Migration: Fix function search_path for security compliance
-- Purpose: Set search_path='' for all flagged functions to prevent search_path hijacking
-- Created: 2025-04-19 00:50:55 UTC
-- Each function below is updated to use 'set search_path = '''' as per Supabase and Postgres best practices.

-- Example: award_message_tokens (trigger)
create or replace function public.award_message_tokens()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
DECLARE
    token_amount INT;
    token_col TEXT;
    user_subscription_tier TEXT;
BEGIN
    -- Skip if already processed
    IF NEW.reward_processed THEN
        RETURN NEW;
    END IF;
    
    -- Get user's subscription tier
    select subscription_tier into user_subscription_tier
    from public.profiles
    where id = NEW.sender_id;
    
    -- Determine token amount based on subscription tier
    IF user_subscription_tier = 'superachiever' THEN
        token_amount := 15; -- Higher rewards for superachievers
    ELSIF user_subscription_tier = 'premium' THEN
        token_amount := 10; -- Standard premium reward
    ELSE
        token_amount := 5; -- Basic reward
    END IF;
    
    -- Determine which token balance to update
    IF NEW.token_tag = 'LUCK' THEN
        token_col := 'luck_balance';
    ELSIF NEW.token_tag = 'LIVE' THEN
        token_col := 'live_balance';
    ELSIF NEW.token_tag = 'LOVE' THEN
        token_col := 'love_balance';
    ELSIF NEW.token_tag = 'LIFE' THEN
        token_col := 'life_balance';
    ELSE
        -- Default to LOVE tokens for chat activity if not specified
        token_col := 'love_balance';
        NEW.token_tag := 'LOVE';
    END IF;
    
    -- Ensure the user has a token balance
    insert into public.token_balances (user_id)
    values (NEW.sender_id)
    on conflict (user_id) do nothing;
    
    -- Update the appropriate token balance
    execute format('
        update public.token_balances 
        set %I = %I + $1,
            updated_at = now()
        where user_id = $2
    ', token_col, token_col)
    using token_amount, NEW.sender_id;
    
    -- Record the transaction
    insert into public.token_transactions (
        user_id,
        token_type,
        amount,
        source_type,
        source_id,
        description
    ) values (
        NEW.sender_id,
        NEW.token_tag,
        token_amount,
        'message',
        NEW.id,
        'Message reward'
    );
    
    -- Mark as processed
    NEW.reward_processed := true;
    return NEW;
END;
$$;

-- update_updated_at_column (trigger)
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
   NEW.updated_at = now();
   return NEW;
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

-- TODO: Repeat this pattern for all other flagged functions, using their exact current logic and signatures.
-- For any function with parameter defaults or signature changes, use DROP FUNCTION first, then CREATE FUNCTION.
-- For others, use CREATE OR REPLACE FUNCTION.
-- All object references are fully qualified, and security invoker is used.
