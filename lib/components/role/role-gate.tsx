'use client';

import React from 'react';
import { useRole } from '@/lib/context/role-context';
import { RoleType } from '@/lib/types/roles';

interface RoleGateProps {
  /**
   * Children to render if the role check passes
   */
  children: React.ReactNode;
  
  /**
   * Allowed roles - user must have one of these roles to view the content
   */
  allowedRoles?: RoleType | RoleType[];
  
  /**
   * Feature name to check for access (alternative to allowedRoles)
   */
  requiredFeature?: string;
  
  /**
   * Required action on the feature (used with requiredFeature)
   */
  requiredAction?: 'create' | 'edit' | 'delete' | 'approve';
  
  /**
   * If true, only admins can access the content
   */
  adminOnly?: boolean;
  
  /**
   * Content to show if access is denied (optional)
   */
  fallback?: React.ReactNode;
}

/**
 * RoleGate - Component that conditionally renders content based on user role
 *
 * This component can be used in multiple ways:
 * 1. Check against specific roles
 * 2. Check for access to a specific feature
 * 3. Check for ability to perform an action on a feature
 * 4. Check for admin status
 */
export const RoleGate: React.FC<RoleGateProps> = ({
  children,
  allowedRoles,
  requiredFeature,
  requiredAction,
  adminOnly = false,
  fallback = null,
}) => {
  const { hasRole, hasAccessTo, canPerform, isAdmin, isLoading } = useRole();
  
  // Don't render anything while roles are loading
  if (isLoading) {
    return null;
  }
  
  // Admin-only check
  if (adminOnly && !isAdmin) {
    return <>{fallback}</>;
  }
  
  // Feature access check with action
  if (requiredFeature && requiredAction) {
    return canPerform(requiredFeature, requiredAction) ? <>{children}</> : <>{fallback}</>;
  }
  
  // Feature access check without action
  if (requiredFeature) {
    return hasAccessTo(requiredFeature) ? <>{children}</> : <>{fallback}</>;
  }
  
  // Role check
  if (allowedRoles) {
    return hasRole(allowedRoles) ? <>{children}</> : <>{fallback}</>;
  }
  
  // Default: no restrictions, show the content
  return <>{children}</>;
}; 