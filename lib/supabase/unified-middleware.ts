import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { getPlatformFromHost } from '../utils/tenant-detection';

// Routes that should be accessible without authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/sign-up',
  '/auth/confirm',
  '/auth/forgot-password',
  '/auth/update-password',
  '/auth/error',
  '/about',
  '/pricing',
  '/contact',
  '/terms',
  '/privacy',
  '/faq',
];

// API routes that should be accessible without authentication
const publicApiRoutes = [
  '/api/auth/signup',
  '/api/auth/login',
  '/api/auth/reset-password',
];

// Cached redirects to avoid unnecessary operations
const redirectCache: Record<string, NextResponse> = {};

/**
 * Unified middleware for all platforms
 * 
 * Handles:
 * - Authentication
 * - Platform detection
 * - Access control
 * - Redirects
 */
export async function middleware(req: NextRequest) {
  // Initialize response that we may modify
  let res = NextResponse.next();

  try {
    // Get path and platform
    const path = req.nextUrl.pathname;
    const platformSlug = getPlatformFromHost(req.headers.get('host') || '');
    
    // Skip middleware for public assets
    if (
      path.startsWith('/_next') ||
      path.startsWith('/favicon') ||
      path.startsWith('/fonts') ||
      path.startsWith('/images')
    ) {
      return res;
    }
    
    // Allow public routes
    const isPublicRoute = 
      publicRoutes.some(route => path === route || path.startsWith(`${route}/`)) ||
      publicApiRoutes.some(route => path === route || path.startsWith(`${route}/`));
    
    if (isPublicRoute) {
      return res;
    }
    
    // Initialize Supabase
    const supabase = createMiddlewareClient({ req, res });
    
    // Get user session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    // If there's no session, redirect to login
    if (!session || error) {
      const url = req.nextUrl.clone();
      url.pathname = '/auth/login';
      
      // Add return URL as search param
      url.searchParams.set('returnUrl', req.nextUrl.pathname);
      
      return NextResponse.redirect(url);
    }
    
    // User is authenticated, now check platform access
    if (platformSlug) {
      // Check if user has access to this platform using our database function
      const { data: hasPlatformAccess, error: accessError } = await supabase.rpc(
        'has_platform_access',
        { platform_slug_param: platformSlug }
      );
      
      // If there was an error or user doesn't have access
      if (accessError || !hasPlatformAccess) {
        // Log the attempt for security auditing
        await supabase.from('auth_logs').insert({
          user_id: session.user.id,
          action: 'access_denied',
          platform: platformSlug,
          details: { 
            path,
            error: accessError?.message || 'No platform access' 
          }
        });
        
        // Redirect to access denied page
        const url = req.nextUrl.clone();
        url.pathname = '/access-denied';
        return NextResponse.redirect(url);
      }
      
      // Log successful access for audit trail
      await supabase.from('auth_logs').insert({
        user_id: session.user.id,
        action: 'page_access',
        platform: platformSlug,
        details: { path }
      }).eq('id', session.user.id);
    }
    
    // Add platform information to headers for server components
    res.headers.set('x-platform-slug', platformSlug || '');
    
    // Success - allow the request
    return res;
  } catch (err) {
    console.error('Middleware error:', err);
    
    // In case of error, continue but log
    return res;
  }
} 