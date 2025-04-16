// Shared types for use across all apps/packages

export type SecurityEventSeverity = 'low' | 'medium' | 'high' | 'critical';

export const SecurityEventTypes = {
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  AUTH_FAILURE: 'auth_failure',
  CSRF_FAILURE: 'csrf_failure',
  INVALID_REQUEST: 'invalid_request',
  SECURITY_HEADER_VIOLATION: 'security_header_violation',
} as const;

export type SecurityEventType = typeof SecurityEventTypes[keyof typeof SecurityEventTypes];

export interface SecurityEvent {
  event: string;
  severity: SecurityEventSeverity;
  platform_slug?: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  request_path?: string;
  context?: Record<string, any>;
  details?: Record<string, any>;
  created_at: string;
}

export interface SecurityLog {
  id: string;
  event: string;
  severity: SecurityEventSeverity;
  platform_slug?: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  request_path?: string;
  context?: Record<string, any>;
  details?: Record<string, any>;
  created_at: string;
}

// Export existing types as needed...