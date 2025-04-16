import { SupabaseClient } from '@supabase/supabase-js';
import type { SecurityEvent, SecurityEventSeverity } from '@neothink/database';
import { PlatformSlug } from '@neothink/database';
import { NextRequest } from 'next/server';

/**
 * Logs a security event to the security_events table
 */
export declare const logSecurityEvent: (supabaseAdmin: SupabaseClient, event: SecurityEvent) => Promise<void>;

/**
 * Helper function to create a security event (canonical type)
 */
export declare function createSecurityEvent(
  platform_slug: string,
  event: string,
  severity: SecurityEventSeverity,
  context?: Record<string, any>,
  details?: Record<string, any>,
  user_id?: string
): SecurityEvent;

/**
 * Helper function to create a suspicious activity event (canonical type)
 */
export declare function createSuspiciousActivityEvent(
  platform_slug: string,
  details: Record<string, any>,
  context: Record<string, any>,
  user_id?: string
): SecurityEvent;

/**
 * Helper function to log authentication events (canonical type)
 */
export declare function logAuthEvent(
  supabase: SupabaseClient,
  platform_slug: string,
  event: string,
  context: Record<string, any>,
  details?: Record<string, any>,
  user_id?: string
): Promise<void>;

/**
 * Log a security event using an options object (canonical type)
 */
export declare function logSecurityEventFromOptions({
  platform_slug,
  event,
  severity,
  user_id,
  context,
  details,
  request,
  suspicious_activity
}: {
  platform_slug: string;
  event: string;
  severity: SecurityEventSeverity;
  user_id?: string;
  context?: Record<string, any>;
  details?: Record<string, any>;
  request?: NextRequest;
  suspicious_activity?: boolean;
}): Promise<void>;

export {};
//# sourceMappingURL=security-logger.d.ts.map