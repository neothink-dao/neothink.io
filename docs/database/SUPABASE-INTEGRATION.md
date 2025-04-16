# Supabase Integration Guide

> **Proprietary Notice:**  
> This project and all related documentation are proprietary software owned and controlled by Neothink DAO and the Mark Hamilton Family. All rights reserved. Unauthorized use, distribution, or reproduction is strictly prohibited. See the [LICENSE](../../LICENSE) file for details.

> **See Also:**
> - [Schema Documentation](./schema_documentation.md) for all tables and relationships
> - [Migrations Guide](./MIGRATIONS.md) for schema changes and versioning
> - [Database Diagram (ERD)](./database_diagram.md) for visual schema
> - [Getting Started](../getting-started/README.md) for onboarding
> - [Security Guide](../security/security.md) for RLS and auth policies

This guide explains how Supabase is integrated across the Neothink Platform monorepo.

## 🚀 Overview

The Neothink Platform uses a single Supabase project for all four applications:

- **Project Name**: neothink
- **Region**: US East (N. Virginia)
- **Database**: PostgreSQL
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Edge Functions**: Supabase Edge Functions

## 🔧 Setup

### Prerequisites

1. Supabase project created
2. Database schema designed
3. Authentication configured
4. Storage buckets created
5. Edge functions deployed

### Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://dlmpxgzxdtqxyzsmpaxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:54322/postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
```

## 📦 Package Structure

### Core Package

The `packages/core` package contains the Supabase client and utilities:

```typescript
// packages/core/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
```

### Database Package

The `packages/database` package contains database utilities:

```typescript
// packages/database/src/index.ts
export * from './queries';
export * from './mutations';
export * from './types';
export * from './utils';
```

## 🔒 Authentication

### Client-Side Auth

```typescript
// packages/auth/src/client.ts
import { supabase } from '@neothink/core';

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};
```

### Server-Side Auth

```typescript
// packages/auth/src/server.ts
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getServerClient = () => {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
};
```

## 📊 Database Schema

For a full list of tables, columns, and relationships, see [Schema Documentation](./schema_documentation.md) and [Database Diagram (ERD)](./database_diagram.md).

### Tables

```sql
-- users table
create table users (
  id uuid references auth.users on delete cascade,
  email text,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);

-- profiles table
create table profiles (
  id uuid references auth.users on delete cascade,
  username text unique,
  avatar_url text,
  website text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);

-- sessions table
create table sessions (
  id uuid default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  expires_at timestamp with time zone,
  primary key (id)
);
```

### Policies

For detailed RLS and policy examples, see [Schema Documentation](./schema_documentation.md) and [Security Guide](../security/security.md).

## 🔄 Migrations

### Creating Migrations

```bash
# Generate migration
supabase migration new create_users_table

# Apply migration
supabase db push
```

### Migration Files

```typescript
// supabase/migrations/20240101000000_create_users_table.sql
create table users (
  id uuid references auth.users on delete cascade,
  email text,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);
```

## 📈 Monitoring

### Database Metrics

- Query performance
- Connection pool
- Storage usage
- Backup status

### Error Tracking

- Query errors
- Authentication failures
- Policy violations
- Storage errors

## 🔒 Security

### Row Level Security

- Enable RLS on all tables
- Create appropriate policies
- Test policy effectiveness
- Monitor policy violations

### Authentication

- Use secure session management
- Implement proper token handling
- Enable MFA where possible
- Monitor auth attempts

## 📚 Resources

- [Schema Documentation](./schema_documentation.md)
- [Migrations Guide](./MIGRATIONS.md)
- [Database Diagram (ERD)](./database_diagram.md)
- [Getting Started](../getting-started/README.md)
- [Security Guide](../security/security.md)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Database Design](https://supabase.com/docs/guides/database) 