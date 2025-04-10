import { SupabaseClient } from '@supabase/supabase-js';
import { SecurityEvent, SecurityEventSeverity } from '../types/security';
import { PlatformSlug } from '@neothink/database/src/types/models';
import { NextRequest } from 'next/server';

interface LogSecurityEventOptions {
  platformSlug: PlatformSlug;
  eventType: string;
  severity: SecurityEventSeverity;
  userId?: string;
  context?: Record<string, any>;
  details?: Record<string, any>;
  request?: NextRequest;
}

/**
 * Log a security event to the database
 */
export async function logSecurityEvent(
  supabase: SupabaseClient,
  event: SecurityEvent
): Promise<void> {
  await supabase.from('security_events').insert({
    event_type: event.eventType,
    severity: event.severity,
    context: event.context,
    details: event.details,
    created_at: new Date().toISOString(),
  });
}

/**
 * Helper function to create a security event
 */
export function createSecurityEvent(
  eventType: string,
  severity: SecurityEventSeverity,
  context: Record<string, any>,
  details: Record<string, any> = {}
): SecurityEvent {
  return {
    eventType,
    severity,
    context,
    details,
  };
}

/**
 * Common security event types
 */
export const SecurityEventTypes = {
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  AUTH_FAILURE: 'auth_failure',
  CSRF_FAILURE: 'csrf_failure',
  INVALID_TOKEN: 'invalid_token',
  PLATFORM_ACCESS_DENIED: 'platform_access_denied',
} as const;

/**
 * Helper function to create a rate limit exceeded event
 */
export function createRateLimitEvent(
  identifier: string,
  context: Record<string, any>
): SecurityEvent {
  return createSecurityEvent(
    SecurityEventTypes.RATE_LIMIT_EXCEEDED,
    'medium',
    context,
    { identifier }
  );
}

/**
 * Helper function to create a suspicious activity event
 */
export function createSuspiciousActivityEvent(
  details: Record<string, any>,
  context: Record<string, any>
): SecurityEvent {
  return createSecurityEvent(
    SecurityEventTypes.SUSPICIOUS_ACTIVITY,
    'high',
    context,
    details
  );
}

/**
 * Helper function to create an auth failure event
 */
export function createAuthFailureEvent(
  reason: string,
  context: Record<string, any>
): SecurityEvent {
  return createSecurityEvent(
    SecurityEventTypes.AUTH_FAILURE,
    'medium',
    context,
    { reason }
  );
}

/**
 * Helper function to log suspicious activity
 */
export async function logSuspiciousActivity(
  supabase: SupabaseClient,
  activityType: string,
  context: Record<string, any>,
  details: Record<string, any>
): Promise<void> {
  await logSecurityEvent(
    supabase,
    `suspicious_activity.${activityType}`,
    'medium',
    context,
    details
  );
}

/**
 * Helper function to log authentication events
 */
export async function logAuthEvent(
  supabase: SupabaseClient,
  eventType: string,
  context: Record<string, any>,
  details?: Record<string, any>
): Promise<void> {
  await logSecurityEvent(
    supabase,
    `auth.${eventType}`,
    'low',
    context,
    details
  );
}

export async function logSecurityEventFromOptions({
  platformSlug,
  eventType,
  severity,
  userId,
  context = {},
  details = {},
  request,
}: LogSecurityEventOptions) {
  const supabase = createClient(platformSlug);
  
  // Extract request information if provided
  const requestInfo = request ? {
    request_ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
    request_path: request.nextUrl.pathname,
    request_headers: Object.fromEntries(request.headers.entries()),
  } : {};
  
  try {
    await supabase.from('security_events').insert({
      platform_slug: platformSlug,
      event_type: eventType,
      severity,
      user_id: userId,
      context,
      details,
      ...requestInfo,
    });
  } catch (error) {
    // Log to console if database logging fails
    console.error('Failed to log security event:', {
      error,
      event: {
        platformSlug,
        eventType,
        severity,
        userId,
        context,
        details,
        ...requestInfo,
      },
    });
  }
} 