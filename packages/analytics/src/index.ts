import { supabase } from '@neothink/core/database/client';
import type { Database } from '@neothink/types/supabase';
import type { 
  EventName, 
  EventProperties, 
  AnalyticsProvider,
  PageViewProperties,
  BaseEventProperties,
  Platform,
  EventCategory
} from './types';

type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Insert'];

class Analytics implements AnalyticsProvider {
  private enabled: boolean;
  private userId?: string;
  private sessionId: string;

  constructor() {
    this.enabled = process.env.NODE_ENV === 'production';
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private async trackEvent(
    name: EventName, 
    properties: EventProperties, 
    category?: EventCategory,
    detail?: Record<string, any>
  ) {
    try {
      const event: AnalyticsEvent = {
        event_name: name,
        platform: properties.platform,
        user_id: this.userId,
        properties: {
          ...properties,
          sessionId: this.sessionId,
          timestamp: new Date().toISOString()
        },
        event_category: category,
        event_detail: detail,
        timestamp: new Date()
      };

      const { error } = await supabase
        .from('analytics_events')
        .insert(event);

      if (error) throw error;
    } catch (error) {
      console.error('[Analytics] Error tracking event:', error);
    }
  }

  async track(
    name: EventName, 
    properties: EventProperties, 
    category?: EventCategory,
    detail?: Record<string, any>
  ): Promise<void> {
    if (!this.enabled) {
      console.log(`[Analytics] Event tracked (dev mode):`, { name, properties, category, detail });
      return;
    }

    await this.trackEvent(name, properties, category, detail);
  }

  async page(
    platform: Platform, 
    path: string, 
    properties: Omit<PageViewProperties, 'platform' | 'path'> = {}
  ): Promise<void> {
    const pageProperties: PageViewProperties = {
      ...properties,
      platform,
      path,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    };

    await this.track(
      'page_view', 
      pageProperties, 
      'engagement', 
      { path, timeSpent: properties.timeSpent }
    );
  }

  async identify(userId: string, traits?: Record<string, any>): Promise<void> {
    this.userId = userId;
    
    if (traits) {
      await this.track(
        'identify', 
        {
          platform: 'hub', // Default to hub for identification events
          userId,
          metadata: traits
        },
        'user',
        { traits }
      );
    }
  }

  async reset(): Promise<void> {
    this.userId = undefined;
    this.sessionId = this.generateSessionId();
  }

  // New methods for specific event tracking

  async trackFeatureUnlockAttempt(
    platform: Platform, 
    feature: string, 
    success: boolean, 
    reason?: string
  ): Promise<void> {
    await this.track(
      'feature_unlock_attempt',
      {
        platform,
        feature
      },
      'unlock',
      {
        success,
        reason,
        feature
      }
    );
  }

  async trackFeatureUnlocked(platform: Platform, feature: string): Promise<void> {
    await this.track(
      'feature_unlocked',
      {
        platform,
        feature
      },
      'unlock',
      {
        feature,
        timestamp: new Date().toISOString()
      }
    );
  }

  async trackContentInteraction(
    platform: Platform, 
    contentId: string, 
    interactionType: string,
    detail?: Record<string, any>
  ): Promise<void> {
    await this.track(
      'content_interaction',
      {
        platform,
        contentId,
        interactionType
      },
      'engagement',
      {
        contentId,
        interactionType,
        ...detail
      }
    );
  }

  async trackError(
    platform: Platform, 
    errorType: string, 
    errorMessage: string
  ): Promise<void> {
    await this.track(
      'error_occurred',
      {
        platform,
        errorType,
        errorMessage
      },
      'error',
      {
        errorType,
        errorMessage,
        url: typeof window !== 'undefined' ? window.location.href : undefined
      }
    );
  }
}

export const analytics = new Analytics();

// Re-export types
export type { 
  EventName, 
  EventProperties, 
  AnalyticsProvider,
  BaseEventProperties,
  PageViewProperties,
  Platform,
  EventCategory
} from './types';

// Export hooks and summary functionality
export * from './hooks';
export * from './summary';

// Re-export types from the types package
export { Platform, EventName };

// Helper hooks and utilities can be exported here
export * from './hooks'; 
// Helper hooks and utilities can be exported here
export * from './hooks'; 
export * from './hooks'; 
