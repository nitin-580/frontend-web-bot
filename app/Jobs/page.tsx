"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type BackendJob = {
  id: string;
  status: "waiting" | "running" | "completed" | "failed";
  productName?: string;
  targetASIN?: string;
  rankPosition?: number;
  price?: string;
  finishedAt?: string;
};

type JobUpdatePayload = {
  jobId: string;
  status: "waiting" | "running" | "completed" | "failed";
  rankPosition?: number;
  price?: string;
};

export default function JobsPage() {
  const [keywords, setKeywords] = useState("");
  const [asin, setAsin] = useState("");
  const [runCount, setRunCount] = useState(1);
  const [jobs, setJobs] = useState<BackendJob[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

  // ----------------------------
  // 🔹 FETCH JOBS
  // ----------------------------
  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/jobs`, {
        headers: { "x-api-key": API_KEY },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Jobs fetch failed:", text);
        return;
      }

      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ----------------------------
  // 🔥 REALTIME SOCKET
  // ----------------------------
  useEffect(() => {
    const socket: Socket = io(API_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("🟢 Jobs WebSocket Connected");
    });

    socket.on("jobUpdate", (data: JobUpdatePayload) => {
      console.log("📡 Jobs Update:", data);

      setJobs((prev) => {
        const exists = prev.find(
          (job) => job.id === data.jobId
        );

        if (exists) {
          return prev.map((job) =>
            job.id === data.jobId
              ? {
                  ...job,
                  status: data.status,
                  rankPosition:
                    data.rankPosition ?? job.rankPosition,
                  price: data.price ?? job.price,
                }
              : job
          );
        }

        // If job not in list yet → add it
        return [
          {
            id: data.jobId,
            status: data.status,
          },
          ...prev,
        ];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [API_URL]);

  // ----------------------------
  // 🚀 CREATE JOB
  // ----------------------------
  const handleCreateJob = async () => {
    if (!keywords || !asin) {
      alert("Keywords and ASIN required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/amazon/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({
          productName: keywords,
          targetASIN: asin,
          count: runCount,
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        console.error("Create job failed:", text);
        return;
      }

      console.log("Created:", text);

      await fetchJobs();
    } catch (err) {
      console.error("Failed to create job", err);
    } finally {
      setLoading(false);
      setKeywords("");
      setAsin("");
      setRunCount(1);
    }
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-10 space-y-10">
        <h1 className="text-3xl font-bold">
          Automation Control Panel
        </h1>

        {/* Create Job */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="font-semibold mb-6">
            Create Rank Tracking Job
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Keyword"
              value={keywords}
              onChange={setKeywords}
              placeholder="dish drying mat"
            />

            <Input
              label="ASIN"
              value={asin}
              onChange={setAsin}
              placeholder="B0GLH9JBDP"
            />

            <div>
              <label className="text-sm text-gray-500">
                Run Count
              </label>
              <input
                type="number"
                value={runCount}
                onChange={(e) =>
                  setRunCount(Number(e.target.value))
                }
                className="mt-1 w-full border rounded-lg p-2"
              />
            </div>
          </div>

          <button
            onClick={handleCreateJob}
            disabled={loading}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Job"}
          </button>
        </div>

        {/* Job Table */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="font-semibold mb-4">
            Recent Jobs
          </h2>

          <table className="w-full text-sm">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="py-2 text-left">Job ID</th>
                <th>Status</th>
                <th>Keyword</th>
                <th>ASIN</th>
                <th>Rank</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b">
                  <td className="py-2">#{job.id}</td>

                  <td>
                    <StatusBadge status={job.status} />
                  </td>

                  <td>{job.productName}</td>
                  <td>{job.targetASIN}</td>

                  <td>
                    {job.status === "running" ? (
                      <LoadingSpinner />
                    ) : job.rankPosition ? (
                      `#${job.rankPosition}`
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    {job.status === "running" ? (
                      <LoadingSpinner />
                    ) : (
                      job.price || "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {jobs.length === 0 && (
            <div className="text-gray-500 mt-4">
              No jobs found.
            </div>
          )}
        </div>
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

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm text-gray-500">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}