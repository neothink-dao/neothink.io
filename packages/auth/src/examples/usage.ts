import { middleware } from '../utils/middleware';
import { NextRequest } from 'next/server';

/**
 * Example of extending the base middleware with custom logic
 */
export async function customMiddleware(req: NextRequest) {
  // Add custom logic before security checks
  console.log(`Processing request to ${req.nextUrl.pathname}`);
  
  // Call base middleware
  const response = await middleware(req);
  
  // Add custom headers
  response.headers.set('X-Custom-Header', 'custom-value');
  
  return response;
}

/**
 * Example middleware configuration
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (robots.txt, sitemap.xml, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|assets/).*)',
  ],
};

/**
 * Example environment variables
 */
export const exampleEnv = {
  // Rate limiting configuration
  RATE_LIMIT_WINDOW: '3600',  // Time window in seconds
  RATE_LIMIT_MAX: '100',      // Maximum requests per window
  
  // Security configuration
  ENABLE_HSTS: 'true',        // Enable HSTS in production
  CSP_REPORT_URI: '/api/csp', // URI for CSP violation reports
  
  // Database configuration
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key',
  SUPABASE_SERVICE_ROLE_KEY: 'your-service-role-key'
}; 