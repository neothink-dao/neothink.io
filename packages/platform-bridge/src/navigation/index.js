import { PLATFORM_URLS, STORAGE_KEYS } from '../constants';
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
    static navigateToPlatform(platform, path, context) {
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
    static getCommonNavigation(currentPlatform) {
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
    static storeLastLocation(platform, path) {
        try {
            const lastLocations = JSON.parse(localStorage.getItem(STORAGE_KEYS.LAST_LOCATIONS) || '{}');
            lastLocations[platform] = path;
            localStorage.setItem(STORAGE_KEYS.LAST_LOCATIONS, JSON.stringify(lastLocations));
        }
        catch (error) {
            console.error('Failed to store last location:', error);
        }
    }
    /**
     * Get the last visited location for a platform
     * @param platform Target platform
     * @returns Last visited path or null
     */
    static getLastLocation(platform) {
        try {
            const lastLocations = JSON.parse(localStorage.getItem(STORAGE_KEYS.LAST_LOCATIONS) || '{}');
            return lastLocations[platform] || null;
        }
        catch (error) {
            console.error('Failed to get last location:', error);
            return null;
        }
    }
    /**
     * Detect the current platform based on the hostname
     * @returns Current platform slug
     */
    static detectCurrentPlatform() {
        if (typeof window === 'undefined')
            return 'hub';
        const hostname = window.location.hostname;
        if (hostname.includes('immortals'))
            return 'immortals';
        if (hostname.includes('ascenders'))
            return 'ascenders';
        if (hostname.includes('neothinkers'))
            return 'neothinkers';
        return 'hub';
    }
    /**
     * Navigate to another platform and preserve the current user state
     * @param platform Target platform
     * @param path Optional path within the platform
     * @param preserveState Whether to preserve the current state
     */
    static navigateWithStatePreservation(platform, path, preserveState = true) {
        // Store the current location if preserving state
        if (preserveState) {
            const currentPlatform = this.detectCurrentPlatform();
            this.storeLastLocation(currentPlatform, window.location.pathname);
        }
        // Get the target URL
        const url = this.navigateToPlatform(platform, path, {
            sourcePlatform: this.detectCurrentPlatform(),
            preserveState: preserveState
        });
        return url;
    }
}
export default NavigationService;
//# sourceMappingURL=index.js.map