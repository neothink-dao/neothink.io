import { createClient } from '@supabase/supabase-js';
import { PlatformSlug } from '../types/models';
import { Database } from '../types';

// These env vars are set in each app but with consistent naming
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Platform-specific settings
const platformSettings: Record<PlatformSlug, {
  storageKey: string;
  headers: Record<string, string>;
}> = {
  hub: {
    storageKey: 'supabase-hub-auth',
    headers: { 'x-client-info': 'neothink-hub-client' }
  },
  ascenders: {
    storageKey: 'supabase-ascenders-auth',
    headers: { 'x-client-info': 'neothink-ascenders-client' }
  },
  immortals: {
    storageKey: 'supabase-immortals-auth',
    headers: { 'x-client-info': 'neothink-immortals-client' }
  },
  neothinkers: {
    storageKey: 'supabase-neothinkers-auth',
    headers: { 'x-client-info': 'neothink-neothinkers-client' }
  }
};

// Ensure environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    // Only throw in browser environment during development
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Missing Supabase environment variables. Please check your .env file.'
      );
    }
  } else {
    // Always throw on server since it's critical
    throw new Error(
      'Missing Supabase environment variables. Please check your .env file.'
    );
  }
}

// Safe storage implementation for environments without localStorage
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// Cache for clients to avoid creating multiple instances
const clientCache: Record<string, ReturnType<typeof createClient<Database>>> = {};

/**
 * Gets a cached Supabase client or creates a new one
 * @returns A Supabase client instance
 */
export function getSupabaseClient() {
  const cacheKey = 'default-client';
  
  if (clientCache[cacheKey]) {
    return clientCache[cacheKey];
  }
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  clientCache[cacheKey] = createClient<Database>(supabaseUrl, supabaseAnonKey);
  return clientCache[cacheKey];
}

/**
 * Creates a Supabase client with service role key for admin operations
 * @param serviceRoleKey Optional service role key (uses env var if not provided)
 * @returns A Supabase client with admin privileges
 */
export function getServiceClient(serviceRoleKey?: string) {
  const cacheKey = `service-client-${serviceRoleKey || 'default'}`;
  
  if (clientCache[cacheKey]) {
    return clientCache[cacheKey];
  }
  
  const serviceKey = serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase service role credentials');
  }
  
  clientCache[cacheKey] = createClient<Database>(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  
  return clientCache[cacheKey];
}

/**
 * Creates a Supabase client with platform-specific settings
 * @param platformSlug The platform identifier (hub, ascenders, neothinkers, immortals)
 * @param customOptions Additional options to merge with platform-specific settings
 * @returns A configured Supabase client
 */
export function createPlatformClient(platformSlug: PlatformSlug = 'hub', customOptions = {}) {
  const cacheKey = `platform-client-${platformSlug}-${JSON.stringify(customOptions)}`;
  
  if (clientCache[cacheKey]) {
    return clientCache[cacheKey];
  }
  
  // Get platform-specific settings or fallback to hub
  const platformConfig = platformSettings[platformSlug] || platformSettings.hub;

  clientCache[cacheKey] = createClient<Database>(supabaseUrl || '', supabaseAnonKey || '', {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: "pkce",
      storageKey: platformConfig.storageKey,
      storage: safeStorage,
    },
    global: {
      headers: platformConfig.headers,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    ...customOptions
  });
  
  return clientCache[cacheKey];
}

// Create a default client for the hub platform
export const supabase = createPlatformClient('hub');

/**
 * Creates an admin client for server-side operations
 * @returns A Supabase client with admin privileges
 */
export function createAdminClient() {
  const cacheKey = 'admin-client';
  
  if (clientCache[cacheKey]) {
    return clientCache[cacheKey];
  }
  
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey) {
    throw new Error('Missing Supabase service role key. Check your environment variables.');
  }
  
  clientCache[cacheKey] = createClient<Database>(supabaseUrl || '', supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  return clientCache[cacheKey];
}

// Export default admin client for server operations
export const supabaseAdmin = typeof window === 'undefined' ? createAdminClient() : undefined; 