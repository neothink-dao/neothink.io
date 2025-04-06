/**
 * Cross-Platform Analytics Service
 * 
 * This service provides unified analytics tracking across all Neothink platforms.
 * It handles both platform-specific and cross-platform events, with proper tenant isolation.
 */

import { createClient } from '../supabase/server';

export type AnalyticsEvent = {
  event_name: string;
  tenant_slug: string; 
  platform_id: string;
  user_id?: string;
  properties?: Record<string, any>;
  timestamp?: string;
};

/**
 * Track an analytics event in the system
 */
export async function trackEvent(event: AnalyticsEvent): Promise<boolean> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        event_name: event.event_name,
        tenant_slug: event.tenant_slug,
        platform_id: event.platform_id,
        user_id: event.user_id,
        properties: event.properties || {},
        timestamp: event.timestamp || new Date().toISOString()
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
}

/**
 * Get platform analytics over a time period
 */
export async function getPlatformAnalytics(
  platformId: string,
  startDate: string,
  endDate: string,
  eventNames?: string[]
): Promise<any> {
  const supabase = createClient();
  
  try {
    let query = supabase
      .from('analytics_events')
      .select('*')
      .eq('platform_id', platformId)
      .gte('timestamp', startDate)
      .lte('timestamp', endDate);
    
    if (eventNames && eventNames.length > 0) {
      query = query.in('event_name', eventNames);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error getting platform analytics:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting platform analytics:', error);
    return null;
  }
}

/**
 * Get tenant analytics over a time period
 */
export async function getTenantAnalytics(
  tenantSlug: string,
  startDate: string,
  endDate: string,
  eventNames?: string[]
): Promise<any> {
  const supabase = createClient();
  
  try {
    let query = supabase
      .from('analytics_events')
      .select('*')
      .eq('tenant_slug', tenantSlug)
      .gte('timestamp', startDate)
      .lte('timestamp', endDate);
    
    if (eventNames && eventNames.length > 0) {
      query = query.in('event_name', eventNames);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error getting tenant analytics:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting tenant analytics:', error);
    return null;
  }
}

/**
 * Get user analytics over a time period
 */
export async function getUserAnalytics(
  userId: string,
  startDate: string,
  endDate: string,
  platformId?: string,
  tenantSlug?: string
): Promise<any> {
  const supabase = createClient();
  
  try {
    let query = supabase
      .from('analytics_events')
      .select('*')
      .eq('user_id', userId)
      .gte('timestamp', startDate)
      .lte('timestamp', endDate);
    
    if (platformId) {
      query = query.eq('platform_id', platformId);
    }
    
    if (tenantSlug) {
      query = query.eq('tenant_slug', tenantSlug);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error getting user analytics:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting user analytics:', error);
    return null;
  }
}

/**
 * Get real-time active users count
 */
export async function getActiveUserCount(
  platformId?: string,
  tenantSlug?: string,
  timeframeMinutes: number = 15
): Promise<number> {
  const supabase = createClient();
  
  try {
    // Calculate the timestamp for N minutes ago
    const minutesAgo = new Date();
    minutesAgo.setMinutes(minutesAgo.getMinutes() - timeframeMinutes);
    
    let query = supabase
      .from('analytics_events')
      .select('user_id', { count: 'exact', head: true })
      .gte('timestamp', minutesAgo.toISOString());
    
    if (platformId) {
      query = query.eq('platform_id', platformId);
    }
    
    if (tenantSlug) {
      query = query.eq('tenant_slug', tenantSlug);
    }
    
    const { count, error } = await query;
    
    if (error) {
      console.error('Error getting active user count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error getting active user count:', error);
    return 0;
  }
} 