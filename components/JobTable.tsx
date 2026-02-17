"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type Job = {
  id: string;
  productName: string;
  targetASIN: string;
  status: "waiting" | "running" | "completed" | "failed";
};

type JobUpdatePayload = {
  jobId: string;
  status: "waiting" | "running" | "completed" | "failed";
};

export default function JobTable() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

  // -----------------------------
  // 🔹 Initial Fetch
  // -----------------------------
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_URL}/api/jobs`, {
          headers: { "x-api-key": API_KEY },
        });

        if (!res.ok) {
          console.error("Failed to fetch jobs");
          return;
        }

        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchJobs();
  }, [API_URL, API_KEY]);

  // -----------------------------
  // 🔥 WebSocket Realtime
  // -----------------------------
  useEffect(() => {
    console.log("🔌 Connecting to:", API_URL);

    const socket: Socket = io(API_URL);

    socket.on("connect", () => {
      console.log("🟢 WebSocket CONNECTED:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("🔴 WebSocket Error:", err.message);
    });

    socket.on("jobUpdate", (data: JobUpdatePayload) => {
      console.log("📡 Job Update Received:", data);

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === data.jobId
            ? { ...job, status: data.status }
            : job
        )
      );
    });

    socket.on("disconnect", () => {
      console.log("⚠️ WebSocket Disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [API_URL]);

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="bg-white rounded-xl shadow border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="py-3 px-4 text-left">Job ID</th>
            <th>Keyword</th>
            <th>ASIN</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-b">
              <td className="py-3 px-4 font-medium">#{job.id}</td>
              <td>{job.productName}</td>
              <td>{job.targetASIN}</td>
              <td>
                <StatusBadge status={job.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {jobs.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No jobs found.
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "waiting" | "running" | "completed" | "failed";
}) {
  const colors = {
    waiting: "bg-gray-100 text-gray-600",
    running: "bg-yellow-100 text-yellow-600",
    completed: "bg-green-100 text-green-600",
    failed: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full ${
        colors[status]
      }`}
    >
      {status}
    </span>
  );
}