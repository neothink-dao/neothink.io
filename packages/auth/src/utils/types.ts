import { PlatformSlug } from '@neothink/database/src/types/models';

/**
 * Security event severity levels
 */
export type SecurityEventSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Structure of a security event
 */
export interface SecurityEvent {
  platformSlug: string;
  eventType: string;
  severity: SecurityEventSeverity;
  userId?: string;
  requestIp?: string;
  requestPath?: string;
  requestMethod?: string;
  requestHeaders?: Record<string, any>;
  context?: Record<string, any>;
  details?: Record<string, any>;
  suspiciousActivity?: boolean;
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
  SECURITY_HEADER_VIOLATION: 'security_header_violation'
} as const;

export type SecurityEventType = typeof SecurityEventTypes[keyof typeof SecurityEventTypes];

/**
 * CSRF protection options
 */
export interface CsrfOptions {
  headerName?: string;
  cookieName?: string;
  tokenTtlHours?: number;
} 