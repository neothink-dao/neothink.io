import { createClientComponent, PlatformSlug } from './supabase/auth-client';
import { createServerComponent } from './supabase/auth-server';

/**
 * Checks if a user has access to a specific platform by checking their subscribed_platforms
 */
export async function checkPlatformSubscription(
  userId: string,
  platform: PlatformSlug
): Promise<boolean> {
  const supabase = createServerComponent();
  
  // Check if user exists and is subscribed to the platform
  const { data, error } = await supabase
    .from('profiles')
    .select('role, subscribed_platforms')
    .eq('id', userId)
    .single();
  
  if (error || !data) {
    console.error('Error checking platform subscription:', error);
    return false;
  }
  
  // Admin users have access to all platforms
  if (data.role === 'admin') {
    return true;
  }
  
  // Check if user is subscribed to this platform
  if (data.subscribed_platforms && Array.isArray(data.subscribed_platforms)) {
    return data.subscribed_platforms.includes(platform);
  }
  
  return false;
}

/**
 * Get user with their platform subscriptions
 */
export async function getUserWithSubscriptions(userId: string) {
  const supabase = createServerComponent();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*, user:id(email)')
    .eq('id', userId)
    .single();
  
  if (error || !data) {
    console.error('Error fetching user with subscriptions:', error);
    return null;
  }
  
  return {
    id: userId,
    email: data.user?.email,
    full_name: data.full_name,
    avatar_url: data.avatar_url,
    subscribed_platforms: data.subscribed_platforms || [],
    role: data.role || 'user'
  };
}

/**
 * Subscribe user to platform
 */
export async function subscribeUserToPlatform(
  userId: string,
  platform: PlatformSlug
): Promise<boolean> {
  const supabase = createServerComponent();
  
  // Get current subscriptions
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscribed_platforms')
    .eq('id', userId)
    .single();
  
  if (!profile) return false;
  
  const currentSubscriptions = profile.subscribed_platforms || [];
  
  // Add platform if not already subscribed
  if (!currentSubscriptions.includes(platform)) {
    const updatedSubscriptions = [...currentSubscriptions, platform];
    
    const { error } = await supabase
      .from('profiles')
      .update({ subscribed_platforms: updatedSubscriptions })
      .eq('id', userId);
    
    if (error) {
      console.error('Error subscribing user to platform:', error);
      return false;
    }
  }
  
  return true;
}

/**
 * Validate user session and platform access
 * Returns null if user is not authenticated or doesn't have access
 */
export async function validateSessionForPlatform(
  platform: PlatformSlug
): Promise<{ userId: string } | null> {
  const supabase = createServerComponent();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  
  const hasAccess = await checkPlatformSubscription(session.user.id, platform);
  if (!hasAccess) return null;
  
  return { userId: session.user.id };
} 