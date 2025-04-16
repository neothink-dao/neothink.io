import { createClient } from '@supabase/supabase-js';
import type { Database } from '@neothink/types';

// These env vars are set in each app but with consistent naming
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Validate Supabase URL format
function validateSupabaseUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:' && parsedUrl.host.includes('supabase.co');
  } catch (error) {
    return false;
  }
}

// Runtime check to ensure env vars are set
if (!supabaseUrl || !supabaseAnonKey) {
  const error = 'Missing Supabase environment variables. Please check your .env file.';
  if (typeof window !== 'undefined') {
    // Only throw in browser environment during development
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
      throw new Error(error);
    }
  } else {
    // Always throw on server since it's critical
    throw new Error(error);
  }
}

// Validate URL format
if (!validateSupabaseUrl(supabaseUrl)) {
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}. URL must be a valid HTTPS URL ending in supabase.co`);
}

// Create a singleton supabase client for the browser with advanced configuration
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    db: {
      // Enable nearest read replica routing for optimal performance (Launch Week 14 feature)
      routeToNearestReadReplica: true,
    },
    global: {
      // Add headers to identify client
      headers: {
        'x-client-info': 'Neothink Platform',
      },
    },
    // Enable real-time subscriptions
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

/**
 * Get a server-side Supabase client with the service role key.
 * To be used only in server-side contexts like API routes or getServerSideProps.
 * WARNING: This bypasses RLS and should be used very carefully.
 */
export function getServerSupabase() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY. This should only be used in server-side code.'
    );
  }
  
  return createClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        // Enable nearest read replica routing
        routeToNearestReadReplica: true,
      },
      // Use dedicated connection pooler for server environments (Launch Week 14 feature)
      global: {
        headers: {
          'x-client-info': 'Neothink Server',
          'x-connection-type': 'dedicated-pooler',
        },
      },
    }
  );
}

/**
 * Get an authenticated supabase client with a user's access token.
 * Useful for Server Components or API routes where the client session isn't available.
 */
export function getAuthenticatedSupabase(accessToken: string) {
  return createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        // Enable nearest read replica routing
        routeToNearestReadReplica: true,
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-client-info': 'Neothink Auth Client',
        }
      }
    }
  );
}

/**
 * Rate limiting functions using PostgreSQL (requires the rate_limits table)
 * 
 * This uses the server-side function we created in our migration:
 * CREATE OR REPLACE FUNCTION public.check_rate_limit(
 *   p_identifier TEXT,
 *   p_max_requests INTEGER DEFAULT 100,
 *   p_window_seconds INTEGER DEFAULT 60
 * ) RETURNS BOOLEAN
 */

/**
 * Check if a request is rate limited
 */
export async function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowSeconds: number = 60
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_identifier: identifier,
      p_max_requests: maxRequests,
      p_window_seconds: windowSeconds,
    });

    if (error) {
      console.error('Rate limit check error:', error);
      return false; // Default to not rate limiting on error
    }

    return !!data; // Return true if rate limited, false otherwise
  } catch (error) {
    console.error('Rate limit check error:', error);
    return false;
  }
}

// Type-safe database helpers
export const db = {
  from: <T extends keyof Database['public']['Tables']>(
    table: T
  ) => supabase.from(table),
  rpc: <T extends keyof Database['public']['Functions']>(
    fn: T,
    args?: Parameters<Database['public']['Functions'][T]>[0]
  ) => supabase.rpc(fn, args),
}; 