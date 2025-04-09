'use client'

import { useTheme } from '../../lib/context/theme-context'
import { Suspense } from 'react';
import { HubHeader } from '../components/HubHeader';
import { ContentListWrapper } from './ContentListWrapper';
import { RealtimeUpdates } from '../components/RealtimeUpdates';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { useAuthentication } from '@neothink/hooks';

/**
 * Hub platform homepage
 * 
 * Uses:
 * - @neothink/core for Supabase data fetching with RLS
 * - @neothink/analytics for tracking page views and analytics summaries
 * - @neothink/ui for UI components
 * - @neothink/hooks for data fetching and authentication
 * 
 * @see DEVELOPMENT.md#using-app-templates - Using App Templates section
 * @see SUPABASE.md#row-level-security - Row Level Security implementation
 */
export const dynamic = 'force-dynamic'

export default function HomePage() {
  const { user, isLoading } = useAuthentication();
  // Admin users are those with @neothink.io email addresses
  const isAdmin = user?.email?.endsWith('@neothink.io') || false;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with authentication */}
      <HubHeader />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Neothink+ Hub</h1>
          <p className="text-gray-600">
            Your central platform for all Neothink content and resources.
          </p>
        </div>

        {/* Show analytics dashboard for admin users */}
        {isAdmin && (
          <div className="mb-8">
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
              <AnalyticsDashboard initialPlatform="hub" days={7} />
            </Suspense>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Latest Content</h2>
            
            {/* Content list with Suspense boundary */}
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
              <ContentListWrapper platform="hub" />
            </Suspense>
          </div>
          
          <div>
            <div className="sticky top-8">
              {/* Realtime updates demonstration */}
              <RealtimeUpdates platform="hub" />
              
              <div className="mt-8 bg-white rounded-lg shadow p-4">
                <h2 className="font-semibold text-lg mb-4">Platform Features</h2>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="inline-block rounded-full bg-blue-100 text-blue-600 p-1 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Real-time content updates using Supabase Broadcast</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block rounded-full bg-blue-100 text-blue-600 p-1 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Row Level Security for platform-specific content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block rounded-full bg-blue-100 text-blue-600 p-1 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Analytics tracking for user interactions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block rounded-full bg-blue-100 text-blue-600 p-1 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Nearest read replica routing for optimal performance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Neothink+ Hub</h3>
              <p className="text-gray-400">
                Your central platform for all Neothink content and resources.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="/content" className="text-gray-400 hover:text-white">Content</a></li>
                <li><a href="/profile" className="text-gray-400 hover:text-white">Profile</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Other Platforms</h3>
              <ul className="space-y-2">
                <li><a href="https://joinascenders.org" className="text-gray-400 hover:text-white">Ascenders</a></li>
                <li><a href="https://joinneothinkers.org" className="text-gray-400 hover:text-white">Neothinkers</a></li>
                <li><a href="https://joinimmortals.org" className="text-gray-400 hover:text-white">Immortals</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Neothink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 