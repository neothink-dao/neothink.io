'use server'

import { supabase } from '../lib/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signOut() {
  const cookieStore = await cookies()
  
  await supabase.auth.signOut()
  
  // Use Next.js cookies API for sign-out
  const allCookies = await cookieStore.getAll();
  for (const cookie of allCookies) {
    if (cookie.name.includes('supabase') || cookie.name.includes('auth')) {
      await cookieStore.delete(cookie.name);
    }
  }

  redirect('/login')
} 