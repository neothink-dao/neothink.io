import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@neothink/core';
import { analytics } from '@neothink/analytics';
import { getUser } from '@neothink/hooks/api';

/**
 * API route for fetching achievements from the Neothinkers platform
 * 
 * @param req - The Next.js API request object
 * @param res - The Next.js API response object
 * 
 * Uses row level security from Supabase to ensure data access is properly authorized
 * 
 * @see SUPABASE.md#row-level-security - RLS implementation details
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get query parameters
    const { limit = '10', offset = '0', sort = 'created_at', order = 'desc' } = req.query;
    
    // Get authenticated user from request
    const { user, error: userError } = await getUser(req);
    
    if (userError) {
      console.error('Error getting user:', userError);
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Initialize Supabase client
    const supabase = createClient();
    
    // Query achievements
    // RLS will automatically restrict access to allowed data
    const query = supabase
      .from('achievements')
      .select('*')
      .eq('platform', 'neothinkers')
      .order(sort as string, { ascending: order === 'asc' })
      .range(
        parseInt(offset as string, 10),
        parseInt(offset as string, 10) + parseInt(limit as string, 10) - 1
      );
    
    const { data, error, count } = await query;
    
    if (error) {
      throw error;
    }
    
    // Track analytics event
    if (user) {
      analytics.track('api_achievements_fetched', {
        platform: 'neothinkers',
        user_id: user.id,
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10),
        count: data?.length || 0,
      }).catch(e => console.warn('Failed to track analytics event:', e));
    }
    
    // Return data with pagination info
    return res.status(200).json({
      data,
      pagination: {
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10),
        total: count,
      },
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    
    // Track error
    analytics.track('api_error', {
      platform: 'neothinkers',
      endpoint: '/api/achievements',
      error: error instanceof Error ? error.message : 'Unknown error',
    }).catch(e => console.warn('Failed to track error event:', e));
    
    return res.status(500).json({
      error: 'Failed to fetch achievements',
      message: error instanceof Error ? error.message : 'Internal server error',
    });
  }
} 