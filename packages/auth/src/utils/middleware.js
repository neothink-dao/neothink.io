import { createPlatformClient } from '@neothink/database';
import crypto from 'crypto';
import { logSecurityEvent } from './security-logger';
import { validateCsrfToken } from './csrf';
// Static asset paths that should skip middleware
const staticAssetPaths = [
    '/_next/static/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
];
// Rate limit configuration by endpoint type
const rateLimitConfig = {
    default: { limit: 100, window: 60 }, // 100 requests per minute
    auth: { limit: 10, window: 60 }, // 10 auth requests per minute
    api: { limit: 50, window: 60 }, // 50 API requests per minute
    admin: { limit: 30, window: 60 }, // 30 admin requests per minute
};
/**
 * Extracts platform slug from hostname
 */
export function getPlatformFromHost(host) {
    if (!host)
        return null;
    const subdomain = host.split('.')[0];
    if (['hub', 'ascenders', 'immortals', 'neothinkers'].includes(subdomain)) {
        return subdomain;
    }
    return null;
}
/**
 * Checks for suspicious patterns in the request
 */
function isSuspiciousRequest(req) {
    const path = req.nextUrl.pathname;
    const query = req.nextUrl.search;
    // Check for SQL injection attempts
    const sqlInjectionPatterns = [
        /union\s+select/i,
        /or\s+1=1/i,
        /';\s*--/i,
        /'\s*or\s*'1'='1/i
    ];
    // Check for XSS attempts
    const xssPatterns = [
        /<script\b[^>]*>/i,
        /javascript:/i,
        /on\w+\s*=/i
    ];
    // Check for path traversal
    const pathTraversalPatterns = [
        /\.\.\//,
        /\.\.\\/,
        /%2e%2e\//i
    ];
    const testString = `${path}${query}`;
    return [
        ...sqlInjectionPatterns,
        ...xssPatterns,
        ...pathTraversalPatterns
    ].some(pattern => pattern.test(testString));
}
/**
 * Checks rate limits for the request
 */
async function checkRateLimit(req, platformSlug) {
    var _a, _b;
    const supabase = createPlatformClient(platformSlug);
    const path = req.nextUrl.pathname;
    const clientIp = ((_b = (_a = req.headers.get('x-forwarded-for')) === null || _a === void 0 ? void 0 : _a.split(',')[0]) === null || _b === void 0 ? void 0 : _b.trim()) || 'unknown';
    // Determine rate limit based on endpoint
    let config = rateLimitConfig.default;
    if (path.startsWith('/api/auth')) {
        config = rateLimitConfig.auth;
    }
    else if (path.startsWith('/api/admin')) {
        config = rateLimitConfig.admin;
    }
    else if (path.startsWith('/api/')) {
        config = rateLimitConfig.api;
    }
    const identifier = `${platformSlug}:${clientIp}:${path}`;
    const windowStart = new Date(Date.now() - config.window * 1000).toISOString();
    const { data: requests } = await supabase
        .from('rate_limits')
        .select('count')
        .eq('identifier', identifier)
        .gte('window_start', windowStart)
        .single();
    return requests ? requests.count >= config.limit : false;
}
/**
 * Sets comprehensive security headers for all responses
 */
