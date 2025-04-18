import { SupabaseClient } from '@supabase/supabase-js';
import type { SecurityEvent, SecurityEventSeverity, SecurityEventType, PlatformSlug } from '@neothink/database';
import { NextRequest } from 'next/server';
/**
 * Logs a security event to the security_events table
 */
export declare const logSecurityEvent: (supabaseAdmin: SupabaseClient, event: SecurityEvent) => Promise<void>;
/**
 * Helper function to create a security event
 * Uses canonical type shape from @neothink/database
 */
export declare function createSecurityEvent(platform_slug: PlatformSlug, event: SecurityEventType, severity: SecurityEventSeverity, context?: Record<string, any>, details?: Record<string, any>, user_id?: string): SecurityEvent;
/**
 * Helper function to create a suspicious activity event
 * Uses canonical type shape from @neothink/database
 */
export declare function createSuspiciousActivityEvent(platform_slug: PlatformSlug, details: Record<string, any>, context: Record<string, any>, user_id?: string): SecurityEvent;
/**
 * Helper function to log authentication events
 */
export declare function logAuthEvent(supabase: SupabaseClient, platform_slug: PlatformSlug, event: string, context: Record<string, any>, details?: Record<string, any>, user_id?: string): Promise<void>;
/**
 * Log a security event using an options object (canonical shape)
 */
export declare function logSecurityEventFromOptions({ platform_slug, event, severity, user_id, context, details, request, suspicious_activity }: {
    platform_slug: PlatformSlug;
    event: SecurityEventType;
    severity: SecurityEventSeverity;
    user_id?: string;
    context?: Record<string, any>;
    details?: Record<string, any>;
    request?: NextRequest;
    suspicious_activity?: boolean;
}): Promise<void>;
//# sourceMappingURL=security-logger.d.ts.map