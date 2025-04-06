import React, { ReactNode } from 'react';
import { useAuthContext } from '../../hooks/useAuth';

interface PlatformGateProps {
  /**
   * The platform slug required to render the children (e.g. 'neothink', 'ascenders')
   */
  platform?: string;
  
  /**
   * Array of platform slugs - user must have access to at least one to render the children
   */
  anyPlatform?: string[];
  
  /**
   * Array of platform slugs - user must have access to all to render the children
   */
  allPlatforms?: string[];
  
  /**
   * If true, renders the children only if the user is authenticated
   */
  requireAuth?: boolean;
  
  /**
   * The content to render if the user has the required platform access
   */
  children: ReactNode;
  
  /**
   * Optional content to render if the user doesn't have the required platform access
   */
  fallback?: ReactNode;
}

/**
 * PlatformGate conditionally renders children based on user's platform access
 * 
 * This component can be used to hide UI elements or functionality that
 * the current user doesn't have access to on specific platforms.
 * 
 * @example
 * // Only show content to users with access to Neothinkers platform
 * <PlatformGate platform="neothinkers">
 *   <NeothinkersContent />
 * </PlatformGate>
 * 
 * @example
 * // Show content to users with access to any of these platforms
 * <PlatformGate anyPlatform={["ascenders", "neothinkers"]}>
 *   <SharedContent />
 * </PlatformGate>
 */
export default function PlatformGate({
  platform,
  anyPlatform,
  allPlatforms,
  requireAuth = true,
  children,
  fallback = null
}: PlatformGateProps) {
  const { isAuthenticated, hasPlatformAccess, isLoading } = useAuthContext();
  
  // While loading, don't render anything
  if (isLoading) {
    return null;
  }
  
  // If authentication is required, check if the user is authenticated
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }
  
  // If a specific platform is required
  if (platform && !hasPlatformAccess(platform)) {
    return <>{fallback}</>;
  }
  
  // If access to any of the platforms is required
  if (anyPlatform && anyPlatform.length > 0) {
    const hasAny = anyPlatform.some(p => hasPlatformAccess(p));
    if (!hasAny) {
      return <>{fallback}</>;
    }
  }
  
  // If access to all platforms is required
  if (allPlatforms && allPlatforms.length > 0) {
    const hasAll = allPlatforms.every(p => hasPlatformAccess(p));
    if (!hasAll) {
      return <>{fallback}</>;
    }
  }
  
  // If we've reached here, the user has the required platform access
  return <>{children}</>;
}

// Export a higher-order component version
export function withPlatformAccess(
  Component: React.ComponentType<any>,
  platformOptions: Omit<PlatformGateProps, 'children' | 'fallback'>
) {
  return function PlatformWrapped(props: any) {
    return (
      <PlatformGate {...platformOptions}>
        <Component {...props} />
      </PlatformGate>
    );
  };
} 