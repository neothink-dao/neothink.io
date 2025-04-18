/**
 * Default rate limits by endpoint type
 */
const DEFAULT_RATE_LIMIT = {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60 // 60 requests per minute
};
const AUTH_RATE_LIMIT = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5 // 5 attempts per 15 minutes
};
async function logRateLimitViolation(supabase, req, details) {
    const securityEvent = {
        event: 'rate_limit_exceeded',
        severity: 'medium',
        platform_slug: req.headers.get('host') || 'unknown',
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        request_path: req.nextUrl.pathname,
        request_method: req.method,
        request_headers: Object.fromEntries(req.headers),
        context: {
            path: req.nextUrl.pathname,
            method: req.method,
            ip: req.headers.get('x-forwarded-for') || 'unknown',
        },
        details,
        suspicious_activity: true
    };
    await supabase.from('security_events').insert(securityEvent);
}
export async function applyRateLimit(req, supabase, config) {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const key = `rate_limit:${ip}:${req.nextUrl.pathname}`;
    // Get current count
    const { data: rateData } = await supabase
        .from('rate_limits')
        .select('count, last_request')
        .eq('key', key)
        .single();
    const now = new Date();
    const windowStart = new Date(now.getTime() - config.windowMs);
    if (rateData) {
        const lastRequest = new Date(rateData.last_request);
        // Reset if outside window
        if (lastRequest < windowStart) {
            await supabase
                .from('rate_limits')
                .update({ count: 1, last_request: now.toISOString() })
                .eq('key', key);
            return null;
        }
        // Increment count
        if (rateData.count >= config.maxRequests) {
            await logRateLimitViolation(supabase, req, {
                ip,
                count: rateData.count,
                window_ms: config.windowMs,
                max_requests: config.maxRequests
            });
            return new Response(JSON.stringify({
                error: config.message || 'Too many requests'
            }), {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': Math.ceil((config.windowMs - (now.getTime() - lastRequest.getTime())) / 1000).toString()
                }
            });
        }
        await supabase
            .from('rate_limits')
            .update({
            count: rateData.count + 1,
            last_request: now.toISOString()
        })
            .eq('key', key);
    }
    else {
        // First request
        await supabase
            .from('rate_limits')
            .insert({
            key,
            count: 1,
            last_request: now.toISOString()
        });
    }
    return null;
}
/**
 * Gets the appropriate rate limit config based on the request path
 */
export function getRateLimitConfig(path) {
    // Use stricter limits for authentication endpoints
    if (path.includes('/auth/') || path.includes('/login') || path.includes('/signup')) {
        return AUTH_RATE_LIMIT;
    }
    return DEFAULT_RATE_LIMIT;
}
/**
 * Clean up expired rate limit records
 *
 * This should be called periodically (e.g., via a cron job) to clean up old records
 */
export async function cleanupRateLimits(supabase) {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const { error } = await supabase
        .from('rate_limits')
        .delete()
        .lt('window_start', oneDayAgo.toISOString());
    if (error) {
        console.error('Failed to clean up rate limit records:', error);
    }
}
//# sourceMappingURL=rateLimit.js.map