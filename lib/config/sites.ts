/**
 * Site Configuration
 * 
 * This file contains configuration for all Neothink sites/apps.
 * Edit this file to modify site-specific settings and features.
 */

import { PlatformSlug } from '../supabase/auth-client';
import { ThemeColors } from '../theme/ThemeProvider';

/**
 * Base configuration type for all sites
 */
export type SiteConfig = {
  id: string;             // Unique identifier for the site (matches PlatformSlug)
  name: string;           // Display name
  tenantSlug: PlatformSlug; // The tenant/platform slug
  baseUrl: string;        // The base URL for the site in production
  localPath: string;      // The path for local development
  description: string;    // Site description
  
  // Branding
  logoSrc: string;        // Path to the site logo
  faviconSrc: string;     // Path to the favicon
  homeUrl: string;        // Path to the home page
  primaryDomain: string;  // Primary domain name
  colors: ThemeColors;    // Theme colors configuration
  
  // Features configuration
  features: {
    enableSingleSignOn: boolean;
    enableTenantSelector: boolean;
    enableSharedContent: boolean;
    enablePublicPages: boolean;
    enableCustomization: boolean;
  };
  
  // SEO configuration
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  
  // Social media links
  social: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  
  // Contact information
  contact: {
    email: string;
    phone?: string;
    address?: string;
  };
  
  // Footer links
  footerLinks: Array<{
    name: string;
    href: string;
    isExternal?: boolean;
  }>;
  
  // Feature flags for A/B testing and gradual rollouts
  featureFlags: Record<string, boolean>;
  
  // Site-specific settings
  settings: Record<string, any>;
  
  // Navigation structure
  navigation: NavigationItem[];
};

/**
 * Navigation item type for site menus
 */
export type NavigationItem = {
  name: string;
  href: string;
  icon?: string;
  requireAuth?: boolean;
  requirePermission?: string;
  requireAnyPermission?: string[];
  children?: NavigationItem[];
  platformsOnly?: PlatformSlug[];
  external?: boolean;
};

/**
 * Base configuration defaults shared across all sites
 */
