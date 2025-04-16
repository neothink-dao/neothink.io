import type { NextRequest } from 'next/server';
import { SupabaseClient } from '@supabase/supabase-js';
/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    message?: string;
}
export declare function applyRateLimit(req: NextRequest, supabase: SupabaseClient, config: RateLimitConfig): Promise<Response | null>;
/**
 * Gets the appropriate rate limit config based on the request path
 */
export declare function getRateLimitConfig(path: string): RateLimitConfig;
/**
 * Clean up expired rate limit records
 *
 * This should be called periodically (e.g., via a cron job) to clean up old records
 */
export declare function cleanupRateLimits(supabase: SupabaseClient): Promise<void>;
//# sourceMappingURL=rateLimit.d.ts.map