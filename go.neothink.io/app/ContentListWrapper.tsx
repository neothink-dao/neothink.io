'use client';

import { useEffect } from 'react';
import { ContentList } from '../components/ContentList';
import { useData } from '@neothink/hooks';
import { usePageView } from '@neothink/analytics';

interface ContentListWrapperProps {
  platform: string;
}

/**
 * Wrapper component that fetches content data and handles analytics tracking
 * 
 * Uses:
 * - @neothink/hooks for data fetching
 * - @neothink/analytics for page view tracking
 * 
 * @see SUPABASE.md - Nearest read replica routing
 */
export function ContentListWrapper({ platform }: ContentListWrapperProps) {
  // Track page view with analytics
  usePageView(platform);
  
  // Fetch content data using the shared hook
  // This uses nearest read replica routing for optimal performance
  const { data, error, loading } = useData('content', {
    platform: platform,
    // Additional filters could be added here
  });
  
  // Handle loading state
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-lg shadow p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-red-800 font-medium mb-2">Error loading content</h3>
        <p className="text-red-600 text-sm">{error.message || 'Please try again later'}</p>
      </div>
    );
  }
  
  // Render the content list
  return <ContentList items={data || []} platform={platform} />;
} 