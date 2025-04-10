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

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);
  return supabaseClient;
}

export function getServiceClient(serviceRoleKey?: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase service role credentials');
  }
  
  return createClient<Database>(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Creates a Supabase client with platform-specific settings
 * @param platformSlug The platform identifier (hub, ascenders, neothinkers, immortals)
 * @param customOptions Additional options to merge with platform-specific settings
 * @returns A configured Supabase client
 */
export function createPlatformClient(platformSlug: PlatformSlug = 'hub', customOptions = {}) {
  // Get platform-specific settings or fallback to hub
  const platformConfig = platformSettings[platformSlug] || platformSettings.hub;

  return createClient<Database>(supabaseUrl || '', supabaseAnonKey || '', {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: "pkce",
      storageKey: platformConfig.storageKey,
      storage: {
        getItem: (key) => safeStorage.getItem(key),
        setItem: (key, value) => safeStorage.setItem(key, value),
        removeItem: (key) => safeStorage.removeItem(key),
      },
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
}

// Create a default client for the hub platform
export const supabase = createPlatformClient('hub');

// Create admin client for server-side operations
export function createAdminClient() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey) {
    throw new Error('Missing Supabase service role key. Check your environment variables.');
  }
  
  return createClient<Database>(supabaseUrl || '', supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Export default admin client for server operations
export const supabaseAdmin = typeof window === 'undefined' ? createAdminClient() : undefined; 