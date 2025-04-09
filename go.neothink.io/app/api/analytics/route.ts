import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@neothink/core/database/client';
import { analytics } from '@neothink/analytics';

/**
 * API route for querying analytics events
 * 
 * Features:
 * - Aggregates analytics events from the shared analytics_events table
 * - Uses server-side Supabase client with service role key (bypasses RLS)
 * - Supports filtering by platform, event name, and date range
 * - Demonstrates Supabase Launch Week 14 features:
 *   - Dedicated connection pooler
 *   - Nearest read replica routing
 * 
 * NOTE: This endpoint uses the service role key and bypasses RLS,
 * so it should only be accessible to authorized admin users.
 */
export async function GET(request: NextRequest) {
  try {
    // In a real application, you would verify that the requester is an admin
    // For this example, we'll assume the authorization has been handled by middleware
    
    // Get URL parameters
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get('platform');
    const eventName = searchParams.get('event_name');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const groupBy = searchParams.get('group_by') || 'platform';
    
    // Get server-side Supabase client (with service role key)
    // This uses a dedicated connection pooler (Launch Week 14 feature)
    const supabase = getServerSupabase();
    
    // Start building the query
    let query = supabase
      .from('analytics_events')
      .select('*');
    
    // Apply filters
    if (platform) {
      query = query.eq('platform', platform);
    }
    
    if (eventName) {
      query = query.eq('event_name', eventName);
    }
    
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    
    // Execute the query
    const { data: events, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Track this analytics query
    await analytics.track('analytics_query', {
      platform: platform || 'all',
      event_name: eventName || 'all',
      result_count: events?.length || 0
    });
    
    // Aggregate results based on groupBy parameter
    let aggregatedData: Record<string, number> = {};
    
    if (events) {
      if (groupBy === 'platform') {
        // Group by platform
        aggregatedData = events.reduce((acc, event) => {
          const platform = event.platform;
          acc[platform] = (acc[platform] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      } else if (groupBy === 'event_name') {
        // Group by event name
        aggregatedData = events.reduce((acc, event) => {
          const eventName = event.event_name;
          acc[eventName] = (acc[eventName] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      } else {
        // No grouping, just return count
        aggregatedData = { total: events.length };
      }
    }
    
    // Return the aggregated data
    return NextResponse.json({
      count: events?.length || 0,
      aggregated: aggregatedData,
      // Include raw events if requested and count is not too large
      events: events && events.length <= 100 ? events : undefined,
      filters: {
        platform,
        event_name: eventName,
        start_date: startDate,
        end_date: endDate,
        group_by: groupBy
      },
      features: {
        dedicatedPooler: true,
        readReplicaRouting: true
      }
    });
  } catch (error) {
    console.error('Error querying analytics events:', error);
    return NextResponse.json(
      { error: 'Failed to query analytics events' },
      { status: 500 }
    );
  }
}

/**
 * This example demonstrates using the POST method for the same endpoint
 * to create new analytics events
 */
export async function POST(request: NextRequest) {
  try {
    // In a real application, you would verify that the requester is authorized
    // For this example, we'll assume the authorization has been handled by middleware
    
    // Parse request body
    const body = await request.json();
    const { event_name, platform, properties, user_id } = body;
    
    if (!event_name || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Track the event through our analytics package
    await analytics.track(event_name, {
      platform,
      ...properties,
      user_id
    });
    
    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
} 