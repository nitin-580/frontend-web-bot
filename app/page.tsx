"use client";

import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import JobTable from "@/components/JobTable";
import WorkerStatus from "@/components/WorkerStatus";
import ProxyStatus from "@/components/ProxyStatus";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10 space-y-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard title="Jobs Completed" value="1,284" subtitle="Successful runs" />
          <StatCard title="Scheduled Jobs" value="32" subtitle="Active cron tasks" />
          <StatCard title="Average Runtime" value="3.2 min" subtitle="Per execution" />
          <StatCard title="Success Rate" value="97.8%" subtitle="Last 30 days" />
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