# Shared Supabase Configuration

## 🎯 Overview

This guide explains how the Neothink Platform's four applications share a common Supabase backend while maintaining proper isolation and security. Our setup leverages the latest Supabase features:

- **Deno 2.1 Edge Functions**: Serverless functions with improved performance
- **Realtime Broadcast**: Efficient real-time updates from database changes
- **Geo-routing**: Automatic routing to nearest read replica
- **Declarative Schemas**: Simplified database management
- **MCP Server**: Enhanced performance and scalability

## 🔐 Project Structure

```
neothink-platform/
├── packages/
│   └── core/
│       └── src/
│           └── lib/
│               ├── supabase.ts        # Supabase client configuration
│               ├── auth.ts            # Authentication utilities
│               ├── database.ts        # Database utilities
│               ├── edge-functions/    # Deno 2.1 Edge Functions
│               ├── realtime/          # Realtime features
│               └── types.ts           # Shared types
└── apps/
    ├── hub/
    ├── ascenders/
    ├── neothinkers/
    └── immortals/
```

## 🔑 Environment Variables

Each app requires these environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]

# Edge Functions
SUPABASE_EDGE_FUNCTIONS_URL=https://[YOUR_PROJECT].supabase.co/functions/v1
SUPABASE_EDGE_FUNCTIONS_KEY=[YOUR_EDGE_FUNCTIONS_KEY]

# Realtime
NEXT_PUBLIC_SUPABASE_REALTIME_URL=wss://[YOUR_PROJECT].supabase.co/realtime/v1

# Security
NEXT_PUBLIC_SECURITY_HEADERS=true
NEXT_PUBLIC_CORS_ORIGINS=https://*.neothink.io,https://*.joinascenders.org,https://*.joinneothinkers.org,https://*.joinimmortals.org
```

## 🛡️ Security Configuration

### Client Configuration

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storageKey: 'neothink-auth-token',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  global: {
    headers: {
      'x-application-name': process.env.NEXT_PUBLIC_APP_NAME,
      'x-application-version': process.env.NEXT_PUBLIC_APP_VERSION,
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})
```

### Service Role Client

```typescript
export const getServiceRoleClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('Missing Supabase service role key')
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
```

## 🔄 Database Schema

### Row Level Security (RLS)

Each app has its own schema with appropriate RLS policies:

```sql
-- Example RLS policy for Ascenders app
CREATE POLICY "ascenders_users_can_view_own_data"
ON ascenders.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Example RLS policy for Neothinkers app
CREATE POLICY "neothinkers_users_can_view_own_data"
ON neothinkers.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Example RLS policy for Immortals app
CREATE POLICY "immortals_users_can_view_own_data"
ON immortals.profiles
FOR SELECT
USING (auth.uid() = user_id);
```

### Shared Tables

Some tables are shared across apps:

```sql
-- Shared users table
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Shared sessions table
CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.users(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at timestamp with time zone NOT NULL
);
```

## 🚀 Edge Functions

### Deno 2.1 Configuration

```typescript
// edge-functions/auth.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  )

  // Your edge function logic here
})
```

### Deployment

```bash
# Deploy edge function
supabase functions deploy auth --use-api

# Test edge function
supabase functions serve auth
```

### Best Practices
- Use TypeScript for type safety
- Implement proper error handling
- Follow the principle of least privilege
- Monitor function performance
- Use environment variables for configuration

## 📡 Realtime Features

### Broadcast from Database

```typescript
// realtime/broadcast.ts
export const setupBroadcast = (table: string) => {
  const channel = supabase
    .channel(`table:${table}`)
    .on(
      'broadcast',
      { event: '*' },
      (payload) => {
        console.log('Received broadcast:', payload)
      }
    )
    .subscribe()

  return channel
}
```

### Database Triggers

```sql
-- Example trigger for realtime updates
CREATE TRIGGER broadcast_changes
AFTER INSERT OR UPDATE OR DELETE
ON public.users
FOR EACH ROW
EXECUTE FUNCTION realtime.broadcast_changes();
```

### Best Practices
- Use appropriate channel names
- Implement proper error handling
- Monitor connection status
- Handle reconnection scenarios
- Clean up unused channels

## 🌐 Geo-routing Configuration

### Read Replica Setup

```typescript
// database/config.ts
export const getNearestReplica = async () => {
  const response = await fetch('https://api.supabase.com/v1/read-replicas')
  const replicas = await response.json()
  
  // Select nearest replica based on client location
  return replicas[0].url
}
```

### Client Configuration

```typescript
// supabase.ts
export const createClient = (url: string, key: string) => {
  return new SupabaseClient(url, key, {
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-application-name': process.env.NEXT_PUBLIC_APP_NAME,
      },
    },
  })
}
```

## 📊 Monitoring

### Edge Functions
- Function execution time
- Memory usage
- Error rates
- Cold start performance
- Request volume

### Realtime
- Connection count
- Message throughput
- Latency metrics
- Error rates
- Channel usage

### Database
- Query performance
- Connection pool usage
- Replica lag
- Storage usage
- Backup status

### Geo-routing
- Latency metrics
- Replica selection
- Error rates
- Cache hit rates
- Network performance

## 🔧 Maintenance

### Regular Tasks
1. Rotate API keys quarterly
2. Update RLS policies as needed
3. Monitor and optimize queries
4. Backup database regularly
5. Apply security patches
6. Update Edge Functions
7. Monitor Realtime connections
8. Check geo-routing performance
9. Review and update schemas
10. Test disaster recovery

### Emergency Procedures
1. Revoke compromised tokens
2. Block suspicious IPs
3. Roll back to last known good state
4. Notify affected users
5. Update security measures
6. Switch to backup replicas
7. Disable affected features
8. Update documentation

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Realtime Guide](https://supabase.com/docs/guides/realtime)
- [Database Best Practices](https://supabase.com/docs/guides/database/best-practices)
- [Security Checklist](https://supabase.com/docs/guides/security)
- [Geo-routing Documentation](https://supabase.com/docs/guides/database/geo-routing)
- [MCP Server Guide](https://supabase.com/docs/guides/database/mcp-server) 