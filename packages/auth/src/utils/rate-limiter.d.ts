import { SupabaseClient } from '@supabase/supabase-js';
import { RateLimitConfig, RateLimitResult } from '../types/security';
/**
 * Check if a request should be rate limited
 */
export declare function checkRateLimit(supabase: SupabaseClient, config: RateLimitConfig): Promise<RateLimitResult>;
/**
 * Helper function to create a rate limit config for IP-based rate limiting
 */
export declare function createIpRateLimit(ip: string, maxRequests?: number, windowSeconds?: number): RateLimitConfig;
/**
 * Helper function to create a rate limit config for user-based rate limiting
 */
export declare function createUserRateLimit(userId: string, maxRequests?: number, windowSeconds?: number): RateLimitConfig;
//# sourceMappingURL=rate-limiter.d.ts.map