'use client';

import React, { useState, useEffect } from 'react';
import { useRole } from '@/lib/context/role-context';
import { createClient } from '@/lib/supabase/client';
import { RoleGate } from '../role/role-gate';

interface Platform {
  id: string;
  name: string;
  slug: string;
  hasAccess: boolean;
  role?: string;
}

interface Feature {
  name: string;
  slug: string;
  description: string;
  isUnlocked: boolean;
  platform: string;
}

export const MemberDashboard = () => {
  const { currentRole, isLoading, hasRole, hasAccessTo } = useRole();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const supabase = createClient();
  
  // Fetch user's platforms and features
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoadingData(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoadingData(false);
          return;
        }
        
        // Get platforms
        const { data: tenantData } = await supabase
          .from('tenants')
          .select('id, name, slug');
          
        // Get user profile with platform access info
        const { data: profileData } = await supabase
          .from('profiles')
          .select('platforms, tenant_id, role_id')
          .eq('user_id', user.id);
          
        // Get user roles across platforms
        const { data: rolesData } = await supabase
          .from('tenant_roles')
          .select('id, name, slug, tenant_id');
          
        if (tenantData && profileData && rolesData) {
          // Map user's platform access and roles
          const platformsWithAccess = tenantData.map(tenant => {
            const profile = profileData.find(p => p.tenant_id === tenant.id);
            const hasAccess = profile || 
              (profileData[0]?.platforms && 
               Array.isArray(profileData[0].platforms) && 
               profileData[0].platforms.includes(tenant.slug));
               
            const role = profile ? 
              rolesData.find(r => r.id === profile.role_id)?.slug : 
              undefined;
              
            return {
              id: tenant.id,
              name: tenant.name,
              slug: tenant.slug,
              hasAccess: !!hasAccess,
              role
            };
          });
          
          setPlatforms(platformsWithAccess);
          
          // Create placeholder features based on role capabilities
          const unlockedFeatures: Feature[] = [];
          
          // Hub features
          if (platformsWithAccess.some(p => p.slug === 'hub' && p.hasAccess)) {
            unlockedFeatures.push({
              name: 'Platform Overview',
              slug: 'platform_overview',
              description: 'See your progress across all platforms',
              isUnlocked: true,
              platform: 'hub'
            });
            
            if (hasRole('contributor') || hasRole('participant')) {
              unlockedFeatures.push({
                name: 'Cross-Platform Insights',
                slug: 'cross_platform_insights',
                description: 'Get insights across your platforms',
                isUnlocked: true,
                platform: 'hub'
              });
            }
          }
          
          // Ascenders features
          if (platformsWithAccess.some(p => p.slug === 'ascenders' && p.hasAccess)) {
            unlockedFeatures.push({
              name: 'Business Growth Tools',
              slug: 'business_tools',
              description: 'Tools for growing your business',
              isUnlocked: hasAccessTo('business_tools'),
              platform: 'ascenders'
            });
            
            unlockedFeatures.push({
              name: 'Prosperity Framework',
              slug: 'prosperity_framework',
              description: 'Framework for building prosperity',
              isUnlocked: hasRole(['contributor', 'partner', 'builder']),
              platform: 'ascenders'
            });
          }
          
          // Neothinkers features
          if (platformsWithAccess.some(p => p.slug === 'neothinkers' && p.hasAccess)) {
            unlockedFeatures.push({
              name: 'Thought Exercises',
              slug: 'thought_exercises',
              description: 'Exercises to develop integrated thinking',
              isUnlocked: hasAccessTo('thought_exercises'),
              platform: 'neothinkers'
            });
            
            unlockedFeatures.push({
              name: 'Concept Explorer',
              slug: 'concepts',
              description: 'Explore key Neothink concepts',
              isUnlocked: hasAccessTo('concepts'),
              platform: 'neothinkers'
            });
          }
          
          // Immortals features
          if (platformsWithAccess.some(p => p.slug === 'immortals' && p.hasAccess)) {
            unlockedFeatures.push({
              name: 'Health Dashboard',
              slug: 'health_dashboard',
              description: 'Track your health markers',
              isUnlocked: hasAccessTo('health_dashboard'),
              platform: 'immortals'
            });
            
            unlockedFeatures.push({
              name: 'Longevity Protocols',
              slug: 'longevity_protocols',
              description: 'Protocols for extending healthy lifespan',
              isUnlocked: hasRole(['contributor', 'partner', 'builder']),
              platform: 'immortals'
            });
          }
          
          setFeatures(unlockedFeatures);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    if (!isLoading) {
      loadDashboardData();
    }
  }, [supabase, isLoading, hasRole, hasAccessTo]);
  
  if (isLoading || isLoadingData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {currentRole ? currentRole.name : 'Member'}
        </h1>
        <p className="text-gray-600">
          Your dashboard across the Neothink ecosystem
        </p>
      </div>
      
      {/* Platform Access Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Your Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map(platform => (
            <div 
              key={platform.id}
              className={`border rounded-lg p-4 ${
                platform.hasAccess 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <h3 className="font-medium mb-1">{platform.name}</h3>
              {platform.hasAccess ? (
                <>
                  <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 mb-2">
                    Active
                  </span>
                  {platform.role && (
                    <p className="text-sm text-gray-600">
                      Role: {platform.role.charAt(0).toUpperCase() + platform.role.slice(1)}
                    </p>
                  )}
                  <a 
                    href={`https://${platform.slug === 'hub' ? 'go.neothink.io' : `join${platform.slug}.org`}`}
                    className="block mt-2 text-sm text-blue-600 hover:underline"
                  >
                    Visit Platform
                  </a>
                </>
              ) : (
                <>
                  <span className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 mb-2">
                    Inactive
                  </span>
                  <p className="text-sm text-gray-500">
                    Upgrade to access this platform
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Features Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Your Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(feature => (
            <div 
              key={feature.slug}
              className={`border rounded-lg p-4 ${
                feature.isUnlocked 
                  ? 'border-blue-200' 
                  : 'border-gray-200 opacity-75'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{feature.name}</h3>
                {feature.isUnlocked ? (
                  <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Unlocked
                  </span>
                ) : (
                  <span className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                    Locked
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {feature.description}
              </p>
              <span className="inline-block px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                {feature.platform.charAt(0).toUpperCase() + feature.platform.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Admin Section */}
      <RoleGate adminOnly>
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-gray-700 mb-4">
              As an admin, you have access to additional platform controls.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">
                User Management
              </button>
              <button className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">
                Content Editor
              </button>
              <button className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">
                Platform Settings
              </button>
            </div>
          </div>
        </div>
      </RoleGate>
    </div>
  );
}; 