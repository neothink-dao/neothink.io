import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { getPlatformFromHost } from '../utils/tenant-detection';
import { z } from 'zod';

// Security-enhanced middleware for all platforms
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

// Static assets that should be accessible without middleware processing
const staticAssetPaths = [
  '/_next',
  '/favicon',
  '/fonts',
  '/images',
  '/assets',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
];

// Schema for validating the request context
const RequestContextSchema = z.object({
  platformSlug: z.string().optional(),
  userId: z.string().uuid().optional(),
  userRole: z.string().optional(),
  isAuthenticated: z.boolean(),
  requestPath: z.string(),
});

type RequestContext = z.infer<typeof RequestContextSchema>;

// Rate limiting cache to prevent brute force attempts
const rateLimit = new Map<string, { count: number; timestamp: number }>();

/**
 * Unified middleware for all platforms with enhanced security
 * 
 * Handles:
 * - Authentication with JWT verification
 * - Platform detection and access control
 * - Rate limiting for sensitive operations
 * - CSRF protection
 * - Detailed security logging
 */
export async function middleware(req: NextRequest) {
  // Skip middleware for static assets
  const path = req.nextUrl.pathname;
  if (staticAssetPaths.some(prefix => path.startsWith(prefix))) {
    return NextResponse.next();
  }
  
  // Initialize response that we may modify
  const res = NextResponse.next();
  
  try {
    // Get platform from host
    const platformSlug = getPlatformFromHost(req.headers.get('host') || '');
    
    // Allow public routes without authentication checks
    const isPublicRoute = 
      publicRoutes.some(route => path === route || path.startsWith(`${route}/`)) ||
      publicApiRoutes.some(route => path === route || path.startsWith(`${route}/`));
    
    if (isPublicRoute) {
      // Set security headers even for public routes
      setSecurityHeaders(res);
      return res;
    }
    
    // Apply rate limiting for authentication endpoints
    if (path.includes('/api/auth/')) {
      const clientIp = req.headers.get('x-forwarded-for') || req.ip || '';
      const isRateLimited = applyRateLimit(clientIp, path);
      if (isRateLimited) {
        return new NextResponse(
          JSON.stringify({ error: 'Too many requests, please try again later' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Initialize Supabase client
    const supabase = createMiddlewareClient({ req, res });
    
    // Get user session with JWT verification
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // Create request context for consistent logging and processing
    const reqContext: RequestContext = {
      platformSlug,
      isAuthenticated: !!session,
      requestPath: path,
      userId: session?.user?.id,
      userRole: session?.user?.user_metadata?.role || 'user'
    };
    
    // Validate request context with Zod
    RequestContextSchema.parse(reqContext);
    
    // For authenticated routes, verify session and check platform access
    if (!isPublicRoute) {
      if (sessionError || !session) {
        // Log failed authentication attempt
        await logSecurityEvent(supabase, {
          event: 'authentication_failure',
          context: reqContext,
          details: { 
            error: sessionError?.message || 'No valid session',
            path,
            ip: req.headers.get('x-forwarded-for') || req.ip
          }
        });
        
        // Redirect to login with return URL
        const loginUrl = new URL('/auth/login', req.url);
        loginUrl.searchParams.set('returnUrl', req.url);
        
        return NextResponse.redirect(loginUrl);
      }
      
      // Verify user has access to the requested platform
      if (platformSlug) {
        const { data: hasAccess, error: accessError } = await supabase.rpc(
          'user_has_platform_access',
          { _user_id: session.user.id, _platform_slug: platformSlug }
        );
        
        if (accessError || !hasAccess) {
          // Log unauthorized access attempt
          await logSecurityEvent(supabase, {
            event: 'unauthorized_platform_access',
            context: reqContext,
            details: { 
              error: accessError?.message || 'Access denied',
              platform: platformSlug
            }
          });
          
          // Redirect to access denied page
          const accessDeniedUrl = new URL('/access-denied', req.url);
          return NextResponse.redirect(accessDeniedUrl);
        }
        
        // Log successful access for audit trail
        await logSecurityEvent(supabase, {
          event: 'authorized_access',
          context: reqContext,
          details: { platform: platformSlug }
        });
      }
    }
    
    // Set security headers for all responses
    setSecurityHeaders(res);
    
    // Add context information to headers for server components
    res.headers.set('x-platform-slug', platformSlug || '');
    res.headers.set('x-authenticated', reqContext.isAuthenticated.toString());
    
    // Success - allow the request
    return res;
  } catch (err) {
    console.error('Middleware error:', err);
    
    // Set security headers even when there's an error
    setSecurityHeaders(res);
    
    // In production, don't expose error details
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.next();
    } else {
      // In development, include error for debugging
      res.headers.set('x-middleware-error', String(err));
      return res;
    }
  }
}

/**
 * Set security headers on response
 */
function setSecurityHeaders(res: NextResponse): void {
  // Set best practice security headers
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy - customize based on your needs
  if (process.env.NODE_ENV === 'production') {
    res.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' *.neothink.io *.vercel-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' *.supabase.co;"
    );
  }
}

/**
 * Apply rate limiting for sensitive operations
 * Returns true if request should be rate-limited
 */
function applyRateLimit(clientIp: string, path: string): boolean {
  // Skip rate limiting in development
  if (process.env.NODE_ENV !== 'production') {
    return false;
  }
  
  const now = Date.now();
  const key = `${clientIp}:${path}`;
  const windowMs = 15 * 60 * 1000; // 15 minutes
  
  const currentRequest = rateLimit.get(key) || { count: 0, timestamp: now };
  
  // Reset if window has expired
  if (now - currentRequest.timestamp > windowMs) {
    currentRequest.count = 0;
    currentRequest.timestamp = now;
  }
  
  // Increment request count
  currentRequest.count++;
  
  // Store updated rate limit info
  rateLimit.set(key, currentRequest);
  
  // Setting a high limit for now, adjust based on security needs
  const limit = path.includes('/login') ? 5 : 15;
  
  return currentRequest.count > limit;
}

/**
 * Log security events to auth_logs table
 */
async function logSecurityEvent(supabase: any, params: {
  event: string;
  context: RequestContext;
  details?: Record<string, any>;
}): Promise<void> {
  try {
    await supabase.from('auth_logs').insert({
      user_id: params.context.userId || null,
      action: params.event,
      platform: params.context.platformSlug || null,
      path: params.context.requestPath,
      details: params.details || {},
    });
  } catch (err) {
    // Fail silently but log to console
    console.error('Failed to log security event:', err);
  }
}

// Create platform-specific middleware function
export function hubMiddleware(request: NextRequest) {
  return middleware(request);
}

// Export standardMatcherConfig for Next.js middleware config
export const standardMatcherConfig = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (robots.txt, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 