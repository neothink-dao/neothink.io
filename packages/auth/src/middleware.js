import { createClient } from './lib/supabase/client';
export async function middleware(request) {
    // Create authenticated Supabase client
    const supabase = createClient();
    // Refresh session if expired
    const { data: { session }, error } = await supabase.auth.getSession();
    // Handle path matching
    const path = request.nextUrl.pathname;
    const isAuthRoute = path.startsWith('/auth/');
    const isApiRoute = path.startsWith('/api/');
    const isPublicRoute = path.startsWith('/_next/') ||
        path === '/' ||
        path.startsWith('/unauthenticated/');
    // Allow public routes
    if (isPublicRoute || isApiRoute) {
        return NextResponse.next();
    }
    // Redirect authenticated users away from auth routes
    if (isAuthRoute && session) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    // Redirect unauthenticated users to login
    if (!isAuthRoute && !session) {
        const redirectUrl = new URL('/auth/login', request.url);
        redirectUrl.searchParams.set('redirect', path);
        return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
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