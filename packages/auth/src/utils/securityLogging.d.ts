import { SupabaseClient } from '@supabase/supabase-js';
import type { SecurityEvent } from '@neothink/database';
/**
 * Log a security event to the Supabase database
 *
 * @param supabase Supabase client instance
 * @param event Security event to log
 * @returns Success status
 */
export declare function logSecurityEvent(supabase: SupabaseClient, event: SecurityEvent): Promise<boolean>;
/**
 * Predefined security event types for consistency
 */
export declare const SecurityEventTypes: {
    readonly LOGIN_SUCCESS: "login_success";
    readonly LOGIN_FAILURE: "login_failure";
    readonly RATE_LIMIT_EXCEEDED: "rate_limit_exceeded";
    readonly SUSPICIOUS_ACTIVITY: "suspicious_activity";
    readonly ACCESS_DENIED: "access_denied";
    readonly CSRF_VALIDATION_FAILURE: "csrf_validation_failure";
    readonly SQL_INJECTION_ATTEMPT: "sql_injection_attempt";
    readonly XSS_ATTEMPT: "xss_attempt";
    readonly PATH_TRAVERSAL_ATTEMPT: "path_traversal_attempt";
    readonly ADMIN_ACTION: "admin_action";
    readonly PASSWORD_CHANGE: "password_change";
    readonly ACCOUNT_LOCKOUT: "account_lockout";
    readonly ACCOUNT_RECOVERY: "account_recovery";
    readonly SESSION_HIJACKING_ATTEMPT: "session_hijacking_attempt";
    readonly INVALID_AUTH_ATTEMPT: "invalid_auth_attempt";
    readonly CSRF_TOKEN_INVALID: "csrf_token_invalid";
    readonly SUSPICIOUS_IP_DETECTED: "suspicious_ip_detected";
};
export type SecurityEventType = typeof SecurityEventTypes[keyof typeof SecurityEventTypes];
//# sourceMappingURL=securityLogging.d.ts.map