import { SupabaseClient } from '@supabase/supabase-js';
import { PlatformSlug } from '../supabase/auth-client';

/**
 * Check if a user has access to a specific platform
 * 
 * This is the standardized and unified implementation for platform access checks
 * that should be used consistently across all platforms.
 * 
 * @param supabase Supabase client
 * @param platformSlug Platform slug to check access for
 * @param userId Optional user ID (if not provided, will use current user)
 * @returns True if user has access, false otherwise
 */
export async function checkPlatformAccess(
  supabase: SupabaseClient,
  platformSlug: PlatformSlug,
  userId?: string
): Promise<boolean> {
  // Get the user ID if not provided
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    userId = user.id;
  }
  
  // Check if user is a guardian (admin)
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_guardian')
    .eq('id', userId)
    .single();
  
  // Guardians have access to all platforms
  if (profile?.is_guardian) {
    return true;
  }
  
  // Check tenant_users table (primary access mechanism)
  const { data: tenantUser, error: tenantError } = await supabase
    .from('tenant_users')
    .select('status')
    .eq('user_id', userId)
    .eq('tenant_id', (
      // Subquery to get tenant ID from slug
      supabase
        .from('tenants')
        .select('id')
        .eq('slug', platformSlug)
        .limit(1)
    ))
    .single();
  
  if (tenantUser && tenantUser.status === 'active') {
    return true;
  }
  
  // Fallback: check platform_access table
  const { data: platformAccess } = await supabase
    .from('platform_access')
    .select('*')
    .eq('user_id', userId)
    .eq('platform_slug', platformSlug)
    .or('expires_at.is.null,expires_at.gt.now()')
    .in('access_level', ['full', 'limited', 'trial'])
    .single();
  
  if (platformAccess) {
    return true;
  }
  
  // Fallback: check platforms array in profiles
  const { data: platformProfile } = await supabase
    .from('profiles')
    .select('platforms')
    .eq('id', userId)
    .single();
  
  if (platformProfile?.platforms && Array.isArray(platformProfile.platforms)) {
    return platformProfile.platforms.includes(platformSlug);
  }
  
  // If no access methods are found, user doesn't have access
  return false;
}

/**
 * Request access to a platform for the current user
 * 
 * @param supabase Supabase client
 * @param platformSlug Platform to request access for
 * @param requestDetails Additional details about the request
 * @returns Success status and message
 */
export async function requestPlatformAccess(
  supabase: SupabaseClient,
  platformSlug: PlatformSlug,
  requestDetails?: {
    reason?: string;
    referralCode?: string;
    [key: string]: any;
  }
): Promise<{ success: boolean; message: string; }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { 
      success: false, 
      message: 'You must be logged in to request access.' 
    };
  }
  
  // First get the tenant ID from the platform slug
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, name')
    .eq('slug', platformSlug)
    .single();
  
  if (!tenant) {
    return { 
      success: false, 
      message: `Platform "${platformSlug}" not found.` 
    };
  }
  
  // Create an access request
  const { data, error } = await supabase
    .from('access_requests')
    .insert({
      user_id: user.id,
      tenant_id: tenant.id,
      status: 'pending',
      details: requestDetails || {}
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error requesting access:', error);
    
    // Check if there's already a pending request
    if (error.code === '23505') { // Unique constraint violation
      return {
        success: false,
        message: `You already have a pending request for ${tenant.name}.`
      };
    }
    
    return {
      success: false,
      message: 'Failed to submit access request. Please try again later.'
    };
  }
  
  // Log the access request
  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'request_access',
    entity_type: 'tenant',
    entity_id: tenant.id,
    new_data: { request_id: data.id }
  });
  
  return {
    success: true,
    message: `Access request for ${tenant.name} submitted successfully. You'll be notified when it's approved.`
  };
}

/**
 * Get all platforms a user has access to
 * 
 * @param supabase Supabase client
 * @param userId Optional user ID (if not provided, will use current user)
 * @returns Array of platforms the user has access to
 */
export async function getUserAccessiblePlatforms(
  supabase: SupabaseClient,
  userId?: string
): Promise<{ slug: PlatformSlug; name: string; role: string; }[]> {
  // Get the user ID if not provided
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    userId = user.id;
  }
  
  // Check if user is a guardian (admin)
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_guardian')
    .eq('id', userId)
    .single();
  
  // Guardians have access to all platforms
  if (profile?.is_guardian) {
    const { data: allTenants } = await supabase
      .from('tenants')
      .select('name, slug')
      .eq('status', 'active');
    
    return (allTenants || []).map(tenant => ({
      slug: tenant.slug as PlatformSlug,
      name: tenant.name,
      role: 'guardian'
    }));
  }
  
  // Get platforms from tenant_users (primary)
  const { data: tenantUsers } = await supabase
    .from('tenant_users')
    .select(`
      tenant:tenant_id(name, slug),
      role,
      status
    `)
    .eq('user_id', userId)
    .eq('status', 'active');
  
  const platforms = (tenantUsers || [])
    .filter(tu => tu.tenant)
    .map(tu => ({
      slug: tu.tenant.slug as PlatformSlug,
      name: tu.tenant.name,
      role: tu.role
    }));
  
  // Get additional platforms from platform_access (fallback)
  const { data: platformAccess } = await supabase
    .from('platform_access')
    .select('platform_slug, access_level')
    .eq('user_id', userId)
    .or('expires_at.is.null,expires_at.gt.now()')
    .in('access_level', ['full', 'limited', 'trial']);
  
  if (platformAccess) {
    for (const access of platformAccess) {
      // Skip if already in results
      if (platforms.some(p => p.slug === access.platform_slug)) {
        continue;
      }
      
      // Get tenant details
      const { data: tenant } = await supabase
        .from('tenants')
        .select('name')
        .eq('slug', access.platform_slug)
        .single();
      
      platforms.push({
        slug: access.platform_slug as PlatformSlug,
        name: tenant?.name || access.platform_slug,
        role: access.access_level
      });
    }
  }
  
  return platforms;
} 