export * from './supabase';

/**
 * Shared type definitions for the Neothink monorepo
 */

/**
 * Platform identifiers
 */
export type Platform = 'hub' | 'ascenders' | 'immortals' | 'neothinkers';

/**
 * Platform slug for database operations
 */
export type PlatformSlug = Platform;

/**
 * User role in the system
 */
export type UserRole = 'user' | 'admin' | 'guardian';

/**
 * User subscription status
 */
export type SubscriptionStatus = 'active' | 'inactive' | 'trial' | 'expired' | 'cancelled';

/**
 * Platform access level
 */
export type AccessLevel = 'basic' | 'premium' | 'vip';

/**
 * Platform-specific settings
 */
export interface PlatformConfig {
  name: string;
  domain: string;
  apiUrl: string;
  primaryColor: string;
  accentColor: string;
}

// Content types
export type ContentType = 'article' | 'video' | 'course' | 'exercise' | 'quiz';

// Event types for analytics
export type EventName = 
  | 'page_view'
  | 'sign_up'
  | 'sign_in'
  | 'content_view'
  | 'achievement_unlocked'
  | 'progress_updated'
  | 'profile_updated'
  | 'feedback_submitted';

// Subscription tiers
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'lifetime'; 