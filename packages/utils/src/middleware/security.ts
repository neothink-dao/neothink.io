import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { nanoid } from 'nanoid';

// Create a new ratelimiter that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

// Best-practice: Get IP from x-forwarded-for or fallback
function getClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    // x-forwarded-for may be a comma-separated list; take the first
    return xff.split(',')[0].trim();
  }
  return '127.0.0.1';
}

export async function securityMiddleware(request: NextRequest) {
  // Generate CSP nonce
  const nonce = nanoid();
  
  // Rate limiting
  const ip = getClientIp(request);
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);
  
  if (!success) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': `${reset}`,
        'X-RateLimit-Limit': `${limit}`,
        'X-RateLimit-Remaining': `${remaining}`,
        'X-RateLimit-Reset': `${reset}`,
      },
    });
  }

  // Enhanced security headers
  const response = NextResponse.next();
  
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' data: blob: https:;
    font-src 'self' data:;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s+/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Add nonce to request for use in _document.tsx
  request.headers.set('x-nonce', nonce);
  
  return response;
} 