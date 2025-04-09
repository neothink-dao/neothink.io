import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './client';
import type { Database } from '@neothink/types';

export type PlatformSlug = 'hub' | 'ascenders' | 'neothinkers' | 'immortals';

/**
 * Check if a user has access to a specific platform
 */
export async function hasPlatformAccess(
  platformSlug: PlatformSlug,
  userId?: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('has_platform_access', {
      platform_slug_param: platformSlug,
    });

    if (error) {
      console.error('Platform access check error:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Platform access check error:', error);
    return false;
  }
}

/**
 * Grant platform access to a user
 */
export async function grantPlatformAccess(
  userId: string,
  platformSlug: PlatformSlug
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('platform_access')
      .upsert({ 
        user_id: userId, 
        platform_slug: platformSlug 
      });

    if (error) {
      console.error('Error granting platform access:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error granting platform access:', error);
    return false;
  }
}

/**
 * Revoke platform access from a user
 */
export async function revokePlatformAccess(
  userId: string,
  platformSlug: PlatformSlug
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('platform_access')
      .delete()
      .match({ 
        user_id: userId, 
        platform_slug: platformSlug 
      });

    if (error) {
      console.error('Error revoking platform access:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error revoking platform access:', error);
    return false;
  }
}

/**
 * Get a user's platform-specific profile
 */
export async function getPlatformProfile<T extends PlatformSlug>(
  platformSlug: T,
  userId?: string
): Promise<Database['public']['Tables'][`${T}_profiles`]['Row'] | null> {
  const uid = userId || (await supabase.auth.getUser()).data.user?.id;
  
  if (!uid) return null;

  try {
    const { data, error } = await supabase
      .from(`${platformSlug}_profiles`)
      .select('*')
      .eq('user_id', uid)
      .single();

    if (error) {
      console.error(`Error fetching ${platformSlug} profile:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching ${platformSlug} profile:`, error);
    return null;
  }
}

/**
 * Create or update a user's platform-specific profile
 */
export async function upsertPlatformProfile<T extends PlatformSlug>(
  platformSlug: T,
  profile: Partial<Database['public']['Tables'][`${T}_profiles`]['Insert']>,
  userId?: string
): Promise<Database['public']['Tables'][`${T}_profiles`]['Row'] | null> {
  const uid = userId || (await supabase.auth.getUser()).data.user?.id;
  
  if (!uid) return null;
  
  try {
    const { data, error } = await supabase
      .from(`${platformSlug}_profiles`)
      .upsert({ 
        ...profile,
        user_id: uid,
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) {
      console.error(`Error upserting ${platformSlug} profile:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error upserting ${platformSlug} profile:`, error);
    return null;
  }
}

/**
 * Track an analytics event for a specific platform
 */
export async function trackPlatformEvent(
  platform: PlatformSlug,
  eventName: string,
  properties: Record<string, any> = {},
  userId?: string
): Promise<boolean> {
  const uid = userId || (await supabase.auth.getUser()).data.user?.id;
  
  try {
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: uid,
        platform,
        event_name: eventName,
        properties
      });

    if (error) {
      console.error('Error tracking platform event:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error tracking platform event:', error);
    return false;
  }
}

/**
 * Platform database operations by platform slug
 */
export const platformDb = {
  hub: createPlatformDbClient('hub'),
  ascenders: createPlatformDbClient('ascenders'),
  neothinkers: createPlatformDbClient('neothinkers'),
  immortals: createPlatformDbClient('immortals')
};

/**
 * Create a platform-specific database client helper
 */
function createPlatformDbClient(platform: PlatformSlug) {
  return {
    /**
     * Get the platform-specific profile for the current user
     */
    getProfile: (userId?: string) => getPlatformProfile(platform, userId),
    
    /**
     * Create or update the platform-specific profile
     */
    upsertProfile: <T extends Database['public']['Tables'][`${typeof platform}_profiles`]['Insert']>(
      profile: Partial<T>,
      userId?: string
    ) => upsertPlatformProfile(platform, profile, userId),
    
    /**
     * Track an analytics event for this platform
     */
    trackEvent: (
      eventName: string,
      properties: Record<string, any> = {},
      userId?: string
    ) => trackPlatformEvent(platform, eventName, properties, userId),
    
    /**
     * Check if the current user has access to this platform
     */
    hasAccess: (userId?: string) => hasPlatformAccess(platform, userId),
    
    /**
     * Grant access to this platform for a user
     */
    grantAccess: (userId: string) => grantPlatformAccess(userId, platform),
    
    /**
     * Revoke access to this platform for a user
     */
    revokeAccess: (userId: string) => revokePlatformAccess(userId, platform)
  };
} 