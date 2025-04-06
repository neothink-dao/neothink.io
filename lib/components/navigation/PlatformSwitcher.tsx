import React, { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTenant } from '../../context/TenantContext';

type PlatformOption = {
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

export default function PlatformSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [platforms, setPlatforms] = useState<PlatformOption[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { currentTenant } = useTenant();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const user = useUser();
  
  useEffect(() => {
    if (user) {
      fetchPlatforms();
    }
  }, [user]);
  
  async function fetchPlatforms() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('get_user_accessible_tenants', {
        _user_id: user?.id
      });
      
      if (error) {
        throw error;
      }
      
      setPlatforms(data || []);
    } catch (error) {
      console.error('Error fetching platforms:', error);
    } finally {
      setLoading(false);
    }
  }
  
  function navigateToPlatform(slug: string) {
    // Find the platform to get domain info
    const platform = platforms.find(p => p.slug === slug);
    
    if (!platform) return;
    
    let url = '';
    
    // Use primary domain if available
    if (platform.primary_domain) {
      // Check if we need to add https://
      url = platform.primary_domain.startsWith('http') 
        ? platform.primary_domain 
        : `https://${platform.primary_domain}`;
    } 
    // Otherwise use path-based routing
    else {
      const currentOrigin = window.location.origin;
      url = `${currentOrigin}/${slug}`;
    }
    
    // Close dropdown and navigate
    setIsOpen(false);
    window.location.href = url;
  }
  
  if (!user || platforms.length <= 1) {
    return null;
  }
  
  // Find current platform
  const currentPlatform = currentTenant
    ? platforms.find(p => p.slug === currentTenant.slug)
    : null;
  
  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {currentPlatform?.branding?.logo_url ? (
            <Image
              src={currentPlatform.branding.logo_url}
              alt={currentPlatform.name}
              width={24}
              height={24}
              className="rounded mr-2"
            />
          ) : (
            <div 
              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium text-xs mr-2"
              style={currentPlatform?.branding?.primary_color ? { backgroundColor: currentPlatform.branding.primary_color } : {}}
            >
              {currentPlatform?.name?.substring(0, 1).toUpperCase() || 'N'}
            </div>
          )}
          <span className="font-medium text-sm">
            {currentPlatform?.name || 'Switch Platform'}
          </span>
        </div>
        <svg 
          className="h-4 w-4 text-gray-500" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-2 divide-y divide-gray-100">
            <div className="py-1">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">
                Your Platforms
              </div>
              {loading ? (
                <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
              ) : (
                platforms.map(platform => (
                  <button
                    key={platform.id}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md 
                      ${platform.slug === currentTenant?.slug 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                      } ${!platform.is_active ? 'opacity-50' : ''}`}
                    onClick={() => navigateToPlatform(platform.slug)}
                    disabled={!platform.is_active}
                  >
                    <div className="mr-3">
                      {platform.branding?.logo_url ? (
                        <Image
                          src={platform.branding.logo_url}
                          alt={platform.name}
                          width={24}
                          height={24}
                          className="rounded"
                        />
                      ) : (
                        <div 
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium text-xs"
                          style={platform.branding?.primary_color ? { backgroundColor: platform.branding.primary_color } : {}}
                        >
                          {platform.name.substring(0, 1).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div>{platform.name}</div>
                      {platform.role !== 'member' && (
                        <div className="text-xs text-gray-500 capitalize">{platform.role}</div>
                      )}
                    </div>
                    {platform.slug === currentTenant?.slug && (
                      <svg className="h-4 w-4 text-blue-500 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))
              )}
            </div>
            
            <div className="py-1">
              <button
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  window.location.href = '/hub';
                }}
              >
                <svg className="h-5 w-5 text-gray-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 