import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { PlatformSlug } from '../supabase/auth-client';
import { sitesConfig } from '../config/sites';

/**
 * Theme colors interface for consistent styling
 */
export interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  fontFamily: string;
}

/**
 * Default theme colors
 */
const defaultColors: ThemeColors = {
  primaryColor: '#0070f3',
  secondaryColor: '#7928ca',
  accentColor: '#f5a623',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  borderRadius: '0.25rem',
  fontFamily: 'system-ui, -apple-system, sans-serif'
};

/**
 * Theme context interface
 */
interface ThemeContextType {
  colors: ThemeColors;
  platform: PlatformSlug;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setPlatform: (platform: PlatformSlug) => void;
}

/**
 * Theme context
 */
const ThemeContext = createContext<ThemeContextType>({
  colors: defaultColors,
  platform: 'hub',
  isDarkMode: false,
  toggleDarkMode: () => {},
  setPlatform: () => {},
});

/**
 * Theme provider props
 */
interface ThemeProviderProps {
  platform: PlatformSlug;
  children: ReactNode;
}

/**
 * Safe localStorage operations with SSR and error handling
 */
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('localStorage.getItem error:', e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('localStorage.setItem error:', e);
    }
  }
};

/**
 * Theme provider component
 */
export function ThemeProvider({ platform = 'hub', children }: ThemeProviderProps) {
  const [colors, setColors] = useState<ThemeColors>(sitesConfig[platform]?.colors || defaultColors);
  const [currentPlatform, setPlatform] = useState<PlatformSlug>(platform);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle component mounting and avoid hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Update colors when platform changes
  useEffect(() => {
    if (currentPlatform !== platform) {
      setPlatform(platform);
    }
    setColors(sitesConfig[platform]?.colors || defaultColors);
  }, [platform, currentPlatform]);
  
  // Check for dark mode preference
  useEffect(() => {
    if (!isMounted) return;
    
    // Check for saved preference
    const darkModePreference = safeLocalStorage.getItem('darkMode');
    if (darkModePreference !== null) {
      setIsDarkMode(darkModePreference === 'true');
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches || false;
      setIsDarkMode(prefersDark);
    }
  }, [isMounted]);
  
  // Apply dark mode class to document
  useEffect(() => {
    if (!isMounted) return;
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      safeLocalStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      safeLocalStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode, isMounted]);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Apply CSS variables for theme colors
  useEffect(() => {
    if (!isMounted) return;
    
    const root = document.documentElement;
    
    // Apply theme colors as CSS variables
    root.style.setProperty('--color-primary', colors.primaryColor);
    root.style.setProperty('--color-secondary', colors.secondaryColor);
    root.style.setProperty('--color-accent', colors.accentColor);
    root.style.setProperty('--color-background', colors.backgroundColor);
    root.style.setProperty('--color-text', colors.textColor);
    root.style.setProperty('--color-border-radius', colors.borderRadius);
    root.style.setProperty('--font-family', colors.fontFamily);
    
    // Add some derived variables
    root.style.setProperty('--color-primary-light', lightenColor(colors.primaryColor, 0.2));
    root.style.setProperty('--color-primary-dark', darkenColor(colors.primaryColor, 0.2));
  }, [colors, isMounted]);
  
  return (
    <ThemeContext.Provider value={{ colors, platform: currentPlatform, isDarkMode, toggleDarkMode, setPlatform }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use the theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Helper function to lighten a color
 */
function lightenColor(color: string, amount: number): string {
  try {
    // Convert hex to RGB
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    // Lighten
    r = Math.min(255, Math.floor(r + (255 - r) * amount));
    g = Math.min(255, Math.floor(g + (255 - g) * amount));
    b = Math.min(255, Math.floor(b + (255 - b) * amount));

    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  } catch (error) {
    return color;
  }
}

/**
 * Helper function to darken a color
 */
function darkenColor(color: string, amount: number): string {
  try {
    // Convert hex to RGB
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    // Darken
    r = Math.max(0, Math.floor(r * (1 - amount)));
    g = Math.max(0, Math.floor(g * (1 - amount)));
    b = Math.max(0, Math.floor(b * (1 - amount)));

    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  } catch (error) {
    return color;
  }
} 