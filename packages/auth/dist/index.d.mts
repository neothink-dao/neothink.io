import { NextRequest } from 'next/server';
import * as _neothink_database from '@neothink/database';
import { PlatformSlug, SecurityEvent } from '@neothink/database';
export { SecurityEvent, SecurityEventSeverity, createClient } from '@neothink/database';
import { SupabaseClient } from '@supabase/supabase-js';
import * as react from 'react';
import react__default, { ReactNode, FormEvent } from 'react';

/**
 * Extracts platform slug from hostname
 */
declare function getPlatformFromHost(host?: string | null): PlatformSlug | null;
declare function middleware(req: NextRequest): Promise<Response>;

/**
 * Log a security event to the Supabase database
 *
 * @param supabase Supabase client instance
 * @param event Security event to log
 * @returns Success status
 */
declare function logSecurityEvent(supabase: SupabaseClient, event: SecurityEvent): Promise<boolean>;
/**
 * Predefined security event types for consistency
 */
declare const SecurityEventTypes: {
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

/**
 * Rate limiting configuration
 */
interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    message?: string;
}
declare function applyRateLimit(req: NextRequest, supabase: SupabaseClient, config: RateLimitConfig): Promise<Response | null>;
/**
 * Clean up expired rate limit records
 *
 * This should be called periodically (e.g., via a cron job) to clean up old records
 */
declare function cleanupRateLimits(supabase: SupabaseClient): Promise<void>;

/**
 * Security Testing Helpers
 *
 * This file contains utilities to help test the security features of the application.
 * DO NOT include this in production builds!
 */

/**
 * Get recent security logs for testing and development
 */
declare function getRecentSecurityLogs(platformSlug?: PlatformSlug, limit?: number): Promise<any[]>;
/**
 * Get rate limit records for testing
 */
declare function getRateLimitRecords(identifier: string, platformSlug?: PlatformSlug): Promise<any[]>;
/**
 * Generate test security logs for development and testing
 */
declare function generateTestSecurityLogs(count?: number, platformSlug?: PlatformSlug): Promise<void>;
/**
 * Clear test security logs (for cleanup)
 */
declare function clearTestSecurityLogs(platformSlug?: PlatformSlug): Promise<void>;

/**
 * Security Dashboard Component
 *
 * Displays recent security events with filtering options
 * This is an admin-only component and should be protected by authentication
 */
declare function SecurityDashboard({ platformSlug, limit }: {
    platformSlug: string;
    limit?: number;
}): react__default.JSX.Element;

interface SecurityContextType {
    csrfToken: string;
    refreshCsrfToken: () => Promise<string>;
    logSecurityEvent: (event: string, severity: 'low' | 'medium' | 'high' | 'critical', details?: Record<string, any>) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}
interface SecurityProviderProps {
    platformSlug: PlatformSlug;
    children: ReactNode;
}
/**
 * Hook to use security features
 */
declare function useSecurityProvider(): SecurityContextType;
/**
 * Security Provider Component
 *
 * Provides security context to the application
 */
declare function SecurityProvider({ platformSlug, children }: SecurityProviderProps): react__default.JSX.Element;
/**
 * CSRF Token Provider
 *
 * Higher-order component to add CSRF tokens to fetch requests automatically
 */
declare function withCsrfProtection<T extends Record<string, any>>(Component: react__default.ComponentType<T>): react__default.FC<T>;

interface AuthFormProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    loading: boolean;
    error?: string | null;
    submitted?: boolean;
    children: ReactNode;
}
declare function AuthForm({ onSubmit, loading, error, submitted, children }: AuthFormProps): react.JSX.Element;

declare function SignInForm(): react.JSX.Element;

declare function SignUpForm(): react.JSX.Element;

declare function ForgotPasswordForm(): react.JSX.Element;

declare function UpdatePasswordForm(): react.JSX.Element;

declare function ErrorPage(): react.JSX.Element;

declare function createPlatformClient(): _neothink_database.SupabaseClient<any, "public", any>;

export { AuthForm, ErrorPage, ForgotPasswordForm, SecurityDashboard, SecurityEventTypes, SecurityProvider, SignInForm, SignUpForm, UpdatePasswordForm, applyRateLimit, cleanupRateLimits, clearTestSecurityLogs, createPlatformClient, generateTestSecurityLogs, getPlatformFromHost, getRateLimitRecords, getRecentSecurityLogs, logSecurityEvent, middleware, useSecurityProvider, withCsrfProtection };
