import { NextRequest } from 'next/server';
import { PlatformSlug } from '../supabase/auth-client';

/**
 * Domain to tenant mapping configuration
 * Maps all possible domains to their respective platform slugs
 */
const DOMAIN_TENANT_MAP: Record<string, PlatformSlug> = {
  // Primary domains
  'go.neothink.io': 'hub',
  'joinascenders.org': 'ascenders',
  'www.joinascenders.org': 'ascenders',
  'joinneothinkers.org': 'neothinkers',
  'www.joinneothinkers.org': 'neothinkers',
  'joinimmortals.org': 'immortals',
  'www.joinimmortals.org': 'immortals',
  
  // Legacy/alternative domains (kept for backward compatibility)
  'neothink.io': 'hub',
  'ascenders.neothink.io': 'ascenders', 
  'neothinkers.neothink.io': 'neothinkers',
  'immortals.neothink.io': 'immortals',
};

/**
 * Path segments that indicate specific tenants
 * For path-based routing on shared domains
 */
const PATH_TENANT_MAP: Record<string, PlatformSlug> = {
  'hub': 'hub',
  'ascenders': 'ascenders',
  'neothinkers': 'neothinkers',
  'immortals': 'immortals',
};

/**
 * Get tenant slug from hostname
 * @param hostname The hostname to check
 * @returns Tenant slug if found, undefined otherwise
 */
export function getTenantFromHostname(hostname: string): PlatformSlug | undefined {
  // Remove www. prefix if present for consistent matching
  const normalizedHostname = hostname.replace(/^www\./, '');
  
  // Check exact match first
  if (normalizedHostname in DOMAIN_TENANT_MAP) {
    return DOMAIN_TENANT_MAP[normalizedHostname];
  }
  
  // Default to hub if on a neothink.io subdomain that's not explicitly mapped
  if (normalizedHostname.endsWith('.neothink.io')) {
    return 'hub';
  }
  
  // No match found
  return undefined;
}

/**
 * Get tenant slug from a URL path
 * @param path The URL path to check
 * @returns Tenant slug if found, undefined otherwise
 */
export function getTenantFromPath(path: string): PlatformSlug | undefined {
  // Split path and remove empty segments
  const segments = path.split('/').filter(segment => segment.length > 0);
  
  if (segments.length > 0) {
    const firstSegment = segments[0].toLowerCase();
    if (firstSegment in PATH_TENANT_MAP) {
      return PATH_TENANT_MAP[firstSegment];
    }
  }
  
  return undefined;
}

/**
 * Get tenant slug from custom domain records (async)
 * @param hostname The hostname to check
 * @returns Promise resolving to tenant slug if found, undefined otherwise
 */
export async function getTenantFromCustomDomain(hostname: string): Promise<PlatformSlug | undefined> {
  try {
    // Look up from tenant_domains table via API
    const response = await fetch(`/api/domains/lookup?domain=${hostname}`);
    if (response.ok) {
      const data = await response.json();
      if (data.tenant_slug && Object.values(PlatformSlug).includes(data.tenant_slug as PlatformSlug)) {
        return data.tenant_slug as PlatformSlug;
      }
    }
  } catch (error) {
    console.error('Error looking up custom domain:', error);
  }
  
  return undefined;
}

/**
 * Get tenant from request (URL and headers)
 * @param request NextRequest object
 * @returns Tenant slug
 */
export function getTenantFromRequest(request: NextRequest): PlatformSlug {
  const url = new URL(request.url);
  const hostname = url.hostname;
  const path = url.pathname;
  
  // 1. Check if tenant is specified in a header (highest priority)
  const headerTenant = request.headers.get('x-tenant-slug');
  if (headerTenant && Object.values(PlatformSlug).includes(headerTenant as PlatformSlug)) {
    return headerTenant as PlatformSlug;
  }
  
  // 2. Check for tenant in URL path (for path-based multi-tenancy)
  const pathTenant = getTenantFromPath(path);
  if (pathTenant) {
    return pathTenant;
  }
  
  // 3. Check for tenant in hostname (domain-based detection)
  const hostTenant = getTenantFromHostname(hostname);
  if (hostTenant) {
    return hostTenant;
  }
  
  // Default to hub if no tenant can be determined
  return 'hub';
}

/**
 * Get public URL for a tenant
 * @param tenant Tenant slug
 * @returns Public URL for the tenant
 */
export function getTenantPublicUrl(tenant: PlatformSlug): string {
  switch (tenant) {
    case 'ascenders':
      return 'https://www.joinascenders.org';
    case 'neothinkers':
      return 'https://www.joinneothinkers.org';
    case 'immortals':
      return 'https://www.joinimmortals.org';
    case 'hub':
    default:
      return 'https://go.neothink.io';
  }
}

/**
 * Get local development path for a tenant
 * @param tenant Tenant slug
 * @returns Path for local development
 */
export function getTenantLocalPath(tenant: PlatformSlug): string {
  switch (tenant) {
    case 'ascenders':
      return '/ascenders';
    case 'neothinkers':
      return '/neothinkers';
    case 'immortals':
      return '/immortals';
    case 'hub':
    default:
      return '/hub';
  }
}

/**
 * Get tenant slug from any URL
 * @param url URL to check
 * @returns Tenant slug
 */
export function getTenantFromUrl(url: string): PlatformSlug {
  try {
    const parsedUrl = new URL(url);
    
    // First try hostname
    const tenantFromHostname = getTenantFromHostname(parsedUrl.hostname);
    if (tenantFromHostname) {
      return tenantFromHostname;
    }
    
    // Then try path
    const tenantFromPath = getTenantFromPath(parsedUrl.pathname);
    if (tenantFromPath) {
      return tenantFromPath;
    }
  } catch (error) {
    console.error('Error parsing URL:', error);
  }
  
  // Default to hub if can't determine
  return 'hub';
} 