import { SupabaseClient } from '@supabase/supabase-js';
import { PlatformSlug } from '@neothink/database';
import type { SecurityEvent, SecurityEventSeverity } from '../types/index';

/**
 * Security event severity levels
 */
// Removed: export type SecurityEventSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Security event data structure
 */
// Removed: export interface SecurityEvent { ... }

/**
 * Log a security event to the Supabase database
 * 
 * @param supabase Supabase client instance
 * @param event Security event to log
 * @returns Success status
 */
export async function logSecurityEvent(
  supabase: SupabaseClient,
  event: SecurityEvent
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('security_events')
      .insert({
        ...event,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Failed to log security event:', error);
      return false;
    }
    
    // For critical events, consider additional actions (like alerting)
    if (event.severity === 'critical') {
      // TODO: Add integration with alert systems
      console.error('CRITICAL SECURITY EVENT:', event);
    }
    
    return true;
  } catch (error) {
    console.error('Error logging security event:', error);
    return false;
  }
}

/**
 * Predefined security event types for consistency
 */
export const SecurityEventTypes = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  ACCESS_DENIED: 'access_denied',
  CSRF_VALIDATION_FAILURE: 'csrf_validation_failure',
  SQL_INJECTION_ATTEMPT: 'sql_injection_attempt',
  XSS_ATTEMPT: 'xss_attempt',
  PATH_TRAVERSAL_ATTEMPT: 'path_traversal_attempt',
  ADMIN_ACTION: 'admin_action',
  PASSWORD_CHANGE: 'password_change',
  ACCOUNT_LOCKOUT: 'account_lockout',
  ACCOUNT_RECOVERY: 'account_recovery',
  SESSION_HIJACKING_ATTEMPT: 'session_hijacking_attempt',
  INVALID_AUTH_ATTEMPT: 'invalid_auth_attempt',
  CSRF_TOKEN_INVALID: 'csrf_token_invalid',
  SUSPICIOUS_IP_DETECTED: 'suspicious_ip_detected'
} as const;

export type SecurityEventType = typeof SecurityEventTypes[keyof typeof SecurityEventTypes]; 