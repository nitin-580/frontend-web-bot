"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";

type ExecutionResult = {
  keyword: string;
  rank: number;
  asinMatched: boolean;
  fulfilled: boolean;
  runtime: string;
  worker: string;
  proxy: string;
};

type JobHistory = {
  id: string;
  asin: string;
  runCount: number;
  strategy: string;
  executions: ExecutionResult[];
};

export default function JobsPage() {
  const [keywords, setKeywords] = useState("");
  const [asin, setAsin] = useState("");
  const [runCount, setRunCount] = useState(1);
  const [strategy, setStrategy] = useState("Round Robin");

  const [history, setHistory] = useState<JobHistory[]>([]);

  const workers = ["Worker-1", "Worker-2", "Worker-3"];
  const proxies = ["SOAX", "BrightData", "SmartProxy"];

  const handleCreateJob = () => {
    if (!keywords || !asin) {
      alert("Keywords and ASIN required");
      return;
    }

    const keywordList = keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const executions: ExecutionResult[] = [];

    keywordList.forEach((keyword) => {
      for (let i = 0; i < runCount; i++) {
        const worker =
          strategy === "Round Robin"
            ? workers[i % workers.length]
            : workers[Math.floor(Math.random() * workers.length)];

        executions.push({
          keyword,
          rank: Math.floor(Math.random() * 50) + 1,
          asinMatched: Math.random() > 0.2,
          fulfilled: Math.random() > 0.1,
          runtime: `${Math.floor(Math.random() * 3) + 1}m ${
            Math.floor(Math.random() * 60)
          }s`,
          worker,
          proxy: proxies[Math.floor(Math.random() * proxies.length)],
        });
      }
    });

    const newJob: JobHistory = {
      id: `#JOB${Math.floor(Math.random() * 10000)}`,
      asin,
      runCount,
      strategy,
      executions,
    };

    setHistory([newJob, ...history]);
    setKeywords("");
    setAsin("");
    setRunCount(1);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-10 space-y-10">
        <h1 className="text-3xl font-bold">Automation Control Panel</h1>

        {/* Job Creator */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="font-semibold mb-6">Create Rank Tracking Job</h2>

          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Keywords (comma separated)"
              value={keywords}
              onChange={setKeywords}
              placeholder="wireless mouse, gaming mouse"
            />

            <Input
              label="ASIN"
              value={asin}
              onChange={setAsin}
              placeholder="B08XYZ1234"
            />

            <div>
              <label className="text-sm text-gray-500">
                Run Count (per keyword)
              </label>
              <input
                type="number"
                value={runCount}
                onChange={(e) => setRunCount(Number(e.target.value))}
                className="mt-1 w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Worker Selection Strategy
              </label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="mt-1 w-full border rounded-lg p-2"
              >
                <option>Round Robin</option>
                <option>Random</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCreateJob}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create & Execute
          </button>
        </div>

        {/* Execution History */}
        {history.map((job) => (
          <div
            key={job.id}
            className="bg-white p-6 rounded-xl border shadow-sm"
          >
            <div className="mb-4">
              <h3 className="font-semibold text-lg">{job.id}</h3>
              <p className="text-sm text-gray-500">
                ASIN: {job.asin} | Runs: {job.runCount} | Strategy:{" "}
                {job.strategy}
              </p>
            </div>

            <table className="w-full text-sm">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="py-2 text-left">Keyword</th>
                  <th>Rank</th>
                  <th>ASIN Matched</th>
                  <th>Fulfilled</th>
                  <th>Runtime</th>
                  <th>Worker</th>
                  <th>Proxy</th>
                </tr>
              </thead>
              <tbody>
                {job.executions.map((exec, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{exec.keyword}</td>
                    <td>#{exec.rank}</td>
                    <td
                      className={
                        exec.asinMatched
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {exec.asinMatched ? "Yes" : "No"}
                    </td>
                    <td
                      className={
                        exec.fulfilled
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {exec.fulfilled ? "Yes" : "No"}
                    </td>
                    <td>{exec.runtime}</td>
                    <td>{exec.worker}</td>
                    <td>{exec.proxy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
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