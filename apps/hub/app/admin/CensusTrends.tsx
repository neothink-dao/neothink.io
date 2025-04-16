"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CensusSnapshot {
  created_at: string;
  population: number;
  activity_count: number;
  assets: number;
}

export default function CensusTrends() {
  const [snapshots, setSnapshots] = useState<CensusSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    async function fetchSnapshots() {
      setLoading(true);
      const { data } = await supabase
        .from("census_snapshots")
        .select("created_at, population, activity_count, assets")
        .order("created_at", { ascending: true })
        .limit(50);
      setSnapshots(data || []);
      setLoading(false);
    }
    fetchSnapshots();
  }, []);

  const chartData = {
    labels: snapshots.map(s => new Date(s.created_at).toLocaleDateString()),
    datasets: [
      {
        label: "Population",
        data: snapshots.map(s => s.population),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.1)",
        tension: 0.3,
      },
      {
        label: "Activity",
        data: snapshots.map(s => s.activity_count),
        borderColor: "#eab308",
        backgroundColor: "rgba(234,179,8,0.1)",
        tension: 0.3,
      },
      {
        label: "Assets",
        data: snapshots.map(s => s.assets),
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.1)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Census Trends (Last 50)" },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Count" }, beginAtZero: true },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Census Trends</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Line data={chartData} options={chartOptions} />
      )}
    </div>
  );
}
