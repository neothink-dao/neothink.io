import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@supabase/auth-helpers-react';
import { PlatformSwitcher } from '../../shared';
import { getSiteConfig } from '../../config/sites';
import { usePermissions } from '../../hooks/usePermissions';
import { PlatformId } from '../../navigation/deep-linking';

interface PlatformNavigationProps {
  platformId: PlatformId;
  variant?: 'full' | 'minimal';
  showPlatformSwitcher?: boolean;
}

/**
 * Shared navigation component used across all Neothink platforms
 * 
 * This component adapts to each platform's specific needs while
 * maintaining a consistent user experience.
 */
export default function PlatformNavigation({
  platformId,
  variant = 'full',
  showPlatformSwitcher = true
}: PlatformNavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const user = useUser();
  const { hasPermission } = usePermissions();
  
  const config = getSiteConfig(platformId);
  const navigation = config.navigation;
  
  // Filter navigation items based on user permissions
  const filteredNavigation = navigation.filter(item => {
    // If item has a permission requirement, check if user has it
    if (item.permission) {
      return hasPermission(item.permission);
    }
    return true;
  });
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                {config.logoSrc ? (
                  <Image
                    src={config.logoSrc}
                    alt={config.name}
                    width={32}
                    height={32}
                    className="h-8 w-auto"
                  />
                ) : (
                  <div 
                    className="h-8 w-8 rounded bg-gray-800 flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: config.colors.primary }}
                  >
                    {config.name.charAt(0)}
                  </div>
                )}
                <span className="ml-2 font-medium text-gray-900">{config.name}</span>
              </Link>
            </div>
            
            {variant === 'full' && (
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {filteredNavigation.map((item) => {
                  const isActive = 
                    pathname === item.href || 
                    (pathname?.startsWith(item.href + '/') && item.href !== '/');
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? 'border-indigo-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      {item.name}
                      {item.badge && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
          
          {/* Right side controls */}
          <div className="flex items-center">
            {/* Platform switcher */}
            {user && showPlatformSwitcher && <PlatformSwitcher />}
            
            {/* User menu */}
            {user ? (
              <div className="ml-4 relative flex-shrink-0">
                <div>
                  <button
                    type="button"
                    className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    {user.user_metadata?.avatar_url ? (
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={user.user_metadata.avatar_url}
                        alt=""
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-sm">
                          {user.email?.charAt(0).toUpperCase() || user.id.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </button>
                </div>
                
                {menuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-0"
                      onClick={() => setMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-1"
                      onClick={() => setMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-2"
                      onClick={async () => {
                        const { createClient } = await import('../../supabase/client');
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        router.push('/login');
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="ml-4 flex-shrink-0 flex items-center">
                <Link
                  href="/login"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            {variant === 'full' && (
              <div className="flex items-center sm:hidden ml-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  aria-expanded="false"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <span className="sr-only">Open main menu</span>
                  {menuOpen ? (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {variant === 'full' && menuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = 
                pathname === item.href || 
                (pathname?.startsWith(item.href + '/') && item.href !== '/');
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                  {item.badge && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
} 