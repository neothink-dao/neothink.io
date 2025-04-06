import { createClient } from '../supabase/server';

/**
 * API interface for tenant integration with external systems
 * This module provides controlled access to tenant data and operations
 */

/**
 * Get tenant by API key
 * 
 * This function allows external systems to authenticate and identify
 * which tenant they're accessing based on an API key
 */
export async function getTenantByApiKey(apiKey: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('tenant_api_keys')
    .select(`
      id,
      api_key,
      name,
      tenant:tenant_id (
        id,
        name,
        slug,
        description,
        settings,
        branding,
        status
      )
    `)
    .eq('api_key', apiKey)
    .eq('status', 'active')
    .single();
  
  if (error || !data || !data.tenant) {
    return null;
  }
  
  return {
    apiKeyId: data.id,
    apiKeyName: data.name,
    tenant: data.tenant
  };
}

/**
 * Get user profile by external ID
 * 
 * This function allows external systems to match their user IDs
 * with our internal user IDs for consistent user management
 */
export async function getUserByExternalId(tenantId: string, externalId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('tenant_users')
    .select(`
      id,
      user_id,
      role,
      status,
      profiles:user_id (
        id,
        email,
        full_name,
        avatar_url
      ),
      external_mappings:user_id (
        external_id,
        external_provider,
        external_profile
      )
    `)
    .eq('tenant_id', tenantId)
    .eq('external_mappings.external_id', externalId)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return {
    id: data.user_id,
    role: data.role,
    status: data.status,
    profile: data.profiles,
    externalData: data.external_mappings
  };
}

/**
 * Sync user data from external system
 * 
 * This function allows external systems to create or update user profiles
 * in our system based on their user data
 */
export async function syncUserFromExternal(
  tenantId: string,
  externalId: string,
  userData: {
    email: string;
    fullName?: string;
    avatarUrl?: string;
    externalProfile?: any;
    externalProvider: string;
  }
) {
  const supabase = createClient();
  
  // First check if user already exists by email
  const { data: existingUser, error: userError } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('email', userData.email)
    .single();
  
  let userId;
  
  if (!existingUser) {
    // Create new user if not exists
    const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
      email: userData.email,
      email_confirm: true,
      user_metadata: {
        full_name: userData.fullName,
        avatar_url: userData.avatarUrl
      }
    });
    
    if (createError || !authUser.user) {
      throw new Error(`Failed to create user: ${createError?.message}`);
    }
    
    userId = authUser.user.id;
    
    // Create profile
    await supabase.from('profiles').insert({
      id: userId,
      email: userData.email,
      full_name: userData.fullName,
      avatar_url: userData.avatarUrl
    });
  } else {
    userId = existingUser.id;
    
    // Update existing profile
    await supabase.from('profiles').update({
      full_name: userData.fullName,
      avatar_url: userData.avatarUrl
    }).eq('id', userId);
  }
  
  // Create or update external mapping
  await supabase.from('user_external_mappings').upsert({
    user_id: userId,
    external_id: externalId,
    external_provider: userData.externalProvider,
    external_profile: userData.externalProfile
  }, {
    onConflict: 'user_id, external_provider'
  });
  
  // Add user to tenant if not already
  await supabase.rpc('add_user_to_tenant', {
    _user_id: userId,
    _tenant_id: tenantId,
    _role: 'member'
  });
  
  return { userId };
}

/**
 * Get content for external consumption
 * 
 * This function allows external systems to access content modules and lessons
 * for a specific tenant
 */
export async function getTenantContent(tenantId: string, options?: {
  contentType?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = createClient();
  
  // First get the tenant slug
  const { data: tenant } = await supabase
    .from('tenants')
    .select('slug')
    .eq('id', tenantId)
    .single();
  
  if (!tenant) {
    return { modules: [], lessons: [] };
  }
  
  const limit = options?.limit || 50;
  const offset = options?.offset || 0;
  
  // Get all content modules for the tenant
  const { data: modules } = await supabase
    .from('content_modules')
    .select('*')
    .eq('platform', tenant.slug)
    .eq('is_published', true)
    .order('order_index', { ascending: true })
    .range(offset, offset + limit - 1);
  
  // Get all lessons for the content modules
  let lessons = [];
  if (modules && modules.length > 0) {
    const moduleIds = modules.map(m => m.id);
    const { data: lessonData } = await supabase
      .from('lessons')
      .select('*')
      .in('module_id', moduleIds)
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    
    if (lessonData) {
      lessons = lessonData;
    }
  }
  
  return { modules, lessons };
}

/**
 * Track content progress from external system
 */
export async function trackContentProgress(
  tenantId: string,
  userId: string,
  contentId: string,
  contentType: string,
  status: string,
  progressPercentage: number
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('learning_progress')
    .upsert({
      user_id: userId,
      content_id: contentId,
      content_type: contentType,
      status: status,
      progress_percentage: progressPercentage,
      last_interaction_at: new Date().toISOString()
    }, {
      onConflict: 'user_id, content_id, content_type'
    });
  
  if (error) {
    throw new Error(`Failed to track progress: ${error.message}`);
  }
  
  return { success: true };
} 