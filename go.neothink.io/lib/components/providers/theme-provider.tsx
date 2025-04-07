'use client'

import { ThemeProvider as NextThemeProvider } from '@/lib/context/theme-context'
import { PlatformIndicator } from '@/lib/components/PlatformIndicator'

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