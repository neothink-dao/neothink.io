'use client'

import { ThemeProvider as NextThemeProvider } from '@/go.neothink.io/lib/context/theme-context'
import { PlatformIndicator } from '@/go.neothink.io/lib/components/PlatformIndicator'

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