import { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useTenant } from '../context/TenantContext';

type Permission = {
  permission_slug: string;
  permission_name: string;
  permission_category: string;
  permission_scope: string;
  granted_via: string;
};

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuardian, setIsGuardian] = useState<boolean>(false);
  const { currentTenant } = useTenant();
  const supabase = useSupabaseClient();
  const user = useUser();
  
  // Fetch permissions when the user or tenant changes
  useEffect(() => {
    if (user) {
      fetchUserPermissions();
      checkIfGuardian();
    } else {
      setPermissions([]);
      setIsGuardian(false);
      setLoading(false);
    }
  }, [user, currentTenant]);
  
  // Check if the user is a guardian (super admin)
  const checkIfGuardian = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('is_guardian')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error checking guardian status:', error);
      setIsGuardian(false);
    } else {
      setIsGuardian(data?.is_guardian || false);
    }
  };
  
  // Fetch user permissions
  const fetchUserPermissions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_user_permissions', {
        _user_id: user.id,
        _tenant_slug: currentTenant?.slug || null
      });
      
      if (error) throw error;
      
      setPermissions(data || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Check if user has a specific permission
  const hasPermission = useCallback(
    (permissionSlug: string): boolean => {
      // Guardians have all permissions
      if (isGuardian) return true;
      
      // Check if the user has the specific permission
      return permissions.some(p => p.permission_slug === permissionSlug);
    },
    [permissions, isGuardian]
  );
  
  // Check if user has any of the given permissions
  const hasAnyPermission = useCallback(
    (permissionSlugs: string[]): boolean => {
      // Guardians have all permissions
      if (isGuardian) return true;
      
      // Check if the user has any of the specified permissions
      return permissions.some(p => permissionSlugs.includes(p.permission_slug));
    },
    [permissions, isGuardian]
  );
  
  // Get all permissions in a specific category
  const getPermissionsByCategory = useCallback(
    (category: string): Permission[] => {
      return permissions.filter(p => p.permission_category === category);
    },
    [permissions]
  );
  
  return {
    permissions,
    loading,
    isGuardian,
    hasPermission,
    hasAnyPermission,
    getPermissionsByCategory,
    refresh: fetchUserPermissions
  };
} 