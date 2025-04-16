import { SupabaseClient } from '@supabase/supabase-js';
import { RateLimitConfig, RateLimitResult } from '../types/security';

/**
 * Check if a request should be rate limited
 */
export async function checkRateLimit(
  supabase: SupabaseClient,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowSeconds * 1000);

  // Clean up old rate limit entries
  await supabase
    .from('rate_limits')
    .delete()
    .lt('window_start', windowStart.toISOString());

  // Get current count for this identifier
  const { data: existingData } = await supabase
    .from('rate_limits')
    .select('count, window_start')
    .eq('identifier', config.identifier)
    .gte('window_start', windowStart.toISOString())
    .single();

  if (!existingData) {
    // First request in this window
    await supabase.from('rate_limits').insert({
      identifier: config.identifier,
      count: 1,
      window_start: windowStart.toISOString(),
      window_seconds: config.windowSeconds,
    });

    return {
      isLimited: false,
      remaining: config.maxRequests - 1,
      resetTime: new Date(now.getTime() + config.windowSeconds * 1000),
    };
  }

  const currentCount = existingData.count;
  const isLimited = currentCount >= config.maxRequests;

  if (!isLimited) {
    // Increment the counter
    await supabase
      .from('rate_limits')
      .update({ count: currentCount + 1 })
      .eq('identifier', config.identifier)
      .gte('window_start', windowStart.toISOString());
  }

  return {
    isLimited,
    remaining: Math.max(0, config.maxRequests - (currentCount + 1)),
    resetTime: new Date(
      new Date(existingData.window_start).getTime() + config.windowSeconds * 1000
    ),
  };
}

/**
 * Helper function to create a rate limit config for IP-based rate limiting
 */
export function createIpRateLimit(
  ip: string,
  maxRequests: number = 100,
  windowSeconds: number = 60
): RateLimitConfig {
  return {
    identifier: `ip:${ip}`,
    maxRequests,
    windowSeconds,
  };
}

/**
 * Helper function to create a rate limit config for user-based rate limiting
 */
export function createUserRateLimit(
  userId: string,
  maxRequests: number = 1000,
  windowSeconds: number = 60
): RateLimitConfig {
  return {
    identifier: `user:${userId}`,
    maxRequests,
    windowSeconds,
  };
} 