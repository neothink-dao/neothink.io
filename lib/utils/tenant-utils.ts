import { createClient } from '../supabase/server';
import { cookies } from 'next/headers';

export type TenantDetails = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  settings?: Record<string, any>;
  branding?: Record<string, any>;
  status: string;
  userCount: number;
  domain?: string;
  subscriptionStatus?: string;
  subscriptionPlan?: string;
};

export type UserTenant = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  branding?: {
    logo_url?: string;
    primary_color?: string;
  };
  role: string;
  primary_domain?: string;
  is_active: boolean;
};

/**
 * Get tenant details by slug
 */
export async function getTenantBySlug(slug: string): Promise<TenantDetails | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .rpc('get_tenant_by_slug', { _slug: slug });
  
  if (error || !data || data.length === 0) {
    return null;
  }
  
  return {
    id: data[0].id,
    name: data[0].name,
    slug: data[0].slug,
    description: data[0].description,
    settings: data[0].settings,
    branding: data[0].branding,
    status: data[0].status,
    userCount: data[0].user_count,
    domain: data[0].domain,
    subscriptionStatus: data[0].subscription_status,
    subscriptionPlan: data[0].subscription_plan
  };
}

/**
 * Get all tenants that a user has access to
 */
export async function getUserAccessibleTenants(userId: string): Promise<UserTenant[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('get_user_accessible_tenants', {
    _user_id: userId
  });
  
  if (error || !data) {
    console.error('Error fetching user accessible tenants:', error);
    return [];
  }
  
  return data;
}

/**
 * Add a user to a tenant
 */
export async function addUserToTenant(
  userId: string,
  tenantId: string,
  role: string = 'member'
): Promise<boolean> {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('add_user_to_tenant', {
    _user_id: userId,
    _tenant_id: tenantId,
    _role: role
  });
  
  if (error) {
    console.error('Error adding user to tenant:', error);
    return false;
  }
  
  return data || false;
}

/**
 * Remove a user from a tenant
 */
export async function removeUserFromTenant(
  userId: string,
  tenantSlug: string
): Promise<boolean> {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('remove_user_from_tenant', {
    _user_id: userId,
    _tenant_slug: tenantSlug
  });
  
  if (error) {
    console.error('Error removing user from tenant:', error);
    return false;
  }
  
  return data || false;
}

/**
 * Create a new tenant
 */
export async function createTenant(
  name: string,
  slug: string,
  description: string,
  adminUserId: string
): Promise<string | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('create_tenant', {
    _name: name,
    _slug: slug,
    _description: description,
    _admin_user_id: adminUserId
  });
  
  if (error || !data) {
    console.error('Error creating tenant:', error);
    return null;
  }
  
  return data;
}

/**
 * Get analytics data for a tenant
 */
export async function getTenantAnalytics(
  tenantId: string,
  startDate?: Date,
  endDate?: Date
): Promise<any> {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('get_tenant_analytics', {
    _tenant_id: tenantId,
    _start_date: startDate?.toISOString() || null,
    _end_date: endDate?.toISOString() || null
  });
  
  if (error) {
    console.error('Error getting tenant analytics:', error);
    return null;
  }
  
  return data;
}

/**
 * Check if a user has access to a specific tenant
 */
export async function checkUserTenantAccess(
  userId: string,
  tenantSlug: string
): Promise<boolean> {
  const supabase = createClient();
  
  const { data: tenants } = await supabase.rpc('get_user_accessible_tenants', {
    _user_id: userId
  });
  
  if (!tenants) return false;
  
  return tenants.some(tenant => tenant.slug === tenantSlug && tenant.is_active);
} 