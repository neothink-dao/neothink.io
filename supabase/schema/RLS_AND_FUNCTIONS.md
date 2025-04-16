# Supabase RLS Policies & Database Functions

This document summarizes all Row Level Security (RLS) policies and key database functions for the Neothink DAO platform. All policies and functions are designed for clarity, security, and DAO governance. **Keep this file up to date after every migration.**

---

## 🔐 Row Level Security (RLS) Policies

### General Principles
- **RLS is enabled on all user data tables.**
- **Granular policies** are defined for each action (`select`, `insert`, `update`, `delete`) and for each relevant role (`anon`, `authenticated`, `service_role`).
- **DAO governance**: All policy changes must be reviewed and approved by the DAO.

### Example Table: `gamification_events`
- `enable row level security;`
- `select`: Allowed for all `authenticated` users.
- `insert`: Allowed for `authenticated` users if `amount >= 0` (positive-sum only).
- `update`/`delete`: Not allowed (append-only event log).

### Example Table: `teams`
- `enable row level security;`
- `select`: Allowed for all `authenticated` users.
- `insert`: Allowed for `authenticated` users.
- `update`/`delete`: Allowed only for team creator (`created_by = auth.uid()`).

### Example Table: `user_badges`
- `enable row level security;`
- `select`: Allowed for `authenticated` users if `auth.uid() = user_id`.
- `insert`: Allowed for `authenticated` users if `auth.uid() = user_id`.

### Example Table: `referrals`
- `enable row level security;`
- `select`: Allowed for `authenticated` users if `auth.uid() = referrer_id OR auth.uid() = referred_id`.
- `insert`: Allowed for `authenticated` users if `auth.uid() = referrer_id`.

### More Tables
- All other event, team, badge, and analytics tables follow similar granular, least-privilege RLS patterns. See migrations for full details.

---

## ⚡ Key Database Functions

- **All functions set `search_path = ''` and use fully qualified names for security.**
- **Default to `SECURITY INVOKER` unless side effects require `SECURITY DEFINER`.**

### Example: Add User to Tenant
```sql
create or replace function public.add_user_to_tenant(_user_id uuid, _tenant_slug text, _role text default 'member')
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  _tenant_id uuid;
begin
  select id into _tenant_id from public.tenants where slug = _tenant_slug;
  if _tenant_id is null then return false; end if;
  insert into public.tenant_users (tenant_id, user_id, role, status)
    values (_tenant_id, _user_id, _role, 'active')
    on conflict (tenant_id, user_id) do update set role = _role, status = 'active', updated_at = now();
  update public.profiles set platforms = array_append(coalesce(platforms, array[]::text[]), _tenant_slug)
    where id = _user_id and (_tenant_slug != all(coalesce(platforms, array[]::text[])) or platforms is null);
  return true;
end;
$$;
```

### Example: Advance User Week
```sql
create or replace function public.advance_user_week(p_user_id uuid, p_platform text)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_week integer;
begin
  select week_number into current_week from user_progress where user_id = p_user_id and platform = p_platform::platform_type;
  if not found then return false; end if;
  update user_progress set week_number = week_number + 1, last_updated = now() where user_id = p_user_id and platform = p_platform::platform_type;
  return true;
end;
$$;
```

### Example: Award Message Tokens (Trigger)
```sql
create or replace function public.award_message_tokens()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  token_amount int;
  token_col text;
  user_subscription_tier text;
begin
  if new.reward_processed then return new; end if;
  select subscription_tier into user_subscription_tier from profiles where id = new.sender_id;
  if user_subscription_tier = 'superachiever' then token_amount := 15;
  elsif user_subscription_tier = 'premium' then token_amount := 10;
  else token_amount := 5;
  end if;
  if new.token_tag = 'LUCK' then token_col := 'luck_balance';
  elsif new.token_tag = 'LIVE' then token_col := 'live_balance';
  elsif new.token_tag = 'LOVE' then token_col := 'love_balance';
  elsif new.token_tag = 'LIFE' then token_col := 'life_balance';
  else token_col := 'love_balance'; new.token_tag := 'LOVE';
  end if;
  insert into token_balances (user_id) values (new.sender_id) on conflict (user_id) do nothing;
  execute format('update token_balances set %I = %I + $1, updated_at = now() where user_id = $2', token_col, token_col) using token_amount, new.sender_id;
  insert into token_transactions (user_id, token_type, amount, source_type, source_id, description) values (new.sender_id, new.token_tag, token_amount, 'message', new.id, 'Token reward for chat activity');
  new.reward_processed := true;
  return new;
end;
$$;
```

---

## 📋 Best Practices
- **All policies and functions are reviewed by the DAO.**
- **Documentation is kept in sync with migrations and schema.**
- **Least privilege and separation of concerns are enforced throughout.**

---

For full details, see the migration files and schema.sql. For questions or proposals, consult the DAO or submit a PR.
