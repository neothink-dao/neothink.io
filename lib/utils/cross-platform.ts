import { createClient } from '../supabase/server';
import { getSiteConfig } from '../config/sites';

/**
 * Cross-Platform Utilities
 * 
 * These utilities help manage data and functionality across multiple platforms.
 */

/**
 * Get all available platforms for a user
 */
export async function getUserPlatforms(userId: string) {
  const supabase = createClient();
  
  const { data: tenants, error } = await supabase.rpc('get_user_accessible_tenants', {
    _user_id: userId
  });
  
  if (error || !tenants) {
    console.error('Error fetching user platforms:', error);
    return [];
  }
  
  // Filter to only platform tenants (those that match site IDs)
  return tenants.filter(tenant => 
    tenant.slug === 'hub' || 
    tenant.slug === 'ascenders' || 
    tenant.slug === 'neothinkers' || 
    tenant.slug === 'immortals'
  );
}

/**
 * Check if a user has access to a specific platform
 */
export async function userHasAccessToPlatform(userId: string, platformId: string) {
  const platforms = await getUserPlatforms(userId);
  return platforms.some(platform => platform.slug === platformId);
}

/**
 * Generate platform URL for cross-platform navigation
 */
export function getPlatformUrl(
  platformId: 'hub' | 'ascenders' | 'neothinkers' | 'immortals',
  path: string = '/'
): string {
  const config = getSiteConfig(platformId);
  
  // Handle paths correctly
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Return full URL
  return `${config.baseUrl}${formattedPath}`;
}

/**
 * Get shared data relevant to all platforms
 */
export async function getSharedGlobalData() {
  const supabase = createClient();
  
  // Get global announcements
  const { data: announcements } = await supabase
    .from('global_announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  // Get maintenance notifications
  const { data: maintenanceNotices } = await supabase
    .from('maintenance_notifications')
    .select('*')
    .gte('end_time', new Date().toISOString())
    .order('start_time', { ascending: true });
  
  return {
    announcements: announcements || [],
    maintenanceNotices: maintenanceNotices || [],
    currentYear: new Date().getFullYear()
  };
}

/**
 * Share an activity across platforms
 */
export async function shareActivityAcrossPlatforms(
  userId: string,
  activityType: string,
  activityData: any,
  platforms: string[] = ['hub', 'ascenders', 'neothinkers', 'immortals']
) {
  const supabase = createClient();
  
  // Create an entry in the activity feed for each platform
  const insertData = platforms.map(platform => ({
    user_id: userId,
    activity_type: activityType,
    activity_data: activityData,
    platform: platform
  }));
  
  const { error } = await supabase
    .from('activity_feed')
    .insert(insertData);
  
  if (error) {
    console.error('Error sharing activity:', error);
    return false;
  }
  
  return true;
}

/**
 * Get platform-specific settings for a user
 */
export async function getUserPlatformSettings(userId: string, platformId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_platform_settings')
    .select('settings')
    .eq('user_id', userId)
    .eq('platform', platformId)
    .single();
  
  if (error) {
    console.error('Error fetching user platform settings:', error);
    return {};
  }
  
  return data?.settings || {};
}

/**
 * Update platform-specific settings for a user
 */
export async function updateUserPlatformSettings(
  userId: string,
  platformId: string,
  settings: Record<string, any>
) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('user_platform_settings')
    .upsert({
      user_id: userId,
      platform: platformId,
      settings: settings,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,platform'
    });
  
  if (error) {
    console.error('Error updating user platform settings:', error);
    return false;
  }
  
  return true;
} 