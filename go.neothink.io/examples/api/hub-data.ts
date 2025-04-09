import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, getAuthenticatedSupabase } from '@neothink/core/database/client';
import { analytics } from '@neothink/analytics';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify authentication
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Extract token from Bearer format
  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    // Get authenticated client with user's token - this will respect RLS policies
    const authClient = getAuthenticatedSupabase(token);
    
    // Track API usage through analytics
    await analytics.track('api_call', {
      platform: 'hub',
      endpoint: 'hub-data',
      method: req.method,
    });

    // Fetch platform-specific data (respecting RLS)
    const { data: contentItems, error: contentError } = await authClient
      .from('content')
      .select('*')
      .eq('platform', 'hub')
      .limit(10);

    if (contentError) {
      throw contentError;
    }

    // Fetch user progress data (respecting RLS)
    const { data: progressData, error: progressError } = await authClient
      .from('progress')
      .select('*')
      .limit(10);

    if (progressError) {
      throw progressError;
    }

    // Return combined data
    return res.status(200).json({
      content: contentItems,
      progress: progressData,
    });
  } catch (error) {
    console.error('Error fetching Hub data:', error);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
} 