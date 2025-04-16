// Use the robust, centralized security middleware from @neothink/auth
import middleware from '@neothink/auth/src/utils/middleware';
export default middleware;
import { createServerClient } from '@supabase/ssr';
export async function middleware(request) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            get(name) {
                var _a;
                return (_a = request.cookies.get(name)) === null || _a === void 0 ? void 0 : _a.value;
            },
            set(name, value, options) {
                request.cookies.set(Object.assign({ name,
                    value }, options));
                response = NextResponse.next({
                    request: {
                        headers: request.headers,
                    },
                });
                response.cookies.set(Object.assign({ name,
                    value }, options));
            },
            remove(name, options) {
                request.cookies.delete(name);
                response = NextResponse.next({
                    request: {
                        headers: request.headers,
                    },
                });
                response.cookies.delete(name);
            },
        },
    });
    const { data: { user } } = await supabase.auth.getUser();
    // If user is signed in and the current path starts with /auth/
    if (user && request.nextUrl.pathname.startsWith('/auth/')) {
        return NextResponse.redirect(new URL('/neothinker', request.url));
    }
    // If user is not signed in and the current path is protected
    if (!user && !request.nextUrl.pathname.startsWith('/auth/') && !request.nextUrl.pathname.startsWith('/_next/') && request.nextUrl.pathname !== '/') {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
    return response;
}
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};
//# sourceMappingURL=middleware.js.map