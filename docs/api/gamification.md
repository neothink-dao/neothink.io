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
