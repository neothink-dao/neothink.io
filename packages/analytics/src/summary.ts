import { supabase } from '@neothink/core/database/client';
import type { Platform } from './types';

/**
 * Type definitions for analytics summary data
 */
export interface AnalyticsSummaryOptions {
  /**
   * Start date for the analytics period (ISO string or Date object)
   */
  startDate?: string | Date;
  
  /**
   * End date for the analytics period (ISO string or Date object)
   */
  endDate?: string | Date;
  
  /**
   * Specific platforms to include (all platforms if not specified)
   */
  platforms?: string[];
  
  /**
   * Specific event types to include (all events if not specified)
   */
  eventTypes?: string[];
  
  /**
   * Maximum number of results to return
   */
  limit?: number;
}

export interface AnalyticsEventCount {
  /**
   * Event type (e.g., page_view, content_view)
   */
  event: string;
  
  /**
   * Platform name (e.g., hub, ascenders)
   */
  platform: string;
  
  /**
   * Number of events
   */
  count: number;
}

export interface PlatformSummary {
  /**
   * Platform name
   */
  platform: string;
  
  /**
   * Total events across all types
   */
  totalEvents: number;
  
  /**
   * Events by type
   */
  events: Record<string, number>;
}

export interface AnalyticsSummary {
  /**
   * Summary statistics by platform
   */
  platforms: PlatformSummary[];
  
  /**
   * Total events across all platforms
   */
  totalEvents: number;
  
  /**
   * Events broken down by type and platform
   */
  eventCounts: AnalyticsEventCount[];
  
  /**
   * Time period of the summary
   */
  period: {
    startDate: string;
    endDate: string;
  };
}

interface EventSummary {
  event_name: string;
  count: number;
}

interface EngagementMetrics {
  mostViewedPages: { path: string; count: number }[];
  featureUnlockAttempts: { feature: string; count: number; success_rate: number }[];
  averageTimeSpent: number; // in seconds
  contentInteractions: { content_id: string; count: number }[];
  errors: { type: string; count: number }[];
}

/**
 * Retrieves an aggregated summary of analytics events from the database.
 * 
 * This function uses a dedicated connection pool for efficient querying
 * and optimizes database queries to minimize resource usage.
 * 
 * @param options - Options for filtering and customizing the summary
 * @returns A promise resolving to the analytics summary
 * 
 * @see SUPABASE.md#dedicated-connection-pooling - Connection pooling details
 * @see DEVELOPMENT.md#analytics-summary - Usage examples
 */
export async function getAnalyticsSummary(options: AnalyticsSummaryOptions = {}): Promise<AnalyticsSummary> {
  try {
    // Set default dates if not provided
    const endDate = options.endDate ? new Date(options.endDate) : new Date();
    const startDate = options.startDate 
      ? new Date(options.startDate) 
      : new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Default to 7 days
    
    // Format dates for Supabase query
    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();
    
    // Base query for fetching analytics events
    let query = supabase
      .from('analytics_events')
      .select('event, platform, properties, created_at')
      .gte('created_at', startDateStr)
      .lte('created_at', endDateStr);
    
    // Apply platform filter if specified
    if (options.platforms && options.platforms.length > 0) {
      query = query.in('platform', options.platforms);
    }
    
    // Apply event type filter if specified
    if (options.eventTypes && options.eventTypes.length > 0) {
      query = query.in('event', options.eventTypes);
    }
    
    // Apply limit if specified
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    // Execute the query
    const { data: events, error } = await query;
    
    if (error) {
      console.error('Error fetching analytics events:', error);
      throw new Error(`Failed to fetch analytics events: ${error.message}`);
    }
    
    // Process the events to generate summary statistics
    const platformMap: Record<string, PlatformSummary> = {};
    const eventCountMap: Record<string, Record<string, number>> = {};
    let totalEvents = 0;
    
    // Parse events to build summary statistics
    events?.forEach(event => {
      const { platform, event: eventType } = event;
      totalEvents++;
      
      // Initialize platform summary if not exists
      if (!platformMap[platform]) {
        platformMap[platform] = {
          platform,
          totalEvents: 0,
          events: {}
        };
      }
      
      // Initialize event count map if not exists
      if (!eventCountMap[platform]) {
        eventCountMap[platform] = {};
      }
      
      // Update platform statistics
      platformMap[platform].totalEvents++;
      platformMap[platform].events[eventType] = (platformMap[platform].events[eventType] || 0) + 1;
      
      // Update event count map
      eventCountMap[platform][eventType] = (eventCountMap[platform][eventType] || 0) + 1;
    });
    
    // Convert event count map to array
    const eventCounts: AnalyticsEventCount[] = [];
    Object.entries(eventCountMap).forEach(([platform, events]) => {
      Object.entries(events).forEach(([event, count]) => {
        eventCounts.push({ platform, event, count });
      });
    });
    
    // Sort event counts by count (descending)
    eventCounts.sort((a, b) => b.count - a.count);
    
    // Build the final summary
    const summary: AnalyticsSummary = {
      platforms: Object.values(platformMap),
      totalEvents,
      eventCounts,
      period: {
        startDate: startDateStr,
        endDate: endDateStr
      }
    };
    
    return summary;
  } catch (error) {
    console.error('Failed to generate analytics summary:', error);
    throw error;
  }
}

