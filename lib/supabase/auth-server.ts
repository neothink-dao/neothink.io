import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { platformConfig, type PlatformSlug } from './auth-client';

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