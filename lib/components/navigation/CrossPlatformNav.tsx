import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClientComponent, PlatformSlug, UserProfile } from '../../supabase/auth-client';

interface CrossPlatformNavProps {
  currentPlatform: PlatformSlug;
  className?: string;
}

interface PlatformInfo {
  slug: PlatformSlug;
  name: string;
  description: string;
  logoUrl: string;
  baseUrl: string;
  color: string;
}

const platformInfo: Record<PlatformSlug, PlatformInfo> = {
  ascenders: {
    slug: 'ascenders',
    name: 'Ascenders',
    description: 'Prosperity and wealth creation',
    logoUrl: '/assets/ascenders-logo.svg',
    baseUrl: 'https://joinascenders.org',
    color: 'bg-yellow-500'
  },
  immortals: {
    slug: 'immortals',
    name: 'Immortals',
    description: 'Health and longevity',
    logoUrl: '/assets/immortals-logo.svg',
    baseUrl: 'https://joinimmortals.org',
    color: 'bg-green-500'
  },
  neothinkers: {
    slug: 'neothinkers',
    name: 'Neothinkers',
    description: 'Happiness and integrated thinking',
    logoUrl: '/assets/neothinkers-logo.svg',
    baseUrl: 'https://joinneothinkers.org',
    color: 'bg-blue-500'
  },
  hub: {
    slug: 'hub',
    name: 'Hub',
    description: 'Central platform portal',
    logoUrl: '/assets/hub-logo.svg',
    baseUrl: 'https://go.neothink.io',
    color: 'bg-purple-500'
  }
};

export default function CrossPlatformNav({
  currentPlatform,
  className = ''
}: CrossPlatformNavProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClientComponent(currentPlatform);
        
        // Get the user profile
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }
        
        // Get profile data
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('Profile error:', profileError);
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error('Profile error:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [currentPlatform]);
  
  // List of platforms the user has access to
  const accessiblePlatforms = profile?.platforms || [];
  
  // Add the current platform and hub to visible platforms
  const visiblePlatforms: PlatformSlug[] = Array.from(new Set([
    currentPlatform,
    'hub',
    ...accessiblePlatforms
  ]));
  
  // Special case: Guardian users get access to all platforms
  if (profile?.is_guardian) {
    visiblePlatforms.push('ascenders', 'immortals', 'neothinkers');
  }
  
  // Remove duplicates
  const uniquePlatforms = Array.from(new Set(visiblePlatforms));
  
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
      >
        <span>Platforms</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50">
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Neothink Platforms</h3>
            <ul className="space-y-2">
              {uniquePlatforms.map(slug => (
                <li key={slug}>
                  <a 
                    href={slug === currentPlatform ? '#' : platformInfo[slug].baseUrl}
                    className={`flex items-center p-2 rounded-md hover:bg-gray-50 ${slug === currentPlatform ? 'bg-gray-100' : ''}`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${platformInfo[slug].color} mr-3`}>
                      <span className="text-white font-bold">
                        {platformInfo[slug].name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {platformInfo[slug].name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {platformInfo[slug].description}
                      </div>
                    </div>
                    {slug === currentPlatform && (
                      <span className="ml-auto text-xs text-gray-500">Current</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {!profile && !loading && (
            <div className="border-t border-gray-100 p-3">
              <p className="text-sm text-gray-600">
                Sign in to access all platforms
              </p>
              <Link
                href="/signin"
                className="mt-2 block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 