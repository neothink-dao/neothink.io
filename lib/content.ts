import { createClient } from './supabase';
import { Content } from './types';

/**
 * Fetches content from the content table based on platform, route, and optional subroute
 */
export async function getContent(platform: string, route: string, subroute?: string): Promise<Content[]> {
  const supabase = createClient();
  
  let query = supabase
    .from('content')
    .select('*')
    .eq('platform', platform)
    .eq('route', route);
  
  if (subroute) {
    query = query.eq('subroute', subroute);
  } else {
    query = query.is('subroute', null);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
  
  return data as Content[];
}

/**
 * Fetches a single content item by slug
 */
export async function getContentBySlug(platform: string, slug: string): Promise<Content | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('platform', platform)
    .eq('slug', slug)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    console.error('Error fetching content by slug:', error);
    throw error;
  }
  
  return data as Content;
}

/**
 * Fetches content for a specific platform
 */
export async function getPlatformContent(platform: string): Promise<Content[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('platform', platform)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching platform content:', error);
    throw error;
  }
  
  return data as Content[];
} 