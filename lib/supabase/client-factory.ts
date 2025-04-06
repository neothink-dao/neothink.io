import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Define platform type
export type PlatformSlug = 'hub' | 'ascenders' | 'neothinkers' | 'immortals';

// Define platform-specific settings
const platformSettings = {
  hub: {
    storageKey: "go.neothink.io.auth.token",
    headers: {
      "x-site-name": "Neothink",
      "x-site-url": "https://go.neothink.io",
      "x-site-platform": "neothink",
      "x-sender-name": "Neothink+"
    }
  },
  ascenders: {
    storageKey: "joinascenders.auth.token",
    headers: {
      "x-site-name": "Ascenders",
      "x-site-url": "https://www.joinascenders.org",
      "x-site-platform": "ascenders",
      "x-sender-name": "Ascenders"
    }
  },
  neothinkers: {
    storageKey: "joinneothinkers.auth.token",
    headers: {
      "x-site-name": "Neothinkers",
      "x-site-url": "https://www.joinneothinkers.org",
      "x-site-platform": "neothinkers",
      "x-sender-name": "Neothinkers"
    }
  },
  immortals: {
    storageKey: "joinimmortals.auth.token",
    headers: {
      "x-site-name": "Immortals",
      "x-site-url": "https://www.joinimmortals.org",
      "x-site-platform": "immortals",
      "x-sender-name": "Immortals"
    }
  }
};

/**
 * Safe localStorage operations with error handling for SSR and browser environments
 */
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(key);
    } catch (error) {
      console.error('LocalStorage getItem error:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('LocalStorage setItem error:', error);
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    } catch (error) {
      console.error('LocalStorage removeItem error:', error);
    }
  }
};

/**
 * Creates a Supabase client with platform-specific settings
 * @param platformSlug The platform identifier (hub, ascenders, neothinkers, immortals)
 * @param customOptions Additional options to merge with platform-specific settings
 * @returns A configured Supabase client
 */
export function createClient(platformSlug: PlatformSlug = 'hub', customOptions = {}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  // Get platform-specific settings or fallback to hub
  const platformConfig = platformSettings[platformSlug] || platformSettings.hub;

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
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
    ...customOptions
  });
}

/**
 * Creates a Supabase client component with platform-specific settings
 * For use in React components with Next.js App Router
 * @param platformSlug The platform identifier
 * @returns A configured Supabase client component
 */
export function createClientComponent(platformSlug: PlatformSlug = 'hub') {
  // For client components, we use the client component client
  const client = createClientComponentClient({
    options: {
      global: {
        headers: platformSettings[platformSlug].headers
      }
    }
  });
  
  return client;
}

/**
 * Get platform-specific headers for API calls
 * Useful when you need to include headers in fetch calls
 * @param platformSlug The platform identifier
 * @returns Headers object for the platform
 */
export function getPlatformHeaders(platformSlug: PlatformSlug = 'hub') {
  return platformSettings[platformSlug].headers;
} 