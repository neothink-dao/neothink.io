/**
 * @neothink/auth
 * Enhanced security features for Neothink applications
 */
import middleware, { getPlatformFromHost } from './utils/middleware';
import type { SecurityEvent, SecurityEventSeverity } from '@neothink/database';
import { logSecurityEvent, SecurityEventTypes } from './utils/securityLogging';
import { applyRateLimit, cleanupRateLimits } from './utils/rateLimit';
import { getRecentSecurityLogs, getRateLimitRecords, generateTestSecurityLogs, clearTestSecurityLogs } from './utils/securityTestingHelpers';
import SecurityDashboard from './components/SecurityDashboard';
import { SecurityProvider, useSecurityProvider, withCsrfProtection } from './hooks/useSecurityProvider';
export { middleware, getPlatformFromHost, logSecurityEvent, SecurityEventTypes, applyRateLimit, cleanupRateLimits, type SecurityEvent, type SecurityEventSeverity, getRecentSecurityLogs, getRateLimitRecords, generateTestSecurityLogs, clearTestSecurityLogs, SecurityDashboard, SecurityProvider, useSecurityProvider, withCsrfProtection };
export * from './components/AuthForm';
export * from './components/SignInForm';
export * from './components/SignUpForm';
export * from './components/ForgotPasswordForm';
export * from './components/UpdatePasswordForm';
export * from './components/ErrorPage';
export * from './lib/supabase/client';
//# sourceMappingURL=index.d.ts.map