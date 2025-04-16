import type { SecurityEvent, SecurityEventSeverity, SecurityEventType } from '@neothink/database';
import { SecurityEventTypes } from '@neothink/database';

/**
 * Structure of a security event
 */
export interface SecurityEventOptions {
  event: SecurityEvent;
  severity: SecurityEventSeverity;
  context?: Record<string, any>;
  details?: Record<string, any>;
  userId?: string;
}

/**
 * Configuration for rate limiting
 */
export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed within the time window
   */
  maxRequests: number;

  /**
   * Time window in seconds
   */
  windowSeconds: number;

  /**
   * Unique identifier for the rate limit (e.g. IP address, user ID)
   */
  identifier: string;
}

/**
 * Result of a rate limit check
 */
export interface RateLimitResult {
  /**
   * Whether the rate limit has been exceeded
   */
  isLimited: boolean;

  /**
   * Number of requests remaining in the current window
   */
  remaining: number;

  /**
   * Timestamp when the rate limit window resets
   */
  resetTime: Date;
}

export interface SecurityHeaders {
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'Referrer-Policy': string;
  'X-XSS-Protection': string;
  'X-Permitted-Cross-Domain-Policies': string;
  'Content-Security-Policy': string;
  'Strict-Transport-Security'?: string;
}

export interface SecurityMiddlewareConfig {
  rateLimiting?: {
    enabled: boolean;
    defaultLimit: number;
    defaultWindow: number;
    endpoints?: Record<string, RateLimitOptions>;
  };
  securityHeaders?: Partial<SecurityHeaders>;
  logging?: {
    enabled: boolean;
    excludePaths?: string[];
  };
}

export interface SecurityMiddleware {
  (req: NextRequest): Promise<Response>;
  setConfig?: (config: SecurityMiddlewareConfig) => void;
}

export interface RateLimitOptions {
  identifier: string;
  limit: number;
  windowSeconds: number;
}