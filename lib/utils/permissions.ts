import { SupabaseClient } from '@supabase/supabase-js';
import { PlatformSlug } from '../supabase/auth-client';

/**
 * Permission object structure
 */
export interface Permission {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category?: string;
  granted_via?: 'role' | 'direct' | 'guardian';
  tenant_slug?: string;
}

/**
 * Check if a user has a specific permission in a tenant
 * 
 * @param supabase Supabase client
 * @param permissionSlug Permission slug to check
 * @param options Options for the check
 * @returns True if the user has the permission
 */
export async function checkUserPermission(
  supabase: SupabaseClient,
  permissionSlug: string,
  options?: {
    userId?: string;
    tenantSlug?: PlatformSlug;
    allowGuardianOverride?: boolean;
  }
): Promise<boolean> {
  const {
    userId,
    tenantSlug,
    allowGuardianOverride = true
  } = options || {};
  
  // Get user ID if not provided
  let userIdToUse = userId;
  if (!userIdToUse) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    userIdToUse = user.id;
  }
  
  // Check if user is a guardian (platform admin)
  if (allowGuardianOverride) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_guardian')
      .eq('id', userIdToUse)
      .single();
    
    if (profile?.is_guardian) {
      return true;
    }
  }
  
  // Get all permissions for the user
  const { data: permissions } = await supabase.rpc('get_user_permissions', {
    _user_id: userIdToUse,
    _tenant_slug: tenantSlug
  });
  
  if (!permissions) return false;
  
  // Check if the permission is in the result set
  return permissions.some((p: any) => p.permission_slug === permissionSlug);
}

/**
 * Check if a user has all of the specified permissions
 * 
 * @param supabase Supabase client
 * @param permissionSlugs Array of permission slugs to check
 * @param options Options for the check
 * @returns True if the user has all permissions
 */
export async function checkUserHasAllPermissions(
  supabase: SupabaseClient,
  permissionSlugs: string[],
  options?: {
    userId?: string;
    tenantSlug?: PlatformSlug;
    allowGuardianOverride?: boolean;
  }
): Promise<boolean> {
  const {
    userId,
    tenantSlug,
    allowGuardianOverride = true
  } = options || {};
  
  // Empty array always returns true
  if (permissionSlugs.length === 0) return true;
  
  // Get user ID if not provided
  let userIdToUse = userId;
  if (!userIdToUse) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    userIdToUse = user.id;
  }
  
  // Check if user is a guardian (platform admin)
  if (allowGuardianOverride) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_guardian')
      .eq('id', userIdToUse)
      .single();
    
    if (profile?.is_guardian) {
      return true;
    }
  }
  
  // Get all permissions for the user
  const { data: permissions } = await supabase.rpc('get_user_permissions', {
    _user_id: userIdToUse,
    _tenant_slug: tenantSlug
  });
  
  if (!permissions) return false;
  
  // Extract permission slugs from the result
  const userPermissionSlugs = permissions.map((p: any) => p.permission_slug);
  
  // Check if the user has all the required permissions
  return permissionSlugs.every(slug => userPermissionSlugs.includes(slug));
}

/**
 * Check if a user has any of the specified permissions
 * 
 * @param supabase Supabase client
 * @param permissionSlugs Array of permission slugs to check
 * @param options Options for the check
 * @returns True if the user has any of the permissions
 */
export async function checkUserHasAnyPermission(
  supabase: SupabaseClient,
  permissionSlugs: string[],
  options?: {
    userId?: string;
    tenantSlug?: PlatformSlug;
    allowGuardianOverride?: boolean;
  }
): Promise<boolean> {
  const {
    userId,
    tenantSlug,
    allowGuardianOverride = true
  } = options || {};
  
  // Empty array always returns false
  if (permissionSlugs.length === 0) return false;
  
  // Get user ID if not provided
  let userIdToUse = userId;
  if (!userIdToUse) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    userIdToUse = user.id;
  }
  
  // Check if user is a guardian (platform admin)
  if (allowGuardianOverride) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_guardian')
      .eq('id', userIdToUse)
      .single();
    
    if (profile?.is_guardian) {
      return true;
    }
  }
  
  // Get all permissions for the user
  const { data: permissions } = await supabase.rpc('get_user_permissions', {
    _user_id: userIdToUse,
    _tenant_slug: tenantSlug
  });
  
  if (!permissions) return false;
  
  // Extract permission slugs from the result
  const userPermissionSlugs = permissions.map((p: any) => p.permission_slug);
  
  // Check if the user has any of the required permissions
  return permissionSlugs.some(slug => userPermissionSlugs.includes(slug));
}

