import { useEffect, useState } from 'react';
import { PlatformSlug } from '../supabase/client-factory';

interface PlatformInfo {
  platformSlug: PlatformSlug;
  platformName: string;
  platformDomain: string;
}

/**
 * Map of platform slugs to readable names
 */
const PLATFORM_NAMES: Record<PlatformSlug, string> = {
  hub: 'Neothink Hub',
  ascenders: 'Ascenders',
  neothinkers: 'Neothinkers',
  immortals: 'Immortals'
};

/**
 * Map of platform domains to slugs
 */
const DOMAIN_TO_PLATFORM: Record<string, PlatformSlug> = {
  'go.neothink.io': 'hub',
  'www.joinascenders.org': 'ascenders',
  'www.joinneothinkers.org': 'neothinkers',
  'www.joinimmortals.org': 'immortals',
  // Development domains
  'hub.localhost:3000': 'hub',
  'ascenders.localhost:3000': 'ascenders',
  'neothinkers.localhost:3000': 'neothinkers', 
  'immortals.localhost:3000': 'immortals'
};

/**
 * Platform detection via path-based approach (for local development)
 */
const PATH_PREFIXES: Record<string, PlatformSlug> = {
  '/hub': 'hub',
  '/ascenders': 'ascenders',
  '/neothinkers': 'neothinkers',
  '/immortals': 'immortals'
};

/**
 * Detect platform from domain or path
 */
export function detectPlatform(): PlatformSlug {
  if (typeof window === 'undefined') {
    return 'hub'; // Default for server-side rendering
  }
  
  // First try domain-based detection
  const hostname = window.location.hostname;
  const fullHost = `${hostname}${window.location.port ? ':' + window.location.port : ''}`;
  
  if (DOMAIN_TO_PLATFORM[hostname]) {
    return DOMAIN_TO_PLATFORM[hostname];
  }
  
  if (DOMAIN_TO_PLATFORM[fullHost]) {
    return DOMAIN_TO_PLATFORM[fullHost];
  }
  
  // Fall back to path-based detection for local development
  const path = window.location.pathname;
  
  for (const [prefix, platform] of Object.entries(PATH_PREFIXES)) {
    if (path.startsWith(prefix)) {
      return platform;
    }
  }
  
  // Default to hub if no match
  return 'hub';
}

/**
 * Hook to detect and provide current platform information
 */
export function usePlatform(): PlatformInfo {
  const [platformSlug, setPlatformSlug] = useState<PlatformSlug>('hub');
  
  useEffect(() => {
    setPlatformSlug(detectPlatform());
  }, []);
  
  const platformName = PLATFORM_NAMES[platformSlug];
  
  // Find platform domain from the mapping
  const domainEntries = Object.entries(DOMAIN_TO_PLATFORM);
  const platformDomain = domainEntries.find(([_, slug]) => slug === platformSlug)?.[0] || '';
  
  return {
    platformSlug,
    platformName,
    platformDomain
  };
}

export default usePlatform; 