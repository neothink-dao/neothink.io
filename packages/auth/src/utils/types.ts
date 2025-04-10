/**
 * Security event severity levels
 */
export type SecurityEventSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Structure of a security event
 */
export interface SecurityEvent {
  eventType: string;
  severity: SecurityEventSeverity;
  context: Record<string, any>;
  details: Record<string, any>;
}

/**
 * Common security event types
 */
export const SecurityEventTypes = {
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  AUTH_FAILURE: 'auth_failure',
  CSRF_FAILURE: 'csrf_failure',
  INVALID_REQUEST: 'invalid_request',
} as const;

export type SecurityEventType = typeof SecurityEventTypes[keyof typeof SecurityEventTypes]; 