import { getSiteConfig } from '../config/sites';

/**
 * Deep Linking System for Neothink Platforms
 * 
 * This module provides utilities for creating deep links between
 * different Neothink platforms, enabling seamless cross-platform
 * navigation while preserving context.
 */

/**
 * Platform IDs
 */
export type PlatformId = 'hub' | 'ascenders' | 'neothinkers' | 'immortals';

/**
 * Standard routes available across all platforms
 */
export type StandardRoute = 
  | 'dashboard' 
  | 'profile' 
  | 'settings' 
  | 'community';

/**
 * Route configuration for deep linking
 */
export interface RouteConfig {
  platform: PlatformId;
  route: string;
  params?: Record<string, string>;
  preserveQuery?: boolean;
}

/**
 * Generate a deep link URL to navigate between platforms
 */
export function generateDeepLink(config: RouteConfig): string {
  const siteConfig = getSiteConfig(config.platform);
  const baseUrl = siteConfig.baseUrl;
  
  // Handle path correctly
  let path = config.route.startsWith('/') ? config.route : `/${config.route}`;
  
  // Add params if provided
  if (config.params && Object.keys(config.params).length > 0) {
    const paramPairs = Object.entries(config.params).map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    });
    
    path += path.includes('?') ? '&' : '?';
    path += paramPairs.join('&');
  }
  
  // Add special query param for cross-platform tracking
  path += path.includes('?') ? '&' : '?';
  path += `source=cross_platform`;
  
  // Construct the full URL
  return `${baseUrl}${path}`;
}

/**
 * Generate a deep link to a user's profile on any platform
 */
export function getUserProfileDeepLink(platformId: PlatformId, userId: string): string {
  return generateDeepLink({
    platform: platformId,
    route: '/profile',
    params: { id: userId }
  });
}

/**
 * Generate a deep link to a specific content module on any platform
 */
export function getContentDeepLink(platformId: PlatformId, contentId: string, contentType: string = 'module'): string {
  const routes: Record<string, string> = {
    module: '/modules',
    course: '/courses',
    lesson: '/lessons',
    resource: '/resources'
  };
  
  const route = routes[contentType] || '/content';
  
  return generateDeepLink({
    platform: platformId,
    route: `${route}/${contentId}`
  });
}

/**
 * Generate a deep link to a standard route on any platform
 */
export function getStandardRouteDeepLink(platformId: PlatformId, standardRoute: StandardRoute): string {
  // Map standard routes to platform-specific paths if needed
  const routeMap: Record<StandardRoute, Record<PlatformId, string>> = {
    dashboard: {
      hub: '/dashboard',
      ascenders: '/dashboard',
      neothinkers: '/dashboard',
      immortals: '/dashboard'
    },
    profile: {
      hub: '/profile',
      ascenders: '/profile',
      neothinkers: '/profile',
      immortals: '/profile'
    },
    settings: {
      hub: '/settings',
      ascenders: '/settings',
      neothinkers: '/settings',
      immortals: '/settings'
    },
    community: {
      hub: '/community',
      ascenders: '/community',
      neothinkers: '/think-tank',
      immortals: '/community'
    }
  };
  
  const route = routeMap[standardRoute][platformId];
  
  return generateDeepLink({
    platform: platformId,
    route
  });
}

/**
 * Parse deep link parameters from the current URL
 */
export function parseDeepLinkParams(url: string): {
  sourcePlatform?: PlatformId;
  sourceRoute?: string;
  [key: string]: string | undefined;
} {
  try {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};
    
    // Extract all query parameters
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    // Extract special cross-platform parameters
    const sourcePlatform = params['source_platform'] as PlatformId | undefined;
    const sourceRoute = params['source_route'];
    
    return {
      ...params,
      sourcePlatform,
      sourceRoute
    };
  } catch (error) {
    console.error('Error parsing deep link params:', error);
    return {};
  }
} 