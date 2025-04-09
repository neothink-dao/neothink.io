import { createClient } from './supabase';
import { Progress } from './types';

/**
 * Fetches user progress for a specific platform, route, and optional subroute
 */
export async function getUserProgress(
  userId: string,
  platform: string,
  route: string,
  subroute?: string
): Promise<Progress | null> {
  const supabase = createClient();
  
  let query = supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('platform', platform)
    .eq('route', route);
  
  if (subroute) {
    query = query.eq('subroute', subroute);
  } else {
    query = query.is('subroute', null);
  }
  
  const { data, error } = await query.single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    console.error('Error fetching user progress:', error);
    throw error;
  }
  
  return data as Progress;
}

/**
 * Updates or creates user progress for a specific platform, route, and optional subroute
 */
export async function updateUserProgress(
  userId: string,
  platform: string,
  route: string,
  progress: Record<string, any>,
  subroute?: string
): Promise<Progress> {
  const supabase = createClient();
  
  // Check if progress already exists
  const existingProgress = await getUserProgress(userId, platform, route, subroute);
  
  const progressData = {
    user_id: userId,
    platform,
    route,
    subroute: subroute || null,
    progress,
    last_accessed: new Date().toISOString()
  };
  
  let result;
  
  if (existingProgress) {
    // Update existing progress
    const { data, error } = await supabase
      .from('user_progress')
      .update(progressData)
      .eq('id', existingProgress.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
    
    result = data;
  } else {
    // Create new progress
    const { data, error } = await supabase
      .from('user_progress')
      .insert(progressData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user progress:', error);
      throw error;
    }
    
    result = data;
  }
  
  return result as Progress;
}

/**
 * Fetches all progress for a user across all platforms
 */
export async function getAllUserProgress(userId: string): Promise<Progress[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .order('last_accessed', { ascending: false });
  
  if (error) {
    console.error('Error fetching all user progress:', error);
    throw error;
  }
  
  return data as Progress[];
} 