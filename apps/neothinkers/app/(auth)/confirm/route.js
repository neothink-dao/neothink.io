import { createClient } from '@neothink/auth';
import { redirect } from 'next/navigation';
export async function GET(request) {
    var _a;
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');
    const next = (_a = searchParams.get('next')) !== null && _a !== void 0 ? _a : '/';
    if (token_hash && type) {
        const supabase = createClient();
        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        });
        if (!error) {
            redirect(next);
        }
        else {
            redirect(`/auth/error?error=${error.message}`);
        }
    }
    redirect(`/auth/error?error=Missing verification token`);
}
//# sourceMappingURL=route.js.map