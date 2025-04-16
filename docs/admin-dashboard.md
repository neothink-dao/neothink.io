# Admin Dashboard Guide

Welcome to the Admin Dashboard for the Neothink DAO Gamification Platform! This dashboard provides real-time insights, analytics, and management tools for your unified gamification system across all apps.

---

## Features

- **Live Event Stream:** See XP, badge, Fibonacci, and census events as they happen, powered by Supabase Realtime.
- **Leaderboard:** Instantly view the top users by XP and badge count.
- **Census Trends:** Visualize population, activity, and asset trends over time.
- **User Search:** Lookup and drill into user journeys and event history.
- **Export:** Download all event data (JSON) for analytics or audit.

---

## Usage Instructions

1. **Access:**
   - Log in as an admin or family_admin. Only authorized users can access the dashboard (RLS enforced).

2. **Live Event Stream:**
   - Watch all key gamification and census events update in real time.

3. **Leaderboard:**
   - See who’s leading in XP and badge count. Use this for recognition, rewards, or community engagement.

4. **Census Trends:**
   - Analyze population, activity, and asset growth. Identify trends and anomalies.

5. **User Search:**
   - Enter a user ID to see their recent XP and badge events. Useful for support and engagement.

6. **Export:**
   - Click the export button to download recent event data for external analysis or compliance.

---

## Extending the Dashboard

- **Add New Event Types:**
  - Update the `useRealtimeEvents` hook and `EventStream` component to include new tables/events.
- **Add Analytics:**
  - Create new components and import them into `page.tsx` as needed.
- **Customize UI:**
  - Use Tailwind or your design system to refine or theme the dashboard.

---

## Security & Best Practices

- **Row Level Security (RLS):**
  - All tables are protected by granular RLS policies. Only authorized users can view or modify sensitive data.
- **Authentication:**
  - Admin dashboard access is restricted to users with the `admin` or `family_admin` roles.
- **Environment Variables:**
  - Ensure all Supabase keys and URLs are set securely in your environment.
- **Production Safety:**
  - All migrations are reviewed and RLS is enforced before launch.

---

## Developer Notes

- All dashboard components are dynamically imported for performance.
- Shared utilities (e.g., `useRealtimeEvents`) are maintained in `/packages/gamification-utils`.
- To extend gamification logic, update shared utilities and edge functions in the monorepo.

---

## Feedback & Continuous Improvement

- Use the dashboard’s feedback tools or contact the dev team to suggest improvements.
- Celebrate key actions (e.g., user milestones, census records) with delightful UI—confetti, badges, and more!

---

For more, see the main README and `/docs` for setup, contribution, and advanced usage.
