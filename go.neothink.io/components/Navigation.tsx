'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isFeatureEnabled } from '../lib/feature-flags';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const routes = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Discover', path: '/discover' },
    { name: 'Onboard', path: '/onboard' },
    { name: 'Progress', path: '/progress' },
    { name: 'Endgame', path: '/endgame', requireFlag: 'advanced_gamification_enabled' },
  ];
  
  const platformRoutes = [
    { 
      name: 'Ascenders', 
      path: 'https://www.joinascenders.org',
      color: 'bg-emerald-500 hover:bg-emerald-600',
      textColor: 'text-emerald-500',
      routes: [
        { name: 'Ascender', path: '/ascender' },
        { name: 'Ascension', path: '/ascension' },
        { name: 'Flow', path: '/flow' },
        { name: 'Ascenders', path: '/ascenders' },
      ]
    },
    { 
      name: 'Neothinkers', 
      path: 'https://www.joinneothinkers.org',
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-blue-500',
      routes: [
        { name: 'Neothinker', path: '/neothinker' },
        { name: 'Neothink', path: '/neothink' },
        { name: 'Mark Hamilton', path: '/mark-hamilton' },
        { name: 'Neothinkers', path: '/neothinkers' },
      ],
      subroutes: {
        '/neothink': [
          { name: 'Revolution', path: '/neothink/revolution' },
          { name: 'Fellowship', path: '/neothink/fellowship' },
          { name: 'Movement', path: '/neothink/movement' },
          { name: 'Command', path: '/neothink/command' },
        ]
      }
    },
    { 
      name: 'Immortals', 
      path: 'https://www.joinimmortals.org',
      color: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-purple-500',
      routes: [
        { name: 'Immortal', path: '/immortal' },
        { name: 'Immortalis', path: '/immortalis' },
        { name: 'Project Life', path: '/project-life' },
        { name: 'Immortals', path: '/immortals' },
      ]
    },
  ];
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const isRouteEnabled = (route: typeof routes[0]) => {
    if (!route.requireFlag) return true;
    
    // Simple client-side check - for accurate checks, use server-side rendering
    return isFeatureEnabled('hub', route.requireFlag as any);
  };
  
  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800 dark:text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Neothink+
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {routes.map((route) => (
                isRouteEnabled(route) && (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === route.path
                        ? 'border-blue-500 text-gray-900 dark:text-gray-100'
                        : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    {route.name}
                  </Link>
                )
              ))}
            </div>
          </div>
          
          <div className="hidden sm:flex sm:items-center sm:space-x-3">
            {platformRoutes.map((platform) => (
              <Link
                key={platform.path}
                href={platform.path}
                className={`px-3 py-2 rounded-md text-sm font-medium text-white ${platform.color}`}
              >
                {platform.name}
              </Link>
            ))}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {routes.map((route) => (
            isRouteEnabled(route) && (
              <Link
                key={route.path}
                href={route.path}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  pathname === route.path
                    ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {route.name}
              </Link>
            )
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-1">
            {platformRoutes.map((platform) => (
              <div key={platform.path}>
                <Link
                  href={platform.path}
                  className={`block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium ${platform.textColor} hover:bg-gray-50 dark:hover:bg-gray-700`}
                >
                  {platform.name}
                </Link>
                
                {/* Platform-specific routes */}
                {platform.routes && (
                  <div className="pl-6 space-y-1 mt-1">
                    {platform.routes.map((subRoute) => (
                      <Link
                        key={`${platform.path}${subRoute.path}`}
                        href={`${platform.path}${subRoute.path}`}
                        className="block pl-3 pr-4 py-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        {subRoute.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 