'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@neothink/core';
import { analytics } from '@neothink/analytics';
import { useAuth } from '@neothink/hooks';
import { Button, Card, CardContent } from '@neothink/ui';
import { RealtimeUpdates } from '../components/RealtimeUpdates';
import { ErrorBoundary } from '../components/ErrorBoundary';
import type { Achievement } from '@neothink/types/supabase';

/**
 * Home page for the Neothinkers platform
 * Showcases integration with:
 * - @neothink/core for data fetching
 * - @neothink/analytics for tracking
 * - @neothink/ui for UI components
 * - @neothink/hooks for state management
 * 
 * @see SUPABASE.md - For details on Supabase features used
 */
export default function HomePage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  
  // Initialize Supabase client
  const supabase = createClient();

  // Track page view
  useEffect(() => {
    analytics.page('neothinkers', '/');
  }, []);

  // Fetch achievement data
  useEffect(() => {
    async function fetchAchievements() {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('achievements')
          .select('*')
          .eq('platform', 'neothinkers')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        setAchievements(data || []);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError(err instanceof Error ? err.message : 'Failed to load achievements');
        
        // Track error in analytics
        analytics.track('data_fetch_error', {
          platform: 'neothinkers',
          component: 'HomePage',
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchAchievements();
  }, [supabase]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Neothinkers Platform</h1>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => router.push('/achievements')}
            variant="outline"
          >
            View All Achievements
          </Button>
          
          {user && (
            <Button 
              onClick={() => router.push('/profile')}
            >
              My Profile
            </Button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm">{error}</p>
          <Button 
            className="mt-2" 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Latest Achievements</h2>
          
          {loading ? (
            <div className="space-y-4" data-testid="loading-achievements">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="animate-pulse">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : achievements.length > 0 ? (
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id}>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{achievement.name}</h3>
                    {achievement.description && (
                      <p className="text-gray-600 text-sm">{achievement.description}</p>
                    )}
                    {achievement.points && (
                      <p className="text-blue-600 text-sm mt-2">{achievement.points} points</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No achievements found.</p>
          )}
        </div>
        
        <ErrorBoundary>
          <RealtimeUpdates />
        </ErrorBoundary>
      </div>
      
      {/* Analytics Dashboard for admins */}
      {isAdmin && (
        <ErrorBoundary>
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Analytics Dashboard</h2>
            <AnalyticsDashboard initialPlatform="neothinkers" days={7} />
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
}

// Import AnalyticsDashboard dynamically only for admin users
import dynamic from 'next/dynamic';
const AnalyticsDashboard = dynamic<{
  initialPlatform?: string;
  days?: number;
  showRefresh?: boolean;
}>(() => import('@neothink/ui').then((mod) => mod.AnalyticsDashboard), {
  ssr: false,
  loading: () => (
    <Card>
      <CardContent className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-24 bg-gray-100 rounded"></div>
          <div className="h-32 bg-gray-100 rounded"></div>
        </div>
      </CardContent>
    </Card>
  ),
}); 