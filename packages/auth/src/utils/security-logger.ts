import { SupabaseClient } from '@supabase/supabase-js';
import type { SecurityEvent, SecurityEventSeverity, SecurityEventType, PlatformSlug } from '@neothink/database';
import { SecurityEventTypes } from '@neothink/database';
import { NextRequest } from 'next/server';
import { createPlatformClient } from '@neothink/database';

/**
 * Logs a security event to the security_events table
 */
export const logSecurityEvent = async (
  supabaseAdmin: SupabaseClient,
  event: SecurityEvent
): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.from('security_events').insert(event);

    if (error) {
      console.error('Error logging security event:', error);
    }
  } catch (error) {
    console.error('Error logging security event:', error);
  }
};

/**
 * Helper function to create a security event
 * Uses canonical type shape from @neothink/database
 */
export function createSecurityEvent(
  platform_slug: string,
  event: string,
  severity: SecurityEventSeverity,
  context: Record<string, any> = {},
  details: Record<string, any> = {},
  user_id?: string
): SecurityEvent {
  return {
    event,
    severity,
    platform_slug,
    user_id,
    context,
    details,
    suspicious_activity: false
  };
}

/**
 * Helper function to create a suspicious activity event
 * Uses canonical type shape from @neothink/database
 */
export function createSuspiciousActivityEvent(
  platform_slug: string,
  details: Record<string, any>,
  context: Record<string, any>,
  user_id?: string
): SecurityEvent {
  return {
    event: SecurityEventTypes.SUSPICIOUS_ACTIVITY,
    severity: 'high',
    platform_slug,
    user_id,
    context,
    details,
    suspicious_activity: true
  };
}

/**
 * Helper function to log authentication events
 */
export async function logAuthEvent(
  supabase: SupabaseClient,
  platform_slug: string,
  event: string,
  context: Record<string, any>,
  details?: Record<string, any>,
  user_id?: string
): Promise<void> {
  await logSecurityEvent(
    supabase,
    {
      event: `auth.${event}`,
      severity: 'low',
      platform_slug,
      user_id,
      context,
      details: details || {},
      suspicious_activity: false
    }
  );
}

/**
 * Log a security event using an options object (canonical shape)
 */
export async function logSecurityEventFromOptions({
  platform_slug,
  event,
  severity,
  user_id,
  context = {},
  details = {},
  request,
  suspicious_activity = false
}: {
  platform_slug: string;
  event: string;
  severity: SecurityEventSeverity;
  user_id?: string;
  context?: Record<string, any>;
  details?: Record<string, any>;
  request?: NextRequest;
  suspicious_activity?: boolean;
}): Promise<void> {
  const supabase = createPlatformClient(platform_slug as PlatformSlug);
  // Extract request information if provided
  const requestInfo = request ? {
    ip_address: request.headers.get('x-forwarded-for') || 'unknown',
    request_path: request.nextUrl.pathname,
    request_method: request.method,
    request_headers: Object.fromEntries(request.headers.entries()),
  } : {};
  try {
    await logSecurityEvent(supabase, {
      event,
      severity,
      platform_slug,
      user_id,
      context,
      details,
      suspicious_activity,
      ...requestInfo
    });
  } catch (error) {
    // Log to console if database logging fails
    console.error('Failed to log security event:', {
      error,
      event: {
        event,
        severity,
        platform_slug,
        user_id,
        context,
        details,
        suspicious_activity,
        ...requestInfo
      },
    });
  }
}