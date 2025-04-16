# Neothink Gamification & Tokenomics Simulation Guide: Positive-Sum Game Theory & Tokenomics

This guide explains the updated simulation suite for the Neothink ecosystem, reflecting the latest positive-sum, token-only, and cross-app engagement model.

---

## 1. Simulation Overview
- **Personas:**
  - Ascenders (**LIVE**): Prosperity, business growth, value creation
  - Neothinkers (**LOVE**): Happiness, integrated thinking, knowledgepreneurship
  - Immortals (**LIFE**): Longevity, health, self-leadership, anti-aging
  - Neothink+ Hub (**LUCK**): Unification, cross-app synergy, Prosper Happily Forever
- **Tokens:** Only LIVE, LOVE, LIFE, and LUCK exist. All rewards, metrics, and gamification use these tokens exclusively.
- **Roles:** Subscriber, Participant, Contributor (fluid transitions; all earn tokens, with higher roles earning more for higher-value actions)
- **Scenarios:** Simulate onboarding, progression, mastery, cross-app engagement, weekly meetings, and team collaboration.
- **Phases:** Models user journeys from discovery to mastery, including onboarding and progression.
- **Events:** Simulates XP, badges, Fibonacci rewards, census snapshots, and more, using real Supabase tables and edge functions.
- **Metrics:** Tracks retention, engagement, time spent, satisfaction, reward balance, repetitive task score, and collaboration.

---

## 2. Setup

1. **Install dependencies (if not already):**
   ```bash
   npm install @supabase/supabase-js
   ```
2. **Set environment variables:**
   - `NEXT_PUBLIC_SUPABASE_URL` (your Supabase project URL)
   - `SUPABASE_SERVICE_ROLE_KEY` (service role key for simulation writes)

---

## 3. Running the Simulation

1. **Navigate to the simulation directory:**
   ```bash
   cd packages/testing/simulation/scripts
   ```
2. **Run the main simulation script:**
   ```bash
   ts-node runSimulation.ts
   ```
   - This will create simulated users and events across all personas and phases, inserting data into your Supabase database.
   - Results and metrics will be logged to the console.
   - All data is denominated in LIVE, LOVE, LIFE, and LUCK.

---

## 4. Metrics & Analysis

- **Metrics:**
  - Retention, engagement, satisfaction, reward balances (LIVE, LOVE, LIFE, LUCK)
  - Collaboration and cross-app engagement
  - Role transitions and Superachiever scenarios
- **Dashboards:** Use the admin dashboard to view real-time event streams, leaderboards, census trends, and user journeys populated by simulation data.
- **Bottlenecks:** Look for signs of unbalanced rewards, repetitive tasks, or barriers to collaboration/long-term goals.
- **Iteration:** Identify bottlenecks, friction, or anti-patterns. Use findings to improve the ecosystem.

---

## 5. Iteration & Improvement

- **Refine Scenarios:** Modify or add new scenarios in `/packages/testing/simulation/scripts/` to test different strategies or edge cases.
- **Adjust Persona Goals:** Update `/packages/testing/simulation/personas.ts` to reflect evolving user needs or ecosystem priorities.
- **Optimize Queries:** Tweak `/packages/testing/simulation/queries.ts` for performance or new data requirements.
- **Document Learnings:** Record findings and recommendations in this doc or as issues/tasks in your project management system.

---

## 6. Best Practices
- **Use Staging:** Run simulations in a staging environment before production.
- **RLS:** Ensure Row Level Security is enforced for all event tables.
- **Modularity:** Add new personas, events, or metrics as your ecosystem grows.
- **Continuous Feedback:** Use admin/user feedback and simulation results to drive continuous improvement.

---

## 7. Example: Adding a New Scenario

1. Create a new scenario script in `/packages/testing/simulation/scripts/` (e.g., `viralLoopScenario.ts`).
2. Define the scenario logic, leveraging existing queries/utilities.
3. Run and analyze as above.

---

## 8. Support & Contribution
- **Extend:** PRs welcome! Add new personas, events, or analytics.
- **Ask:** For questions, contact the dev team or open an issue.

---

This simulation suite is designed for continuous, collaborative improvement—helping Neothink magnetically attract, engage, and delight users/admins for years to come.

_Last updated: 2025-04-15_
