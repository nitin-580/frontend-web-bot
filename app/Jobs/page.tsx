"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";

type BackendJob = {
  id: string;
  status: string;
  productName?: string;
  targetASIN?: string;
  rankPosition?: string;
  price?: string;
  finishedAt?: string;
};

export default function JobsPage() {
  const [keywords, setKeywords] = useState("");
  const [asin, setAsin] = useState("");
  const [runCount, setRunCount] = useState(1);
  const [strategy, setStrategy] = useState("Round Robin");

  const [jobs, setJobs] = useState<BackendJob[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

  // 🔄 Fetch recent jobs
  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/jobs`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });

      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // 🚀 Create Job
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

      const data = await res.json();

      console.log("Created Job:", data);

      await fetchJobs(); // Refresh list
    } catch (err) {
      console.error("Failed to create job", err);
    } finally {
      setLoading(false);
      setKeywords("");
      setAsin("");
      setRunCount(1);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-10 space-y-10">
        <h1 className="text-3xl font-bold">
          Automation Control Panel
        </h1>

        {/* Job Creator */}
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

            <div>
              <label className="text-sm text-gray-500">
                Strategy (UI Only)
              </label>
              <select
                value={strategy}
                onChange={(e) =>
                  setStrategy(e.target.value)
                }
                className="mt-1 w-full border rounded-lg p-2"
              >
                <option>Round Robin</option>
                <option>Random</option>
              </select>
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

        {/* Job History */}
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
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        job.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : job.status === "failed"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td>{job.productName}</td>
                  <td>{job.targetASIN}</td>
                  <td>
                    {job.rankPosition
                      ? `#${job.rankPosition}`
                      : "-"}
                  </td>
                  <td>{job.price || "-"}</td>
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
      <label className="text-sm text-gray-500">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}