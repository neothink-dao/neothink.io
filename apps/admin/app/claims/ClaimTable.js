import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const TOKEN_SCHEDULE = [
    { day: 'Sunday', token: 'SPD', gradient: 'from-red-400 via-green-400 to-blue-500' },
    { day: 'Monday', token: 'SHE', gradient: 'from-rose-400 via-red-400 to-orange-400' },
    { day: 'Tuesday', token: 'PSP', gradient: 'from-amber-300 via-yellow-300 to-yellow-500' },
    { day: 'Wednesday', token: 'SSA', gradient: 'from-lime-400 via-green-400 to-emerald-400' },
    { day: 'Thursday', token: 'BSP', gradient: 'from-teal-400 via-cyan-400 to-cyan-600' },
    { day: 'Friday', token: 'SGB', gradient: 'from-sky-400 via-blue-400 to-indigo-500' },
    { day: 'Saturday', token: 'SMS', gradient: 'from-violet-400 via-fuchsia-400 to-pink-400' },
];
function getTodayToken() {
    const today = new Date().getDay(); // 0 = Sunday
    return TOKEN_SCHEDULE[today];
}
export function ClaimTable() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDay, setFilterDay] = useState('');
    const [filterToken, setFilterToken] = useState('');
    useEffect(() => {
        async function fetchClaims() {
            setLoading(true);
            const { data } = await supabase
                .from('fibonacci_token_rewards')
                .select('id, user_id, token, claimed_at, status');
            setClaims(data || []);
            setLoading(false);
        }
        fetchClaims();
    }, []);
    const filteredClaims = claims.filter((c) => {
        const day = new Date(c.claimed_at).toLocaleDateString('en-US', { weekday: 'long' });
        return ((!filterDay || day === filterDay) &&
            (!filterToken || c.token === filterToken));
    });
    return (<div>
      <div className="flex flex-wrap gap-4 mb-4">
        <select className="bg-slate-800 text-slate-200 rounded px-3 py-2" value={filterDay} onChange={(e) => setFilterDay(e.target.value)}>
          <option value="">All Days</option>
          {TOKEN_SCHEDULE.map((t) => (<option key={t.day} value={t.day}>{t.day}</option>))}
        </select>
        <select className="bg-slate-800 text-slate-200 rounded px-3 py-2" value={filterToken} onChange={(e) => setFilterToken(e.target.value)}>
          <option value="">All Tokens</option>
          {TOKEN_SCHEDULE.map((t) => (<option key={t.token} value={t.token}>{t.token}</option>))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-slate-900 rounded-lg shadow-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-slate-300">User</th>
              <th className="px-4 py-2 text-left text-slate-300">Token</th>
              <th className="px-4 py-2 text-left text-slate-300">Day</th>
              <th className="px-4 py-2 text-left text-slate-300">Claimed At</th>
              <th className="px-4 py-2 text-left text-slate-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (<tr><td colSpan={5} className="text-center text-slate-400">Loading…</td></tr>) : filteredClaims.length === 0 ? (<tr><td colSpan={5} className="text-center text-slate-400">No claims found.</td></tr>) : (filteredClaims.map((c) => {
            const day = new Date(c.claimed_at).toLocaleDateString('en-US', { weekday: 'long' });
            const tokenInfo = TOKEN_SCHEDULE.find((t) => t.token === c.token);
            return (<tr key={c.id}>
                    <td className="px-4 py-2 text-slate-100">{c.user_id}</td>
                    <td className={`px-4 py-2 font-bold bg-gradient-to-r ${tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.gradient} text-transparent bg-clip-text`}>{c.token}</td>
                    <td className="px-4 py-2 text-lime-300">{day}</td>
                    <td className="px-4 py-2 text-cyan-200">{new Date(c.claimed_at).toLocaleString()}</td>
                    <td className="px-4 py-2 text-emerald-300">{c.status}</td>
                  </tr>);
        }))}
          </tbody>
        </table>
      </div>
    </div>);
}
//# sourceMappingURL=ClaimTable.js.map