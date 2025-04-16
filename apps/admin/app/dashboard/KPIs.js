import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export function KPIs() {
    const [kpis, setKpis] = useState({
        totalXP: 0,
        totalBadges: 0,
        activeUsers: 0,
        censusSnapshots: 0,
        tokenClaims: 0,
        loading: true,
    });
    useEffect(() => {
        async function fetchKPIs() {
            var _a, _b, _c, _d;
            setKpis((k) => (Object.assign(Object.assign({}, k), { loading: true })));
            const [xpRes, badgeRes, userRes, censusRes, claimsRes] = await Promise.all([
                supabase.from('xp_events').select('xp_amount'),
                supabase.from('badge_events').select('id'),
                supabase.from('xp_events').select('user_id', { count: 'exact', head: true }),
                supabase.from('census_snapshots').select('id'),
                supabase.from('fibonacci_token_rewards').select('id'),
            ]);
            setKpis({
                totalXP: ((_a = xpRes.data) === null || _a === void 0 ? void 0 : _a.reduce((sum, e) => sum + (e.xp_amount || 0), 0)) || 0,
                totalBadges: ((_b = badgeRes.data) === null || _b === void 0 ? void 0 : _b.length) || 0,
                activeUsers: userRes.count || 0,
                censusSnapshots: ((_c = censusRes.data) === null || _c === void 0 ? void 0 : _c.length) || 0,
                tokenClaims: ((_d = claimsRes.data) === null || _d === void 0 ? void 0 : _d.length) || 0,
                loading: false,
            });
        }
        fetchKPIs();
        // Optionally, refresh every 30s for near-realtime
        const interval = setInterval(fetchKPIs, 30000);
        return () => clearInterval(interval);
    }, []);
    return (<div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
      <KPIBox label="Total XP" value={kpis.totalXP} loading={kpis.loading} color="from-yellow-400 to-amber-600"/>
      <KPIBox label="Badges Awarded" value={kpis.totalBadges} loading={kpis.loading} color="from-pink-400 to-fuchsia-600"/>
      <KPIBox label="Active Users" value={kpis.activeUsers} loading={kpis.loading} color="from-cyan-400 to-teal-600"/>
      <KPIBox label="Census Snapshots" value={kpis.censusSnapshots} loading={kpis.loading} color="from-green-400 to-emerald-600"/>
      <KPIBox label="Token Claims" value={kpis.tokenClaims} loading={kpis.loading} color="from-violet-400 to-indigo-600"/>
    </div>);
}
function KPIBox({ label, value, loading, color }) {
    return (<div className={`rounded-xl p-6 shadow-lg bg-gradient-to-br ${color} text-white flex flex-col items-center justify-center`}>
      <span className="text-lg font-semibold mb-2">{label}</span>
      <span className="text-3xl font-bold">{loading ? '…' : value}</span>
    </div>);
}
//# sourceMappingURL=KPIs.js.map