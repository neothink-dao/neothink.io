'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const routes = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Discover', path: '/discover' },
    { name: 'Onboard', path: '/onboard' },
    { name: 'Progress', path: '/progress' },
    { name: 'Endgame', path: '/endgame' },
  ];
  
  const platformRoutes = [
    { 
      name: 'Ascenders', 
      path: '/ascenders',
      color: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-orange-500',
    },
    { 
      name: 'Neothinkers', 
      path: '/neothinkers',
      color: 'bg-amber-500 hover:bg-amber-600',
      textColor: 'text-amber-500',
    },
    { 
      name: 'Immortals', 
      path: '/immortals',
      color: 'bg-red-500 hover:bg-red-600',
      textColor: 'text-red-500',
    },
  ];
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Neothink+
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === route.path
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {route.name}
                </Link>
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
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
            <Link
              key={route.path}
              href={route.path}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === route.path
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {route.name}
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="space-y-1">
            {platformRoutes.map((platform) => (
              <Link
                key={platform.path}
                href={platform.path}
                className={`block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium ${platform.textColor} hover:bg-gray-50`}
              >
                {platform.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 