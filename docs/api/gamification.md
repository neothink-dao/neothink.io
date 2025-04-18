---
title: Gamification & Tokenomics API
last_updated: 2025-04-15
summary: Reference for all gamification, XP, token, badge, and event endpoints across all platforms.
related_routes:
  - /api/gamification
  - /api/gamification/leaderboard
  - /api/gamification/log-action
  - /api/gamification/log-census
  - /api/gamification/onboarding-event
  - /api/gamification/profile
---

# Gamification & Tokenomics API

This page documents the core endpoints powering XP, tokens, badges, streaks, onboarding, and event logging for all user journeys (Ascender, Neothinker, Immortal, Superachiever).

---

## Endpoints

### 1. **Leaderboard**
- **GET** `/api/gamification/leaderboard`
  - Returns current leaderboard by XP, tokens, or badges.
  - Supports filters by archetype, timeframe, and team.

### 2. **Log Action**
- **POST** `/api/gamification/log-action`
  - Log a user action (e.g., quest, referral, event attendance).
  - **Body:** `{ userId, actionType, xp, tokens, metadata }`
  - Returns: `{ success, newXp, newTokens, eventId }`

### 3. **Log Census**
- **POST** `/api/gamification/log-census`
  - Log a census snapshot (e.g., streaks, daily activity, health check).
  - **Body:** `{ userId, snapshotType, value, metadata }`
  - Returns: `{ success, snapshotId }`

### 4. **Onboarding Event**
- **POST** `/api/gamification/onboarding-event`
  - Log onboarding progress (e.g., completed quest, tutorial step).
  - **Body:** `{ userId, step, completed, metadata }`
  - Returns: `{ success, eventId }`

### 5. **Profile**
- **GET** `/api/gamification/profile`
  - Returns gamification stats for the current user (XP, tokens, badges, streaks, referrals, level).

---

## ✨ Gamification & Tokenomics: User & Admin Guide (2025)

### For Users
- **How to Earn Points:** Complete actions, challenges, referrals, and cross-app events. See your progress in your dashboard.
- **How to Spend Points:** Vote, unlock features, make purchases, and participate in crowdfunding.
- **Level Up:** Progress through tiers and earn badges for milestones.
- **Transparency:** All actions are logged and auditable.
- **Support:** FAQs and troubleshooting are available in the support docs.

### For Admins
- **Configure Rewards:** Tune multipliers, onboarding rewards, and app-specific challenges in the admin dashboard.
- **Audit Logs:** Review all point transactions and event logs for compliance.
- **Analytics:** Monitor engagement, leaderboards, and cross-app synergy.
- **Security:** Enforce RLS, positive-sum logic, and review function logs.
- **Continuous Improvement:** Use analytics and feedback to iterate reward logic.

## 🆕 What’s New in 2025?
- Partitioned event/audit tables for scale.
- Centralized reward engine and dynamic multipliers.
- Cross-app bonuses and Vortex Math logic.
- Enhanced onboarding and challenge tracking.
- Real-time analytics for admins.

## 📚 Quick Links
- [User Game Guides](../onboarding/README.md)
- [Admin Guide](../admin/ADMIN-OVERVIEW.md)
- [Database Schema](../architecture/database.md)
- [Security & RLS](../../SECURITY.md)

## 🗺️ User & Admin Flows
- **Users:** Earn points, complete challenges, participate in governance, get support.
- **Admins:** Configure rewards, monitor analytics, audit logs, improve mechanics.

## 🔄 Continuous Improvement
- Docs and APIs are reviewed and updated regularly based on user/admin feedback and analytics.

---

## Example Usage

```ts
// Log an action (Next.js fetch example)
fetch('/api/gamification/log-action', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-uuid',
    actionType: 'attend_event',
    xp: 50,
    tokens: 1,
    metadata: { event: 'weekly_zoom' }
  })
});
```

---

## TypeScript Types

Types for all endpoints and payloads are auto-generated from the Supabase schema and available in:
- `packages/core/database/types.ts`
- `packages/database/src/types/database.types.ts`

---

## Feedback & Improvements

Found an issue or want to suggest an improvement? [Open an issue](https://github.com/NeothinkDAO/your-repo/issues/new/choose).

---

> All endpoints are protected and follow positive-sum, secure-by-default principles. See security docs for RLS and access policies.
