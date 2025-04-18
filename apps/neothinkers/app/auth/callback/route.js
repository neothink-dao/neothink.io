import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
export async function GET(request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    if (code) {
        const cookieStore = cookies();
        const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
            cookies: {
                get(name) {
                    var _a;
                    return (_a = cookieStore.get(name)) === null || _a === void 0 ? void 0 : _a.value;
                },
            },
        });
        await supabase.auth.exchangeCodeForSession(code);
    }
    return NextResponse.redirect(new URL('/neothinker', request.url));
}
//# sourceMappingURL=route.js.map