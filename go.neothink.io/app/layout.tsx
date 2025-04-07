import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '../../lib/context/theme-context'
import { PlatformIndicator } from '../../lib/components/PlatformIndicator'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

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
