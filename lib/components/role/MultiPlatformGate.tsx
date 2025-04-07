'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { useRole } from '@/lib/context/role-context';
import { RoleType } from '@/lib/types/roles';
import { createClient } from '@/lib/supabase/client';

interface Platform {
  slug: string;
  name: string;
  hasAccess: boolean;
}

interface MultiPlatformGateProps {
  /**
   * Children to render if the conditions are met
   */
  children: ReactNode;
  
  /**
   * Which platforms are required to access this content
   */
  requiredPlatforms?: string[];
  
  /**
   * Minimum role required across specified platforms
   */
  minRole?: RoleType;
  
  /**
   * Whether to require all platforms (true) or any platform (false)
   */
  requireAllPlatforms?: boolean;
  
  /**
   * Content to show if access is denied
   */
  fallback?: ReactNode;
  
  /**
   * Whether to show a platform switcher
   */
  showPlatformSwitcher?: boolean;
}

export const MultiPlatformGate: React.FC<MultiPlatformGateProps> = ({
  children,
  requiredPlatforms = [],
  minRole = 'subscriber',
  requireAllPlatforms = false,
  fallback = null,
  showPlatformSwitcher = false,
}) => {
  const { hasRole, isLoading } = useRole();
  const [userPlatforms, setUserPlatforms] = useState<Platform[]>([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch user's platform access
  useEffect(() => {
    const fetchPlatformAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        // Get profile with platform info
        const { data: profileData } = await supabase
          .from('profiles')
          .select('platforms')
          .eq('user_id', user.id)
          .single();
          
        // Get all available tenants/platforms
        const { data: tenants } = await supabase
          .from('tenants')
          .select('id, name, slug');
          
        if (!tenants) return;
        
        // Map user access to each platform
        const platforms: Platform[] = tenants.map(tenant => ({
          slug: tenant.slug,
          name: tenant.name,
          hasAccess: profileData?.platforms?.includes(tenant.slug) || false
        }));
        
        setUserPlatforms(platforms);
        
        // Set current platform based on URL if possible, or first platform with access
        const url = window.location.hostname;
        const platformFromUrl = platforms.find(p => url.includes(p.slug));
        
        if (platformFromUrl) {
          setCurrentPlatform(platformFromUrl.slug);
        } else {
          // Use first platform with access
          const firstWithAccess = platforms.find(p => p.hasAccess);
          if (firstWithAccess) {
            setCurrentPlatform(firstWithAccess.slug);
          }
        }
      } catch (error) {
        console.error('Error fetching platform access:', error);
      }
    };
    
    fetchPlatformAccess();
  }, [supabase]);
  
  // Determine access based on platforms and roles
  useEffect(() => {
    if (isLoading || userPlatforms.length === 0) return;
    
    // If no specific platforms required, check role only
    if (requiredPlatforms.length === 0) {
      setHasAccess(hasRole(minRole));
      return;
    }
    
    // Check each required platform
    const platformAccessList = requiredPlatforms.map(platform => {
      const userPlatform = userPlatforms.find(p => p.slug === platform);
      return userPlatform?.hasAccess || false;
    });
    
    // Determine access based on all or any requirement
    if (requireAllPlatforms) {
      setHasAccess(platformAccessList.every(Boolean) && hasRole(minRole));
    } else {
      setHasAccess(platformAccessList.some(Boolean) && hasRole(minRole));
    }
  }, [userPlatforms, requiredPlatforms, requireAllPlatforms, minRole, hasRole, isLoading]);
  
  // Platform switcher handler
  const handlePlatformChange = (platformSlug: string) => {
    // You could implement redirects here based on platform
    setCurrentPlatform(platformSlug);
  };
  
  // Show loading state
  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-32 rounded-md"></div>;
  }
  
  // Show content if user has access
  if (hasAccess) {
    return (
      <>
        {showPlatformSwitcher && userPlatforms.length > 0 && (
          <div className="mb-4 flex items-center space-x-2">
            <span className="text-sm font-medium">Platform:</span>
            <select 
              value={currentPlatform || ''}
              onChange={(e) => handlePlatformChange(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm"
            >
              {userPlatforms
                .filter(p => p.hasAccess)
                .map(platform => (
                  <option key={platform.slug} value={platform.slug}>
                    {platform.name}
                  </option>
                ))
              }
            </select>
          </div>
        )}
        {children}
      </>
    );
  }
  
  // Show fallback if no access
  return <>{fallback}</>;
}; 