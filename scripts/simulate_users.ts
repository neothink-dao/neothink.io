/**
 * Ready-to-run simulation script for 1000+ virtual users with diverse behavior profiles.
 * - Simulates onboarding, engagement, drop-off, referrals, and reward earning.
 * - Aggregates results and inserts into Supabase simulation_runs table.
 *
 * Usage: pnpm tsx scripts/simulate_users.ts
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in env
 */

import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// --- CONFIG ---
const NUM_USERS = 1000;
const BEHAVIOR_PROFILES = {
  power_user: { pct: 0.2, actions: ['onboard', 'refer', 'streak', 'max_rewards'] },
  casual: { pct: 0.5, actions: ['onboard', 'occasional_action'] },
  dropoff: { pct: 0.3, actions: ['onboard', 'early_exit'] }
};
const REWARD_RULES = {
  xp_multiplier: 1.0,
  badge_threshold: 5,
  referral_bonus: 10
};
const SIMULATION_USER_ID = process.env.SIMULATION_USER_ID || uuidv4(); // Use a dedicated test UUID or env

// --- INIT SUPABASE ---
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// --- SIMULATION LOGIC ---
type UserProfile = keyof typeof BEHAVIOR_PROFILES;
type SimResult = {
  profile: UserProfile;
  xp: number;
  badges: number;
  referrals: number;
  completed: boolean;
};

function pickProfile(): UserProfile {
  const r = Math.random();
  let acc = 0;
  for (const [profile, { pct }] of Object.entries(BEHAVIOR_PROFILES)) {
    acc += pct;
    if (r < acc) return profile as UserProfile;
  }
  return 'casual'; // fallback
}

function simulateUser(profile: UserProfile): SimResult {
  let xp = 0, badges = 0, referrals = 0, completed = false;
  const actions = BEHAVIOR_PROFILES[profile].actions;

  if (actions.includes('onboard')) xp += 10 * REWARD_RULES.xp_multiplier;
  if (actions.includes('refer')) referrals += Math.floor(Math.random() * 6); // up to 5
  if (actions.includes('streak')) xp += 30 * REWARD_RULES.xp_multiplier;
  if (actions.includes('max_rewards')) badges += 2;
  if (actions.includes('occasional_action')) xp += 5 * REWARD_RULES.xp_multiplier;
  if (actions.includes('early_exit')) completed = false;
  else completed = true;
  if (xp / REWARD_RULES.badge_threshold >= 1) badges += Math.floor(xp / REWARD_RULES.badge_threshold);
  xp += referrals * REWARD_RULES.referral_bonus;
  return { profile, xp, badges, referrals, completed };
}

async function main() {
  const results: SimResult[] = [];
  for (let i = 0; i < NUM_USERS; ++i) {
    const profile = pickProfile();
    results.push(simulateUser(profile));
  }
  // Aggregate
  const summary = {
    total_users: NUM_USERS,
    by_profile: Object.fromEntries(
      Object.keys(BEHAVIOR_PROFILES).map(p => [p, results.filter(r => r.profile === p).length])
    ),
    avg_xp: results.reduce((a, b) => a + b.xp, 0) / NUM_USERS,
    avg_badges: results.reduce((a, b) => a + b.badges, 0) / NUM_USERS,
    avg_referrals: results.reduce((a, b) => a + b.referrals, 0) / NUM_USERS,
    completion_rate: results.filter(r => r.completed).length / NUM_USERS
  };

  // Insert into simulation_runs
  const { error } = await supabase.from('simulation_runs').insert([
    {
      user_id: SIMULATION_USER_ID,
      scenario_name: '1000_user_behavior_simulation',
      parameters: { NUM_USERS, BEHAVIOR_PROFILES, REWARD_RULES },
      result_summary: summary,
      detailed_results: results,
      status: 'completed',
      started_at: new Date().toISOString(),
      finished_at: new Date().toISOString(),
      notes: 'Simulated 1000 users with diverse behavior profiles to analyze gamification/tokenomics outcomes.'
    }
  ]);
  if (error) {
    console.error('Failed to insert simulation run:', error);
    process.exit(1);
  }
  console.log('Simulation complete. Summary:', summary);
}

main();
