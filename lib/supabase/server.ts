import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Database } from "@/types/supabase"
import { CookieOptions } from "@supabase/ssr"

export const createServerClient = () => {
  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookieStore = cookies()
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            const cookieStore = cookies()
            // Convert Supabase cookie options to Next.js cookie options
            const { maxAge, ...rest } = options
            cookieStore.set({
              name,
              value,
              ...rest,
              // Convert maxAge from seconds to milliseconds if present
              ...(maxAge && { maxAge: maxAge * 1000 })
            })
          } catch (error) {
            // Handle cookie errors
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            const cookieStore = cookies()
            // Convert Supabase cookie options to Next.js cookie options
            const { maxAge, ...rest } = options
            cookieStore.set({
              name,
              value: "",
              ...rest,
              maxAge: 0 // Expire immediately
            })
          } catch (error) {
            // Handle cookie errors
          }
        },
      },
    }
  )
}

// Export createClient as an alias for createServerClient for backward compatibility
export const createClient = createServerClient

