/**
 * @neothink/auth
 * Enhanced security features for Neothink applications
 */

// Export all types and functions
export { middleware, getPlatformFromHost } from './utils/middleware';
export * from './types/security';

// Export security logging utilities
import { 
  logSecurityEvent, 
  SecurityEventTypes, 
  type SecurityEvent,
  type SecurityEventSeverity 
} from './utils/securityLogging';

// Export rate limiting utilities
import { 
  applyRateLimit,
  cleanupRateLimits 
} from './utils/rateLimit';

// Export testing helpers (only in development)
import {
  getRecentSecurityLogs,
  getRateLimitRecords,
  generateTestSecurityLogs,
  clearTestSecurityLogs
} from './utils/securityTestingHelpers';

// Export client-side components
import SecurityDashboard from './components/SecurityDashboard';
import { 
  SecurityProvider, 
  useSecurityProvider,
  withCsrfProtection
} from './hooks/useSecurityProvider';

// Main exports
export {
  // Middleware
  middleware,
  getPlatformFromHost,
  
  // Security logging
  logSecurityEvent,
  SecurityEventTypes,
  
  // Rate limiting
  applyRateLimit,
  cleanupRateLimits,
  
  // Types
  type SecurityEvent,
  type SecurityEventSeverity,
  
  // Testing helpers (development only)
  getRecentSecurityLogs,
  getRateLimitRecords,
  generateTestSecurityLogs,
  clearTestSecurityLogs,
  
  // Client components
  SecurityDashboard,
  SecurityProvider,
  useSecurityProvider,
  withCsrfProtection
};

// Conditional exports for different environments
if (process.env.NODE_ENV !== 'production') {
  // Development-only exports
  // (nothing additional yet)
}

// Export types for security logging
export type SecurityEventSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityEvent {
  event: string;
  severity: SecurityEventSeverity;
  context: {
    path?: string;
    method?: string;
    [key: string]: any;
  };
  details: Record<string, any>;
}

// Components
export * from './components/AuthForm'
export * from './components/SignInForm'
export * from './components/SignUpForm'
export * from './components/ForgotPasswordForm'
export * from './components/UpdatePasswordForm'
export * from './components/ErrorPage'

// Supabase
export * from './lib/supabase/client'

// Middleware
export { middleware } from './middleware'
