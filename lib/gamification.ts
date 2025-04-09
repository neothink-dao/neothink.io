import { createClient } from './supabase';

/**
 * Awards points to a user for a specific action
 */
export async function awardPoints(
  userId: string,
  action: string,
  points: number
): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('user_points')
    .insert({
      user_id: userId,
      points,
      action
    });
  
  if (error) {
    console.error('Error awarding points:', error);
    throw error;
  }
}

/**
 * Gets the total points for a user
 */
export async function getUserPoints(userId: string): Promise<number> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_points')
    .select('points')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching user points:', error);
    throw error;
  }
  
  // Sum all points
  return data.reduce((sum, record) => sum + record.points, 0);
}

/**
 * Gets point history for a user
 */
export interface PointRecord {
  id: string;
  user_id: string;
  points: number;
  action: string;
  awarded_at: string;
}

export async function getUserPointHistory(userId: string): Promise<PointRecord[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', userId)
    .order('awarded_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user point history:', error);
    throw error;
  }
  
  return data as PointRecord[];
}

/**
 * Gets the user's rank based on total points
 */
export async function getUserRank(userId: string): Promise<{ rank: number; total: number }> {
  const supabase = createClient();
  
  // Get total users with points
  const { count } = await supabase
    .from('user_points')
    .select('user_id', { count: 'exact', head: true })
    .is('user_id', 'not.null');
  
  const totalUsers = count || 0;
  
  // Get current user's total points
  const userPoints = await getUserPoints(userId);
  
  // Get number of users with more points
  const { count: usersWithMorePoints } = await supabase.rpc(
    'count_users_with_more_points',
    { target_points: userPoints }
  );
  
  // Rank is 1-based, so add 1 to the number of users with more points
  const rank = (usersWithMorePoints || 0) + 1;
  
  return { rank, total: totalUsers };
} 