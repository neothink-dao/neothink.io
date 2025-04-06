import React, { ReactNode } from 'react';
import { usePermissions } from '../../hooks/usePermissions';

interface PermissionGateProps {
  /**
   * The permission slug required to render the children
   */
  permission?: string;
  
  /**
   * Array of permission slugs - user must have at least one to render the children
   */
  anyPermission?: string[];
  
  /**
   * Array of permission slugs - user must have all to render the children
   */
  allPermissions?: string[];
  
  /**
   * If true, renders the children only if the user is a guardian
   */
  requireGuardian?: boolean;
  
  /**
   * The content to render if the user has the required permissions
   */
  children: ReactNode;
  
  /**
   * Optional content to render if the user doesn't have the required permissions
   */
  fallback?: ReactNode;
}

/**
 * PermissionGate conditionally renders children based on user permissions
 * 
 * This component can be used to hide UI elements or functionality that
 * the current user doesn't have access to.
 */
export default function PermissionGate({
  permission,
  anyPermission,
  allPermissions,
  requireGuardian = false,
  children,
  fallback = null
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, isGuardian, loading } = usePermissions();
  
  // While loading, don't render anything
  if (loading) {
    return null;
  }
  
  // If guardians are required, check if the user is a guardian
  if (requireGuardian && !isGuardian) {
    return <>{fallback}</>;
  }
  
  // If a specific permission is required
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }
  
  // If any of the permissions is required
  if (anyPermission && anyPermission.length > 0 && !hasAnyPermission(anyPermission)) {
    return <>{fallback}</>;
  }
  
  // If all permissions are required
  if (allPermissions && allPermissions.length > 0) {
    const hasAll = allPermissions.every(p => hasPermission(p));
    if (!hasAll) {
      return <>{fallback}</>;
    }
  }
  
  // If we've reached here, the user has the required permissions
  return <>{children}</>;
}

// Export a higher-order component version
export function withPermission(
  Component: React.ComponentType<any>,
  permissionOptions: Omit<PermissionGateProps, 'children' | 'fallback'>
) {
  return function PermissionWrapped(props: any) {
    return (
      <PermissionGate {...permissionOptions}>
        <Component {...props} />
      </PermissionGate>
    );
  };
} 