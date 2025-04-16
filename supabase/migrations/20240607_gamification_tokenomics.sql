-- DEPRECATED MIGRATION (2024-06-07)
-- This migration is superseded by 20240607183000_gamification_tokenomics.sql and later files.
-- It is retained for historical reference only and should NOT be applied to new databases.
-- All logic here has been replaced or improved in subsequent migrations.
--
-- DO NOT APPLY OR MODIFY. See README.md in this directory for migration best practices.

-- Migration: Gamification & Tokenomics System (2024-06-07)

-- 1. Users Table: Add XP/level fields for each role, referral fields
ALTER TABLE users
ADD COLUMN IF NOT EXISTS ascender_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ascender_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS neothinker_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS neothinker_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS immortal_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS immortal_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS superachiever_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS superachiever_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS referral_code TEXT,
ADD COLUMN IF NOT EXISTS referred_by TEXT;

-- 2. User Actions Table: Log all XP-earning actions
CREATE TABLE IF NOT EXISTS user_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action_type TEXT NOT NULL, -- e.g. 'read', 'comment', 'post', 'refer', 'attend_zoom'
  role TEXT NOT NULL,        -- 'ascender', 'neothinker', 'immortal', 'superachiever'
  xp_earned INTEGER NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 3. Badges Table: Define all badge types
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  role TEXT, -- 'ascender', 'neothinker', 'immortal', 'superachiever', or NULL for global
  criteria JSONB, -- e.g. {"action_type": "comment", "count": 10}
  nft_url TEXT,   -- for future on-chain/NFT integration
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 4. User Badges Table: Track which badges each user has earned
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  badge_id UUID REFERENCES badges(id),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 5. Referrals Table: Track referrals (optional, for advanced tracking)
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id),
  referred_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);