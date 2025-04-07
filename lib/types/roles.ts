/**
 * User and Admin Role Types for the Neothink Ecosystem
 */

// Role categories
export type RoleCategory = 'member' | 'admin';

// User role types
export type UserRoleType = 'subscriber' | 'participant' | 'contributor';

// Admin role types
export type AdminRoleType = 'associate' | 'builder' | 'partner';

// Combined role type
export type RoleType = UserRoleType | AdminRoleType;

// Full role interface
export interface Role {
  id: string;
  tenantId: string;
  name: string;
  slug: RoleType;
  description: string;
  isSystemRole: boolean;
  roleCategory: RoleCategory;
  priority: number;
}

// Permission capabilities for a role
export interface RoleCapability {
  id: string;
  tenantId: string;
  roleSlug: RoleType;
  featureName: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
}

// Helper functions to check role types
export const isUserRole = (role: Role): boolean => role.roleCategory === 'member';
export const isAdminRole = (role: Role): boolean => role.roleCategory === 'admin';

// Role hierarchy helpers
export const getRolePriority = (role: Role): number => role.priority;

export const hasHigherPriorityThan = (role1: Role, role2: Role): boolean => {
  return getRolePriority(role1) > getRolePriority(role2);
};

// Role access control helpers
export const canAccessFeature = (role: Role, featureName: string, capabilities: RoleCapability[]): boolean => {
  const capability = capabilities.find(
    cap => cap.roleSlug === role.slug && cap.featureName === featureName
  );
  
  return capability ? capability.canView : false;
};

export const canPerformAction = (
  role: Role,
  featureName: string,
  action: 'create' | 'edit' | 'delete' | 'approve',
  capabilities: RoleCapability[]
): boolean => {
  const capability = capabilities.find(
    cap => cap.roleSlug === role.slug && cap.featureName === featureName
  );
  
  if (!capability) return false;
  
  switch (action) {
    case 'create': return capability.canCreate;
    case 'edit': return capability.canEdit;
    case 'delete': return capability.canDelete;
    case 'approve': return capability.canApprove;
    default: return false;
  }
};

// Default permissions by role (for reference)
export const DefaultRolePermissions: Record<RoleType, {
  description: string;
  canCreateContent: boolean;
  canEditContent: boolean;
  canModerateOthers: boolean;
  canAccessAdmin: boolean;
}> = {
  // User Roles
  subscriber: {
    description: 'Basic access to platform content',
    canCreateContent: false,
    canEditContent: false,
    canModerateOthers: false,
    canAccessAdmin: false
  },
  participant: {
    description: 'Can participate in community activities',
    canCreateContent: true,
    canEditContent: false,
    canModerateOthers: false,
    canAccessAdmin: false
  },
  contributor: {
    description: 'Can contribute content and lead discussions',
    canCreateContent: true,
    canEditContent: true,
    canModerateOthers: false,
    canAccessAdmin: false
  },
  
  // Admin Roles
  associate: {
    description: 'Admin role focused on helping and support',
    canCreateContent: true,
    canEditContent: true,
    canModerateOthers: true,
    canAccessAdmin: true
  },
  builder: {
    description: 'Admin role focused on building and development',
    canCreateContent: true,
    canEditContent: true,
    canModerateOthers: true,
    canAccessAdmin: true
  },
  partner: {
    description: 'Admin role with funding capabilities and strategic direction',
    canCreateContent: true,
    canEditContent: true,
    canModerateOthers: true,
    canAccessAdmin: true
  }
}; 