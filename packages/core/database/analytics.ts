import { supabase } from './client';
import type { PlatformSlug } from './platform';
import type { Database } from '@neothink/types';

type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Insert'];

/**
 * Track an analytics event for a specific platform
 */
export async function trackEvent(
  eventName: string,
  platform: PlatformSlug,
  properties: Record<string, any> = {},
  userId?: string
): Promise<void> {
  try {
    const currentUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    
    if (!currentUserId) {
      console.warn('Cannot track event: No user ID available');
      return;
    }

    const { error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: currentUserId,
        platform,
        event_name: eventName,
        properties
      });

    if (error) {
      console.error('Failed to track event:', error);
    }
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

/**
 * Get analytics events for a user
 */
export async function getUserEvents(
  userId?: string,
  platform?: PlatformSlug,
  limit = 100
) {
  try {
    const currentUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    
    if (!currentUserId) {
      return { data: null, error: new Error('No user ID available') };
    }

    let query = supabase
      .from('analytics_events')
      .select('*')
      .eq('user_id', currentUserId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (platform) {
      query = query.eq('platform', platform);
    }

    return await query;
  } catch (error) {
    console.error('Error fetching user events:', error);
    return { data: null, error };
  }
}

/**
 * Get analytics events for a specific platform
 */
export async function getEvents(
  platform: PlatformSlug,
  userId?: string,
  limit = 50
) {
  try {
    let query = supabase
      .from('analytics_events')
      .select('*')
      .eq('platform', platform)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Failed to get events:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get events:', error);
    return [];
  }
}

/**
 * Get analytics events for a specific user
 */
export async function getUserAnalyticsEvents(
  userId: string,
  platform?: PlatformSlug,
  limit: number = 100
) {
  let query = supabase
    .from('analytics_events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (platform) {
    query = query.eq('platform', platform);
  }

  return await query;
} 