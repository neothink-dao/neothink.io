"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

interface LeaderboardEntry {
  user_id: string;
  xp: number;
  badges: number;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    async function fetchLeaders() {
      setLoading(true);
      // Aggregate XP and badges for each user
      const { data: xpRows } = await supabase
        .from("xp_events")
        .select("user_id, xp_amount")
        .order("xp_amount", { ascending: false });
      const xpMap: Record<string, number> = {};
      xpRows?.forEach(row => {
        xpMap[row.user_id] = (xpMap[row.user_id] || 0) + row.xp_amount;
      });
      const { data: badgeRows } = await supabase
        .from("badge_events")
        .select("user_id")
        .eq("earned", true);
      const badgeMap: Record<string, number> = {};
      badgeRows?.forEach(row => {
        badgeMap[row.user_id] = (badgeMap[row.user_id] || 0) + 1;
      });
      // Merge and sort
      const leaderboard: LeaderboardEntry[] = Object.keys(xpMap).map(user_id => ({
        user_id,
        xp: xpMap[user_id],
        badges: badgeMap[user_id] || 0,
      }));
      leaderboard.sort((a, b) => b.xp - a.xp);
      setLeaders(leaderboard.slice(0, 20));
      setLoading(false);
    }
    fetchLeaders();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-1 px-2">Rank</th>
              <th className="text-left py-1 px-2">User</th>
              <th className="text-left py-1 px-2">XP</th>
              <th className="text-left py-1 px-2">Badges</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((entry, idx) => (
              <tr key={entry.user_id} className={idx === 0 ? "font-bold text-yellow-600" : ""}>
                <td className="py-1 px-2">{idx + 1}</td>
                <td className="py-1 px-2">{entry.user_id.slice(0, 8)}...</td>
                <td className="py-1 px-2">{entry.xp}</td>
                <td className="py-1 px-2">{entry.badges}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