const baseConfig: Partial<SiteConfig> = {
  features: {
    enableSingleSignOn: true,
    enableTenantSelector: true,
    enableSharedContent: true,
    enablePublicPages: true,
    enableCustomization: true,
  },
  footerLinks: [
    { name: 'Terms', href: '/terms' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Contact', href: '/contact' },
  ],
  faviconSrc: '/favicon.ico',
  homeUrl: '/',
};

/**
 * Configuration for all Neothink sites
 */
export const sitesConfig: Record<PlatformSlug, SiteConfig> = {
  hub: {
    id: 'hub',
    name: 'Neothink Hub',
    tenantSlug: 'hub',
    baseUrl: 'https://go.neothink.io',
    localPath: '/hub',
    description: 'Central management platform for Neothink ecosystem',
    
    logoSrc: '/images/hub-logo.svg',
    faviconSrc: '/favicon.ico',
    homeUrl: '/',
    primaryDomain: 'go.neothink.io',
    colors: {
      primaryColor: '#0070f3',
      secondaryColor: '#7928ca',
      accentColor: '#f5a623',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderRadius: '0.25rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    
    features: {
      enableSingleSignOn: true,
      enableTenantSelector: true,
      enableSharedContent: true,
      enablePublicPages: false,
      enableCustomization: true,
    },
    
    seo: {
      defaultTitle: 'Neothink Hub',
      titleTemplate: '%s | Neothink Hub',
      description: 'Central hub for managing all Neothink platforms',
      keywords: ['neothink', 'hub', 'platform', 'admin', 'management'],
      ogImage: '/images/og-hub.png',
    },
    
    social: {
      twitter: 'neothink',
      linkedin: 'neothink',
    },
    
    contact: {
      email: 'hub@neothink.io',
    },
    
    navigation: [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: 'dashboard',
        requireAuth: true
      },
      {
        name: 'Platforms',
        href: '/platforms',
        icon: 'apps',
        requireAuth: true,
        requirePermission: 'manage_platforms'
      },
      {
        name: 'Users',
        href: '/users',
        icon: 'people',
        requireAuth: true,
        requirePermission: 'manage_users'
      },
      {
        name: 'Analytics',
        href: '/analytics',
        icon: 'analytics',
        requireAuth: true,
        requirePermission: 'view_analytics'
      },
      {
        name: 'Settings',
        href: '/settings',
        icon: 'settings',
        requireAuth: true
      }
    ],
    
    footerLinks: [
      { name: 'Terms', href: '/terms' },
      { name: 'Privacy', href: '/privacy' },
      { name: 'Contact', href: '/contact' },
    ],
    featureFlags: {
      enableAnalytics: true,
      enablePlatformCreation: true,
      enableUserManagement: true,
      enableContentSharing: true
    },
    settings: {
      maxTenantsPerUser: 10,
      defaultTenantRole: 'member'
    }
  },
  
  ascenders: {
    id: 'ascenders',
    name: 'Ascenders',
    tenantSlug: 'ascenders',
    baseUrl: 'https://www.joinascenders.org',
    localPath: '/ascenders',
    description: 'Platform for future-focused thinkers',
    
    logoSrc: '/images/ascenders-logo.svg',
    faviconSrc: '/favicon.ico',
    homeUrl: '/',
    primaryDomain: 'www.joinascenders.org',
    colors: {
      primaryColor: '#007FFF',
      secondaryColor: '#00C2FF',
      accentColor: '#FF7A00',
      backgroundColor: '#F7FAFC',
      textColor: '#1A202C',
      borderRadius: '0.375rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    
    features: {
      enableSingleSignOn: true,
      enableTenantSelector: true,
      enableSharedContent: true,
      enablePublicPages: true,
      enableCustomization: true,
    },
    
    seo: {
      defaultTitle: 'Ascenders',
      titleTemplate: '%s | Ascenders',
      description: 'Join the Ascenders community for future-focused individuals',
      keywords: ['ascenders', 'community', 'future', 'development', 'growth'],
      ogImage: '/images/og-ascenders.png',
    },
    
    social: {
      twitter: 'joinascenders',
      instagram: 'joinascenders',
      facebook: 'joinascenders',
      linkedin: 'joinascenders',
    },
    
    contact: {
      email: 'hello@joinascenders.org',
    },
    
    navigation: [
      {
        name: 'Home',
        href: '/',
        icon: 'home'
      },
      {
        name: 'Learning',
        href: '/learning',
        icon: 'school',
        requireAuth: true
      },
      {
        name: 'Community',
        href: '/community',
        icon: 'groups',
        requireAuth: true
      },
      {
        name: 'Resources',
        href: '/resources',
        icon: 'library_books',
        requireAuth: true
      },
      {
        name: 'Profile',
        href: '/profile',
        icon: 'person',
        requireAuth: true
      }
    ],
    
    footerLinks: [
      { name: 'About', href: '/about' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'Terms', href: '/terms' },
      { name: 'Privacy', href: '/privacy' },
      { name: 'Contact', href: '/contact' },
    ],
    featureFlags: {
      enableAnalytics: true,
      enableCommunity: true,
      enableLearningPaths: true,
      enableMentorship: false
    },
    settings: {
      contentVisibility: 'tenant',
      allowGuests: true
    }
  },
  
  neothinkers: {
    id: 'neothinkers',
    name: 'Neothinkers',
    tenantSlug: 'neothinkers',
    baseUrl: 'https://www.joinneothinkers.org',
    localPath: '/neothinkers',
    description: 'Community for innovative thinkers',
    
    logoSrc: '/images/neothinkers-logo.svg',
    faviconSrc: '/favicon.ico',
    homeUrl: '/',
    primaryDomain: 'www.joinneothinkers.org',
    colors: {
      primaryColor: '#6200EE',
      secondaryColor: '#03DAC6',
      accentColor: '#FF4081',
      backgroundColor: '#FFFFFF',
      textColor: '#121212',
      borderRadius: '0.5rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    
    features: {
      enableSingleSignOn: true,
      enableTenantSelector: true,
      enableSharedContent: true,
      enablePublicPages: true,
      enableCustomization: true,
    },
    
    seo: {
      defaultTitle: 'Neothinkers',
      titleTemplate: '%s | Neothinkers',
      description: 'The Neothinkers community for innovative thinkers',
      keywords: ['neothinkers', 'community', 'innovation', 'thinking', 'learning'],
      ogImage: '/images/og-neothinkers.png',
    },
    
    social: {
      twitter: 'joinneothinkers',
      instagram: 'joinneothinkers',
      linkedin: 'joinneothinkers',
    },
    
    contact: {
      email: 'hello@joinneothinkers.org',
    },
    
    navigation: [
      {
        name: 'Home',
        href: '/',
        icon: 'home'
      },
      {
        name: 'Ideas',
        href: '/ideas',
        icon: 'lightbulb',
        requireAuth: true
      },
      {
        name: 'Projects',
        href: '/projects',
        icon: 'work',
        requireAuth: true
      },
      {
        name: 'Network',
        href: '/network',
        icon: 'people',
        requireAuth: true
      },
      {
        name: 'Profile',
        href: '/profile',
        icon: 'person',
        requireAuth: true
      }
    ],
    
    footerLinks: [
      { name: 'About', href: '/about' },
      { name: 'Terms', href: '/terms' },
      { name: 'Privacy', href: '/privacy' },
      { name: 'Contact', href: '/contact' },
    ],
    featureFlags: {
      enableAnalytics: true,
      enableIdeaVoting: true,
      enableCollaboration: true,
      enableProjectTracking: true
    },
    settings: {
      contentVisibility: 'tenant',
      allowGuests: true
    }
  },
  
  immortals: {
    id: 'immortals',
    name: 'Immortals',
    tenantSlug: 'immortals',
    baseUrl: 'https://www.joinimmortals.org',
    localPath: '/immortals',
    description: 'Platform for longevity enthusiasts',
    
    logoSrc: '/images/immortals-logo.svg',
    faviconSrc: '/favicon.ico',
    homeUrl: '/',
    primaryDomain: 'www.joinimmortals.org',
    colors: {
      primaryColor: '#00BFA5',
      secondaryColor: '#64DD17',
      accentColor: '#FFC400',
      backgroundColor: '#FAFAFA',
      textColor: '#212121',
      borderRadius: '0.375rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    
    features: {
      enableSingleSignOn: true,
      enableTenantSelector: true,
      enableSharedContent: true,
      enablePublicPages: true,
      enableCustomization: true,
    },
    
    seo: {
      defaultTitle: 'Immortals',
      titleTemplate: '%s | Immortals',
      description: 'The Immortals platform for longevity enthusiasts',
      keywords: ['immortals', 'longevity', 'wellness', 'health', 'biohacking'],
      ogImage: '/images/og-immortals.png',
    },
    
    social: {
      twitter: 'joinimmortals',
      instagram: 'joinimmortals',
      linkedin: 'joinimmortals',
    },
    
    contact: {
      email: 'hello@joinimmortals.org',
    },
    
    navigation: [
      {
        name: 'Home',
        href: '/',
        icon: 'home'
      },
      {
        name: 'Journeys',
        href: '/journeys',
        icon: 'route',
        requireAuth: true
      },
      {
        name: 'Research',
        href: '/research',
        icon: 'science',
        requireAuth: true
      },
      {
        name: 'Community',
        href: '/community',
        icon: 'forum',
        requireAuth: true
      },
      {
        name: 'Profile',
        href: '/profile',
        icon: 'person',
        requireAuth: true
      }
    ],
    
    footerLinks: [
      { name: 'About', href: '/about' },
      { name: 'Terms', href: '/terms' },
      { name: 'Privacy', href: '/privacy' },
      { name: 'Contact', href: '/contact' },
    ],
    featureFlags: {
      enableAnalytics: true,
      enableJourneyTracking: true,
      enableResearchLibrary: true,
      enableHealthMetrics: false
    },
    settings: {
      contentVisibility: 'tenant',
      allowGuests: true
    }
  },
};

/**
 * Get configuration for a specific site by ID
 */
export function getSiteConfig(siteId: PlatformSlug): SiteConfig {
  return sitesConfig[siteId];
}

/**
 * Get site ID from the current hostname or path
 */
export function getSiteIdFromUrl(url: string): PlatformSlug {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;
    
    // Remove www. prefix for consistent checking
    const normalizedHostname = hostname.replace(/^www\./, '');
    
    // Check for dedicated domains
    if (normalizedHostname === 'go.neothink.io') {
      return 'hub';
    } else if (normalizedHostname === 'joinascenders.org') {
      return 'ascenders';
    } else if (normalizedHostname === 'joinneothinkers.org') {
      return 'neothinkers';
    } else if (normalizedHostname === 'joinimmortals.org') {
      return 'immortals';
    }
    
    // Check for path-based routing on shared domain
    if (pathname.startsWith('/hub')) {
      return 'hub';
    } else if (pathname.startsWith('/ascenders')) {
      return 'ascenders';
    } else if (pathname.startsWith('/neothinkers')) {
      return 'neothinkers';
    } else if (pathname.startsWith('/immortals')) {
      return 'immortals';
    }
    
    // Default to hub if can't determine
    return 'hub';
  } catch (error) {
    console.error('Error parsing URL:', error);
    return 'hub';
  }
}

/**
 * Get the redirect URL when switching platforms/tenants
 */
export function getPlatformSwitchUrl(from: PlatformSlug, to: PlatformSlug, currentPath?: string): string {
  // If on local development, use path-based routing
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    // For local dev, rewrite the path to include the target platform prefix
    const path = currentPath || '/';
    if (path.startsWith(`/${from}`)) {
      return path.replace(`/${from}`, `/${to}`);
    }
    return `/${to}${path.startsWith('/') ? path : `/${path}`}`;
  }
  
  // For production, redirect to the platform's domain
  return sitesConfig[to].baseUrl;
}

export default sitesConfig; 