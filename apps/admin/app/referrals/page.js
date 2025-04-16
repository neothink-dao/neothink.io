import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export default function ReferralsPage() {
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchReferrals() {
            setLoading(true);
            const { data } = await supabase
                .from('referrals')
                .select('id, inviter_id, invitee_id, invited_at, accepted, bonus_awarded');
            setReferrals(data || []);
            setLoading(false);
        }
        fetchReferrals();
    }, []);
    return (<div>
      <h2 className="text-2xl font-bold mb-6 text-white">Referral & Viral Flows</h2>
      <div className="bg-slate-800 rounded-lg p-4 shadow-lg text-slate-200 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-slate-300">Inviter</th>
              <th className="px-4 py-2 text-left text-slate-300">Invitee</th>
              <th className="px-4 py-2 text-left text-slate-300">Invited At</th>
              <th className="px-4 py-2 text-left text-slate-300">Accepted</th>
              <th className="px-4 py-2 text-left text-slate-300">Bonus Awarded</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (<tr><td colSpan={5} className="text-center text-slate-400">Loading…</td></tr>) : referrals.length === 0 ? (<tr><td colSpan={5} className="text-center text-slate-400">No referrals found.</td></tr>) : (referrals.map((r) => (<tr key={r.id}>
                  <td className="px-4 py-2 text-slate-100">{r.inviter_id}</td>
                  <td className="px-4 py-2 text-slate-100">{r.invitee_id}</td>
                  <td className="px-4 py-2 text-cyan-200">{new Date(r.invited_at).toLocaleString()}</td>
                  <td className="px-4 py-2 text-emerald-300">{r.accepted ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 text-yellow-300">{r.bonus_awarded ? 'Yes' : 'No'}</td>
                </tr>)))}
          </tbody>
        </table>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map