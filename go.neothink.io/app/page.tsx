'use client'

import { useTheme } from '../../lib/context/theme-context'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to Neothink Hub
      </h1>
      <p className="text-lg text-gray-600">
        Your central platform for all Neothink resources
      </p>
    </main>
  )
} 