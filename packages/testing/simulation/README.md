# Neothink Positive-Sum Game Simulation

This simulation suite models user, admin, and ecosystem behaviors for the Neothink DAO platform (Ascenders, Neothinkers, Immortals, Neothink+ Hub) using your existing Next.js, Vercel, and Supabase stack. It validates and iterates on gamification/tokenomics strategies to maximize engagement, satisfaction, and sustainable growth.

## Overview
This simulation models the Neothink ecosystem, focusing on positive-sum game theory across four core apps/sites:
- **Ascenders** (LIVE token): Prosperity, value creation, business growth
- **Neothinkers** (LOVE token): Happiness, integrated thinking, knowledgepreneurship
- **Immortals** (LIFE token): Longevity, health, self-leadership, anti-aging
- **Neothink+ Hub** (LUCK token): Unification, cross-app synergy, Prosper Happily Forever

Each app has a unique token (LIVE, LOVE, LIFE, LUCK). These are the only points/tokens used in the ecosystem. All gamification, rewards, and metrics are denominated in these tokens.

## Key Features
- **Persona-driven:** Simulates Ascenders (LIVE), Neothinkers (LOVE), Immortals (LIFE), Hub (LUCK) with unique goals and reward mechanics.
- **Real Data:** Uses your Supabase schema, edge functions, and real-time features for accurate modeling.
- **Scenario Coverage:** Models onboarding, progression, mastery, collaboration, and cross-app journeys.
- **Metrics:** Tracks retention, engagement, time spent, satisfaction, and reward balance.
- **Continuous Improvement:** Surfaces bottlenecks and recommends actionable improvements.
- **Modular:** Add/modify personas, events, and scenarios as your ecosystem evolves.

## Roles
- **Subscriber**: Read-only access, earns app tokens for engagement (attendance, reading, viewing)
- **Participant**: Write access, earns more tokens for active participation (posting, commenting, discussions)
- **Contributor**: Execute access, earns the most tokens for high-value actions (content creation, leading, organizing)
- **Fluid transitions**: Users can move between roles in any app based on actions

## Simulation Scenarios
- Onboarding, progression, mastery for each persona/app
- Weekly meetings for each app (Sunday: Hub/LUCK, Monday: Ascenders/LIVE, Wednesday: Neothinkers/LOVE, Friday: Immortals/LIFE)
- Cross-app engagement and Superachiever scenarios (users subscribing to all 3 for maximum synergy)
- Team actions and collaborative mechanics for positive-sum bonuses

## Metrics
- All metrics are tracked in LIVE, LOVE, LIFE, and LUCK only
- Metrics include retention, engagement, satisfaction, reward balance, collaboration, role transitions, cross-app engagement

## Directory Structure
- `/scripts/` — Simulation runners, scenario definitions, and metrics collectors.
- `/components/` — (Optional) React components for visualizing simulation results (charts, dashboards).
- `/queries/` — Supabase queries/utilities for efficient data operations.

## Simulation Framework for Neothink Gamification & Tokenomics

## Overview
This simulation framework enables rapid iteration and analytics for the gamification and tokenomics strategy across all Neothink sites/apps (hub, ascenders, neothinkers, immortals). It is designed for a monorepo/turborepo with a single shared Supabase database and supports advanced, per-site/app and per-persona tuning.

## Key Features
- **Batch simulation** with per-site/app, per-token, and per-persona parameterization
- **Database-backed analytics**: All token actions (earn, spend, convert, collaboration, streaks) are logged in Supabase
- **Dynamic rewards**: Rewards, bonuses, and conversion rates are fetched from the `site_settings` table
- **Supports token sinks and conversions** for advanced tokenomics modeling
- **Persona/context-aware logic**: Different personas are rewarded differently per site/app

## Database Schema
- `gamification_events`: All token actions (earn, spend, collaboration, convert, streaks)
- `token_sinks`: Where tokens are spent (feature unlocks, raffles, donations, etc.)
- `token_conversions`: User-initiated conversions between token types
- `site_settings`: Per-site/app gamification parameters (base_reward, collab_bonus, streak_bonus, diminishing_threshold, conversion_rates)

All tables use Row Level Security (RLS) and follow Supabase best practices.

## How to Run a Batch Simulation
1. **Configure** your simulation in `batchConfigs/variant1.json` (or add more configs):
   - Set `numUsers`, `sites`, `rewardParams` (per-site/app), and `personaDistribution`.
2. **Run the batch simulation:**
   ```sh
   # From the simulation directory
   ts-node batchSimulate.ts
   ```
3. **Results:**
   - Results are written to the `results/` directory as JSON files.
   - Analytics include per-site/app, per-token, and per-persona summaries.

## How to Tune Gamification/Tokenomics
- Edit `rewardParams` in your config for each site/app:
  - `base_reward`: Default reward for actions
  - `collab_bonus`: Collaboration event bonus
  - `streak_bonus`: Streak/milestone bonus
  - `diminishing_threshold`: Threshold for diminishing returns
  - `conversion_rates`: Conversion rates between tokens
- Edit `personaDistribution` to test different user mixes

## How to Add New Scenarios or Sites
- Add new scenario logic in `scenarios/`
- Register in `batchSimulate.ts` scenarioMap
- Add new site/app configs in your batch config

## Analytics & Learnings
- All token actions are queryable from Supabase for dashboarding and further analysis
- Batch simulation outputs detailed JSON for each run
- Use results to iterate and optimize your gamification/tokenomics before launch

## Best Practices
- All secrets in `.env` (never hardcoded)
- All SQL and database logic follows Supabase security and schema best practices
- Code is modular and extensible for rapid experimentation

## Usage
See `/docs/simulation.md` for setup, running simulations, analyzing results, and iterating on strategies.

## How to Run
- See `/docs/simulation.md` for setup and execution instructions

## Learnings & Iteration
- The simulation is iteratively improved based on results, learnings, and community feedback
- Only the four tokens exist—no meta-points, respect points, or other currencies

## Principles
- **Realistic:** Models real user behaviors and system constraints.
- **Collaborative:** Tests for win-win, cross-persona outcomes.
- **Efficient:** Surfaces and minimizes time-intensive, repetitive, or unbalanced mechanics.
- **Actionable:** Every result leads to clear recommendations for improvement.

---

For more, see `/docs/simulation.md`.

_Last updated: 2025-04-15_

For more details, see comments in code and consult the [Supabase docs](https://supabase.com/docs) for advanced features (Edge Functions, Realtime, Data API, UI Library, MCP Server, Declarative Schemas).
