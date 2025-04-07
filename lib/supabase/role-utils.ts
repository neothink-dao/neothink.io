import { createClient } from './client';
import { RoleType } from '../types/roles';

/**
 * Utility functions for checking user roles and permissions
 * These functions use the database RPC functions we created
 */

/**
 * Check if the current user has a specific role
 */
export const hasRole = async (roleSlug: RoleType, tenantId?: string): Promise<boolean> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data, error } = await supabase.rpc('user_has_role', {
    _user_id: user.id,
    _role_slug: roleSlug,
    _tenant_id: tenantId || null
  });
  
  if (error) {
    console.error('Error checking role:', error);
    return false;
  }
  
  return !!data;
};

/**
 * Check if the current user is an admin
 */
export const isAdmin = async (tenantId?: string): Promise<boolean> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data, error } = await supabase.rpc('user_is_admin', {
    _user_id: user.id,
    _tenant_id: tenantId || null
  });
  
  if (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
  
  return !!data;
};

/**
 * Check if the current user has at least the specified role priority
 */
export const hasMinRolePriority = async (minPriority: number, tenantId?: string): Promise<boolean> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data, error } = await supabase.rpc('user_has_min_role_priority', {
    _user_id: user.id,
    _min_priority: minPriority,
    _tenant_id: tenantId || null
  });
  
  if (error) {
    console.error('Error checking role priority:', error);
    return false;
  }
  
  return !!data;
};

/**
 * Check if the current user can access a feature
 */
export const canAccessFeature = async (featureName: string, tenantId?: string): Promise<boolean> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data, error } = await supabase.rpc('user_can_access_feature', {
    _user_id: user.id,
    _feature_name: featureName,
    _tenant_id: tenantId || null
  });
  
  if (error) {
    console.error('Error checking feature access:', error);
    return false;
  }
  
  return !!data;
};

/**
 * Check if the current user can perform an action on a feature
 */
export const canPerformAction = async (
  featureName: string,
  action: 'create' | 'edit' | 'delete' | 'approve',
  tenantId?: string
): Promise<boolean> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data, error } = await supabase.rpc('user_can_perform_action', {
    _user_id: user.id,
    _feature_name: featureName,
    _action: action,
    _tenant_id: tenantId || null
  });
  
  if (error) {
    console.error('Error checking action permission:', error);
    return false;
  }
  
  return !!data;
};

/**
 * Get the current user's role in a tenant
 */
export interface UserRole {
  roleId: string;
  roleName: string;
  roleSlug: string;
  roleCategory: 'member' | 'admin';
  rolePriority: number;
  tenantId: string;
  tenantName: string;
}

export const getUserRole = async (tenantId?: string): Promise<UserRole | null> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase.rpc('get_user_role', {
    _user_id: user.id,
    _tenant_id: tenantId || null
  });
  
  if (error) {
    console.error('Error getting user role:', error);
    return null;
  }
  
  if (!data || data.length === 0) return null;
  
  // Transform the data to camelCase for consistency
  return {
    roleId: data[0].role_id,
    roleName: data[0].role_name,
    roleSlug: data[0].role_slug as RoleType,
    roleCategory: data[0].role_category as 'member' | 'admin',
    rolePriority: data[0].role_priority,
    tenantId: data[0].tenant_id,
    tenantName: data[0].tenant_name
  };
};

/**
 * Get the current user's capabilities in a tenant
 */
export interface UserCapability {
  featureName: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  tenantId: string;
  tenantName: string;
}

export const getUserCapabilities = async (tenantId?: string): Promise<UserCapability[]> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  const { data, error } = await supabase.rpc('get_user_capabilities', {
    _user_id: user.id,
    _tenant_id: tenantId || null
  });
  
  if (error) {
    console.error('Error getting user capabilities:', error);
    return [];
  }
  
  if (!data || data.length === 0) return [];
  
  // Transform the data to camelCase for consistency
  return data.map(item => ({
    featureName: item.feature_name,
    canView: item.can_view,
    canCreate: item.can_create,
    canEdit: item.can_edit,
    canDelete: item.can_delete,
    canApprove: item.can_approve,
    tenantId: item.tenant_id,
    tenantName: item.tenant_name
  }));
}; 