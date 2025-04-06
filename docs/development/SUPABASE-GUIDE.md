# Supabase Integration Guide

This guide covers how we use Supabase in the Neothink platform, providing standardized approaches and best practices.

## Overview

We use Supabase as our backend platform for:

- **Authentication**: User management, login, signup
- **Database**: PostgreSQL database for all application data
- **Storage**: File uploads and media management
- **Edge Functions**: Serverless functions for backend processing
- **Realtime**: Real-time subscriptions for collaborative features

## Setup and Configuration

### Project Structure

```
neothink/
├── lib/
│   └── supabase/
│       ├── client.ts     # Client-side Supabase client
│       ├── server.ts     # Server-side Supabase client
│       ├── types.ts      # Generated TypeScript types
│       ├── auth.ts       # Authentication utilities
│       └── middleware.ts # Auth middleware
├── supabase/
│   ├── migrations/       # Database migrations
│   └── functions/        # Edge functions
```

### Client Configuration

Use the shared client configuration to ensure consistency across the platform:

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### Server-Side Configuration

For server-side operations, use the server client with admin rights:

```typescript
// lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey
);
```

## Authentication

### Authentication Hooks

Use the `useAuth` hook for authentication in components:

```typescript
// lib/supabase/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { supabase } from '../client';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the current user
    const { data: { session } } = supabase.auth.getSession();
    setUser(session?.user ?? null);
    setLoading(false);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
```

### Authentication Components

Standardized authentication components:

```typescript
// components/Auth/SignIn.tsx
import { useState } from 'react';
import { supabase } from '@lib/supabase/client';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSignIn}>
      {error && <div className="error">{error}</div>}
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Sign In'}
      </button>
    </form>
  );
}
```

## Database Operations

### Query Patterns

Standardized query patterns:

```typescript
// Example: Fetching a user profile
async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

// Example: Updating a user profile
async function updateUserProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data;
}
```

### Database Hooks

Custom hooks for database operations:

```typescript
// lib/supabase/hooks/useQuery.ts
import { useEffect, useState } from 'react';
import { supabase } from '../client';

export function useQuery<T>(
  table: string,
  query: (supabase: typeof supabase) => Promise<{ data: T | null; error: any }>
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await query(supabase);
      setData(data);
      setError(error);
      setLoading(false);
    };

    fetchData();
  }, [table]);

  return { data, error, loading };
}
```

## Storage

### Storage Operations

Standardized storage operations:

```typescript
// lib/supabase/storage.ts
import { supabase } from './client';

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }

  return data;
}

export function getPublicUrl(
  bucket: string,
  path: string
) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}
```

### Storage Components

Standardized components for file uploads:

```typescript
// components/FileUpload/FileUpload.tsx
import { useState } from 'react';
import { uploadFile, getPublicUrl } from '@lib/supabase/storage';

interface FileUploadProps {
  bucket: string;
  path: string;
  onUpload: (url: string) => void;
}

export function FileUpload({ bucket, path, onUpload }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const filePath = `${path}/${Date.now()}-${file.name}`;

    setUploading(true);
    setError(null);

    const result = await uploadFile(bucket, filePath, file);

    if (!result) {
      setError('Error uploading file');
      setUploading(false);
      return;
    }

    const url = getPublicUrl(bucket, filePath);
    onUpload(url);
    setUploading(false);
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
```

## Edge Functions

### Edge Function Structure

Structure your edge functions as follows:

```typescript
// supabase/functions/example-function/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

interface RequestBody {
  // Define your request body type
}

serve(async (req) => {
  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify the JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    const body: RequestBody = await req.json();

    // Process the request
    // ...

    // Return the response
    return new Response(
      JSON.stringify({ success: true, data: { /* response data */ } }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

### Invoking Edge Functions

Standardized approach to invoking edge functions:

```typescript
// lib/supabase/functions.ts
import { supabase } from './client';

