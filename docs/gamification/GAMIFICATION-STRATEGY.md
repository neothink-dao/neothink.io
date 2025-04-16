# docs/gamification/strategy.md

# Neothink+ Gamification & Tokenomics Strategy (v1)

## Core Principles

1.  **Positive-Sum:** Reward value creation for self and community. Avoid zero-sum mechanics.
2.  **Value Alignment:** Gamification drives engagement with Ascenders (Prosperity), Neothinkers (Happiness), and Immortals (Longevity).
3.  **Clarity & Transparency:** Rules are understandable; progress is visible.
4.  **Balance & Progression:** Cater to new, regular, and "Superachiever" users. Fair reward curves.
5.  **Integration:** Unified experience across Hub, Ascenders, Neothinkers, Immortals via shared DB/logic.
6.  **Fun & Delight:** Engaging, rewarding, and aesthetically pleasing UX.

## I. Core Currencies & Resources

1.  **Points (Universal):**
    *   Source: Completing actions across platforms.
    *   Storage: `user_gamification_stats.points`.
    *   Use: Leaderboards, basic unlocks, governance staking.
2.  **Tokens (Platform-Specific Value):**
    *   Source: Points conversion based on action context.
    *   Storage: `tokens` table (`live`, `love`, `life`, `luck`).
    *   Mapping:
        *   `LIVE` (Orange): Ascenders actions (Prosperity).
        *   `LOVE` (Amber): Neothinkers actions (Happiness).
        *   `LIFE` (Red/Purple): Immortals actions (Longevity).
        *   `LUCK` (Yellow): Hub, cross-platform, logins, governance success (Engagement/Potential).
3.  **Reputation/Status (Implicit):**
    *   Neothink Levels (1-12).
    *   Team Roles.
    *   Governance History.
    *   Achievement Badges (`user_achievements`).
    *   Superachiever Status (All 3 subs).
    *   Use: Access control, community standing, potential governance weight.

## II. Earning Mechanics

*   **Base Points:** Defined per action (See examples below).
*   **Token Mapping:** `mint_points_on_action` DB function maps Points->Tokens based on action context.
*   **Example Base Points (Illustrative - Needs Balancing):**
    *   *General:* Daily Login (1 + LUCK), Profile Complete (5 + LUCK), Refer User (100 + LUCK)
    *   *Ascenders (-> LIVE):* Watch Video (3), Complete Task (10), Setup FLOW (20), First Sale (50), Mon Zoom (15)
    *   *Neothinkers (-> LOVE):* Read Chapter (2), Level Assess (25+), Fellowship Post (5), Comment (2), Institute (8), Wed Zoom (15)
    *   *Immortals (-> LIFE):* Log Data (3), Protocol Comp (10), Discuss (4), Fri Zoom (15)
    *   *Hub (-> LUCK):* Sun Zoom (20), Gov Stake Success (?)

## III. Multipliers & Bonuses (Applied by `mint_points_on_action`)

1.  **Vortex Multipliers (Applied to Base Points):**
    *   Read/Watch: x3
    *   Write/Share/Log: x6
    *   Execute/Implement: x9
    *   *(Needs Clarification: Define Vortex Multiplier if different from above types)*
2.  **Superachiever Multiplier (Replaces Vortex):**
    *   If subscribed to Ascenders, Neothinkers, AND Immortals: x13 on Base Points for *all* actions.
3.  **Synergy Boost (Zooms):**
    *   Attend designated weekly Zoom: Base Points * 27 (Applied instead of/in addition to Vortex? TBD Rule). Requires attendance tracking.
4.  **Fibonacci Streak Bonus (Added after Multipliers):**
    *   Based on consecutive days of meaningful activity.
    *   Bonus = `fibonacci(streak_count)` (capped at F13=233).
5.  **Golden Streak Multiplier (Applied to Fibonacci Bonus):**
    *   Scales the streak bonus reward based on streak length.
    *   Multiplier = `1 + min(1.618, (streak - 1) / (34 - 1) * 1.618)`. (Up to 2.618x on the bonus).
6.  **Trial User Modifier:** 1 Point per action, no multipliers/bonuses.
7.  **Inactive User Modifier:** Multipliers and streak bonuses are disabled (`multiplier = 1.0`, `streakBonus = 0`).

## IV. Systems & Features

1.  **Teams:** Join/Form teams. `Team Boost` adds to team `earnings` pool (currently 'points' key) using formula: `floor(0.618 * activeMembers * (5 / teamSize) * memberPointsEarned)`. Pool usage TBD.
2.  **Governance:** Stake `Points`. Voting Power = `round(min(34, sqrt(staked_points)))`. Stake refunded on approval. Needs UI.
3.  **Trial Period (7 Days):** Restricted points/actions. Clear UI indicators needed.
4.  **Daily Caps (`capRewards` Edge Function):** Limit points *per category* (read, write, execute) per day (e.g., 13). Requires `daily_point_log` table and Edge Function implementation. Zooms/Superachiever may have different/no caps.
5.  **Caching (`cachePoints` Edge Function):** Use Edge Functions + cache store (Redis, etc.) for leaderboards, balances. Requires implementation.
6.  **Inactive User Flagging:** Daily `pg_cron` job updates `is_inactive` flag based on 6 months inactivity. `mint_points_on_action` checks flag.

## V. User Journey & Progression

*   **Onboarding:** Intro to platform & points.
*   **Initial:** Core learning loops, streaks.
*   **Mastery:** Execute actions, community features, teams, Neothink Levels.
*   **Cross-Platform:** Hub promotion, LUCK bonuses.
*   **Superachiever:** x13 multiplier incentive.
*   **Veteran:** Long streaks, leadership, governance, high-tier achievements.

## VI. Token Utility

*   **Initial:** Status display, profile cosmetics, access control (content, channels), leaderboards.
*   **Future:** Spend on digital goods, weighted voting, temporary boosts. (Avoid cash-out initially).

## VII. Implementation Notes & Blockers

*   **Database:** Migration v20 blocked by `update_team_earnings` conflict (Manual Fix Needed). `posts` RLS needs manual application. Local migration files need manual creation.
*   **Edge Functions:** `capRewards` & `cachePoints` require manual TypeScript implementation & deployment.
*   **Frontend:** File moves (`packages/ui`), dependency install (`pnpm install` blocked by husky), admin page restore/merge require manual action. Data fetching, state management, UI refinement require manual coding.
*   **Strategy:** Vortex multiplier clarification needed. Zoom boost interaction needs defining. Point balancing requires testing. 