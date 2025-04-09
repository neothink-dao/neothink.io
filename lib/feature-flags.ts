import { createClient } from './supabase';
import { Platform } from './types';

// Feature flag interface
export interface FeatureFlags {
  events_enabled: boolean;
  advanced_gamification_enabled: boolean;
  community_forums_enabled: boolean;
  advanced_progress_tracking_enabled: boolean;
  public_profiles_enabled: boolean;
}

// Platform-specific feature flags with defaults
const defaultFeatureFlags: Record<Platform, FeatureFlags> = {
  hub: {
    events_enabled: true,
    advanced_gamification_enabled: false,
    community_forums_enabled: true,
    advanced_progress_tracking_enabled: true,
    public_profiles_enabled: false
  },
  ascenders: {
    events_enabled: true,
    advanced_gamification_enabled: false,
    community_forums_enabled: true,
    advanced_progress_tracking_enabled: true,
    public_profiles_enabled: true
  },
  neothinkers: {
    events_enabled: true,
    advanced_gamification_enabled: false,
    community_forums_enabled: true,
    advanced_progress_tracking_enabled: true,
    public_profiles_enabled: true
  },
  immortals: {
    events_enabled: true,
    advanced_gamification_enabled: false,
    community_forums_enabled: true,
    advanced_progress_tracking_enabled: true,
    public_profiles_enabled: true
  }
};

/**
 * Checks if a feature is enabled for a specific platform
 */
export function isFeatureEnabled(platform: Platform, feature: keyof FeatureFlags): boolean {
  return defaultFeatureFlags[platform][feature];
}

/**
 * Fetches all feature flags for a platform
 */
export function getFeatureFlags(platform: Platform): FeatureFlags {
  return defaultFeatureFlags[platform];
}

/**
 * Fetches feature flags from the database
 * This will override the default flags if they exist in the database
 */
export async function getFeatureFlagsFromDatabase(platform: Platform): Promise<FeatureFlags> {
  const supabase = createClient();
  
  try {
    const { data } = await supabase
      .from('platform_settings')
      .select('settings')
      .eq('platform', platform)
      .maybeSingle();
    
    if (data?.settings?.feature_flags) {
      return {
        ...defaultFeatureFlags[platform],
        ...data.settings.feature_flags
      };
    }
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    // Fall back to defaults
  }
  
  return defaultFeatureFlags[platform];
}

/**
 * Checks if a route is accessible based on feature flags
 */
export function isRouteAccessible(platform: Platform, route: string, featureFlags?: FeatureFlags): boolean {
  const flags = featureFlags || defaultFeatureFlags[platform];
  
  // Special routes that require specific features
  switch (route) {
    case 'endgame':
      return flags.advanced_gamification_enabled;
    default:
      return true;
  }
}

/**
 * Updates feature flags in the database
 * Admin only function
 */
export async function updateFeatureFlags(
  platform: Platform,
  featureFlags: Partial<FeatureFlags>
): Promise<void> {
  const supabase = createClient();
  
  // Get current settings
  const { data: currentSettings } = await supabase
    .from('platform_settings')
    .select('settings')
    .eq('platform', platform)
    .maybeSingle();
  
  const newSettings = {
    ...(currentSettings?.settings || {}),
    feature_flags: {
      ...(currentSettings?.settings?.feature_flags || defaultFeatureFlags[platform]),
      ...featureFlags
    }
  };
  
  // Update settings
  const { error } = await supabase
    .from('platform_settings')
    .upsert({
      platform,
      settings: newSettings
    })
    .select();
  
  if (error) {
    console.error('Error updating feature flags:', error);
    throw error;
  }
} 