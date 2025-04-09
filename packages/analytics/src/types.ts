import type { Database } from '@neothink/types/supabase';

export type Platform = 'hub' | 'ascenders' | 'neothinkers' | 'immortals';

export type EventCategory = 'engagement' | 'unlock' | 'onboarding' | 'user' | 'content' | 'error';

export interface BaseEventProperties {
  platform: Platform;
  metadata?: Record<string, any>;
}

export interface PageViewProperties extends BaseEventProperties {
  path: string;
  url?: string;
  referrer?: string;
  timeSpent?: number;
}

export type EventName = 
  | 'page_view'
  | 'sign_up'
  | 'sign_in'
  | 'content_view'
  | 'content_interaction'
  | 'achievement_unlocked'
  | 'progress_updated'
  | 'profile_updated'
  | 'feedback_submitted'
  | 'feature_unlock_attempt'
  | 'feature_unlocked'
  | 'week_advanced'
  | 'error_occurred'
  | 'identify';

export type EventProperties = BaseEventProperties & {
  contentId?: string;
  achievementId?: string;
  progressValue?: number;
  userId?: string;
  feature?: string;
  weekNumber?: number;
  timeSpent?: number;
  interactionType?: 'click' | 'hover' | 'scroll' | 'view';
  errorType?: string;
  errorMessage?: string;
  category?: EventCategory;
  detail?: Record<string, any>;
};

export interface AnalyticsProvider {
  track(name: EventName, properties: EventProperties): Promise<void>;
  page(platform: Platform, path: string, properties?: Omit<PageViewProperties, 'platform' | 'path'>): Promise<void>;
  identify(userId: string, traits?: Record<string, any>): Promise<void>;
  reset(): Promise<void>;
  
  // New convenience methods for specific event types
  trackFeatureUnlockAttempt(platform: Platform, feature: string, success: boolean, reason?: string): Promise<void>;
  trackFeatureUnlocked(platform: Platform, feature: string): Promise<void>;
  trackContentInteraction(platform: Platform, contentId: string, interactionType: string, detail?: Record<string, any>): Promise<void>;
  trackError(platform: Platform, errorType: string, errorMessage: string): Promise<void>;
} 