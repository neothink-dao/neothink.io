import React from 'react';
import { usePlatformAccess } from '../hooks/usePlatformAccess';
import { usePermissions } from '../hooks/usePermissions';
import LoadingSpinner from './ui/LoadingSpinner';
import AccessDenied from './ui/AccessDenied';

export type ProtectedRouteProps = {
  /** Content to render when access is granted */
  children: React.ReactNode;
  /** Required platform slug for access (defaults to current platform) */
  requiredPlatform?: string;
  /** Where to redirect if no access is granted */
  redirectTo?: string;
  /** Custom component to show during loading state */
  loadingComponent?: React.ReactNode;
  /** Custom component to show when access is denied */
  accessDeniedComponent?: React.ReactNode;
  /** Specific permission required (beyond platform access) */
  requiredPermission?: string;
  /** Whether to allow guardians to bypass permission checks */
  allowGuardianOverride?: boolean;
  /** Custom logic for additional access rules */
  customAccessCheck?: () => boolean;
  /** Handler for logging access denial (useful for analytics) */
  onAccessDenied?: (reason: string) => void;
};

/**
 * A component that protects routes requiring authentication and platform access
 * Shows loading state while checking, redirects to login if not authenticated,
 * and redirects to hub if lacking platform access
 * 
 * Enhanced version with permission support and more flexibility
 */
export default function ProtectedRoute({
  children,
  requiredPlatform,
  redirectTo,
  loadingComponent,
  accessDeniedComponent,
  requiredPermission,
  allowGuardianOverride = true,
  customAccessCheck,
  onAccessDenied
}: ProtectedRouteProps) {
  // Get platform access status
  const {
    hasAccess: hasPlatformAccess,
    isLoading: isPlatformLoading,
    isAccessChecked: isPlatformAccessChecked,
    requestAccess,
    user,
    platformSlug
  } = usePlatformAccess({
    requiredPlatform,
    redirectTo
  });

  // Get permissions for additional checks
  const { 
    hasPermission, 
    isGuardian, 
    loading: isPermissionLoading 
  } = usePermissions();

  // Determine overall loading state
  const isLoading = isPlatformLoading || 
    (requiredPermission && isPermissionLoading);

  // Check permission if required
  const hasRequiredPermission = !requiredPermission || 
    hasPermission(requiredPermission) || 
    (allowGuardianOverride && isGuardian);

  // Check custom access rules if provided
  const passesCustomCheck = !customAccessCheck || customAccessCheck();

  // Determine if all access checks pass
  const hasFullAccess = hasPlatformAccess && 
    hasRequiredPermission && 
    passesCustomCheck;

  // Log access denial if handler provided
  React.useEffect(() => {
    if (user && isPlatformAccessChecked && !isLoading && !hasFullAccess && onAccessDenied) {
      let reason = 'Access denied';
      if (!hasPlatformAccess) reason = `No access to platform: ${platformSlug}`;
      else if (!hasRequiredPermission) reason = `Missing permission: ${requiredPermission}`;
      else if (!passesCustomCheck) reason = 'Failed custom access check';
      
      onAccessDenied(reason);
    }
  }, [hasPlatformAccess, hasRequiredPermission, passesCustomCheck, isPlatformAccessChecked, isLoading, user]);

  // Show loading state while checking authentication and access
  if (isLoading) {
    return loadingComponent || <LoadingSpinner />;
  }

  // Show access denied if the user is authenticated but doesn't have full access
  if (user && isPlatformAccessChecked && !hasFullAccess) {
    // Determine the specific reason for access denial for a better user message
    let accessDeniedReason = '';
    
    if (!hasPlatformAccess) {
      accessDeniedReason = 'subscription';
    } else if (!hasRequiredPermission) {
      accessDeniedReason = 'permission';
    } else {
      accessDeniedReason = 'custom';
    }
    
    return accessDeniedComponent || (
      <AccessDenied
        platformName={platformSlug}
        onRequestAccess={requestAccess}
        reason={accessDeniedReason}
        permissionName={requiredPermission}
      />
    );
  }

  // If the user has access, render the children
  if (hasFullAccess) {
    return <>{children}</>;
  }

  // Return null during access checking to avoid flashes of content
  return null;
} 