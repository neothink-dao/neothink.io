import type { Metadata } from 'next'
import './globals.css'
import { ThemeProviderWrapper } from '../lib/components/providers/theme-provider'
import Navigation from '../components/Navigation'

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
        <ThemeProviderWrapper>
          <Navigation />
          <main>
            {children}
          </main>
        </ThemeProviderWrapper>
      </body>
    </html>
  )
}
