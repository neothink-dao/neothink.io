/**
 * Example middleware.ts file for Next.js applications
 * 
 * Copy this file to your app's root directory and customize as needed.
 */

import { middleware } from '@neothink/auth';

export default middleware;

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