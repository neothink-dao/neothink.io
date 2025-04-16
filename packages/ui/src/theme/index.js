/**
 * Theme exports for the UI package
 */
// Re-export all token exports
export { default as tokens } from './tokens';
export * from './tokens';
// Export platform-specific utilities
import { tokens } from './tokens';
/**
 * Get colors for a specific platform
 * @param platform Platform identifier
 * @returns Color theme object for the platform
 */
export function getPlatformColors(platform) {
    return tokens.colors.platform[platform];
}
/**
 * Get a complete theme configuration for a platform
 * @param platform Platform identifier
 * @returns Complete theme object for the platform
 */
export function getPlatformTheme(platform) {
    return {
        colors: tokens.colors.platform[platform],
        spacing: tokens.spacing,
        typography: tokens.typography,
        borderRadius: tokens.borderRadius,
        shadows: tokens.shadows,
        animation: tokens.animation,
        zIndex: tokens.zIndex,
    };
}
//# sourceMappingURL=index.js.map