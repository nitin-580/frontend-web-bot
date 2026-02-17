"use client";

import { useEffect, useState } from "react";

type Job = {
  id: string;
  status: string;
  productName?: string;
  targetASIN?: string;
  rankPosition?: string;
};

export default function JobTable() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

  useEffect(() => {
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

    fetchJobs();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="font-semibold mb-4">Recent Jobs</h2>

      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="py-2 text-left">Job ID</th>
            <th>Status</th>
            <th>Keyword</th>
            <th>ASIN</th>
            <th>Rank</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}