import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
export function createClient() {
    const cookieStore = cookies();
    return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            get(name) {
                var _a;
                return (_a = cookieStore.get(name)) === null || _a === void 0 ? void 0 : _a.value;
            },
        },
    });
}
//# sourceMappingURL=supabase.js.map