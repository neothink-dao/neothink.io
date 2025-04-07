import { platformThemes, sacredGradients, PlatformTheme } from './tokens/colors';
import { PHI, spacing } from './tokens/spacing';
import { geometry } from './tokens/geometry';

/**
 * Theme utilities for applying platform-specific styles
 * based on sacred geometry principles
 */

/**
 * Get platform-specific neutral and background colors
 * @param platform - The platform to get colors for
 */
export const getBaseColors = (platform: PlatformTheme) => {
  const theme = platformThemes[platform];
  
  return {
    // Neutral colors (zinc)
    neutral: theme.neutral,
    
    // Background and text colors (common zinc base)
    background: theme.background,
    foreground: theme.foreground,
    muted: theme.muted,
    mutedForeground: theme.mutedForeground,
  };
};

/**
 * Get platform-specific accent colors
 * @param platform - The platform to get accent for
 */
export const getAccentColor = (platform: PlatformTheme) => {
  if (platform === 'hub') {
    return platformThemes.hub.accent.gradient;
  } else if (platform === 'ascenders') {
    return platformThemes.ascenders.accent;
  } else if (platform === 'neothinkers') {
    return platformThemes.neothinkers.accent;
  } else {
    return platformThemes.immortals.accent;
  }
};

/**
 * Get platform-specific gradient
 * @param platform - The platform to get gradient for
 */
export const getGradient = (platform: PlatformTheme) => {
  switch (platform) {
    case 'hub':
      return sacredGradients.hubGradient;
    case 'ascenders':
      return sacredGradients.ascendersGradient();
    case 'neothinkers':
      return sacredGradients.neothinkersGradient();
    case 'immortals':
      return sacredGradients.immortalsGradient();
    default:
      return sacredGradients.hubGradient;
  }
};

/**
 * Platform-specific border radius based on sacred geometry
 * @param platform - The platform to get border radius for
 */
export const getPlatformBorderRadius = (platform: PlatformTheme) => {
  // Different platforms use different border radii based on sacred geometry
  switch (platform) {
    case 'ascenders':
      return {
        sm: geometry.shapes.borderRadius.phi9,    // Subtle (6.18%)
        md: geometry.shapes.borderRadius.phi6,    // Medium (16.18%)
        lg: geometry.shapes.borderRadius.phi3,    // Prominent (38.2%)
        xl: geometry.shapes.borderRadius.golden,  // Major (61.8%)
      };
    case 'neothinkers':
      return {
        sm: geometry.shapes.borderRadius.phi6,    // Subtle (16.18%)
        md: geometry.shapes.borderRadius.phi3,    // Medium (38.2%)
        lg: geometry.shapes.borderRadius.golden,  // Prominent (61.8%)
        xl: geometry.shapes.borderRadius.spherical, // Full circle (100%)
      };
    case 'immortals':
      return {
        sm: geometry.shapes.borderRadius.golden,  // All elements use more
        md: geometry.shapes.borderRadius.golden,  // rounded corners to represent
        lg: geometry.shapes.borderRadius.circle,  // spiritual/circular nature
        xl: geometry.shapes.borderRadius.spherical, // Full circle (100%)
      };
    case 'hub':
      return {
        sm: geometry.shapes.borderRadius.phi9,    // Subtle (6.18%)
        md: geometry.shapes.borderRadius.phi6,    // Medium (16.18%)
        lg: geometry.shapes.borderRadius.phi3,    // Prominent (38.2%)
        xl: geometry.shapes.borderRadius.golden,  // Major (61.8%)
      };
    default:
      return {
        sm: geometry.shapes.borderRadius.phi6,    // Default
        md: geometry.shapes.borderRadius.phi3,    // uses golden ratio
        lg: geometry.shapes.borderRadius.golden,  // derived values
        xl: geometry.shapes.borderRadius.circle,  // and circle
      };
  }
};

/**
 * Platform-specific spacing scale based on sacred patterns
 * @param platform - The platform to get spacing for
 */
