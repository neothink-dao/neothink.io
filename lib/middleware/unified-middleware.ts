import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '../supabase/auth-client';
import { PlatformSlug } from '../supabase/auth-client';
import { getTenantFromRequest } from '../utils/tenant-detection';
import { checkPlatformAccess } from '../utils/platform-access';

// Common configuration for all platforms
const PUBLIC_ROUTES = [
  '/login',
  '/auth',
  '/api',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify',
  '/404',
  '/500',
  '/_next',
  '/favicon.ico',
  '/static',
  '/images',
  '/assets'
];

// Standardized matcher config that can be exported by platform middleware files
export const standardMatcherConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};

/**
 * Checks if a route is public and doesn't require authentication
 * @param pathname The URL pathname to check
 * @returns Whether the route is public
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route)) ||
    pathname.includes('/public/') ||
    pathname === '/';
}

/**
 * Checks if a route is in an auth-specific route group
 * @param pathname The URL pathname to check
 * @returns Type of route (auth, unauthenticated, authenticated, regular)
 */
function getRouteType(pathname: string): 'auth' | 'unauthenticated' | 'authenticated' | 'regular' {
  if (pathname.includes('/(auth)') || pathname.includes('/auth/')) {
    return 'auth';
  }
  
  if (pathname.includes('/(unauthenticated)')) {
    return 'unauthenticated';
  }
  
  if (pathname.includes('/(authenticated)')) {
    return 'authenticated';
  }
  
  return 'regular';
}

/**
 * Unified middleware implementation for all platforms
 * 
 * This function handles:
 * 1. Session management
 * 2. Authentication
 * 3. Platform access checks
 * 4. Redirects for auth state
 * 
 * @param request The Next.js request
 * @param platformSlug Optional override for platform detection
 * @returns NextResponse with appropriate redirects and headers
 */
export async function unifiedMiddleware(
  request: NextRequest,
  platformSlug?: PlatformSlug
): Promise<NextResponse> {
  // Get tenant from request or use provided override
  const tenant = platformSlug || getTenantFromRequest(request);
  
  // Create middleware client specific to this platform
  const { supabase, response } = createMiddlewareClient(request, tenant);
  
  // Get current path and route type
  const url = new URL(request.url);
  const pathname = url.pathname;
  const routeType = getRouteType(pathname);
  
  // Update the session (necessary even for public routes)
  const { data: { session } } = await supabase.auth.getSession();
  
  // Allow public routes without further checks
  if (isPublicRoute(pathname) || routeType === 'unauthenticated') {
    return response;
  }
  
  // Auth routes have specific handling based on auth state
  if (routeType === 'auth') {
    // If authenticated and trying to access auth pages, redirect to dashboard
    if (session) {
      // Generate relative dashboard URL
      const dashboardUrl = new URL(
        tenant === 'hub' ? '/dashboard' : `/${tenant}/dashboard`,
        request.url
      );
      
      return NextResponse.redirect(dashboardUrl);
    }
    
    // For unauthenticated users on auth routes, allow access
    return response;
  }
  
  // For protected routes, redirect to login if not authenticated
  if (!session) {
    // Redirect to login
    const loginUrl = new URL('/auth/login', request.url);
    
    // Store the original URL to redirect back after login
    loginUrl.searchParams.set('returnUrl', request.url);
    
    return NextResponse.redirect(loginUrl);
  }
  
  // For authenticated routes, check platform access
  if (routeType === 'authenticated' || routeType === 'regular') {
    const hasAccess = await checkPlatformAccess(supabase, tenant);
    
    if (!hasAccess) {
      // Log access denial for analytics/security
      await supabase.from('auth_logs').insert({
        user_id: session.user.id,
        action: 'access_denied',
        platform: tenant,
        path: pathname,
        ip_address: request.headers.get('x-forwarded-for') || request.ip
      }).catch(err => console.error('Failed to log access denial:', err));
      
      // Redirect to access denied page
      const accessDeniedUrl = new URL('/access-denied', request.url);
      accessDeniedUrl.searchParams.set('platform', tenant);
      
      return NextResponse.redirect(accessDeniedUrl);
    }
  }
  
  // Store the platform slug in a cookie for client-side access
  response.cookies.set('platform', tenant, {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  
  // Add platform info to response headers for logging and debugging
  response.headers.set('x-platform', tenant);
  
  return response;
}

/**
 * Create platform-specific middleware functions
 */
export function createPlatformMiddleware(platform: PlatformSlug) {
  return async function middleware(request: NextRequest) {
    return unifiedMiddleware(request, platform);
  };
}

// Export platform-specific middleware for convenience
export const hubMiddleware = createPlatformMiddleware('hub');
export const ascendersMiddleware = createPlatformMiddleware('ascenders');
export const neothinkersMiddleware = createPlatformMiddleware('neothinkers');
export const immortalsMiddleware = createPlatformMiddleware('immortals'); 