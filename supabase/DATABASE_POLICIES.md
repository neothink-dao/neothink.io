# DATABASE POLICIES: RLS & Security Best Practices

## Overview
This document summarizes all Row Level Security (RLS) and policy decisions for every table in the shared Supabase database. Every table is created with RLS enabled and granular, role-based policies for select, insert, update, and delete.

---

## Policy Template Example
```sql
-- Enable RLS
alter table public.example_table enable row level security;

-- Select policy for authenticated users
create policy "Allow select for authenticated" on public.example_table
  for select using (auth.role() = 'authenticated');

-- Insert policy for authenticated users
create policy "Allow insert for authenticated" on public.example_table
  for insert with check (auth.role() = 'authenticated');

-- Update policy for row owner
create policy "Allow update for self" on public.example_table
  for update using (user_id = auth.uid());

-- Delete policy for admin only
create policy "Allow delete for admin" on public.example_table
  for delete using (auth.role() = 'service_role');
```

---

## Table-by-Table RLS Summary

### `public.gamification_events`
- RLS enabled.
- Policies:
  - Select: authenticated users
  - Insert: authenticated users
  - Update: none (immutable)
  - Delete: service_role only

### `public.xp_events`, `public.badge_events`, `public.fibonacci_token_rewards`, `public.census_snapshots`
- RLS enabled.
- Policies:
  - Select: authenticated users
  - Insert: authenticated users
  - Update: none (immutable)
  - Delete: service_role only

### `public.user_roles`
- RLS enabled.
- Policies:
  - Select: authenticated users
  - Update: row owner only (`user_id = auth.uid()`)

### `public.teams`, `public.team_memberships`, `public.proposals`, `public.votes`, `public.crowdfunding`
- RLS enabled.
- Policies:
  - Select: authenticated users
  - Insert: authenticated users
  - Update: row owner or team admin
  - Delete: service_role only

### `public.token_sinks`, `public.token_conversions`, `public.site_settings`
- RLS enabled.
- Policies:
  - Select: authenticated users
  - Insert: authenticated users
  - Update: none (immutable)
  - Delete: service_role only

---

## Policy Rationale
- **No combined policies:** Each action and role has its own policy for clarity and auditability.
- **Granular control:** Policies are as specific as possible to minimize risk.
- **Comment every policy:** All migrations include comments explaining policy intent.

---

## How to Add/Update Policies
- Use the template above.
- Always enable RLS.
- Add one policy per action/role.
- Document rationale in migration comments.
