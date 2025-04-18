import { useEffect, useState } from 'react'
import { type User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export function useUser(): {
  user: User | null
  loading: boolean
  error: Error | null
  isAuthenticated: boolean
} {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }: { data: { session: any }, error: Error | null }) => {
      if (error) {
        setError(error)
      } else {
        setUser(session?.user ?? null)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
  }
}