export async function invokeFunction<T, R>(
  functionName: string,
  payload: T
): Promise<R | null> {
  try {
    const { data, error } = await supabase.functions.invoke<R>(
      functionName,
      {
        body: payload,
      }
    );

    if (error) {
      console.error(`Error invoking function ${functionName}:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error invoking function ${functionName}:`, error);
    return null;
  }
}
```

## Row-Level Security (RLS)

### RLS Policies

Standard RLS policies for multi-tenant data:

```sql
-- Example: RLS for user profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Example: RLS for platform-specific content
CREATE POLICY "Users can view content for their platforms"
ON public.platform_content
FOR SELECT
USING (
  platform_id IN (
    SELECT platform_id FROM public.platform_users
    WHERE user_id = auth.uid()
  )
);
```

## TypeScript Types

### Generating Types

To generate TypeScript types from your Supabase schema:

```bash
# Install the Supabase CLI
npm install -g supabase

# Generate types
pnpm generate:types
```

This will generate a `types.ts` file in the `lib/supabase` directory.

### Using Generated Types

```typescript
// lib/supabase/types.ts (example of generated types)
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          avatar_url: string
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string
          avatar_url?: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          avatar_url?: string
          created_at?: string
        }
      }
      // Other tables...
    }
    Views: {
      // Views...
    }
    Functions: {
      // Functions...
    }
  }
}
```

Use these types in your components and API calls:

```typescript
import { Database } from '@lib/supabase/types';

// Type for a profile row
type Profile = Database['public']['Tables']['profiles']['Row'];

// Function with proper typing
async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data;
}
```

## Best Practices

### Error Handling

Standardized error handling:

```typescript
// Consistent error handling pattern
async function handleSupabaseOperation<T>(
  operation: () => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const { data, error } = await operation();
    
    if (error) {
      console.error('Supabase operation error:', error);
      return { data: null, error: error.message };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

// Usage
const { data, error } = await handleSupabaseOperation(() => 
  supabase.from('profiles').select('*').eq('id', userId)
);
```

### Optimistic Updates

For a better user experience, implement optimistic updates:

```typescript
// Example: Optimistic update for likes
function LikeButton({ postId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    // Optimistically update UI
    setIsLiked(true);
    setLikes(likes + 1);
    
    // Perform the actual update
    const { error } = await supabase
      .from('posts')
      .update({ likes: likes + 1 })
      .eq('id', postId);
    
    // Revert if there was an error
    if (error) {
      setIsLiked(false);
      setLikes(likes);
      console.error('Error updating likes:', error);
    }
  };
  
  return (
    <button onClick={handleLike} disabled={isLiked}>
      Like ({likes})
    </button>
  );
}
```

### Performance Optimization

1. **Use Select Sparingly**: Only select the columns you need
   ```typescript
   // Good: Select only what you need
   const { data } = await supabase
     .from('users')
     .select('id, name, email')
     .eq('id', userId);
     
   // Bad: Select everything
   const { data } = await supabase
     .from('users')
     .select('*')
     .eq('id', userId);
   ```

2. **Use Indexes**: Ensure your queries are using indexed columns

3. **Batch Operations**: Use batch operations for multiple inserts/updates
   ```typescript
   // Insert multiple records in one call
   const { data } = await supabase
     .from('items')
     .insert([
       { name: 'Item 1', user_id: userId },
       { name: 'Item 2', user_id: userId },
     ]);
   ```

## Troubleshooting

### Common Issues

1. **Authentication Issues**
   - Check if the user is signed in: `const { data } = await supabase.auth.getUser()`
   - Verify JWT expiration: JWTs expire after a certain period
   - Check for CORS issues if authentication fails in browser

2. **RLS Issues**
   - Verify RLS policies are correctly defined
   - Check that the authenticated user has the right permissions
   - Use `auth.uid()` consistently in RLS policies

3. **Edge Function Issues**
   - Ensure environment variables are correctly set
   - Check for CORS issues when calling from browser
   - Verify function has necessary permissions

### Debugging Tips

1. **Enable Debug Mode**
   ```typescript
   // Enable debug mode
   const supabaseDebug = createClient(
     supabaseUrl,
     supabaseAnonKey,
     { 
       auth: { 
         debug: true 
       } 
     }
   );
   ```

2. **Check Supabase Logs**
   - Use the Supabase dashboard to view logs
   - Check for API errors, RLS policy violations, and function errors

3. **Test with Service Role Key**
   - Use the service role key to bypass RLS for debugging
   - **NEVER** use the service role key in client-side code

## Deployment

### Environment Variables

Set these environment variables in your deployment:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Database Migrations

Use Supabase migrations for schema changes:

```bash
# Create a new migration
supabase migration new my_migration

# Apply migrations
supabase db push
```

### Edge Function Deployment

Deploy edge functions using the Supabase CLI:

```bash
# Deploy a specific function
supabase functions deploy my-function

# Deploy all functions
supabase functions deploy
```

*For more detailed information on architecture and implementation patterns, see the [Architecture Guide](../reference/ARCHITECTURE-GUIDE.md).* 