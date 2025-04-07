'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, RoleType, RoleCapability, canAccessFeature as checkAccessFeature, canPerformAction as checkAction } from '@/lib/types/roles';
import { createClient } from '@/lib/supabase/client';
import { 
  getUserRole, 
  getUserCapabilities, 
  hasRole as checkUserHasRole, 
  isAdmin as checkUserIsAdmin,
  canAccessFeature,
  canPerformAction,
  UserCapability
} from '@/lib/supabase/role-utils';

interface RoleContextProps {
  currentRole: Role | null;
  isLoading: boolean;
  capabilities: RoleCapability[];
  hasRole: (roles: RoleType | RoleType[]) => boolean;
  hasAccessTo: (featureName: string) => boolean;
  canPerform: (featureName: string, action: 'create' | 'edit' | 'delete' | 'approve') => boolean;
  isAdmin: boolean;
  // New methods that use database functions
  checkRoleAsync: (roles: RoleType | RoleType[], tenantId?: string) => Promise<boolean>;
  checkAccessAsync: (featureName: string, tenantId?: string) => Promise<boolean>;
  checkActionAsync: (featureName: string, action: 'create' | 'edit' | 'delete' | 'approve', tenantId?: string) => Promise<boolean>;
}

const RoleContext = createContext<RoleContextProps | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [capabilities, setCapabilities] = useState<RoleCapability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rawCapabilities, setRawCapabilities] = useState<UserCapability[]>([]);
  const supabase = createClient();

  // Fetch the user's role and capabilities
  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Get user's role using the new database function
        const roleData = await getUserRole();
        
        if (!roleData) {
          setIsLoading(false);
          return;
        }

        // Format role data to match our interface
        const role: Role = {
          id: roleData.roleId,
          tenantId: roleData.tenantId,
          name: roleData.roleName,
          slug: roleData.roleSlug as RoleType,
          description: '',  // Not returned from the function
          isSystemRole: false, // Not returned from the function
          roleCategory: roleData.roleCategory,
          priority: roleData.rolePriority
        };

        setCurrentRole(role);

        // Get role capabilities using the new database function
        const capabilityData = await getUserCapabilities();
        
        // Store raw capabilities for direct database checks
        setRawCapabilities(capabilityData);
        
        // Format capabilities to match our interface
        const formattedCapabilities: RoleCapability[] = capabilityData.map(cap => ({
          id: '', // Not provided by the function
          tenantId: cap.tenantId,
          roleSlug: role.slug,
          featureName: cap.featureName,
          canView: cap.canView,
          canCreate: cap.canCreate,
          canEdit: cap.canEdit,
          canDelete: cap.canDelete,
          canApprove: cap.canApprove
        }));
        
        setCapabilities(formattedCapabilities);
      } catch (error) {
        console.error('Error in role context:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoleData();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchRoleData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Check if user has a specific role (client-side)
  const hasRole = (roleCheck: RoleType | RoleType[]): boolean => {
    if (!currentRole) return false;
    
    if (Array.isArray(roleCheck)) {
      return roleCheck.includes(currentRole.slug);
    }
    
    return currentRole.slug === roleCheck;
  };

  // Check if user has access to a feature (client-side)
  const hasAccessTo = (featureName: string): boolean => {
    if (!currentRole) return false;
    
    // First check raw capabilities from DB for exact match
    const exactCapability = rawCapabilities.find(cap => cap.featureName === featureName);
    if (exactCapability) {
      return exactCapability.canView;
    }
    
    // Fall back to the helper function in roles.ts
    return checkAccessFeature(currentRole, featureName, capabilities);
  };

  // Check if user can perform a specific action on a feature (client-side)
  const canPerform = (
    featureName: string,
    action: 'create' | 'edit' | 'delete' | 'approve'
  ): boolean => {
    if (!currentRole) return false;
    
    // First check raw capabilities from DB for exact match
    const exactCapability = rawCapabilities.find(cap => cap.featureName === featureName);
    if (exactCapability) {
      switch (action) {
        case 'create': return exactCapability.canCreate;
        case 'edit': return exactCapability.canEdit;
        case 'delete': return exactCapability.canDelete;
        case 'approve': return exactCapability.canApprove;
        default: return false;
      }
    }
    
    // Fall back to the helper function in roles.ts
    return checkAction(currentRole, featureName, action, capabilities);
  };
  
  // Server-side role check using RPC functions
  const checkRoleAsync = async (roleCheck: RoleType | RoleType[], tenantId?: string): Promise<boolean> => {
    if (Array.isArray(roleCheck)) {
      // Check each role, return true if any match
      for (const role of roleCheck) {
        const hasThisRole = await checkUserHasRole(role, tenantId);
        if (hasThisRole) return true;
      }
      return false;
    }
    
    return checkUserHasRole(roleCheck, tenantId);
  };
  
  // Server-side feature access check using RPC functions
  const checkAccessAsync = async (featureName: string, tenantId?: string): Promise<boolean> => {
    return await canAccessFeature(featureName, tenantId);
  };
  
  // Server-side action permission check using RPC functions
  const checkActionAsync = async (
    featureName: string, 
    action: 'create' | 'edit' | 'delete' | 'approve',
    tenantId?: string
  ): Promise<boolean> => {
    return await canPerformAction(featureName, action, tenantId);
  };

  // Check if user has admin role
  const isAdmin = currentRole?.roleCategory === 'admin';

  const value = {
    currentRole,
    isLoading,
    capabilities,
    hasRole,
    hasAccessTo,
    canPerform,
    isAdmin,
    // New async methods
    checkRoleAsync,
    checkAccessAsync,
    checkActionAsync
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = (): RoleContextProps => {
  const context = useContext(RoleContext);
  
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  
  return context;
}; 