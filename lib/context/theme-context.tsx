'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlatformSlug } from '../supabase/auth-client';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  platform: PlatformSlug;
  setPlatform: (platform: PlatformSlug) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  platform = 'hub',
}: {
  children: React.ReactNode;
  platform?: PlatformSlug;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPlatform, setPlatform] = useState<PlatformSlug>(platform);

  useEffect(() => {
    // Check for system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check for stored preference
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    } else {
      setIsDarkMode(prefersDark);
    }
    
    // Apply theme
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        platform: currentPlatform,
        setPlatform,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 