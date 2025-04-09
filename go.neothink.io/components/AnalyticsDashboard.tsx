'use client';

import { useState, useEffect } from 'react';
import { getAnalyticsSummary, AnalyticsSummary } from '@neothink/analytics';
import { Button } from '@neothink/ui/components/Button';

/**
 * Props for the AnalyticsDashboard component
 */
interface AnalyticsDashboardProps {
  /**
   * Initial platform to show analytics for
   * If not provided, all platforms will be shown
   */
  initialPlatform?: string;
  
  /**
   * Number of days of data to show
   * Defaults to 7
   */
  days?: number;
  
  /**
   * Whether to show the refresh button
   * Defaults to true
   */
  showRefresh?: boolean;
}

/**
 * A dashboard component that displays analytics summary data
 * 
 * Uses:
 * - @neothink/analytics for summary data
 * - @neothink/ui for UI components
 * 
 * @see SUPABASE.md#analytics - Analytics data structure
 */
export function AnalyticsDashboard({ 
  initialPlatform,
  days = 7,
  showRefresh = true 
}: AnalyticsDashboardProps) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(initialPlatform || null);
  
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Fetch analytics summary
      const options = {
        startDate,
        endDate,
        platforms: selectedPlatform ? [selectedPlatform] : undefined
      };
      
      const data = await getAnalyticsSummary(options);
      setSummary(data);
    } catch (err) {
      console.error('Error fetching analytics summary:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch analytics on mount and when selected platform changes
  useEffect(() => {
    fetchAnalytics();
  }, [selectedPlatform, days]);
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
          <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
        </div>
        <div className="space-y-4" data-testid="loading-placeholder">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 h-24 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
          {showRefresh && (
            <Button size="sm" variant="outline" onClick={fetchAnalytics}>
              Retry
            </Button>
          )}
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-medium mb-1">Error loading analytics</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!summary) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
          {showRefresh && (
            <Button size="sm" variant="outline" onClick={fetchAnalytics}>
              Refresh
            </Button>
          )}
        </div>
        <p className="text-gray-500 italic">No analytics data available.</p>
      </div>
    );
  }
  
  // Platform filter buttons
  const platformButtons = summary.platforms.map(platform => (
    <button
      key={platform.platform}
      onClick={() => setSelectedPlatform(platform.platform)}
      className={`px-3 py-1 text-sm rounded-full mr-2 ${
        selectedPlatform === platform.platform
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
      }`}
    >
      {platform.platform}
    </button>
  ));
  
  // Add "All platforms" button if we have multiple platforms
  if (summary.platforms.length > 1) {
    platformButtons.unshift(
      <button
        key="all"
        onClick={() => setSelectedPlatform(null)}
        className={`px-3 py-1 text-sm rounded-full mr-2 ${
          selectedPlatform === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        }`}
      >
        All platforms
      </button>
    );
  }
  
  // Filter event counts by selected platform
  const filteredEvents = selectedPlatform
    ? summary.eventCounts.filter(event => event.platform === selectedPlatform)
    : summary.eventCounts;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
        {showRefresh && (
          <Button size="sm" variant="outline" onClick={fetchAnalytics}>
            Refresh
          </Button>
        )}
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Platform</h3>
        <div className="flex flex-wrap">
          {platformButtons}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Total Events</p>
          <p className="text-3xl font-bold">
            {selectedPlatform
              ? summary.platforms.find(p => p.platform === selectedPlatform)?.totalEvents || 0
              : summary.totalEvents}
          </p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Page Views</p>
          <p className="text-3xl font-bold">
            {filteredEvents.filter(e => e.event === 'page_view').reduce((sum, e) => sum + e.count, 0)}
          </p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium">Content Views</p>
          <p className="text-3xl font-bold">
            {filteredEvents.filter(e => e.event === 'content_view').reduce((sum, e) => sum + e.count, 0)}
          </p>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Events by Type</h3>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.slice(0, 10).map((event, index) => (
                <tr key={`${event.platform}-${event.event}-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.event}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.platform}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.count}
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No events found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-right">
        Data from {new Date(summary.period.startDate).toLocaleDateString()} to {new Date(summary.period.endDate).toLocaleDateString()}
      </div>
    </div>
  );
} 