"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";

type ExecutionHistory = {
  id: string;
  keyword: string;
  asin: string;
  rank: number;
  status: "completed" | "failed";
  runtime: string;
  worker: string;
  proxy: string;
  executedAt: string;
};

export default function HistoryPage() {
  const [filter, setFilter] = useState<"all" | "completed" | "failed">("all");

  const history: ExecutionHistory[] = [
    {
      id: "#EX1023",
      keyword: "dish drying mat",
      asin: "B0GLH9JBDP",
      rank: 5,
      status: "completed",
      runtime: "1m 42s",
      worker: "Worker-1",
      proxy: "SOAX",
      executedAt: "2026-02-16 09:01 AM",
    },
    {
      id: "#EX1024",
      keyword: "kitchen mat",
      asin: "B0GLH9JBDP",
      rank: 12,
      status: "completed",
      runtime: "2m 10s",
      worker: "Worker-2",
      proxy: "BrightData",
      executedAt: "2026-02-16 09:05 AM",
    },
    {
      id: "#EX1025",
      keyword: "gaming mouse",
      asin: "B08XYZ1234",
      rank: 0,
      status: "failed",
      runtime: "45s",
      worker: "Worker-3",
      proxy: "SmartProxy",
      executedAt: "2026-02-16 10:02 AM",
    },
  ];

  const filteredHistory =
    filter === "all"
      ? history
      : history.filter((h) => h.status === filter);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-10 space-y-8">
        <h1 className="text-3xl font-bold">Execution History</h1>

        {/* Filter Controls */}
        <div className="flex gap-4">
          {["all", "completed", "failed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-4 py-2 rounded-lg border ${
                filter === type
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* History Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50 text-gray-600">
              <tr>
                <th className="py-3 text-left px-4">Execution ID</th>
                <th>Keyword</th>
                <th>ASIN</th>
                <th>Rank</th>
                <th>Status</th>
                <th>Runtime</th>
                <th>Worker</th>
                <th>Proxy</th>
                <th>Executed At</th>
              </tr>
            </thead>

            <tbody>
              {filteredHistory.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{item.id}</td>
                  <td>{item.keyword}</td>
                  <td>{item.asin}</td>
                  <td>
                    {item.status === "completed"
                      ? `#${item.rank}`
                      : "-"}
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        item.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{item.runtime}</td>
                  <td>{item.worker}</td>
                  <td>{item.proxy}</td>
                  <td>{item.executedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredHistory.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No executions found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}