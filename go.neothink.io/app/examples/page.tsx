'use client';

import { useState } from 'react';
import { useData, useAuthentication } from '@neothink/hooks';
import { Button } from '@neothink/ui';
import { analytics } from '@neothink/analytics';
import { usePageView } from '@neothink/analytics/hooks';
import HubAnalyticsExample from '@/examples/HubAnalyticsExample';

/**
 * Hub platform examples page showcasing:
 * - Authentication with Supabase
 * - Data fetching with custom hooks
 * - Analytics tracking
 * - Integration with shared UI components
 * - Real-time data with Supabase subscriptions
 */
export default function ExamplesPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'data' | 'realtime'>('analytics');
  const { user, profile, loading: authLoading } = useAuthentication({ platform: 'hub' });

  // Track page view for analytics
  usePageView('hub');

  // Example of using the useData hook
  const { data: contentItems, loading: contentLoading } = useData(
    'content',
    (query) => query.select('*').limit(5),
    [],
    { platform: 'hub' }
  );

  // Handle tab change and track analytics
  const handleTabChange = (tab: 'analytics' | 'data' | 'realtime') => {
    setActiveTab(tab);
    
    // Track tab view with analytics
    analytics.track('tab_view', {
      platform: 'hub',
      tab_name: tab,
    });
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-gray-500">Please wait while we load your data</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-500 mb-6">Please sign in to access this page</p>
          <div className="flex justify-center">
            <Button
              onClick={() => window.location.href = '/auth/signin'}
              variant="default"
              size="lg"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Neothink+ Hub Examples</h1>
      
      {/* User profile information */}
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-2">Welcome, {profile?.full_name || user.email}</h2>
        <p className="text-gray-600">
          This page demonstrates integration with Supabase, shared components, data fetching, and analytics tracking.
        </p>
      </div>
      
      {/* Tab navigation */}
      <div className="border-b mb-6">
        <nav className="flex space-x-4">
          <button
            className={`py-2 px-4 ${activeTab === 'analytics' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
            onClick={() => handleTabChange('analytics')}
          >
            Analytics Example
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'data' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
            onClick={() => handleTabChange('data')}
          >
            Data Fetching
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'realtime' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
            onClick={() => handleTabChange('realtime')}
          >
            Realtime Updates
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Analytics Tracking Example</h2>
            <p className="text-gray-600 mb-6">
              This example demonstrates how to track user interactions using the analytics package.
              It leverages the <code>usePageView</code>, <code>useContentView</code>, and <code>useProgressTracker</code> hooks.
            </p>
            
            {/* Analytics example component */}
            <div className="mt-8">
              <HubAnalyticsExample />
            </div>
          </div>
        )}
        
        {activeTab === 'data' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Data Fetching Example</h2>
            <p className="text-gray-600 mb-6">
              This example demonstrates how to fetch data using the <code>useData</code> hook,
              which leverages Supabase&apos;s Data API with the nearest read replica routing feature
              from Launch Week 14.
            </p>
            
            {contentLoading ? (
              <p>Loading content...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contentItems && contentItems.length > 0 ? (
                  contentItems.map((item: any) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.content}</p>
                    </div>
                  ))
                ) : (
                  <p>No content items found</p>
                )}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'realtime' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Realtime Updates Example</h2>
            <p className="text-gray-600 mb-6">
              This example demonstrates Supabase&apos;s Realtime feature from Launch Week 14,
              which allows broadcasting database changes to connected clients.
            </p>
            
            {/* TODO: Implement realtime subscription example */}
            <div className="border rounded-lg p-6 bg-blue-50">
              <h3 className="font-semibold mb-2">Realtime Subscription</h3>
              <p className="mb-4">
                This would show real-time updates from the database. Try creating or updating content in another tab.
              </p>
              <Button
                onClick={() => {
                  // This would trigger a database change
                  analytics.track('realtime_demo', {
                    platform: 'hub',
                    action: 'trigger_update',
                  });
                }}
              >
                Trigger Demo Update
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Launch Week 14 features highlight */}
      <div className="mt-12 border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Supabase Launch Week 14 Features</h2>
        <ul className="space-y-2 list-disc pl-5">
          <li>
            <strong>Read Replica Routing:</strong> All data queries use the nearest read replica for faster response times.
          </li>
          <li>
            <strong>Realtime Database Broadcast:</strong> Changes to the database can be broadcast to connected clients.
          </li>
          <li>
            <strong>Dedicated Connection Poolers:</strong> Server-side requests use dedicated connection poolers for better performance.
          </li>
          <li>
            <strong>Edge Functions:</strong> API routes can be deployed as edge functions for global distribution.
          </li>
        </ul>
      </div>
    </div>
  );
} 