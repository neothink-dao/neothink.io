/**
 * Avolve Gamification & Tokenomics Simulation Script
 * -----------------------------------------------
 * Simulates user onboarding, engagement, claims, badges, referrals, and group quests
 * to validate and iterate the Avolve gamification and tokenomics system.
 *
 * Usage: pnpm ts-node scripts/simulate-gamification.ts
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Configurable Parameters ---
const NUM_USERS = 100;
const SIM_DAYS = 21; // Simulate 3 weeks
const DAILY_ACTIONS = ['log_xp', 'claim_token', 'invite', 'onboarding', 'group_quest'];
const TOKENS = ['SPD', 'SHE', 'PSP', 'SSA', 'BSP', 'SGB', 'SMS'];
const BADGE_CRITERIA = [
  { action_type: 'streak', min_streak: 7 },
  { action_type: 'invite', min_streak: 3 },
];

// --- Utility Functions ---
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function getDayToken(day: number): string {
  return TOKENS[day % 7];
}

// --- Synthetic User Generation ---
async function seedUsers(n: number) {
  const users = [];
  for (let i = 0; i < n; i++) {
    const email = `simuser${i}@avolve.ai`;
    const { data, error } = await supabase.from('users').insert({ email }).select();
    if (data && data[0]) users.push(data[0]);
  }
  return users;
}

// --- Simulate Actions ---
async function simulateDay(users: any[], day: number) {
  const dayToken = getDayToken(day);
  for (const user of users) {
    // 1. Log XP event
    await supabase.from('xp_events').insert({ user_id: user.id, xp_amount: 10 + Math.floor(Math.random() * 20), event: 'daily_action', created_at: simDate(day) });
    // 2. Claim token (if not already claimed)
    await supabase.from('fibonacci_token_rewards').insert({ user_id: user.id, token: dayToken, claimed_at: simDate(day), status: 'claimed' });
    // 3. Randomly invite another user
    if (Math.random() < 0.2) {
      const invitee = randomChoice(users.filter(u => u.id !== user.id));
      await supabase.from('referrals').insert({ inviter_id: user.id, invitee_id: invitee.id, invited_at: simDate(day), accepted: Math.random() < 0.7, bonus_awarded: false });
    }
    // 4. Onboarding milestone (first day)
    if (day === 0) {
      await supabase.from('onboarding_events').insert({ user_id: user.id, milestone: 'signup', created_at: simDate(day) });
    }
    // 5. Group quest (simulate group activity)
    if (Math.random() < 0.1) {
      await supabase.from('census_snapshots').insert({ scope: 'group', population: Math.floor(Math.random() * 20) + 5, activity_count: Math.floor(Math.random() * 20), created_at: simDate(day) });
    }
    // 6. Badge event (simulate streaks)
    if (day > 0 && day % 7 === 0) {
      await supabase.from('badge_events').insert({ user_id: user.id, criteria: BADGE_CRITERIA[0], created_at: simDate(day) });
    }
  }
}

function simDate(day: number) {
  const start = new Date();
  start.setDate(start.getDate() - SIM_DAYS + day);
  return start.toISOString();
}

// --- Main Simulation Loop ---
(async function main() {
  console.log('Seeding users...');
  const users = await seedUsers(NUM_USERS);
  console.log(`Seeded ${users.length} users.`);
  for (let day = 0; day < SIM_DAYS; day++) {
    console.log(`Simulating day ${day + 1}/${SIM_DAYS}...`);
    await simulateDay(users, day);
  }
  console.log('Simulation complete. Review results in your admin dashboard and analytics.');
})();
