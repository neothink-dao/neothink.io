import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const createClient = () => {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: "pkce",
      storageKey: "go.neothink.io.auth.token",
      storage: {
        getItem: (key) => {
          try {
            return localStorage.getItem(key)
          } catch (error) {
            return null
          }
        },
        setItem: (key, value) => {
          try {
            localStorage.setItem(key, value)
          } catch (error) {
            // Handle storage errors
          }
        },
        removeItem: (key) => {
          try {
            localStorage.removeItem(key)
          } catch (error) {
            // Handle storage errors
          }
        },
      },
    },
    global: {
      headers: {
        "x-site-name": "Neothink",
        "x-site-url": "https://go.neothink.io",
        "x-site-platform": "neothink",
        "x-sender-name": "Neothink+"
      },
    },
  })
}