/**
 * Get a summary of analytics events for a given platform and time period
 * @param platform The platform to get the summary for
 * @param period The time period to get the summary for (day, week, month)
 * @returns A summary of analytics events
 * 
 * See SUPABASE.md for details on the analytics_events table structure
 */
export async function getAnalyticsSummary(
  platform: Platform,
  period: 'day' | 'week' | 'month' = 'day'
): Promise<AnalyticsSummary> {
  // Calculate the start date based on the period
  const now = new Date();
  let startDate = new Date();
  
  switch (period) {
    case 'day':
      startDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
  }

  // Format dates for SQL query
  const formattedStartDate = startDate.toISOString();
  const formattedEndDate = now.toISOString();

  // Query the database for total events
  const { data: totalEventsData, error: totalEventsError } = await supabase
    .from('analytics_events')
    .select('id', { count: 'exact' })
    .eq('platform', platform)
    .gte('timestamp', formattedStartDate)
    .lte('timestamp', formattedEndDate);

  if (totalEventsError) throw totalEventsError;

  // Query the database for page views
  const { data: pageViewsData, error: pageViewsError } = await supabase
    .from('analytics_events')
    .select('id', { count: 'exact' })
    .eq('platform', platform)
    .eq('event_name', 'page_view')
    .gte('timestamp', formattedStartDate)
    .lte('timestamp', formattedEndDate);

  if (pageViewsError) throw pageViewsError;

  // Query the database for unique users
  const { data: uniqueUsersData, error: uniqueUsersError } = await supabase
    .from('analytics_events')
    .select('user_id')
    .eq('platform', platform)
    .gte('timestamp', formattedStartDate)
    .lte('timestamp', formattedEndDate);

  if (uniqueUsersError) throw uniqueUsersError;

  // Calculate unique users
  const uniqueUsers = new Set(uniqueUsersData.map(event => event.user_id)).size;

  return {
    totalEvents: totalEventsData.count || 0,
    pageViews: pageViewsData.count || 0,
    uniqueUsers,
    platform,
    period,
    startDate: formattedStartDate,
    endDate: formattedEndDate
  };
}

/**
 * Get the most common events for a given platform and time period
 * @param platform The platform to get the events for
 * @param period The time period to get the events for (day, week, month)
 * @param limit The maximum number of events to return
 * @returns A list of events and their counts
 */
export async function getTopEvents(
  platform: Platform,
  period: 'day' | 'week' | 'month' = 'day',
  limit: number = 10
): Promise<EventSummary[]> {
  // Calculate the start date based on the period
  const now = new Date();
  let startDate = new Date();
  
  switch (period) {
    case 'day':
      startDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
  }

  // Format dates for SQL query
  const formattedStartDate = startDate.toISOString();
  const formattedEndDate = now.toISOString();

  // Query the database for top events
  const { data, error } = await supabase
    .rpc('get_top_events', {
      p_platform: platform,
      p_start_date: formattedStartDate,
      p_end_date: formattedEndDate,
      p_limit: limit
    });

  if (error) throw error;

  return data || [];
}

/**
 * Get detailed engagement metrics for a given platform and time period
 * @param platform The platform to get the metrics for
 * @param period The time period to get the metrics for (day, week, month)
 * @returns Engagement metrics including most viewed pages, feature unlock attempts, etc.
 */
