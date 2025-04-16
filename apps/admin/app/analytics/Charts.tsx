import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TOKEN_SCHEDULE = [
  { day: 'Sunday', token: 'SPD', gradient: 'from-red-400 via-green-400 to-blue-500' },
  { day: 'Monday', token: 'SHE', gradient: 'from-rose-400 via-red-400 to-orange-400' },
  { day: 'Tuesday', token: 'PSP', gradient: 'from-amber-300 via-yellow-300 to-yellow-500' },
  { day: 'Wednesday', token: 'SSA', gradient: 'from-lime-400 via-green-400 to-emerald-400' },
  { day: 'Thursday', token: 'BSP', gradient: 'from-teal-400 via-cyan-400 to-cyan-600' },
  { day: 'Friday', token: 'SGB', gradient: 'from-sky-400 via-blue-400 to-indigo-500' },
  { day: 'Saturday', token: 'SMS', gradient: 'from-violet-400 via-fuchsia-400 to-pink-400' },
];

function getTokenGradient(token: string) {
  return TOKEN_SCHEDULE.find((t) => t.token === token)?.gradient || '';
}

// Simple bar chart component
function BarChart({ data, label }: { data: { label: string, value: number, color: string }[], label: string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2 text-white">{label}</h3>
      <div className="flex items-end h-32 gap-2">
        {data.map((d) => (
          <div key={d.label} className="flex flex-col items-center w-12">
            <div
              className={`w-10 rounded-t bg-gradient-to-b ${d.color}`}
              style={{ height: `${(d.value / max) * 100}%`, minHeight: 4 }}
              title={d.value.toString()}
            />
            <span className="text-xs text-slate-200 mt-1">{d.label}</span>
            <span className="text-xs text-yellow-300 font-bold">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Charts() {
  const [tokenClaims, setTokenClaims] = useState<Record<string, number>>({});
  const [userGrowth, setUserGrowth] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      // Token claims per token
      const { data: claims } = await supabase
        .from('fibonacci_token_rewards')
        .select('token');
      const tokenCounts: Record<string, number> = {};
      claims?.forEach((c: any) => {
        tokenCounts[c.token] = (tokenCounts[c.token] || 0) + 1;
      });
      // User growth by week
      const { data: users } = await supabase
        .from('users')
        .select('id, created_at');
      const weekCounts: Record<string, number> = {};
      users?.forEach((u: any) => {
        const week = new Date(u.created_at).toLocaleDateString('en-US', { year: 'numeric', week: 'numeric' } as any);
        weekCounts[week] = (weekCounts[week] || 0) + 1;
      });
      setTokenClaims(tokenCounts);
      setUserGrowth(weekCounts);
      setLoading(false);
    }
    fetchAnalytics();
  }, []);

  const tokenData = TOKEN_SCHEDULE.map((t) => ({
    label: t.token,
    value: tokenClaims[t.token] || 0,
    color: t.gradient,
  }));

  const userGrowthData = Object.entries(userGrowth).map(([week, value]) => ({
    label: week,
    value,
    color: 'from-emerald-400 to-cyan-600',
  }));

  return (
    <div>
      {loading ? <div className="text-slate-400">Loading analytics…</div> : (
        <>
          <BarChart data={tokenData} label="Token Claims by Type" />
          <BarChart data={userGrowthData} label="User Growth by Week" />
        </>
      )}
    </div>
  );
}
