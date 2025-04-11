import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  label: string
  icon?: ReactNode
}

interface PlatformNavConfig {
  hub: NavItem[]
  ascenders: NavItem[]
  neothinkers: NavItem[]
  immortals: NavItem[]
}

const navigationConfig: PlatformNavConfig = {
  hub: [
    { href: '/discover', label: 'Discover' },
    { href: '/onboard', label: 'Onboard' },
    { href: '/progress', label: 'Progress' },
    { href: '/endgame', label: 'Endgame' },
  ],
  ascenders: [
    { href: '/ascender', label: 'My Space' },
    { href: '/ascension', label: 'Ascension' },
    { href: '/flow', label: 'Flow' },
    { href: '/ascenders', label: 'Community' },
  ],
  neothinkers: [
    { href: '/neothinker', label: 'My Space' },
    { href: '/neothink', label: 'Neothink' },
    { href: '/mark-hamilton', label: 'Mark Hamilton' },
    { href: '/neothinkers', label: 'Community' },
  ],
  immortals: [
    { href: '/immortal', label: 'My Space' },
    { href: '/immortalis', label: 'Immortalis' },
    { href: '/project-life', label: 'Project Life' },
    { href: '/immortals', label: 'Community' },
  ],
}

interface NavigationProps {
  platform: keyof PlatformNavConfig
}

export function Navigation({ platform }: NavigationProps) {
  const pathname = usePathname()
  const navItems = navigationConfig[platform]

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {/* Platform logo can go here */}
              <span className="text-xl font-bold">{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                      ${isActive 
                        ? 'border-black text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
                    `}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center">
            {/* User menu can go here */}
            <button className="p-2 rounded-md text-gray-500 hover:text-gray-700">
              Menu
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 