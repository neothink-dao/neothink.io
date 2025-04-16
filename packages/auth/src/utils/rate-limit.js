import { createPlatformClient } from '@neothink/database';
// Rate limit configurations by endpoint type
export const rateLimitConfig = {
    auth: { limit: 100, window: 3600 }, // 100 requests per hour
    admin: { limit: 50, window: 3600 }, // 50 requests per hour
    api: { limit: 1000, window: 3600 }, // 1000 requests per hour
    default: { limit: 2000, window: 3600 } // 2000 requests per hour
};
export async function checkRateLimit(request) {
    const identifier = request.ip || 'unknown';
    const path = request.nextUrl.pathname;
    // Determine which rate limit config to use based on path
    let config = rateLimitConfig.default;
    if (path.startsWith('/api/auth')) {
        config = rateLimitConfig.auth;
    }
    else if (path.startsWith('/api/admin')) {
        config = rateLimitConfig.admin;
    }
    else if (path.startsWith('/api')) {
        config = rateLimitConfig.api;
    }
    const supabase = createPlatformClient('hub');
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - config.window;
    // Clean up old rate limit records
    await supabase
        .from('rate_limits')
        .delete()
        .lt('window_start', windowStart);
    // Get current count
    const { data: records } = await supabase
        .from('rate_limits')
        .select('count')
        .eq('identifier', identifier)
        .gte('window_start', windowStart)
        .single();
    const currentCount = (records === null || records === void 0 ? void 0 : records.count) || 0;
    if (currentCount >= config.limit) {
        return true; // Rate limit exceeded
    }
    // Increment or create rate limit record
    if (currentCount === 0) {
        await supabase
            .from('rate_limits')
            .insert({
            identifier,
            count: 1,
            window_start: now,
            window_seconds: config.window
        });
    }
    else {
        await supabase
            .from('rate_limits')
            .update({ count: currentCount + 1 })
            .eq('identifier', identifier)
            .gte('window_start', windowStart);
    }
    return false; // Rate limit not exceeded
}
//# sourceMappingURL=rate-limit.js.map