export async function getEngagementMetrics(
  platform: Platform,
  period: 'day' | 'week' | 'month' = 'day'
): Promise<EngagementMetrics> {
  // Calculate the start date based on the period
  const now = new Date();
  let startDate = new Date();
  
  switch (period) {
    case 'day':
      startDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
  }

  // Format dates for SQL query
  const formattedStartDate = startDate.toISOString();
  const formattedEndDate = now.toISOString();

  // Get most viewed pages
  const { data: pagesData, error: pagesError } = await supabase
    .from('analytics_events')
    .select('properties, count(*)')
    .eq('platform', platform)
    .eq('event_name', 'page_view')
    .gte('timestamp', formattedStartDate)
    .lte('timestamp', formattedEndDate)
    .group('properties->path')
    .order('count', { ascending: false })
    .limit(5);

  if (pagesError) throw pagesError;

  // Get feature unlock attempts
  const { data: unlockData, error: unlockError } = await supabase
    .from('analytics_events')
    .select('properties, event_detail, count(*)')
    .eq('platform', platform)
    .eq('event_name', 'feature_unlock_attempt')
    .gte('timestamp', formattedStartDate)
    .lte('timestamp', formattedEndDate)
    .group('properties->feature, event_detail->success')
    .order('count', { ascending: false });

  if (unlockError) throw unlockError;

  // Get average time spent
  const { data: timeData, error: timeError } = await supabase
    .from('analytics_events')
    .select('event_detail->timeSpent')
    .eq('platform', platform)
    .eq('event_category', 'engagement')
    .not('event_detail->timeSpent', 'is', null)
    .gte('timestamp', formattedStartDate)
    .lte('timestamp', formattedEndDate);

  if (timeError) throw timeError;

  // Get content interactions
  const { data: contentData, error: contentError } = await supabase
    .from('analytics_events')
    .select('properties, count(*)')
    .eq('platform', platform)
    .eq('event_name', 'content_interaction')
    .gte('timestamp', formattedStartDate)
    .lte('timestamp', formattedEndDate)
    .group('properties->contentId')
    .order('count', { ascending: false })
    .limit(5);

  if (contentError) throw contentError;

  // Get errors
  const { data: errorData, error: errorError } = await supabase
    .from('analytics_events')
    .select('properties, count(*)')
    .eq('platform', platform)
    .eq('event_category', 'error')
    .gte('timestamp', formattedStartDate)
    .lte('timestamp', formattedEndDate)
    .group('properties->errorType')
    .order('count', { ascending: false })
    .limit(5);

  if (errorError) throw errorError;

  // Process the data
  const mostViewedPages = pagesData.map(item => ({
    path: item.properties.path,
    count: parseInt(item.count as unknown as string)
  }));

  // Process unlock attempts and calculate success rate
  const featureUnlockMap: Record<string, { total: number, success: number }> = {};
  unlockData.forEach(item => {
    const feature = item.properties.feature;
    const success = item.event_detail?.success || false;
    const count = parseInt(item.count as unknown as string);
    
    if (!featureUnlockMap[feature]) {
      featureUnlockMap[feature] = { total: 0, success: 0 };
    }
    
    featureUnlockMap[feature].total += count;
    if (success) {
      featureUnlockMap[feature].success += count;
    }
  });

  const featureUnlockAttempts = Object.entries(featureUnlockMap).map(([feature, data]) => ({
    feature,
    count: data.total,
    success_rate: data.total > 0 ? data.success / data.total : 0
  }));

  // Calculate average time spent
  const timeSpentValues = timeData
    .map(item => parseInt(item.timeSpent as unknown as string))
    .filter(value => !isNaN(value));
  
  const averageTimeSpent = timeSpentValues.length > 0
    ? timeSpentValues.reduce((sum, value) => sum + value, 0) / timeSpentValues.length
    : 0;

  // Process content interactions
  const contentInteractions = contentData.map(item => ({
    content_id: item.properties.contentId,
    count: parseInt(item.count as unknown as string)
  }));

  // Process errors
  const errors = errorData.map(item => ({
    type: item.properties.errorType,
    count: parseInt(item.count as unknown as string)
  }));

  return {
    mostViewedPages,
    featureUnlockAttempts,
    averageTimeSpent,
    contentInteractions,
    errors
  };
} 