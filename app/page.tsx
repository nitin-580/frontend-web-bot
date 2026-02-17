"use client";

import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import JobTable from "@/components/JobTable";
import WorkerStatus from "@/components/WorkerStatus";
import ProxyStatus from "@/components/ProxyStatus";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${API_URL}/api/jobs/analytics`, {
          headers: {
            "x-api-key": API_KEY,
          },
        });

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10 space-y-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard
            title="Jobs Completed"
            value={stats?.completed || 0}
            subtitle="Successful runs"
          />

          <StatCard
            title="Total Jobs"
            value={stats?.total || 0}
            subtitle="All executions"
          />

          <StatCard
            title="Running Jobs"
            value={stats?.running || 0}
            subtitle="Currently active"
          />

          <StatCard
            title="Success Rate"
            value={stats?.successRate || "0%"}
            subtitle="Overall performance"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <JobTable />
          </div>

          <div className="space-y-6">
            <WorkerStatus />
            <ProxyStatus />
          </div>
        </div>
      </div>
    </div>
  );
}