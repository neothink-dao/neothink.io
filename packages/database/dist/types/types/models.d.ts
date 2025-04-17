/**
 * Type definitions for shared models across the platform
 */
export declare const PLATFORM_SLUGS_VALUES: readonly ["hub", "ascenders", "neothinkers", "immortals", "app", "admin"];
export type PlatformSlug = typeof PLATFORM_SLUGS_VALUES[number];
export declare const __PlatformSlug: null;
/**
 * Platform identifier
 */
export declare const PLATFORM_SLUGS: readonly ["hub", "ascenders", "neothinkers", "immortals", "app", "admin"];
/**
 * User profile with platform access information
 */
export interface UserProfile {
    id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
    platforms?: string[];
    is_admin?: boolean;
    is_ascender?: boolean;
    is_neothinker?: boolean;
    is_immortal?: boolean;
}
/**
 * Common error structure
 */
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
}
/**
 * Database query parameters
 */
export interface QueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filter?: Record<string, any>;
}
/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}
/**
 * Authentication state
 */
export interface AuthState {
    user: any | null;
    session: any | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: Error | null;
}
/**
 * Platform access information
 */
export interface PlatformAccess {
    platformSlug: PlatformSlug;
    hasAccess: boolean;
    accessLevel?: 'member' | 'subscriber' | 'pro' | 'admin';
    validUntil?: string;
}
/**
 * User subscription status
 */
export type SubscriptionStatus = 'active' | 'trialing' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid' | 'paused';
/**
 * Subscription plan
 */
export interface SubscriptionPlan {
    id: string;
    name: string;
    description?: string;
    price: number;
    interval: 'month' | 'year';
    currency: string;
    features: string[];
}
/**
 * User subscription
 */
export interface UserSubscription {
    id: string;
    user_id: string;
    status: SubscriptionStatus;
    platform: PlatformSlug;
    plan_id: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    created_at: string;
    updated_at: string;
}
export declare const ALL_PLATFORM_SLUGS: readonly ["hub", "ascenders", "neothinkers", "immortals", "app", "admin"];
/**
 * Represents a single entry in the security log for auditing user and system actions.
 */
export interface SecurityLog {
    id: string;
    event: SecurityEventType;
    userId: string;
    timestamp: string;
    severity: SecurityEventSeverity;
    details?: string;
}
export declare const __SecurityLog: null;
/**
 * Enumerates the types of security events that can be logged.
 */
export type SecurityEventType = 'login' | 'logout' | 'password_reset' | 'unauthorized_access' | 'user_created' | 'user_deleted' | 'role_changed' | 'other';
export declare const __SecurityEventType: null;
/**
 * Enumerates the severity levels for security events.
 */
export type SecurityEventSeverity = 'low' | 'medium' | 'high' | 'critical';
export declare const __SecurityEventSeverity: null;
/**
 * Represents a security event for real-time processing or notification.
 */
export interface SecurityEvent {
    id: string;
    type: SecurityEventType;
    severity: SecurityEventSeverity;
    userId: string;
    timestamp: string;
    context?: Record<string, any>;
}
export declare const __SecurityEvent: null;
/**
 * Enumerates all possible security event types (array form).
 */
export declare const SecurityEventTypes: readonly ["login", "logout", "password_reset", "unauthorized_access", "user_created", "user_deleted", "role_changed", "other"];
export type SecurityEventTypes = typeof SecurityEventTypes[number];
export declare const __SecurityEventTypes: null;
