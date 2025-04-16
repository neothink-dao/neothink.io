import { nanoid } from 'nanoid';
import { checkRateLimit } from '../database/client';
// Content Security Policy
const csp = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', '*.supabase.co', '*.supabase.in'],
    'font-src': ["'self'"],
    'connect-src': [
        "'self'",
        'https://*.supabase.co',
        'wss://*.supabase.co',
        'https://vitals.vercel-insights.com',
    ],
    'frame-src': ["'self'"],
    'object-src': ["'none'"],
};
// Security headers
const securityHeaders = {
    'X-DNS-Prefetch-Control': 'on',
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
};
/**
 * Add a nonce to the Content-Security-Policy
 */
function addNonceToCsp(cspObject, nonce) {
    const newCsp = Object.assign({}, cspObject);
    if (newCsp['script-src']) {
        newCsp['script-src'] = [...newCsp['script-src'], `'nonce-${nonce}'`];
    }
    return newCsp;
}
/**
 * Convert CSP object to string
 */
function cspObjectToString(cspObject) {
    return Object.entries(cspObject)
        .map(([key, values]) => {
        return `${key} ${values.join(' ')}`;
    })
        .join('; ');
}
/**
 * Get client IP
 */
function getClientIp(req) {
    return (req.headers.get('x-forwarded-for') ||
        req.headers.get('x-real-ip') ||
        '127.0.0.1');
}
/**
 * Check if request is from a known bot
 */
function isBot(userAgent) {
    return /bot|crawler|spider|crawling/i.test(userAgent);
}
/**
 * Rate limit middleware
 */
export async function rateLimit(req, maxRequests = 100, windowSeconds = 60) {
    // Skip rate limiting for certain paths
    const path = req.nextUrl.pathname;
    if (path.startsWith('/_next') ||
        path.startsWith('/static') ||
        path.startsWith('/api/health')) {
        return false;
    }
    // Get identifier for rate limiting
    const ip = getClientIp(req);
    const identifier = `${ip}:${path}`;
    // Check if rate limited
    return checkRateLimit(identifier, maxRequests, windowSeconds);
}
/**
 * Main security middleware
 */
export function securityMiddleware(req, res) {
    // Generate a unique nonce
    const nonce = nanoid();
    // Add nonce to CSP
    const cspWithNonce = addNonceToCsp(csp, nonce);
    const cspHeaderString = cspObjectToString(cspWithNonce);
    // Set security headers
    const newHeaders = new Headers(res.headers);
    // Set CSP header
    newHeaders.set('Content-Security-Policy', cspHeaderString);
    // Set other security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
    });
    // Store the nonce in a response header that we'll use in _document.tsx
    newHeaders.set('x-nonce', nonce);
    // Return response with updated headers
    return NextResponse.next({
        request: {
            headers: req.headers,
        },
        headers: newHeaders,
    });
}
/**
 * Security middleware with rate limiting
 */
export async function securityMiddlewareWithRateLimit(req) {
    // Check rate limit
    const isRateLimited = await rateLimit(req, 100, 60);
    if (isRateLimited) {
        return new NextResponse('Too Many Requests', {
            status: 429,
            headers: {
                'Retry-After': '60',
                'Content-Type': 'text/plain',
            },
        });
    }
    // Continue with normal security middleware
    const response = NextResponse.next();
    return securityMiddleware(req, response);
}
//# sourceMappingURL=middlewares.js.map