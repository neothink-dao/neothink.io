import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export function UserTable() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            // Example: join auth.users with xp_events and badge_events for analytics
            const { data: xpData } = await supabase
                .from('xp_events')
                .select('user_id, xp_amount, created_at');
            const { data: badgeData } = await supabase
                .from('badge_events')
                .select('user_id, created_at');
            const { data: usersData } = await supabase
                .from('users')
                .select('id, email');
            // Aggregate XP, badges, last active
            const userMap = {};
            usersData === null || usersData === void 0 ? void 0 : usersData.forEach((u) => {
                userMap[u.id] = {
                    id: u.id,
                    email: u.email,
                    xp: 0,
                    badges: 0,
                    last_active: '',
                };
            });
            xpData === null || xpData === void 0 ? void 0 : xpData.forEach((e) => {
                if (userMap[e.user_id]) {
                    userMap[e.user_id].xp += e.xp_amount || 0;
                    if (!userMap[e.user_id].last_active || e.created_at > userMap[e.user_id].last_active) {
                        userMap[e.user_id].last_active = e.created_at;
                    }
                }
            });
            badgeData === null || badgeData === void 0 ? void 0 : badgeData.forEach((b) => {
                if (userMap[b.user_id]) {
                    userMap[b.user_id].badges += 1;
                    if (!userMap[b.user_id].last_active || b.created_at > userMap[b.user_id].last_active) {
                        userMap[b.user_id].last_active = b.created_at;
                    }
                }
            });
            setUsers(Object.values(userMap));
            setLoading(false);
        }
        fetchUsers();
    }, []);
    return (<div className="overflow-x-auto">
      <table className="min-w-full bg-slate-900 rounded-lg shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-slate-300">Email</th>
            <th className="px-4 py-2 text-left text-slate-300">XP</th>
            <th className="px-4 py-2 text-left text-slate-300">Badges</th>
            <th className="px-4 py-2 text-left text-slate-300">Last Active</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (<tr><td colSpan={4} className="text-center text-slate-400">Loading…</td></tr>) : users.length === 0 ? (<tr><td colSpan={4} className="text-center text-slate-400">No users found.</td></tr>) : (users.map((u) => (<tr key={u.id}>
                <td className="px-4 py-2 text-slate-100">{u.email}</td>
                <td className="px-4 py-2 text-yellow-300 font-bold">{u.xp}</td>
                <td className="px-4 py-2 text-pink-300 font-bold">{u.badges}</td>
                <td className="px-4 py-2 text-cyan-200">{u.last_active ? new Date(u.last_active).toLocaleString() : '-'}</td>
              </tr>)))}
        </tbody>
      </table>
    </div>);
}
//# sourceMappingURL=UserTable.js.map