'use server';
import { supabase } from '../lib/supabase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export async function signOut() {
    const cookieStore = cookies();
    await supabase.auth.signOut();
    // Clear any auth-related cookies
    cookieStore.getAll().forEach(cookie => {
        if (cookie.name.includes('supabase') || cookie.name.includes('auth')) {
            cookieStore.delete(cookie.name);
        }
    });
    redirect('/login');
}
//# sourceMappingURL=sign-out.js.map