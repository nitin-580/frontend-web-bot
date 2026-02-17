"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type ExecutionHistory = {
  _id: string;
  jobId: string;
  productName: string;
  targetASIN: string;
  status: "waiting" | "running" | "completed" | "failed";
  rankPosition?: number;
  price?: string;
  startedAt?: string;
  finishedAt?: string;
};

type JobUpdatePayload = {
  jobId: string;
  status: "running" | "completed" | "failed";
  rankPosition?: number;
  price?: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<ExecutionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] =
    useState<"all" | "completed" | "failed" | "running">("all");

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

  // -----------------------------
  // 🔹 INITIAL FETCH
  // -----------------------------
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/api/jobs/history`, {
          headers: { "x-api-key": API_KEY },
        });

        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [API_URL, API_KEY]);

  // -----------------------------
  // 🔥 REAL-TIME SOCKET
  // -----------------------------
  useEffect(() => {
    const socket: Socket = io(API_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("🟢 History WebSocket Connected");
    });

    socket.on("jobUpdate", (data: JobUpdatePayload) => {
      console.log("📡 History Update:", data);

      setHistory((prev) =>
        prev.map((job) =>
          job.jobId === data.jobId
            ? {
                ...job,
                status: data.status,
                rankPosition: data.rankPosition ?? job.rankPosition,
                price: data.price ?? job.price,
                finishedAt:
                  data.status === "completed"
                    ? new Date().toISOString()
                    : job.finishedAt,
              }
            : job
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [API_URL]);

  // -----------------------------
  // FILTER
  // -----------------------------
  const filteredHistory =
    filter === "all"
      ? history
      : history.filter((h) => h.status === filter);

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-10 space-y-8">
        <h1 className="text-3xl font-bold">Execution History</h1>

        {/* Filter */}
        <div className="flex gap-4">
          {["all", "completed", "failed", "running"].map(
            (type) => (
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
            )
          )}
        </div>

        {loading && (
          <div className="text-gray-500">
            Loading history...
          </div>
        )}

        {!loading && (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50 text-gray-600">
                <tr>
                  <th className="py-3 text-left px-4">Job ID</th>
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
                      <StatusBadge status={item.status} />
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

function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    waiting: "bg-gray-100 text-gray-600",
    running: "bg-yellow-100 text-yellow-600",
    completed: "bg-green-100 text-green-600",
    failed: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full ${
        colors[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
}