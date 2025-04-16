

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "auth";


ALTER SCHEMA "auth" OWNER TO "supabase_admin";


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "postgres";


CREATE TYPE "auth"."aal_level" AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE "auth"."aal_level" OWNER TO "supabase_auth_admin";


CREATE TYPE "auth"."code_challenge_method" AS ENUM (
    's256',
    'plain'
);


ALTER TYPE "auth"."code_challenge_method" OWNER TO "supabase_auth_admin";


CREATE TYPE "auth"."factor_status" AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE "auth"."factor_status" OWNER TO "supabase_auth_admin";


CREATE TYPE "auth"."factor_type" AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE "auth"."factor_type" OWNER TO "supabase_auth_admin";


CREATE TYPE "auth"."one_time_token_type" AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE "auth"."one_time_token_type" OWNER TO "supabase_auth_admin";


CREATE TYPE "public"."ascender_focus" AS ENUM (
    'ascender',
    'ascension',
    'flow',
    'ascenders'
);


ALTER TYPE "public"."ascender_focus" OWNER TO "postgres";


CREATE TYPE "public"."experience_phase" AS ENUM (
    'discover',
    'onboard',
    'progress',
    'endgame'
);


ALTER TYPE "public"."experience_phase" OWNER TO "postgres";


CREATE TYPE "public"."feedback_status" AS ENUM (
    'pending',
    'reviewed',
    'implemented',
    'rejected'
);


ALTER TYPE "public"."feedback_status" OWNER TO "postgres";


CREATE TYPE "public"."immortal_focus" AS ENUM (
    'immortal',
    'immortalis',
    'project_life',
    'immortals'
);


ALTER TYPE "public"."immortal_focus" OWNER TO "postgres";


CREATE TYPE "public"."neothinker_focus" AS ENUM (
    'neothinker',
    'neothink',
    'revolution',
    'fellowship',
    'movement',
    'command',
    'mark_hamilton',
    'neothinkers'
);


ALTER TYPE "public"."neothinker_focus" OWNER TO "postgres";


CREATE TYPE "public"."platform_slug" AS ENUM (
    'hub',
    'ascenders',
    'neothinkers',
    'immortals'
);


ALTER TYPE "public"."platform_slug" OWNER TO "postgres";


CREATE TYPE "public"."platform_type" AS ENUM (
    'neothink_hub',
    'ascender',
    'neothinker',
    'immortal',
    'hub',
    'ascenders',
    'neothinkers',
    'immortals'
);


ALTER TYPE "public"."platform_type" OWNER TO "postgres";


CREATE TYPE "public"."token_type" AS ENUM (
    'live',
    'love',
    'life'
);


ALTER TYPE "public"."token_type" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'subscriber',
    'participant',
    'contributor'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "auth"."email"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION "auth"."email"() OWNER TO "supabase_auth_admin";


COMMENT ON FUNCTION "auth"."email"() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';



CREATE OR REPLACE FUNCTION "auth"."jwt"() RETURNS "jsonb"
    LANGUAGE "sql" STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION "auth"."jwt"() OWNER TO "supabase_auth_admin";


CREATE OR REPLACE FUNCTION "auth"."role"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION "auth"."role"() OWNER TO "supabase_auth_admin";


COMMENT ON FUNCTION "auth"."role"() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';



CREATE OR REPLACE FUNCTION "auth"."uid"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION "auth"."uid"() OWNER TO "supabase_auth_admin";


COMMENT ON FUNCTION "auth"."uid"() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';



CREATE OR REPLACE FUNCTION "public"."add_user_to_tenant"("_user_id" "uuid", "_tenant_slug" "text", "_role" "text" DEFAULT 'member'::"text") RETURNS boolean
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    _tenant_id UUID;
BEGIN
    -- Get the tenant ID from the slug
    SELECT id INTO _tenant_id FROM public.tenants WHERE slug = _tenant_slug;
    
    -- If tenant doesn't exist, return false
    IF _tenant_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Add user to tenant
    INSERT INTO public.tenant_users (tenant_id, user_id, role, status)
    VALUES (_tenant_id, _user_id, _role, 'active')
    ON CONFLICT (tenant_id, user_id) 
    DO UPDATE SET 
        role = _role,
        status = 'active',
        updated_at = now();
    
    -- Update platforms array in profiles
    UPDATE public.profiles
    SET platforms = array_append(COALESCE(platforms, ARRAY[]::text[]), _tenant_slug)
    WHERE id = _user_id AND (_tenant_slug != ALL(COALESCE(platforms, ARRAY[]::text[])) OR platforms IS NULL);
    
    RETURN TRUE;
END;
$$;


ALTER FUNCTION "public"."add_user_to_tenant"("_user_id" "uuid", "_tenant_slug" "text", "_role" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."advance_user_week"("p_user_id" "uuid", "p_platform" "text") RETURNS boolean
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
  current_week INTEGER;
BEGIN
  -- Get current week
  SELECT week_number INTO current_week
  FROM user_progress
  WHERE user_id = p_user_id AND platform = p_platform::platform_type;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Update to next week
  UPDATE user_progress
  SET week_number = week_number + 1,
      last_updated = now()
  WHERE user_id = p_user_id AND platform = p_platform::platform_type;
  
  RETURN TRUE;
END;
$$;


ALTER FUNCTION "public"."advance_user_week"("p_user_id" "uuid", "p_platform" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."award_message_tokens"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $_$
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
    SELECT subscription_tier INTO user_subscription_tier
    FROM profiles
    WHERE id = NEW.sender_id;
    
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
    INSERT INTO token_balances (user_id)
    VALUES (NEW.sender_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Update the appropriate token balance
    EXECUTE format('
        UPDATE token_balances 
        SET %I = %I + $1,
            updated_at = now()
        WHERE user_id = $2
    ', token_col, token_col)
    USING token_amount, NEW.sender_id;
    
    -- Record the transaction
    INSERT INTO token_transactions (
        user_id,
        token_type,
        amount,
        source_type,
        source_id,
        description
    ) VALUES (
        NEW.sender_id,
        NEW.token_tag,
        token_amount,
        'message',
        NEW.id,
        'Token reward for chat activity'
    );
    
    -- Mark as processed
    NEW.reward_processed := TRUE;
    
    RETURN NEW;
END;
$_$;


ALTER FUNCTION "public"."award_message_tokens"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."award_post_tokens"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    token_amount INT;
    token_col TEXT;
    is_sunday BOOLEAN;
    user_subscription_tier TEXT;
BEGIN
    -- Skip if already processed
    IF NEW.reward_processed THEN
        RETURN NEW;
    END IF;
    
    -- Check if post was made on Sunday (day 0)
    is_sunday := EXTRACT(DOW FROM NEW.created_at) = 0;
    
    -- Get user's subscription tier
    SELECT subscription_tier INTO user_subscription_tier
    FROM profiles
    WHERE id = NEW.author_id;
    
    -- Determine token amount based on token_tag and day
    IF NEW.token_tag = 'LUCK' THEN
        token_amount := CASE
            WHEN is_sunday THEN 5
            ELSE 2
        END;
        token_col := 'luck_balance';
    ELSIF NEW.token_tag = 'LIVE' THEN
        token_amount := CASE
            WHEN is_sunday THEN 4
            ELSE 2
        END;
        token_col := 'live_balance';
    ELSIF NEW.token_tag = 'LOVE' THEN
        token_amount := CASE
            WHEN is_sunday THEN 4
            ELSE 2
        END;
        token_col := 'love_balance';
    ELSIF NEW.token_tag = 'LIFE' THEN
        token_amount := CASE
            WHEN is_sunday THEN 6
            ELSE 3
        END;
        token_col := 'life_balance';
    ELSE
        -- Default to LUCK if not specified
        token_amount := 1;
        token_col := 'luck_balance';
    END IF;
    
    -- Bonus for premium subscribers
    IF user_subscription_tier = 'premium' THEN
        token_amount := token_amount * 2;
    ELSIF user_subscription_tier = 'superachiever' THEN
        token_amount := token_amount * 3;
    END IF;
    
    -- Ensure user has a token balance record
    INSERT INTO token_balances (user_id)
    VALUES (NEW.author_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Update token balance
    EXECUTE format('
        UPDATE token_balances 
        SET %I = %I + $1,
            updated_at = now()
        WHERE user_id = $2
    ', token_col, token_col)
    USING token_amount, NEW.author_id;
    
    -- Record transaction
    INSERT INTO token_transactions (
        user_id, 
        token_type, 
        amount, 
        source_type, 
        source_id, 
        description
    )
    VALUES (
        NEW.author_id,
        COALESCE(NEW.token_tag, 'LUCK'),
        token_amount,
        'post',
        NEW.id,
        'Tokens earned from posting' || CASE WHEN is_sunday THEN ' on Sunday' ELSE '' END
    );
    
    -- Mark as processed
    NEW.reward_processed := TRUE;
    
    RETURN NEW;
END;
$_$;


ALTER FUNCTION "public"."award_post_tokens"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."award_tokens"("p_user_id" "uuid", "p_token_type" "text", "p_amount" integer, "p_source_type" "text", "p_source_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Record the transaction
    INSERT INTO token_transactions (
        user_id,
        token_type,
        amount,
        source_type,
        source_id
    ) VALUES (
        p_user_id,
        p_token_type,
        p_amount,
        p_source_type,
        p_source_id
    );
    
    -- Update the balance
    UPDATE token_balances
    SET 
        luck_balance = CASE WHEN p_token_type = 'LUCK' THEN luck_balance + p_amount ELSE luck_balance END,
        live_balance = CASE WHEN p_token_type = 'LIVE' THEN live_balance + p_amount ELSE live_balance END,
        love_balance = CASE WHEN p_token_type = 'LOVE' THEN love_balance + p_amount ELSE love_balance END,
        life_balance = CASE WHEN p_token_type = 'LIFE' THEN life_balance + p_amount ELSE life_balance END,
        updated_at = now()
    WHERE user_id = p_user_id;
END;
$$;


ALTER FUNCTION "public"."award_tokens"("p_user_id" "uuid", "p_token_type" "text", "p_amount" integer, "p_source_type" "text", "p_source_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."award_zoom_attendance_tokens"("attendee_id" "uuid", "meeting_name" "text", "token_type" "text" DEFAULT 'LUCK'::"text", "token_amount" integer DEFAULT 25) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    token_col TEXT;
    user_subscription_tier TEXT;
    bonus_amount INT := 0;
BEGIN
    -- Get user's subscription tier for potential bonus
    SELECT subscription_tier INTO user_subscription_tier
    FROM profiles
    WHERE id = attendee_id;
    
    -- Apply subscription tier bonus
    IF user_subscription_tier = 'superachiever' THEN
        bonus_amount := token_amount * 0.5; -- 50% bonus
    ELSIF user_subscription_tier = 'premium' THEN
        bonus_amount := token_amount * 0.25; -- 25% bonus
    END IF;
    
    -- Add the bonus to the base amount
    token_amount := token_amount + bonus_amount;
    
    -- Determine which token balance to update
    IF token_type = 'LUCK' THEN
        token_col := 'luck_balance';
    ELSIF token_type = 'LIVE' THEN
        token_col := 'live_balance';
    ELSIF token_type = 'LOVE' THEN
        token_col := 'love_balance';
    ELSIF token_type = 'LIFE' THEN
        token_col := 'life_balance';
    ELSE
        token_col := 'luck_balance'; -- Default to LUCK for Sunday calls
        token_type := 'LUCK';
    END IF;
    
    -- Ensure the user has a token balance
    INSERT INTO token_balances (user_id)
    VALUES (attendee_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Update the appropriate token balance
    EXECUTE format('
        UPDATE token_balances 
        SET %I = %I + $1,
            updated_at = now()
        WHERE user_id = $2
    ', token_col, token_col)
    USING token_amount, attendee_id;
    
    -- Record the transaction
    INSERT INTO token_transactions (
        user_id,
        token_type,
        amount,
        source_type,
        description
    ) VALUES (
        attendee_id,
        token_type,
        token_amount,
        'zoom_attendance',
        'Token reward for attending ' || meeting_name
    );
END;
$_$;


ALTER FUNCTION "public"."award_zoom_attendance_tokens"("attendee_id" "uuid", "meeting_name" "text", "token_type" "text", "token_amount" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."broadcast_post"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Broadcast to posts channel with token metadata
  PERFORM pg_notify(
    'supabase_realtime',
    json_build_object(
      'type', 'broadcast',
      'event', 'post',
      'token_tag', NEW.token_tag,
      'payload', json_build_object(
        'id', NEW.id,
        'content', NEW.content,
        'author_id', NEW.author_id,
        'created_at', NEW.created_at,
        'token_tag', NEW.token_tag
      )
    )::text
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."broadcast_post"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."broadcast_room_message"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Broadcast to room-specific channel with metadata
  PERFORM pg_notify(
    'supabase_realtime',
    json_build_object(
      'type', 'broadcast',
      'event', 'message',
      'room_id', NEW.room_id,
      'room_type', (SELECT room_type FROM rooms WHERE id = NEW.room_id),
      'payload', json_build_object(
        'id', NEW.id,
        'content', NEW.content,
        'sender_id', NEW.sender_id,
        'token_tag', NEW.token_tag,
        'created_at', NEW.created_at
      )
    )::text
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."broadcast_room_message"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."can_earn_tokens"("p_user_id" "uuid", "p_token_type" "text", "p_source_type" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    daily_limit INTEGER;
    current_count INTEGER;
BEGIN
    -- Set daily limits based on token type and source
    daily_limit := CASE
        WHEN p_token_type = 'LUCK' AND p_source_type = 'post' THEN 5
        WHEN p_token_type = 'LOVE' AND p_source_type = 'message' THEN 10
        ELSE 3  -- Default limit for other combinations
    END;
    
    -- Count today's earnings
    SELECT COUNT(*)
    INTO current_count
    FROM token_transactions
    WHERE user_id = p_user_id
    AND token_type = p_token_type
    AND source_type = p_source_type
    AND created_at >= date_trunc('day', now());
    
    RETURN current_count < daily_limit;
END;
$$;


ALTER FUNCTION "public"."can_earn_tokens"("p_user_id" "uuid", "p_token_type" "text", "p_source_type" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_email_exists"("email" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
  RETURN true;
END;
$$;


ALTER FUNCTION "public"."check_email_exists"("email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_platform_access"("user_id" "uuid", "platform_slug" "text") RETURNS boolean
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
  is_guardian BOOLEAN;
BEGIN
  -- Check if user is guardian
  SELECT is_guardian INTO is_guardian FROM public.profiles WHERE id = user_id;
  
  -- Guardians have access to all platforms
  IF is_guardian = true THEN
    RETURN true;
  END IF;
  
  -- Check platforms array
  RETURN platform_slug = ANY(
    (SELECT platforms FROM public.profiles WHERE id = user_id)
  );
END;
$$;


ALTER FUNCTION "public"."check_platform_access"("user_id" "uuid", "platform_slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_profile_exists"("user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id
  );
END;
$$;


ALTER FUNCTION "public"."check_profile_exists"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_rate_limit"("p_identifier" "text", "p_max_requests" integer DEFAULT 100, "p_window_seconds" integer DEFAULT 60) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
  v_count INTEGER;
  v_window_start TIMESTAMP WITH TIME ZONE;
  v_is_limited BOOLEAN;
BEGIN
  -- Calculate the start of the current window
  v_window_start := NOW() - (p_window_seconds || ' seconds')::INTERVAL;
  
  -- Delete old rate limit records
  DELETE FROM public.rate_limits
  WHERE window_start < v_window_start - INTERVAL '1 day';
  
  -- Count requests in the current window
  SELECT SUM(count) INTO v_count
  FROM public.rate_limits
  WHERE identifier = p_identifier
  AND window_start >= v_window_start;
  
  v_count := COALESCE(v_count, 0);
  
  -- Check if rate limited
  v_is_limited := v_count >= p_max_requests;
  
  -- If not rate limited, record this request
  IF NOT v_is_limited THEN
    -- Check for an existing record in this window to update
    UPDATE public.rate_limits
    SET count = count + 1
    WHERE identifier = p_identifier
    AND window_start >= v_window_start
    AND window_start <= NOW();
    
    -- If no record was updated, insert a new one
    IF NOT FOUND THEN
      INSERT INTO public.rate_limits (
        identifier, 
        count, 
        window_start, 
        window_seconds
      ) VALUES (
        p_identifier,
        1,
        NOW(),
        p_window_seconds
      );
    END IF;
  END IF;
  
  RETURN v_is_limited;
END;
$$;


ALTER FUNCTION "public"."check_rate_limit"("p_identifier" "text", "p_max_requests" integer, "p_window_seconds" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_skill_requirements"("p_user_id" "uuid", "p_content_type" "text", "p_content_id" "uuid") RETURNS TABLE("skill_name" "text", "required_level" integer, "user_level" integer, "meets_requirement" boolean)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sr.skill_name,
        sr.required_level,
        COALESCE(us.proficiency_level, 0) as user_level,
        COALESCE(us.proficiency_level, 0) >= sr.required_level as meets_requirement
    FROM public.skill_requirements sr
    LEFT JOIN public.user_skills us ON 
        us.user_id = p_user_id AND 
        us.skill_name = sr.skill_name
    WHERE sr.content_type = p_content_type
    AND sr.content_id = p_content_id;
END;
$$;


ALTER FUNCTION "public"."check_skill_requirements"("p_user_id" "uuid", "p_content_type" "text", "p_content_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_user_exists"("user_email" "text") RETURNS boolean
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = user_email
  );
END;
$$;


ALTER FUNCTION "public"."check_user_exists"("user_email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_user_role"("_user_id" "uuid", "_role_slug" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles p
    JOIN tenant_roles tr ON p.role_id = tr.id
    WHERE p.user_id = _user_id AND tr.slug = _role_slug
  );
END;
$$;


ALTER FUNCTION "public"."check_user_role"("_user_id" "uuid", "_role_slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."clean_chat_history"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    DELETE FROM public.chat_history 
    WHERE created_at < NOW() - INTERVAL '90 days';
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."clean_chat_history"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."clean_chat_history"() IS 'Automatically removes chat history older than 90 days to maintain database performance';



CREATE OR REPLACE FUNCTION "public"."cleanup_expired_tokens"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    DELETE FROM public.csrf_tokens WHERE expires_at < NOW();
    DELETE FROM public.login_attempts WHERE last_attempt < NOW() - INTERVAL '24 hours';
END;
$$;


ALTER FUNCTION "public"."cleanup_expired_tokens"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_old_notifications"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  DELETE FROM public.cross_platform_notifications 
  WHERE created_at < NOW() - INTERVAL '90 days' 
  AND read = true;
END;
$$;


ALTER FUNCTION "public"."cleanup_old_notifications"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."cleanup_old_notifications"() IS 'Maintenance function to remove old read notifications';



CREATE OR REPLACE FUNCTION "public"."cleanup_old_rate_limits"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Delete records older than 24 hours
  DELETE FROM public.rate_limits
  WHERE window_start < NOW() - INTERVAL '24 hours';
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."cleanup_old_rate_limits"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_old_security_events"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Keep critical events for 90 days, high severity for 60 days, others for 30 days
  DELETE FROM public.security_events
  WHERE (severity = 'critical' AND created_at < NOW() - INTERVAL '90 days')
     OR (severity = 'high' AND created_at < NOW() - INTERVAL '60 days')
     OR (severity IN ('medium', 'low') AND created_at < NOW() - INTERVAL '30 days');
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."cleanup_old_security_events"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_invite"("p_code" "text", "p_inviter_id" "uuid", "p_expires_at" timestamp with time zone) RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
  v_invite_id UUID;
BEGIN
  INSERT INTO invites (code, inviter_id, is_used, expires_at)
  VALUES (p_code, p_inviter_id, FALSE, p_expires_at)
  RETURNING id INTO v_invite_id;
  
  RETURN v_invite_id;
END;
$$;


ALTER FUNCTION "public"."create_invite"("p_code" "text", "p_inviter_id" "uuid", "p_expires_at" timestamp with time zone) OWNER TO "service_role";


CREATE OR REPLACE FUNCTION "public"."create_notification"("p_user_id" "uuid", "p_platform" "text", "p_title" "text", "p_body" "text", "p_metadata" "jsonb" DEFAULT NULL::"jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    v_notification_id uuid;
BEGIN
    INSERT INTO public.notifications (
        user_id,
        platform,
        title,
        body,
        metadata
    )
    VALUES (
        p_user_id,
        p_platform,
        p_title,
        p_body,
        p_metadata
    )
    RETURNING id INTO v_notification_id;

    RETURN v_notification_id;
END;
$$;


ALTER FUNCTION "public"."create_notification"("p_user_id" "uuid", "p_platform" "text", "p_title" "text", "p_body" "text", "p_metadata" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_profile"("user_id" "uuid", "user_email" "text", "user_role" "text" DEFAULT 'user'::"text") RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
  INSERT INTO profiles (id, email, role, created_at, updated_at)
  VALUES (user_id, user_email, user_role, NOW(), NOW())
  ON CONFLICT (id) DO UPDATE
  SET email = user_email, role = user_role, updated_at = NOW();
END;
$$;


ALTER FUNCTION "public"."create_profile"("user_id" "uuid", "user_email" "text", "user_role" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_system_alert"("p_alert_type" "text", "p_message" "text", "p_severity" "text", "p_context" "jsonb" DEFAULT NULL::"jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    v_id uuid;
BEGIN
    INSERT INTO public.system_alerts (
        alert_type,
        message,
        severity,
        context
    ) VALUES (
        p_alert_type,
        p_message,
        p_severity,
        p_context
    )
    RETURNING id INTO v_id;
    
    RETURN v_id;
END;
$$;


ALTER FUNCTION "public"."create_system_alert"("p_alert_type" "text", "p_message" "text", "p_severity" "text", "p_context" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_tenant"("_name" "text", "_slug" "text", "_description" "text", "_admin_user_id" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    _tenant_id UUID;
BEGIN
    -- Create the tenant
    INSERT INTO public.tenants (name, slug, description, status)
    VALUES (_name, _slug, _description, 'active')
    RETURNING id INTO _tenant_id;
    
    -- Add the admin user to the tenant
    INSERT INTO public.tenant_users (tenant_id, user_id, role, status)
    VALUES (_tenant_id, _admin_user_id, 'admin', 'active');
    
    -- Update the admin user's platforms
    UPDATE public.profiles
    SET platforms = array_append(COALESCE(platforms, ARRAY[]::text[]), _slug)
    WHERE id = _admin_user_id AND (_slug != ALL(COALESCE(platforms, ARRAY[]::text[])) OR platforms IS NULL);
    
    RETURN _tenant_id;
END;
$$;


ALTER FUNCTION "public"."create_tenant"("_name" "text", "_slug" "text", "_description" "text", "_admin_user_id" "uuid") OWNER TO "postgres";


CREATE PROCEDURE "public"."create_user_profile"(IN "user_id" "uuid", IN "email" "text", IN "platform" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  existing_profile BOOLEAN;
BEGIN
  -- Check if profile already exists
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = user_id
  ) INTO existing_profile;
  
  -- Create profile if it does not exist
  IF NOT existing_profile THEN
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      platforms,
      created_at,
      updated_at
    ) VALUES (
      user_id,
      email,
      '',
      ARRAY[platform]::text[],
      now(),
      now()
    );
  ELSE
    -- Update platforms array if profile already exists
    UPDATE public.profiles
    SET 
      platforms = array_append(array_remove(platforms, platform), platform),
      updated_at = now()
    WHERE id = user_id;
  END IF;
END;
$$;


ALTER PROCEDURE "public"."create_user_profile"(IN "user_id" "uuid", IN "email" "text", IN "platform" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_old_chat_history"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  DELETE FROM public.chat_history
  WHERE created_at < NOW() - INTERVAL '90 days';
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."delete_old_chat_history"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."delete_old_chat_history"() IS 'Automatically removes chat history older than 90 days to improve database performance';



CREATE OR REPLACE FUNCTION "public"."ensure_token_balance"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    INSERT INTO token_balances (user_id)
    VALUES (NEW.user_id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."ensure_token_balance"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."exec_sql"("sql" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
  EXECUTE sql;
END;
$$;


ALTER FUNCTION "public"."exec_sql"("sql" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fibonacci"("n" integer) RETURNS bigint
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    a BIGINT := 0;
    b BIGINT := 1;
    temp BIGINT;
    i INT := 0;
BEGIN
    IF n <= 0 THEN RETURN 0; END IF;
    WHILE i < n LOOP
        temp := a;
        a := b;
        b := temp + b;
        i := i + 1;
    END LOOP;
    RETURN a;
END;
$$;


ALTER FUNCTION "public"."fibonacci"("n" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."fibonacci"("n" integer) IS 'Calculates the nth Fibonacci number (iteratively).';



CREATE OR REPLACE FUNCTION "public"."find_similar_content"("p_content_type" "text", "p_content_id" "uuid", "p_limit" integer DEFAULT 5) RETURNS TABLE("similar_content_type" "text", "similar_content_id" "uuid", "similarity_score" numeric, "similarity_factors" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cs.similar_content_type,
        cs.similar_content_id,
        cs.similarity_score,
        cs.similarity_factors
    FROM public.content_similarity cs
    WHERE cs.content_type = p_content_type
    AND cs.content_id = p_content_id
    ORDER BY cs.similarity_score DESC
    LIMIT p_limit;
END;
$$;


ALTER FUNCTION "public"."find_similar_content"("p_content_type" "text", "p_content_id" "uuid", "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."flag_inactive_users"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    inactive_threshold CONSTANT interval := interval '6 months';
BEGIN
    UPDATE user_gamification_stats
    SET is_inactive = true,
        updated_at = NOW() -- Update timestamp
    WHERE last_active < (NOW() - inactive_threshold)
      AND is_inactive = false; -- Only update those not already flagged

    -- Optional: Reset flag for users who became active again
    UPDATE user_gamification_stats
    SET is_inactive = false,
        updated_at = NOW()
    WHERE last_active >= (NOW() - inactive_threshold)
      AND is_inactive = true; -- Only update those currently flagged as inactive

    -- Note: Multiplier logic based on is_inactive should be checked within mint_points_on_action or called functions.
END;
$$;


ALTER FUNCTION "public"."flag_inactive_users"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."flag_inactive_users"() IS 'Checks for users inactive for 6 months and updates their is_inactive flag.';



CREATE OR REPLACE FUNCTION "public"."generate_embedding"("content" "text") RETURNS "public"."vector"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  embedding vector(1536);
BEGIN
  -- This is a placeholder. In production, this would call an external API or use pg_embedding
  -- The actual implementation would be handled through Edge Functions or server-side code
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."generate_embedding"("content" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_tenant_api_key"("_tenant_id" "uuid", "_name" "text", "_scopes" "text"[] DEFAULT NULL::"text"[]) RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    _api_key TEXT;
    _api_secret TEXT;
    _result JSONB;
BEGIN
    -- Generate random API key and secret
    _api_key := encode(gen_random_bytes(16), 'hex');
    _api_secret := encode(gen_random_bytes(32), 'hex');
    
    -- Insert new API key
    INSERT INTO public.tenant_api_keys (
        tenant_id, 
        name, 
        api_key, 
        api_secret,
        scopes,
        status,
        created_by
    ) VALUES (
        _tenant_id,
        _name,
        _api_key,
        _api_secret,
        COALESCE(_scopes, ARRAY[]::TEXT[]),
        'active',
        auth.uid()
    )
    RETURNING id, tenant_id, name, api_key, api_secret, scopes, status, created_at
    INTO _result;
    
    RETURN _result;
END;
$$;


ALTER FUNCTION "public"."generate_tenant_api_key"("_tenant_id" "uuid", "_name" "text", "_scopes" "text"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_activity_interactions"("p_activity_id" "uuid", "p_limit" integer DEFAULT 20, "p_offset" integer DEFAULT 0) RETURNS TABLE("interaction_id" "uuid", "user_id" "uuid", "interaction_type" "text", "comment_text" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        si.id,
        si.user_id,
        si.interaction_type,
        si.comment_text,
        si.created_at
    FROM public.social_interactions si
    WHERE si.activity_id = p_activity_id
    ORDER BY si.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;


ALTER FUNCTION "public"."get_activity_interactions"("p_activity_id" "uuid", "p_limit" integer, "p_offset" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_available_rooms"("user_uuid" "uuid") RETURNS TABLE("id" "uuid", "name" "text", "description" "text", "room_type" "text", "created_at" timestamp with time zone, "created_by" "uuid", "is_accessible" boolean)
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    is_premium BOOLEAN;
    is_super BOOLEAN;
BEGIN
    -- Get user subscription status
    SELECT is_premium_subscriber(user_uuid) INTO is_premium;
    SELECT is_superachiever(user_uuid) INTO is_super;
    
    RETURN QUERY
    SELECT 
        r.id,
        r.name,
        r.description,
        r.room_type,
        r.created_at,
        r.created_by,
        CASE
            WHEN r.room_type = 'public' THEN TRUE
            WHEN r.room_type = 'premium' AND is_premium THEN TRUE
            WHEN r.room_type = 'superachiever' AND is_super THEN TRUE
            WHEN r.created_by = user_uuid THEN TRUE
            ELSE FALSE
        END AS is_accessible
    FROM 
        rooms r
    ORDER BY 
        r.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."get_available_rooms"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_content_dependencies"("p_content_type" "text", "p_content_id" "uuid") RETURNS TABLE("dependency_id" "uuid", "depends_on_type" "text", "depends_on_id" "uuid", "dependency_type" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id as dependency_id,
        d.depends_on_type,
        d.depends_on_id,
        d.dependency_type
    FROM public.content_dependencies d
    WHERE d.content_type = p_content_type
    AND d.content_id = p_content_id;
END;
$$;


ALTER FUNCTION "public"."get_content_dependencies"("p_content_type" "text", "p_content_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_content_engagement_metrics"("p_platform" "text") RETURNS TABLE("module_id" "uuid", "module_title" "text", "unique_users" bigint, "completions" bigint, "avg_completion_time_seconds" double precision)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mces.module_id,
        mces.module_title,
        mces.unique_users,
        mces.completions,
        mces.avg_completion_time_seconds
    FROM public.mv_content_engagement_stats mces
    WHERE mces.platform = p_platform
    ORDER BY mces.unique_users DESC;
END;
$$;


ALTER FUNCTION "public"."get_content_engagement_metrics"("p_platform" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_dependent_content"("p_content_type" "text", "p_content_id" "uuid") RETURNS TABLE("content_type" "text", "content_id" "uuid", "dependency_type" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.content_type,
        d.content_id,
        d.dependency_type
    FROM public.content_dependencies d
    WHERE d.depends_on_type = p_content_type
    AND d.depends_on_id = p_content_id;
END;
$$;


ALTER FUNCTION "public"."get_dependent_content"("p_content_type" "text", "p_content_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_discover_posts"("page_size" integer DEFAULT 10, "page_number" integer DEFAULT 1, "filter_token_tag" "text" DEFAULT NULL::"text") RETURNS TABLE("id" "uuid", "content" "text", "author_id" "uuid", "platform" "text", "section" "text", "is_pinned" boolean, "engagement_count" integer, "created_at" timestamp with time zone, "token_tag" "text", "full_name" "text", "avatar_url" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.content,
        p.author_id,
        p.platform,
        p.section,
        p.is_pinned,
        p.engagement_count,
        p.created_at,
        p.token_tag,
        prof.full_name,
        prof.avatar_url
    FROM 
        posts p
    LEFT JOIN 
        profiles prof ON p.author_id = prof.id
    WHERE
        (filter_token_tag IS NULL OR p.token_tag = filter_token_tag)
    ORDER BY 
        p.is_pinned DESC,
        p.created_at DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size;
END;
$$;


ALTER FUNCTION "public"."get_discover_posts"("page_size" integer, "page_number" integer, "filter_token_tag" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_enabled_features"("p_platform" "text") RETURNS TABLE("feature_key" "text", "config" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.feature_key,
        f.config
    FROM public.feature_flags f
    WHERE f.platform = p_platform
    AND f.is_enabled = true;
END;
$$;


ALTER FUNCTION "public"."get_enabled_features"("p_platform" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_learning_recommendations"("p_user_id" "uuid", "p_limit" integer DEFAULT 10) RETURNS TABLE("content_type" "text", "content_id" "uuid", "relevance_score" numeric, "recommendation_reason" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    DELETE FROM public.learning_recommendations
    WHERE expires_at < now();
    
    RETURN QUERY
    SELECT 
        lr.content_type,
        lr.content_id,
        lr.relevance_score,
        lr.recommendation_reason
    FROM public.learning_recommendations lr
    WHERE lr.user_id = p_user_id
    AND (lr.expires_at IS NULL OR lr.expires_at > now())
    ORDER BY lr.relevance_score DESC
    LIMIT p_limit;
END;
$$;


ALTER FUNCTION "public"."get_learning_recommendations"("p_user_id" "uuid", "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_next_lesson"("user_id" "uuid", "platform_name" "text") RETURNS TABLE("module_id" "uuid", "module_title" "text", "lesson_id" "uuid", "lesson_title" "text")
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
    WITH user_progress AS (
        SELECT
            module,
            lesson,
            status
        FROM public.progress
        WHERE user_id = user_id
    ),
    ordered_content AS (
        SELECT
            cm.id as module_id,
            cm.title as module_title,
            cm.order_index as module_order,
            l.id as lesson_id,
            l.title as lesson_title,
            l.order_index as lesson_order,
            COALESCE(up_module.status, 'not_started') as module_status,
            COALESCE(up_lesson.status, 'not_started') as lesson_status
        FROM public.content_modules cm
        LEFT JOIN public.lessons l ON l.module_id = cm.id
        LEFT JOIN user_progress up_module ON up_module.module = cm.id::text AND up_module.lesson IS NULL
        LEFT JOIN user_progress up_lesson ON up_lesson.lesson = l.id::text
        WHERE cm.platform = platform_name
        AND cm.is_published = true
        AND (l.id IS NULL OR l.is_published = true)
        ORDER BY cm.order_index, l.order_index
    )
    SELECT DISTINCT ON (module_id)
        module_id,
        module_title,
        lesson_id,
        lesson_title
    FROM ordered_content
    WHERE module_status != 'completed'
    OR lesson_status != 'completed'
    ORDER BY module_id, lesson_order
    LIMIT 1;
$$;


ALTER FUNCTION "public"."get_next_lesson"("user_id" "uuid", "platform_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_pending_schedules"("p_platform" "text") RETURNS TABLE("content_type" "text", "content_id" "uuid", "publish_at" timestamp with time zone, "unpublish_at" timestamp with time zone, "created_by" "uuid")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.content_type,
        s.content_id,
        s.publish_at,
        s.unpublish_at,
        s.created_by
    FROM public.content_schedule s
    WHERE s.platform = p_platform
    AND s.publish_at > now()
    ORDER BY s.publish_at ASC;
END;
$$;


ALTER FUNCTION "public"."get_pending_schedules"("p_platform" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_personalized_recommendations"("p_user_id" "uuid", "p_platform" "text", "p_limit" integer DEFAULT 10) RETURNS TABLE("content_type" "text", "content_id" "uuid", "relevance_score" numeric, "recommendation_type" "text", "factors" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    DELETE FROM public.user_recommendations
    WHERE expires_at < now();
    
    RETURN QUERY
    SELECT 
        ur.content_type,
        ur.content_id,
        ur.relevance_score,
        ur.recommendation_type,
        ur.factors
    FROM public.user_recommendations ur
    WHERE ur.user_id = p_user_id
    AND ur.platform = p_platform
    AND (ur.expires_at IS NULL OR ur.expires_at > now())
    ORDER BY ur.relevance_score DESC
    LIMIT p_limit;
END;
$$;


ALTER FUNCTION "public"."get_personalized_recommendations"("p_user_id" "uuid", "p_platform" "text", "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_platform_content"("p_platform" "text", "include_unpublished" boolean DEFAULT false) RETURNS TABLE("module_id" "uuid", "module_title" "text", "module_description" "text", "module_is_published" boolean, "module_created_at" timestamp with time zone, "module_updated_at" timestamp with time zone, "lesson_id" "uuid", "lesson_title" "text", "lesson_is_published" boolean, "lesson_order_index" integer)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cm.id as module_id,
        cm.title as module_title,
        cm.description as module_description,
        cm.is_published as module_is_published,
        cm.created_at as module_created_at,
        cm.updated_at as module_updated_at,
        l.id as lesson_id,
        l.title as lesson_title,
        l.is_published as lesson_is_published,
        l.order_index as lesson_order_index
    FROM public.content_modules cm
    LEFT JOIN public.lessons l ON l.module_id = cm.id
    WHERE cm.platform = p_platform
    AND (include_unpublished OR cm.is_published)
    ORDER BY cm.order_index, l.order_index;
END;
$$;


ALTER FUNCTION "public"."get_platform_content"("p_platform" "text", "include_unpublished" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_platform_customizations"("p_platform" "text") RETURNS TABLE("component_key" "text", "customization" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pc.component_key,
        pc.customization
    FROM public.platform_customization pc
    WHERE pc.platform = p_platform;
END;
$$;


ALTER FUNCTION "public"."get_platform_customizations"("p_platform" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_platform_metrics"("p_platform" "text", "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone) RETURNS TABLE("metric_key" "text", "metric_value" numeric, "dimension_values" "jsonb", "measured_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        am.metric_key,
        am.metric_value,
        am.dimension_values,
        am.measured_at
    FROM public.analytics_metrics am
    WHERE am.platform = p_platform
    AND am.measured_at BETWEEN p_start_date AND p_end_date
    ORDER BY am.measured_at DESC;
END;
$$;


ALTER FUNCTION "public"."get_platform_metrics"("p_platform" "text", "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_platform_redirect_url"("platform_name" "text", "redirect_type" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
declare
    redirect_url text;
begin
    select redirects->redirect_type into redirect_url
    from public.platform_settings
    where platform = platform_name;

    if redirect_url is null then
        -- Default redirects if not specified
        case redirect_type
            when 'after_login' then redirect_url := '/dashboard';
            when 'after_signup' then redirect_url := '/auth/sign-up-success';
            when 'after_reset' then redirect_url := '/auth/update-password';
            else redirect_url := '/';
        end case;
    end if;

    return redirect_url;
end;
$$;


ALTER FUNCTION "public"."get_platform_redirect_url"("platform_name" "text", "redirect_type" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_platform_settings"("p_platform" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    v_settings jsonb;
BEGIN
    SELECT settings INTO v_settings
    FROM public.platform_settings
    WHERE platform = p_platform;
    
    RETURN v_settings;
END;
$$;


ALTER FUNCTION "public"."get_platform_settings"("p_platform" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_recent_posts"("p_visibility" "text" DEFAULT 'public'::"text", "p_limit" integer DEFAULT 20, "p_offset" integer DEFAULT 0) RETURNS TABLE("id" "uuid", "author_id" "uuid", "content" "text", "token_tag" "text", "created_at" timestamp with time zone, "visibility" "text", "author_name" "text", "author_avatar" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.author_id,
        p.content,
        p.token_tag,
        p.created_at,
        p.visibility,
        prof.full_name as author_name,
        prof.avatar_url as author_avatar
    FROM posts p
    LEFT JOIN profiles prof ON p.author_id = prof.id
    WHERE p.visibility = p_visibility
    ORDER BY p.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;


ALTER FUNCTION "public"."get_recent_posts"("p_visibility" "text", "p_limit" integer, "p_offset" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_role_capabilities"("_role_slug" "text", "_feature_name" "text", "_tenant_id" "uuid") RETURNS TABLE("can_view" boolean, "can_create" boolean, "can_edit" boolean, "can_delete" boolean, "can_approve" boolean)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    rc.can_view,
    rc.can_create,
    rc.can_edit,
    rc.can_delete,
    rc.can_approve
  FROM role_capabilities rc
  WHERE 
    rc.tenant_id = _tenant_id AND
    rc.role_slug = _role_slug AND
    rc.feature_name = _feature_name;
END;
$$;


ALTER FUNCTION "public"."get_role_capabilities"("_role_slug" "text", "_feature_name" "text", "_tenant_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_room_messages"("room_uuid" "uuid", "page_size" integer DEFAULT 50, "before_timestamp" timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS TABLE("id" "uuid", "content" "text", "sender_id" "uuid", "room_id" "uuid", "created_at" timestamp with time zone, "token_tag" "text", "sender_name" "text", "sender_avatar" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.content,
        m.sender_id,
        m.room_id,
        m.created_at,
        m.token_tag,
        p.full_name,
        p.avatar_url
    FROM 
        messages m
    JOIN 
        profiles p ON m.sender_id = p.id
    WHERE 
        m.room_id = room_uuid AND
        (before_timestamp IS NULL OR m.created_at < before_timestamp)
    ORDER BY 
        m.created_at DESC
    LIMIT page_size;
END;
$$;


ALTER FUNCTION "public"."get_room_messages"("room_uuid" "uuid", "page_size" integer, "before_timestamp" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_room_type"("room_uuid" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  room_type_val TEXT;
BEGIN
  SELECT room_type INTO room_type_val
  FROM rooms
  WHERE id = room_uuid;
  
  RETURN COALESCE(room_type_val, 'public');
END;
$$;


ALTER FUNCTION "public"."get_room_type"("room_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_tenant_analytics"("_tenant_id" "uuid", "_start_date" timestamp with time zone DEFAULT NULL::timestamp with time zone, "_end_date" timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS "json"
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    _result JSON;
BEGIN
    -- Set default date range if not provided
    IF _start_date IS NULL THEN
        _start_date := NOW() - INTERVAL '30 days';
    END IF;
    
    IF _end_date IS NULL THEN
        _end_date := NOW();
    END IF;
    
    SELECT 
        json_build_object(
            'user_metrics', (
                SELECT json_build_object(
                    'total_users', COUNT(DISTINCT tu.user_id),
                    'active_users', COUNT(DISTINCT tu.user_id) FILTER (WHERE tu.status = 'active'),
                    'inactive_users', COUNT(DISTINCT tu.user_id) FILTER (WHERE tu.status = 'inactive'),
                    'new_users', COUNT(DISTINCT tu.user_id) FILTER (WHERE tu.joined_at BETWEEN _start_date AND _end_date)
                )
                FROM public.tenant_users tu
                WHERE tu.tenant_id = _tenant_id
            ),
            'activity_metrics', (
                SELECT json_build_object(
                    'total_activities', COUNT(af.id),
                    'activities_by_type', (
                        SELECT json_object_agg(activity_type, activity_count)
                        FROM (
                            SELECT 
                                af.activity_type,
                                COUNT(*) as activity_count
                            FROM public.activity_feed af
                            JOIN public.tenant_users tu ON af.user_id = tu.user_id
                            WHERE tu.tenant_id = _tenant_id
                              AND af.created_at BETWEEN _start_date AND _end_date
                            GROUP BY af.activity_type
                        ) as activity_types
                    )
                )
                FROM public.activity_feed af
                JOIN public.tenant_users tu ON af.user_id = tu.user_id
                WHERE tu.tenant_id = _tenant_id
                  AND af.created_at BETWEEN _start_date AND _end_date
            ),
            'content_metrics', (
                SELECT json_build_object(
                    'total_content_modules', COUNT(DISTINCT cm.id),
                    'total_lessons', COUNT(DISTINCT l.id),
                    'completed_lessons', COUNT(DISTINCT lp.id) FILTER (WHERE lp.status = 'completed')
                )
                FROM public.tenants t
                LEFT JOIN public.content_modules cm ON t.slug = cm.platform
                LEFT JOIN public.lessons l ON cm.id = l.module_id
                LEFT JOIN public.tenant_users tu ON t.id = tu.tenant_id
                LEFT JOIN public.learning_progress lp 
                    ON (l.id = lp.content_id AND lp.content_type = 'lesson' AND lp.user_id = tu.user_id)
                WHERE t.id = _tenant_id
            ),
            'time_period', json_build_object(
                'start_date', _start_date,
                'end_date', _end_date
            )
        ) INTO _result;
        
    RETURN _result;
END;
$$;


ALTER FUNCTION "public"."get_tenant_analytics"("_tenant_id" "uuid", "_start_date" timestamp with time zone, "_end_date" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_tenant_by_slug"("_slug" "text") RETURNS TABLE("id" "uuid", "name" "text", "slug" "text", "description" "text", "settings" "jsonb", "branding" "jsonb", "status" "text", "user_count" bigint, "domain" "text", "subscription_status" "text", "subscription_plan" "text")
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        t.slug,
        t.description,
        t.settings,
        t.branding,
        t.status,
        COUNT(DISTINCT tu.user_id)::BIGINT AS user_count,
        (SELECT domain FROM public.tenant_domains WHERE tenant_id = t.id AND is_primary = true LIMIT 1) AS domain,
        ts.status AS subscription_status,
        ts.plan_id AS subscription_plan
    FROM 
        public.tenants t
    LEFT JOIN 
        public.tenant_users tu ON t.id = tu.tenant_id AND tu.status = 'active'
    LEFT JOIN
        public.tenant_subscriptions ts ON t.id = ts.tenant_id
    WHERE 
        t.slug = _slug
    GROUP BY
        t.id, ts.status, ts.plan_id;
END;
$$;


ALTER FUNCTION "public"."get_tenant_by_slug"("_slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_tenant_shared_content"("_tenant_slug" "text", "_limit" integer DEFAULT 10, "_offset" integer DEFAULT 0, "_category_slug" "text" DEFAULT NULL::"text") RETURNS TABLE("id" "uuid", "title" "text", "slug" "text", "description" "text", "content" "jsonb", "category_id" "uuid", "category_name" "text", "category_slug" "text", "is_featured" boolean, "display_order" integer, "tags" "text"[], "created_at" timestamp with time zone, "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sc.id,
        sc.title,
        sc.slug,
        sc.description,
        sc.content,
        sc.category_id,
        cc.name as category_name,
        cc.slug as category_slug,
        tsc.is_featured,
        tsc.display_order,
        ARRAY(
            SELECT ct.name
            FROM public.content_content_tags cct
            JOIN public.content_tags ct ON cct.tag_id = ct.id
            WHERE cct.content_id = sc.id
        ) as tags,
        sc.created_at,
        sc.updated_at
    FROM 
        public.shared_content sc
    JOIN 
        public.tenant_shared_content tsc ON sc.id = tsc.content_id
    JOIN 
        public.tenants t ON tsc.tenant_id = t.id
    LEFT JOIN
        public.content_categories cc ON sc.category_id = cc.id
    WHERE 
        t.slug = _tenant_slug
        AND sc.is_published = true
        AND (_category_slug IS NULL OR cc.slug = _category_slug)
    ORDER BY 
        tsc.is_featured DESC,
        tsc.display_order ASC,
        sc.updated_at DESC
    LIMIT _limit
    OFFSET _offset;
END;
$$;


ALTER FUNCTION "public"."get_tenant_shared_content"("_tenant_slug" "text", "_limit" integer, "_offset" integer, "_category_slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_token_balances"("p_user_id" "uuid") RETURNS TABLE("luck_balance" integer, "live_balance" integer, "love_balance" integer, "life_balance" integer, "total_earned" integer, "last_updated" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tb.luck_balance,
        tb.live_balance,
        tb.love_balance,
        tb.life_balance,
        COALESCE(
            (SELECT SUM(amount)
             FROM token_transactions
             WHERE user_id = p_user_id),
            0
        ) as total_earned,
        tb.updated_at as last_updated
    FROM token_balances tb
    WHERE tb.user_id = p_user_id;
END;
$$;


ALTER FUNCTION "public"."get_token_balances"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_token_history"("p_user_id" "uuid", "p_token_type" "text" DEFAULT NULL::"text", "p_limit" integer DEFAULT 20, "p_offset" integer DEFAULT 0) RETURNS TABLE("token_type" "text", "amount" integer, "source" "text", "created_at" timestamp with time zone, "description" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE 
            WHEN source_type = 'post' THEN posts.token_tag
            WHEN source_type = 'message' THEN messages.token_tag
            ELSE source_type
        END as token_type,
        tt.amount,
        tt.source_type as source,
        tt.created_at,
        CASE
            WHEN source_type = 'post' THEN 'Post reward'
            WHEN source_type = 'message' THEN 'Chat activity reward'
            WHEN source_type = 'zoom' THEN 'Sunday Zoom attendance'
            ELSE 'Other reward'
        END as description
    FROM token_transactions tt
    LEFT JOIN posts ON tt.source_id = posts.id AND tt.source_type = 'post'
    LEFT JOIN messages ON tt.source_id = messages.id AND tt.source_type = 'message'
    WHERE tt.user_id = p_user_id
    AND (p_token_type IS NULL OR tt.token_type = p_token_type)
    ORDER BY tt.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;


ALTER FUNCTION "public"."get_token_history"("p_user_id" "uuid", "p_token_type" "text", "p_limit" integer, "p_offset" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_unread_notification_count"("p_user_id" "uuid", "p_platform" "text") RETURNS bigint
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    v_count bigint;
BEGIN
    SELECT COUNT(*)
    INTO v_count
    FROM public.notifications
    WHERE user_id = p_user_id
    AND platform = p_platform
    AND is_read = false;

    RETURN v_count;
END;
$$;


ALTER FUNCTION "public"."get_unread_notification_count"("p_user_id" "uuid", "p_platform" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_accessible_tenants"("_user_id" "uuid") RETURNS TABLE("id" "uuid", "name" "text", "slug" "text", "description" "text", "branding" "jsonb", "role" "text", "primary_domain" "text", "is_active" boolean)
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        t.slug,
        t.description,
        t.branding,
        tu.role,
        (SELECT domain FROM tenant_domains WHERE tenant_id = t.id AND is_primary IS TRUE LIMIT 1) as primary_domain,
        tu.status = 'active' AND t.status = 'active' as is_active
    FROM 
        public.tenants t
    JOIN 
        public.tenant_users tu ON t.id = tu.tenant_id
    WHERE 
        tu.user_id = _user_id
    ORDER BY 
        t.name ASC;
END;
$$;


ALTER FUNCTION "public"."get_user_accessible_tenants"("_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_achievements"("p_user_id" "uuid", "p_platform" "text") RETURNS TABLE("achievement_name" "text", "achievement_description" "text", "badge_url" "text", "points" integer, "earned_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.name,
        a.description,
        a.badge_url,
        a.points,
        ua.earned_at
    FROM public.achievements a
    JOIN public.user_achievements ua ON ua.achievement_id = a.id
    WHERE ua.user_id = p_user_id
    AND a.platform = p_platform
    ORDER BY ua.earned_at DESC;
END;
$$;


ALTER FUNCTION "public"."get_user_achievements"("p_user_id" "uuid", "p_platform" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_activity_feed"("p_user_id" "uuid", "p_platform" "text", "p_limit" integer DEFAULT 20, "p_offset" integer DEFAULT 0) RETURNS TABLE("activity_id" "uuid", "user_id" "uuid", "activity_type" "text", "content_type" "text", "content_id" "uuid", "metadata" "jsonb", "created_at" timestamp with time zone, "interaction_count" bigint)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        af.id,
        af.user_id,
        af.activity_type,
        af.content_type,
        af.content_id,
        af.metadata,
        af.created_at,
        COUNT(si.id)::bigint as interaction_count
    FROM public.activity_feed af
    LEFT JOIN public.social_interactions si ON si.activity_id = af.id
    WHERE af.platform = p_platform
    AND (
        af.user_id = p_user_id
        OR EXISTS (
            SELECT 1 FROM public.user_connections uc
            WHERE uc.user_id = p_user_id
            AND uc.connected_user_id = af.user_id
        )
    )
    GROUP BY af.id, af.user_id, af.activity_type, af.content_type, 
             af.content_id, af.metadata, af.created_at
    ORDER BY af.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;


ALTER FUNCTION "public"."get_user_activity_feed"("p_user_id" "uuid", "p_platform" "text", "p_limit" integer, "p_offset" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_activity_summary"("p_user_id" "uuid", "p_platform" "text", "p_start_date" "date", "p_end_date" "date") RETURNS TABLE("total_lessons_completed" bigint, "total_modules_completed" bigint, "total_points_earned" bigint, "active_days" bigint)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        SUM(lessons_completed)::bigint,
        SUM(modules_completed)::bigint,
        SUM(points_earned)::bigint,
        COUNT(DISTINCT activity_date)::bigint
    FROM public.user_activity_stats
    WHERE user_id = p_user_id
    AND platform = p_platform
    AND activity_date BETWEEN p_start_date AND p_end_date;
END;
$$;


ALTER FUNCTION "public"."get_user_activity_summary"("p_user_id" "uuid", "p_platform" "text", "p_start_date" "date", "p_end_date" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_conversations"("p_user_id" "uuid", "p_platform" "text", "p_limit" integer DEFAULT 10) RETURNS TABLE("id" "uuid", "title" "text", "created_at" timestamp with time zone, "updated_at" timestamp with time zone, "message_count" integer, "model" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.title,
    c.created_at,
    c.updated_at,
    COALESCE(jsonb_array_length(c.messages), 0) as message_count,
    c.model
  FROM
    ai_conversations c
  WHERE
    c.user_id = p_user_id AND
    c.platform = p_platform
  ORDER BY c.updated_at DESC
  LIMIT p_limit;
END;
$$;


ALTER FUNCTION "public"."get_user_conversations"("p_user_id" "uuid", "p_platform" "text", "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_engagement_summary"("p_platform" "text", "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone) RETURNS TABLE("total_users" bigint, "active_users" bigint, "total_activities" bigint, "avg_activities_per_user" numeric)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT user_id)::bigint as total_users,
        COUNT(DISTINCT CASE 
            WHEN created_at BETWEEN p_start_date AND p_end_date 
            THEN user_id 
        END)::bigint as active_users,
        COUNT(*)::bigint as total_activities,
        ROUND(COUNT(*)::numeric / NULLIF(COUNT(DISTINCT user_id), 0), 2) as avg_activities_per_user
    FROM public.activity_feed
    WHERE platform = p_platform;
END;
$$;


ALTER FUNCTION "public"."get_user_engagement_summary"("p_platform" "text", "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_notifications"("p_user_id" "uuid", "p_platform" "text", "p_limit" integer DEFAULT 20, "p_offset" integer DEFAULT 0) RETURNS TABLE("notification_id" "uuid", "title" "text", "body" "text", "is_read" boolean, "created_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.title,
        n.body,
        n.is_read,
        n.created_at,
        n.metadata
    FROM public.notifications n
    WHERE n.user_id = p_user_id
    AND n.platform = p_platform
    ORDER BY n.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;


ALTER FUNCTION "public"."get_user_notifications"("p_user_id" "uuid", "p_platform" "text", "p_limit" integer, "p_offset" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_permissions"("_user_id" "uuid", "_tenant_slug" "text" DEFAULT NULL::"text") RETURNS TABLE("permission_slug" "text", "permission_name" "text", "permission_category" "text", "permission_scope" "text", "granted_via" "text")
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    _tenant_id UUID;
    _is_guardian BOOLEAN;
BEGIN
    -- Check if user is a guardian
    SELECT is_guardian INTO _is_guardian
    FROM public.profiles
    WHERE id = _user_id;
    
    -- If tenant_slug is provided, get tenant ID
    IF _tenant_slug IS NOT NULL THEN
        SELECT id INTO _tenant_id
        FROM public.tenants
        WHERE slug = _tenant_slug;
    END IF;
    
    -- Return permissions from guardian status
    IF _is_guardian = true THEN
        RETURN QUERY
        SELECT 
            p.slug AS permission_slug,
            p.name AS permission_name,
            p.category AS permission_category,
            p.scope AS permission_scope,
            'guardian' AS granted_via
        FROM 
            public.permissions p;
    END IF;
    
    -- If tenant_id is not null, return tenant-specific permissions
    IF _tenant_id IS NOT NULL THEN
        -- Return permissions from tenant roles
        RETURN QUERY
        SELECT 
            p.slug AS permission_slug,
            p.name AS permission_name,
            p.category AS permission_category,
            p.scope AS permission_scope,
            tr.name AS granted_via
        FROM 
            public.tenant_users tu
        JOIN 
            public.tenant_roles tr ON tu.tenant_role_id = tr.id
        JOIN 
            public.role_permissions rp ON tr.id = rp.role_id
        JOIN 
            public.permissions p ON rp.permission_id = p.id
        WHERE 
            tu.user_id = _user_id
            AND tu.tenant_id = _tenant_id
            AND tu.status = 'active';
        
        -- Return implied permissions from legacy 'admin' role
        IF EXISTS (
            SELECT 1
            FROM public.tenant_users
            WHERE user_id = _user_id
            AND tenant_id = _tenant_id
            AND status = 'active'
            AND role IN ('admin', 'owner')
        ) THEN
            RETURN QUERY
            SELECT 
                p.slug AS permission_slug,
                p.name AS permission_name,
                p.category AS permission_category,
                p.scope AS permission_scope,
                'legacy_admin_role' AS granted_via
            FROM 
                public.permissions p
            WHERE 
                p.scope = 'tenant';
        END IF;
    END IF;
END;
$$;


ALTER FUNCTION "public"."get_user_permissions"("_user_id" "uuid", "_tenant_slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_platform_progress"("user_id" "uuid", "platform_name" "text") RETURNS TABLE("total_modules" integer, "completed_modules" integer, "total_lessons" integer, "completed_lessons" integer, "completion_percentage" numeric)
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
    WITH module_stats AS (
        SELECT
            COUNT(DISTINCT cm.id) as total_modules,
            COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN cm.id END) as completed_modules,
            COUNT(DISTINCT l.id) as total_lessons,
            COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN l.id END) as completed_lessons
        FROM public.content_modules cm
        LEFT JOIN public.lessons l ON l.module_id = cm.id
        LEFT JOIN public.progress p ON p.user_id = user_id 
            AND (
                (p.module = cm.id::text AND p.lesson IS NULL)
                OR (p.lesson = l.id::text)
            )
        WHERE cm.platform = platform_name
        AND cm.is_published = true
        AND (l.id IS NULL OR l.is_published = true)
    )
    SELECT
        total_modules,
        completed_modules,
        total_lessons,
        completed_lessons,
        CASE
            WHEN total_lessons = 0 THEN 0
            ELSE ROUND((completed_lessons::numeric / total_lessons::numeric) * 100, 2)
        END as completion_percentage
    FROM module_stats;
$$;


ALTER FUNCTION "public"."get_user_platform_progress"("user_id" "uuid", "platform_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_points"("user_id" "uuid", "platform_name" "text" DEFAULT NULL::"text") RETURNS TABLE("platform" "text", "activity_type" "text", "total_points" bigint)
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
    SELECT
        platform,
        activity_type,
        SUM(points) as total_points
    FROM public.participation
    WHERE user_id = user_id
    AND (platform_name IS NULL OR platform = platform_name)
    GROUP BY platform, activity_type
    ORDER BY platform, activity_type;
$$;


ALTER FUNCTION "public"."get_user_points"("user_id" "uuid", "platform_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_progress_summary"("p_user_id" "uuid", "p_platform" "text") RETURNS TABLE("completed_lessons" bigint, "completed_modules" bigint, "total_points" bigint, "last_activity" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mvps.completed_lessons,
        mvps.completed_modules,
        mvps.total_points,
        mvps.last_activity
    FROM public.mv_user_progress_stats mvps
    WHERE mvps.user_id = p_user_id
    AND mvps.platform = p_platform;
END;
$$;


ALTER FUNCTION "public"."get_user_progress_summary"("p_user_id" "uuid", "p_platform" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_role"("user_id" "uuid") RETURNS "text"
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
    SELECT
        CASE
            WHEN is_guardian THEN 'guardian'
            WHEN is_immortal THEN 'immortal'
            WHEN is_neothinker THEN 'neothinker'
            WHEN is_ascender THEN 'ascender'
            ELSE 'user'
        END
    FROM public.profiles
    WHERE id = user_id;
$$;


ALTER FUNCTION "public"."get_user_role"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_role_details"("_user_id" "uuid") RETURNS TABLE("role_id" "uuid", "role_name" "text", "role_slug" "text", "role_category" "text", "role_priority" integer, "tenant_id" "uuid", "tenant_name" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tr.id AS role_id,
    tr.name AS role_name,
    tr.slug AS role_slug,
    tr.role_category,
    tr.priority,
    t.id,
    t.name
  FROM profiles p
  JOIN tenant_roles tr ON p.role_id = tr.id
  JOIN tenants t ON p.tenant_id = t.id
  WHERE p.user_id = _user_id;
END;
$$;


ALTER FUNCTION "public"."get_user_role_details"("_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_tenants"("_user_id" "uuid") RETURNS TABLE("tenant_id" "uuid", "tenant_name" "text", "tenant_slug" "text", "tenant_status" "text", "user_role" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id AS tenant_id,
        t.name AS tenant_name,
        t.slug AS tenant_slug,
        t.status AS tenant_status,
        tu.role AS user_role
    FROM 
        public.tenants t
    JOIN 
        public.tenant_users tu ON t.id = tu.tenant_id
    WHERE 
        tu.user_id = _user_id
        AND tu.status = 'active'
        AND t.status = 'active';
END;
$$;


ALTER FUNCTION "public"."get_user_tenants"("_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_token_history"("user_uuid" "uuid", "token_type_filter" "text" DEFAULT NULL::"text", "page_size" integer DEFAULT 20, "page_number" integer DEFAULT 1) RETURNS TABLE("id" "uuid", "token_type" "text", "amount" integer, "source_type" "text", "description" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.token_type,
        t.amount,
        t.source_type,
        t.description,
        t.created_at
    FROM 
        token_transactions t
    WHERE 
        t.user_id = user_uuid AND
        (token_type_filter IS NULL OR t.token_type = token_type_filter)
    ORDER BY 
        t.created_at DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size;
END;
$$;


ALTER FUNCTION "public"."get_user_token_history"("user_uuid" "uuid", "token_type_filter" "text", "page_size" integer, "page_number" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_token_summary"("user_uuid" "uuid") RETURNS TABLE("token_type" "text", "total_earned" bigint, "current_balance" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tt.token_type,
        COALESCE(SUM(tt.amount), 0) AS total_earned,
        CASE 
            WHEN tt.token_type = 'LUCK' THEN tb.luck_balance
            WHEN tt.token_type = 'LIVE' THEN tb.live_balance
            WHEN tt.token_type = 'LOVE' THEN tb.love_balance
            WHEN tt.token_type = 'LIFE' THEN tb.life_balance
        END AS current_balance
    FROM 
        token_transactions tt
    JOIN 
        token_balances tb ON tt.user_id = tb.user_id
    WHERE 
        tt.user_id = user_uuid
    GROUP BY 
        tt.token_type, 
        tb.luck_balance, 
        tb.live_balance, 
        tb.love_balance, 
        tb.life_balance;
END;
$$;


ALTER FUNCTION "public"."get_user_token_summary"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_version_history"("p_content_type" "text", "p_content_id" "uuid") RETURNS TABLE("version_id" "uuid", "version_number" integer, "title" "text", "created_by" "uuid", "created_at" timestamp with time zone, "status" "text", "reviewed_by" "uuid", "reviewed_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id,
        version_number,
        title,
        created_by,
        created_at,
        status,
        reviewed_by,
        reviewed_at
    FROM public.content_versions
    WHERE content_type = p_content_type
    AND content_id = p_content_id
    ORDER BY version_number DESC;
END;
$$;


ALTER FUNCTION "public"."get_version_history"("p_content_type" "text", "p_content_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_workflow_history"("p_content_type" "text", "p_content_id" "uuid") RETURNS TABLE("status" "text", "changed_by" "uuid", "notes" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        h.new_status,
        h.changed_by,
        h.notes,
        h.created_at
    FROM public.content_workflow w
    JOIN public.content_workflow_history h ON h.workflow_id = w.id
    WHERE w.content_type = p_content_type
    AND w.content_id = p_content_id
    ORDER BY h.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."get_workflow_history"("p_content_type" "text", "p_content_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_governance_proposal_update"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_stake_to_refund INT;
BEGIN
    -- Check if status transitions to 'approved'
    IF OLD.status <> 'approved' AND NEW.status = 'approved' THEN
        v_stake_to_refund := NEW.stake;
        IF v_stake_to_refund > 0 THEN
            -- Refund points to user
            UPDATE user_gamification_stats
            SET points = points + v_stake_to_refund, updated_at = NOW()
            WHERE user_id = NEW.user_id;

            -- Set stake to 0 on the proposal after refunding
            NEW.stake := 0;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_governance_proposal_update"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."handle_governance_proposal_update"() IS 'Refunds staked points to the user when a proposal status changes to approved.';



CREATE OR REPLACE FUNCTION "public"."handle_message_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- For inserts and updates
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        -- Broadcast to room-specific channel
        PERFORM pg_notify(
            'room_' || NEW.room_id::text,
            json_build_object(
                'id', NEW.id,
                'sender_id', NEW.sender_id,
                'content', NEW.content,
                'token_tag', NEW.token_tag,
                'created_at', NEW.created_at,
                'room_id', NEW.room_id,
                'room_type', NEW.room_type
            )::text
        );
    END IF;
    
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."handle_message_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_message"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Notify clients about the new message
  PERFORM pg_notify(
    'messages_realtime',
    json_build_object(
      'type', 'INSERT',
      'record', row_to_json(NEW),
      'table', 'messages',
      'room_id', NEW.room_id
    )::text
  );
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_message"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_post"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM mint_points_on_action(NEW.user_id, 'post_flow', NEW.platform, NEW.id);
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_post"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
  -- For each platform, add a user_progress record
  INSERT INTO user_progress (user_id, platform, week_number, unlocked_features)
  VALUES
    (NEW.id, 'hub', 1, '{"discover": true}'),
    (NEW.id, 'ascenders', 1, '{"discover": true}'),
    (NEW.id, 'neothinkers', 1, '{"discover": true}'),
    (NEW.id, 'immortals', 1, '{"discover": true}')
  ON CONFLICT (user_id, platform) DO NOTHING;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_post_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- For inserts and updates
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        -- Broadcast to the appropriate channel based on visibility
        PERFORM pg_notify(
            CASE 
                WHEN NEW.visibility = 'public' THEN 'posts_public'
                WHEN NEW.visibility = 'premium' THEN 'posts_premium'
                WHEN NEW.visibility = 'superachiever' THEN 'posts_superachiever'
                ELSE 'posts_private'
            END,
            json_build_object(
                'id', NEW.id,
                'author_id', NEW.author_id,
                'content', NEW.content,
                'token_tag', NEW.token_tag,
                'created_at', NEW.created_at,
                'visibility', NEW.visibility
            )::text
        );
    END IF;
    
    -- For deletes
    IF (TG_OP = 'DELETE') THEN
        PERFORM pg_notify(
            'posts_deleted',
            json_build_object(
                'id', OLD.id,
                'visibility', OLD.visibility
            )::text
        );
    END IF;
    
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."handle_post_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_profile_platform_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    _tenant record;
    _old_platforms text[] := COALESCE(OLD.platforms, ARRAY[]::text[]);
    _new_platforms text[] := COALESCE(NEW.platforms, ARRAY[]::text[]);
    _added_platforms text[];
    _removed_platforms text[];
BEGIN
    -- Calculate added and removed platforms
    _added_platforms := ARRAY(
        SELECT unnest(_new_platforms)
        EXCEPT
        SELECT unnest(_old_platforms)
    );
    
    _removed_platforms := ARRAY(
        SELECT unnest(_old_platforms)
        EXCEPT
        SELECT unnest(_new_platforms)
    );
    
    -- Add user to new tenant relationships
    FOREACH _tenant IN ARRAY(SELECT * FROM public.tenants WHERE slug = ANY(_added_platforms))
    LOOP
        INSERT INTO public.tenant_users (tenant_id, user_id, role, status)
        VALUES (_tenant.id, NEW.id, 
               CASE 
                   WHEN NEW.is_guardian THEN 'admin'
                   ELSE 'member'
               END,
               'active')
        ON CONFLICT (tenant_id, user_id) 
        DO UPDATE SET 
            status = 'active',
            updated_at = now();
    END LOOP;
    
    -- Remove user from old tenant relationships
    FOREACH _tenant IN ARRAY(SELECT * FROM public.tenants WHERE slug = ANY(_removed_platforms))
    LOOP
        UPDATE public.tenant_users
        SET status = 'inactive', updated_at = now()
        WHERE tenant_id = _tenant.id AND user_id = NEW.id;
    END LOOP;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_profile_platform_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_token_update"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Notify clients about the token update
  PERFORM pg_notify(
    'token_updates',
    json_build_object(
      'type', 'UPDATE',
      'record', row_to_json(NEW),
      'table', 'token_balances',
      'user_id', NEW.user_id
    )::text
  );
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_token_update"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_active_subscription"("p_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.profiles p
        WHERE p.id = p_user_id
        AND p.subscription_status IS NOT NULL
        AND p.subscription_period_end > now()
    );
END;
$$;


ALTER FUNCTION "public"."has_active_subscription"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_content_access"("user_id" "uuid", "platform_name" "text") RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = user_id
        AND (
            is_guardian = true
            OR (
                subscription_status = 'active'
                AND subscription_period_end > now()
                AND (
                    (platform_name = 'hub' AND is_ascender)
                    OR (platform_name = 'ascender' AND is_ascender)
                    OR (platform_name = 'neothinker' AND is_neothinker)
                    OR (platform_name = 'immortal' AND is_immortal)
                )
            )
        )
    );
$$;


ALTER FUNCTION "public"."has_content_access"("user_id" "uuid", "platform_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_platform_access"("platform_slug_param" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
  -- For system-level access (admin)
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_guardian = true
  ) THEN
    RETURN true;
  END IF;

  -- Check if user has platform in their platforms array
  RETURN EXISTS (
    SELECT 1 FROM public.platform_access
    WHERE 
      user_id = auth.uid() 
      AND platform_slug = platform_slug_param
  );
END;
$$;


ALTER FUNCTION "public"."has_platform_access"("platform_slug_param" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_chat_participant"("p_room_id" "uuid", "p_user_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.chat_participants cp
        WHERE cp.room_id = p_room_id AND cp.user_id = p_user_id
    );
$$;


ALTER FUNCTION "public"."is_chat_participant"("p_room_id" "uuid", "p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_premium_subscriber"("user_uuid" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  result BOOLEAN;
BEGIN
  SELECT (subscription_tier IN ('premium', 'superachiever')) 
  AND subscription_status = 'active'
  INTO result
  FROM profiles
  WHERE id = user_uuid;
  
  RETURN COALESCE(result, FALSE);
END;
$$;


ALTER FUNCTION "public"."is_premium_subscriber"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_rate_limited"("p_email" "text", "p_ip_address" "text", "p_window_minutes" integer DEFAULT 15, "p_max_attempts" integer DEFAULT 5) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
  v_email_attempts INT;
  v_ip_attempts INT;
BEGIN
  -- Count failed attempts by email within window
  SELECT COUNT(*)
  INTO v_email_attempts
  FROM public.auth_logs
  WHERE 
    email = p_email
    AND action = 'login'
    AND status = 'failed'
    AND created_at > (now() - (p_window_minutes || ' minutes')::interval);
    
  -- Count failed attempts by IP within window
  SELECT COUNT(*)
  INTO v_ip_attempts
  FROM public.auth_logs
  WHERE 
    ip_address = p_ip_address
    AND action = 'login'
    AND status = 'failed'
    AND created_at > (now() - (p_window_minutes || ' minutes')::interval);
    
  -- Return true if either email or IP is rate limited
  RETURN (v_email_attempts >= p_max_attempts) OR (v_ip_attempts >= p_max_attempts);
END;
$$;


ALTER FUNCTION "public"."is_rate_limited"("p_email" "text", "p_ip_address" "text", "p_window_minutes" integer, "p_max_attempts" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_superachiever"("user_uuid" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  result BOOLEAN;
BEGIN
  SELECT subscription_tier = 'superachiever' 
  AND subscription_status = 'active'
  INTO result
  FROM profiles
  WHERE id = user_uuid;
  
  RETURN COALESCE(result, FALSE);
END;
$$;


ALTER FUNCTION "public"."is_superachiever"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_auth_event"("p_user_id" "uuid", "p_email" "text", "p_ip_address" "text", "p_user_agent" "text", "p_action" "text", "p_status" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.auth_logs (
    user_id,
    email,
    ip_address,
    user_agent,
    action,
    status
  ) VALUES (
    p_user_id,
    p_email,
    p_ip_address,
    p_user_agent,
    p_action,
    p_status
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;


ALTER FUNCTION "public"."log_auth_event"("p_user_id" "uuid", "p_email" "text", "p_ip_address" "text", "p_user_agent" "text", "p_action" "text", "p_status" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_error"("p_error_type" "text", "p_error_message" "text", "p_severity" "text", "p_stack_trace" "text" DEFAULT NULL::"text", "p_platform" "text" DEFAULT NULL::"text", "p_user_id" "uuid" DEFAULT NULL::"uuid", "p_context" "jsonb" DEFAULT NULL::"jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    v_id uuid;
BEGIN
    INSERT INTO public.error_logs (
        error_type,
        error_message,
        severity,
        stack_trace,
        platform,
        user_id,
        context
    ) VALUES (
        p_error_type,
        p_error_message,
        p_severity,
        p_stack_trace,
        p_platform,
        p_user_id,
        p_context
    )
    RETURNING id INTO v_id;
    
    RETURN v_id;
END;
$$;


ALTER FUNCTION "public"."log_error"("p_error_type" "text", "p_error_message" "text", "p_severity" "text", "p_stack_trace" "text", "p_platform" "text", "p_user_id" "uuid", "p_context" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."manage_content_workflow"("p_content_type" "text", "p_content_id" "uuid", "p_platform" "text", "p_status" "text", "p_assigned_to" "uuid", "p_due_date" timestamp with time zone, "p_notes" "text", "p_user_id" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    v_workflow_id uuid;
    v_previous_status text;
BEGIN
    -- Get existing workflow
    SELECT id, current_status 
    INTO v_workflow_id, v_previous_status
    FROM public.content_workflow
    WHERE content_type = p_content_type
    AND content_id = p_content_id;

    IF v_workflow_id IS NULL THEN
        -- Create new workflow
        INSERT INTO public.content_workflow (
            content_type,
            content_id,
            platform,
            current_status,
            assigned_to,
            due_date,
            review_notes
        )
        VALUES (
            p_content_type,
            p_content_id,
            p_platform,
            p_status,
            p_assigned_to,
            p_due_date,
            p_notes
        )
        RETURNING id INTO v_workflow_id;
    ELSE
        -- Update existing workflow
        UPDATE public.content_workflow
        SET current_status = p_status,
            assigned_to = p_assigned_to,
            due_date = p_due_date,
            review_notes = p_notes,
            updated_at = now()
        WHERE id = v_workflow_id;
    END IF;

    -- Record history if status changed
    IF v_previous_status IS NULL OR v_previous_status != p_status THEN
        INSERT INTO public.content_workflow_history (
            workflow_id,
            previous_status,
            new_status,
            changed_by,
            notes
        )
        VALUES (
            v_workflow_id,
            v_previous_status,
            p_status,
            p_user_id,
            p_notes
        );
    END IF;

    RETURN v_workflow_id;
END;
$$;


ALTER FUNCTION "public"."manage_content_workflow"("p_content_type" "text", "p_content_id" "uuid", "p_platform" "text", "p_status" "text", "p_assigned_to" "uuid", "p_due_date" timestamp with time zone, "p_notes" "text", "p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."map_points_to_tokens"("p_user_id" "uuid", "p_token_type" "text", "p_amount" integer) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF p_amount <= 0 THEN RETURN; END IF;

    INSERT INTO tokens (user_id, live, love, life, luck)
    VALUES (p_user_id, 0, 0, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;

    CASE p_token_type
        WHEN 'live' THEN UPDATE tokens SET live = live + p_amount, updated_at = NOW() WHERE user_id = p_user_id;
        WHEN 'love' THEN UPDATE tokens SET love = love + p_amount, updated_at = NOW() WHERE user_id = p_user_id;
        WHEN 'life' THEN UPDATE tokens SET life = life + p_amount, updated_at = NOW() WHERE user_id = p_user_id;
        WHEN 'luck' THEN UPDATE tokens SET luck = luck + p_amount, updated_at = NOW() WHERE user_id = p_user_id;
        ELSE -- Log error or handle default case
    END CASE;
END;
$$;


ALTER FUNCTION "public"."map_points_to_tokens"("p_user_id" "uuid", "p_token_type" "text", "p_amount" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."map_points_to_tokens"("p_user_id" "uuid", "p_token_type" "text", "p_amount" integer) IS 'Adds a specified amount to a users specific token balance.';



CREATE OR REPLACE FUNCTION "public"."mark_notifications_read"("p_user_id" "uuid", "p_notification_ids" "uuid"[]) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    UPDATE public.notifications
    SET 
        is_read = true,
        updated_at = now()
    WHERE user_id = p_user_id
    AND id = ANY(p_notification_ids);
END;
$$;


ALTER FUNCTION "public"."mark_notifications_read"("p_user_id" "uuid", "p_notification_ids" "uuid"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer) RETURNS TABLE("id" "uuid", "content" "text", "metadata" "jsonb", "platform" "text", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.content,
    e.metadata,
    e.platform,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM
    ai_embeddings e
  WHERE 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."migrate_platform_to_tenant"("_platform" "text", "_admin_user_id" "uuid" DEFAULT NULL::"uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    _tenant_id UUID;
    _tenant_name TEXT;
    _tenant_description TEXT;
    _user_count INTEGER;
    _migrated_users INTEGER;
    _result JSONB;
BEGIN
    -- Set default tenant name based on platform
    CASE _platform
        WHEN 'ascenders' THEN 
            _tenant_name := 'Ascenders';
            _tenant_description := 'The Ascenders platform for future-focused individuals';
        WHEN 'neothinkers' THEN 
            _tenant_name := 'NeoThinkers';
            _tenant_description := 'The NeoThinkers community for innovative thinkers';
        WHEN 'immortals' THEN 
            _tenant_name := 'Immortals';
            _tenant_description := 'The Immortals platform for longevity enthusiasts';
        WHEN 'hub' THEN 
            _tenant_name := 'NeoThink Hub';
            _tenant_description := 'The central hub for all NeoThink platforms';
        ELSE
            _tenant_name := INITCAP(_platform);
            _tenant_description := 'Migrated from ' || _platform || ' platform';
    END CASE;
    
    -- Check if tenant already exists
    SELECT id INTO _tenant_id FROM public.tenants WHERE slug = _platform;
    
    IF _tenant_id IS NULL THEN
        -- Create new tenant
        INSERT INTO public.tenants (name, slug, description, status)
        VALUES (_tenant_name, _platform, _tenant_description, 'active')
        RETURNING id INTO _tenant_id;
    END IF;
    
    -- Count users to migrate
    SELECT COUNT(*) INTO _user_count
    FROM public.profiles
    WHERE _platform = ANY(profiles.platforms) OR platforms IS NULL;
    
    -- Migrate users from the platform array to the tenant_users table
    INSERT INTO public.tenant_users (tenant_id, user_id, role, status, joined_at)
    SELECT 
        _tenant_id,
        p.id,
        CASE 
            WHEN p.is_guardian THEN 'admin'
            ELSE 'member'
        END as role,
        'active' as status,
        p.created_at as joined_at
    FROM 
        public.profiles p
    WHERE 
        _platform = ANY(p.platforms) OR p.platforms IS NULL
    ON CONFLICT (tenant_id, user_id) 
    DO NOTHING;
    
    -- Count migrated users
    GET DIAGNOSTICS _migrated_users = ROW_COUNT;
    
    -- If admin user provided, make them an admin
    IF _admin_user_id IS NOT NULL THEN
        INSERT INTO public.tenant_users (tenant_id, user_id, role, status, joined_at)
        VALUES (_tenant_id, _admin_user_id, 'admin', 'active', now())
        ON CONFLICT (tenant_id, user_id) 
        DO UPDATE SET role = 'admin', status = 'active';
    END IF;
    
    -- Create result
    _result := jsonb_build_object(
        'tenant_id', _tenant_id,
        'tenant_name', _tenant_name,
        'tenant_slug', _platform,
        'users_found', _user_count,
        'users_migrated', _migrated_users
    );
    
    RETURN _result;
END;
$$;


ALTER FUNCTION "public"."migrate_platform_to_tenant"("_platform" "text", "_admin_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."migrate_users_to_tenants"() RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    _tenant record;
    _user record;
BEGIN
    -- Loop through each tenant
    FOR _tenant IN SELECT * FROM public.tenants
    LOOP
        -- For each tenant, find users that belong to that platform
        FOR _user IN 
            SELECT p.id FROM public.profiles p
            WHERE p.platforms IS NOT NULL AND _tenant.slug = ANY(p.platforms)
        LOOP
            -- Insert into tenant_users if not already exists
            INSERT INTO public.tenant_users (tenant_id, user_id, role, status)
            VALUES (_tenant.id, _user.id, 
                   CASE 
                       WHEN (SELECT is_guardian FROM public.profiles WHERE id = _user.id) THEN 'admin'
                       ELSE 'member'
                   END,
                   'active')
            ON CONFLICT (tenant_id, user_id) DO NOTHING;
        END LOOP;
    END LOOP;
END;
$$;


ALTER FUNCTION "public"."migrate_users_to_tenants"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."mint_points_on_action"("p_user_id" "uuid", "p_action_type" "text", "p_platform" "public"."platform_slug", "p_action_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_points_to_add INT := 0;
    v_base_points INT := 1;
    v_multiplier FLOAT := 1.0;
    v_is_trial BOOLEAN := false;
    v_current_event RECORD;
    v_user_stats user_gamification_stats;
    v_user_created_at TIMESTAMPTZ;
    v_final_points INT := 0;
    v_streak_bonus BIGINT := 0;
BEGIN
    -- Check Trial
    SELECT created_at INTO v_user_created_at FROM auth.users WHERE id = p_user_id;
    IF v_user_created_at IS NOT NULL AND (NOW() - v_user_created_at) < interval '7 days' THEN
        v_is_trial := true;
    END IF;

    -- Get/Init Stats
    SELECT * INTO v_user_stats FROM user_gamification_stats WHERE user_id = p_user_id;
    IF NOT FOUND THEN
        INSERT INTO user_gamification_stats (user_id, last_active) VALUES (p_user_id, NOW()) RETURNING * INTO v_user_stats;
        -- Ensure default values are used if row was just created
        v_user_stats.streak := 0;
        v_user_stats.is_inactive := false;
        v_user_stats.last_active := NOW() - interval '2 days'; -- Set last_active to ensure streak calculation works correctly on first action
    ELSE
        -- Ensure streak/inactive/last_active are not null if user exists
        IF v_user_stats.streak IS NULL THEN v_user_stats.streak := 0; END IF;
        IF v_user_stats.is_inactive IS NULL THEN v_user_stats.is_inactive := false; END IF;
        IF v_user_stats.last_active IS NULL THEN v_user_stats.last_active := NOW() - interval '2 days'; END IF;
    END IF;

    -- Base points & multipliers
    CASE p_action_type
        WHEN 'post_flow' THEN
            v_base_points := 3;
            IF p_platform = 'hub' THEN v_multiplier := v_multiplier * 6.0; END IF;
            -- Map base points to tokens (always map base points regardless of trial status?)
            IF p_platform = 'ascenders' THEN PERFORM map_points_to_tokens(p_user_id, 'live', v_base_points);
            ELSIF p_platform = 'neothinkers' THEN PERFORM map_points_to_tokens(p_user_id, 'love', v_base_points);
            ELSIF p_platform = 'immortals' THEN PERFORM map_points_to_tokens(p_user_id, 'life', v_base_points);
            ELSE PERFORM map_points_to_tokens(p_user_id, 'luck', v_base_points);
            END IF;
        WHEN 'login' THEN v_base_points := 1;
        ELSE v_base_points := 1;
    END CASE;

    -- Apply active event multipliers (Only if user is NOT inactive)
    IF NOT v_user_stats.is_inactive THEN
        FOR v_current_event IN SELECT multiplier FROM events WHERE is_active = true AND start_time IS NOT NULL AND end_time IS NOT NULL AND NOW() BETWEEN start_time AND end_time LOOP
            v_multiplier := v_multiplier * v_current_event.multiplier;
        END LOOP;
    ELSE
        v_multiplier := 1.0; -- Reset multiplier if user is inactive
    END IF;

    -- Calculate points based on base * multiplier
    v_points_to_add := FLOOR(v_base_points * v_multiplier);

    -- Add Streak bonus (Fibonacci - non-trial, non-inactive users only)
    IF NOT v_is_trial AND NOT v_user_stats.is_inactive AND v_user_stats.streak > 0 THEN
         v_streak_bonus := fibonacci(v_user_stats.streak);
         v_points_to_add := v_points_to_add + v_streak_bonus;
    END IF;

    -- Final points adjustment for trial
    IF v_is_trial THEN
        v_final_points := 1; -- Fixed 1 point total for trial users
    ELSE
        v_final_points := v_points_to_add;
    END IF;

    -- TODO: Apply daily cap logic here or via Edge Function call (capRewards)

    -- Update user stats (Points, last_active, streak)
    UPDATE user_gamification_stats
    SET
        points = points + v_final_points,
        last_active = NOW(),
        streak = CASE
                    -- Reset streak if inactive or last activity was before yesterday
                    WHEN v_user_stats.is_inactive OR v_user_stats.last_active < date_trunc('day', NOW() - interval '1 day') THEN 1
                    -- Increment streak only if last activity was yesterday (avoid multiple increments same day)
                    WHEN v_user_stats.last_active < date_trunc('day', NOW()) THEN v_user_stats.streak + 1
                    -- Keep streak the same if activity is today
                    ELSE v_user_stats.streak
                 END,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    -- Call team update if points were added and user is not on trial/inactive
    IF v_final_points > 0 AND NOT v_is_trial AND NOT v_user_stats.is_inactive THEN
        PERFORM update_team_earnings(p_user_id, v_final_points);
    END IF;

END;
$$;


ALTER FUNCTION "public"."mint_points_on_action"("p_user_id" "uuid", "p_action_type" "text", "p_platform" "public"."platform_slug", "p_action_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."mint_points_on_action"("p_user_id" "uuid", "p_action_type" "text", "p_platform" "public"."platform_slug", "p_action_id" "uuid") IS 'v2: Calculates and awards points based on user action, platform, events, Fibonacci streaks, trial status, and inactive status. Also maps points to tokens.';



CREATE OR REPLACE FUNCTION "public"."notify_content_update"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  PERFORM pg_notify(
    'content_updates',
    json_build_object(
      'operation', TG_OP,
      'record', row_to_json(NEW),
      'timestamp', extract(epoch from now())
    )::text
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."notify_content_update"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_cross_platform"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  PERFORM pg_notify(
    'cross_platform_notifications',
    json_build_object(
      'operation', TG_OP,
      'user_id', NEW.user_id,
      'source_platform', NEW.source_platform,
      'target_platforms', NEW.target_platforms,
      'title', NEW.title,
      'timestamp', extract(epoch from now())
    )::text
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."notify_cross_platform"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_new_message"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  conversation public.conversations;
BEGIN
  SELECT * INTO conversation FROM public.conversations WHERE id = NEW.conversation_id;
  
  -- Insert a notification for the user
  IF NEW.role = 'assistant' THEN
    INSERT INTO public.notifications (
      user_id,
      app_name,
      type,
      title,
      message,
      link,
      metadata
    ) VALUES (
      conversation.user_id,
      conversation.app_name,
      'new_message',
      'New Message',
      'You have a new message from the AI assistant',
      '/chat/' || conversation.id,
      jsonb_build_object(
        'conversation_id', conversation.id,
        'message_id', NEW.id
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."notify_new_message"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_token_earnings"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Broadcast token earnings to the user's private channel
    PERFORM pg_notify(
        'token_earnings',
        json_build_object(
            'user_id', NEW.user_id,
            'token_type', CASE
                WHEN NEW.luck_balance != OLD.luck_balance THEN 'LUCK'
                WHEN NEW.live_balance != OLD.live_balance THEN 'LIVE'
                WHEN NEW.love_balance != OLD.love_balance THEN 'LOVE'
                WHEN NEW.life_balance != OLD.life_balance THEN 'LIFE'
            END,
            'amount', CASE
                WHEN NEW.luck_balance != OLD.luck_balance THEN NEW.luck_balance - OLD.luck_balance
                WHEN NEW.live_balance != OLD.live_balance THEN NEW.live_balance - OLD.live_balance
                WHEN NEW.love_balance != OLD.love_balance THEN NEW.love_balance - OLD.love_balance
                WHEN NEW.life_balance != OLD.life_balance THEN NEW.life_balance - OLD.life_balance
            END
        )::text
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."notify_token_earnings"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."process_sunday_zoom_rewards"("p_meeting_id" "text", "p_minimum_duration" integer DEFAULT 30) RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_rewards_given INTEGER := 0;
    v_attendance RECORD;
    v_multiplier INTEGER;
BEGIN
    FOR v_attendance IN
        SELECT 
            za.*,
            p.subscription_tier
        FROM zoom_attendance za
        JOIN profiles p ON za.user_id = p.id
        WHERE 
            za.meeting_id = p_meeting_id
            AND za.duration_minutes >= p_minimum_duration
            AND NOT za.reward_processed
    LOOP
        -- Determine multiplier based on subscription tier
        v_multiplier := CASE 
            WHEN v_attendance.subscription_tier = 'premium' THEN 2
            WHEN v_attendance.subscription_tier = 'superachiever' THEN 3
            ELSE 1
        END;
        
        -- Award LUCK tokens for attendance
        PERFORM award_tokens(
            v_attendance.user_id,
            'LUCK',
            5 * v_multiplier,
            'zoom',
            v_attendance.id
        );
        
        -- Mark attendance as processed
        UPDATE zoom_attendance
        SET reward_processed = true
        WHERE id = v_attendance.id;
        
        v_rewards_given := v_rewards_given + 1;
    END LOOP;
    
    RETURN v_rewards_given;
END;
$$;


ALTER FUNCTION "public"."process_sunday_zoom_rewards"("p_meeting_id" "text", "p_minimum_duration" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."process_zoom_attendance_rewards"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    r RECORD;
BEGIN
    -- This would be called by a scheduled function or external process
    -- For now we'll make it usable as a function that can be called manually
    
    FOR r IN (
        SELECT id, subscription_tier 
        FROM profiles 
        WHERE subscription_status = 'active'
    ) LOOP
        -- Award tokens based on subscription tier
        INSERT INTO token_transactions (
            user_id, 
            token_type, 
            amount, 
            source_type, 
            description
        )
        VALUES (
            r.id,
            'LIFE',
            CASE 
                WHEN r.subscription_tier = 'superachiever' THEN 50
                WHEN r.subscription_tier = 'premium' THEN 30
                ELSE 10
            END,
            'event',
            'Sunday Zoom attendance bonus'
        );
        
        -- Update LIFE balance
        UPDATE token_balances
        SET life_balance = life_balance + (
            CASE 
                WHEN r.subscription_tier = 'superachiever' THEN 50
                WHEN r.subscription_tier = 'premium' THEN 30
                ELSE 10
            END
        ),
        updated_at = now()
        WHERE user_id = r.id;
    END LOOP;
END;
$$;


ALTER FUNCTION "public"."process_zoom_attendance_rewards"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."publish_module"("content_id" "uuid", "publisher_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    is_authorized boolean;
BEGIN
    -- Check if user has publishing rights
    SELECT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = publisher_id
        AND (is_guardian = true OR is_immortal = true)
    ) INTO is_authorized;

    IF NOT is_authorized THEN
        RETURN false;
    END IF;

    -- Update module
    UPDATE public.content_modules
    SET is_published = true,
        updated_at = now()
    WHERE id = content_id;

    RETURN true;
END;
$$;


ALTER FUNCTION "public"."publish_module"("content_id" "uuid", "publisher_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."record_audit_log"("p_user_id" "uuid", "p_action" "text", "p_entity_type" "text", "p_entity_id" "uuid", "p_old_data" "jsonb", "p_new_data" "jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    v_log_id uuid;
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        entity_type,
        entity_id,
        old_data,
        new_data
    )
    VALUES (
        p_user_id,
        p_action,
        p_entity_type,
        p_entity_id,
        p_old_data,
        p_new_data
    )
    RETURNING id INTO v_log_id;

    RETURN v_log_id;
END;
$$;


ALTER FUNCTION "public"."record_audit_log"("p_user_id" "uuid", "p_action" "text", "p_entity_type" "text", "p_entity_id" "uuid", "p_old_data" "jsonb", "p_new_data" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."record_health_check"("p_check_name" "text", "p_status" "text", "p_details" "jsonb" DEFAULT NULL::"jsonb", "p_severity" "text" DEFAULT NULL::"text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    v_id uuid;
BEGIN
    INSERT INTO public.system_health_checks (
        check_name,
        status,
        details,
        severity
    ) VALUES (
        p_check_name,
        p_status,
        p_details,
        p_severity
    )
    RETURNING id INTO v_id;
    
    RETURN v_id;
END;
$$;


ALTER FUNCTION "public"."record_health_check"("p_check_name" "text", "p_status" "text", "p_details" "jsonb", "p_severity" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."record_participation"("user_id" "uuid", "platform_name" "text", "activity" "text", "points_earned" integer DEFAULT 0, "activity_metadata" "jsonb" DEFAULT '{}'::"jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    participation_id uuid;
BEGIN
    INSERT INTO public.participation (
        user_id,
        platform,
        activity_type,
        points,
        metadata
    )
    VALUES (
        user_id,
        platform_name,
        activity,
        points_earned,
        activity_metadata
    )
    RETURNING id INTO participation_id;

    RETURN participation_id;
END;
$$;


ALTER FUNCTION "public"."record_participation"("user_id" "uuid", "platform_name" "text", "activity" "text", "points_earned" integer, "activity_metadata" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."record_performance_metric"("p_metric_name" "text", "p_metric_value" numeric, "p_metric_unit" "text" DEFAULT NULL::"text", "p_platform" "text" DEFAULT NULL::"text", "p_context" "jsonb" DEFAULT NULL::"jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    v_id uuid;
BEGIN
    INSERT INTO public.performance_metrics (
        metric_name,
        metric_value,
        metric_unit,
        platform,
        context
    ) VALUES (
        p_metric_name,
        p_metric_value,
        p_metric_unit,
        p_platform,
        p_context
    )
    RETURNING id INTO v_id;
    
    RETURN v_id;
END;
$$;


ALTER FUNCTION "public"."record_performance_metric"("p_metric_name" "text", "p_metric_value" numeric, "p_metric_unit" "text", "p_platform" "text", "p_context" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."record_zoom_attendance"("p_user_id" "uuid", "p_meeting_id" "text", "p_join_time" timestamp with time zone DEFAULT "now"()) RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_attendance_id UUID;
BEGIN
    INSERT INTO zoom_attendance (
        user_id,
        meeting_id,
        join_time
    ) VALUES (
        p_user_id,
        p_meeting_id,
        p_join_time
    )
    RETURNING id INTO v_attendance_id;
    
    RETURN v_attendance_id;
END;
$$;


ALTER FUNCTION "public"."record_zoom_attendance"("p_user_id" "uuid", "p_meeting_id" "text", "p_join_time" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_materialized_views"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_user_progress_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_content_engagement_stats;
END;
$$;


ALTER FUNCTION "public"."refresh_materialized_views"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_token_history"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY token_history;
END;
$$;


ALTER FUNCTION "public"."refresh_token_history"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_token_statistics"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY token_statistics;
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."refresh_token_statistics"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."remove_user_from_tenant"("_user_id" "uuid", "_tenant_slug" "text") RETURNS boolean
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    _tenant_id UUID;
BEGIN
    -- Get the tenant ID from the slug
    SELECT id INTO _tenant_id FROM public.tenants WHERE slug = _tenant_slug;
    
    -- If tenant doesn't exist, return false
    IF _tenant_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Set user as inactive in tenant
    UPDATE public.tenant_users
    SET status = 'inactive', updated_at = now()
    WHERE tenant_id = _tenant_id AND user_id = _user_id;
    
    -- Remove platform from the user's platforms array
    UPDATE public.profiles
    SET platforms = array_remove(platforms, _tenant_slug)
    WHERE id = _user_id;
    
    RETURN TRUE;
END;
$$;


ALTER FUNCTION "public"."remove_user_from_tenant"("_user_id" "uuid", "_tenant_slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_content"("p_query" "text", "p_limit" integer DEFAULT 20, "p_offset" integer DEFAULT 0) RETURNS TABLE("content_type" "text", "content_id" "uuid", "title" "text", "description" "text", "rank" real, "metadata" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sv.content_type,
        sv.content_id,
        sv.title,
        sv.description,
        ts_rank(sv.search_vector, to_tsquery(p_query)) as rank,
        sv.metadata
    FROM public.search_vectors sv
    WHERE sv.search_vector @@ to_tsquery(p_query)
    ORDER BY ts_rank(sv.search_vector, to_tsquery(p_query)) DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;


ALTER FUNCTION "public"."search_content"("p_query" "text", "p_limit" integer, "p_offset" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_similar_content"("query_text" "text", "content_type" "text", "similarity_threshold" double precision DEFAULT 0.7, "max_results" integer DEFAULT 5) RETURNS TABLE("content_id" "uuid", "similarity" double precision)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  query_embedding vector(1536);
BEGIN
  -- In a production environment, this would use the generate_embedding function
  -- or call directly to an embedding service
  
  -- For now, we'll simulate with a placeholder
  -- This would be replaced with actual similarity search
  RETURN QUERY
  SELECT 
    e.content_id,
    0.0::FLOAT as similarity
  FROM 
    public.ai_embeddings e
  WHERE
    e.content_type = search_similar_content.content_type
  LIMIT max_results;
END;
$$;


ALTER FUNCTION "public"."search_similar_content"("query_text" "text", "content_type" "text", "similarity_threshold" double precision, "max_results" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_default_role"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
  subscriber_role_id UUID;
  tenant_id UUID;
BEGIN
  -- First, find the subscriber role ID for the main tenant (Neothinkers)
  SELECT id INTO subscriber_role_id 
  FROM tenant_roles 
  WHERE tenant_id = 'd2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d' AND slug = 'subscriber';
  
  -- Set tenant ID to Neothinkers
  tenant_id := 'd2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d';
  
  -- Create a profile for the new user
  INSERT INTO profiles (user_id, tenant_id, role_id, display_name)
  VALUES (NEW.id, tenant_id, subscriber_role_id, coalesce(NEW.raw_user_meta_data->>'name', NEW.email));
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_default_role"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."setup_default_tenant_roles"("_tenant_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    _admin_role_id UUID;
    _editor_role_id UUID;
    _viewer_role_id UUID;
    _permission_ids UUID[];
    _permission_id UUID;
BEGIN
    -- Create Admin role
    INSERT INTO public.tenant_roles (tenant_id, name, slug, description, is_system_role)
    VALUES (_tenant_id, 'Admin', 'admin', 'Full administrative access to the tenant', true)
    RETURNING id INTO _admin_role_id;
    
    -- Create Editor role
    INSERT INTO public.tenant_roles (tenant_id, name, slug, description, is_system_role)
    VALUES (_tenant_id, 'Editor', 'editor', 'Can create and edit content', true)
    RETURNING id INTO _editor_role_id;
    
    -- Create Viewer role
    INSERT INTO public.tenant_roles (tenant_id, name, slug, description, is_system_role)
    VALUES (_tenant_id, 'Viewer', 'viewer', 'Can view content only', true)
    RETURNING id INTO _viewer_role_id;
    
    -- Assign all tenant-level permissions to Admin role
    _permission_ids := ARRAY(
        SELECT id FROM public.permissions WHERE scope = 'tenant'
    );
    
    FOREACH _permission_id IN ARRAY _permission_ids
    LOOP
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (_admin_role_id, _permission_id);
    END LOOP;
    
    -- Assign content management permissions to Editor role
    _permission_ids := ARRAY(
        SELECT id FROM public.permissions 
        WHERE category = 'Content Management' 
        OR slug IN ('modules:create', 'modules:edit', 'modules:publish', 'users:profiles:view', 'users:progress:view')
    );
    
    FOREACH _permission_id IN ARRAY _permission_ids
    LOOP
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (_editor_role_id, _permission_id);
    END LOOP;
    
    -- Assign viewer permissions to Viewer role
    _permission_ids := ARRAY(
        SELECT id FROM public.permissions 
        WHERE slug IN ('content:view', 'tenant:settings:view', 'tenant:users:view', 'users:profiles:view')
    );
    
    FOREACH _permission_id IN ARRAY _permission_ids
    LOOP
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (_viewer_role_id, _permission_id);
    END LOOP;
END;
$$;


ALTER FUNCTION "public"."setup_default_tenant_roles"("_tenant_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."track_ai_analytics"("p_event_type" "text", "p_app_name" "text", "p_metrics" "jsonb", "p_metadata" "jsonb" DEFAULT '{}'::"jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  analytics_id UUID;
BEGIN
  INSERT INTO public.ai_analytics (
    event_type,
    app_name,
    user_id,
    metrics,
    metadata
  ) VALUES (
    p_event_type,
    p_app_name,
    auth.uid(),
    p_metrics,
    p_metadata
  )
  RETURNING id INTO analytics_id;
  
  RETURN analytics_id;
END;
$$;


ALTER FUNCTION "public"."track_ai_analytics"("p_event_type" "text", "p_app_name" "text", "p_metrics" "jsonb", "p_metadata" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."track_ai_usage"("p_user_id" "uuid", "p_platform" "text", "p_prompt_tokens" integer, "p_completion_tokens" integer, "p_model" "text", "p_cost" double precision DEFAULT NULL::double precision) RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  v_id uuid;
  v_total_tokens int;
  v_calculated_cost float;
BEGIN
  -- Calculate total tokens
  v_total_tokens := p_prompt_tokens + p_completion_tokens;
  
  -- Calculate cost if not provided
  IF p_cost IS NULL THEN
    -- Simple cost estimation based on model and tokens
    -- These rates should be adjusted based on actual pricing
    IF p_model LIKE 'gpt-4%' THEN
      v_calculated_cost := (p_prompt_tokens * 0.00003) + (p_completion_tokens * 0.00006);
    ELSIF p_model LIKE 'gpt-3.5%' THEN
      v_calculated_cost := (p_prompt_tokens * 0.000015) + (p_completion_tokens * 0.00002);
    ELSE
      v_calculated_cost := (v_total_tokens * 0.000015);
    END IF;
  ELSE
    v_calculated_cost := p_cost;
  END IF;
  
  -- Insert usage record
  INSERT INTO ai_usage_metrics (
    user_id,
    platform,
    model,
    prompt_tokens,
    completion_tokens,
    total_tokens,
    cost,
    created_at
  ) VALUES (
    p_user_id,
    p_platform,
    p_model,
    p_prompt_tokens,
    p_completion_tokens,
    v_total_tokens,
    v_calculated_cost,
    NOW()
  )
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$;


ALTER FUNCTION "public"."track_ai_usage"("p_user_id" "uuid", "p_platform" "text", "p_prompt_tokens" integer, "p_completion_tokens" integer, "p_model" "text", "p_cost" double precision) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."track_engagement"("user_id" "uuid", "platform_name" "text", "activity" "text", "points_earned" integer DEFAULT 0) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    INSERT INTO public.participation (
        user_id,
        platform,
        activity_type,
        points
    )
    VALUES (
        user_id,
        platform_name,
        activity,
        points_earned
    );
END;
$$;


ALTER FUNCTION "public"."track_engagement"("user_id" "uuid", "platform_name" "text", "activity" "text", "points_earned" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_conversation_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE public.conversations
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_conversation_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_learning_progress"("p_user_id" "uuid", "p_content_type" "text", "p_content_id" "uuid", "p_status" "text", "p_progress_percentage" integer, "p_metadata" "jsonb" DEFAULT NULL::"jsonb") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    INSERT INTO public.learning_progress (
        user_id,
        content_type,
        content_id,
        status,
        progress_percentage,
        metadata,
        completed_at
    ) VALUES (
        p_user_id,
        p_content_type,
        p_content_id,
        p_status,
        p_progress_percentage,
        p_metadata,
        CASE WHEN p_status = completed THEN now() ELSE NULL END
    )
    ON CONFLICT (user_id, content_type, content_id) DO UPDATE SET
        status = p_status,
        progress_percentage = p_progress_percentage,
        last_interaction_at = now(),
        metadata = p_metadata,
        completed_at = CASE WHEN p_status = completed THEN now() ELSE NULL END;
END;
$$;


ALTER FUNCTION "public"."update_learning_progress"("p_user_id" "uuid", "p_content_type" "text", "p_content_id" "uuid", "p_status" "text", "p_progress_percentage" integer, "p_metadata" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_modified_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_modified_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_progress"("user_id" "uuid", "platform_name" "text", "module_id" "uuid", "lesson_id" "uuid" DEFAULT NULL::"uuid", "new_status" "text" DEFAULT 'completed'::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    -- Update module progress
    INSERT INTO public.progress (user_id, platform, module, status)
    VALUES (user_id, platform_name, module_id::text, new_status)
    ON CONFLICT (user_id, platform, module) WHERE lesson IS NULL
    DO UPDATE SET status = new_status, updated_at = now();

    -- Update lesson progress if provided
    IF lesson_id IS NOT NULL THEN
        INSERT INTO public.progress (user_id, platform, module, lesson, status)
        VALUES (user_id, platform_name, module_id::text, lesson_id::text, new_status)
        ON CONFLICT (user_id, platform, module, lesson)
        DO UPDATE SET status = new_status, updated_at = now();
    END IF;
END;
$$;


ALTER FUNCTION "public"."update_progress"("user_id" "uuid", "platform_name" "text", "module_id" "uuid", "lesson_id" "uuid", "new_status" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_search_vector"("p_content_type" "text", "p_content_id" "uuid", "p_title" "text", "p_description" "text", "p_content" "text", "p_metadata" "jsonb" DEFAULT NULL::"jsonb") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    combined_text text;
BEGIN
    combined_text := p_title || p_description || p_content;
    
    INSERT INTO public.search_vectors (
        content_type,
        content_id,
        title,
        description,
        content,
        metadata,
        search_vector
    ) VALUES (
        p_content_type,
        p_content_id,
        p_title,
        p_description,
        p_content,
        p_metadata,
        to_tsvector(combined_text)
    )
    ON CONFLICT (content_type, content_id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        content = EXCLUDED.content,
        metadata = EXCLUDED.metadata,
        search_vector = to_tsvector(combined_text),
        updated_at = now();
END;
$$;


ALTER FUNCTION "public"."update_search_vector"("p_content_type" "text", "p_content_id" "uuid", "p_title" "text", "p_description" "text", "p_content" "text", "p_metadata" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_team_earnings"("p_user_id" "uuid", "p_points_earned" integer) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_team teams;
    v_team_size INT;
    v_boost_points FLOAT;
    v_current_points BIGINT;
BEGIN
    -- Input validation
    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'User ID cannot be null';
    END IF;
    
    IF p_points_earned <= 0 THEN 
        RETURN; 
    END IF;

    -- Find the user's team (assuming members stores UUIDs as text in a JSON array)
    SELECT t.* INTO v_team
    FROM teams t
    WHERE t.members::jsonb @> to_jsonb(p_user_id::text)
    AND NOT t.is_inactive; -- Only process for active teams

    IF NOT FOUND THEN 
        RETURN; 
    END IF;

    -- Calculate team size
    v_team_size := jsonb_array_length(v_team.members);
    IF v_team_size = 0 THEN 
        RETURN; 
    END IF;

    -- Ensure active_members is not null and valid
    v_team.active_members := COALESCE(v_team.active_members, 0);
    
    -- Calculate boost points with improved formula
    v_boost_points := 0.618 * 
                     GREATEST(v_team.active_members, 1) * -- Ensure at least 1 active member
                     (5.0 / v_team_size) * 
                     p_points_earned;

    -- Get current points safely
    v_current_points := COALESCE((v_team.earnings->>'points')::numeric, 0)::bigint;
    
    -- Update team earnings with error handling
    UPDATE teams
    SET earnings = jsonb_set(
            COALESCE(earnings, '{}'::jsonb),
            '{points}',
            to_jsonb((v_current_points + floor(v_boost_points))::bigint)
        ),
        updated_at = NOW()
    WHERE team_id = v_team.team_id
    AND NOT is_inactive; -- Additional safety check

    -- Raise notice for debugging if no rows were updated
    IF NOT FOUND THEN
        RAISE NOTICE 'No team was updated for user_id: %', p_user_id;
    END IF;

END;
$$;


ALTER FUNCTION "public"."update_team_earnings"("p_user_id" "uuid", "p_points_earned" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_activity"("p_user_id" "uuid", "p_platform" "text", "p_lessons_completed" integer, "p_modules_completed" integer, "p_points_earned" integer) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    INSERT INTO public.user_activity_stats (
        user_id,
        platform,
        activity_date,
        lessons_completed,
        modules_completed,
        points_earned,
        last_activity_at
    )
    VALUES (
        p_user_id,
        p_platform,
        current_date,
        p_lessons_completed,
        p_modules_completed,
        p_points_earned,
        now()
    )
    ON CONFLICT (user_id, platform, activity_date)
    DO UPDATE SET
        lessons_completed = user_activity_stats.lessons_completed + EXCLUDED.lessons_completed,
        modules_completed = user_activity_stats.modules_completed + EXCLUDED.modules_completed,
        points_earned = user_activity_stats.points_earned + EXCLUDED.points_earned,
        last_activity_at = EXCLUDED.last_activity_at,
        updated_at = now();
END;
$$;


ALTER FUNCTION "public"."update_user_activity"("p_user_id" "uuid", "p_platform" "text", "p_lessons_completed" integer, "p_modules_completed" integer, "p_points_earned" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_platform_for_testing"("p_user_id" "uuid", "platform_name" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    site_url_val TEXT;
    site_name_val TEXT;
    result_message TEXT;
BEGIN
    -- Set site URL and name based on platform
    CASE platform_name
        WHEN 'ascension' THEN 
            site_url_val := 'https://www.joinascenders.com';
            site_name_val := 'Ascension & Ascenders';
        WHEN 'ascenders' THEN 
            site_url_val := 'https://www.joinascenders.com';
            site_name_val := 'Ascenders';
        WHEN 'neothink' THEN 
            site_url_val := 'https://neothink.joinascenders.com';
            site_name_val := 'Neothink';
        WHEN 'neothinker' THEN 
            site_url_val := 'https://neothinker.joinascenders.com';
            site_name_val := 'Neothinker';
        WHEN 'immortal' THEN 
            site_url_val := 'https://immortal.joinascenders.com';
            site_name_val := 'Immortal';
        ELSE 
            site_url_val := 'https://www.joinascenders.com';
            site_name_val := 'Ascension & Ascenders';
    END CASE;
    
    -- Update user metadata
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_build_object(
        'sub', raw_user_meta_data->>'sub',
        'email', raw_user_meta_data->>'email',
        'platform', platform_name,
        'site_url', site_url_val,
        'site_name', site_name_val,
        'full_name', raw_user_meta_data->>'full_name',
        'email_verified', (raw_user_meta_data->>'email_verified')::boolean,
        'phone_verified', (raw_user_meta_data->>'phone_verified')::boolean
    )
    WHERE id = p_user_id;
    
    -- Update profile
    UPDATE public.profiles
    SET platform = platform_name
    WHERE id = p_user_id;
    
    -- Update privacy settings
    UPDATE public.privacy_settings
    SET platform = platform_name
    WHERE user_id = p_user_id;
    
    result_message := format('Updated user to platform %s with site URL %s and site name %s', 
                            platform_name, site_url_val, site_name_val);
    RETURN result_message;
END;
$$;


ALTER FUNCTION "public"."update_user_platform_for_testing"("p_user_id" "uuid", "platform_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_preferences"("p_user_id" "uuid", "p_platform" "text", "p_activity_type" "text", "p_activity_data" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    INSERT INTO public.user_preferences (
        user_id, platform, preference_type, preference_value, strength
    )
    SELECT 
        p_user_id,
        p_platform,
        p_activity_type,
        p_activity_data,
        1.0
    ON CONFLICT (user_id, platform, preference_type)
    DO UPDATE SET
        preference_value = 
            CASE 
                WHEN user_preferences.preference_value ? p_activity_data::text
                THEN user_preferences.preference_value
                ELSE user_preferences.preference_value || p_activity_data
            END,
        strength = user_preferences.strength + 0.1,
        updated_at = now();
END;
$$;


ALTER FUNCTION "public"."update_user_preferences"("p_user_id" "uuid", "p_platform" "text", "p_activity_type" "text", "p_activity_data" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_progress"("p_user_id" "uuid", "p_platform" "text", "p_feature" "text", "p_unlock" boolean DEFAULT true) RETURNS boolean
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
  current_features JSONB;
  current_week INTEGER;
BEGIN
  -- Get current user data
  SELECT week_number, unlocked_features INTO current_week, current_features
  FROM user_progress
  WHERE user_id = p_user_id AND platform = p_platform::platform_type;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Update the unlocked features
  IF p_unlock THEN
    current_features = jsonb_set(current_features, ARRAY[p_feature], 'true');
  ELSE
    current_features = jsonb_set(current_features, ARRAY[p_feature], 'false');
  END IF;
  
  -- Update the record
  UPDATE user_progress
  SET unlocked_features = current_features,
      last_updated = now()
  WHERE user_id = p_user_id AND platform = p_platform::platform_type;
  
  RETURN TRUE;
END;
$$;


ALTER FUNCTION "public"."update_user_progress"("p_user_id" "uuid", "p_platform" "text", "p_feature" "text", "p_unlock" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_skill"("p_user_id" "uuid", "p_skill_name" "text", "p_proficiency_level" integer) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
BEGIN
    INSERT INTO public.user_skills (
        user_id,
        skill_name,
        proficiency_level
    ) VALUES (
        p_user_id,
        p_skill_name,
        p_proficiency_level
    )
    ON CONFLICT (user_id, skill_name) DO UPDATE SET
        proficiency_level = p_proficiency_level,
        last_assessed_at = now(),
        updated_at = now();
END;
$$;


ALTER FUNCTION "public"."update_user_skill"("p_user_id" "uuid", "p_skill_name" "text", "p_proficiency_level" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_zoom_attendance"("p_attendance_id" "uuid", "p_leave_time" timestamp with time zone DEFAULT "now"()) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    UPDATE zoom_attendance
    SET 
        leave_time = p_leave_time,
        duration_minutes = EXTRACT(EPOCH FROM (p_leave_time - join_time))/60
    WHERE id = p_attendance_id;
END;
$$;


ALTER FUNCTION "public"."update_zoom_attendance"("p_attendance_id" "uuid", "p_leave_time" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_belongs_to_tenant"("_user_id" "uuid", "_tenant_slug" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    _tenant_id UUID;
    _belongs BOOLEAN;
BEGIN
    -- Get the tenant ID from the slug
    SELECT id INTO _tenant_id FROM public.tenants WHERE slug = _tenant_slug;
    
    -- If tenant doesn't exist, return false
    IF _tenant_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check if the user belongs to the tenant
    SELECT EXISTS (
        SELECT 1 FROM public.tenant_users 
        WHERE tenant_id = _tenant_id AND user_id = _user_id AND status = 'active'
    ) INTO _belongs;
    
    RETURN _belongs;
END;
$$;


ALTER FUNCTION "public"."user_belongs_to_tenant"("_user_id" "uuid", "_tenant_slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_exists"("user_email" "text") RETURNS boolean
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
  user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count
  FROM auth.users
  WHERE email = user_email;
  
  RETURN user_count > 0;
END;
$$;


ALTER FUNCTION "public"."user_exists"("user_email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_has_permission"("_user_id" "uuid", "_permission_slug" "text", "_tenant_slug" "text" DEFAULT NULL::"text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
  is_guardian BOOLEAN;
  has_permission BOOLEAN;
  tenant_id UUID;
BEGIN
  -- Check if user is a guardian
  SELECT COALESCE(is_guardian, false) INTO is_guardian
  FROM public.profiles
  WHERE id = _user_id;
  
  -- Guardians have all permissions
  IF is_guardian THEN
    RETURN true;
  END IF;
  
  -- Get tenant ID if a slug is provided
  IF _tenant_slug IS NOT NULL THEN
    SELECT id INTO tenant_id FROM public.tenants WHERE slug = _tenant_slug;
  END IF;
  
  -- Check if user has the permission through a role
  SELECT EXISTS (
    SELECT 1
    FROM public.permissions p
    JOIN public.role_permissions rp ON p.id = rp.permission_id
    JOIN public.tenant_roles tr ON rp.role_id = tr.id
    JOIN public.tenant_users tu ON tr.id = tu.tenant_role_id
    WHERE 
      p.slug = _permission_slug
      AND tu.user_id = _user_id
      AND (_tenant_slug IS NULL OR 
           (tenant_id IS NOT NULL AND tu.tenant_id = tenant_id))
  ) INTO has_permission;
  
  RETURN has_permission;
END;
$$;


ALTER FUNCTION "public"."user_has_permission"("_user_id" "uuid", "_permission_slug" "text", "_tenant_slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_has_permission"("_user_id" "uuid", "_permission_slug" "text", "_tenant_slug" "text" DEFAULT NULL::"text", "_resource_id" "text" DEFAULT NULL::"text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
    _has_permission BOOLEAN;
    _tenant_id UUID;
BEGIN
    -- Check if user is a guardian (global admin)
    SELECT is_guardian INTO _has_permission
    FROM public.profiles
    WHERE id = _user_id;
    
    -- If user is a guardian, they have all permissions
    IF _has_permission = true THEN
        RETURN true;
    END IF;
    
    -- If tenant_slug is provided, get tenant ID
    IF _tenant_slug IS NOT NULL THEN
        SELECT id INTO _tenant_id
        FROM public.tenants
        WHERE slug = _tenant_slug;
        
        -- If tenant doesn't exist, return false
        IF _tenant_id IS NULL THEN
            RETURN false;
        END IF;
        
        -- Check if user has the permission through their tenant role
        SELECT EXISTS (
            SELECT 1
            FROM public.tenant_users tu
            JOIN public.tenant_roles tr ON tu.tenant_role_id = tr.id
            JOIN public.role_permissions rp ON tr.id = rp.role_id
            JOIN public.permissions p ON rp.permission_id = p.id
            WHERE tu.user_id = _user_id
            AND tu.tenant_id = _tenant_id
            AND tu.status = 'active'
            AND p.slug = _permission_slug
        ) INTO _has_permission;
        
        -- If user has the permission through their role, return true
        IF _has_permission = true THEN
            RETURN true;
        END IF;
        
        -- Check if user is a tenant admin via the legacy 'role' field
        SELECT EXISTS (
            SELECT 1
            FROM public.tenant_users
            WHERE user_id = _user_id
            AND tenant_id = _tenant_id
            AND status = 'active'
            AND role IN ('admin', 'owner')
        ) INTO _has_permission;
        
        -- If user is a tenant admin, they have most permissions for that tenant
        IF _has_permission = true THEN
            RETURN true;
        END IF;
    END IF;
    
    -- If we've reached here, user doesn't have the permission
    RETURN false;
END;
$$;


ALTER FUNCTION "public"."user_has_permission"("_user_id" "uuid", "_permission_slug" "text", "_tenant_slug" "text", "_resource_id" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_has_platform_access"("_user_id" "uuid", "_platform_slug" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
  has_access BOOLEAN;
  is_guardian BOOLEAN;
BEGIN
  -- Exit early if no user ID provided
  IF _user_id IS NULL THEN
    RETURN false;
  END IF;

  -- Check if user is a guardian (admin)
  SELECT 
    COALESCE(is_guardian, false) INTO is_guardian
  FROM 
    public.profiles
  WHERE 
    id = _user_id;
  
  -- Guardians have access to all platforms
  IF is_guardian THEN
    RETURN true;
  END IF;
  
  -- Check platform_access table for active access
  SELECT 
    EXISTS (
      SELECT 1 
      FROM public.platform_access
      WHERE
        user_id = _user_id
        AND platform_slug = _platform_slug
        AND (expires_at IS NULL OR expires_at > now())
    ) INTO has_access;
  
  -- Return early if they have platform access
  IF has_access THEN
    RETURN true;
  END IF;
  
  -- Check tenant_users table with subquery for tenant_id mapping
  SELECT
    EXISTS (
      SELECT 1 
      FROM public.tenant_users tu
      JOIN public.tenants t ON tu.tenant_id = t.id
      WHERE
        tu.user_id = _user_id
        AND t.slug = _platform_slug
    ) INTO has_access;
  
  -- Return early if they have tenant access
  IF has_access THEN
    RETURN true;
  END IF;
  
  -- Finally, check profiles.platforms array as last resort
  SELECT
    EXISTS (
      SELECT 1 
      FROM public.profiles
      WHERE 
        id = _user_id
        AND _platform_slug = ANY(platforms)
    ) INTO has_access;
  
  RETURN has_access;
END;
$$;


ALTER FUNCTION "public"."user_has_platform_access"("_user_id" "uuid", "_platform_slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_schema"() RETURNS "text"
    LANGUAGE "plpgsql"
    SET "search_path" TO '$user', 'public', 'extensions'
    AS $$
DECLARE
  validation_result TEXT;
BEGIN
  -- Check if user_progress table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_progress') THEN
    validation_result := 'user_progress table exists. ';
  ELSE
    validation_result := 'ERROR: user_progress table missing. ';
  END IF;
  
  -- Check if analytics_events has the new columns
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'analytics_events' 
    AND column_name = 'event_category'
  ) THEN
    validation_result := validation_result || 'Analytics event columns exist. ';
  ELSE
    validation_result := validation_result || 'ERROR: Analytics event columns missing. ';
  END IF;
  
  -- Check RLS policies
  IF EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'user_progress' 
    AND policyname = 'user_progress_select_policy'
  ) THEN
    validation_result := validation_result || 'RLS policies configured. ';
  ELSE
    validation_result := validation_result || 'ERROR: RLS policies missing. ';
  END IF;
  
  RETURN validation_result;
END;
$$;


ALTER FUNCTION "public"."validate_schema"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "auth"."audit_log_entries" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "payload" "json",
    "created_at" timestamp with time zone,
    "ip_address" character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE "auth"."audit_log_entries" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."audit_log_entries" IS 'Auth: Audit trail for user actions.';



CREATE TABLE IF NOT EXISTS "auth"."flow_state" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid",
    "auth_code" "text" NOT NULL,
    "code_challenge_method" "auth"."code_challenge_method" NOT NULL,
    "code_challenge" "text" NOT NULL,
    "provider_type" "text" NOT NULL,
    "provider_access_token" "text",
    "provider_refresh_token" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "authentication_method" "text" NOT NULL,
    "auth_code_issued_at" timestamp with time zone
);


ALTER TABLE "auth"."flow_state" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."flow_state" IS 'stores metadata for pkce logins';



CREATE TABLE IF NOT EXISTS "auth"."identities" (
    "provider_id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "identity_data" "jsonb" NOT NULL,
    "provider" "text" NOT NULL,
    "last_sign_in_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "email" "text" GENERATED ALWAYS AS ("lower"(("identity_data" ->> 'email'::"text"))) STORED,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "auth"."identities" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."identities" IS 'Auth: Stores identities associated to a user.';



COMMENT ON COLUMN "auth"."identities"."email" IS 'Auth: Email is a generated column that references the optional email property in the identity_data';



CREATE TABLE IF NOT EXISTS "auth"."instances" (
    "id" "uuid" NOT NULL,
    "uuid" "uuid",
    "raw_base_config" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);


ALTER TABLE "auth"."instances" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."instances" IS 'Auth: Manages users across multiple sites.';



CREATE TABLE IF NOT EXISTS "auth"."mfa_amr_claims" (
    "session_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "authentication_method" "text" NOT NULL,
    "id" "uuid" NOT NULL
);


ALTER TABLE "auth"."mfa_amr_claims" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."mfa_amr_claims" IS 'auth: stores authenticator method reference claims for multi factor authentication';



CREATE TABLE IF NOT EXISTS "auth"."mfa_challenges" (
    "id" "uuid" NOT NULL,
    "factor_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "verified_at" timestamp with time zone,
    "ip_address" "inet" NOT NULL,
    "otp_code" "text",
    "web_authn_session_data" "jsonb"
);


ALTER TABLE "auth"."mfa_challenges" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."mfa_challenges" IS 'auth: stores metadata about challenge requests made';



CREATE TABLE IF NOT EXISTS "auth"."mfa_factors" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "friendly_name" "text",
    "factor_type" "auth"."factor_type" NOT NULL,
    "status" "auth"."factor_status" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "secret" "text",
    "phone" "text",
    "last_challenged_at" timestamp with time zone,
    "web_authn_credential" "jsonb",
    "web_authn_aaguid" "uuid"
);


ALTER TABLE "auth"."mfa_factors" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."mfa_factors" IS 'auth: stores metadata about factors';



CREATE TABLE IF NOT EXISTS "auth"."one_time_tokens" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "token_type" "auth"."one_time_token_type" NOT NULL,
    "token_hash" "text" NOT NULL,
    "relates_to" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "one_time_tokens_token_hash_check" CHECK (("char_length"("token_hash") > 0))
);


ALTER TABLE "auth"."one_time_tokens" OWNER TO "supabase_auth_admin";


CREATE TABLE IF NOT EXISTS "auth"."refresh_tokens" (
    "instance_id" "uuid",
    "id" bigint NOT NULL,
    "token" character varying(255),
    "user_id" character varying(255),
    "revoked" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "parent" character varying(255),
    "session_id" "uuid"
);


ALTER TABLE "auth"."refresh_tokens" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."refresh_tokens" IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';



CREATE SEQUENCE IF NOT EXISTS "auth"."refresh_tokens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "auth"."refresh_tokens_id_seq" OWNER TO "supabase_auth_admin";


ALTER SEQUENCE "auth"."refresh_tokens_id_seq" OWNED BY "auth"."refresh_tokens"."id";



CREATE TABLE IF NOT EXISTS "auth"."saml_providers" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "entity_id" "text" NOT NULL,
    "metadata_xml" "text" NOT NULL,
    "metadata_url" "text",
    "attribute_mapping" "jsonb",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "name_id_format" "text",
    CONSTRAINT "entity_id not empty" CHECK (("char_length"("entity_id") > 0)),
    CONSTRAINT "metadata_url not empty" CHECK ((("metadata_url" = NULL::"text") OR ("char_length"("metadata_url") > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK (("char_length"("metadata_xml") > 0))
);


ALTER TABLE "auth"."saml_providers" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."saml_providers" IS 'Auth: Manages SAML Identity Provider connections.';



CREATE TABLE IF NOT EXISTS "auth"."saml_relay_states" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "request_id" "text" NOT NULL,
    "for_email" "text",
    "redirect_to" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "flow_state_id" "uuid",
    CONSTRAINT "request_id not empty" CHECK (("char_length"("request_id") > 0))
);


ALTER TABLE "auth"."saml_relay_states" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."saml_relay_states" IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';



CREATE TABLE IF NOT EXISTS "auth"."schema_migrations" (
    "version" character varying(255) NOT NULL
);


ALTER TABLE "auth"."schema_migrations" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."schema_migrations" IS 'Auth: Manages updates to the auth system.';



CREATE TABLE IF NOT EXISTS "auth"."sessions" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "factor_id" "uuid",
    "aal" "auth"."aal_level",
    "not_after" timestamp with time zone,
    "refreshed_at" timestamp without time zone,
    "user_agent" "text",
    "ip" "inet",
    "tag" "text",
    "platform" "public"."platform_type"
);


ALTER TABLE "auth"."sessions" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."sessions" IS 'Auth: Stores session data associated to a user.';



COMMENT ON COLUMN "auth"."sessions"."not_after" IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';



CREATE TABLE IF NOT EXISTS "auth"."settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "value" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "auth"."settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "auth"."sso_domains" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "domain" "text" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK (("char_length"("domain") > 0))
);


ALTER TABLE "auth"."sso_domains" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."sso_domains" IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';



CREATE TABLE IF NOT EXISTS "auth"."sso_providers" (
    "id" "uuid" NOT NULL,
    "resource_id" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK ((("resource_id" = NULL::"text") OR ("char_length"("resource_id") > 0)))
);


ALTER TABLE "auth"."sso_providers" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."sso_providers" IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';



COMMENT ON COLUMN "auth"."sso_providers"."resource_id" IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';



CREATE TABLE IF NOT EXISTS "auth"."users" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "aud" character varying(255),
    "role" character varying(255),
    "email" character varying(255),
    "encrypted_password" character varying(255),
    "email_confirmed_at" timestamp with time zone,
    "invited_at" timestamp with time zone,
    "confirmation_token" character varying(255),
    "confirmation_sent_at" timestamp with time zone,
    "recovery_token" character varying(255),
    "recovery_sent_at" timestamp with time zone,
    "email_change_token_new" character varying(255),
    "email_change" character varying(255),
    "email_change_sent_at" timestamp with time zone,
    "last_sign_in_at" timestamp with time zone,
    "raw_app_meta_data" "jsonb",
    "raw_user_meta_data" "jsonb",
    "is_super_admin" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "phone" "text" DEFAULT NULL::character varying,
    "phone_confirmed_at" timestamp with time zone,
    "phone_change" "text" DEFAULT ''::character varying,
    "phone_change_token" character varying(255) DEFAULT ''::character varying,
    "phone_change_sent_at" timestamp with time zone,
    "confirmed_at" timestamp with time zone GENERATED ALWAYS AS (LEAST("email_confirmed_at", "phone_confirmed_at")) STORED,
    "email_change_token_current" character varying(255) DEFAULT ''::character varying,
    "email_change_confirm_status" smallint DEFAULT 0,
    "banned_until" timestamp with time zone,
    "reauthentication_token" character varying(255) DEFAULT ''::character varying,
    "reauthentication_sent_at" timestamp with time zone,
    "is_sso_user" boolean DEFAULT false NOT NULL,
    "deleted_at" timestamp with time zone,
    "is_anonymous" boolean DEFAULT false NOT NULL,
    "app_subscriptions" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "ascender_xp" integer DEFAULT 0,
    "ascender_level" integer DEFAULT 1,
    "neothinker_xp" integer DEFAULT 0,
    "neothinker_level" integer DEFAULT 1,
    "immortal_xp" integer DEFAULT 0,
    "immortal_level" integer DEFAULT 1,
    "superachiever_xp" integer DEFAULT 0,
    "superachiever_level" integer DEFAULT 1,
    "referral_code" "text",
    "referred_by" "text",
    CONSTRAINT "users_email_change_confirm_status_check" CHECK ((("email_change_confirm_status" >= 0) AND ("email_change_confirm_status" <= 2))),
    CONSTRAINT "valid_role" CHECK ((("role")::"text" = ANY ((ARRAY['user'::character varying, 'admin'::character varying])::"text"[])))
);


ALTER TABLE "auth"."users" OWNER TO "supabase_auth_admin";


COMMENT ON TABLE "auth"."users" IS 'Auth: Stores user login data within a secure schema.';



COMMENT ON COLUMN "auth"."users"."is_sso_user" IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';



COMMENT ON COLUMN "auth"."users"."ascender_xp" IS 'XP for Ascender role';



COMMENT ON COLUMN "auth"."users"."ascender_level" IS 'Level for Ascender role';



COMMENT ON COLUMN "auth"."users"."neothinker_xp" IS 'XP for Neothinker role';



COMMENT ON COLUMN "auth"."users"."neothinker_level" IS 'Level for Neothinker role';



COMMENT ON COLUMN "auth"."users"."immortal_xp" IS 'XP for Immortal role';



COMMENT ON COLUMN "auth"."users"."immortal_level" IS 'Level for Immortal role';



COMMENT ON COLUMN "auth"."users"."superachiever_xp" IS 'XP for Superachiever status';



COMMENT ON COLUMN "auth"."users"."superachiever_level" IS 'Level for Superachiever status';



COMMENT ON COLUMN "auth"."users"."referral_code" IS 'Unique referral code for user';



COMMENT ON COLUMN "auth"."users"."referred_by" IS 'Referral code of the user who referred this user';



CREATE TABLE IF NOT EXISTS "public"."achievements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "platform" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "badge_url" "text",
    "points" integer DEFAULT 0,
    "requirements" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."achievements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."activity_feed" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "platform" "text" NOT NULL,
    "activity_type" "text" NOT NULL,
    "content_type" "text",
    "content_id" "uuid",
    "metadata" "jsonb",
    "visibility" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."activity_feed" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_analytics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_type" "text" NOT NULL,
    "app_name" "text" NOT NULL,
    "user_id" "uuid",
    "metrics" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "ai_analytics_app_name_check" CHECK (("app_name" = ANY (ARRAY['hub'::"text", 'ascenders'::"text", 'immortals'::"text", 'neothinkers'::"text"])))
);


ALTER TABLE "public"."ai_analytics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_configurations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "platform_slug" "text" NOT NULL,
    "default_provider" "text" NOT NULL,
    "default_models" "jsonb" NOT NULL,
    "enabled_features" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."ai_configurations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_conversations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "platform_slug" "text" NOT NULL,
    "title" "text",
    "message_count" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."ai_conversations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_embeddings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content_id" "uuid" NOT NULL,
    "content_type" "text" NOT NULL,
    "embedding" "public"."vector"(1536),
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."ai_embeddings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "conversation_id" "uuid" NOT NULL,
    "role" "text" NOT NULL,
    "content" "text" NOT NULL,
    "token_count" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "ai_messages_role_check" CHECK (("role" = ANY (ARRAY['user'::"text", 'assistant'::"text", 'system'::"text", 'function'::"text", 'tool'::"text"])))
);


ALTER TABLE "public"."ai_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_suggestions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "app_name" "text" NOT NULL,
    "content_id" "uuid",
    "content_type" "text" NOT NULL,
    "suggestion_type" "text" NOT NULL,
    "content" "text" NOT NULL,
    "confidence" double precision NOT NULL,
    "is_applied" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "ai_suggestions_app_name_check" CHECK (("app_name" = ANY (ARRAY['hub'::"text", 'ascenders'::"text", 'immortals'::"text", 'neothinkers'::"text"]))),
    CONSTRAINT "ai_suggestions_confidence_check" CHECK ((("confidence" >= (0)::double precision) AND ("confidence" <= (1)::double precision)))
);


ALTER TABLE "public"."ai_suggestions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_usage_metrics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "platform_slug" "text" NOT NULL,
    "request_count" integer DEFAULT 0 NOT NULL,
    "token_usage" "jsonb" DEFAULT '{"total": 0, "prompt": 0, "completion": 0}'::"jsonb" NOT NULL,
    "cost" double precision DEFAULT 0 NOT NULL,
    "last_used_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."ai_usage_metrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_vector_collection_mappings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "collection_id" "uuid" NOT NULL,
    "document_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."ai_vector_collection_mappings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_vector_collections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."ai_vector_collections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_vector_documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content" "text" NOT NULL,
    "metadata" "jsonb" NOT NULL,
    "embedding" "public"."vector"(1536),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."ai_vector_documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."analytics_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "event_name" "text" NOT NULL,
    "platform" "text" NOT NULL,
    "properties" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "event_category" "text",
    "event_detail" "jsonb",
    "timestamp" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "analytics_events_platform_check" CHECK (("platform" = ANY (ARRAY['hub'::"text", 'ascenders'::"text", 'neothinkers'::"text", 'immortals'::"text"])))
);


ALTER TABLE "public"."analytics_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."analytics_metrics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "platform" "text" NOT NULL,
    "metric_key" "text" NOT NULL,
    "metric_value" numeric NOT NULL,
    "dimension_values" "jsonb",
    "measured_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."analytics_metrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."analytics_reports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "platform" "text" NOT NULL,
    "report_type" "text" NOT NULL,
    "parameters" "jsonb",
    "report_data" "jsonb",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."analytics_reports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."analytics_summaries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "platform" "text" NOT NULL,
    "summary_type" "text" NOT NULL,
    "time_period" "text" NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date" NOT NULL,
    "metrics" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."analytics_summaries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ascenders_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "level" integer DEFAULT 1,
    "preferences" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."ascenders_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "action" "text" NOT NULL,
    "entity_type" "text" NOT NULL,
    "entity_id" "uuid",
    "old_data" "jsonb",
    "new_data" "jsonb",
    "ip_address" "text",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."auth_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "action" "text" NOT NULL,
    "platform" "text",
    "path" "text",
    "ip_address" "text",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "details" "jsonb"
);


ALTER TABLE "public"."auth_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."badge_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "badge_id" "uuid",
    "event_type" "text" NOT NULL,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "simulation_run_id" "text"
);


ALTER TABLE "public"."badge_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."badges" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "role" "text",
    "criteria" "jsonb",
    "nft_url" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."badges" OWNER TO "postgres";


COMMENT ON TABLE "public"."badges" IS 'Defines badge types, criteria, and NFT support.';



CREATE TABLE IF NOT EXISTS "public"."census_snapshots" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "scope" "text" NOT NULL,
    "scope_id" "uuid",
    "population" integer NOT NULL,
    "assets" numeric,
    "activity_count" integer,
    "snapshot_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "metadata" "jsonb",
    "simulation_run_id" "text"
);


ALTER TABLE "public"."census_snapshots" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "app_name" "text" NOT NULL,
    "message" "text" NOT NULL,
    "role" "text" NOT NULL,
    "embedding" "public"."vector"(1536),
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "chat_history_app_name_check" CHECK (("app_name" = ANY (ARRAY['hub'::"text", 'ascenders'::"text", 'immortals'::"text", 'neothinkers'::"text"]))),
    CONSTRAINT "chat_history_role_check" CHECK (("role" = ANY (ARRAY['user'::"text", 'assistant'::"text"])))
);


ALTER TABLE "public"."chat_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "conversation_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "role" "text" NOT NULL,
    "content" "text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "chat_messages_role_check" CHECK (("role" = ANY (ARRAY['user'::"text", 'assistant'::"text", 'system'::"text"])))
);

ALTER TABLE ONLY "public"."chat_messages" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_participants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "room_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."chat_participants" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_participants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_rooms" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text",
    "is_group" boolean DEFAULT false,
    "platform" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."chat_rooms" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."collaboration_bonuses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "group_action_id" "uuid",
    "user_id" "uuid",
    "bonus_amount" numeric NOT NULL,
    "awarded_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."collaboration_bonuses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."collaborative_challenges" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "instructions" "text" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "max_participants" integer,
    "current_participants" integer DEFAULT 0,
    "status" "text" DEFAULT 'upcoming'::"text"
);


ALTER TABLE "public"."collaborative_challenges" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."community_features" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "platform" "text" NOT NULL,
    "type" "text" NOT NULL,
    "access_level" "text" NOT NULL,
    "enabled" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."community_features" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."concept_relationships" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "source_concept_id" "uuid" NOT NULL,
    "target_concept_id" "uuid" NOT NULL,
    "relationship_type" "text" NOT NULL,
    "relationship_strength" integer NOT NULL,
    "explanation" "text"
);


ALTER TABLE "public"."concept_relationships" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."concepts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "category" "text" NOT NULL,
    "importance_level" integer NOT NULL,
    "prerequisite_concepts" "text"[],
    "related_concepts" "text"[],
    "application_examples" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "tenant_slug" "text" NOT NULL,
    "author_id" "uuid"
);


ALTER TABLE "public"."concepts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."content" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text",
    "content" "text",
    "platform" "text" NOT NULL,
    "route" "text" NOT NULL,
    "subroute" "text",
    "content_data" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."content" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."content_categories" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."content_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."content_content_tags" (
    "content_id" "uuid" NOT NULL,
    "tag_id" "uuid" NOT NULL
);


ALTER TABLE "public"."content_content_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."content_dependencies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content_type" "text" NOT NULL,
    "content_id" "uuid" NOT NULL,
    "depends_on_type" "text" NOT NULL,
    "depends_on_id" "uuid" NOT NULL,
    "dependency_type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."content_dependencies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."content_modules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "platform" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "order_index" integer,
    "is_published" boolean DEFAULT false,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."content_modules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."content_schedule" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content_type" "text" NOT NULL,
    "content_id" "uuid" NOT NULL,
    "platform" "text" NOT NULL,
    "publish_at" timestamp with time zone NOT NULL,
    "unpublish_at" timestamp with time zone,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "status" "text"
);


ALTER TABLE "public"."content_schedule" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."content_similarity" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content_type" "text" NOT NULL,
    "content_id" "uuid" NOT NULL,
    "similar_content_type" "text" NOT NULL,
    "similar_content_id" "uuid" NOT NULL,
    "similarity_score" numeric NOT NULL,
    "similarity_factors" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."content_similarity" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."content_tags" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."content_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."content_versions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content_type" "text" NOT NULL,
    "content_id" "uuid" NOT NULL,
    "version_number" integer NOT NULL,
    "title" "text",
    "content" "text",
    "description" "text",
    "metadata" "jsonb",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "status" "text",
    "review_notes" "text",
    "reviewed_by" "uuid",
    "reviewed_at" timestamp with time zone
);


ALTER TABLE "public"."content_versions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."content_workflow" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content_type" "text" NOT NULL,
    "content_id" "uuid" NOT NULL,
    "platform" "text" NOT NULL,
    "current_status" "text" NOT NULL,
    "assigned_to" "uuid",
    "review_notes" "text",
    "due_date" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."content_workflow" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."content_workflow_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workflow_id" "uuid",
    "previous_status" "text",
    "new_status" "text" NOT NULL,
    "changed_by" "uuid",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."content_workflow_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."conversations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "app_name" "text" NOT NULL,
    "title" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "conversations_app_name_check" CHECK (("app_name" = ANY (ARRAY['hub'::"text", 'ascenders'::"text", 'immortals'::"text", 'neothinkers'::"text"])))
);


ALTER TABLE "public"."conversations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."courses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "platform" "text" NOT NULL,
    "section" "text" NOT NULL,
    "cover_image" "text",
    "duration_minutes" integer,
    "level" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."courses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."crowdfunding" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "team_id" "uuid",
    "proposal_id" "uuid",
    "user_id" "uuid",
    "amount" numeric NOT NULL,
    "contributed_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."crowdfunding" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."csrf_tokens" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "token_hash" "text" NOT NULL,
    "user_id" "uuid",
    "user_agent" "text",
    "expires_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."csrf_tokens" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."data_transfer_logs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "operation_type" character varying(20) NOT NULL,
    "file_name" character varying(255),
    "file_size" integer,
    "format" character varying(20),
    "status" character varying(20) DEFAULT 'processing'::character varying,
    "error_message" "text",
    "record_count" integer,
    "data_types" character varying[] NOT NULL,
    "started_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp with time zone,
    "metadata" "jsonb",
    CONSTRAINT "data_transfer_logs_operation_type_check" CHECK ((("operation_type")::"text" = ANY ((ARRAY['import'::character varying, 'export'::character varying])::"text"[]))),
    CONSTRAINT "data_transfer_logs_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['processing'::character varying, 'completed'::character varying, 'failed'::character varying])::"text"[])))
);


ALTER TABLE "public"."data_transfer_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."discussion_posts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "topic_id" "uuid" NOT NULL,
    "parent_post_id" "uuid",
    "user_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "upvotes" integer DEFAULT 0,
    "downvotes" integer DEFAULT 0,
    "related_concepts" "text"[],
    "tenant_slug" "text" NOT NULL
);


ALTER TABLE "public"."discussion_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."discussion_topics" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "category" "text" NOT NULL,
    "tags" "text"[],
    "status" "text",
    "tenant_slug" "text" NOT NULL,
    "route" "text"
);


ALTER TABLE "public"."discussion_topics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."documentation" (
    "id" integer NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."documentation" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."documentation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."documentation_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."documentation_id_seq" OWNED BY "public"."documentation"."id";



CREATE TABLE IF NOT EXISTS "public"."error_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "error_type" "text" NOT NULL,
    "error_message" "text" NOT NULL,
    "stack_trace" "text",
    "context" "jsonb",
    "timestamp" timestamp with time zone DEFAULT "now"(),
    "severity" "text" NOT NULL,
    "platform" "text",
    "user_id" "uuid",
    "resolved" boolean DEFAULT false,
    "resolution_notes" "text"
);


ALTER TABLE "public"."error_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_attendees" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "status" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."event_attendees" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_registrations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "event_id" "uuid" NOT NULL,
    "registered_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."event_registrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "host_id" "uuid" NOT NULL,
    "platform" "text" NOT NULL,
    "section" "text",
    "event_type" "text" NOT NULL,
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "location" "text",
    "meeting_link" "text",
    "max_attendees" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "route" "text"
);


ALTER TABLE "public"."events" OWNER TO "postgres";


COMMENT ON TABLE "public"."events" IS 'Defines special events that can modify points multipliers or thresholds.';



CREATE TABLE IF NOT EXISTS "public"."feature_flags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "platform" "text" NOT NULL,
    "feature_key" "text" NOT NULL,
    "is_enabled" boolean NOT NULL,
    "config" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."feature_flags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."feedback" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "app_name" "text" NOT NULL,
    "content" "text" NOT NULL,
    "sentiment" double precision,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "public"."feedback_status" DEFAULT 'pending'::"public"."feedback_status" NOT NULL,
    CONSTRAINT "feedback_app_name_check" CHECK (("app_name" = ANY (ARRAY['hub'::"text", 'ascenders'::"text", 'immortals'::"text", 'neothinkers'::"text"]))),
    CONSTRAINT "feedback_sentiment_check" CHECK ((("sentiment" >= ('-1.0'::numeric)::double precision) AND ("sentiment" <= (1.0)::double precision)))
)
PARTITION BY LIST ("app_name");


ALTER TABLE "public"."feedback" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."feedback_ascenders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "app_name" "text" NOT NULL,
    "content" "text" NOT NULL,
    "sentiment" double precision,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "public"."feedback_status" DEFAULT 'pending'::"public"."feedback_status" NOT NULL,
    CONSTRAINT "feedback_app_name_check" CHECK (("app_name" = ANY (ARRAY['hub'::"text", 'ascenders'::"text", 'immortals'::"text", 'neothinkers'::"text"]))),
    CONSTRAINT "feedback_sentiment_check" CHECK ((("sentiment" >= ('-1.0'::numeric)::double precision) AND ("sentiment" <= (1.0)::double precision)))
);


ALTER TABLE "public"."feedback_ascenders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."feedback_hub" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "app_name" "text" NOT NULL,
    "content" "text" NOT NULL,
    "sentiment" double precision,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "public"."feedback_status" DEFAULT 'pending'::"public"."feedback_status" NOT NULL,
    CONSTRAINT "feedback_app_name_check" CHECK (("app_name" = ANY (ARRAY['hub'::"text", 'ascenders'::"text", 'immortals'::"text", 'neothinkers'::"text"]))),
    CONSTRAINT "feedback_sentiment_check" CHECK ((("sentiment" >= ('-1.0'::numeric)::double precision) AND ("sentiment" <= (1.0)::double precision)))
);


ALTER TABLE "public"."feedback_hub" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."feedback_immortals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "app_name" "text" NOT NULL,
    "content" "text" NOT NULL,
    "sentiment" double precision,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "public"."feedback_status" DEFAULT 'pending'::"public"."feedback_status" NOT NULL,
    CONSTRAINT "feedback_app_name_check" CHECK (("app_name" = ANY (ARRAY['hub'::"text", 'ascenders'::"text", 'immortals'::"text", 'neothinkers'::"text"]))),
    CONSTRAINT "feedback_sentiment_check" CHECK ((("sentiment" >= ('-1.0'::numeric)::double precision) AND ("sentiment" <= (1.0)::double precision)))
);


ALTER TABLE "public"."feedback_immortals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."feedback_neothinkers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "app_name" "text" NOT NULL,
    "content" "text" NOT NULL,
    "sentiment" double precision,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "public"."feedback_status" DEFAULT 'pending'::"public"."feedback_status" NOT NULL,
    CONSTRAINT "feedback_app_name_check" CHECK (("app_name" = ANY (ARRAY['hub'::"text", 'ascenders'::"text", 'immortals'::"text", 'neothinkers'::"text"]))),
    CONSTRAINT "feedback_sentiment_check" CHECK ((("sentiment" >= ('-1.0'::numeric)::double precision) AND ("sentiment" <= (1.0)::double precision)))
);


ALTER TABLE "public"."feedback_neothinkers" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."feedback_trends" AS
 SELECT "f"."app_name",
    COALESCE("p"."role", 'unknown'::character varying) AS "user_role",
    "date_trunc"('day'::"text", "f"."created_at") AS "feedback_date",
    "count"(*) AS "feedback_count",
    "count"(DISTINCT "f"."user_id") AS "unique_users",
    "avg"("length"("f"."content")) AS "avg_content_length",
    "jsonb_agg"(DISTINCT "f"."metadata") FILTER (WHERE ("f"."metadata" IS NOT NULL)) AS "metadata_summary"
   FROM ("public"."feedback" "f"
     LEFT JOIN "auth"."users" "p" ON (("f"."user_id" = "p"."id")))
  WHERE ("f"."created_at" > ("now"() - '90 days'::interval))
  GROUP BY "f"."app_name", "p"."role", ("date_trunc"('day'::"text", "f"."created_at"))
  ORDER BY ("date_trunc"('day'::"text", "f"."created_at")) DESC, "f"."app_name";


ALTER TABLE "public"."feedback_trends" OWNER TO "postgres";


COMMENT ON VIEW "public"."feedback_trends" IS 'Provides aggregated feedback metrics by app, role, and date for the last 90 days';



CREATE TABLE IF NOT EXISTS "public"."fibonacci_token_rewards" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "action_id" "uuid",
    "team_id" "uuid",
    "tokens_awarded" numeric NOT NULL,
    "reward_type" "text" NOT NULL,
    "awarded_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "simulation_run_id" "text"
);


ALTER TABLE "public"."fibonacci_token_rewards" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."flow_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "template_data" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."flow_templates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."gamification_events" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "persona" "text" NOT NULL,
    "site" "text" NOT NULL,
    "event_type" "text" NOT NULL,
    "token_type" "text" NOT NULL,
    "amount" numeric NOT NULL,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "simulation_run_id" "text",
    CONSTRAINT "gamification_events_amount_check" CHECK (("amount" >= (0)::numeric)),
    CONSTRAINT "gamification_events_token_type_check" CHECK (("token_type" = ANY (ARRAY['LIVE'::"text", 'LOVE'::"text", 'LIFE'::"text", 'LUCK'::"text"])))
);


ALTER TABLE "public"."gamification_events" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."gamification_events_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."gamification_events_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."gamification_events_id_seq" OWNED BY "public"."gamification_events"."id";



CREATE TABLE IF NOT EXISTS "public"."governance_proposals" (
    "proposal_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text" NOT NULL,
    "stake" integer DEFAULT 0 NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "council_term" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "governance_proposals_stake_check" CHECK (("stake" >= 0))
);


ALTER TABLE "public"."governance_proposals" OWNER TO "postgres";


COMMENT ON TABLE "public"."governance_proposals" IS 'Stores governance proposals submitted by users.';



CREATE TABLE IF NOT EXISTS "public"."group_actions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "team_id" "uuid",
    "action_type" "text" NOT NULL,
    "performed_by" "uuid",
    "metadata" "jsonb",
    "performed_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."group_actions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."health_integrations" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "provider" character varying(50) NOT NULL,
    "provider_user_id" character varying(255),
    "access_token" "text",
    "refresh_token" "text",
    "token_expires_at" timestamp with time zone,
    "is_active" boolean DEFAULT true,
    "metadata" "jsonb",
    "last_sync" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."health_integrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."health_metrics" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "integration_id" "uuid",
    "metric_type" character varying(50) NOT NULL,
    "value" numeric(10,2) NOT NULL,
    "unit" character varying(20) NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    "source" character varying(50) NOT NULL,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."health_metrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hub_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "preferences" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."hub_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."immortals_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "level" integer DEFAULT 1,
    "preferences" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."immortals_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."integration_settings" (
    "user_id" "uuid" NOT NULL,
    "auto_sync" boolean DEFAULT true,
    "sync_frequency" character varying(20) DEFAULT 'daily'::character varying,
    "notify_on_sync" boolean DEFAULT true,
    "include_in_reports" boolean DEFAULT true,
    "last_updated" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "integration_settings_sync_frequency_check" CHECK ((("sync_frequency")::"text" = ANY ((ARRAY['hourly'::character varying, 'daily'::character varying, 'weekly'::character varying, 'manual'::character varying])::"text"[])))
);


ALTER TABLE "public"."integration_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."journal_entries" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "entry_type" "text" NOT NULL,
    "tags" "text"[],
    "related_concepts" "text"[],
    "related_exercises" "text"[],
    "favorite" boolean DEFAULT false,
    "is_public" boolean DEFAULT false,
    "tenant_slug" "text" NOT NULL
);

ALTER TABLE ONLY "public"."journal_entries" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."journal_entries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."learning_path_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "path_id" "uuid",
    "content_type" "text" NOT NULL,
    "content_id" "uuid" NOT NULL,
    "order_index" integer NOT NULL,
    "required" boolean DEFAULT true,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."learning_path_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."learning_paths" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "platform" "text" NOT NULL,
    "path_name" "text" NOT NULL,
    "description" "text",
    "difficulty_level" "text",
    "prerequisites" "jsonb",
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."learning_paths" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."learning_progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "content_type" "text" NOT NULL,
    "content_id" "uuid" NOT NULL,
    "status" "text" NOT NULL,
    "progress_percentage" integer DEFAULT 0,
    "started_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp with time zone,
    "last_interaction_at" timestamp with time zone DEFAULT "now"(),
    "metadata" "jsonb"
);


ALTER TABLE "public"."learning_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."learning_recommendations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "content_type" "text" NOT NULL,
    "content_id" "uuid" NOT NULL,
    "relevance_score" numeric NOT NULL,
    "recommendation_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone
);


ALTER TABLE "public"."learning_recommendations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lessons" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "module_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "content" "text",
    "order_index" integer,
    "is_published" boolean DEFAULT false,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."lessons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."login_attempts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "ip_address" "text" NOT NULL,
    "attempt_count" integer DEFAULT 1,
    "last_attempt" timestamp with time zone DEFAULT "now"(),
    "locked_until" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."login_attempts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mark_hamilton_content" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "content_type" "text" NOT NULL,
    "content_data" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."mark_hamilton_content" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "room_id" "uuid" NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "is_read" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "token_tag" "text",
    "reward_processed" boolean DEFAULT false,
    "room_type" "text",
    CONSTRAINT "messages_token_tag_check" CHECK (("token_tag" = ANY (ARRAY['LUCK'::"text", 'LIVE'::"text", 'LOVE'::"text", 'LIFE'::"text"])))
);

ALTER TABLE ONLY "public"."messages" REPLICA IDENTITY FULL;


ALTER TABLE "public"."messages" OWNER TO "postgres";


COMMENT ON TABLE "public"."messages" IS 'schema_version=1,publication_id=messages_realtime';



CREATE TABLE IF NOT EXISTS "public"."modules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "course_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "sequence_order" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."modules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."neothinkers_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "level" integer DEFAULT 1,
    "preferences" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."neothinkers_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notification_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "platform" "text" NOT NULL,
    "email_enabled" boolean DEFAULT true,
    "push_enabled" boolean DEFAULT true,
    "in_app_enabled" boolean DEFAULT true,
    "preferences" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."notification_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notification_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "platform" "text" NOT NULL,
    "template_key" "text" NOT NULL,
    "title_template" "text" NOT NULL,
    "body_template" "text" NOT NULL,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."notification_templates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "platform" "text" NOT NULL,
    "title" "text" NOT NULL,
    "body" "text" NOT NULL,
    "metadata" "jsonb",
    "is_read" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "type" "text",
    "priority" "text",
    "target_platforms" "text"[],
    CONSTRAINT "notifications_priority_check" CHECK (("priority" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text", 'urgent'::"text"])))
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."participation" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "platform" "text" NOT NULL,
    "activity_type" "text" NOT NULL,
    "points" integer DEFAULT 0,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."participation" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."performance_metrics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "metric_name" "text" NOT NULL,
    "metric_value" numeric NOT NULL,
    "metric_unit" "text",
    "timestamp" timestamp with time zone DEFAULT "now"(),
    "context" "jsonb",
    "platform" "text"
);


ALTER TABLE "public"."performance_metrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."permissions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "category" "text",
    "scope" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."platform_access" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "platform_slug" "text" NOT NULL,
    "access_level" "text",
    "granted_at" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone,
    "granted_by" "uuid"
);


ALTER TABLE "public"."platform_access" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."platform_customization" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "platform" "text" NOT NULL,
    "component_key" "text" NOT NULL,
    "customization" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."platform_customization" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."platform_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "platform" "text" NOT NULL,
    "settings" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."platform_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."platform_state" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "platform" "text" NOT NULL,
    "key" "text" NOT NULL,
    "value" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."platform_state" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."popular_searches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "query" "text" NOT NULL,
    "total_searches" integer DEFAULT 1,
    "successful_searches" integer DEFAULT 0,
    "last_used_at" timestamp with time zone DEFAULT "now"(),
    "platform" "text"
);


ALTER TABLE "public"."popular_searches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."post_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "author_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."post_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."post_likes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."post_likes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."post_reactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "reaction_type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "post_reactions_reaction_type_check" CHECK (("reaction_type" = ANY (ARRAY['like'::"text", 'love'::"text", 'celebrate'::"text", 'insightful'::"text"])))
);


ALTER TABLE "public"."post_reactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "author_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "platform" "text" NOT NULL,
    "section" "text",
    "is_pinned" boolean DEFAULT false,
    "engagement_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "token_tag" "text",
    "reward_processed" boolean DEFAULT false,
    "visibility" "text" DEFAULT 'public'::"text" NOT NULL,
    CONSTRAINT "posts_token_tag_check" CHECK (("token_tag" = ANY (ARRAY['LUCK'::"text", 'LIVE'::"text", 'LOVE'::"text", 'LIFE'::"text"]))),
    CONSTRAINT "posts_visibility_check" CHECK (("visibility" = ANY (ARRAY['public'::"text", 'premium'::"text", 'superachiever'::"text", 'private'::"text"])))
);

ALTER TABLE ONLY "public"."posts" REPLICA IDENTITY FULL;


ALTER TABLE "public"."posts" OWNER TO "postgres";


COMMENT ON TABLE "public"."posts" IS 'Stores user posts across different platforms.';



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "bio" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "is_ascender" boolean DEFAULT false,
    "is_neothinker" boolean DEFAULT false,
    "is_immortal" boolean DEFAULT false,
    "is_guardian" boolean DEFAULT false,
    "guardian_since" timestamp with time zone,
    "subscription_status" "text",
    "subscription_tier" "text",
    "subscription_period_start" timestamp with time zone,
    "subscription_period_end" timestamp with time zone,
    "platforms" "text"[] DEFAULT ARRAY[]::"text"[],
    "subscribed_platforms" "text"[] DEFAULT '{}'::"text"[],
    "role" "text" DEFAULT 'user'::"text"
);

ALTER TABLE ONLY "public"."profiles" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."proposals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "team_id" "uuid",
    "created_by" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "proposal_type" "text" NOT NULL,
    "status" "text" DEFAULT 'open'::"text" NOT NULL,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."proposals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rate_limits" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "identifier" "text" NOT NULL,
    "count" integer DEFAULT 1 NOT NULL,
    "window_start" timestamp with time zone DEFAULT "now"() NOT NULL,
    "window_seconds" integer DEFAULT 60 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."rate_limits" OWNER TO "postgres";


COMMENT ON TABLE "public"."rate_limits" IS 'Stores rate limiting data for API endpoints';



CREATE OR REPLACE VIEW "public"."recent_posts_view" AS
 SELECT "p"."id",
    "p"."content",
    "p"."author_id",
    "p"."platform",
    "p"."section",
    "p"."is_pinned",
    "p"."engagement_count",
    "p"."created_at",
    "p"."token_tag",
    "prof"."full_name",
    "prof"."avatar_url"
   FROM ("public"."posts" "p"
     LEFT JOIN "public"."profiles" "prof" ON (("p"."author_id" = "prof"."id")))
  ORDER BY "p"."created_at" DESC;


ALTER TABLE "public"."recent_posts_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."referral_bonuses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "referrer_id" "uuid",
    "referred_id" "uuid",
    "bonus_amount" numeric NOT NULL,
    "awarded_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."referral_bonuses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."referrals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "referrer_id" "uuid",
    "referred_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."referrals" OWNER TO "postgres";


COMMENT ON TABLE "public"."referrals" IS 'Tracks user referrals for XP and rewards.';



CREATE TABLE IF NOT EXISTS "public"."resources" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "platform" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "resource_type" "text" NOT NULL,
    "url" "text",
    "content" "text",
    "is_published" boolean DEFAULT false,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."resources" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."role_capabilities" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "role_slug" "text" NOT NULL,
    "feature_name" "text" NOT NULL,
    "can_view" boolean DEFAULT false,
    "can_create" boolean DEFAULT false,
    "can_edit" boolean DEFAULT false,
    "can_delete" boolean DEFAULT false,
    "can_approve" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."role_capabilities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."role_permissions" (
    "role_id" "uuid" NOT NULL,
    "permission_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."role_permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."room_participants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "room_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "joined_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "role" "text" DEFAULT 'member'::"text" NOT NULL,
    CONSTRAINT "room_participants_role_check" CHECK (("role" = ANY (ARRAY['owner'::"text", 'moderator'::"text", 'member'::"text"])))
);


ALTER TABLE "public"."room_participants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rooms" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "room_type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    CONSTRAINT "rooms_room_type_check" CHECK (("room_type" = ANY (ARRAY['public'::"text", 'premium'::"text", 'superachiever'::"text", 'private'::"text"])))
);


ALTER TABLE "public"."rooms" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schema_version" (
    "version" integer NOT NULL,
    "applied_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schema_version" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."search_analytics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "query" "text" NOT NULL,
    "filters" "jsonb",
    "results_count" integer,
    "selected_result" "jsonb",
    "session_id" "uuid",
    "platform" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."search_analytics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."search_suggestions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trigger_term" "text" NOT NULL,
    "suggestion" "text" NOT NULL,
    "weight" numeric DEFAULT 1.0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."search_suggestions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."search_vectors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content_type" "text" NOT NULL,
    "content_id" "uuid" NOT NULL,
    "title" "text",
    "description" "text",
    "content" "text",
    "tags" "text"[],
    "metadata" "jsonb",
    "search_vector" "tsvector",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."search_vectors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."security_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_type" "text" NOT NULL,
    "severity" "text" NOT NULL,
    "user_id" "uuid",
    "ip_address" "text",
    "user_agent" "text",
    "request_path" "text",
    "request_method" "text",
    "platform_slug" "text",
    "context" "jsonb" DEFAULT '{}'::"jsonb",
    "details" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."security_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."security_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_type" "text" NOT NULL,
    "severity" "text" NOT NULL,
    "context" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "details" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "ip_address" "text",
    "user_agent" "text",
    "user_id" "uuid",
    "platform" "text",
    "timestamp" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "security_logs_severity_check" CHECK (("severity" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text", 'critical'::"text"])))
);


ALTER TABLE "public"."security_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."shared_content" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "content" "jsonb" NOT NULL,
    "category_id" "uuid",
    "author_id" "uuid",
    "is_published" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."shared_content" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."site_settings" (
    "site" "text" NOT NULL,
    "base_reward" numeric DEFAULT 100 NOT NULL,
    "collab_bonus" numeric DEFAULT 25 NOT NULL,
    "streak_bonus" numeric DEFAULT 50 NOT NULL,
    "diminishing_threshold" numeric DEFAULT 1000 NOT NULL,
    "conversion_rates" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."site_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."skill_requirements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content_type" "text" NOT NULL,
    "content_id" "uuid" NOT NULL,
    "skill_name" "text" NOT NULL,
    "required_level" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."skill_requirements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."social_interactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "activity_id" "uuid",
    "interaction_type" "text" NOT NULL,
    "comment_text" "text",
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."social_interactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."supplements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "benefits" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."supplements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."suspicious_activities" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "activity_type" "text" NOT NULL,
    "severity" "text" NOT NULL,
    "ip_address" "text",
    "user_agent" "text",
    "location_data" "jsonb",
    "context" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."suspicious_activities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."system_alerts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "alert_type" "text" NOT NULL,
    "message" "text" NOT NULL,
    "severity" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "resolved_at" timestamp with time zone,
    "resolution_notes" "text",
    "notification_sent" boolean DEFAULT false,
    "context" "jsonb"
);


ALTER TABLE "public"."system_alerts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."system_health_checks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "check_name" "text" NOT NULL,
    "status" "text" NOT NULL,
    "last_check_time" timestamp with time zone DEFAULT "now"(),
    "next_check_time" timestamp with time zone,
    "check_duration" interval,
    "details" "jsonb",
    "severity" "text"
);


ALTER TABLE "public"."system_health_checks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."team_memberships" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "team_id" "uuid",
    "user_id" "uuid",
    "joined_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."team_memberships" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."teams" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_by" "uuid" NOT NULL,
    "governance_model" "text" DEFAULT 'founder'::"text",
    "mission" "text",
    "admission_criteria" "text",
    "virtual_capital" "text",
    "physical_footprint" "jsonb",
    "census_data" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."teams" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tenant_api_keys" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "api_key" "text" NOT NULL,
    "api_secret" "text" NOT NULL,
    "scopes" "text"[],
    "status" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid",
    "last_used_at" timestamp with time zone
);


ALTER TABLE "public"."tenant_api_keys" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tenant_domains" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "domain" "text" NOT NULL,
    "is_primary" boolean DEFAULT false,
    "is_verified" boolean DEFAULT false,
    "verification_token" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tenant_domains" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tenant_roles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "is_system_role" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "priority" integer DEFAULT 0,
    "role_category" "text" DEFAULT 'member'::"text"
);


ALTER TABLE "public"."tenant_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tenant_shared_content" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "content_id" "uuid" NOT NULL,
    "is_featured" boolean DEFAULT false,
    "display_order" integer DEFAULT 0,
    "tenant_specific_settings" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tenant_shared_content" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tenant_subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "plan_id" "text" NOT NULL,
    "status" "text" NOT NULL,
    "current_period_start" timestamp with time zone,
    "current_period_end" timestamp with time zone,
    "trial_end" timestamp with time zone,
    "cancel_at_period_end" boolean DEFAULT false,
    "payment_method_id" "text",
    "subscription_id" "text",
    "customer_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tenant_subscriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tenant_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'member'::"text" NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "joined_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "tenant_role_id" "uuid"
);

ALTER TABLE ONLY "public"."tenant_users" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."tenant_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tenants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "settings" "jsonb",
    "branding" "jsonb",
    "status" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tenants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."thinking_assessments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "completed" boolean DEFAULT false,
    "answers" "jsonb",
    "results" "jsonb",
    "thinking_archetype" "text",
    "dimension_scores" "jsonb",
    "strengths" "text"[],
    "growth_areas" "text"[]
);


ALTER TABLE "public"."thinking_assessments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."thought_exercises" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "instructions" "text" NOT NULL,
    "category" "text" NOT NULL,
    "difficulty" "text" NOT NULL,
    "estimated_minutes" integer NOT NULL,
    "benefits" "text"[],
    "prerequisites" "text"[],
    "input_type" "text" NOT NULL,
    "related_concepts" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "is_published" boolean DEFAULT false,
    "is_featured" boolean DEFAULT false,
    "tenant_slug" "text" NOT NULL,
    "author_id" "uuid"
);


ALTER TABLE "public"."thought_exercises" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."token_balances" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "luck_balance" integer DEFAULT 0 NOT NULL,
    "live_balance" integer DEFAULT 0 NOT NULL,
    "love_balance" integer DEFAULT 0 NOT NULL,
    "life_balance" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."token_balances" REPLICA IDENTITY FULL;


ALTER TABLE "public"."token_balances" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."token_conversions" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "from_token" "text" NOT NULL,
    "to_token" "text" NOT NULL,
    "amount" numeric NOT NULL,
    "rate" numeric NOT NULL,
    "site" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "simulation_run_id" "text",
    CONSTRAINT "token_conversions_amount_check" CHECK (("amount" > (0)::numeric)),
    CONSTRAINT "token_conversions_from_token_check" CHECK (("from_token" = ANY (ARRAY['LIVE'::"text", 'LOVE'::"text", 'LIFE'::"text", 'LUCK'::"text"]))),
    CONSTRAINT "token_conversions_to_token_check" CHECK (("to_token" = ANY (ARRAY['LIVE'::"text", 'LOVE'::"text", 'LIFE'::"text", 'LUCK'::"text"])))
);


ALTER TABLE "public"."token_conversions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."token_conversions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."token_conversions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."token_conversions_id_seq" OWNED BY "public"."token_conversions"."id";



CREATE TABLE IF NOT EXISTS "public"."token_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "team_id" "uuid",
    "event_type" "text" NOT NULL,
    "token_amount" numeric NOT NULL,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."token_events" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "public"."token_history" AS
 SELECT "combined_activity"."user_id",
    "date_trunc"('day'::"text", "combined_activity"."created_at") AS "day",
    "combined_activity"."token_tag",
    "count"(*) AS "activity_count",
    "sum"(
        CASE
            WHEN ("combined_activity"."token_tag" = 'LUCK'::"text") THEN 5
            WHEN ("combined_activity"."token_tag" = 'LOVE'::"text") THEN 10
            WHEN ("combined_activity"."token_tag" = 'LIVE'::"text") THEN 7
            WHEN ("combined_activity"."token_tag" = 'LIFE'::"text") THEN 15
            ELSE 0
        END) AS "tokens_earned"
   FROM ( SELECT "posts"."author_id" AS "user_id",
            "posts"."created_at",
            "posts"."token_tag"
           FROM "public"."posts"
        UNION ALL
         SELECT "messages"."sender_id" AS "user_id",
            "messages"."created_at",
            "messages"."token_tag"
           FROM "public"."messages") "combined_activity"
  GROUP BY "combined_activity"."user_id", ("date_trunc"('day'::"text", "combined_activity"."created_at")), "combined_activity"."token_tag"
  WITH NO DATA;


ALTER TABLE "public"."token_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."token_sinks" (
    "id" bigint NOT NULL,
    "site" "text" NOT NULL,
    "sink_type" "text" NOT NULL,
    "token_type" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "simulation_run_id" "text",
    CONSTRAINT "token_sinks_token_type_check" CHECK (("token_type" = ANY (ARRAY['LIVE'::"text", 'LOVE'::"text", 'LIFE'::"text", 'LUCK'::"text"])))
);


ALTER TABLE "public"."token_sinks" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."token_sinks_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."token_sinks_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."token_sinks_id_seq" OWNED BY "public"."token_sinks"."id";



CREATE MATERIALIZED VIEW "public"."token_statistics" AS
 SELECT "posts"."author_id" AS "user_id",
    "sum"(
        CASE
            WHEN ("posts"."token_tag" = 'LUCK'::"text") THEN 1
            ELSE 0
        END) AS "luck_posts",
    "sum"(
        CASE
            WHEN ("posts"."token_tag" = 'LIVE'::"text") THEN 1
            ELSE 0
        END) AS "live_posts",
    "sum"(
        CASE
            WHEN ("posts"."token_tag" = 'LOVE'::"text") THEN 1
            ELSE 0
        END) AS "love_posts",
    "sum"(
        CASE
            WHEN ("posts"."token_tag" = 'LIFE'::"text") THEN 1
            ELSE 0
        END) AS "life_posts"
   FROM "public"."posts"
  GROUP BY "posts"."author_id"
  WITH NO DATA;


ALTER TABLE "public"."token_statistics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."token_transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "token_type" "text" NOT NULL,
    "amount" integer NOT NULL,
    "source_type" "text" NOT NULL,
    "source_id" "uuid",
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "token_transactions_source_type_check" CHECK (("source_type" = ANY (ARRAY['post'::"text", 'message'::"text", 'event'::"text", 'admin'::"text", 'system'::"text"]))),
    CONSTRAINT "token_transactions_token_type_check" CHECK (("token_type" = ANY (ARRAY['LUCK'::"text", 'LIVE'::"text", 'LOVE'::"text", 'LIFE'::"text"])))
);


ALTER TABLE "public"."token_transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tokens" (
    "user_id" "uuid" NOT NULL,
    "live" integer DEFAULT 0 NOT NULL,
    "love" integer DEFAULT 0 NOT NULL,
    "life" integer DEFAULT 0 NOT NULL,
    "luck" integer DEFAULT 0 NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "tokens_life_check" CHECK (("life" >= 0)),
    CONSTRAINT "tokens_live_check" CHECK (("live" >= 0)),
    CONSTRAINT "tokens_love_check" CHECK (("love" >= 0)),
    CONSTRAINT "tokens_luck_check" CHECK (("luck" >= 0))
);


ALTER TABLE "public"."tokens" OWNER TO "postgres";


COMMENT ON TABLE "public"."tokens" IS 'Stores different types of tokens earned by users.';



CREATE TABLE IF NOT EXISTS "public"."user_achievements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "badge_id" "uuid",
    "earned_at" timestamp with time zone DEFAULT "now"(),
    "metadata" "jsonb",
    "name" character varying(255)
);


ALTER TABLE "public"."user_achievements" OWNER TO "postgres";


COMMENT ON COLUMN "public"."user_achievements"."badge_id" IS 'Reference to the base achievement definition in the achievements table.';



COMMENT ON COLUMN "public"."user_achievements"."name" IS 'Name of the specific achievement earned by the user.';



CREATE TABLE IF NOT EXISTS "public"."user_actions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "action_type" "text" NOT NULL,
    "role" "text" NOT NULL,
    "xp_earned" integer NOT NULL,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."user_actions" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_actions" IS 'Logs all XP-earning actions for gamification.';



CREATE TABLE IF NOT EXISTS "public"."user_activity_stats" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "platform" "text" NOT NULL,
    "activity_date" "date" NOT NULL,
    "total_time_spent" interval,
    "lessons_completed" integer DEFAULT 0,
    "modules_completed" integer DEFAULT 0,
    "points_earned" integer DEFAULT 0,
    "last_activity_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_activity_stats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_ai_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "app_name" "text" NOT NULL,
    "preferences" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "user_ai_preferences_app_name_check" CHECK (("app_name" = ANY (ARRAY['hub'::"text", 'ascenders'::"text", 'immortals'::"text", 'neothinkers'::"text"])))
);


ALTER TABLE "public"."user_ai_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_assessments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "platform" "text" NOT NULL,
    "assessment_type" "text" NOT NULL,
    "answers" "jsonb" NOT NULL,
    "results" "jsonb",
    "completed_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_assessments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_badges" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "badge_id" "uuid",
    "earned_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."user_badges" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_badges" IS 'Tracks which badges each user has earned.';



CREATE TABLE IF NOT EXISTS "public"."user_community" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "platform" "text" NOT NULL,
    "joined_features" "text"[] DEFAULT ARRAY[]::"text"[],
    "joined_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_community" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_concept_progress" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "concept_id" "uuid" NOT NULL,
    "familiarity_level" integer DEFAULT 0,
    "last_viewed_at" timestamp with time zone,
    "notes" "text",
    "favorite" boolean DEFAULT false
);


ALTER TABLE "public"."user_concept_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_connections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "connected_user_id" "uuid",
    "connection_type" "text" NOT NULL,
    "status" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_connections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_exercise_progress" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "exercise_id" "uuid" NOT NULL,
    "started_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp with time zone,
    "time_spent_seconds" integer,
    "responses" "jsonb",
    "insights" "text"[],
    "favorite" boolean DEFAULT false
);


ALTER TABLE "public"."user_exercise_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_external_mappings" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "external_id" "text" NOT NULL,
    "external_provider" "text" NOT NULL,
    "external_profile" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_external_mappings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_gamification_stats" (
    "user_id" "uuid" NOT NULL,
    "role" "public"."user_role" DEFAULT 'subscriber'::"public"."user_role" NOT NULL,
    "points" integer DEFAULT 0 NOT NULL,
    "streak" integer DEFAULT 0 NOT NULL,
    "last_active" timestamp with time zone DEFAULT "now"(),
    "subscriptions" "jsonb" DEFAULT '{"ascender": false, "immortal": false, "neothinker": false}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "is_inactive" boolean DEFAULT false NOT NULL,
    CONSTRAINT "user_gamification_stats_points_check" CHECK (("points" >= 0)),
    CONSTRAINT "user_gamification_stats_streak_check" CHECK (("streak" >= 0))
);


ALTER TABLE "public"."user_gamification_stats" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_gamification_stats" IS 'Stores user-specific gamification data like points, role, streak, and platform subscriptions.';



COMMENT ON COLUMN "public"."user_gamification_stats"."is_inactive" IS 'Flag indicating if the user has been inactive for a defined period (e.g., 6 months).';



CREATE OR REPLACE VIEW "public"."user_health_summary" AS
 SELECT "health_metrics"."user_id",
    "health_metrics"."metric_type",
    "avg"("health_metrics"."value") AS "average_value",
    "min"("health_metrics"."value") AS "min_value",
    "max"("health_metrics"."value") AS "max_value",
    "count"(*) AS "reading_count",
    "min"("health_metrics"."timestamp") AS "first_reading",
    "max"("health_metrics"."timestamp") AS "last_reading"
   FROM "public"."health_metrics"
  GROUP BY "health_metrics"."user_id", "health_metrics"."metric_type";


ALTER TABLE "public"."user_health_summary" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_mentions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "activity_id" "uuid",
    "mentioned_user_id" "uuid",
    "context" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_mentions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_onboarding" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "platform" "text" NOT NULL,
    "current_step" "text",
    "completed_steps" "text"[] DEFAULT ARRAY[]::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_onboarding" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_platform_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "platform_slug" "text" NOT NULL,
    "preferences" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "last_accessed" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_platform_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_points" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "points" integer NOT NULL,
    "action" "text" NOT NULL,
    "awarded_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_points" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "platform" "text" NOT NULL,
    "display_name" "text",
    "bio" "text",
    "avatar_url" "text",
    "preferences" "jsonb" DEFAULT '{}'::"jsonb",
    "interests" "text"[] DEFAULT ARRAY[]::"text"[],
    "expertise" "text"[] DEFAULT ARRAY[]::"text"[],
    "social_links" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_recommendations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "platform" "text" NOT NULL,
    "content_type" "text" NOT NULL,
    "content_id" "uuid" NOT NULL,
    "recommendation_type" "text" NOT NULL,
    "relevance_score" numeric NOT NULL,
    "factors" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone
);


ALTER TABLE "public"."user_recommendations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "user_id" "uuid" NOT NULL,
    "is_subscriber" boolean DEFAULT false NOT NULL,
    "is_participant" boolean DEFAULT false NOT NULL,
    "is_contributor" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_segments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "platform" "text" NOT NULL,
    "segment_name" "text" NOT NULL,
    "segment_rules" "jsonb" NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_segments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "platform_slug" "text" NOT NULL,
    "interaction_count" integer DEFAULT 0 NOT NULL,
    "last_page_url" "text",
    "last_page_title" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_skills" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "skill_name" "text" NOT NULL,
    "proficiency_level" integer NOT NULL,
    "last_assessed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_skills" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."user_token_progress" AS
 SELECT "t"."user_id",
    "t"."token_type",
    "sum"("t"."amount") AS "total_earned",
    "count"(*) AS "transaction_count",
    "max"("t"."created_at") AS "last_earned",
    "b"."luck_balance",
    "b"."live_balance",
    "b"."love_balance",
    "b"."life_balance"
   FROM ("public"."token_transactions" "t"
     JOIN "public"."token_balances" "b" ON (("t"."user_id" = "b"."user_id")))
  GROUP BY "t"."user_id", "t"."token_type", "b"."luck_balance", "b"."live_balance", "b"."love_balance", "b"."life_balance";


ALTER TABLE "public"."user_token_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."vital_signs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "vital_type" character varying(50) NOT NULL,
    "value" numeric(10,2) NOT NULL,
    "unit" character varying(20) NOT NULL,
    "measured_at" timestamp with time zone NOT NULL,
    "notes" "text",
    "source" character varying(50) DEFAULT 'manual'::character varying NOT NULL,
    "integration_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."vital_signs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."votes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "proposal_id" "uuid",
    "user_id" "uuid",
    "vote_value" "text" NOT NULL,
    "voted_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."votes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."xp_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "team_id" "uuid",
    "event_type" "text" NOT NULL,
    "xp_amount" numeric NOT NULL,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "simulation_run_id" "text"
);


ALTER TABLE "public"."xp_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."xp_multipliers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_type" "text" NOT NULL,
    "multiplier" numeric NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "xp_multipliers_multiplier_check" CHECK (("multiplier" > (0)::numeric))
);


ALTER TABLE "public"."xp_multipliers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."zoom_attendance" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "meeting_id" "text" NOT NULL,
    "join_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "leave_time" timestamp with time zone,
    "duration_minutes" integer,
    "reward_processed" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."zoom_attendance" OWNER TO "postgres";


ALTER TABLE ONLY "public"."feedback" ATTACH PARTITION "public"."feedback_ascenders" FOR VALUES IN ('ascenders');



ALTER TABLE ONLY "public"."feedback" ATTACH PARTITION "public"."feedback_hub" FOR VALUES IN ('hub');



ALTER TABLE ONLY "public"."feedback" ATTACH PARTITION "public"."feedback_immortals" FOR VALUES IN ('immortals');



ALTER TABLE ONLY "public"."feedback" ATTACH PARTITION "public"."feedback_neothinkers" FOR VALUES IN ('neothinkers');



ALTER TABLE ONLY "auth"."refresh_tokens" ALTER COLUMN "id" SET DEFAULT "nextval"('"auth"."refresh_tokens_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."documentation" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."documentation_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."gamification_events" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."gamification_events_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."token_conversions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."token_conversions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."token_sinks" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."token_sinks_id_seq"'::"regclass");



ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "amr_id_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."audit_log_entries"
    ADD CONSTRAINT "audit_log_entries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."flow_state"
    ADD CONSTRAINT "flow_state_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_provider_id_provider_unique" UNIQUE ("provider_id", "provider");



ALTER TABLE ONLY "auth"."instances"
    ADD CONSTRAINT "instances_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_authentication_method_pkey" UNIQUE ("session_id", "authentication_method");



ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_last_challenged_at_key" UNIQUE ("last_challenged_at");



ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_token_unique" UNIQUE ("token");



ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_entity_id_key" UNIQUE ("entity_id");



ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");



ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."settings"
    ADD CONSTRAINT "settings_name_key" UNIQUE ("name");



ALTER TABLE ONLY "auth"."settings"
    ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."sso_providers"
    ADD CONSTRAINT "sso_providers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_phone_key" UNIQUE ("phone");



ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_platform_name_key" UNIQUE ("platform", "name");



ALTER TABLE ONLY "public"."activity_feed"
    ADD CONSTRAINT "activity_feed_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_analytics"
    ADD CONSTRAINT "ai_analytics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_configurations"
    ADD CONSTRAINT "ai_configurations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_configurations"
    ADD CONSTRAINT "ai_configurations_platform_slug_key" UNIQUE ("platform_slug");



ALTER TABLE ONLY "public"."ai_conversations"
    ADD CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_embeddings"
    ADD CONSTRAINT "ai_embeddings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_messages"
    ADD CONSTRAINT "ai_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_suggestions"
    ADD CONSTRAINT "ai_suggestions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_usage_metrics"
    ADD CONSTRAINT "ai_usage_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_vector_collection_mappings"
    ADD CONSTRAINT "ai_vector_collection_mappings_collection_id_document_id_key" UNIQUE ("collection_id", "document_id");



ALTER TABLE ONLY "public"."ai_vector_collection_mappings"
    ADD CONSTRAINT "ai_vector_collection_mappings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_vector_collections"
    ADD CONSTRAINT "ai_vector_collections_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."ai_vector_collections"
    ADD CONSTRAINT "ai_vector_collections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_vector_documents"
    ADD CONSTRAINT "ai_vector_documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."analytics_events"
    ADD CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."analytics_metrics"
    ADD CONSTRAINT "analytics_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."analytics_metrics"
    ADD CONSTRAINT "analytics_metrics_platform_metric_key_measured_at_key" UNIQUE ("platform", "metric_key", "measured_at");



ALTER TABLE ONLY "public"."analytics_reports"
    ADD CONSTRAINT "analytics_reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."analytics_summaries"
    ADD CONSTRAINT "analytics_summaries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ascenders_profiles"
    ADD CONSTRAINT "ascenders_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ascenders_profiles"
    ADD CONSTRAINT "ascenders_profiles_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."auth_logs"
    ADD CONSTRAINT "auth_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."badge_events"
    ADD CONSTRAINT "badge_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."badges"
    ADD CONSTRAINT "badges_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."census_snapshots"
    ADD CONSTRAINT "census_snapshots_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_history"
    ADD CONSTRAINT "chat_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_participants"
    ADD CONSTRAINT "chat_participants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_participants"
    ADD CONSTRAINT "chat_participants_room_id_user_id_key" UNIQUE ("room_id", "user_id");



ALTER TABLE ONLY "public"."chat_rooms"
    ADD CONSTRAINT "chat_rooms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."collaboration_bonuses"
    ADD CONSTRAINT "collaboration_bonuses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."collaborative_challenges"
    ADD CONSTRAINT "collaborative_challenges_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."community_features"
    ADD CONSTRAINT "community_features_name_platform_key" UNIQUE ("name", "platform");



ALTER TABLE ONLY "public"."community_features"
    ADD CONSTRAINT "community_features_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."concept_relationships"
    ADD CONSTRAINT "concept_relationships_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."concept_relationships"
    ADD CONSTRAINT "concept_relationships_source_concept_id_target_concept_id_key" UNIQUE ("source_concept_id", "target_concept_id");



ALTER TABLE ONLY "public"."concepts"
    ADD CONSTRAINT "concepts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."content_categories"
    ADD CONSTRAINT "content_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."content_categories"
    ADD CONSTRAINT "content_categories_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."content_content_tags"
    ADD CONSTRAINT "content_content_tags_pkey" PRIMARY KEY ("content_id", "tag_id");



ALTER TABLE ONLY "public"."content_dependencies"
    ADD CONSTRAINT "content_dependencies_content_type_content_id_depends_on_typ_key" UNIQUE ("content_type", "content_id", "depends_on_type", "depends_on_id");



ALTER TABLE ONLY "public"."content_dependencies"
    ADD CONSTRAINT "content_dependencies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."content_modules"
    ADD CONSTRAINT "content_modules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."content"
    ADD CONSTRAINT "content_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."content_schedule"
    ADD CONSTRAINT "content_schedule_content_type_content_id_key" UNIQUE ("content_type", "content_id");



ALTER TABLE ONLY "public"."content_schedule"
    ADD CONSTRAINT "content_schedule_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."content_similarity"
    ADD CONSTRAINT "content_similarity_content_type_content_id_similar_content__key" UNIQUE ("content_type", "content_id", "similar_content_type", "similar_content_id");



ALTER TABLE ONLY "public"."content_similarity"
    ADD CONSTRAINT "content_similarity_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."content"
    ADD CONSTRAINT "content_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."content_tags"
    ADD CONSTRAINT "content_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."content_tags"
    ADD CONSTRAINT "content_tags_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."content_versions"
    ADD CONSTRAINT "content_versions_content_type_content_id_version_number_key" UNIQUE ("content_type", "content_id", "version_number");



ALTER TABLE ONLY "public"."content_versions"
    ADD CONSTRAINT "content_versions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."content_workflow_history"
    ADD CONSTRAINT "content_workflow_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."content_workflow"
    ADD CONSTRAINT "content_workflow_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."crowdfunding"
    ADD CONSTRAINT "crowdfunding_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."csrf_tokens"
    ADD CONSTRAINT "csrf_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."csrf_tokens"
    ADD CONSTRAINT "csrf_tokens_token_hash_key" UNIQUE ("token_hash");



ALTER TABLE ONLY "public"."data_transfer_logs"
    ADD CONSTRAINT "data_transfer_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."discussion_posts"
    ADD CONSTRAINT "discussion_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."discussion_topics"
    ADD CONSTRAINT "discussion_topics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."documentation"
    ADD CONSTRAINT "documentation_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."error_logs"
    ADD CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_attendees"
    ADD CONSTRAINT "event_attendees_event_id_user_id_key" UNIQUE ("event_id", "user_id");



ALTER TABLE ONLY "public"."event_attendees"
    ADD CONSTRAINT "event_attendees_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_registrations"
    ADD CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."feature_flags"
    ADD CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."feature_flags"
    ADD CONSTRAINT "feature_flags_platform_feature_key_key" UNIQUE ("platform", "feature_key");



ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_pkey" PRIMARY KEY ("id", "app_name");



ALTER TABLE ONLY "public"."feedback_ascenders"
    ADD CONSTRAINT "feedback_ascenders_pkey" PRIMARY KEY ("id", "app_name");



ALTER TABLE ONLY "public"."feedback_hub"
    ADD CONSTRAINT "feedback_hub_pkey" PRIMARY KEY ("id", "app_name");



ALTER TABLE ONLY "public"."feedback_immortals"
    ADD CONSTRAINT "feedback_immortals_pkey" PRIMARY KEY ("id", "app_name");



ALTER TABLE ONLY "public"."feedback_neothinkers"
    ADD CONSTRAINT "feedback_neothinkers_pkey" PRIMARY KEY ("id", "app_name");



ALTER TABLE ONLY "public"."fibonacci_token_rewards"
    ADD CONSTRAINT "fibonacci_token_rewards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."flow_templates"
    ADD CONSTRAINT "flow_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."gamification_events"
    ADD CONSTRAINT "gamification_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."governance_proposals"
    ADD CONSTRAINT "governance_proposals_pkey" PRIMARY KEY ("proposal_id");



ALTER TABLE ONLY "public"."group_actions"
    ADD CONSTRAINT "group_actions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."health_integrations"
    ADD CONSTRAINT "health_integrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."health_integrations"
    ADD CONSTRAINT "health_integrations_user_id_provider_key" UNIQUE ("user_id", "provider");



ALTER TABLE ONLY "public"."health_metrics"
    ADD CONSTRAINT "health_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hub_profiles"
    ADD CONSTRAINT "hub_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hub_profiles"
    ADD CONSTRAINT "hub_profiles_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."immortals_profiles"
    ADD CONSTRAINT "immortals_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."immortals_profiles"
    ADD CONSTRAINT "immortals_profiles_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."integration_settings"
    ADD CONSTRAINT "integration_settings_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."journal_entries"
    ADD CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."learning_path_items"
    ADD CONSTRAINT "learning_path_items_path_id_content_type_content_id_key" UNIQUE ("path_id", "content_type", "content_id");



ALTER TABLE ONLY "public"."learning_path_items"
    ADD CONSTRAINT "learning_path_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."learning_paths"
    ADD CONSTRAINT "learning_paths_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."learning_progress"
    ADD CONSTRAINT "learning_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."learning_progress"
    ADD CONSTRAINT "learning_progress_user_id_content_type_content_id_key" UNIQUE ("user_id", "content_type", "content_id");



ALTER TABLE ONLY "public"."learning_recommendations"
    ADD CONSTRAINT "learning_recommendations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."learning_recommendations"
    ADD CONSTRAINT "learning_recommendations_user_id_content_type_content_id_key" UNIQUE ("user_id", "content_type", "content_id");



ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."login_attempts"
    ADD CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mark_hamilton_content"
    ADD CONSTRAINT "mark_hamilton_content_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."modules"
    ADD CONSTRAINT "modules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."neothinkers_profiles"
    ADD CONSTRAINT "neothinkers_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."neothinkers_profiles"
    ADD CONSTRAINT "neothinkers_profiles_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."notification_preferences"
    ADD CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification_preferences"
    ADD CONSTRAINT "notification_preferences_user_id_platform_key" UNIQUE ("user_id", "platform");



ALTER TABLE ONLY "public"."notification_templates"
    ADD CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification_templates"
    ADD CONSTRAINT "notification_templates_platform_template_key_key" UNIQUE ("platform", "template_key");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."participation"
    ADD CONSTRAINT "participation_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."performance_metrics"
    ADD CONSTRAINT "performance_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."platform_access"
    ADD CONSTRAINT "platform_access_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."platform_access"
    ADD CONSTRAINT "platform_access_user_id_platform_slug_key" UNIQUE ("user_id", "platform_slug");



ALTER TABLE ONLY "public"."platform_customization"
    ADD CONSTRAINT "platform_customization_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."platform_customization"
    ADD CONSTRAINT "platform_customization_platform_component_key_key" UNIQUE ("platform", "component_key");



ALTER TABLE ONLY "public"."platform_settings"
    ADD CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."platform_settings"
    ADD CONSTRAINT "platform_settings_platform_key" UNIQUE ("platform");



ALTER TABLE ONLY "public"."platform_state"
    ADD CONSTRAINT "platform_state_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."popular_searches"
    ADD CONSTRAINT "popular_searches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."popular_searches"
    ADD CONSTRAINT "popular_searches_query_platform_key" UNIQUE ("query", "platform");



ALTER TABLE ONLY "public"."post_comments"
    ADD CONSTRAINT "post_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post_likes"
    ADD CONSTRAINT "post_likes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post_likes"
    ADD CONSTRAINT "post_likes_post_id_user_id_key" UNIQUE ("post_id", "user_id");



ALTER TABLE ONLY "public"."post_reactions"
    ADD CONSTRAINT "post_reactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post_reactions"
    ADD CONSTRAINT "post_reactions_post_id_user_id_key" UNIQUE ("post_id", "user_id");



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."proposals"
    ADD CONSTRAINT "proposals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rate_limits"
    ADD CONSTRAINT "rate_limits_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."referral_bonuses"
    ADD CONSTRAINT "referral_bonuses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."referrals"
    ADD CONSTRAINT "referrals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."resources"
    ADD CONSTRAINT "resources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_capabilities"
    ADD CONSTRAINT "role_capabilities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_capabilities"
    ADD CONSTRAINT "role_capabilities_tenant_id_role_slug_feature_name_key" UNIQUE ("tenant_id", "role_slug", "feature_name");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id", "permission_id");



ALTER TABLE ONLY "public"."room_participants"
    ADD CONSTRAINT "room_participants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."room_participants"
    ADD CONSTRAINT "room_participants_room_id_user_id_key" UNIQUE ("room_id", "user_id");



ALTER TABLE ONLY "public"."rooms"
    ADD CONSTRAINT "rooms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schema_version"
    ADD CONSTRAINT "schema_version_pkey" PRIMARY KEY ("version");



ALTER TABLE ONLY "public"."search_analytics"
    ADD CONSTRAINT "search_analytics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."search_suggestions"
    ADD CONSTRAINT "search_suggestions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."search_suggestions"
    ADD CONSTRAINT "search_suggestions_trigger_term_suggestion_key" UNIQUE ("trigger_term", "suggestion");



ALTER TABLE ONLY "public"."search_vectors"
    ADD CONSTRAINT "search_vectors_content_type_content_id_key" UNIQUE ("content_type", "content_id");



ALTER TABLE ONLY "public"."search_vectors"
    ADD CONSTRAINT "search_vectors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."security_events"
    ADD CONSTRAINT "security_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."security_logs"
    ADD CONSTRAINT "security_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shared_content"
    ADD CONSTRAINT "shared_content_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shared_content"
    ADD CONSTRAINT "shared_content_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."site_settings"
    ADD CONSTRAINT "site_settings_pkey" PRIMARY KEY ("site");



ALTER TABLE ONLY "public"."skill_requirements"
    ADD CONSTRAINT "skill_requirements_content_type_content_id_skill_name_key" UNIQUE ("content_type", "content_id", "skill_name");



ALTER TABLE ONLY "public"."skill_requirements"
    ADD CONSTRAINT "skill_requirements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."social_interactions"
    ADD CONSTRAINT "social_interactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."supplements"
    ADD CONSTRAINT "supplements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."suspicious_activities"
    ADD CONSTRAINT "suspicious_activities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."system_alerts"
    ADD CONSTRAINT "system_alerts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."system_health_checks"
    ADD CONSTRAINT "system_health_checks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."team_memberships"
    ADD CONSTRAINT "team_memberships_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."team_memberships"
    ADD CONSTRAINT "team_memberships_team_id_user_id_key" UNIQUE ("team_id", "user_id");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenant_api_keys"
    ADD CONSTRAINT "tenant_api_keys_api_key_key" UNIQUE ("api_key");



ALTER TABLE ONLY "public"."tenant_api_keys"
    ADD CONSTRAINT "tenant_api_keys_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenant_domains"
    ADD CONSTRAINT "tenant_domains_domain_key" UNIQUE ("domain");



ALTER TABLE ONLY "public"."tenant_domains"
    ADD CONSTRAINT "tenant_domains_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenant_roles"
    ADD CONSTRAINT "tenant_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenant_roles"
    ADD CONSTRAINT "tenant_roles_tenant_id_slug_key" UNIQUE ("tenant_id", "slug");



ALTER TABLE ONLY "public"."tenant_shared_content"
    ADD CONSTRAINT "tenant_shared_content_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenant_shared_content"
    ADD CONSTRAINT "tenant_shared_content_tenant_id_content_id_key" UNIQUE ("tenant_id", "content_id");



ALTER TABLE ONLY "public"."tenant_subscriptions"
    ADD CONSTRAINT "tenant_subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenant_subscriptions"
    ADD CONSTRAINT "tenant_subscriptions_tenant_id_key" UNIQUE ("tenant_id");



ALTER TABLE ONLY "public"."tenant_users"
    ADD CONSTRAINT "tenant_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenant_users"
    ADD CONSTRAINT "tenant_users_tenant_id_user_id_key" UNIQUE ("tenant_id", "user_id");



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."thinking_assessments"
    ADD CONSTRAINT "thinking_assessments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."thought_exercises"
    ADD CONSTRAINT "thought_exercises_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."token_balances"
    ADD CONSTRAINT "token_balances_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."token_conversions"
    ADD CONSTRAINT "token_conversions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."token_events"
    ADD CONSTRAINT "token_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."token_sinks"
    ADD CONSTRAINT "token_sinks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."token_transactions"
    ADD CONSTRAINT "token_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tokens"
    ADD CONSTRAINT "tokens_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_user_id_achievement_id_key" UNIQUE ("user_id", "badge_id");



ALTER TABLE ONLY "public"."user_actions"
    ADD CONSTRAINT "user_actions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_activity_stats"
    ADD CONSTRAINT "user_activity_stats_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_activity_stats"
    ADD CONSTRAINT "user_activity_stats_user_id_platform_activity_date_key" UNIQUE ("user_id", "platform", "activity_date");



ALTER TABLE ONLY "public"."user_ai_preferences"
    ADD CONSTRAINT "user_ai_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_ai_preferences"
    ADD CONSTRAINT "user_ai_preferences_user_id_app_name_key" UNIQUE ("user_id", "app_name");



ALTER TABLE ONLY "public"."user_assessments"
    ADD CONSTRAINT "user_assessments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_assessments"
    ADD CONSTRAINT "user_assessments_user_id_platform_assessment_type_key" UNIQUE ("user_id", "platform", "assessment_type");



ALTER TABLE ONLY "public"."user_badges"
    ADD CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_community"
    ADD CONSTRAINT "user_community_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_community"
    ADD CONSTRAINT "user_community_user_id_platform_key" UNIQUE ("user_id", "platform");



ALTER TABLE ONLY "public"."user_concept_progress"
    ADD CONSTRAINT "user_concept_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_concept_progress"
    ADD CONSTRAINT "user_concept_progress_user_id_concept_id_key" UNIQUE ("user_id", "concept_id");



ALTER TABLE ONLY "public"."user_connections"
    ADD CONSTRAINT "user_connections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_connections"
    ADD CONSTRAINT "user_connections_user_id_connected_user_id_key" UNIQUE ("user_id", "connected_user_id");



ALTER TABLE ONLY "public"."user_exercise_progress"
    ADD CONSTRAINT "user_exercise_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_external_mappings"
    ADD CONSTRAINT "user_external_mappings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_external_mappings"
    ADD CONSTRAINT "user_external_mappings_user_id_external_provider_key" UNIQUE ("user_id", "external_provider");



ALTER TABLE ONLY "public"."user_gamification_stats"
    ADD CONSTRAINT "user_gamification_stats_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."user_mentions"
    ADD CONSTRAINT "user_mentions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_onboarding"
    ADD CONSTRAINT "user_onboarding_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_onboarding"
    ADD CONSTRAINT "user_onboarding_user_id_platform_key" UNIQUE ("user_id", "platform");



ALTER TABLE ONLY "public"."user_platform_preferences"
    ADD CONSTRAINT "user_platform_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_platform_preferences"
    ADD CONSTRAINT "user_platform_preferences_user_id_platform_slug_key" UNIQUE ("user_id", "platform_slug");



ALTER TABLE ONLY "public"."user_points"
    ADD CONSTRAINT "user_points_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_user_id_platform_key" UNIQUE ("user_id", "platform");



ALTER TABLE ONLY "public"."user_recommendations"
    ADD CONSTRAINT "user_recommendations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_recommendations"
    ADD CONSTRAINT "user_recommendations_user_id_platform_content_type_content__key" UNIQUE ("user_id", "platform", "content_type", "content_id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."user_segments"
    ADD CONSTRAINT "user_segments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_segments"
    ADD CONSTRAINT "user_segments_platform_segment_name_key" UNIQUE ("platform", "segment_name");



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_skills"
    ADD CONSTRAINT "user_skills_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_skills"
    ADD CONSTRAINT "user_skills_user_id_skill_name_key" UNIQUE ("user_id", "skill_name");



ALTER TABLE ONLY "public"."vital_signs"
    ADD CONSTRAINT "vital_signs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."votes"
    ADD CONSTRAINT "votes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."votes"
    ADD CONSTRAINT "votes_proposal_id_user_id_key" UNIQUE ("proposal_id", "user_id");



ALTER TABLE ONLY "public"."xp_events"
    ADD CONSTRAINT "xp_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."xp_multipliers"
    ADD CONSTRAINT "xp_multipliers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."zoom_attendance"
    ADD CONSTRAINT "zoom_attendance_pkey" PRIMARY KEY ("id");



CREATE INDEX "audit_logs_instance_id_idx" ON "auth"."audit_log_entries" USING "btree" ("instance_id");



CREATE UNIQUE INDEX "confirmation_token_idx" ON "auth"."users" USING "btree" ("confirmation_token") WHERE (("confirmation_token")::"text" !~ '^[0-9 ]*$'::"text");



CREATE UNIQUE INDEX "email_change_token_current_idx" ON "auth"."users" USING "btree" ("email_change_token_current") WHERE (("email_change_token_current")::"text" !~ '^[0-9 ]*$'::"text");



CREATE UNIQUE INDEX "email_change_token_new_idx" ON "auth"."users" USING "btree" ("email_change_token_new") WHERE (("email_change_token_new")::"text" !~ '^[0-9 ]*$'::"text");



CREATE INDEX "factor_id_created_at_idx" ON "auth"."mfa_factors" USING "btree" ("user_id", "created_at");



CREATE INDEX "flow_state_created_at_idx" ON "auth"."flow_state" USING "btree" ("created_at" DESC);



CREATE INDEX "identities_email_idx" ON "auth"."identities" USING "btree" ("email" "text_pattern_ops");



COMMENT ON INDEX "auth"."identities_email_idx" IS 'Auth: Ensures indexed queries on the email column';



CREATE INDEX "identities_user_id_idx" ON "auth"."identities" USING "btree" ("user_id");



CREATE INDEX "idx_auth_code" ON "auth"."flow_state" USING "btree" ("auth_code");



CREATE INDEX "idx_user_id_auth_method" ON "auth"."flow_state" USING "btree" ("user_id", "authentication_method");



CREATE INDEX "mfa_challenge_created_at_idx" ON "auth"."mfa_challenges" USING "btree" ("created_at" DESC);



CREATE UNIQUE INDEX "mfa_factors_user_friendly_name_unique" ON "auth"."mfa_factors" USING "btree" ("friendly_name", "user_id") WHERE (TRIM(BOTH FROM "friendly_name") <> ''::"text");



CREATE INDEX "mfa_factors_user_id_idx" ON "auth"."mfa_factors" USING "btree" ("user_id");



CREATE INDEX "one_time_tokens_relates_to_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("relates_to");



CREATE INDEX "one_time_tokens_token_hash_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("token_hash");



CREATE UNIQUE INDEX "one_time_tokens_user_id_token_type_key" ON "auth"."one_time_tokens" USING "btree" ("user_id", "token_type");



CREATE UNIQUE INDEX "reauthentication_token_idx" ON "auth"."users" USING "btree" ("reauthentication_token") WHERE (("reauthentication_token")::"text" !~ '^[0-9 ]*$'::"text");



CREATE UNIQUE INDEX "recovery_token_idx" ON "auth"."users" USING "btree" ("recovery_token") WHERE (("recovery_token")::"text" !~ '^[0-9 ]*$'::"text");



CREATE INDEX "refresh_tokens_instance_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id");



CREATE INDEX "refresh_tokens_instance_id_user_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id", "user_id");



CREATE INDEX "refresh_tokens_parent_idx" ON "auth"."refresh_tokens" USING "btree" ("parent");



CREATE INDEX "refresh_tokens_session_id_revoked_idx" ON "auth"."refresh_tokens" USING "btree" ("session_id", "revoked");



CREATE INDEX "refresh_tokens_updated_at_idx" ON "auth"."refresh_tokens" USING "btree" ("updated_at" DESC);



CREATE INDEX "saml_providers_sso_provider_id_idx" ON "auth"."saml_providers" USING "btree" ("sso_provider_id");



CREATE INDEX "saml_relay_states_created_at_idx" ON "auth"."saml_relay_states" USING "btree" ("created_at" DESC);



CREATE INDEX "saml_relay_states_for_email_idx" ON "auth"."saml_relay_states" USING "btree" ("for_email");



CREATE INDEX "saml_relay_states_sso_provider_id_idx" ON "auth"."saml_relay_states" USING "btree" ("sso_provider_id");



CREATE INDEX "sessions_not_after_idx" ON "auth"."sessions" USING "btree" ("not_after" DESC);



CREATE INDEX "sessions_user_id_idx" ON "auth"."sessions" USING "btree" ("user_id");



CREATE UNIQUE INDEX "sso_domains_domain_idx" ON "auth"."sso_domains" USING "btree" ("lower"("domain"));



CREATE INDEX "sso_domains_sso_provider_id_idx" ON "auth"."sso_domains" USING "btree" ("sso_provider_id");



CREATE UNIQUE INDEX "sso_providers_resource_id_idx" ON "auth"."sso_providers" USING "btree" ("lower"("resource_id"));



CREATE UNIQUE INDEX "unique_phone_factor_per_user" ON "auth"."mfa_factors" USING "btree" ("user_id", "phone");



CREATE INDEX "user_id_created_at_idx" ON "auth"."sessions" USING "btree" ("user_id", "created_at");



CREATE UNIQUE INDEX "users_email_partial_key" ON "auth"."users" USING "btree" ("email") WHERE ("is_sso_user" = false);



COMMENT ON INDEX "auth"."users_email_partial_key" IS 'Auth: A partial unique index that applies only when is_sso_user is false';



CREATE INDEX "users_instance_id_email_idx" ON "auth"."users" USING "btree" ("instance_id", "lower"(("email")::"text"));



CREATE INDEX "users_instance_id_idx" ON "auth"."users" USING "btree" ("instance_id");



CREATE INDEX "users_is_anonymous_idx" ON "auth"."users" USING "btree" ("is_anonymous");



CREATE INDEX "ai_analytics_event_type_idx" ON "public"."ai_analytics" USING "btree" ("event_type", "app_name");



CREATE INDEX "ai_analytics_user_id_idx" ON "public"."ai_analytics" USING "btree" ("user_id");



CREATE INDEX "ai_embeddings_embedding_idx" ON "public"."ai_embeddings" USING "ivfflat" ("embedding" "public"."vector_cosine_ops") WITH ("lists"='100');



CREATE INDEX "ai_suggestions_content_idx" ON "public"."ai_suggestions" USING "btree" ("content_id", "content_type");



CREATE INDEX "ai_suggestions_user_id_idx" ON "public"."ai_suggestions" USING "btree" ("user_id");



CREATE INDEX "ai_vector_docs_embedding_idx" ON "public"."ai_vector_documents" USING "ivfflat" ("embedding" "public"."vector_cosine_ops") WITH ("lists"='100');



CREATE INDEX "badge_events_sim_run_idx" ON "public"."badge_events" USING "btree" ("simulation_run_id");



CREATE INDEX "census_snapshots_sim_run_idx" ON "public"."census_snapshots" USING "btree" ("simulation_run_id");



CREATE INDEX "chat_messages_conversation_id_idx" ON "public"."chat_messages" USING "btree" ("conversation_id");



CREATE INDEX "chat_messages_created_at_idx" ON "public"."chat_messages" USING "btree" ("created_at" DESC);



CREATE INDEX "chat_messages_user_id_idx" ON "public"."chat_messages" USING "btree" ("user_id");



CREATE INDEX "idx_feedback_app_date" ON ONLY "public"."feedback" USING "btree" ("app_name", "created_at");



CREATE INDEX "feedback_ascenders_app_name_created_at_idx" ON "public"."feedback_ascenders" USING "btree" ("app_name", "created_at");



CREATE INDEX "idx_feedback_created_at" ON ONLY "public"."feedback" USING "btree" ("created_at" DESC);



CREATE INDEX "feedback_ascenders_created_at_idx" ON "public"."feedback_ascenders" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_feedback_user_id_app_name" ON ONLY "public"."feedback" USING "btree" ("user_id", "app_name");



CREATE INDEX "feedback_ascenders_user_id_app_name_idx" ON "public"."feedback_ascenders" USING "btree" ("user_id", "app_name");



CREATE INDEX "idx_feedback_user_id" ON ONLY "public"."feedback" USING "btree" ("user_id");



CREATE INDEX "feedback_ascenders_user_id_idx" ON "public"."feedback_ascenders" USING "btree" ("user_id");



CREATE INDEX "feedback_hub_app_name_created_at_idx" ON "public"."feedback_hub" USING "btree" ("app_name", "created_at");



CREATE INDEX "feedback_hub_created_at_idx" ON "public"."feedback_hub" USING "btree" ("created_at" DESC);



CREATE INDEX "feedback_hub_user_id_app_name_idx" ON "public"."feedback_hub" USING "btree" ("user_id", "app_name");



CREATE INDEX "feedback_hub_user_id_idx" ON "public"."feedback_hub" USING "btree" ("user_id");



CREATE INDEX "feedback_immortals_app_name_created_at_idx" ON "public"."feedback_immortals" USING "btree" ("app_name", "created_at");



CREATE INDEX "feedback_immortals_created_at_idx" ON "public"."feedback_immortals" USING "btree" ("created_at" DESC);



CREATE INDEX "feedback_immortals_user_id_app_name_idx" ON "public"."feedback_immortals" USING "btree" ("user_id", "app_name");



CREATE INDEX "feedback_immortals_user_id_idx" ON "public"."feedback_immortals" USING "btree" ("user_id");



CREATE INDEX "feedback_neothinkers_app_name_created_at_idx" ON "public"."feedback_neothinkers" USING "btree" ("app_name", "created_at");



CREATE INDEX "feedback_neothinkers_created_at_idx" ON "public"."feedback_neothinkers" USING "btree" ("created_at" DESC);



CREATE INDEX "feedback_neothinkers_user_id_app_name_idx" ON "public"."feedback_neothinkers" USING "btree" ("user_id", "app_name");



CREATE INDEX "feedback_neothinkers_user_id_idx" ON "public"."feedback_neothinkers" USING "btree" ("user_id");



CREATE INDEX "fibonacci_token_rewards_sim_run_idx" ON "public"."fibonacci_token_rewards" USING "btree" ("simulation_run_id");



CREATE INDEX "gamification_events_event_type_idx" ON "public"."gamification_events" USING "btree" ("event_type");



CREATE INDEX "gamification_events_sim_run_idx" ON "public"."gamification_events" USING "btree" ("simulation_run_id");



CREATE INDEX "gamification_events_site_idx" ON "public"."gamification_events" USING "btree" ("site");



CREATE INDEX "idx_achievements_platform" ON "public"."achievements" USING "btree" ("platform");



CREATE INDEX "idx_activity_feed_content" ON "public"."activity_feed" USING "btree" ("content_type", "content_id");



CREATE INDEX "idx_activity_feed_platform" ON "public"."activity_feed" USING "btree" ("platform") WHERE ("platform" IS NOT NULL);



CREATE INDEX "idx_activity_feed_user" ON "public"."activity_feed" USING "btree" ("user_id", "platform", "created_at" DESC);



CREATE INDEX "idx_analytics_metrics_lookup" ON "public"."analytics_metrics" USING "btree" ("platform", "metric_key", "measured_at" DESC);



CREATE INDEX "idx_analytics_reports_lookup" ON "public"."analytics_reports" USING "btree" ("platform", "report_type", "created_at" DESC);



CREATE INDEX "idx_analytics_summaries_date_range" ON "public"."analytics_summaries" USING "btree" ("start_date", "end_date");



CREATE INDEX "idx_analytics_summaries_lookup" ON "public"."analytics_summaries" USING "btree" ("platform", "summary_type", "time_period");



CREATE INDEX "idx_audit_logs_action" ON "public"."audit_logs" USING "btree" ("action");



CREATE INDEX "idx_audit_logs_created_at" ON "public"."audit_logs" USING "btree" ("created_at");



CREATE INDEX "idx_audit_logs_entity" ON "public"."audit_logs" USING "btree" ("entity_type", "entity_id");



CREATE INDEX "idx_audit_logs_user" ON "public"."audit_logs" USING "btree" ("user_id");



CREATE INDEX "idx_chat_history_app_name" ON "public"."chat_history" USING "btree" ("app_name");



CREATE INDEX "idx_chat_history_created_at" ON "public"."chat_history" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_chat_history_user_id" ON "public"."chat_history" USING "btree" ("user_id");



CREATE INDEX "idx_chat_history_user_id_app_name" ON "public"."chat_history" USING "btree" ("user_id", "app_name");



CREATE INDEX "idx_content_created_at" ON "public"."content" USING "btree" ("created_at");



CREATE INDEX "idx_content_dependencies_lookup" ON "public"."content_dependencies" USING "btree" ("content_type", "content_id");



CREATE INDEX "idx_content_dependencies_reverse" ON "public"."content_dependencies" USING "btree" ("depends_on_type", "depends_on_id");



CREATE INDEX "idx_content_modules_metadata" ON "public"."content_modules" USING "gin" ("metadata");



CREATE INDEX "idx_content_modules_order" ON "public"."content_modules" USING "btree" ("order_index");



CREATE INDEX "idx_content_modules_platform" ON "public"."content_modules" USING "btree" ("platform");



CREATE INDEX "idx_content_modules_platform_published" ON "public"."content_modules" USING "btree" ("platform", "is_published");



CREATE INDEX "idx_content_modules_published" ON "public"."content_modules" USING "btree" ("is_published");



CREATE INDEX "idx_content_platform" ON "public"."content" USING "btree" ("platform");



CREATE INDEX "idx_content_platform_route" ON "public"."content" USING "btree" ("platform", "route");



CREATE INDEX "idx_content_schedule_publish" ON "public"."content_schedule" USING "btree" ("publish_at");



CREATE INDEX "idx_content_schedule_status" ON "public"."content_schedule" USING "btree" ("status");



CREATE INDEX "idx_content_similarity_lookup" ON "public"."content_similarity" USING "btree" ("content_type", "content_id", "similarity_score" DESC);



CREATE INDEX "idx_content_slug" ON "public"."content" USING "btree" ("slug");



CREATE INDEX "idx_content_versions_lookup" ON "public"."content_versions" USING "btree" ("content_type", "content_id", "version_number");



CREATE INDEX "idx_content_versions_status" ON "public"."content_versions" USING "btree" ("status");



CREATE INDEX "idx_content_workflow_assigned" ON "public"."content_workflow" USING "btree" ("assigned_to");



CREATE INDEX "idx_content_workflow_status" ON "public"."content_workflow" USING "btree" ("current_status");



CREATE INDEX "idx_csrf_tokens_expiry" ON "public"."csrf_tokens" USING "btree" ("expires_at");



CREATE INDEX "idx_csrf_tokens_hash" ON "public"."csrf_tokens" USING "btree" ("token_hash");



CREATE INDEX "idx_data_transfer_logs_user_id" ON "public"."data_transfer_logs" USING "btree" ("user_id");



CREATE INDEX "idx_error_logs_lookup" ON "public"."error_logs" USING "btree" ("error_type", "severity", "timestamp" DESC);



CREATE INDEX "idx_event_registrations_event_id" ON "public"."event_registrations" USING "btree" ("event_id");



CREATE INDEX "idx_event_registrations_user_id" ON "public"."event_registrations" USING "btree" ("user_id");



CREATE INDEX "idx_events_platform_route" ON "public"."events" USING "btree" ("platform", "route") WHERE (("platform" IS NOT NULL) AND ("route" IS NOT NULL));



CREATE INDEX "idx_feature_flags_lookup" ON "public"."feature_flags" USING "btree" ("platform", "feature_key");



CREATE INDEX "idx_health_checks_status" ON "public"."system_health_checks" USING "btree" ("status", "last_check_time");



CREATE INDEX "idx_health_integrations_user_id" ON "public"."health_integrations" USING "btree" ("user_id");



CREATE INDEX "idx_health_metrics_metric_type" ON "public"."health_metrics" USING "btree" ("metric_type");



CREATE INDEX "idx_health_metrics_timestamp" ON "public"."health_metrics" USING "btree" ("timestamp");



CREATE INDEX "idx_health_metrics_user_id" ON "public"."health_metrics" USING "btree" ("user_id");



CREATE INDEX "idx_learning_path_items_order" ON "public"."learning_path_items" USING "btree" ("path_id", "order_index");



CREATE INDEX "idx_learning_paths_platform" ON "public"."learning_paths" USING "btree" ("platform");



CREATE INDEX "idx_learning_progress_content" ON "public"."learning_progress" USING "btree" ("content_type", "content_id");



CREATE INDEX "idx_learning_progress_user" ON "public"."learning_progress" USING "btree" ("user_id", "status");



CREATE INDEX "idx_learning_recommendations_user" ON "public"."learning_recommendations" USING "btree" ("user_id", "relevance_score" DESC);



CREATE INDEX "idx_lessons_metadata" ON "public"."lessons" USING "gin" ("metadata");



CREATE INDEX "idx_lessons_module" ON "public"."lessons" USING "btree" ("module_id");



CREATE INDEX "idx_lessons_module_id" ON "public"."lessons" USING "btree" ("module_id");



CREATE INDEX "idx_lessons_module_order" ON "public"."lessons" USING "btree" ("module_id", "order_index") WHERE ("is_published" = true);



CREATE INDEX "idx_lessons_order" ON "public"."lessons" USING "btree" ("order_index");



CREATE INDEX "idx_lessons_published" ON "public"."lessons" USING "btree" ("is_published");



CREATE INDEX "idx_login_attempts_email" ON "public"."login_attempts" USING "btree" ("email");



CREATE INDEX "idx_login_attempts_ip" ON "public"."login_attempts" USING "btree" ("ip_address");



CREATE INDEX "idx_messages_author" ON "public"."messages" USING "btree" ("sender_id");



CREATE INDEX "idx_messages_created_at" ON "public"."messages" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_messages_created_at_brin" ON "public"."messages" USING "brin" ("created_at");



CREATE INDEX "idx_messages_premium" ON "public"."messages" USING "btree" ("created_at" DESC) WHERE ("token_tag" = ANY (ARRAY['LUCK'::"text", 'LIVE'::"text", 'LOVE'::"text", 'LIFE'::"text"]));



CREATE INDEX "idx_messages_room" ON "public"."messages" USING "btree" ("room_id");



CREATE INDEX "idx_messages_room_created" ON "public"."messages" USING "btree" ("room_id", "created_at" DESC);



CREATE INDEX "idx_messages_room_id" ON "public"."messages" USING "btree" ("room_id");



CREATE INDEX "idx_messages_room_type" ON "public"."messages" USING "btree" ("room_type");



CREATE INDEX "idx_messages_sender" ON "public"."messages" USING "btree" ("sender_id");



CREATE INDEX "idx_messages_sender_created" ON "public"."messages" USING "btree" ("sender_id", "created_at" DESC);



CREATE INDEX "idx_messages_sender_id" ON "public"."messages" USING "btree" ("sender_id");



CREATE INDEX "idx_messages_sender_room" ON "public"."messages" USING "btree" ("sender_id", "room_id");



CREATE INDEX "idx_messages_sender_token" ON "public"."messages" USING "btree" ("sender_id", "token_tag");



CREATE INDEX "idx_messages_token_tag" ON "public"."messages" USING "btree" ("token_tag");



CREATE INDEX "idx_messages_user_token" ON "public"."messages" USING "btree" ("sender_id", "token_tag");



CREATE INDEX "idx_notification_preferences_user" ON "public"."notification_preferences" USING "btree" ("user_id", "platform");



CREATE INDEX "idx_notifications_unread" ON "public"."notifications" USING "btree" ("user_id") WHERE ("is_read" = false);



CREATE INDEX "idx_notifications_user" ON "public"."notifications" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "idx_participation_activity" ON "public"."participation" USING "btree" ("activity_type");



CREATE INDEX "idx_participation_metadata" ON "public"."participation" USING "gin" ("metadata");



CREATE INDEX "idx_participation_platform" ON "public"."participation" USING "btree" ("platform");



CREATE INDEX "idx_participation_platform_user" ON "public"."participation" USING "btree" ("platform", "user_id");



CREATE INDEX "idx_participation_user" ON "public"."participation" USING "btree" ("user_id");



CREATE INDEX "idx_participation_user_platform" ON "public"."participation" USING "btree" ("user_id", "platform");



CREATE INDEX "idx_performance_metrics_lookup" ON "public"."performance_metrics" USING "btree" ("metric_name", "timestamp" DESC);



CREATE INDEX "idx_platform_customization_lookup" ON "public"."platform_customization" USING "btree" ("platform", "component_key");



CREATE INDEX "idx_platform_state_user_id" ON "public"."platform_state" USING "btree" ("user_id");



CREATE UNIQUE INDEX "idx_platform_state_user_platform_key" ON "public"."platform_state" USING "btree" ("user_id", "platform", "key");



CREATE INDEX "idx_popular_searches_usage" ON "public"."popular_searches" USING "btree" ("total_searches" DESC, "last_used_at" DESC);



CREATE INDEX "idx_post_reactions_post" ON "public"."post_reactions" USING "btree" ("post_id");



CREATE INDEX "idx_post_reactions_user" ON "public"."post_reactions" USING "btree" ("user_id");



CREATE INDEX "idx_posts_author" ON "public"."posts" USING "btree" ("author_id");



CREATE INDEX "idx_posts_author_id" ON "public"."posts" USING "btree" ("author_id");



CREATE INDEX "idx_posts_author_token" ON "public"."posts" USING "btree" ("author_id", "token_tag", "created_at" DESC);



CREATE INDEX "idx_posts_created_at" ON "public"."posts" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_posts_created_at_brin" ON "public"."posts" USING "brin" ("created_at");



CREATE INDEX "idx_posts_created_at_token" ON "public"."posts" USING "btree" ("created_at" DESC, "token_tag");



CREATE INDEX "idx_posts_discover" ON "public"."posts" USING "btree" ("created_at" DESC) INCLUDE ("author_id", "content", "token_tag");



CREATE INDEX "idx_posts_platform" ON "public"."posts" USING "btree" ("platform");



CREATE INDEX "idx_posts_premium" ON "public"."posts" USING "btree" ("created_at" DESC) WHERE ("token_tag" = ANY (ARRAY['LUCK'::"text", 'LIVE'::"text", 'LOVE'::"text", 'LIFE'::"text"]));



CREATE INDEX "idx_posts_token_tag" ON "public"."posts" USING "btree" ("token_tag");



CREATE INDEX "idx_posts_user_token" ON "public"."posts" USING "btree" ("author_id", "token_tag");



CREATE INDEX "idx_posts_visibility" ON "public"."posts" USING "btree" ("visibility");



CREATE INDEX "idx_profiles_email" ON "public"."profiles" USING "btree" ("email");



CREATE INDEX "idx_profiles_platforms" ON "public"."profiles" USING "gin" ("platforms");



CREATE INDEX "idx_profiles_roles" ON "public"."profiles" USING "btree" ("is_guardian", "is_ascender", "is_neothinker", "is_immortal");



CREATE INDEX "idx_profiles_subscription" ON "public"."profiles" USING "btree" ("subscription_status", "subscription_tier");



CREATE INDEX "idx_rate_limits_identifier_window" ON "public"."rate_limits" USING "btree" ("identifier", "window_start");



CREATE INDEX "idx_rate_limits_window" ON "public"."rate_limits" USING "btree" ("window_start");



CREATE INDEX "idx_resources_metadata" ON "public"."resources" USING "gin" ("metadata");



CREATE INDEX "idx_resources_platform" ON "public"."resources" USING "btree" ("platform");



CREATE INDEX "idx_resources_platform_published" ON "public"."resources" USING "btree" ("platform", "is_published");



CREATE INDEX "idx_resources_platform_type" ON "public"."resources" USING "btree" ("platform", "resource_type") WHERE ("is_published" = true);



CREATE INDEX "idx_resources_published" ON "public"."resources" USING "btree" ("is_published");



CREATE INDEX "idx_resources_type" ON "public"."resources" USING "btree" ("resource_type");



CREATE INDEX "idx_room_participants_room" ON "public"."room_participants" USING "btree" ("room_id");



CREATE INDEX "idx_room_participants_user" ON "public"."room_participants" USING "btree" ("user_id");



CREATE INDEX "idx_rooms_created_at" ON "public"."rooms" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_rooms_type" ON "public"."rooms" USING "btree" ("room_type");



CREATE INDEX "idx_search_analytics_query" ON "public"."search_analytics" USING "btree" ("query" "text_pattern_ops");



CREATE INDEX "idx_search_analytics_user" ON "public"."search_analytics" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "idx_search_suggestions_trigger" ON "public"."search_suggestions" USING "btree" ("trigger_term" "text_pattern_ops");



CREATE INDEX "idx_search_vectors_content" ON "public"."search_vectors" USING "btree" ("content_type", "content_id");



CREATE INDEX "idx_search_vectors_vector" ON "public"."search_vectors" USING "gin" ("search_vector");



CREATE INDEX "idx_security_events_created" ON "public"."security_events" USING "btree" ("created_at");



CREATE INDEX "idx_security_events_type_severity" ON "public"."security_events" USING "btree" ("event_type", "severity");



CREATE INDEX "idx_security_events_user" ON "public"."security_events" USING "btree" ("user_id");



CREATE INDEX "idx_skill_requirements_lookup" ON "public"."skill_requirements" USING "btree" ("content_type", "content_id");



CREATE INDEX "idx_social_interactions_activity" ON "public"."social_interactions" USING "btree" ("activity_id", "interaction_type");



CREATE INDEX "idx_suspicious_activities_type" ON "public"."suspicious_activities" USING "btree" ("activity_type");



CREATE INDEX "idx_suspicious_activities_user" ON "public"."suspicious_activities" USING "btree" ("user_id");



CREATE INDEX "idx_system_alerts_status" ON "public"."system_alerts" USING "btree" ("severity", "created_at" DESC) WHERE ("resolved_at" IS NULL);



CREATE INDEX "idx_tenant_api_keys_key" ON "public"."tenant_api_keys" USING "btree" ("api_key");



CREATE INDEX "idx_tenant_api_keys_tenant" ON "public"."tenant_api_keys" USING "btree" ("tenant_id");



CREATE INDEX "idx_tenant_domains_domain" ON "public"."tenant_domains" USING "btree" ("domain");



CREATE INDEX "idx_tenant_domains_tenant_id" ON "public"."tenant_domains" USING "btree" ("tenant_id");



CREATE INDEX "idx_tenant_domains_tenant_primary" ON "public"."tenant_domains" USING "btree" ("tenant_id", "is_primary");



CREATE INDEX "idx_tenant_users_status" ON "public"."tenant_users" USING "btree" ("status");



CREATE INDEX "idx_tenant_users_tenant_id" ON "public"."tenant_users" USING "btree" ("tenant_id");



CREATE INDEX "idx_tenant_users_tenant_role" ON "public"."tenant_users" USING "btree" ("tenant_id", "role");



CREATE INDEX "idx_tenant_users_tenant_user" ON "public"."tenant_users" USING "btree" ("tenant_id", "user_id");



CREATE INDEX "idx_tenant_users_user_id" ON "public"."tenant_users" USING "btree" ("user_id");



CREATE INDEX "idx_tenants_slug" ON "public"."tenants" USING "btree" ("slug");



CREATE INDEX "idx_token_balances_updated" ON "public"."token_balances" USING "btree" ("updated_at" DESC);



CREATE INDEX "idx_token_balances_user" ON "public"."token_balances" USING "btree" ("user_id", "updated_at" DESC);



CREATE INDEX "idx_token_balances_user_id" ON "public"."token_balances" USING "btree" ("user_id");



CREATE INDEX "idx_token_balances_user_tokens" ON "public"."token_balances" USING "btree" ("user_id", "updated_at" DESC);



CREATE INDEX "idx_token_balances_user_updated" ON "public"."token_balances" USING "btree" ("user_id", "updated_at" DESC);



CREATE UNIQUE INDEX "idx_token_history_unique" ON "public"."token_history" USING "btree" ("user_id", "day", "token_tag");



CREATE INDEX "idx_token_transactions_created" ON "public"."token_transactions" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_token_transactions_created_at" ON "public"."token_transactions" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_token_transactions_token_type" ON "public"."token_transactions" USING "btree" ("token_type");



CREATE INDEX "idx_token_transactions_type" ON "public"."token_transactions" USING "btree" ("token_type");



CREATE INDEX "idx_token_transactions_user" ON "public"."token_transactions" USING "btree" ("user_id");



CREATE INDEX "idx_token_transactions_user_id" ON "public"."token_transactions" USING "btree" ("user_id");



CREATE INDEX "idx_user_achievements_lookup" ON "public"."user_achievements" USING "btree" ("user_id", "badge_id");



CREATE INDEX "idx_user_achievements_user" ON "public"."user_achievements" USING "btree" ("user_id");



CREATE INDEX "idx_user_activity_stats_lookup" ON "public"."user_activity_stats" USING "btree" ("user_id", "platform", "activity_date");



CREATE INDEX "idx_user_activity_stats_platform_date" ON "public"."user_activity_stats" USING "btree" ("platform", "activity_date");



CREATE INDEX "idx_user_assessments_user_platform" ON "public"."user_assessments" USING "btree" ("user_id", "platform");



CREATE INDEX "idx_user_community_user_platform" ON "public"."user_community" USING "btree" ("user_id", "platform");



CREATE INDEX "idx_user_connections_lookup" ON "public"."user_connections" USING "btree" ("user_id", "connected_user_id");



CREATE INDEX "idx_user_external_mappings_ext_id" ON "public"."user_external_mappings" USING "btree" ("external_id", "external_provider");



CREATE INDEX "idx_user_mentions_mentioned" ON "public"."user_mentions" USING "btree" ("mentioned_user_id", "created_at" DESC);



CREATE INDEX "idx_user_onboarding_user_platform" ON "public"."user_onboarding" USING "btree" ("user_id", "platform");



CREATE INDEX "idx_user_platform_preferences_composite" ON "public"."user_platform_preferences" USING "btree" ("user_id", "platform_slug");



CREATE INDEX "idx_user_platform_preferences_user_id" ON "public"."user_platform_preferences" USING "btree" ("user_id");



CREATE INDEX "idx_user_points_user_id" ON "public"."user_points" USING "btree" ("user_id");



CREATE INDEX "idx_user_profiles_user_platform" ON "public"."user_profiles" USING "btree" ("user_id", "platform");



CREATE INDEX "idx_user_recommendations_expiry" ON "public"."user_recommendations" USING "btree" ("expires_at") WHERE ("expires_at" IS NOT NULL);



CREATE INDEX "idx_user_recommendations_lookup" ON "public"."user_recommendations" USING "btree" ("user_id", "platform", "relevance_score" DESC);



CREATE INDEX "idx_user_segments_lookup" ON "public"."user_segments" USING "btree" ("platform", "segment_name");



CREATE INDEX "idx_user_skills_lookup" ON "public"."user_skills" USING "btree" ("user_id", "skill_name");



CREATE INDEX "idx_vital_signs_measured_at" ON "public"."vital_signs" USING "btree" ("measured_at");



CREATE INDEX "idx_vital_signs_user_id" ON "public"."vital_signs" USING "btree" ("user_id");



CREATE INDEX "idx_vital_signs_vital_type" ON "public"."vital_signs" USING "btree" ("vital_type");



CREATE INDEX "idx_zoom_attendance_join" ON "public"."zoom_attendance" USING "btree" ("join_time");



CREATE INDEX "idx_zoom_attendance_meeting" ON "public"."zoom_attendance" USING "btree" ("meeting_id");



CREATE INDEX "idx_zoom_attendance_user" ON "public"."zoom_attendance" USING "btree" ("user_id");



CREATE INDEX "notifications_user_id_idx" ON "public"."notifications" USING "btree" ("user_id", "is_read", "created_at" DESC);



CREATE INDEX "security_logs_event_type_idx" ON "public"."security_logs" USING "btree" ("event_type");



CREATE INDEX "security_logs_severity_idx" ON "public"."security_logs" USING "btree" ("severity");



CREATE INDEX "security_logs_timestamp_idx" ON "public"."security_logs" USING "btree" ("timestamp" DESC);



CREATE INDEX "security_logs_user_id_idx" ON "public"."security_logs" USING "btree" ("user_id");



CREATE INDEX "token_conversions_sim_run_idx" ON "public"."token_conversions" USING "btree" ("simulation_run_id");



CREATE INDEX "token_conversions_site_idx" ON "public"."token_conversions" USING "btree" ("site");



CREATE INDEX "token_sinks_sim_run_idx" ON "public"."token_sinks" USING "btree" ("simulation_run_id");



CREATE INDEX "token_sinks_site_idx" ON "public"."token_sinks" USING "btree" ("site");



CREATE INDEX "user_platform_preferences_platform_slug_idx" ON "public"."user_platform_preferences" USING "btree" ("platform_slug");



CREATE INDEX "user_platform_preferences_user_id_idx" ON "public"."user_platform_preferences" USING "btree" ("user_id");



CREATE INDEX "xp_events_sim_run_idx" ON "public"."xp_events" USING "btree" ("simulation_run_id");



ALTER INDEX "public"."idx_feedback_app_date" ATTACH PARTITION "public"."feedback_ascenders_app_name_created_at_idx";



ALTER INDEX "public"."idx_feedback_created_at" ATTACH PARTITION "public"."feedback_ascenders_created_at_idx";



ALTER INDEX "public"."feedback_pkey" ATTACH PARTITION "public"."feedback_ascenders_pkey";



ALTER INDEX "public"."idx_feedback_user_id_app_name" ATTACH PARTITION "public"."feedback_ascenders_user_id_app_name_idx";



ALTER INDEX "public"."idx_feedback_user_id" ATTACH PARTITION "public"."feedback_ascenders_user_id_idx";



ALTER INDEX "public"."idx_feedback_app_date" ATTACH PARTITION "public"."feedback_hub_app_name_created_at_idx";



ALTER INDEX "public"."idx_feedback_created_at" ATTACH PARTITION "public"."feedback_hub_created_at_idx";



ALTER INDEX "public"."feedback_pkey" ATTACH PARTITION "public"."feedback_hub_pkey";



ALTER INDEX "public"."idx_feedback_user_id_app_name" ATTACH PARTITION "public"."feedback_hub_user_id_app_name_idx";



ALTER INDEX "public"."idx_feedback_user_id" ATTACH PARTITION "public"."feedback_hub_user_id_idx";



ALTER INDEX "public"."idx_feedback_app_date" ATTACH PARTITION "public"."feedback_immortals_app_name_created_at_idx";



ALTER INDEX "public"."idx_feedback_created_at" ATTACH PARTITION "public"."feedback_immortals_created_at_idx";



ALTER INDEX "public"."feedback_pkey" ATTACH PARTITION "public"."feedback_immortals_pkey";



ALTER INDEX "public"."idx_feedback_user_id_app_name" ATTACH PARTITION "public"."feedback_immortals_user_id_app_name_idx";



ALTER INDEX "public"."idx_feedback_user_id" ATTACH PARTITION "public"."feedback_immortals_user_id_idx";



ALTER INDEX "public"."idx_feedback_app_date" ATTACH PARTITION "public"."feedback_neothinkers_app_name_created_at_idx";



ALTER INDEX "public"."idx_feedback_created_at" ATTACH PARTITION "public"."feedback_neothinkers_created_at_idx";



ALTER INDEX "public"."feedback_pkey" ATTACH PARTITION "public"."feedback_neothinkers_pkey";



ALTER INDEX "public"."idx_feedback_user_id_app_name" ATTACH PARTITION "public"."feedback_neothinkers_user_id_app_name_idx";



ALTER INDEX "public"."idx_feedback_user_id" ATTACH PARTITION "public"."feedback_neothinkers_user_id_idx";



CREATE OR REPLACE TRIGGER "on_auth_user_created" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();



CREATE OR REPLACE TRIGGER "clean_chat_history_trigger" AFTER INSERT ON "public"."chat_history" FOR EACH STATEMENT WHEN ((EXTRACT(hour FROM "now"()) = (0)::numeric)) EXECUTE FUNCTION "public"."clean_chat_history"();



CREATE OR REPLACE TRIGGER "content_update_notify" AFTER INSERT OR UPDATE ON "public"."content" FOR EACH ROW EXECUTE FUNCTION "public"."notify_content_update"();



CREATE OR REPLACE TRIGGER "messages_notify_trigger" AFTER INSERT OR UPDATE ON "public"."messages" FOR EACH ROW EXECUTE FUNCTION "public"."handle_message_changes"();



CREATE OR REPLACE TRIGGER "notify_new_message_trigger" AFTER INSERT ON "public"."chat_messages" FOR EACH ROW EXECUTE FUNCTION "public"."notify_new_message"();



CREATE OR REPLACE TRIGGER "on_profile_created" AFTER INSERT ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();



CREATE OR REPLACE TRIGGER "on_profile_platform_change" AFTER UPDATE OF "platforms" ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."handle_profile_platform_changes"();



CREATE OR REPLACE TRIGGER "posts_notify_trigger" AFTER INSERT OR DELETE OR UPDATE ON "public"."posts" FOR EACH ROW EXECUTE FUNCTION "public"."handle_post_changes"();



CREATE OR REPLACE TRIGGER "set_governance_proposals_timestamp" BEFORE UPDATE ON "public"."governance_proposals" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_tokens_timestamp" BEFORE UPDATE ON "public"."tokens" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."feedback" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at_timestamp" BEFORE UPDATE ON "public"."content_modules" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at_timestamp" BEFORE UPDATE ON "public"."lessons" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at_timestamp" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at_timestamp" BEFORE UPDATE ON "public"."resources" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "set_user_gamification_stats_timestamp" BEFORE UPDATE ON "public"."user_gamification_stats" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "trg_broadcast_post" AFTER INSERT ON "public"."posts" FOR EACH ROW EXECUTE FUNCTION "public"."broadcast_post"();



CREATE OR REPLACE TRIGGER "trg_broadcast_room_message" AFTER INSERT ON "public"."messages" FOR EACH ROW EXECUTE FUNCTION "public"."broadcast_room_message"();



CREATE OR REPLACE TRIGGER "trg_messages_award_tokens" BEFORE INSERT OR UPDATE OF "token_tag" ON "public"."messages" FOR EACH ROW WHEN ((("new"."token_tag" IS NOT NULL) AND (NOT "new"."reward_processed"))) EXECUTE FUNCTION "public"."award_message_tokens"();



CREATE OR REPLACE TRIGGER "trg_messages_notify" AFTER INSERT OR UPDATE ON "public"."messages" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_message"();



CREATE OR REPLACE TRIGGER "trg_notify_token_earnings" AFTER UPDATE OF "luck_balance", "live_balance", "love_balance", "life_balance" ON "public"."token_balances" FOR EACH ROW EXECUTE FUNCTION "public"."notify_token_earnings"();



CREATE OR REPLACE TRIGGER "trg_posts_award_tokens" BEFORE INSERT OR UPDATE OF "token_tag" ON "public"."posts" FOR EACH ROW WHEN ((("new"."token_tag" IS NOT NULL) AND (NOT "new"."reward_processed"))) EXECUTE FUNCTION "public"."award_post_tokens"();



CREATE OR REPLACE TRIGGER "trg_posts_notify" AFTER INSERT OR UPDATE ON "public"."posts" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_post"();



CREATE OR REPLACE TRIGGER "trg_refresh_token_statistics" AFTER INSERT OR DELETE OR UPDATE ON "public"."posts" FOR EACH STATEMENT EXECUTE FUNCTION "public"."refresh_token_statistics"();



CREATE OR REPLACE TRIGGER "trg_token_balances_notify" AFTER UPDATE ON "public"."token_balances" FOR EACH ROW EXECUTE FUNCTION "public"."handle_token_update"();



CREATE OR REPLACE TRIGGER "trigger_cleanup_old_rate_limits" AFTER INSERT ON "public"."rate_limits" FOR EACH STATEMENT EXECUTE FUNCTION "public"."cleanup_old_rate_limits"();



CREATE OR REPLACE TRIGGER "trigger_cleanup_rate_limits" AFTER INSERT ON "public"."rate_limits" FOR EACH STATEMENT EXECUTE FUNCTION "public"."cleanup_old_rate_limits"();



CREATE OR REPLACE TRIGGER "trigger_delete_old_chat_history" AFTER INSERT ON "public"."chat_history" FOR EACH ROW WHEN (((EXTRACT(minute FROM "now"()))::integer = 0)) EXECUTE FUNCTION "public"."delete_old_chat_history"();



CREATE OR REPLACE TRIGGER "trigger_governance_proposal_approval" BEFORE UPDATE OF "status" ON "public"."governance_proposals" FOR EACH ROW EXECUTE FUNCTION "public"."handle_governance_proposal_update"();



CREATE OR REPLACE TRIGGER "trigger_new_post" AFTER INSERT ON "public"."posts" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_post"();



CREATE OR REPLACE TRIGGER "update_conversation_timestamp_trigger" AFTER INSERT ON "public"."chat_messages" FOR EACH ROW EXECUTE FUNCTION "public"."update_conversation_timestamp"();



CREATE OR REPLACE TRIGGER "update_platform_state_updated_at" BEFORE UPDATE ON "public"."platform_state" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_auth_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "auth"."mfa_factors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_flow_state_id_fkey" FOREIGN KEY ("flow_state_id") REFERENCES "auth"."flow_state"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."activity_feed"
    ADD CONSTRAINT "activity_feed_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."ai_analytics"
    ADD CONSTRAINT "ai_analytics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."ai_conversations"
    ADD CONSTRAINT "ai_conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ai_messages"
    ADD CONSTRAINT "ai_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."ai_conversations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ai_suggestions"
    ADD CONSTRAINT "ai_suggestions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."ai_usage_metrics"
    ADD CONSTRAINT "ai_usage_metrics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ai_vector_collection_mappings"
    ADD CONSTRAINT "ai_vector_collection_mappings_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "public"."ai_vector_collections"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ai_vector_collection_mappings"
    ADD CONSTRAINT "ai_vector_collection_mappings_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."ai_vector_documents"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."analytics_events"
    ADD CONSTRAINT "analytics_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."analytics_reports"
    ADD CONSTRAINT "analytics_reports_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."ascenders_profiles"
    ADD CONSTRAINT "ascenders_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."auth_logs"
    ADD CONSTRAINT "auth_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."badge_events"
    ADD CONSTRAINT "badge_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_history"
    ADD CONSTRAINT "chat_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."chat_participants"
    ADD CONSTRAINT "chat_participants_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."chat_rooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_participants"
    ADD CONSTRAINT "chat_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."collaboration_bonuses"
    ADD CONSTRAINT "collaboration_bonuses_group_action_id_fkey" FOREIGN KEY ("group_action_id") REFERENCES "public"."group_actions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."collaboration_bonuses"
    ADD CONSTRAINT "collaboration_bonuses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."collaborative_challenges"
    ADD CONSTRAINT "collaborative_challenges_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."concept_relationships"
    ADD CONSTRAINT "concept_relationships_source_concept_id_fkey" FOREIGN KEY ("source_concept_id") REFERENCES "public"."concepts"("id");



ALTER TABLE ONLY "public"."concept_relationships"
    ADD CONSTRAINT "concept_relationships_target_concept_id_fkey" FOREIGN KEY ("target_concept_id") REFERENCES "public"."concepts"("id");



ALTER TABLE ONLY "public"."concepts"
    ADD CONSTRAINT "concepts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."content_content_tags"
    ADD CONSTRAINT "content_content_tags_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "public"."shared_content"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."content_content_tags"
    ADD CONSTRAINT "content_content_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."content_tags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."content_schedule"
    ADD CONSTRAINT "content_schedule_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."content_versions"
    ADD CONSTRAINT "content_versions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."content_versions"
    ADD CONSTRAINT "content_versions_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."content_workflow"
    ADD CONSTRAINT "content_workflow_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."content_workflow_history"
    ADD CONSTRAINT "content_workflow_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."content_workflow_history"
    ADD CONSTRAINT "content_workflow_history_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "public"."content_workflow"("id");



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."crowdfunding"
    ADD CONSTRAINT "crowdfunding_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "public"."proposals"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."crowdfunding"
    ADD CONSTRAINT "crowdfunding_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."crowdfunding"
    ADD CONSTRAINT "crowdfunding_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."csrf_tokens"
    ADD CONSTRAINT "csrf_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."data_transfer_logs"
    ADD CONSTRAINT "data_transfer_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."discussion_posts"
    ADD CONSTRAINT "discussion_posts_parent_post_id_fkey" FOREIGN KEY ("parent_post_id") REFERENCES "public"."discussion_posts"("id");



ALTER TABLE ONLY "public"."discussion_posts"
    ADD CONSTRAINT "discussion_posts_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."discussion_topics"("id");



ALTER TABLE ONLY "public"."discussion_posts"
    ADD CONSTRAINT "discussion_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."discussion_topics"
    ADD CONSTRAINT "discussion_topics_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."error_logs"
    ADD CONSTRAINT "error_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."event_attendees"
    ADD CONSTRAINT "event_attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_attendees"
    ADD CONSTRAINT "event_attendees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_registrations"
    ADD CONSTRAINT "event_registrations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_registrations"
    ADD CONSTRAINT "event_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE "public"."feedback"
    ADD CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."fibonacci_token_rewards"
    ADD CONSTRAINT "fibonacci_token_rewards_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "public"."user_actions"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."fibonacci_token_rewards"
    ADD CONSTRAINT "fibonacci_token_rewards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_actions"
    ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."gamification_events"
    ADD CONSTRAINT "gamification_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."governance_proposals"
    ADD CONSTRAINT "governance_proposals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."group_actions"
    ADD CONSTRAINT "group_actions_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."health_integrations"
    ADD CONSTRAINT "health_integrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."health_metrics"
    ADD CONSTRAINT "health_metrics_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "public"."health_integrations"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."health_metrics"
    ADD CONSTRAINT "health_metrics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hub_profiles"
    ADD CONSTRAINT "hub_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."immortals_profiles"
    ADD CONSTRAINT "immortals_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."integration_settings"
    ADD CONSTRAINT "integration_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."journal_entries"
    ADD CONSTRAINT "journal_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."learning_path_items"
    ADD CONSTRAINT "learning_path_items_path_id_fkey" FOREIGN KEY ("path_id") REFERENCES "public"."learning_paths"("id");



ALTER TABLE ONLY "public"."learning_progress"
    ADD CONSTRAINT "learning_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."learning_recommendations"
    ADD CONSTRAINT "learning_recommendations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "public"."content_modules"("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."chat_rooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."modules"
    ADD CONSTRAINT "modules_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."neothinkers_profiles"
    ADD CONSTRAINT "neothinkers_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."notification_preferences"
    ADD CONSTRAINT "notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."participation"
    ADD CONSTRAINT "participation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."platform_access"
    ADD CONSTRAINT "platform_access_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."platform_access"
    ADD CONSTRAINT "platform_access_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_comments"
    ADD CONSTRAINT "post_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_comments"
    ADD CONSTRAINT "post_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_likes"
    ADD CONSTRAINT "post_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_likes"
    ADD CONSTRAINT "post_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_reactions"
    ADD CONSTRAINT "post_reactions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_reactions"
    ADD CONSTRAINT "post_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."proposals"
    ADD CONSTRAINT "proposals_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."proposals"
    ADD CONSTRAINT "proposals_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."referral_bonuses"
    ADD CONSTRAINT "referral_bonuses_referred_id_fkey" FOREIGN KEY ("referred_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."referral_bonuses"
    ADD CONSTRAINT "referral_bonuses_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."referrals"
    ADD CONSTRAINT "referrals_referred_id_fkey" FOREIGN KEY ("referred_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."referrals"
    ADD CONSTRAINT "referrals_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."role_capabilities"
    ADD CONSTRAINT "role_capabilities_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."tenant_roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."room_participants"
    ADD CONSTRAINT "room_participants_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."room_participants"
    ADD CONSTRAINT "room_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rooms"
    ADD CONSTRAINT "rooms_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."search_analytics"
    ADD CONSTRAINT "search_analytics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."security_events"
    ADD CONSTRAINT "security_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."security_logs"
    ADD CONSTRAINT "security_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."shared_content"
    ADD CONSTRAINT "shared_content_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."shared_content"
    ADD CONSTRAINT "shared_content_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."content_categories"("id");



ALTER TABLE ONLY "public"."social_interactions"
    ADD CONSTRAINT "social_interactions_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "public"."activity_feed"("id");



ALTER TABLE ONLY "public"."social_interactions"
    ADD CONSTRAINT "social_interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."suspicious_activities"
    ADD CONSTRAINT "suspicious_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."team_memberships"
    ADD CONSTRAINT "team_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."tenant_api_keys"
    ADD CONSTRAINT "tenant_api_keys_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."tenant_api_keys"
    ADD CONSTRAINT "tenant_api_keys_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tenant_domains"
    ADD CONSTRAINT "tenant_domains_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tenant_roles"
    ADD CONSTRAINT "tenant_roles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tenant_shared_content"
    ADD CONSTRAINT "tenant_shared_content_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "public"."shared_content"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tenant_shared_content"
    ADD CONSTRAINT "tenant_shared_content_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tenant_subscriptions"
    ADD CONSTRAINT "tenant_subscriptions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tenant_users"
    ADD CONSTRAINT "tenant_users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tenant_users"
    ADD CONSTRAINT "tenant_users_tenant_role_id_fkey" FOREIGN KEY ("tenant_role_id") REFERENCES "public"."tenant_roles"("id");



ALTER TABLE ONLY "public"."tenant_users"
    ADD CONSTRAINT "tenant_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."thinking_assessments"
    ADD CONSTRAINT "thinking_assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."thought_exercises"
    ADD CONSTRAINT "thought_exercises_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."token_balances"
    ADD CONSTRAINT "token_balances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."token_conversions"
    ADD CONSTRAINT "token_conversions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."token_events"
    ADD CONSTRAINT "token_events_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."token_events"
    ADD CONSTRAINT "token_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."token_transactions"
    ADD CONSTRAINT "token_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tokens"
    ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_achievement_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "public"."achievements"("id");



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_actions"
    ADD CONSTRAINT "user_actions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_activity_stats"
    ADD CONSTRAINT "user_activity_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_ai_preferences"
    ADD CONSTRAINT "user_ai_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_assessments"
    ADD CONSTRAINT "user_assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_badges"
    ADD CONSTRAINT "user_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_badges"
    ADD CONSTRAINT "user_badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_community"
    ADD CONSTRAINT "user_community_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_concept_progress"
    ADD CONSTRAINT "user_concept_progress_concept_id_fkey" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id");



ALTER TABLE ONLY "public"."user_concept_progress"
    ADD CONSTRAINT "user_concept_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_connections"
    ADD CONSTRAINT "user_connections_connected_user_id_fkey" FOREIGN KEY ("connected_user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_connections"
    ADD CONSTRAINT "user_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_exercise_progress"
    ADD CONSTRAINT "user_exercise_progress_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."thought_exercises"("id");



ALTER TABLE ONLY "public"."user_exercise_progress"
    ADD CONSTRAINT "user_exercise_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_external_mappings"
    ADD CONSTRAINT "user_external_mappings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_gamification_stats"
    ADD CONSTRAINT "user_gamification_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_mentions"
    ADD CONSTRAINT "user_mentions_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "public"."activity_feed"("id");



ALTER TABLE ONLY "public"."user_mentions"
    ADD CONSTRAINT "user_mentions_mentioned_user_id_fkey" FOREIGN KEY ("mentioned_user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_onboarding"
    ADD CONSTRAINT "user_onboarding_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_platform_preferences"
    ADD CONSTRAINT "user_platform_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_points"
    ADD CONSTRAINT "user_points_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_recommendations"
    ADD CONSTRAINT "user_recommendations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_segments"
    ADD CONSTRAINT "user_segments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_skills"
    ADD CONSTRAINT "user_skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."vital_signs"
    ADD CONSTRAINT "vital_signs_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "public"."health_integrations"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."vital_signs"
    ADD CONSTRAINT "vital_signs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."votes"
    ADD CONSTRAINT "votes_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "public"."proposals"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."votes"
    ADD CONSTRAINT "votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."xp_events"
    ADD CONSTRAINT "xp_events_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."xp_events"
    ADD CONSTRAINT "xp_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."zoom_attendance"
    ADD CONSTRAINT "zoom_attendance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE "auth"."audit_log_entries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."flow_state" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."identities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."instances" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."mfa_amr_claims" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."mfa_challenges" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."mfa_factors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."one_time_tokens" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."refresh_tokens" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."saml_providers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."saml_relay_states" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."schema_migrations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."sso_domains" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."sso_providers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "auth"."users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Admin can access all AI configurations" ON "public"."ai_configurations" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admin can manage vector collections" ON "public"."ai_vector_collections" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admin can manage vector mappings" ON "public"."ai_vector_collection_mappings" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Administrators can manage tenant domains" ON "public"."tenant_domains" USING ((("auth"."role"() = 'authenticated'::"text") AND (( SELECT "profiles"."is_guardian"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) OR (EXISTS ( SELECT 1
   FROM "public"."tenant_users"
  WHERE (("tenant_users"."tenant_id" = "tenant_domains"."tenant_id") AND ("tenant_users"."user_id" = "auth"."uid"()) AND ("tenant_users"."role" = 'admin'::"text")))))));



CREATE POLICY "Administrators can manage tenant subscriptions" ON "public"."tenant_subscriptions" USING ((("auth"."role"() = 'authenticated'::"text") AND (( SELECT "profiles"."is_guardian"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) OR (EXISTS ( SELECT 1
   FROM "public"."tenant_users"
  WHERE (("tenant_users"."tenant_id" = "tenant_subscriptions"."tenant_id") AND ("tenant_users"."user_id" = "auth"."uid"()) AND ("tenant_users"."role" = 'admin'::"text")))))));



CREATE POLICY "Administrators can manage tenant users" ON "public"."tenant_users" USING ((("auth"."role"() = 'authenticated'::"text") AND ((( SELECT "profiles"."is_guardian"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = true) OR (EXISTS ( SELECT 1
   FROM "public"."tenant_users" "tu_admin"
  WHERE (("tu_admin"."tenant_id" = "tenant_users"."tenant_id") AND ("tu_admin"."user_id" = "auth"."uid"()) AND ("tu_admin"."role" = 'admin'::"text"))))))) WITH CHECK ((("auth"."role"() = 'authenticated'::"text") AND ((( SELECT "profiles"."is_guardian"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = true) OR (EXISTS ( SELECT 1
   FROM "public"."tenant_users" "tu_admin"
  WHERE (("tu_admin"."tenant_id" = "tenant_users"."tenant_id") AND ("tu_admin"."user_id" = "auth"."uid"()) AND ("tu_admin"."role" = 'admin'::"text")))))));



CREATE POLICY "Administrators can manage tenants" ON "public"."tenants" USING ((("auth"."role"() = 'authenticated'::"text") AND ( SELECT "profiles"."is_guardian"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"()))));



CREATE POLICY "Admins can create events" ON "public"."events" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can manage shared content" ON "public"."shared_content" USING ((("auth"."role"() = 'service_role'::"text") OR ("auth"."role"() = 'supabase_admin'::"text") OR (( SELECT "profiles"."is_guardian"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = true) OR ("author_id" = "auth"."uid"())));



CREATE POLICY "Admins can manage topics" ON "public"."discussion_topics" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can update events" ON "public"."events" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Allow admin full access via profiles" ON "public"."feedback" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Allow delete for admin" ON "public"."xp_multipliers" FOR DELETE USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Allow delete for authenticated" ON "public"."user_actions" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow delete for creator" ON "public"."proposals" FOR DELETE USING (("created_by" = "auth"."uid"()));



CREATE POLICY "Allow delete for self" ON "public"."team_memberships" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow delete for team creator" ON "public"."teams" FOR DELETE USING (("created_by" = "auth"."uid"()));



CREATE POLICY "Allow family_admin full access via profiles" ON "public"."feedback" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'family_admin'::"text")))));



CREATE POLICY "Allow insert for admin" ON "public"."xp_multipliers" FOR INSERT WITH CHECK (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Allow insert for authenticated" ON "public"."crowdfunding" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow insert for authenticated" ON "public"."group_actions" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow insert for authenticated" ON "public"."proposals" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow insert for authenticated" ON "public"."referrals" FOR INSERT WITH CHECK (("auth"."uid"() = "referrer_id"));



CREATE POLICY "Allow insert for authenticated" ON "public"."team_memberships" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow insert for authenticated" ON "public"."teams" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow insert for authenticated" ON "public"."user_actions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow insert for authenticated" ON "public"."user_badges" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow insert for authenticated" ON "public"."votes" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow insert for system" ON "public"."badge_events" FOR INSERT WITH CHECK (false);



CREATE POLICY "Allow insert for system" ON "public"."census_snapshots" FOR INSERT WITH CHECK (false);



CREATE POLICY "Allow insert for system" ON "public"."collaboration_bonuses" FOR INSERT WITH CHECK (false);



CREATE POLICY "Allow insert for system" ON "public"."fibonacci_token_rewards" FOR INSERT WITH CHECK (false);



CREATE POLICY "Allow insert for system" ON "public"."referral_bonuses" FOR INSERT WITH CHECK (false);



CREATE POLICY "Allow insert for system" ON "public"."token_events" FOR INSERT WITH CHECK (false);



CREATE POLICY "Allow insert for system" ON "public"."xp_events" FOR INSERT WITH CHECK (false);



CREATE POLICY "Allow own feedback insert" ON "public"."feedback" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow own feedback read" ON "public"."feedback" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow own feedback update" ON "public"."feedback" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow owner full CRUD access" ON "public"."journal_entries" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow owner full access" ON "public"."profiles" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Allow participants to insert messages as themselves" ON "public"."chat_messages" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND "public"."is_chat_participant"("conversation_id", "auth"."uid"())));



CREATE POLICY "Allow participants to view messages" ON "public"."chat_messages" FOR SELECT USING ("public"."is_chat_participant"("conversation_id", "auth"."uid"()));



CREATE POLICY "Allow select for all" ON "public"."badges" FOR SELECT USING (true);



CREATE POLICY "Allow select for authenticated" ON "public"."badge_events" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow select for authenticated" ON "public"."census_snapshots" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow select for authenticated" ON "public"."collaboration_bonuses" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow select for authenticated" ON "public"."crowdfunding" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow select for authenticated" ON "public"."fibonacci_token_rewards" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow select for authenticated" ON "public"."group_actions" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow select for authenticated" ON "public"."proposals" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow select for authenticated" ON "public"."referral_bonuses" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow select for authenticated" ON "public"."referrals" FOR SELECT USING ((("auth"."uid"() = "referrer_id") OR ("auth"."uid"() = "referred_id")));



CREATE POLICY "Allow select for authenticated" ON "public"."team_memberships" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow select for authenticated" ON "public"."teams" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow select for authenticated" ON "public"."token_events" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow select for authenticated" ON "public"."user_actions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow select for authenticated" ON "public"."user_badges" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow select for authenticated" ON "public"."user_roles" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow select for authenticated" ON "public"."votes" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow select for authenticated" ON "public"."xp_events" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow select for authenticated" ON "public"."xp_multipliers" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow update for admin" ON "public"."xp_multipliers" FOR UPDATE USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Allow update for authenticated" ON "public"."user_actions" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow update for creator" ON "public"."proposals" FOR UPDATE USING (("created_by" = "auth"."uid"()));



CREATE POLICY "Allow update for self" ON "public"."user_roles" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow update for team creator" ON "public"."teams" FOR UPDATE USING (("created_by" = "auth"."uid"()));



CREATE POLICY "Allow users to view own participation" ON "public"."chat_participants" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Anyone can read achievements" ON "public"."achievements" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Anyone can read community features" ON "public"."community_features" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Anyone can read posts" ON "public"."posts" FOR SELECT USING (true);



CREATE POLICY "Anyone can view discussion posts" ON "public"."discussion_posts" FOR SELECT USING (true);



CREATE POLICY "Anyone can view published shared content" ON "public"."shared_content" FOR SELECT USING (("is_published" = true));



CREATE POLICY "Ascenders can access flow templates" ON "public"."flow_templates" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."platform_access"
  WHERE (("platform_access"."user_id" = "auth"."uid"()) AND ("platform_access"."platform_slug" = 'ascenders'::"text")))));



CREATE POLICY "Authenticated users can read events" ON "public"."events" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can read proposals" ON "public"."governance_proposals" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can read vector documents" ON "public"."ai_vector_documents" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Content is viewable by authenticated users" ON "public"."content" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable insert for authenticated users" ON "public"."popular_searches" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users" ON "public"."search_vectors" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable read access for authenticated users" ON "public"."search_vectors" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable update for authenticated users" ON "public"."popular_searches" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for authenticated users" ON "public"."search_vectors" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Events are editable by service role" ON "public"."events" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Events are insertable by authenticated users" ON "public"."analytics_events" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Events are viewable by admins" ON "public"."analytics_events" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Events are viewable by authenticated users" ON "public"."events" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Everyone can read AI configurations" ON "public"."ai_configurations" FOR SELECT USING (true);



CREATE POLICY "Everyone can read vector collections" ON "public"."ai_vector_collections" FOR SELECT USING (true);



CREATE POLICY "Everyone can read vector mappings" ON "public"."ai_vector_collection_mappings" FOR SELECT USING (true);



CREATE POLICY "Everyone can view active tenants" ON "public"."tenants" FOR SELECT USING (("status" = 'active'::"text"));



CREATE POLICY "Everyone can view popular searches" ON "public"."popular_searches" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Everyone can view skill requirements" ON "public"."skill_requirements" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Everyone can view tenant domains" ON "public"."tenant_domains" FOR SELECT USING (true);



CREATE POLICY "Guardians can manage all analytics events" ON "public"."analytics_events" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_guardian" = true)))));



CREATE POLICY "Guardians can manage all profiles" ON "public"."profiles" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "profiles_1"
  WHERE (("profiles_1"."id" = "auth"."uid"()) AND ("profiles_1"."is_guardian" = true)))));



CREATE POLICY "Guardians can manage content" ON "public"."content_modules" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."is_guardian" = true))));



CREATE POLICY "Guardians can manage lessons" ON "public"."lessons" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."is_guardian" = true))));



CREATE POLICY "Guardians can manage platform access" ON "public"."platform_access" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_guardian" = true)))));



CREATE POLICY "Guardians can manage resources" ON "public"."resources" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."is_guardian" = true))));



CREATE POLICY "Guardians can view all analytics events" ON "public"."analytics_events" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_guardian" = true)))));



CREATE POLICY "Guardians can view all participation" ON "public"."participation" FOR SELECT USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."is_guardian" = true))));



CREATE POLICY "Immortals can access supplements" ON "public"."supplements" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."platform_access"
  WHERE (("platform_access"."user_id" = "auth"."uid"()) AND ("platform_access"."platform_slug" = 'immortals'::"text")))));



CREATE POLICY "Insert positive-sum events" ON "public"."gamification_events" FOR INSERT WITH CHECK ((("auth"."role"() = 'authenticated'::"text") AND ("amount" >= (0)::numeric)));



CREATE POLICY "Insert site_settings for authenticated" ON "public"."site_settings" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Insert token_conversions for authenticated" ON "public"."token_conversions" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Insert token_sinks for authenticated" ON "public"."token_sinks" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Login attempts are only visible to guardians" ON "public"."login_attempts" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("auth"."uid"() = "users"."id") AND (("users"."raw_user_meta_data" ->> 'role'::"text") = 'guardian'::"text")))));



CREATE POLICY "Neothinkers can access Mark Hamilton content" ON "public"."mark_hamilton_content" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."platform_access"
  WHERE (("platform_access"."user_id" = "auth"."uid"()) AND ("platform_access"."platform_slug" = 'neothinkers'::"text")))));



CREATE POLICY "No delete" ON "public"."gamification_events" FOR DELETE USING (false);



CREATE POLICY "No delete site_settings" ON "public"."site_settings" FOR DELETE USING (false);



CREATE POLICY "No delete token_conversions" ON "public"."token_conversions" FOR DELETE USING (false);



CREATE POLICY "No delete token_sinks" ON "public"."token_sinks" FOR DELETE USING (false);



CREATE POLICY "No update or delete" ON "public"."gamification_events" FOR UPDATE USING (false);



CREATE POLICY "No update or delete site_settings" ON "public"."site_settings" FOR UPDATE USING (false);



CREATE POLICY "No update or delete token_conversions" ON "public"."token_conversions" FOR UPDATE USING (false);



CREATE POLICY "No update or delete token_sinks" ON "public"."token_sinks" FOR UPDATE USING (false);



CREATE POLICY "Platform-specific content access" ON "public"."content_modules" FOR SELECT USING ((("is_published" = true) AND ("platform" = ANY (COALESCE(( SELECT "profiles"."platforms"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())), ARRAY[]::"text"[])))));



CREATE POLICY "Platform-specific resource access" ON "public"."resources" FOR SELECT USING ((("is_published" = true) AND ("platform" = ANY (COALESCE(( SELECT "profiles"."platforms"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())), ARRAY[]::"text"[])))));



CREATE POLICY "Premium posts require premium subscription" ON "public"."posts" FOR SELECT USING ((("visibility" = 'public'::"text") OR (("visibility" = 'premium'::"text") AND "public"."is_premium_subscriber"("auth"."uid"())) OR (("visibility" = 'superachiever'::"text") AND "public"."is_superachiever"("auth"."uid"()))));



CREATE POLICY "Premium room messages require premium subscription" ON "public"."messages" FOR SELECT USING ((("room_type" = 'public'::"text") OR (("room_type" = 'premium'::"text") AND "public"."is_premium_subscriber"("auth"."uid"())) OR (("room_type" = 'superachiever'::"text") AND "public"."is_superachiever"("auth"."uid"()))));



CREATE POLICY "Proposer can update pending proposals" ON "public"."governance_proposals" FOR UPDATE USING ((("auth"."uid"() = "user_id") AND ("status" = 'pending'::"text"))) WITH CHECK ((("auth"."uid"() = "user_id") AND ("status" = 'pending'::"text")));



CREATE POLICY "Public posts are viewable by everyone" ON "public"."posts" FOR SELECT USING (("visibility" = 'public'::"text"));



CREATE POLICY "Public room messages are viewable by everyone" ON "public"."messages" FOR SELECT USING (("room_type" = 'public'::"text"));



CREATE POLICY "Published content is viewable by everyone" ON "public"."content_modules" FOR SELECT USING ((("is_published" = true) OR ("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."is_guardian" = true)))));



CREATE POLICY "Published content modules are viewable by everyone" ON "public"."content_modules" FOR SELECT USING (("is_published" = true));



CREATE POLICY "Published lessons are viewable by everyone" ON "public"."lessons" FOR SELECT USING (("is_published" = true));



CREATE POLICY "Published resources are viewable by everyone" ON "public"."resources" FOR SELECT USING (("is_published" = true));



CREATE POLICY "Security events are only visible to guardians" ON "public"."security_events" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("auth"."uid"() = "users"."id") AND (("users"."raw_user_meta_data" ->> 'role'::"text") = 'guardian'::"text")))));



CREATE POLICY "Select gamification_events for authenticated" ON "public"."gamification_events" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Select site_settings for authenticated" ON "public"."site_settings" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Select token_conversions for authenticated" ON "public"."token_conversions" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Select token_sinks for authenticated" ON "public"."token_sinks" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Service role has full access to rate limits" ON "public"."rate_limits" TO "authenticated" USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text")) WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "Service role has full access to rate_limits" ON "public"."rate_limits" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Suspicious activities are visible to owners and guardians" ON "public"."suspicious_activities" FOR SELECT USING ((("user_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("auth"."uid"() = "users"."id") AND (("users"."raw_user_meta_data" ->> 'role'::"text") = 'guardian'::"text"))))));



CREATE POLICY "System can update token balances" ON "public"."token_balances" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "System services can insert external mappings" ON "public"."user_external_mappings" FOR INSERT WITH CHECK ((("auth"."role"() = 'service_role'::"text") OR ("auth"."role"() = 'supabase_admin'::"text")));



CREATE POLICY "System services can update external mappings" ON "public"."user_external_mappings" FOR UPDATE USING ((("auth"."role"() = 'service_role'::"text") OR ("auth"."role"() = 'supabase_admin'::"text"))) WITH CHECK ((("auth"."role"() = 'service_role'::"text") OR ("auth"."role"() = 'supabase_admin'::"text")));



CREATE POLICY "Tenant admins can insert API keys" ON "public"."tenant_api_keys" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."tenant_users"
  WHERE (("tenant_users"."tenant_id" = "tenant_api_keys"."tenant_id") AND ("tenant_users"."user_id" = "auth"."uid"()) AND ("tenant_users"."role" = ANY (ARRAY['admin'::"text", 'owner'::"text"]))))));



CREATE POLICY "Tenant admins can manage their tenant's shared content" ON "public"."tenant_shared_content" USING ((EXISTS ( SELECT 1
   FROM "public"."tenant_users"
  WHERE (("tenant_users"."tenant_id" = "tenant_shared_content"."tenant_id") AND ("tenant_users"."user_id" = "auth"."uid"()) AND ("tenant_users"."role" = ANY (ARRAY['admin'::"text", 'owner'::"text"]))))));



CREATE POLICY "Tenant admins can update their API keys" ON "public"."tenant_api_keys" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."tenant_users"
  WHERE (("tenant_users"."tenant_id" = "tenant_api_keys"."tenant_id") AND ("tenant_users"."user_id" = "auth"."uid"()) AND ("tenant_users"."role" = ANY (ARRAY['admin'::"text", 'owner'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."tenant_users"
  WHERE (("tenant_users"."tenant_id" = "tenant_api_keys"."tenant_id") AND ("tenant_users"."user_id" = "auth"."uid"()) AND ("tenant_users"."role" = ANY (ARRAY['admin'::"text", 'owner'::"text"]))))));



CREATE POLICY "Tenant isolation for content modules" ON "public"."content_modules" USING ((("auth"."role"() = 'service_role'::"text") OR ( SELECT "profiles"."is_guardian"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) OR (EXISTS ( SELECT 1
   FROM ("public"."tenant_users" "tu"
     JOIN "public"."tenants" "t" ON (("tu"."tenant_id" = "t"."id")))
  WHERE (("tu"."user_id" = "auth"."uid"()) AND ("tu"."status" = 'active'::"text") AND ("t"."slug" = "content_modules"."platform"))))));



CREATE POLICY "Tenant isolation for lessons" ON "public"."lessons" USING ((("auth"."role"() = 'service_role'::"text") OR ( SELECT "profiles"."is_guardian"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) OR (EXISTS ( SELECT 1
   FROM ("public"."content_modules" "cm"
     JOIN "public"."tenant_users" "tu" ON (("cm"."platform" = ( SELECT "tenants"."slug"
           FROM "public"."tenants"
          WHERE ("tenants"."id" = "tu"."tenant_id")))))
  WHERE (("cm"."id" = "lessons"."module_id") AND ("tu"."user_id" = "auth"."uid"()) AND ("tu"."status" = 'active'::"text"))))));



CREATE POLICY "Tenant isolation for profiles" ON "public"."profiles" USING ((("auth"."role"() = 'service_role'::"text") OR ( SELECT "profiles_1"."is_guardian"
   FROM "public"."profiles" "profiles_1"
  WHERE ("profiles_1"."id" = "auth"."uid"())) OR (EXISTS ( SELECT 1
   FROM ("public"."tenant_users" "tu"
     JOIN "public"."tenants" "t" ON (("tu"."tenant_id" = "t"."id")))
  WHERE (("tu"."user_id" = "auth"."uid"()) AND ("tu"."status" = 'active'::"text") AND (("t"."slug" = ANY ("profiles"."platforms")) OR ("profiles"."id" = "auth"."uid"())))))));



CREATE POLICY "Tenants can view their own API keys" ON "public"."tenant_api_keys" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."tenant_users"
  WHERE (("tenant_users"."tenant_id" = "tenant_api_keys"."tenant_id") AND ("tenant_users"."user_id" = "auth"."uid"()) AND ("tenant_users"."role" = ANY (ARRAY['admin'::"text", 'owner'::"text"]))))));



CREATE POLICY "Tokens are only visible to their owners" ON "public"."csrf_tokens" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can create posts based on subscription" ON "public"."posts" FOR INSERT WITH CHECK (
CASE
    WHEN ("visibility" = 'public'::"text") THEN true
    WHEN ("visibility" = 'premium'::"text") THEN "public"."is_premium_subscriber"("auth"."uid"())
    WHEN ("visibility" = 'superachiever'::"text") THEN "public"."is_superachiever"("auth"."uid"())
    ELSE false
END);



CREATE POLICY "Users can create proposals" ON "public"."governance_proposals" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own progress" ON "public"."learning_progress" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can create their own recommendations" ON "public"."learning_recommendations" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can create their own search analytics" ON "public"."search_analytics" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can delete their own conversations" ON "public"."conversations" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own analytics events" ON "public"."analytics_events" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own chat messages" ON "public"."chat_history" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own AI preferences" ON "public"."user_ai_preferences" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own analytics events" ON "public"."analytics_events" FOR INSERT WITH CHECK ((("auth"."uid"() IS NOT NULL) AND (("user_id" IS NULL) OR ("user_id" = "auth"."uid"()))));



CREATE POLICY "Users can insert their own assessments" ON "public"."thinking_assessments" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own assessments" ON "public"."user_assessments" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own community data" ON "public"."user_community" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own conversations" ON "public"."conversations" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own discussion posts" ON "public"."discussion_posts" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own exercise progress" ON "public"."user_exercise_progress" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own onboarding data" ON "public"."user_onboarding" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own platform preferences" ON "public"."user_platform_preferences" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own profile" ON "public"."user_profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own skills" ON "public"."user_skills" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can insert their own state" ON "public"."platform_state" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own sessions" ON "public"."user_sessions" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can modify their own progress" ON "public"."learning_progress" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can modify their own recommendations" ON "public"."learning_recommendations" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can modify their own skills" ON "public"."user_skills" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can only see messages from their conversations" ON "public"."ai_messages" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."ai_conversations"
  WHERE (("ai_conversations"."id" = "ai_messages"."conversation_id") AND ("ai_conversations"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can only see their own AI usage" ON "public"."ai_usage_metrics" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can only see their own conversations" ON "public"."ai_conversations" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can react once per post" ON "public"."post_reactions" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND (NOT (EXISTS ( SELECT 1
   FROM "public"."post_reactions" "pr"
  WHERE (("pr"."post_id" = "post_reactions"."post_id") AND ("pr"."user_id" = "auth"."uid"())))))));



CREATE POLICY "Users can read own chat history" ON "public"."chat_history" FOR SELECT TO "authenticated" USING ((("auth"."uid"() = "user_id") OR (EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text"))))));



CREATE POLICY "Users can read own gamification stats" ON "public"."user_gamification_stats" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read own tokens" ON "public"."tokens" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read their own achievement progress" ON "public"."user_achievements" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read their own assessments" ON "public"."user_assessments" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read their own community data" ON "public"."user_community" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read their own onboarding data" ON "public"."user_onboarding" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read their own profile" ON "public"."user_profiles" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can record their own attendance" ON "public"."zoom_attendance" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can register for events" ON "public"."event_registrations" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can see all reactions" ON "public"."post_reactions" FOR SELECT USING (true);



CREATE POLICY "Users can send messages based on subscription" ON "public"."messages" FOR INSERT WITH CHECK ((
CASE
    WHEN ("room_type" = 'public'::"text") THEN true
    WHEN ("room_type" = 'premium'::"text") THEN "public"."is_premium_subscriber"("auth"."uid"())
    WHEN ("room_type" = 'superachiever'::"text") THEN "public"."is_superachiever"("auth"."uid"())
    ELSE false
END AND ("sender_id" = "auth"."uid"())));



CREATE POLICY "Users can update own gamification stats" ON "public"."user_gamification_stats" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own participation" ON "public"."participation" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own AI preferences" ON "public"."user_ai_preferences" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own assessments" ON "public"."thinking_assessments" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own attendance" ON "public"."zoom_attendance" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own conversations" ON "public"."conversations" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own discussion posts" ON "public"."discussion_posts" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own exercise progress" ON "public"."user_exercise_progress" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own notifications" ON "public"."notifications" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own onboarding data" ON "public"."user_onboarding" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own platform preferences" ON "public"."user_platform_preferences" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own posts" ON "public"."posts" FOR UPDATE USING (("author_id" = "auth"."uid"())) WITH CHECK (("author_id" = "auth"."uid"()));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own profile" ON "public"."user_profiles" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own state" ON "public"."platform_state" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view analytics events for their platforms" ON "public"."analytics_events" FOR SELECT USING (("public"."has_platform_access"("platform") OR ("platform" IN ( SELECT "unnest"("profiles"."platforms") AS "unnest"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())))));



CREATE POLICY "Users can view basic info of users in the same platform" ON "public"."profiles" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p1",
    "public"."profiles" "p2"
  WHERE (("p1"."id" = "auth"."uid"()) AND ("p2"."id" = "profiles"."id") AND ("array_length"(ARRAY( SELECT "unnest"("p1"."platforms") AS "unnest"
        INTERSECT
         SELECT "unnest"("p2"."platforms") AS "unnest"), 1) > 0)))));



CREATE POLICY "Users can view content for subscribed platforms" ON "public"."content" FOR SELECT USING ((("platform" = ANY (COALESCE(( SELECT "profiles"."subscribed_platforms"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())), ARRAY[]::"text"[]))) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text"))))));



CREATE POLICY "Users can view events for subscribed platforms" ON "public"."events" FOR SELECT USING ((("platform" = ANY (COALESCE(( SELECT "profiles"."subscribed_platforms"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())), ARRAY[]::"text"[]))) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text"))))));



CREATE POLICY "Users can view own analytics events" ON "public"."analytics_events" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own participation" ON "public"."participation" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view tenant shared content if they have access to the" ON "public"."tenant_shared_content" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."tenant_users"
  WHERE (("tenant_users"."tenant_id" = "tenant_shared_content"."tenant_id") AND ("tenant_users"."user_id" = "auth"."uid"()) AND ("tenant_users"."status" = 'active'::"text")))));



CREATE POLICY "Users can view their own AI preferences" ON "public"."user_ai_preferences" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own assessments" ON "public"."thinking_assessments" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own attendance" ON "public"."zoom_attendance" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own conversations" ON "public"."conversations" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own exercise progress" ON "public"."user_exercise_progress" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own external mappings" ON "public"."user_external_mappings" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own notifications" ON "public"."notifications" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own platform access" ON "public"."platform_access" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own platform preferences" ON "public"."user_platform_preferences" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own points" ON "public"."user_points" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own progress" ON "public"."learning_progress" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own recommendations" ON "public"."learning_recommendations" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own registrations" ON "public"."event_registrations" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own search analytics" ON "public"."search_analytics" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own skills" ON "public"."user_skills" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own state" ON "public"."platform_state" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own tenant memberships" ON "public"."tenant_users" FOR SELECT USING ((("auth"."role"() = 'authenticated'::"text") AND ("user_id" = "auth"."uid"())));



CREATE POLICY "Users can view their own token balances" ON "public"."token_balances" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own transactions" ON "public"."token_transactions" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view topics for subscribed platforms" ON "public"."discussion_topics" FOR SELECT USING ((("tenant_slug" = ANY (COALESCE(( SELECT "profiles"."subscribed_platforms"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())), ARRAY[]::"text"[]))) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text"))))));



CREATE POLICY "Users with platform access can view Ascenders profiles" ON "public"."ascenders_profiles" FOR SELECT USING ("public"."has_platform_access"('ascenders'::"text"));



CREATE POLICY "Users with platform access can view Hub profiles" ON "public"."hub_profiles" FOR SELECT USING ("public"."has_platform_access"('hub'::"text"));



CREATE POLICY "Users with platform access can view Immortals profiles" ON "public"."immortals_profiles" FOR SELECT USING ("public"."has_platform_access"('immortals'::"text"));



CREATE POLICY "Users with platform access can view Neothinkers profiles" ON "public"."neothinkers_profiles" FOR SELECT USING ("public"."has_platform_access"('neothinkers'::"text"));



ALTER TABLE "public"."achievements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."activity_feed" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "admin_analytics_events_policy" ON "public"."analytics_events" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("auth"."uid"() = "users"."id") AND (("users"."email")::"text" ~~ '%@neothink.io'::"text")))));



ALTER TABLE "public"."ai_analytics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ai_configurations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ai_conversations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ai_embeddings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ai_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ai_suggestions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ai_usage_metrics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ai_vector_collection_mappings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ai_vector_collections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ai_vector_documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."analytics_events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "analytics_events_insert_policy" ON "public"."analytics_events" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



ALTER TABLE "public"."analytics_metrics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."analytics_reports" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."analytics_summaries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ascenders_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."audit_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."badge_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."badges" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."census_snapshots" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_history" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "chat_history_admin_policy" ON "public"."chat_history" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "chat_history_family_admin_policy" ON "public"."chat_history" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'family_admin'::"text")))));



CREATE POLICY "chat_history_user_policy" ON "public"."chat_history" USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."chat_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_participants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_rooms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."collaboration_bonuses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."community_features" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."content" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."content_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."content_content_tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."content_dependencies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."content_modules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."content_schedule" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."content_similarity" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."content_tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."content_versions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."content_workflow" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."content_workflow_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."conversations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."courses" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "create_posts" ON "public"."posts" FOR INSERT WITH CHECK ((("auth"."uid"() = "author_id") AND
CASE
    WHEN ("visibility" = 'public'::"text") THEN true
    WHEN ("visibility" = 'premium'::"text") THEN ("public"."is_premium_subscriber"("auth"."uid"()) OR "public"."is_superachiever"("auth"."uid"()))
    WHEN ("visibility" = 'superachiever'::"text") THEN "public"."is_superachiever"("auth"."uid"())
    WHEN ("visibility" = 'private'::"text") THEN true
    ELSE false
END));



CREATE POLICY "create_room" ON "public"."rooms" FOR INSERT TO "authenticated" WITH CHECK ((("room_type" = 'public'::"text") OR (("room_type" = 'premium'::"text") AND "public"."is_premium_subscriber"("auth"."uid"())) OR (("room_type" = 'superachiever'::"text") AND "public"."is_superachiever"("auth"."uid"())) OR (("room_type" = 'private'::"text") AND ("created_by" = "auth"."uid"()))));



ALTER TABLE "public"."crowdfunding" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."csrf_tokens" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."data_transfer_logs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "data_transfer_logs_insert" ON "public"."data_transfer_logs" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "data_transfer_logs_select" ON "public"."data_transfer_logs" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "data_transfer_logs_update" ON "public"."data_transfer_logs" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "delete_own_posts" ON "public"."posts" FOR DELETE TO "authenticated" USING (("author_id" = "auth"."uid"()));



ALTER TABLE "public"."discussion_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."discussion_topics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."error_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_attendees" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_registrations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."feature_flags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."feedback" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fibonacci_token_rewards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."flow_templates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."gamification_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."governance_proposals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."group_actions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."health_integrations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "health_integrations_delete" ON "public"."health_integrations" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "health_integrations_insert" ON "public"."health_integrations" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "health_integrations_select" ON "public"."health_integrations" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "health_integrations_update" ON "public"."health_integrations" FOR UPDATE USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."health_metrics" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "health_metrics_delete" ON "public"."health_metrics" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "health_metrics_insert" ON "public"."health_metrics" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "health_metrics_select" ON "public"."health_metrics" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "health_metrics_update" ON "public"."health_metrics" FOR UPDATE USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."hub_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."immortals_profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "insert_own_posts" ON "public"."posts" FOR INSERT TO "authenticated" WITH CHECK (("author_id" = "auth"."uid"()));



ALTER TABLE "public"."integration_settings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "integration_settings_insert" ON "public"."integration_settings" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "integration_settings_select" ON "public"."integration_settings" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "integration_settings_update" ON "public"."integration_settings" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "join_rooms" ON "public"."room_participants" FOR INSERT WITH CHECK ((
CASE
    WHEN (( SELECT "rooms"."room_type"
       FROM "public"."rooms"
      WHERE ("rooms"."id" = "room_participants"."room_id")) = 'public'::"text") THEN true
    WHEN (( SELECT "rooms"."room_type"
       FROM "public"."rooms"
      WHERE ("rooms"."id" = "room_participants"."room_id")) = 'premium'::"text") THEN "public"."is_premium_subscriber"("auth"."uid"())
    WHEN (( SELECT "rooms"."room_type"
       FROM "public"."rooms"
      WHERE ("rooms"."id" = "room_participants"."room_id")) = 'superachiever'::"text") THEN "public"."is_superachiever"("auth"."uid"())
    WHEN (( SELECT "rooms"."room_type"
       FROM "public"."rooms"
      WHERE ("rooms"."id" = "room_participants"."room_id")) = 'private'::"text") THEN false
    ELSE false
END AND ("role" = 'member'::"text") AND ("user_id" = "auth"."uid"())));



ALTER TABLE "public"."journal_entries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."learning_path_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."learning_paths" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."learning_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."learning_recommendations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lessons" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."login_attempts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "manage_token_balances" ON "public"."token_balances" TO "authenticated" USING (false) WITH CHECK (false);



CREATE POLICY "manage_token_transactions" ON "public"."token_transactions" TO "authenticated" USING (false) WITH CHECK (false);



ALTER TABLE "public"."mark_hamilton_content" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."modules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."neothinkers_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notification_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notification_templates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "owner_access_policy" ON "public"."ascenders_profiles" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "owner_access_policy" ON "public"."hub_profiles" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "owner_access_policy" ON "public"."immortals_profiles" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "owner_access_policy" ON "public"."learning_progress" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "owner_access_policy" ON "public"."neothinkers_profiles" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "owner_access_policy" ON "public"."notification_preferences" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "owner_access_policy" ON "public"."notifications" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "owner_access_policy" ON "public"."platform_state" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "owner_access_policy" ON "public"."thinking_assessments" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "owner_access_policy" ON "public"."user_platform_preferences" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."participation" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."performance_metrics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."platform_access" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."platform_customization" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."platform_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."platform_state" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."popular_searches" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."post_comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."post_likes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."post_reactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."proposals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rate_limits" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "read_messages" ON "public"."messages" FOR SELECT USING (
CASE
    WHEN ("room_type" = 'public'::"text") THEN ("auth"."role"() = 'authenticated'::"text")
    WHEN ("room_type" = 'premium'::"text") THEN "public"."is_premium_subscriber"("auth"."uid"())
    WHEN ("room_type" = 'superachiever'::"text") THEN "public"."is_superachiever"("auth"."uid"())
    WHEN ("room_type" = 'private'::"text") THEN (EXISTS ( SELECT 1
       FROM "public"."room_participants"
      WHERE (("room_participants"."room_id" = "messages"."room_id") AND ("room_participants"."user_id" = "auth"."uid"()))))
    ELSE false
END);



CREATE POLICY "read_posts" ON "public"."posts" FOR SELECT USING (
CASE
    WHEN ("visibility" = 'public'::"text") THEN true
    WHEN ("visibility" = 'premium'::"text") THEN ("public"."is_premium_subscriber"("auth"."uid"()) OR "public"."is_superachiever"("auth"."uid"()))
    WHEN ("visibility" = 'superachiever'::"text") THEN "public"."is_superachiever"("auth"."uid"())
    WHEN ("visibility" = 'private'::"text") THEN ("auth"."uid"() = "author_id")
    ELSE false
END);



ALTER TABLE "public"."referral_bonuses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."referrals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."resources" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."room_participants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rooms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."search_analytics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."search_suggestions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."search_vectors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."security_events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "send_messages" ON "public"."messages" FOR INSERT WITH CHECK ((("sender_id" = "auth"."uid"()) AND
CASE
    WHEN ("room_type" = 'public'::"text") THEN ("auth"."role"() = 'authenticated'::"text")
    WHEN ("room_type" = 'premium'::"text") THEN "public"."is_premium_subscriber"("auth"."uid"())
    WHEN ("room_type" = 'superachiever'::"text") THEN "public"."is_superachiever"("auth"."uid"())
    WHEN ("room_type" = 'private'::"text") THEN (EXISTS ( SELECT 1
       FROM "public"."room_participants"
      WHERE (("room_participants"."room_id" = "messages"."room_id") AND ("room_participants"."user_id" = "auth"."uid"()))))
    ELSE false
END));



ALTER TABLE "public"."shared_content" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."site_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."skill_requirements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."social_interactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."supplements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."suspicious_activities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."system_alerts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."system_health_checks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."team_memberships" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tenant_api_keys" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tenant_domains" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tenant_shared_content" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tenant_subscriptions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tenant_users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tenants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."thinking_assessments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."token_balances" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."token_conversions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."token_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."token_sinks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."token_transactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tokens" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "update_own_messages" ON "public"."messages" FOR UPDATE USING (("sender_id" = "auth"."uid"())) WITH CHECK (("sender_id" = "auth"."uid"()));



CREATE POLICY "update_own_posts" ON "public"."posts" FOR UPDATE TO "authenticated" USING (("author_id" = "auth"."uid"())) WITH CHECK (("author_id" = "auth"."uid"()));



ALTER TABLE "public"."user_achievements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_actions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_activity_stats" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_ai_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_assessments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_badges" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_community" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_connections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_exercise_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_external_mappings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_gamification_stats" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_mentions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_onboarding" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_platform_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_points" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_recommendations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_segments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_skills" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "view_all_posts" ON "public"."posts" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "view_own_token_balances" ON "public"."token_balances" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "view_own_token_transactions" ON "public"."token_transactions" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "view_premium_rooms" ON "public"."rooms" FOR SELECT TO "authenticated" USING (((("room_type" = 'premium'::"text") AND "public"."is_premium_subscriber"("auth"."uid"())) OR ("room_type" = 'public'::"text") OR ("created_by" = "auth"."uid"())));



CREATE POLICY "view_public_rooms" ON "public"."rooms" FOR SELECT TO "authenticated" USING (("room_type" = 'public'::"text"));



CREATE POLICY "view_room_participants" ON "public"."room_participants" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."room_participants" "my_rooms"
  WHERE (("my_rooms"."room_id" = "room_participants"."room_id") AND ("my_rooms"."user_id" = "auth"."uid"())))));



CREATE POLICY "view_superachiever_rooms" ON "public"."rooms" FOR SELECT TO "authenticated" USING (((("room_type" = 'superachiever'::"text") AND "public"."is_superachiever"("auth"."uid"())) OR ("room_type" = 'public'::"text") OR (("room_type" = 'premium'::"text") AND "public"."is_premium_subscriber"("auth"."uid"())) OR ("created_by" = "auth"."uid"())));



ALTER TABLE "public"."vital_signs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "vital_signs_delete" ON "public"."vital_signs" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "vital_signs_insert" ON "public"."vital_signs" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "vital_signs_select" ON "public"."vital_signs" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "vital_signs_update" ON "public"."vital_signs" FOR UPDATE USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."votes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "write_messages" ON "public"."messages" FOR INSERT WITH CHECK (((EXISTS ( SELECT 1
   FROM "public"."room_participants"
  WHERE (("room_participants"."room_id" = "messages"."room_id") AND ("room_participants"."user_id" = "auth"."uid"())))) AND ("sender_id" = "auth"."uid"()) AND
CASE
    WHEN ("room_type" = 'public'::"text") THEN true
    WHEN ("room_type" = 'premium'::"text") THEN "public"."is_premium_subscriber"("auth"."uid"())
    WHEN ("room_type" = 'superachiever'::"text") THEN "public"."is_superachiever"("auth"."uid"())
    WHEN ("room_type" = 'private'::"text") THEN (EXISTS ( SELECT 1
       FROM "public"."room_participants"
      WHERE (("room_participants"."room_id" = "messages"."room_id") AND ("room_participants"."user_id" = "auth"."uid"()))))
    ELSE false
END));



ALTER TABLE "public"."xp_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."xp_multipliers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."zoom_attendance" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "auth" TO "anon";
GRANT USAGE ON SCHEMA "auth" TO "authenticated";
GRANT USAGE ON SCHEMA "auth" TO "service_role";
GRANT ALL ON SCHEMA "auth" TO "supabase_auth_admin";
GRANT ALL ON SCHEMA "auth" TO "dashboard_user";
GRANT ALL ON SCHEMA "auth" TO "postgres";



REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT ALL ON SCHEMA "public" TO PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON TYPE "public"."platform_slug" TO "authenticated";
GRANT ALL ON TYPE "public"."platform_slug" TO "service_role";



GRANT ALL ON TYPE "public"."user_role" TO "authenticated";
GRANT ALL ON TYPE "public"."user_role" TO "service_role";



GRANT ALL ON FUNCTION "auth"."email"() TO "dashboard_user";
GRANT ALL ON FUNCTION "auth"."email"() TO "postgres";
GRANT ALL ON FUNCTION "auth"."email"() TO "service_role";



GRANT ALL ON FUNCTION "auth"."jwt"() TO "postgres";
GRANT ALL ON FUNCTION "auth"."jwt"() TO "dashboard_user";
GRANT ALL ON FUNCTION "auth"."jwt"() TO "service_role";



GRANT ALL ON FUNCTION "auth"."role"() TO "dashboard_user";
GRANT ALL ON FUNCTION "auth"."role"() TO "postgres";
GRANT ALL ON FUNCTION "auth"."role"() TO "service_role";



GRANT ALL ON FUNCTION "auth"."uid"() TO "dashboard_user";
GRANT ALL ON FUNCTION "auth"."uid"() TO "postgres";
GRANT ALL ON FUNCTION "auth"."uid"() TO "service_role";



GRANT ALL ON FUNCTION "public"."add_user_to_tenant"("_user_id" "uuid", "_tenant_slug" "text", "_role" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."advance_user_week"("p_user_id" "uuid", "p_platform" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."award_message_tokens"() TO "service_role";



GRANT ALL ON FUNCTION "public"."award_post_tokens"() TO "service_role";



GRANT ALL ON FUNCTION "public"."award_tokens"("p_user_id" "uuid", "p_token_type" "text", "p_amount" integer, "p_source_type" "text", "p_source_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."award_zoom_attendance_tokens"("attendee_id" "uuid", "meeting_name" "text", "token_type" "text", "token_amount" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."broadcast_post"() TO "service_role";



GRANT ALL ON FUNCTION "public"."broadcast_room_message"() TO "service_role";



GRANT ALL ON FUNCTION "public"."can_earn_tokens"("p_user_id" "uuid", "p_token_type" "text", "p_source_type" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_email_exists"("email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_platform_access"("user_id" "uuid", "platform_slug" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_profile_exists"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_rate_limit"("p_identifier" "text", "p_max_requests" integer, "p_window_seconds" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."check_skill_requirements"("p_user_id" "uuid", "p_content_type" "text", "p_content_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_user_exists"("user_email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_user_role"("_user_id" "uuid", "_role_slug" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."clean_chat_history"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_expired_tokens"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_old_notifications"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_old_rate_limits"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_old_security_events"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_invite"("p_code" "text", "p_inviter_id" "uuid", "p_expires_at" timestamp with time zone) TO "postgres";



GRANT ALL ON FUNCTION "public"."create_notification"("p_user_id" "uuid", "p_platform" "text", "p_title" "text", "p_body" "text", "p_metadata" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_profile"("user_id" "uuid", "user_email" "text", "user_role" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_profile"("user_id" "uuid", "user_email" "text", "user_role" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_profile"("user_id" "uuid", "user_email" "text", "user_role" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_system_alert"("p_alert_type" "text", "p_message" "text", "p_severity" "text", "p_context" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_tenant"("_name" "text", "_slug" "text", "_description" "text", "_admin_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_old_chat_history"() TO "service_role";



GRANT ALL ON FUNCTION "public"."ensure_token_balance"() TO "service_role";



GRANT ALL ON FUNCTION "public"."exec_sql"("sql" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."fibonacci"("n" integer) TO "service_role";
GRANT ALL ON FUNCTION "public"."fibonacci"("n" integer) TO "authenticated";



GRANT ALL ON FUNCTION "public"."find_similar_content"("p_content_type" "text", "p_content_id" "uuid", "p_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."flag_inactive_users"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_embedding"("content" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_tenant_api_key"("_tenant_id" "uuid", "_name" "text", "_scopes" "text"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_activity_interactions"("p_activity_id" "uuid", "p_limit" integer, "p_offset" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_available_rooms"("user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_content_dependencies"("p_content_type" "text", "p_content_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_content_engagement_metrics"("p_platform" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_dependent_content"("p_content_type" "text", "p_content_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_discover_posts"("page_size" integer, "page_number" integer, "filter_token_tag" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_enabled_features"("p_platform" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_learning_recommendations"("p_user_id" "uuid", "p_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_next_lesson"("user_id" "uuid", "platform_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_pending_schedules"("p_platform" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_personalized_recommendations"("p_user_id" "uuid", "p_platform" "text", "p_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_platform_content"("p_platform" "text", "include_unpublished" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_platform_customizations"("p_platform" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_platform_metrics"("p_platform" "text", "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_platform_redirect_url"("platform_name" "text", "redirect_type" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_platform_settings"("p_platform" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_recent_posts"("p_visibility" "text", "p_limit" integer, "p_offset" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_role_capabilities"("_role_slug" "text", "_feature_name" "text", "_tenant_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_room_messages"("room_uuid" "uuid", "page_size" integer, "before_timestamp" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_room_type"("room_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_tenant_analytics"("_tenant_id" "uuid", "_start_date" timestamp with time zone, "_end_date" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_tenant_by_slug"("_slug" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_tenant_shared_content"("_tenant_slug" "text", "_limit" integer, "_offset" integer, "_category_slug" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_token_balances"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_token_history"("p_user_id" "uuid", "p_token_type" "text", "p_limit" integer, "p_offset" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_unread_notification_count"("p_user_id" "uuid", "p_platform" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_accessible_tenants"("_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_achievements"("p_user_id" "uuid", "p_platform" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_activity_feed"("p_user_id" "uuid", "p_platform" "text", "p_limit" integer, "p_offset" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_activity_summary"("p_user_id" "uuid", "p_platform" "text", "p_start_date" "date", "p_end_date" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_conversations"("p_user_id" "uuid", "p_platform" "text", "p_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_engagement_summary"("p_platform" "text", "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_notifications"("p_user_id" "uuid", "p_platform" "text", "p_limit" integer, "p_offset" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_permissions"("_user_id" "uuid", "_tenant_slug" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_platform_progress"("user_id" "uuid", "platform_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_points"("user_id" "uuid", "platform_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_progress_summary"("p_user_id" "uuid", "p_platform" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_role_details"("_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_tenants"("_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_token_history"("user_uuid" "uuid", "token_type_filter" "text", "page_size" integer, "page_number" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_token_summary"("user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_version_history"("p_content_type" "text", "p_content_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_workflow_history"("p_content_type" "text", "p_content_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_governance_proposal_update"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_message_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_message"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_post"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_post_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_profile_platform_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_token_update"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."has_active_subscription"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."has_content_access"("user_id" "uuid", "platform_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."has_platform_access"("platform_slug_param" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_chat_participant"("p_room_id" "uuid", "p_user_id" "uuid") TO "service_role";
GRANT ALL ON FUNCTION "public"."is_chat_participant"("p_room_id" "uuid", "p_user_id" "uuid") TO "authenticated";



GRANT ALL ON FUNCTION "public"."is_premium_subscriber"("user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_rate_limited"("p_email" "text", "p_ip_address" "text", "p_window_minutes" integer, "p_max_attempts" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."is_superachiever"("user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."log_auth_event"("p_user_id" "uuid", "p_email" "text", "p_ip_address" "text", "p_user_agent" "text", "p_action" "text", "p_status" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."log_error"("p_error_type" "text", "p_error_message" "text", "p_severity" "text", "p_stack_trace" "text", "p_platform" "text", "p_user_id" "uuid", "p_context" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."manage_content_workflow"("p_content_type" "text", "p_content_id" "uuid", "p_platform" "text", "p_status" "text", "p_assigned_to" "uuid", "p_due_date" timestamp with time zone, "p_notes" "text", "p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."map_points_to_tokens"("p_user_id" "uuid", "p_token_type" "text", "p_amount" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."mark_notifications_read"("p_user_id" "uuid", "p_notification_ids" "uuid"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."migrate_platform_to_tenant"("_platform" "text", "_admin_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."migrate_users_to_tenants"() TO "service_role";



GRANT ALL ON FUNCTION "public"."mint_points_on_action"("p_user_id" "uuid", "p_action_type" "text", "p_platform" "public"."platform_slug", "p_action_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_content_update"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_cross_platform"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_new_message"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_token_earnings"() TO "service_role";



GRANT ALL ON FUNCTION "public"."process_sunday_zoom_rewards"("p_meeting_id" "text", "p_minimum_duration" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."process_zoom_attendance_rewards"() TO "service_role";



GRANT ALL ON FUNCTION "public"."publish_module"("content_id" "uuid", "publisher_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."record_audit_log"("p_user_id" "uuid", "p_action" "text", "p_entity_type" "text", "p_entity_id" "uuid", "p_old_data" "jsonb", "p_new_data" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."record_health_check"("p_check_name" "text", "p_status" "text", "p_details" "jsonb", "p_severity" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."record_participation"("user_id" "uuid", "platform_name" "text", "activity" "text", "points_earned" integer, "activity_metadata" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."record_performance_metric"("p_metric_name" "text", "p_metric_value" numeric, "p_metric_unit" "text", "p_platform" "text", "p_context" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."record_zoom_attendance"("p_user_id" "uuid", "p_meeting_id" "text", "p_join_time" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_materialized_views"() TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_token_history"() TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_token_statistics"() TO "service_role";



GRANT ALL ON FUNCTION "public"."remove_user_from_tenant"("_user_id" "uuid", "_tenant_slug" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."search_content"("p_query" "text", "p_limit" integer, "p_offset" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."search_similar_content"("query_text" "text", "content_type" "text", "similarity_threshold" double precision, "max_results" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."set_default_role"() TO "service_role";



GRANT ALL ON FUNCTION "public"."setup_default_tenant_roles"("_tenant_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."track_ai_analytics"("p_event_type" "text", "p_app_name" "text", "p_metrics" "jsonb", "p_metadata" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."track_ai_usage"("p_user_id" "uuid", "p_platform" "text", "p_prompt_tokens" integer, "p_completion_tokens" integer, "p_model" "text", "p_cost" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."track_engagement"("user_id" "uuid", "platform_name" "text", "activity" "text", "points_earned" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_conversation_timestamp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_learning_progress"("p_user_id" "uuid", "p_content_type" "text", "p_content_id" "uuid", "p_status" "text", "p_progress_percentage" integer, "p_metadata" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_progress"("user_id" "uuid", "platform_name" "text", "module_id" "uuid", "lesson_id" "uuid", "new_status" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_search_vector"("p_content_type" "text", "p_content_id" "uuid", "p_title" "text", "p_description" "text", "p_content" "text", "p_metadata" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_team_earnings"("p_user_id" "uuid", "p_points_earned" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_activity"("p_user_id" "uuid", "p_platform" "text", "p_lessons_completed" integer, "p_modules_completed" integer, "p_points_earned" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_platform_for_testing"("p_user_id" "uuid", "platform_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_preferences"("p_user_id" "uuid", "p_platform" "text", "p_activity_type" "text", "p_activity_data" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_progress"("p_user_id" "uuid", "p_platform" "text", "p_feature" "text", "p_unlock" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_skill"("p_user_id" "uuid", "p_skill_name" "text", "p_proficiency_level" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_zoom_attendance"("p_attendance_id" "uuid", "p_leave_time" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."user_belongs_to_tenant"("_user_id" "uuid", "_tenant_slug" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."user_exists"("user_email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."user_has_permission"("_user_id" "uuid", "_permission_slug" "text", "_tenant_slug" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."user_has_permission"("_user_id" "uuid", "_permission_slug" "text", "_tenant_slug" "text", "_resource_id" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."user_has_platform_access"("_user_id" "uuid", "_platform_slug" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_schema"() TO "service_role";



GRANT ALL ON TABLE "auth"."audit_log_entries" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."audit_log_entries" TO "postgres";
GRANT SELECT ON TABLE "auth"."audit_log_entries" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."audit_log_entries" TO "service_role";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."flow_state" TO "postgres";
GRANT SELECT ON TABLE "auth"."flow_state" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."flow_state" TO "dashboard_user";
GRANT ALL ON TABLE "auth"."flow_state" TO "service_role";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."identities" TO "postgres";
GRANT SELECT ON TABLE "auth"."identities" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."identities" TO "dashboard_user";
GRANT ALL ON TABLE "auth"."identities" TO "service_role";



GRANT ALL ON TABLE "auth"."instances" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."instances" TO "postgres";
GRANT SELECT ON TABLE "auth"."instances" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."instances" TO "service_role";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."mfa_amr_claims" TO "postgres";
GRANT SELECT ON TABLE "auth"."mfa_amr_claims" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."mfa_amr_claims" TO "dashboard_user";
GRANT ALL ON TABLE "auth"."mfa_amr_claims" TO "service_role";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."mfa_challenges" TO "postgres";
GRANT SELECT ON TABLE "auth"."mfa_challenges" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."mfa_challenges" TO "dashboard_user";
GRANT ALL ON TABLE "auth"."mfa_challenges" TO "service_role";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."mfa_factors" TO "postgres";
GRANT SELECT ON TABLE "auth"."mfa_factors" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."mfa_factors" TO "dashboard_user";
GRANT ALL ON TABLE "auth"."mfa_factors" TO "service_role";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."one_time_tokens" TO "postgres";
GRANT SELECT ON TABLE "auth"."one_time_tokens" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."one_time_tokens" TO "dashboard_user";
GRANT ALL ON TABLE "auth"."one_time_tokens" TO "service_role";



GRANT ALL ON TABLE "auth"."refresh_tokens" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."refresh_tokens" TO "postgres";
GRANT SELECT ON TABLE "auth"."refresh_tokens" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."refresh_tokens" TO "service_role";



GRANT ALL ON SEQUENCE "auth"."refresh_tokens_id_seq" TO "dashboard_user";
GRANT ALL ON SEQUENCE "auth"."refresh_tokens_id_seq" TO "postgres";
GRANT ALL ON SEQUENCE "auth"."refresh_tokens_id_seq" TO "service_role";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."saml_providers" TO "postgres";
GRANT SELECT ON TABLE "auth"."saml_providers" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."saml_providers" TO "dashboard_user";
GRANT ALL ON TABLE "auth"."saml_providers" TO "service_role";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."saml_relay_states" TO "postgres";
GRANT SELECT ON TABLE "auth"."saml_relay_states" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."saml_relay_states" TO "dashboard_user";
GRANT ALL ON TABLE "auth"."saml_relay_states" TO "service_role";



GRANT ALL ON TABLE "auth"."schema_migrations" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."schema_migrations" TO "postgres";
GRANT SELECT ON TABLE "auth"."schema_migrations" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."schema_migrations" TO "service_role";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."sessions" TO "postgres";
GRANT SELECT ON TABLE "auth"."sessions" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."sessions" TO "dashboard_user";
GRANT ALL ON TABLE "auth"."sessions" TO "service_role";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."sso_domains" TO "postgres";
GRANT SELECT ON TABLE "auth"."sso_domains" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."sso_domains" TO "dashboard_user";
GRANT ALL ON TABLE "auth"."sso_domains" TO "service_role";



GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."sso_providers" TO "postgres";
GRANT SELECT ON TABLE "auth"."sso_providers" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."sso_providers" TO "dashboard_user";
GRANT ALL ON TABLE "auth"."sso_providers" TO "service_role";



GRANT ALL ON TABLE "auth"."users" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."users" TO "postgres";
GRANT SELECT ON TABLE "auth"."users" TO "postgres" WITH GRANT OPTION;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "auth"."users" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "auth"."users" TO "authenticated";
GRANT ALL ON TABLE "auth"."users" TO "service_role";



GRANT ALL ON TABLE "public"."achievements" TO "service_role";



GRANT ALL ON TABLE "public"."activity_feed" TO "service_role";



GRANT ALL ON TABLE "public"."ai_analytics" TO "service_role";



GRANT ALL ON TABLE "public"."ai_configurations" TO "service_role";



GRANT ALL ON TABLE "public"."ai_conversations" TO "service_role";



GRANT ALL ON TABLE "public"."ai_embeddings" TO "service_role";



GRANT ALL ON TABLE "public"."ai_messages" TO "service_role";



GRANT ALL ON TABLE "public"."ai_suggestions" TO "service_role";



GRANT ALL ON TABLE "public"."ai_usage_metrics" TO "service_role";



GRANT ALL ON TABLE "public"."ai_vector_collection_mappings" TO "service_role";



GRANT ALL ON TABLE "public"."ai_vector_collections" TO "service_role";



GRANT ALL ON TABLE "public"."ai_vector_documents" TO "service_role";



GRANT ALL ON TABLE "public"."analytics_events" TO "service_role";



GRANT ALL ON TABLE "public"."analytics_metrics" TO "service_role";



GRANT ALL ON TABLE "public"."analytics_reports" TO "service_role";



GRANT ALL ON TABLE "public"."analytics_summaries" TO "service_role";



GRANT ALL ON TABLE "public"."ascenders_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";



GRANT ALL ON TABLE "public"."auth_logs" TO "service_role";



GRANT ALL ON TABLE "public"."badge_events" TO "service_role";



GRANT ALL ON TABLE "public"."badges" TO "service_role";



GRANT ALL ON TABLE "public"."census_snapshots" TO "service_role";



GRANT SELECT,INSERT ON TABLE "public"."chat_history" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_history" TO "service_role";



GRANT ALL ON TABLE "public"."chat_messages" TO "service_role";



GRANT ALL ON TABLE "public"."chat_participants" TO "service_role";



GRANT ALL ON TABLE "public"."chat_rooms" TO "service_role";



GRANT ALL ON TABLE "public"."collaboration_bonuses" TO "service_role";



GRANT ALL ON TABLE "public"."collaborative_challenges" TO "service_role";



GRANT ALL ON TABLE "public"."community_features" TO "service_role";



GRANT ALL ON TABLE "public"."concept_relationships" TO "service_role";



GRANT ALL ON TABLE "public"."concepts" TO "service_role";



GRANT ALL ON TABLE "public"."content" TO "service_role";



GRANT ALL ON TABLE "public"."content_categories" TO "service_role";



GRANT ALL ON TABLE "public"."content_content_tags" TO "service_role";



GRANT ALL ON TABLE "public"."content_dependencies" TO "service_role";



GRANT ALL ON TABLE "public"."content_modules" TO "service_role";



GRANT ALL ON TABLE "public"."content_schedule" TO "service_role";



GRANT ALL ON TABLE "public"."content_similarity" TO "service_role";



GRANT ALL ON TABLE "public"."content_tags" TO "service_role";



GRANT ALL ON TABLE "public"."content_versions" TO "service_role";



GRANT ALL ON TABLE "public"."content_workflow" TO "service_role";



GRANT ALL ON TABLE "public"."content_workflow_history" TO "service_role";



GRANT ALL ON TABLE "public"."conversations" TO "service_role";



GRANT ALL ON TABLE "public"."courses" TO "service_role";



GRANT ALL ON TABLE "public"."crowdfunding" TO "service_role";



GRANT ALL ON TABLE "public"."csrf_tokens" TO "service_role";



GRANT ALL ON TABLE "public"."data_transfer_logs" TO "service_role";



GRANT ALL ON TABLE "public"."discussion_posts" TO "service_role";



GRANT ALL ON TABLE "public"."discussion_topics" TO "service_role";



GRANT ALL ON TABLE "public"."documentation" TO "service_role";



GRANT ALL ON SEQUENCE "public"."documentation_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."error_logs" TO "service_role";



GRANT ALL ON TABLE "public"."event_attendees" TO "service_role";



GRANT ALL ON TABLE "public"."event_registrations" TO "service_role";



GRANT ALL ON TABLE "public"."events" TO "service_role";
GRANT SELECT ON TABLE "public"."events" TO "authenticated";



GRANT ALL ON TABLE "public"."feature_flags" TO "service_role";



GRANT SELECT,INSERT,UPDATE ON TABLE "public"."feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."feedback" TO "service_role";



GRANT ALL ON TABLE "public"."feedback_ascenders" TO "service_role";



GRANT ALL ON TABLE "public"."feedback_hub" TO "service_role";



GRANT ALL ON TABLE "public"."feedback_immortals" TO "service_role";



GRANT ALL ON TABLE "public"."feedback_neothinkers" TO "service_role";



GRANT ALL ON TABLE "public"."feedback_trends" TO "service_role";



GRANT ALL ON TABLE "public"."fibonacci_token_rewards" TO "service_role";



GRANT ALL ON TABLE "public"."flow_templates" TO "service_role";



GRANT ALL ON TABLE "public"."gamification_events" TO "service_role";



GRANT ALL ON SEQUENCE "public"."gamification_events_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."governance_proposals" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."governance_proposals" TO "authenticated";



GRANT ALL ON TABLE "public"."group_actions" TO "service_role";



GRANT ALL ON TABLE "public"."health_integrations" TO "service_role";



GRANT ALL ON TABLE "public"."health_metrics" TO "service_role";



GRANT ALL ON TABLE "public"."hub_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."immortals_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."integration_settings" TO "service_role";



GRANT ALL ON TABLE "public"."journal_entries" TO "service_role";



GRANT ALL ON TABLE "public"."learning_path_items" TO "service_role";



GRANT ALL ON TABLE "public"."learning_paths" TO "service_role";



GRANT ALL ON TABLE "public"."learning_progress" TO "service_role";



GRANT ALL ON TABLE "public"."learning_recommendations" TO "service_role";



GRANT ALL ON TABLE "public"."lessons" TO "service_role";



GRANT ALL ON TABLE "public"."login_attempts" TO "service_role";



GRANT ALL ON TABLE "public"."mark_hamilton_content" TO "service_role";



GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON TABLE "public"."modules" TO "service_role";



GRANT ALL ON TABLE "public"."neothinkers_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."notification_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."notification_templates" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."participation" TO "service_role";



GRANT ALL ON TABLE "public"."performance_metrics" TO "service_role";



GRANT ALL ON TABLE "public"."permissions" TO "service_role";



GRANT ALL ON TABLE "public"."platform_access" TO "service_role";



GRANT ALL ON TABLE "public"."platform_customization" TO "service_role";



GRANT ALL ON TABLE "public"."platform_settings" TO "service_role";



GRANT ALL ON TABLE "public"."platform_state" TO "service_role";



GRANT ALL ON TABLE "public"."popular_searches" TO "service_role";



GRANT ALL ON TABLE "public"."post_comments" TO "service_role";



GRANT ALL ON TABLE "public"."post_likes" TO "service_role";



GRANT ALL ON TABLE "public"."post_reactions" TO "service_role";



GRANT ALL ON TABLE "public"."posts" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."proposals" TO "service_role";



GRANT ALL ON TABLE "public"."rate_limits" TO "service_role";



GRANT ALL ON TABLE "public"."recent_posts_view" TO "service_role";



GRANT ALL ON TABLE "public"."referral_bonuses" TO "service_role";



GRANT ALL ON TABLE "public"."referrals" TO "service_role";



GRANT ALL ON TABLE "public"."resources" TO "service_role";



GRANT ALL ON TABLE "public"."role_capabilities" TO "service_role";



GRANT ALL ON TABLE "public"."role_permissions" TO "service_role";



GRANT ALL ON TABLE "public"."room_participants" TO "service_role";



GRANT ALL ON TABLE "public"."rooms" TO "service_role";



GRANT ALL ON TABLE "public"."schema_version" TO "service_role";



GRANT ALL ON TABLE "public"."search_analytics" TO "service_role";



GRANT ALL ON TABLE "public"."search_suggestions" TO "service_role";



GRANT ALL ON TABLE "public"."search_vectors" TO "service_role";



GRANT ALL ON TABLE "public"."security_events" TO "service_role";



GRANT ALL ON TABLE "public"."security_logs" TO "service_role";



GRANT ALL ON TABLE "public"."shared_content" TO "service_role";



GRANT ALL ON TABLE "public"."site_settings" TO "service_role";



GRANT ALL ON TABLE "public"."skill_requirements" TO "service_role";



GRANT ALL ON TABLE "public"."social_interactions" TO "service_role";



GRANT ALL ON TABLE "public"."supplements" TO "service_role";



GRANT ALL ON TABLE "public"."suspicious_activities" TO "service_role";



GRANT ALL ON TABLE "public"."system_alerts" TO "service_role";



GRANT ALL ON TABLE "public"."system_health_checks" TO "service_role";



GRANT ALL ON TABLE "public"."team_memberships" TO "service_role";



GRANT ALL ON TABLE "public"."teams" TO "service_role";



GRANT ALL ON TABLE "public"."tenant_api_keys" TO "service_role";



GRANT ALL ON TABLE "public"."tenant_domains" TO "service_role";



GRANT ALL ON TABLE "public"."tenant_roles" TO "service_role";



GRANT ALL ON TABLE "public"."tenant_shared_content" TO "service_role";



GRANT ALL ON TABLE "public"."tenant_subscriptions" TO "service_role";



GRANT ALL ON TABLE "public"."tenant_users" TO "service_role";



GRANT ALL ON TABLE "public"."tenants" TO "service_role";



GRANT ALL ON TABLE "public"."thinking_assessments" TO "service_role";



GRANT ALL ON TABLE "public"."thought_exercises" TO "service_role";



GRANT ALL ON TABLE "public"."token_balances" TO "service_role";



GRANT ALL ON TABLE "public"."token_conversions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."token_conversions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."token_events" TO "service_role";



GRANT ALL ON TABLE "public"."token_history" TO "service_role";



GRANT ALL ON TABLE "public"."token_sinks" TO "service_role";



GRANT ALL ON SEQUENCE "public"."token_sinks_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."token_statistics" TO "service_role";



GRANT ALL ON TABLE "public"."token_transactions" TO "service_role";



GRANT ALL ON TABLE "public"."tokens" TO "service_role";
GRANT SELECT ON TABLE "public"."tokens" TO "authenticated";



GRANT ALL ON TABLE "public"."user_achievements" TO "service_role";
GRANT SELECT ON TABLE "public"."user_achievements" TO "authenticated";



GRANT ALL ON TABLE "public"."user_actions" TO "service_role";



GRANT ALL ON TABLE "public"."user_activity_stats" TO "service_role";



GRANT ALL ON TABLE "public"."user_ai_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."user_assessments" TO "service_role";



GRANT ALL ON TABLE "public"."user_badges" TO "service_role";



GRANT ALL ON TABLE "public"."user_community" TO "service_role";



GRANT ALL ON TABLE "public"."user_concept_progress" TO "service_role";



GRANT ALL ON TABLE "public"."user_connections" TO "service_role";



GRANT ALL ON TABLE "public"."user_exercise_progress" TO "service_role";



GRANT ALL ON TABLE "public"."user_external_mappings" TO "service_role";



GRANT ALL ON TABLE "public"."user_gamification_stats" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."user_gamification_stats" TO "authenticated";



GRANT ALL ON TABLE "public"."user_health_summary" TO "service_role";



GRANT ALL ON TABLE "public"."user_mentions" TO "service_role";



GRANT ALL ON TABLE "public"."user_onboarding" TO "service_role";



GRANT ALL ON TABLE "public"."user_platform_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."user_points" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."user_recommendations" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "service_role";



GRANT ALL ON TABLE "public"."user_segments" TO "service_role";



GRANT ALL ON TABLE "public"."user_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."user_skills" TO "service_role";



GRANT ALL ON TABLE "public"."user_token_progress" TO "service_role";



GRANT ALL ON TABLE "public"."vital_signs" TO "service_role";



GRANT ALL ON TABLE "public"."votes" TO "service_role";



GRANT ALL ON TABLE "public"."xp_events" TO "service_role";



GRANT ALL ON TABLE "public"."xp_multipliers" TO "service_role";



GRANT ALL ON TABLE "public"."zoom_attendance" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON SEQUENCES  TO "dashboard_user";



ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON FUNCTIONS  TO "dashboard_user";



ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON TABLES  TO "dashboard_user";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";



RESET ALL;
