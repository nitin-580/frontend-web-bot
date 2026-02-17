"use client";

import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import JobTable from "@/components/JobTable";
import WorkerStatus from "@/components/WorkerStatus";
import ProxyStatus from "@/components/ProxyStatus";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

type Stats = {
  total: number;
  completed: number;
  failed: number;
  running: number;
  successRate: string;
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    failed: 0,
    running: 0,
    successRate: "0%",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_URL}/api/jobs/analytics`, {
        headers: { "x-api-key": API_KEY },
      });

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Analytics fetch failed", err);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchAnalytics();
  }, []);

  // 🔥 Realtime updates
  useEffect(() => {
    const socket = io(API_URL);

    socket.on("connect", () => {
      console.log("🟢 WebSocket connected");
    });

    socket.on("jobUpdate", () => {
      // Instead of incrementing manually
      // Always refresh analytics safely
      fetchAnalytics();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10 space-y-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-4 gap-6">
          <StatCard
            title="Jobs Completed"
            value={stats.completed}
            subtitle="Successful runs"
          />

          <StatCard
            title="Total Jobs"
            value={stats.total}
            subtitle="All executions"
          />

          <StatCard
            title="Running Jobs"
            value={stats.running}
            subtitle="Currently active"
          />

          <StatCard
            title="Success Rate"
            value={stats.successRate}
            subtitle="Overall performance"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <JobTable />
          </div>

          <div className="space-y-6">
            <ProxyStatus />
          </div>
        </div>
      </div>
    </div>
  );
}