'use client'

import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '../../lib/context/theme-context'
import { PlatformIndicator } from '../../lib/components/PlatformIndicator'

export const metadata: Metadata = {
  title: 'Neothink Hub',
  description: 'Your gateway to the Neothink ecosystem',
  generator: 'Neothink',
}

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider platformSlug="hub">
          {children}
          <PlatformIndicator />
        </ThemeProvider>
      </body>
    </html>
  )
}
