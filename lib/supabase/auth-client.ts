import { createClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Platform types for all Neothink platforms
 */
export type PlatformSlug = 'hub' | 'ascenders' | 'neothinkers' | 'immortals';

/**
 * Platform-specific configuration
 */
interface PlatformConfig {
  storageKey: string;
  headers: Record<string, string>;
}

/**
 * Unified platform configuration for all Neothink platforms
 */
const platformConfig: Record<PlatformSlug, PlatformConfig> = {
  hub: {
    storageKey: 'go.neothink.io.auth.token',
    headers: {
      'x-site-name': 'Neothink+',
      'x-site-url': 'https://go.neothink.io',
      'x-site-platform': 'neothink',
      'x-sender-name': 'Neothink+'
    }
  },
  ascenders: {
    storageKey: 'joinascenders.org.auth.token',
    headers: {
      'x-site-name': 'Ascenders',
      'x-site-url': 'https://www.joinascenders.org',
      'x-site-platform': 'ascenders',
      'x-sender-name': 'Ascenders Community'
    }
  },
  neothinkers: {
    storageKey: 'joinneothinkers.org.auth.token',
    headers: {
      'x-site-name': 'Neothinkers',
      'x-site-url': 'https://www.joinneothinkers.org',
      'x-site-platform': 'neothinkers',
      'x-sender-name': 'Neothinkers Community'
    }
  },
  immortals: {
    storageKey: 'joinimmortals.org.auth.token',
    headers: {
      'x-site-name': 'Immortals',
      'x-site-url': 'https://www.joinimmortals.org',
      'x-site-platform': 'immortals',
      'x-sender-name': 'Immortals Society'
    }
  }
};

/**
 * Creates a Supabase client for client-side components with platform-specific configuration
 */
export function createClientComponent(platform: PlatformSlug = 'hub') {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          ...platformConfig[platform].headers
        }
      },
      auth: {
        storageKey: platformConfig[platform].storageKey,
        autoRefreshToken: true,
        persistSession: true
      }
    }
  );
}

/**
 * Creates a Supabase client for server-side components with platform-specific configuration
 */
export function createServerComponent(platform: PlatformSlug = 'hub') {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        },
      },
      global: {
        headers: {
          ...platformConfig[platform].headers
        }
      }
    }
  );
}

/**
 * Creates a Supabase client for middleware with platform-specific configuration
 */
export function createMiddlewareClient(request: NextRequest, platform: PlatformSlug = 'hub') {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
      global: {
        headers: {
          ...platformConfig[platform].headers
        }
      }
    }
  );
  
  return { supabase, response };
}

/**
 * Helper function to extract access token from the request
 * Used for API route authentication
 */
export function getAccessToken(request: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Try cookies next
  const session = request.cookies.get('sb-session')?.value;
  if (session) {
    try {
      const sessionData = JSON.parse(session);
      return sessionData.access_token;
    } catch (e) {
      return null;
    }
  }
  
  return null;
}

/**
 * Interface for user profile with platform-specific permissions
 */
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  is_guardian: boolean;
  platforms: string[];
}

/**
 * Get user profile with additional auth info
 */
export async function getUserProfile(supabase: any): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return profile || null;
}

/**
 * Check if user has access to a specific platform
 */
export async function checkPlatformAccess(
  supabase: any, 
  platformSlug: PlatformSlug
): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  // Check if function exists, use it if available
  try {
    const { data, error } = await supabase.rpc(
      'user_has_platform_access',
      { _user_id: user.id, _platform_slug: platformSlug }
    );
    
    if (!error) return !!data;
  } catch (_) {
    // Function doesn't exist, fall back to manual check
  }
  
  // Manual check - first get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_guardian, platforms')
    .eq('id', user.id)
    .single();
    
  // Guardian users have access to all platforms
  if (profile?.is_guardian) return true;
  
  // Check platforms array
  if (profile?.platforms && Array.isArray(profile.platforms)) {
    if (profile.platforms.includes(platformSlug)) return true;
  }
  
  // Check platform_access table
  const { data: access } = await supabase
    .from('platform_access')
    .select('*')
    .eq('user_id', user.id)
    .eq('platform_slug', platformSlug)
    .maybeSingle();
    
  if (access) {
    if (!access.expires_at) return true;
    return new Date(access.expires_at) > new Date();
  }
  
  return false;
}

/**
 * Record auth action for auditing
 */
export async function logAuthAction(
  supabase: any,
  action: string,
  platform?: string,
  details?: Record<string, any>
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  
  await supabase
    .from('auth_logs')
    .insert({
      user_id: user.id,
      action,
      platform,
      details: details || {}
    });
} 