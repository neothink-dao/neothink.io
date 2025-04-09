import { NextRequest, NextResponse } from 'next/server';
import { supabase, getAuthenticatedSupabase } from '@neothink/core';
import { analytics } from '@neothink/analytics';

/**
 * API route for fetching Hub platform-specific data
 * 
 * Features:
 * - Authentication validation with JWT token
 * - Row Level Security (RLS) respecting data access
 * - Analytics event tracking
 * - Nearest read replica routing (Launch Week 14 feature)
 * - Dedicated connection pooler for server environments (Launch Week 14 feature)
 * - Enhanced error handling with detailed error messages
 * 
 * @see SUPABASE.md#row-level-security - RLS implementation details
 * @see SUPABASE.md#launch-week-14-features - Read replica routing details
 */
export async function GET(request: NextRequest) {
  try {
    // Extract authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ 
        error: 'Unauthorized', 
        details: 'Missing authorization header'
      }, { status: 401 });
    }

    // Extract token from Bearer format
    const token = authorization.split(' ')[1];
    if (!token) {
      return NextResponse.json({ 
        error: 'Invalid token format', 
        details: 'Authorization header must use Bearer format'
      }, { status: 401 });
    }

    try {
      // Get authenticated client with user's token - this will respect RLS policies
      // See: SUPABASE.md - Row Level Security implementation
      const authClient = getAuthenticatedSupabase(token);
      
      // Track API usage through analytics
      await analytics.track('api_call', {
        platform: 'hub',
        endpoint: 'hub-data',
        method: 'GET',
      }).catch(error => {
        // Log analytics failure but don't fail the request
        console.warn('Failed to track analytics event:', error);
      });

      // Fetch platform-specific data (respecting RLS)
      const { data: contentItems, error: contentError } = await authClient
        .from('content')
        .select('*')
        .eq('platform', 'hub')
        .limit(10);

      if (contentError) {
        console.error('Error fetching content:', contentError);
        return NextResponse.json({ 
          error: 'Failed to fetch content', 
          details: contentError.message 
        }, { status: 500 });
      }

      // Fetch user progress data (respecting RLS)
      const { data: progressData, error: progressError } = await authClient
        .from('progress')
        .select('*')
        .limit(10);

      if (progressError) {
        console.error('Error fetching progress:', progressError);
        return NextResponse.json({ 
          error: 'Failed to fetch progress data', 
          details: progressError.message 
        }, { status: 500 });
      }

      // Return combined data
      return NextResponse.json({
        content: contentItems || [],
        progress: progressData || [],
        timestamp: new Date().toISOString()
      });
    } catch (authError) {
      console.error('Authentication error:', authError);
      return NextResponse.json({ 
        error: 'Authentication failed', 
        details: authError instanceof Error ? authError.message : 'Unknown error'
      }, { status: 403 });
    }
  } catch (error) {
    console.error('Unexpected error in hub-data API:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * This example demonstrates using the POST method for the same endpoint
 * to handle data insertion with analytics tracking
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 401 }
      );
    }

    // Get authenticated client with user's token
    const authClient = getAuthenticatedSupabase(token);
    
    // Parse request body
    const body = await request.json();
    const { title, content, route, subroute } = body;
    
    if (!title || !content || !route) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Insert new content
    const { data: newContent, error: insertError } = await authClient
      .from('content')
      .insert({
        title,
        content,
        route,
        subroute: subroute || null,
        platform: 'hub'
      })
      .select()
      .single();
      
    if (insertError) {
      throw insertError;
    }
    
    // Track content creation in analytics
    await analytics.track('content_created', {
      platform: 'hub',
      content_id: newContent.id,
      content_title: title,
    });
    
    return NextResponse.json({
      success: true,
      content: newContent,
    });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
} 