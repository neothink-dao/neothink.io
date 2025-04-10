import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Define status types
type StatusType = 'operational' | 'degraded' | 'outage' | 'maintenance';
type PlatformType = 'hub' | 'ascenders' | 'immortals' | 'neothinkers' | 'all';

// Type for status data
interface StatusData {
  platform: PlatformType;
  status: StatusType;
  title: string;
  message?: string;
  updated_at: string;
}

interface PlatformStatusProps {
  platform?: PlatformType;
  showDetails?: boolean;
  className?: string;
}

/**
 * Component to display platform status information
 * Used to show users if there are any ongoing issues with the platform
 */
export function PlatformStatus({ 
  platform = 'all', 
  showDetails = false,
  className = ''
}: PlatformStatusProps) {
  const [statuses, setStatuses] = useState<StatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const fetchStatuses = async () => {
      try {
        setLoading(true);
        
        // Query for specific platform or all platforms
        const query = supabase
          .from('platform_status')
          .select('*')
          .order('updated_at', { ascending: false });
          
        // Add filter if specific platform is requested
        const { data, error } = platform === 'all' 
          ? await query
          : await query.or(`platform.eq.${platform},platform.eq.all`);

        if (error) throw error;
        
        setStatuses(data as StatusData[]);
      } catch (e) {
        console.error('Error fetching status data:', e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    // Set up realtime subscription for status updates
    const statusSubscription = supabase
      .channel('platform_status_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'platform_status',
        },
        () => {
          // Refetch on any changes
          fetchStatuses();
        }
      )
      .subscribe();

    // Initial fetch
    fetchStatuses();

    // Clean up subscription on unmount
    return () => {
      statusSubscription.unsubscribe();
    };
  }, [platform]);

  // Status color mapping
  const getStatusColor = (status: StatusType): string => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'outage':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get primary status (either platform-specific or the global 'all' status)
  const primaryStatus = statuses.find(s => s.platform === platform) || 
                        statuses.find(s => s.platform === 'all');

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-pulse h-3 w-3 rounded-full bg-gray-300"></div>
        <span className="text-sm text-gray-400">Loading status...</span>
      </div>
    );
  }

  if (error || !primaryStatus) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="h-3 w-3 rounded-full bg-gray-500"></div>
        <span className="text-sm text-gray-500">Status unavailable</span>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Basic status indicator */}
      <div className="flex items-center space-x-2">
        <div 
          className={`h-3 w-3 rounded-full ${getStatusColor(primaryStatus.status)}`}
          title={primaryStatus.title}
        ></div>
        <span className="text-sm">
          {primaryStatus.title}
        </span>
      </div>

      {/* Detailed status information */}
      {showDetails && primaryStatus.message && (
        <div className="mt-2 text-sm text-gray-600 border-l-4 pl-3 border-gray-300">
          {primaryStatus.message}
        </div>
      )}

      {/* Show all platform statuses when viewing 'all' */}
      {showDetails && platform === 'all' && (
        <div className="mt-4 space-y-2">
          {statuses
            .filter(s => s.platform !== 'all')
            .map((status) => (
              <div key={status.platform} className="flex items-center space-x-2">
                <div 
                  className={`h-2 w-2 rounded-full ${getStatusColor(status.status)}`}
                ></div>
                <span className="text-xs font-medium capitalize">{status.platform}:</span>
                <span className="text-xs">{status.title}</span>
              </div>
            ))}
        </div>
      )}

      {/* Last updated time */}
      {showDetails && (
        <div className="mt-3 text-xs text-gray-400">
          Last updated: {new Date(primaryStatus.updated_at).toLocaleString()}
        </div>
      )}
    </div>
  );
}

export default PlatformStatus; 