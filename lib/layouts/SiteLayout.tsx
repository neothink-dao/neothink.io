import React, { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider, PlatformSwitcher } from '../shared';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '../supabase/client';

type SiteLayoutProps = {
  children: ReactNode;
  platform: 'hub' | 'ascenders' | 'neothinkers' | 'immortals';
  tenantSlug?: string;
  showPlatformSwitcher?: boolean;
  hideNavigation?: boolean;
};

interface NavLink {
  name: string;
  href: string;
  isExternal?: boolean;
  badge?: string;
}

const platformConfig = {
  hub: {
    name: 'NeoThink Hub',
    logoSrc: '/logos/neothink-logo.svg',
    homeUrl: '/hub',
    navigation: [
      { name: 'Dashboard', href: '/hub/dashboard' },
      { name: 'Tenants', href: '/hub/tenants' },
      { name: 'Content', href: '/hub/content' },
      { name: 'Users', href: '/hub/users' },
      { name: 'Settings', href: '/hub/settings' },
    ]
  },
  ascenders: {
    name: 'Ascenders',
    logoSrc: '/logos/ascenders-logo.svg',
    homeUrl: '/ascenders',
    navigation: [
      { name: 'Dashboard', href: '/ascenders/dashboard' },
      { name: 'Modules', href: '/ascenders/modules' },
      { name: 'Community', href: '/ascenders/community' },
      { name: 'Resources', href: '/ascenders/resources' },
      { name: 'Events', href: '/ascenders/events', badge: 'New' },
    ]
  },
  neothinkers: {
    name: 'NeoThinkers',
    logoSrc: '/logos/neothinkers-logo.svg',
    homeUrl: '/neothinkers',
    navigation: [
      { name: 'Dashboard', href: '/neothinkers/dashboard' },
      { name: 'Think Tank', href: '/neothinkers/think-tank' },
      { name: 'Courses', href: '/neothinkers/courses' },
      { name: 'Community', href: '/neothinkers/community' },
      { name: 'Tools', href: '/neothinkers/tools' },
    ]
  },
  immortals: {
    name: 'Immortals',
    logoSrc: '/logos/immortals-logo.svg',
    homeUrl: '/immortals',
    navigation: [
      { name: 'Dashboard', href: '/immortals/dashboard' },
      { name: 'Longevity', href: '/immortals/longevity' },
      { name: 'Biohacking', href: '/immortals/biohacking' },
      { name: 'Research', href: '/immortals/research' },
      { name: 'Community', href: '/immortals/community' },
    ]
  }
};

export default function SiteLayout({
  children,
  platform,
  tenantSlug,
  showPlatformSwitcher = true,
  hideNavigation = false
}: SiteLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const pathname = usePathname();
  
  const config = platformConfig[platform];
  const navigation = config.navigation;
  
  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuth();
  }, []);
  
  return (
    <ThemeProvider platformOverride={platform}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href={config.homeUrl} className="flex items-center">
                    <img 
                      className="h-8 w-auto" 
                      src={config.logoSrc} 
                      alt={config.name}
                    />
                    <span className="ml-2 font-semibold text-gray-900">{config.name}</span>
                  </Link>
                </div>
                
                {!hideNavigation && (
                  <nav className="hidden md:ml-6 md:flex md:space-x-8">
                    {navigation.map((link) => {
                      const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                            isActive
                              ? 'border-blue-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                          }`}
                          target={link.isExternal ? '_blank' : undefined}
                          rel={link.isExternal ? 'noopener noreferrer' : undefined}
                        >
                          {link.name}
                          {link.badge && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                )}
              </div>
              
              <div className="flex items-center">
                {isLoggedIn && showPlatformSwitcher && <PlatformSwitcher />}
                
                {isLoggedIn ? (
                  <div className="ml-4 flex items-center">
                    <div className="relative">
                      <button
                        type="button"
                        className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-semibold">U</span>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-4 ml-4">
                    <Link 
                      href="/login" 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                    >
                      Sign in
                    </Link>
                    <Link 
                      href="/signup" 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
                
                {/* Mobile menu button */}
                {!hideNavigation && (
                  <div className="flex items-center md:hidden ml-4">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                      onClick={() => setIsNavOpen(!isNavOpen)}
                    >
                      <span className="sr-only">Open main menu</span>
                      {isNavOpen ? (
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile navigation menu */}
          {!hideNavigation && isNavOpen && (
            <div className="md:hidden">
              <div className="pt-2 pb-3 space-y-1">
                {navigation.map((link) => {
                  const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                        isActive
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                      }`}
                      target={link.isExternal ? '_blank' : undefined}
                      rel={link.isExternal ? 'noopener noreferrer' : undefined}
                      onClick={() => setIsNavOpen(false)}
                    >
                      {link.name}
                      {link.badge && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </header>
        
        {/* Main content */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-500 text-sm">
                © {new Date().getFullYear()} NeoThink. All rights reserved.
              </div>
              <div className="mt-4 md:mt-0 flex space-x-6">
                <Link href="/terms" className="text-gray-500 hover:text-gray-700 text-sm">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="text-gray-500 hover:text-gray-700 text-sm">
                  Privacy Policy
                </Link>
                <Link href="/contact" className="text-gray-500 hover:text-gray-700 text-sm">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
} 