'use server';
import { createClient } from '../../lib/supabase';
import { redirect } from 'next/navigation';
export async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect('/auth/sign-in');
}
//# sourceMappingURL=actions.js.map