/**
 * Type definitions for shared models across the platform
 */

// PlatformSlug as a value for type-only import compatibility
export const PLATFORM_SLUGS_VALUES = ['hub', 'ascenders', 'neothinkers', 'immortals', 'app', 'admin'] as const;
export type PlatformSlug = typeof PLATFORM_SLUGS_VALUES[number];
export const __PlatformSlug: null = null;

/**
 * Platform identifier
 */
export const PLATFORM_SLUGS = PLATFORM_SLUGS_VALUES;

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
export type SubscriptionStatus = 
  | 'active'
  | 'trialing'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'unpaid'
  | 'paused';

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

export const ALL_PLATFORM_SLUGS = PLATFORM_SLUGS_VALUES;

// --- Security Types for Platform-wide Logging and Auditing ---

/**
 * Represents a single entry in the security log for auditing user and system actions.
 */
export interface SecurityLog {
  id: string;
  event: SecurityEventType;
  userId: string;
  timestamp: string; // ISO8601
  severity: SecurityEventSeverity;
  details?: string;
}
export const __SecurityLog: null = null;

/**
 * Enumerates the types of security events that can be logged.
 */
export type SecurityEventType =
  | 'login'
  | 'logout'
  | 'password_reset'
  | 'unauthorized_access'
  | 'user_created'
  | 'user_deleted'
  | 'role_changed'
  | 'other';
export const __SecurityEventType: null = null;

/**
 * Enumerates the severity levels for security events.
 */
export type SecurityEventSeverity = 'low' | 'medium' | 'high' | 'critical';
export const __SecurityEventSeverity: null = null;

/**
 * Represents a security event for real-time processing or notification.
 */
export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: SecurityEventSeverity;
  userId: string;
  timestamp: string; // ISO8601
  context?: Record<string, any>;
}
export const __SecurityEvent: null = null;

/**
 * Enumerates all possible security event types (array form).
 */
export const SecurityEventTypes = [
  'login',
  'logout',
  'password_reset',
  'unauthorized_access',
  'user_created',
  'user_deleted',
  'role_changed',
  'other'
] as const;
export type SecurityEventTypes = typeof SecurityEventTypes[number];
export const __SecurityEventTypes: null = null;