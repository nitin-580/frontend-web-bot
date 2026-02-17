"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState, useRef } from "react";

type Job = {
  id: string;
  status: string;
};

export default function LogsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

  // 🔹 Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch(`${API_URL}/api/jobs`, {
        headers: { "x-api-key": API_KEY },
      });
      const data = await res.json();
      setJobs(data);
    };

    fetchJobs();
  }, []);

  // 🔹 Fetch logs for selected job
  useEffect(() => {
    if (!selectedJob) return;

    const fetchLogs = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/jobs/${selectedJob}/logs`,
          {
            headers: { "x-api-key": API_KEY },
          }
        );

        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    };

    fetchLogs();
  }, [selectedJob]);

  // 🔹 Auto-scroll to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-10 space-y-6">
        <h1 className="text-3xl font-bold">Job Logs</h1>

        <div className="grid grid-cols-4 gap-6">
          {/* Job List */}
          <div className="col-span-1 bg-white rounded-xl border shadow-sm p-4 h-[600px] overflow-y-auto">
            <h2 className="font-semibold mb-4">Jobs</h2>

            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job.id)}
                className={`p-3 mb-2 rounded-lg cursor-pointer border ${
                  selectedJob === job.id
                    ? "bg-blue-50 border-blue-400"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    #{job.id}
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      job.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : job.status === "failed"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Logs Panel */}
          <div className="col-span-3 bg-black rounded-xl shadow-lg p-6 text-green-400 font-mono h-[600px] overflow-y-auto">
            {selectedJob ? (
              logs.length > 0 ? (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className="mb-2 whitespace-pre-wrap"
                  >
                    {formatLog(log)}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">
                  Loading logs...
                </div>
              )
            ) : (
              <div className="text-gray-500">
                Select a job to view logs.
              </div>
            )}

            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔥 Beautify Logs
function formatLog(log: string) {
  if (log.includes("ERROR"))
    return (
      <span className="text-red-400">{log}</span>
    );

  if (log.includes("SUCCESS"))
    return (
      <span className="text-green-400 font-bold">
        {log}
      </span>
    );

  if (log.includes("STARTED"))
    return (
      <span className="text-blue-400">{log}</span>
    );

  return <span>{log}</span>;
}