'use server'

import { supabase } from '../lib/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signOut() {
  const cookieStore = cookies()
  
  await supabase.auth.signOut()
  
  // Clear any auth-related cookies
  const allCookies: Cookie[] = await cookieStore.getAll();
  for (const cookie of allCookies) {
    if (cookie.name.includes('supabase') || cookie.name.includes('auth')) {
      await cookieStore.delete(cookie.name)
    }
  }

  redirect('/login')
} 