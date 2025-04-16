import { SecurityEventTypes } from './types';
import { createPlatformClient } from '@neothink/database';
/**
 * Logs a security event to the security_events table
 */
export const logSecurityEvent = async (supabaseAdmin, event) => {
    try {
        const { error } = await supabaseAdmin.from('security_events').insert({
            platform_slug: event.platformSlug,
            event_type: event.eventType,
            severity: event.severity,
            user_id: event.userId || null,
            request_ip: event.requestIp || null,
            request_path: event.requestPath || null,
            request_method: event.requestMethod || null,
            request_headers: event.requestHeaders || null,
            context: event.context || {},
            details: event.details || {},
            suspicious_activity: event.suspiciousActivity || false,
        });
        if (error) {
            console.error('Error logging security event:', error);
        }
    }
    catch (error) {
        console.error('Error logging security event:', error);
    }
};
/**
 * Helper function to create a security event
 */
export function createSecurityEvent(platformSlug, eventType, severity, context = {}, details = {}) {
    return {
        platformSlug,
        eventType,
        severity,
        context,
        details,
        suspiciousActivity: false
    };
}
/**
 * Helper function to create a rate limit exceeded event
 */
export function createRateLimitEvent(platformSlug, identifier, context) {
    return createSecurityEvent(platformSlug, SecurityEventTypes.RATE_LIMIT_EXCEEDED, 'medium', context, { identifier });
}
/**
 * Helper function to create a suspicious activity event
 */
export function createSuspiciousActivityEvent(platformSlug, details, context) {
    return {
        platformSlug,
        eventType: SecurityEventTypes.SUSPICIOUS_ACTIVITY,
        severity: 'high',
        context,
        details,
        suspiciousActivity: true
    };
}
/**
 * Helper function to create an auth failure event
 */
export function createAuthFailureEvent(platformSlug, reason, context) {
    return createSecurityEvent(platformSlug, SecurityEventTypes.AUTH_FAILURE, 'medium', context, { reason });
}
/**
 * Helper function to log suspicious activity
 */
export async function logSuspiciousActivity(supabase, platformSlug, activityType, context, details) {
    await logSecurityEvent(supabase, {
        platformSlug,
        eventType: `suspicious_activity.${activityType}`,
        severity: 'medium',
        context,
        details,
        suspiciousActivity: true
    });
}
/**
 * Helper function to log authentication events
 */
export async function logAuthEvent(supabase, platformSlug, eventType, context, details) {
    await logSecurityEvent(supabase, {
        platformSlug,
        eventType: `auth.${eventType}`,
        severity: 'low',
        context,
        details: details || {},
        suspiciousActivity: false
    });
}
/**
 * Log a security event using an options object
 */
export async function logSecurityEventFromOptions({ platformSlug, eventType, severity, userId, context = {}, details = {}, request, }) {
    const supabase = createPlatformClient(platformSlug);
    // Extract request information if provided
    const requestInfo = request ? {
        requestIp: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        requestPath: request.nextUrl.pathname,
        requestMethod: request.method,
        requestHeaders: Object.fromEntries(request.headers.entries()),
    } : {};
    try {
        await logSecurityEvent(supabase, Object.assign(Object.assign({ platformSlug,
            eventType,
            severity,
            userId,
            context,
            details }, requestInfo), { suspiciousActivity: false }));
    }
    catch (error) {
        // Log to console if database logging fails
        console.error('Failed to log security event:', {
            error,
            event: Object.assign({ platformSlug,
                eventType,
                severity,
                userId,
                context,
                details }, requestInfo),
        });
    }
}
//# sourceMappingURL=security-logger.js.map