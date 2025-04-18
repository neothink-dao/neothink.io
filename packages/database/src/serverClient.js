import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
export async function getSupabaseServerClient() {
    const cookieStore = await cookies();
    const cookieMethods = {
        get: (name) => {
            const value = cookieStore.get(name);
            return value === null || value === void 0 ? void 0 : value.value;
        },
    };
    return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        cookies: cookieMethods,
    });
}
//# sourceMappingURL=serverClient.js.map