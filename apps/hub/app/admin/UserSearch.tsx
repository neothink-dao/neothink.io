"use client";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

interface UserEvent {
  id: string;
  event_type?: string;
  xp_amount?: number;
  badge_id?: string;
  earned?: boolean;
  created_at: string;
  table: string;
}

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEvents([]);
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    try {
      // Search XP events
      const { data: xpEvents } = await supabase
        .from("xp_events")
        .select("id, event_type, xp_amount, created_at")
        .eq("user_id", query)
        .order("created_at", { ascending: false })
        .limit(10);
      // Search badge events
      const { data: badgeEvents } = await supabase
        .from("badge_events")
        .select("id, badge_id, earned, created_at")
        .eq("user_id", query)
        .order("created_at", { ascending: false })
        .limit(10);
      const allEvents: UserEvent[] = [
        ...(xpEvents?.map(ev => ({ ...ev, table: "xp_events" })) || []),
        ...(badgeEvents?.map(ev => ({ ...ev, table: "badge_events" })) || []),
      ];
      allEvents.sort((a, b) => b.created_at.localeCompare(a.created_at));
      setEvents(allEvents);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">User Search</h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          className="border rounded px-2 py-1 flex-1"
          type="text"
          placeholder="Enter user ID..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-1 rounded" disabled={loading}>
          Search
        </button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading && <div>Loading...</div>}
      {events.length > 0 && (
        <table className="min-w-full text-sm mt-2">
          <thead>
            <tr>
              <th className="text-left py-1 px-2">Type</th>
              <th className="text-left py-1 px-2">Details</th>
              <th className="text-left py-1 px-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {events.map(ev => (
              <tr key={ev.id}>
                <td className="py-1 px-2">{ev.table === "xp_events" ? "XP" : "Badge"}</td>
                <td className="py-1 px-2">
                  {ev.table === "xp_events"
                    ? `Type: ${ev.event_type}, XP: ${ev.xp_amount}`
                    : `Badge: ${ev.badge_id}, Earned: ${String(ev.earned)}`}
                </td>
                <td className="py-1 px-2">{new Date(ev.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
