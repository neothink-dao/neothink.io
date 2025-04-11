import { type Platform } from '@neothink/types'
import { useUser } from '@neothink/auth'
import { Sidebar } from '../navigation/sidebar'
import { TopNav } from '../navigation/top-nav'

interface AuthenticatedLayoutProps {
  platform: Platform
  children: React.ReactNode
}

const platformConfig = {
  ascenders: {
    name: 'Ascenders',
    description: 'Elevate your consciousness',
    primaryColor: 'bg-blue-600',
  },
  neothinkers: {
    name: 'Neothinkers',
    description: 'Expand your mind',
    primaryColor: 'bg-emerald-600',
  },
  immortals: {
    name: 'Immortals',
    description: 'Transcend limitations',
    primaryColor: 'bg-purple-600',
  },
  hub: {
    name: 'Hub',
    description: 'Your central dashboard',
    primaryColor: 'bg-gray-600',
  },
} as const

export function AuthenticatedLayout({
  platform,
  children,
}: AuthenticatedLayoutProps) {
  const { user } = useUser()
  const config = platformConfig[platform]

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar platform={platform} />
      <div className="lg:pl-72">
        <TopNav
          platform={platform}
          user={user}
          platformName={config.name}
          platformColor={config.primaryColor}
        />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 