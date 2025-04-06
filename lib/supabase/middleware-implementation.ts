import { NextRequest, NextResponse } from 'next/server';
import { unifiedMiddleware } from './unified-middleware';

/**
 * Middleware implementation for the Hub platform
 * @param req Next.js request
 * @returns Next.js response
 */
export async function hubMiddleware(req: NextRequest) {
  return await unifiedMiddleware(req, 'hub');
}

/**
 * Middleware implementation for the Ascenders platform
 * @param req Next.js request
 * @returns Next.js response
 */
export async function ascendersMiddleware(req: NextRequest) {
  return await unifiedMiddleware(req, 'ascenders');
}

/**
 * Middleware implementation for the Neothinkers platform
 * @param req Next.js request
 * @returns Next.js response
 */
export async function neothinkersMiddleware(req: NextRequest) {
  return await unifiedMiddleware(req, 'neothinkers');
}

/**
 * Middleware implementation for the Immortals platform
 * @param req Next.js request
 * @returns Next.js response
 */
export async function immortalsMiddleware(req: NextRequest) {
  return await unifiedMiddleware(req, 'immortals');
}

/**
 * Standard matcher configuration for all platforms
 * This prevents middleware from running on static assets
 */
export const standardMatcherConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public/ (public files)
     * - .*\\.(?:svg|png|jpg|jpeg|gif|webp)$ (image files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}; 