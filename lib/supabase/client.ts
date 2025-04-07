"use client"

import { createBrowserClient } from "@supabase/ssr"
import { toast } from "../ui/toast/use-toast"

// Environment validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Type for client-side error handling
interface ErrorPayload {
  message: string
  details?: Record<string, any>
  showToast?: boolean
  logToAnalytics?: boolean
}

// Create a typed browser client for Supabase
export const createClient = () => {
  const client = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce', // More secure authorization flow
      },
      global: {
        // Add request headers for security and analytics
        headers: {
          'x-client-info': 'neothink-hub-client',
          'x-client-version': process.env.NEXT_PUBLIC_APP_VERSION || 'dev',
        }
      },
      realtime: {
        // Enable realtime subscriptions by default
        params: {
          eventsPerSecond: 10,
        },
      },
    }
  )
  
  // Add error handling wrapper functions
  return {
    ...client,
    // Enhanced error handling for auth operations
    auth: {
      ...client.auth,
      // Override signInWithPassword with error handling
      signInWithPassword: async (...args: Parameters<typeof client.auth.signInWithPassword>) => {
        try {
          const result = await client.auth.signInWithPassword(...args)
          if (result.error) {
            handleClientError({
              message: `Authentication failed: ${result.error.message}`,
              showToast: true,
              logToAnalytics: true
            })
          }
          return result
        } catch (err) {
          const error = err as Error
          handleClientError({
            message: `Sign in error: ${error.message}`,
            showToast: true,
            logToAnalytics: true
          })
          return { data: { session: null, user: null }, error }
        }
      },
      // Override signUp with error handling
      signUp: async (...args: Parameters<typeof client.auth.signUp>) => {
        try {
          const result = await client.auth.signUp(...args)
          if (result.error) {
            handleClientError({
              message: `Sign up failed: ${result.error.message}`,
              showToast: true,
              logToAnalytics: true
            })
          }
          return result
        } catch (err) {
          const error = err as Error
          handleClientError({
            message: `Sign up error: ${error.message}`,
            showToast: true,
            logToAnalytics: true
          })
          return { data: { session: null, user: null }, error }
        }
      },
    },
  }
}

/**
 * Client-side error handler that shows toasts and logs analytics when necessary
 */
function handleClientError(payload: ErrorPayload): void {
  // Log all errors in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('[Supabase Client Error]', payload.message, payload.details || '')
  }
  
  // Show toast notification if requested
  if (payload.showToast) {
    toast({
      title: 'Error',
      description: payload.message,
      variant: 'destructive',
    })
  }
  
  // In the future, you could add analytics tracking here
  if (payload.logToAnalytics && typeof window !== 'undefined') {
    // Example analytics integration
    // analytics.captureException(payload.message, payload.details)
  }
}

// Create a singleton instance for client components
export const supabase = createClient()

/**
 * Hook to use Supabase client with enhanced error handling
 */
export function useSupabase() {
  return supabase
} 