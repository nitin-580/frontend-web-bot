"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";

type ExecutionHistory = {
  _id: string;
  jobId: string;
  productName: string;
  targetASIN: string;
  status: "completed" | "failed" | "running";
  rankPosition?: number;
  startedAt?: string;
  finishedAt?: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<ExecutionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] =
    useState<"all" | "completed" | "failed" | "running">("all");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/history`,
            {
              headers: {
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
              },
            }
          );
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredHistory =
    filter === "all"
      ? history
      : history.filter((h) => h.status === filter);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-10 space-y-8">
        <h1 className="text-3xl font-bold">Execution History</h1>

        {/* Filter Buttons */}
        <div className="flex gap-4">
          {["all", "completed", "failed", "running"].map(
            (type) => (
              <button
                key={type}
                onClick={() =>
                  setFilter(type as any)
                }
                className={`px-4 py-2 rounded-lg border ${
                  filter === type
                    ? "bg-blue-600 text-white"
                    : "bg-white"
                }`}
              >
                {type.toUpperCase()}
              </button>
            )
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-gray-500">
            Loading history...
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50 text-gray-600">
                <tr>
                  <th className="py-3 text-left px-4">
                    Job ID
                  </th>
                  <th>Keyword</th>
                  <th>ASIN</th>
                  <th>Rank</th>
                  <th>Status</th>
                  <th>Started</th>
                  <th>Finished</th>
                </tr>
              </thead>

              <tbody>
                {filteredHistory.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium">
                      #{item.jobId}
                    </td>
                    <td>{item.productName}</td>
                    <td>{item.targetASIN}</td>
                    <td>
                      {item.rankPosition
                        ? `#${item.rankPosition}`
                        : "-"}
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          item.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : item.status === "failed"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.startedAt
                        ? new Date(
                            item.startedAt
                          ).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      {item.finishedAt
                        ? new Date(
                            item.finishedAt
                          ).toLocaleString()
                        : "-"}
                    </td>
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
        )}
      </div>
    </div>
  );
}