export const getPlatformSpacing = (platform: PlatformTheme) => {
  // Base spacing is the same for all platforms (3, 6, 9 pattern)
  // But we can emphasize different aspects for different platforms
  
  const baseSpacing = spacing;
  
  switch (platform) {
    case 'ascenders':
      // Ascenders emphasizes multiples of 3
      return {
        ...baseSpacing,
        section: spacing['27'],    // 3³
        container: spacing['81'],  // (3⁴)
        containerGap: spacing['9'], // 3²
      };
    case 'neothinkers':
      // Neothinkers emphasizes fibonacci numbers
      return {
        ...baseSpacing,
        section: spacing['55'],     // Fibonacci
        container: spacing['89'],   // Fibonacci
        containerGap: spacing['21'], // Fibonacci
      };
    case 'immortals':
      // Immortals emphasizes multiples of 9
      return {
        ...baseSpacing,
        section: spacing['36'],    // 4 × 9
        container: spacing['99'],  // 11 × 9
        containerGap: spacing['18'], // 2 × 9
      };
    case 'hub':
      // Hub uses golden ratio derived values
      return {
        ...baseSpacing,
        section: spacing['63'],    // ~39 × φ
        container: spacing['102'], // ~63 × φ
        containerGap: spacing['24'], // ~15 × φ
      };
    default:
      return {
        ...baseSpacing,
        section: spacing['63'],
        container: spacing['102'],
        containerGap: spacing['24'],
      };
  }
};

/**
 * Generate platform-specific CSS variables
 * @param platform - The platform to generate variables for
 */
export const getPlatformCSSVariables = (platform: PlatformTheme) => {
  const borderRadius = getPlatformBorderRadius(platform);
  
  // Get the main accent color for each platform
  const accentColor = platform === 'hub' 
    ? platformThemes.hub.accent.gradient.via 
    : platform === 'ascenders' 
      ? platformThemes.ascenders.accent[500]
      : platform === 'neothinkers'
        ? platformThemes.neothinkers.accent[500]
        : platformThemes.immortals.accent[500];
  
  // Get the lighter accent color for each platform
  const accentLightColor = platform === 'hub'
    ? platformThemes.hub.accent.gradient.from
    : platform === 'ascenders'
      ? platformThemes.ascenders.accent[400]
      : platform === 'neothinkers'
        ? platformThemes.neothinkers.accent[400]
        : platformThemes.immortals.accent[400];
  
  // Get the darker accent color for each platform
  const accentDarkColor = platform === 'hub'
    ? platformThemes.hub.accent.gradient.to
    : platform === 'ascenders'
      ? platformThemes.ascenders.accent[600]
      : platform === 'neothinkers'
        ? platformThemes.neothinkers.accent[600]
        : platformThemes.immortals.accent[600];
  
  return {
    // Color variables
    '--color-accent': accentColor,
    '--color-accent-light': accentLightColor,
    '--color-accent-dark': accentDarkColor,
    
    // Border radius variables
    '--radius-sm': borderRadius.sm,
    '--radius-md': borderRadius.md,
    '--radius-lg': borderRadius.lg,
    '--radius-xl': borderRadius.xl,
    
    // Sacred geometry constants
    '--phi': String(PHI),
    '--phi-inverse': String(1 / PHI),
    '--golden-angle': '137.5deg',
    
    // Platform gradient
    '--gradient-accent': getGradient(platform),
  };
};

/**
 * Get tailwind classes for a specific platform
 * @param platform - The platform to get classes for
 */
export const getPlatformClasses = (platform: PlatformTheme) => {
  // Base classes common to all platforms
  const baseClasses = 'text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950';
  
  // Platform-specific accent classes
  const accentClasses = {
    hub: 'accent-orange-500 selection:bg-orange-500/20',
    ascenders: 'accent-orange-500 selection:bg-orange-500/20',
    neothinkers: 'accent-amber-500 selection:bg-amber-500/20',
    immortals: 'accent-red-500 selection:bg-red-500/20',
  };
  
  // Platform-specific spacing/layout classes using sacred geometry values
  const layoutClasses = {
    hub: 'golden-container gap-6',
    ascenders: 'container-9 gap-9',
    neothinkers: 'golden-container gap-fibonacci',
    immortals: 'container-9 gap-9',
  };
  
  return `${baseClasses} ${accentClasses[platform]} ${layoutClasses[platform]}`;
}; 