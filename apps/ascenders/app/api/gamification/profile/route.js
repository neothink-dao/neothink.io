import { getUser } from '@neothink/hooks/api';
import { getSupabaseServerClient } from '@neothink/database/src/serverClient';
export async function GET(req) {
    try {
        const { user, error: userError } = await getUser(req);
        if (userError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        const supabase = await getSupabaseServerClient();
        // Fetch XP, level for all roles
        const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
        if (error)
            throw error;
        // Fetch badges
        const { data: userBadges, error: badgeError } = await supabase
            .from('user_badges')
            .select('badge_id, earned_at, badges(name, description, role)')
            .eq('user_id', user.id);
        if (badgeError)
            throw badgeError;
        return new Response(JSON.stringify({
            profile: Object.assign(Object.assign({}, userData), { badges: (userBadges === null || userBadges === void 0 ? void 0 : userBadges.map(b => {
                    var _a, _b, _c;
                    return ({
                        id: b.badge_id,
                        name: (_a = b.badges) === null || _a === void 0 ? void 0 : _a.name,
                        description: (_b = b.badges) === null || _b === void 0 ? void 0 : _b.description,
                        role: (_c = b.badges) === null || _c === void 0 ? void 0 : _c.role,
                        earned_at: b.earned_at,
                    });
                })) || [] }),
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    catch (error) {
        return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
//# sourceMappingURL=route.js.map