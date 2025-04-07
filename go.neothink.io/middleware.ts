import { hubMiddleware } from '../lib/middleware/unified-middleware';
import type { NextRequest } from 'next/server';

/**
 * Authentication middleware for the Hub platform
 * Uses the unified middleware implementation for consistency across all platforms
 */
export async function middleware(request: NextRequest) {
  // Using the platform-specific middleware from the unified implementation
  return await hubMiddleware(request);
}

/**
 * Middleware configuration to prevent running on static assets and api routes
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}

