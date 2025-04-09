'use client';

import { useState } from 'react';
import { Button } from '@neothink/ui/components/Button';
import { useAuthentication } from '@neothink/hooks';

/**
 * Header component for the Hub platform
 * 
 * @see DEVELOPMENT.md - Using app templates section
 */
export function HubHeader() {
  const { user, signOut } = useAuthentication();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Neothink+ Hub</h1>
          <nav className="hidden md:flex space-x-4">
            <a href="/" className="hover:underline">Home</a>
            <a href="/content" className="hover:underline">Content</a>
            <a href="/progress" className="hover:underline">Progress</a>
          </nav>
        </div>

        <div className="relative">
          {user ? (
            <>
              <Button 
                onClick={() => setShowMenu(!showMenu)}
                variant="outline"
              >
                {user.email?.split('@')[0] || 'User'}
              </Button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-10 text-gray-800">
                  <div className="px-4 py-2 font-semibold border-b border-gray-200">
                    {user.email}
                  </div>
                  <a href="/profile" className="block px-4 py-2 hover:bg-blue-50">
                    Profile
                  </a>
                  <a href="/settings" className="block px-4 py-2 hover:bg-blue-50">
                    Settings
                  </a>
                  <button 
                    onClick={signOut}
                    className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" href="/login">
                Log In
              </Button>
              <Button href="/signup">
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 