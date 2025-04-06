import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import {
  ThemeProvider,
  PlatformSwitcher,
  PermissionGate,
  useNotifications,
  useAnalytics
} from '../shared';
import { getSiteConfig } from '../config/sites';

type PlatformLayoutProps = {
  children: ReactNode;
  /** Platform identifier */
  platformId: 'hub' | 'ascenders' | 'neothinkers' | 'immortals';
  /** Whether to show the platform switcher */
  showPlatformSwitcher?: boolean;
  /** Whether to hide the main navigation */
  hideNavigation?: boolean;
  /** Whether this is a full-width layout */
  fullWidth?: boolean;
  /** Custom header component */
  headerComponent?: ReactNode;
  /** Custom footer component */
  footerComponent?: ReactNode;
  /** Additional className for the main content area */
  contentClassName?: string;
};

/**
 * PlatformLayout provides a consistent layout across all Neothink platforms
 * 
 * This component includes:
 * - Consistent theming via ThemeProvider
 * - Cross-platform navigation
 * - Platform-specific styling
 * - Authentication awareness
 * - Notification system
 * - Analytics tracking
 */
export default function PlatformLayout({
  children,
  platformId,
  showPlatformSwitcher = true,
  hideNavigation = false,
  fullWidth = false,
  headerComponent,
  footerComponent,
  contentClassName = ''
}: PlatformLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const { trackPageView } = useAnalytics();
  const { unreadCount } = useNotifications();
  const pathname = usePathname();
  const supabase = useSupabaseClient();
  const user = useUser();
  
  // Get platform configuration
  const config = getSiteConfig(platformId);
  const navigation = config.navigation;
  
  // Check auth status
  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);
  
  // Track page view
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname, document.title);
    }
  }, [pathname, trackPageView]);
  
  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };
  
  return (
    <ThemeProvider platformOverride={platformId}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header - use custom header if provided, otherwise use default */}
        {headerComponent || (
          <header className="bg-white shadow-sm sticky top-0 z-30">
            <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${fullWidth ? 'w-full' : 'max-w-7xl'}`}>
              <div className="flex justify-between h-16">
                <div className="flex">
                  {/* Logo and brand */}
                  <div className="flex-shrink-0 flex items-center">
                    <Link href="/" className="flex items-center">
                      <img 
                        className="h-8 w-auto" 
                        src={config.logoSrc} 
                        alt={config.name}
                      />
                      <span className="ml-2 font-semibold text-gray-900">{config.name}</span>
                    </Link>
                  </div>
                  
                  {/* Desktop Navigation */}
                  {!hideNavigation && (
                    <nav className="hidden md:ml-6 md:flex md:space-x-8">
                      {navigation.map(item => {
                        // Skip items that require auth if user is not logged in
                        if (item.requireAuth && !isLoggedIn) return null;
                        
                        // If item has a permission requirement, wrap in PermissionGate
                        if (item.requirePermission) {
                          return (
                            <PermissionGate key={item.href} permission={item.requirePermission}>
                              <Link 
                                href={item.href}
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                  pathname === item.href
                                    ? 'border-blue-500 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                              >
                                {item.name}
                              </Link>
                            </PermissionGate>
                          );
                        }
                        
                        // Regular nav item
                        return (
                          <Link 
                            key={item.href}
                            href={item.href}
                            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                              pathname === item.href
                                ? 'border-blue-500 text-gray-900'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                          >
                            {item.name}
                          </Link>
                        );
                      })}
                    </nav>
                  )}
                </div>
                
                {/* Right side menu */}
                <div className="flex items-center">
                  {/* Platform switcher */}
                  {showPlatformSwitcher && isLoggedIn && (
                    <div className="mr-4">
                      <PlatformSwitcher />
                    </div>
                  )}
                  
                  {/* Auth buttons */}
                  {isLoggedIn ? (
                    <div className="flex items-center space-x-4">
                      {/* Notification bell */}
                      <Link href="/notifications" className="relative">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-6 w-6 text-gray-400 hover:text-gray-500" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                          />
                        </svg>
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </Link>
                      
                      {/* User menu */}
                      <div className="relative">
                        <Link href="/profile" className="flex items-center">
                          <span className="sr-only">User menu</span>
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300">
                            {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        </Link>
                      </div>
                      
                      {/* Sign out */}
                      <button 
                        onClick={handleSignOut}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Link 
                        href="/login" 
                        className="text-sm font-medium text-gray-500 hover:text-gray-700"
                      >
                        Sign in
                      </Link>
                      <Link 
                        href="/signup" 
                        className="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Sign up
                      </Link>
                    </div>
                  )}
                  
                  {/* Mobile menu button */}
                  <div className="ml-2 -mr-2 flex items-center md:hidden">
                    <button
                      onClick={() => setIsNavOpen(!isNavOpen)}
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    >
                      <span className="sr-only">Open main menu</span>
                      <svg
                        className={`${isNavOpen ? 'hidden' : 'block'} h-6 w-6`}
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
                      <svg
                        className={`${isNavOpen ? 'block' : 'hidden'} h-6 w-6`}
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
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile menu, show/hide based on state */}
            {isNavOpen && (
              <div className="md:hidden">
                <div className="pt-2 pb-3 space-y-1">
                  {navigation.map(item => {
                    // Skip items that require auth if user is not logged in
                    if (item.requireAuth && !isLoggedIn) return null;
                    
                    // If item has a permission requirement, wrap in PermissionGate
                    if (item.requirePermission) {
                      return (
                        <PermissionGate key={item.href} permission={item.requirePermission}>
                          <Link 
                            href={item.href}
                            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                              pathname === item.href
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                            }`}
                          >
                            {item.name}
                          </Link>
                        </PermissionGate>
                      );
                    }
                    
                    // Regular nav item
                    return (
                      <Link 
                        key={item.href}
                        href={item.href}
                        className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                          pathname === item.href
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                        }`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
                
                {/* Mobile auth menu */}
                {isLoggedIn && (
                  <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="flex items-center px-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                          {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">
                          {user?.user_metadata?.full_name || 'User'}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                          {user?.email || ''}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      >
                        Your Profile
                      </Link>
                      <Link
                        href="/notifications"
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      >
                        Notifications
                        {unreadCount > 0 && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </header>
        )}
        
        {/* Main content area */}
        <main className={`flex-1 ${contentClassName}`}>
          <div className={`${fullWidth ? 'w-full' : 'max-w-7xl mx-auto'} px-4 sm:px-6 lg:px-8 py-6`}>
            {children}
          </div>
        </main>
        
        {/* Footer - use custom footer if provided, otherwise use default */}
        {footerComponent || (
          <footer className="bg-white border-t border-gray-200">
            <div className={`${fullWidth ? 'w-full' : 'max-w-7xl mx-auto'} px-4 sm:px-6 lg:px-8 py-8`}>
              <div className="md:flex md:items-center md:justify-between">
                <div className="flex space-x-6 md:order-2">
                  {config.footer?.socialLinks?.map((link) => (
                    <a key={link.name} href={link.href} className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">{link.name}</span>
                      {/* Insert icon component here if available */}
                      {link.name}
                    </a>
                  ))}
                </div>
                <div className="mt-8 md:mt-0 md:order-1">
                  <p className="text-center text-base text-gray-400">
                    &copy; {new Date().getFullYear()} Neothink. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </ThemeProvider>
  );
} 