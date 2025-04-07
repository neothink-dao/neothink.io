/**
 * Platform utilities to detect which platform the user is on
 * and load platform-specific configuration
 */

// Platform types for the Neothink ecosystem
export type PlatformSlug = 'hub' | 'ascenders' | 'neothinkers' | 'immortals';

export interface PlatformConfig {
  name: string;
  slug: PlatformSlug;
  domain: string;
  description: string;
  primaryColor: string;
  darkColor: string;
  features: string[];
}

// Default configuration for each platform
export const PLATFORM_CONFIG: Record<PlatformSlug, PlatformConfig> = {
  hub: {
    name: 'Hub',
    slug: 'hub',
    domain: 'go.neothink.io',
    description: 'Your gateway to the Neothink ecosystem',
    primaryColor: '#3b82f6',
    darkColor: '#1e40af',
    features: ['platform_overview', 'cross_platform_insights', 'user_management']
  },
  ascenders: {
    name: 'Ascenders',
    slug: 'ascenders',
    domain: 'joinascenders.org',
    description: 'Your path to greater prosperity',
    primaryColor: '#10b981',
    darkColor: '#047857',
    features: ['business_tools', 'prosperity_framework', 'wealth_strategies']
  },
  neothinkers: {
    name: 'Neothinkers',
    slug: 'neothinkers',
    domain: 'joinneothinkers.org',
    description: 'Your journey to integrated thinking',
    primaryColor: '#8b5cf6',
    darkColor: '#6d28d9',
    features: ['thought_exercises', 'concepts', 'personal_journal']
  },
  immortals: {
    name: 'Immortals',
    slug: 'immortals',
    domain: 'joinimmortals.org',
    description: 'Your path to optimal health and longevity',
    primaryColor: '#f97316',
    darkColor: '#c2410c',
    features: ['health_dashboard', 'longevity_protocols', 'biomarkers']
  }
};

/**
 * Get current platform based on environment or URL
 */
export function getCurrentPlatform(): PlatformConfig {
  // Check for environment variable override
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_PLATFORM_SLUG) {
    const slug = process.env.NEXT_PUBLIC_PLATFORM_SLUG as PlatformSlug;
    if (PLATFORM_CONFIG[slug]) {
      return PLATFORM_CONFIG[slug];
    }
  }
  
  // Check URL in browser environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Check for each platform domain
    for (const [slug, config] of Object.entries(PLATFORM_CONFIG)) {
      if (hostname.includes(config.domain) || hostname.includes(slug)) {
        return config;
      }
    }
    
    // Check for localhost development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Use path to determine platform in local development
      const path = window.location.pathname;
      
      for (const [slug, config] of Object.entries(PLATFORM_CONFIG)) {
        if (path.startsWith(`/${slug}`)) {
          return config;
        }
      }
    }
  }
  
  // Default to Hub if no match
  return PLATFORM_CONFIG.hub;
}

/**
 * Check if a feature is available on the current platform
 */
export function isPlatformFeatureAvailable(featureName: string): boolean {
  const platform = getCurrentPlatform();
  return platform.features.includes(featureName);
}

/**
 * Get platform-specific theme settings (for styling)
 */
export function getPlatformTheme() {
  const platform = getCurrentPlatform();
  
  return {
    primaryColor: platform.primaryColor,
    darkColor: platform.darkColor,
    name: platform.name,
    slug: platform.slug
  };
}

/**
 * Get URL for a different platform
 */
export function getPlatformUrl(targetPlatform: PlatformSlug, path: string = '/'): string {
  const config = PLATFORM_CONFIG[targetPlatform];
  
  // Handle development environment 
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1')) {
    return `/${targetPlatform}${path}`;
  }
  
  // Production URLs
  return `https://${config.domain}${path}`;
}

/**
 * Get tenant ID for a platform
 */
export function getPlatformTenantId(platform: PlatformSlug): string {
  const tenantIds: Record<PlatformSlug, string> = {
    hub: '2074cd50-6cf1-467d-b520-e5c6fc7a89f2',
    ascenders: 'ce2cb142-075f-40cc-ad55-652ec6ea954d',
    neothinkers: 'd2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d',
    immortals: '013bbaf8-8d72-495c-9024-71fb945b0277'
  };
  
  return tenantIds[platform];
} 