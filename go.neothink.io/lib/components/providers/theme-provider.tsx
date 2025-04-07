'use client'

import { ThemeProvider as NextThemeProvider } from '../../context/theme-context'
import { PlatformIndicator } from '../PlatformIndicator'

export function ThemeProviderWrapper({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <NextThemeProvider platformSlug="hub">
      {children}
      <PlatformIndicator />
    </NextThemeProvider>
  )
} 