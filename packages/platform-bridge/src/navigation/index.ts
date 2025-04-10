import { PlatformNavigationItem, PlatformSlug, PLATFORM_URLS } from '../types';

/**
 * Navigation service for cross-platform navigation
 */
export class NavigationService {
  /**
   * Navigate to another platform with context
   * @param platform Target platform
   * @param path Optional path within the platform
   * @param context Optional context to pass to the target platform
   */
  static navigateToPlatform(
    platform: PlatformSlug,
    path?: string,
    context?: Record<string, any>
  ): string {
    const baseUrl = PLATFORM_URLS[platform];
    let url = baseUrl;
    
    // Append the path if provided
    if (path) {
      url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    }
    
    // Append context as query parameters if provided
    if (context && Object.keys(context).length > 0) {
      const params = new URLSearchParams();
      Object.entries(context).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          params.append(key, String(value));
        }
      });
      
      url = `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`;
    }
    
    return url;
  }
  
  /**
   * Generate common navigation items for all platforms
   * @param currentPlatform Current platform
   * @returns Array of navigation items
   */
  static getCommonNavigation(currentPlatform: PlatformSlug): PlatformNavigationItem[] {
    return [
      {
        id: 'switch-platform',
        title: 'Switch Platform',
        url: '#',
        platform: currentPlatform,
        icon: 'swap',
        children: [
          {
            id: 'hub',
            title: 'Hub',
            url: PLATFORM_URLS.hub,
            platform: 'hub',
            icon: 'hub',
            isExternal: currentPlatform !== 'hub'
          },
          {
            id: 'immortals',
            title: 'Immortals',
            url: PLATFORM_URLS.immortals,
            platform: 'immortals',
            icon: 'immortals',
            isExternal: currentPlatform !== 'immortals'
          },
          {
            id: 'ascenders',
            title: 'Ascenders',
            url: PLATFORM_URLS.ascenders,
            platform: 'ascenders',
            icon: 'ascenders',
            isExternal: currentPlatform !== 'ascenders'
          },
          {
            id: 'neothinkers',
            title: 'Neothinkers',
            url: PLATFORM_URLS.neothinkers,
            platform: 'neothinkers',
            icon: 'neothinkers',
            isExternal: currentPlatform !== 'neothinkers'
          }
        ]
      }
    ];
  }
  
  /**
   * Store the last visited location before leaving the platform
   * @param platform Current platform
   * @param path Current path
   */
  static storeLastLocation(platform: PlatformSlug, path: string): void {
    try {
      const lastLocations = JSON.parse(
        localStorage.getItem('neothink_last_locations') || '{}'
      );
      
      lastLocations[platform] = path;
      
      localStorage.setItem('neothink_last_locations', JSON.stringify(lastLocations));
    } catch (error) {
      console.error('Failed to store last location:', error);
    }
  }
  
  /**
   * Get the last visited location for a platform
   * @param platform Target platform
   * @returns Last visited path or null
   */
  static getLastLocation(platform: PlatformSlug): string | null {
    try {
      const lastLocations = JSON.parse(
        localStorage.getItem('neothink_last_locations') || '{}'
      );
      
      return lastLocations[platform] || null;
    } catch (error) {
      console.error('Failed to get last location:', error);
      return null;
    }
  }
  
  /**
   * Navigate to another platform and preserve the current user state
   * @param platform Target platform
   * @param path Optional path within the platform
   * @param preserveState Whether to preserve the current state
   */
  static navigateWithStatePreservation(
    platform: PlatformSlug,
    path?: string,
    preserveState = true
  ): string {
    // Store the current location if preserving state
    if (preserveState) {
      const currentPlatform = window.location.hostname.includes('immortals')
        ? 'immortals'
        : window.location.hostname.includes('ascenders')
        ? 'ascenders'
        : window.location.hostname.includes('neothinkers')
        ? 'neothinkers'
        : 'hub';
      
      this.storeLastLocation(currentPlatform, window.location.pathname);
    }
    
    // Get the target URL
    const url = this.navigateToPlatform(platform, path, {
      source_platform: window.location.hostname,
      preserve_state: preserveState ? '1' : '0'
    });
    
    return url;
  }
}

export default NavigationService; 