export function setSecurityHeaders(req, res) {
    const nonce = crypto.randomBytes(16).toString('base64');
    const headers = new Headers(res.headers);
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Content-Security-Policy', `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; object-src 'none';`);
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers
    });
}
export default async function middleware(req) {
    var _a, _b, _c, _d, _e, _f;
    try {
        const platformSlug = getPlatformFromHost(req.headers.get('host'));
        if (!platformSlug) {
            return new Response('Not Found', { status: 404 });
        }
        const supabase = createPlatformClient(platformSlug);
        // Check rate limits
        const isRateLimited = await checkRateLimit(req, platformSlug);
        if (isRateLimited) {
            await logSecurityEvent(supabase, {
                event: 'RATE_LIMIT_EXCEEDED',
                severity: 'medium',
                platform_slug: platformSlug,
                user_id: undefined,
                ip_address: ((_b = (_a = req.headers.get('x-forwarded-for')) === null || _a === void 0 ? void 0 : _a.split(',')[0]) === null || _b === void 0 ? void 0 : _b.trim()) || '',
                request_path: req.nextUrl.pathname,
                request_method: req.method,
                request_headers: Object.fromEntries(req.headers),
                context: {},
                details: {},
                suspicious_activity: true
            });
            return new Response('Too Many Requests', { status: 429 });
        }
        // Check for suspicious activity
        if (isSuspiciousRequest(req)) {
            await logSecurityEvent(supabase, {
                event: 'SUSPICIOUS_ACTIVITY',
                severity: 'high',
                platform_slug: platformSlug,
                user_id: undefined,
                ip_address: ((_d = (_c = req.headers.get('x-forwarded-for')) === null || _c === void 0 ? void 0 : _c.split(',')[0]) === null || _d === void 0 ? void 0 : _d.trim()) || '',
                request_path: req.nextUrl.pathname,
                request_method: req.method,
                request_headers: Object.fromEntries(req.headers),
                context: {},
                details: { path: req.nextUrl.pathname, headers: Object.fromEntries(req.headers) },
                suspicious_activity: true
            });
            return new Response('Bad Request', { status: 400 });
        }
        // Validate CSRF token for mutations
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            const csrfResult = await validateCsrfToken(req);
            if (!csrfResult) {
                await logSecurityEvent(supabase, {
                    event: 'CSRF_FAILURE',
                    severity: 'high',
                    platform_slug: platformSlug,
                    user_id: undefined,
                    ip_address: ((_f = (_e = req.headers.get('x-forwarded-for')) === null || _e === void 0 ? void 0 : _e.split(',')[0]) === null || _f === void 0 ? void 0 : _f.trim()) || '',
                    request_path: req.nextUrl.pathname,
                    request_method: req.method,
                    request_headers: Object.fromEntries(req.headers),
                    context: {},
                    details: { message: 'Invalid CSRF Token' },
                    suspicious_activity: true
                });
                return new Response('Invalid CSRF Token', { status: 403 });
            }
        }
        // Add security headers
        const response = await fetch(req);
        return setSecurityHeaders(req, response);
    }
    catch (error) {
        console.error('Middleware error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
export async function handleRateLimit(req, res, platform, supabase) {
    var _a, _b;
    const rateLimited = await checkRateLimit(req, platform);
    const rateLimitResponse = rateLimited ? new Response('Too Many Requests', { status: 429 }) : null;
    if (rateLimited) {
        // Log security event
        await logSecurityEvent(supabase, {
            event: 'RATE_LIMIT_EXCEEDED',
            severity: 'medium',
            platform_slug: platform,
            user_id: undefined,
            ip_address: ((_b = (_a = req.headers.get('x-forwarded-for')) === null || _a === void 0 ? void 0 : _a.split(',')[0]) === null || _b === void 0 ? void 0 : _b.trim()) || '',
            request_path: req.nextUrl.pathname,
            request_method: req.method,
            request_headers: Object.fromEntries(req.headers),
            context: {},
            details: {},
            suspicious_activity: true
        });
        return rateLimitResponse;
    }
    return null;
}
export function ensureCsrfToken(req, platform, csrfOptions = {}, supabase) {
    var _a, _b;
    const valid = validateCsrfToken(req);
    if (!valid) {
        // Log security event
        logSecurityEvent(supabase, {
            event: 'CSRF_FAILURE',
            severity: 'high',
            platform_slug: platform,
            user_id: undefined,
            ip_address: ((_b = (_a = req.headers.get('x-forwarded-for')) === null || _a === void 0 ? void 0 : _a.split(',')[0]) === null || _b === void 0 ? void 0 : _b.trim()) || '',
            request_path: req.nextUrl.pathname,
            request_method: req.method,
            request_headers: Object.fromEntries(req.headers),
            context: {},
            details: { message: 'Invalid CSRF Token' },
            suspicious_activity: true
        }).catch(error => console.error('Failed to log CSRF security event:', error));
        return false;
    }
    return true;
}
//# sourceMappingURL=middleware.js.map