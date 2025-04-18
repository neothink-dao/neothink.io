import { SupabaseClient } from '@supabase/supabase-js';
import type { SecurityEvent, SecurityEventSeverity, SecurityEventType, PlatformSlug } from '@neothink/database';
import { NextRequest } from 'next/server';
import { createPlatformClient } from '@neothink/database';

/**
 * Generate a UUID v4 (simple fallback, for demo; use a robust lib in prod)
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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
 * Helper function to create a security event (matches SecurityEvent interface)
 * @param platform_slug - platform identifier
 * @param type - event type (string literal)
 * @param severity - event severity
 * @param userId - user id
 * @param context - additional event context
 * @returns SecurityEvent (with id and timestamp)
 */
export function createSecurityEvent(
  platform_slug: PlatformSlug,
  type: SecurityEventType,
  severity: SecurityEventSeverity,
  userId: string,
  context: Record<string, any> = {}
): SecurityEvent {
  return {
    id: generateUUID(),
    type,
    severity,
    userId,
    timestamp: new Date().toISOString(),
    context: {
      ...context,
      platform_slug
    }
  };
}

/**
 * Helper function to create a suspicious activity event (matches SecurityEvent interface)
 * @param platform_slug - platform identifier
 * @param userId - user id
 * @param context - additional event context
 * @returns SecurityEvent (with id and timestamp)
 */
export function createSuspiciousActivityEvent(
  platform_slug: PlatformSlug,
  userId: string,
  context: Record<string, any> = {}
): SecurityEvent {
  return {
    id: generateUUID(),
    type: 'unauthorized_access', // Use a valid SecurityEventType string literal
    severity: 'high',
    userId,
    timestamp: new Date().toISOString(),
    context: {
      ...context,
      platform_slug,
      suspicious_activity: true
    }
  };
}

/**
 * Helper function to log authentication events
 */
export async function logAuthEvent(
  supabase: SupabaseClient,
  platform_slug: PlatformSlug,
  event: SecurityEventType,
  user_id: string,
  context: Record<string, any> = {},
  details?: Record<string, any>
) {
  await logSecurityEvent(
    supabase,
    createSecurityEvent(platform_slug, event, 'low', user_id, { ...context, details })
  );
}

/**
 * Helper function to log detailed security events
 */
export async function logDetailedSecurityEvent(
  supabase: SupabaseClient,
  platform_slug: PlatformSlug,
  event: SecurityEventType,
  user_id: string,
  severity: SecurityEventSeverity,
  context: Record<string, any> = {},
  details: Record<string, any> = {},
  suspicious_activity = false,
  req?: NextRequest
) {
  const requestInfo = req
    ? {
        ip_address: req.headers.get('x-forwarded-for') || '',
        request_path: req.nextUrl.pathname,
        request_method: req.method,
        request_headers: Object.fromEntries(req.headers.entries()),
      }
    : {};
  try {
    await logSecurityEvent(supabase, {
      ...createSecurityEvent(platform_slug, event, severity, user_id, { ...context, ...requestInfo, details, suspicious_activity }),
    });
  } catch (error) {
    // Log to console if database logging fails
    console.error('Failed to log security event:', {
      error,
      event: {
        ...createSecurityEvent(platform_slug, event, severity, user_id, { ...context, ...requestInfo, details, suspicious_activity }),
      },
    });
  }
}

/**
 * Log a security event using an options object (canonical shape)
 */
export async function logSecurityEventFromOptions({
  supabase,
  platform_slug,
  event,
  severity,
  user_id,
  context = {},
  details = {},
  suspicious_activity = false,
  req
}: {
  supabase: SupabaseClient;
  platform_slug: PlatformSlug;
  event: SecurityEventType;
  severity: SecurityEventSeverity;
  user_id: string;
  context?: Record<string, any>;
  details?: Record<string, any>;
  suspicious_activity?: boolean;
  req?: NextRequest;
}) {
  const requestInfo = req
    ? {
        ip_address: req.headers.get('x-forwarded-for') || '',
        request_path: req.nextUrl.pathname,
        request_method: req.method,
        request_headers: Object.fromEntries(req.headers.entries()),
      }
    : {};
  try {
    await logSecurityEvent(supabase, {
      ...createSecurityEvent(platform_slug, event, severity, user_id, { ...context, ...requestInfo, details, suspicious_activity }),
    });
  } catch (error) {
    // Log to console if database logging fails
    console.error('Failed to log security event:', {
      error,
      event: {
        ...createSecurityEvent(platform_slug, event, severity, user_id, { ...context, ...requestInfo, details, suspicious_activity }),
      },
    });
  }
}

// --- DX/UX/Production-Readiness Enhancements ---
// 1. All helpers now return valid SecurityEvent objects
// 2. All event types are string literals matching the type union
// 3. UUID and timestamp are generated for every event
// 4. JSDoc and parameter docs added
// 5. If you need custom fields, extend SecurityEvent in your own type