/**
 * Get all permissions for a user in a tenant
 * 
 * @param supabase Supabase client
 * @param options Options for the query
 * @returns Array of permissions
 */
export async function getUserPermissions(
  supabase: SupabaseClient,
  options?: {
    userId?: string;
    tenantSlug?: PlatformSlug;
    includeMetadata?: boolean;
  }
): Promise<Permission[]> {
  const {
    userId,
    tenantSlug,
    includeMetadata = false
  } = options || {};
  
  // Get user ID if not provided
  let userIdToUse = userId;
  if (!userIdToUse) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    userIdToUse = user.id;
  }
  
  // Check if user is a guardian (platform admin)
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_guardian')
    .eq('id', userIdToUse)
    .single();
  
  // If user is a guardian, get all permissions
  if (profile?.is_guardian) {
    const { data: allPermissions } = await supabase
      .from('permissions')
      .select('id, slug, name, description, category');
    
    if (!allPermissions) return [];
    
    return allPermissions.map(p => ({
      ...p,
      granted_via: 'guardian',
      tenant_slug: tenantSlug
    }));
  }
  
  // Otherwise, get the user's specific permissions
  const { data: permissions } = await supabase.rpc('get_user_permissions', {
    _user_id: userIdToUse,
    _tenant_slug: tenantSlug
  });
  
  if (!permissions) return [];
  
  if (!includeMetadata) {
    return permissions.map((p: any) => ({
      id: p.permission_id,
      slug: p.permission_slug,
      name: p.permission_name,
      granted_via: p.granted_via,
      tenant_slug: tenantSlug
    }));
  }
  
  return permissions.map((p: any) => ({
    id: p.permission_id,
    slug: p.permission_slug,
    name: p.permission_name,
    description: p.permission_description,
    category: p.permission_category,
    granted_via: p.granted_via,
    tenant_slug: tenantSlug
  }));
}

/**
 * Get all permissions grouped by category
 * 
 * @param supabase Supabase client
 * @param options Options for the query
 * @returns Permissions grouped by category
 */
export async function getPermissionsByCategory(
  supabase: SupabaseClient,
  options?: {
    tenantSlug?: PlatformSlug;
  }
): Promise<Record<string, Permission[]>> {
  const { tenantSlug } = options || {};
  
  // Get all permissions
  let query = supabase
    .from('permissions')
    .select('id, slug, name, description, category')
    .order('category');
  
  // Filter by tenant if specified
  if (tenantSlug) {
    query = query.eq('tenant_slug', tenantSlug);
  }
  
  const { data: permissions } = await query;
  
  if (!permissions) return {};
  
  // Group by category
  const result: Record<string, Permission[]> = {};
  
  permissions.forEach(p => {
    const category = p.category || 'Uncategorized';
    if (!result[category]) {
      result[category] = [];
    }
    result[category].push(p);
  });
  
  return result;
}

/**
 * Get all roles for a tenant
 * 
 * @param supabase Supabase client
 * @param tenantSlug Tenant slug
 * @returns Array of roles with their permissions
 */
export async function getTenantRoles(
  supabase: SupabaseClient,
  tenantSlug: PlatformSlug
): Promise<any[]> {
  // Get tenant ID
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', tenantSlug)
    .single();
  
  if (!tenant) return [];
  
  // Get roles with permissions
  const { data: roles } = await supabase
    .from('tenant_roles')
    .select(`
      id,
      name,
      description,
      is_default,
      permissions:role_permissions(
        permission:permission_id(
          id,
          slug,
          name,
          description,
          category
        )
      )
    `)
    .eq('tenant_id', tenant.id);
  
  if (!roles) return [];
  
  // Format roles for easier consumption
  return roles.map(role => ({
    id: role.id,
    name: role.name,
    description: role.description,
    is_default: role.is_default,
    permissions: role.permissions.map((p: any) => p.permission)
  }));
} 