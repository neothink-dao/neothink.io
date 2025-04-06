import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

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

// New functions for tenant-based middleware

// Get the tenant slug from hostname or path
export function getTenantFromRequest(request: NextRequest): string | null {
  const { hostname, pathname } = new URL(request.url)
  
  // Check for custom domains first
  if (!hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
    // This would need to query the database to get the tenant from the domain
    // Since we can't do that in the middleware directly, we'll rely on path-based tenancy
  }
  
  // Check for path-based tenancy (e.g., /neothinkers/*)
  const pathParts = pathname.split('/').filter(Boolean)
  if (pathParts.length > 0) {
    const potentialSlug = pathParts[0]
    // Only return if it's a known tenant slug
    if (['ascenders', 'neothinkers', 'immortals', 'hub'].includes(potentialSlug)) {
      return potentialSlug
    }
  }
  
  return null
}

// Check if user has access to the tenant
export async function userHasAccessToTenant(
  supabase: any,
  tenantSlug: string
): Promise<boolean> {
  if (!tenantSlug) return false
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  
  const { data } = await supabase
    .from('profiles')
    .select('platforms')
    .eq('id', user.id)
    .single()
    
  if (!data || !data.platforms) return false
  
  return data.platforms.includes(tenantSlug)
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove: (name, options) => {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  await supabase.auth.getSession()

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 