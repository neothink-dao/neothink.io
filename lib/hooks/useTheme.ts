import { useState, useEffect } from 'react';

// Define the theme colors for each platform
const platformThemes = {
  hub: {
    primary: '#71717a', // zinc-500
    primaryLight: '#d4d4d8', // zinc-300
    primaryDark: '#3f3f46', // zinc-700
    secondary: '#f59e0b', // amber-500
    secondaryLight: '#fcd34d', // amber-300
    secondaryDark: '#d97706', // amber-600
    accent: '#ea580c', // orange transitioning to red
    accentLight: '#fdba74', // orange-300
    accentDark: '#dc2626', // red-600
    background: '#fafafa', // zinc-50 for light mode
    foreground: '#27272a', // zinc-800 for light mode
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  ascenders: {
    primary: '#71717a', // zinc-500
    primaryLight: '#d4d4d8', // zinc-300
    primaryDark: '#3f3f46', // zinc-700
    secondary: '#f97316', // orange-500
    secondaryLight: '#fdba74', // orange-300
    secondaryDark: '#c2410c', // orange-700
    accent: '#fb923c', // orange-400
    accentLight: '#fed7aa', // orange-200
    accentDark: '#ea580c', // orange-600
    background: '#fafafa', // zinc-50 for light mode
    foreground: '#27272a', // zinc-800 for light mode
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  neothinkers: {
    primary: '#71717a', // zinc-500
    primaryLight: '#d4d4d8', // zinc-300
    primaryDark: '#3f3f46', // zinc-700
    secondary: '#f59e0b', // amber-500
    secondaryLight: '#fcd34d', // amber-300
    secondaryDark: '#b45309', // amber-700
    accent: '#fbbf24', // amber-400
    accentLight: '#fde68a', // amber-200
    accentDark: '#d97706', // amber-600
    background: '#fafafa', // zinc-50 for light mode
    foreground: '#27272a', // zinc-800 for light mode
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  immortals: {
    primary: '#71717a', // zinc-500
    primaryLight: '#d4d4d8', // zinc-300
    primaryDark: '#3f3f46', // zinc-700
    secondary: '#ef4444', // red-500
    secondaryLight: '#fca5a5', // red-300
    secondaryDark: '#b91c1c', // red-700
    accent: '#f87171', // red-400
    accentLight: '#fecaca', // red-200
    accentDark: '#dc2626', // red-600
    background: '#fafafa', // zinc-50 for light mode
    foreground: '#27272a', // zinc-800 for light mode
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  }
};

// Font configurations for each platform
const platformFonts = {
  hub: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
    monospace: "'Roboto Mono', monospace"
  },
  ascenders: {
    heading: "'Montserrat', sans-serif",
    body: "'Open Sans', sans-serif",
    monospace: "'Roboto Mono', monospace"
  },
  neothinkers: {
    heading: "'Poppins', sans-serif",
    body: "'Roboto', sans-serif",
    monospace: "'Roboto Mono', monospace"
  },
  immortals: {
    heading: "'Raleway', sans-serif",
    body: "'Lato', sans-serif",
    monospace: "'Roboto Mono', monospace"
  }
};

// Button styles for each platform
const platformButtons = {
  hub: {
    rounded: 'rounded-md',
    transition: 'transition-all duration-200'
  },
  ascenders: {
    rounded: 'rounded-lg',
    transition: 'transition-all duration-200'
  },
  neothinkers: {
    rounded: 'rounded-md',
    transition: 'transition-all duration-300'
  },
  immortals: {
    rounded: 'rounded-full',
    transition: 'transition-all duration-200'
  }
};

// Layout preferences for each platform
const platformLayouts = {
  hub: {
    contentMaxWidth: 'max-w-7xl',
    sidebarWidth: '280px'
  },
  ascenders: {
    contentMaxWidth: 'max-w-6xl',
    sidebarWidth: '260px'
  },
  neothinkers: {
    contentMaxWidth: 'max-w-5xl',
    sidebarWidth: '240px'
  },
  immortals: {
    contentMaxWidth: 'max-w-6xl',
    sidebarWidth: '250px'
  }
};

/**
 * Hook to access platform-specific theme variables
 */
export function useTheme() {
  // Default to hub theme
  const [platform, setPlatform] = useState<string>('hub');
  
  useEffect(() => {
    // Get the platform slug from environment variable
    const platformSlug = 
      process.env.NEXT_PUBLIC_PLATFORM_SLUG ||
      // Fallback to trying to detect from hostname
      (typeof window !== 'undefined' ? 
        window.location.hostname.split('.')[0] === 'go' ? 'hub' :
        window.location.hostname.includes('ascenders') ? 'ascenders' :
        window.location.hostname.includes('neothinkers') ? 'neothinkers' :
        window.location.hostname.includes('immortals') ? 'immortals' : 'hub'
        : 'hub');
    
    // Make sure it's a valid platform, default to hub if not
    const validPlatform = ['hub', 'ascenders', 'neothinkers', 'immortals'].includes(platformSlug) 
      ? platformSlug 
      : 'hub';
    
    setPlatform(validPlatform);
    
    // Add platform-specific CSS variables to root
    const root = document.documentElement;
    const colors = platformThemes[validPlatform as keyof typeof platformThemes];
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Add platform class to body for CSS targeting
    document.body.classList.add(`platform-${validPlatform}`);
    
    return () => {
      document.body.classList.remove(`platform-${validPlatform}`);
    };
  }, []);
  
  // Get the theme objects for the current platform
  const colors = platformThemes[platform as keyof typeof platformThemes];
  const fonts = platformFonts[platform as keyof typeof platformFonts];
  const buttons = platformButtons[platform as keyof typeof platformButtons];
  const layouts = platformLayouts[platform as keyof typeof platformLayouts];
  
  return {
    platform,
    colors,
    fonts,
    buttons,
    layouts
  };
} 