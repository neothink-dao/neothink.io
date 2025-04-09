export * from './supabase';

// Platform types
export type Platform = 'hub' | 'ascenders' | 'neothinkers' | 'immortals';

// Content types
export type ContentType = 'article' | 'video' | 'course' | 'exercise' | 'quiz';

// User roles
export type UserRole = 'user' | 'admin' | 'moderator';

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

// Subscription status
export type SubscriptionStatus = 'active' | 'inactive' | 'trialing' | 'past_due' | 'canceled';

// Subscription tiers
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'lifetime'; 