'use client'

import { createContext, useContext, ReactNode } from 'react'
import { ThemeConfig, platformThemes } from 'lib/config/themes'
import { PlatformSlug } from 'lib/types/platform'

interface ThemeContextType {
  theme: ThemeConfig
  platformSlug: PlatformSlug
}

const ThemeContext = createContext<ThemeContextType | null>(null)

interface ThemeProviderProps {
  children: ReactNode
  platformSlug: PlatformSlug
}

export function ThemeProvider({ children, platformSlug }: ThemeProviderProps) {
  const theme = platformThemes[platformSlug]

  return (
    <ThemeContext.Provider value={{ theme, platformSlug }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Hook to get specific theme values
export function useThemeValue(key: keyof ThemeConfig) {
  const { theme } = useTheme()
  return theme[key]
} 