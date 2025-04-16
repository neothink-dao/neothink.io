import { PlatformNavigationItem, PlatformSlug, NavigationContext } from '../types';
/**
 * Navigation service for cross-platform navigation
 */
export declare class NavigationService {
    /**
     * Navigate to another platform with context
     * @param platform Target platform
     * @param path Optional path within the platform
     * @param context Optional context to pass to the target platform
     */
    static navigateToPlatform(platform: PlatformSlug, path?: string, context?: NavigationContext): string;
    /**
     * Generate common navigation items for all platforms
     * @param currentPlatform Current platform
     * @returns Array of navigation items
     */
    static getCommonNavigation(currentPlatform: PlatformSlug): PlatformNavigationItem[];
    /**
     * Store the last visited location before leaving the platform
     * @param platform Current platform
     * @param path Current path
     */
    static storeLastLocation(platform: PlatformSlug, path: string): void;
    /**
     * Get the last visited location for a platform
     * @param platform Target platform
     * @returns Last visited path or null
     */
    static getLastLocation(platform: PlatformSlug): string | null;
    /**
     * Detect the current platform based on the hostname
     * @returns Current platform slug
     */
    static detectCurrentPlatform(): PlatformSlug;
    /**
     * Navigate to another platform and preserve the current user state
     * @param platform Target platform
     * @param path Optional path within the platform
     * @param preserveState Whether to preserve the current state
     */
    static navigateWithStatePreservation(platform: PlatformSlug, path?: string, preserveState?: boolean): string;
}
export default NavigationService;
//# sourceMappingURL=index.d.ts.map