import { signOut } from '@neothink/auth';
import { NextResponse } from 'next/server';
export async function GET() {
    try {
        await signOut();
        return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL));
    }
    catch (error) {
        console.error('Sign out error:', error);
        return NextResponse.redirect(new URL('/error', process.env.NEXT_PUBLIC_APP_URL));
    }
}
//# sourceMappingURL=route.js.map