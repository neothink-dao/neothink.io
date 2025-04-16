"use client";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function ExportButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      // Fetch recent events from all key tables
      const [xp, badge, fib, census] = await Promise.all([
        supabase.from("xp_events").select("*", { count: "exact" }).limit(1000),
        supabase.from("badge_events").select("*", { count: "exact" }).limit(1000),
        supabase.from("fibonacci_token_rewards").select("*", { count: "exact" }).limit(1000),
        supabase.from("census_snapshots").select("*", { count: "exact" }).limit(1000),
      ]);
      const data = {
        xp_events: xp.data || [],
        badge_events: badge.data || [],
        fibonacci_token_rewards: fib.data || [],
        census_snapshots: census.data || [],
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gamification-export-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        onClick={handleExport}
        className="bg-emerald-600 text-white px-4 py-2 rounded shadow hover:bg-emerald-700"
        disabled={loading}
      >
        {loading ? "Exporting..." : "Export All Events (JSON)"}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}
