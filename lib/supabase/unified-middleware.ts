import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { getTenantFromHostname, getTenantFromPath } from '../utils/tenant-detection'

/**
 * Creates a middleware client for Supabase
 * @param request The Next.js request object
 * @returns Supabase client and response
 */
export async function createMiddlewareClient(request: NextRequest) {
  const res = new NextResponse()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  return { supabase, res }
}

/**
 * Get the tenant slug from hostname or path
 * @param request The Next.js request object
 * @returns Tenant slug or null
 */
export function getTenantFromRequest(request: NextRequest): string | null {
  const url = new URL(request.url)
  const { hostname, pathname } = url
  
  // First check for tenant in header (highest priority)
  const headerTenant = request.headers.get('x-tenant-slug')
  if (headerTenant && ['hub', 'ascenders', 'neothinkers', 'immortals'].includes(headerTenant)) {
    return headerTenant
  }
  
  // Check for domain-based tenant detection
  const tenantFromHostname = getTenantFromHostname(hostname)
  if (tenantFromHostname) {
    return tenantFromHostname
  }
  
  // Check for path-based tenant detection
  const tenantFromPath = getTenantFromPath(pathname)
  if (tenantFromPath) {
    return tenantFromPath
  }
  
  // Default to null if we can't determine tenant
  return null
}

/**
 * Check if user has access to the tenant
 * @param supabase Supabase client
 * @param tenantSlug Tenant/platform slug
 * @returns Boolean indicating if user has access
 */
export async function userHasAccessToTenant(
  supabase: any,
  tenantSlug: string
): Promise<boolean> {
  if (!tenantSlug) return false
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  
  // First try to use the database function if it exists
  try {
    const { data, error } = await supabase.rpc(
      'user_has_platform_access',
      { _user_id: user.id, _platform_slug: tenantSlug }
    )
    
    // If function exists and succeeds, use its result
    if (!error) return !!data
  } catch (_) {
    // Function doesn't exist or failed, continue with manual check
  }
  
  // Manual check - First check if user is a guardian (admin)
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_guardian, platforms')
    .eq('id', user.id)
    .single()
  
  // Guardians have access to all platforms
  if (profile?.is_guardian) return true
  
  // Check profile.platforms array
  if (profile?.platforms && Array.isArray(profile.platforms)) {
    if (profile.platforms.includes(tenantSlug)) return true
  }
  
  // Check platform_access table for active access
  const { data: access } = await supabase
    .from('platform_access')
    .select('*')
    .eq('user_id', user.id)
    .eq('platform_slug', tenantSlug)
    .in('access_level', ['full', 'limited', 'trial'])
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .single()
  
  return !!access
}

/**
 * Unified middleware function for all platforms
 * Checks authentication and platform access
 * @param request The Next.js request object
 * @param platformSlug Optional platform slug override
 * @returns Response with updated cookies and redirects
 */
export async function unifiedMiddleware(request: NextRequest, platformSlug?: string) {
  // Create middleware client
  const { supabase, res } = await createMiddlewareClient(request)
  
  // Get session and user
  const { data: { session } } = await supabase.auth.getSession()
  
  // Get tenant from request if not provided
  const tenant = platformSlug || getTenantFromRequest(request)
  
  // Define public routes that don't require authentication/tenant access
  const publicRoutes = [
    '/login', '/signup', '/auth', '/api/auth', 
    '/forgot-password', '/reset-password', '/404',
    '/api/webhook', '/api/public', 
    '/_next', '/favicon.ico', '/robots.txt'
  ]
  
  const url = new URL(request.url)
  const isPublicRoute = publicRoutes.some(route => url.pathname.startsWith(route)) ||
                        url.pathname === '/'
  
  // Allow public assets like images, CSS, etc.
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|css|js)$/)) {
    return res
  }
  
  // Check if current path is in the (auth) or (unauthenticated) route group
  const isAuthRoute = url.pathname.includes('/(auth)') || 
                     url.pathname.includes('/auth/') || 
                     url.pathname.includes('/(unauthenticated)')
  
  // If the route is public or explicitly an auth route, allow it
  if (isPublicRoute || isAuthRoute) {
    return res
  }
  
  // If no session and trying to access protected routes, redirect to login
  if (!session) {
    const redirectUrl = new URL('/auth/login', request.url)
    // Add returnUrl to redirect back after login
    redirectUrl.searchParams.set('returnUrl', encodeURIComponent(request.url))
    return NextResponse.redirect(redirectUrl)
  }
  
  // If path is in the (authenticated) route group, check platform access
  const isProtectedRoute = url.pathname.includes('/(authenticated)') || !isAuthRoute
  
  if (isProtectedRoute && tenant) {
    // Log access attempt for auditing
    await supabase
      .from('auth_logs')
      .insert({
        user_id: session.user.id,
        action: 'access_attempt',
        platform: tenant,
        path: url.pathname,
        ip_address: request.ip || request.headers.get('x-forwarded-for'),
        user_agent: request.headers.get('user-agent')
      })
      .select()
    
    const hasAccess = await userHasAccessToTenant(supabase, tenant)
    
    if (!hasAccess) {
      // Redirect to access denied page
      return NextResponse.redirect(new URL('/access-denied', request.url))
    }
  }
  
  return res
} 