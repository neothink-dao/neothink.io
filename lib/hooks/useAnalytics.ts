import { useCallback } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from '@supabase/auth-helpers-react';
import { useTenant } from '../context/TenantContext';
import { getSiteIdFromUrl } from '../config/sites';

/**
 * Hook for tracking analytics events across all Neothink platforms
 * 
 * This hook provides an easy way to track user activities and events
 * in a consistent way across all platforms while ensuring proper
 * tenant isolation.
 */
export function useAnalytics() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const { currentTenant } = useTenant();
  
  /**
   * Track an analytics event
   */
  const trackEvent = useCallback(async (
    eventName: string,
    properties: Record<string, any> = {}
  ) => {
    if (!currentTenant) {
      console.warn('Cannot track event: No tenant selected');
      return false;
    }
    
    try {
      // Determine the platform ID from the current URL
      const platformId = typeof window !== 'undefined' 
        ? getSiteIdFromUrl(window.location.href)
        : 'unknown';
      
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_name: eventName,
          tenant_slug: currentTenant.slug,
          platform_id: platformId,
          user_id: user?.id,
          properties,
          timestamp: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error tracking analytics event:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error tracking analytics event:', error);
      return false;
    }
  }, [supabase, user, currentTenant]);
  
  /**
   * Track page views
   */
  const trackPageView = useCallback(async (
    pagePath: string,
    pageTitle: string,
    properties: Record<string, any> = {}
  ) => {
    return trackEvent('page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      ...properties
    });
  }, [trackEvent]);
  
  /**
   * Track user interactions with content
   */
  const trackContentInteraction = useCallback(async (
    contentId: string,
    contentType: string,
    interactionType: 'view' | 'like' | 'share' | 'comment' | 'complete',
    properties: Record<string, any> = {}
  ) => {
    return trackEvent('content_interaction', {
      content_id: contentId,
      content_type: contentType,
      interaction_type: interactionType,
      ...properties
    });
  }, [trackEvent]);
  
  /**
   * Track feature usage
   */
  const trackFeatureUsage = useCallback(async (
    featureName: string,
    properties: Record<string, any> = {}
  ) => {
    return trackEvent('feature_usage', {
      feature_name: featureName,
      ...properties
    });
  }, [trackEvent]);
  
  return {
    trackEvent,
    trackPageView,
    trackContentInteraction,
    trackFeatureUsage
  };
} 