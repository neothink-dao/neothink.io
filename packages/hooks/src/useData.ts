import { useState, useEffect } from 'react';
import { supabase } from '@neothink/core/database/client';
import type { Database } from '@neothink/types';

type UseDataOptions<T> = {
  initialData?: T;
  platform?: 'hub' | 'ascenders' | 'neothinkers' | 'immortals';
  onError?: (error: Error) => void;
};

/**
 * Custom hook for fetching data from Supabase
 * 
 * Features:
 * - Type-safe queries using Supabase generated types
 * - Platform-specific filtering
 * - Loading and error state management
 * - Uses nearest read replica routing for optimal performance (Launch Week 14 feature)
 * 
 * @param table The table to query
 * @param queryFn Function to build the query
 * @param deps Dependencies for the effect
 * @param options Additional options
 */
export function useData<T, TableName extends keyof Database['public']['Tables']>(
  table: TableName,
  queryFn: (
    query: ReturnType<typeof supabase.from<TableName>>
  ) => PromiseLike<{ data: T | null; error: Error | null }>,
  deps: any[] = [],
  options: UseDataOptions<T> = {}
) {
  const { initialData, platform, onError } = options;
  const [data, setData] = useState<T | null>(initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Start with the base query
        let query = supabase.from(table);
        
        // Apply platform filter if specified
        if (platform) {
          // @ts-ignore - We know this has a platform column
          query = query.eq('platform', platform);
        }
        
        // Apply the custom query function
        const { data: result, error: queryError } = await queryFn(query);
        
        if (queryError) throw queryError;
        
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          const error = err as Error;
          setError(error);
          onError && onError(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, deps);

  return { data, loading, error, refetch: () => {} };
} 