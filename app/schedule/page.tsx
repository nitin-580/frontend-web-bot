"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";

type ScheduleHistory = {
  id: string;
  asin: string;
  keywords: string[];
  frequency: string;
  nextRun: string;
  lastRun: string;
  status: "active" | "paused";
  totalExecutions: number;
};

export default function ScheduledTasksPage() {
  const [keywordInput, setKeywordInput] = useState("");
  const [asin, setAsin] = useState("");
  const [frequency, setFrequency] = useState("Daily");

  const [schedules, setSchedules] = useState<ScheduleHistory[]>([
    {
      id: "#SCH1021",
      asin: "B0GLH9JBDP",
      keywords: ["dish drying mat", "kitchen mat"],
      frequency: "Daily",
      nextRun: "2026-02-17 09:00 AM",
      lastRun: "2026-02-16 09:01 AM",
      status: "active",
      totalExecutions: 12,
    },
    {
      id: "#SCH9842",
      asin: "B08XYZ1234",
      keywords: ["gaming mouse", "wireless mouse"],
      frequency: "Every 6 Hours",
      nextRun: "2026-02-16 18:00 PM",
      lastRun: "2026-02-16 12:00 PM",
      status: "paused",
      totalExecutions: 28,
    },
  ]);

  const handleCreateSchedule = () => {
    if (!keywordInput || !asin) {
      alert("ASIN and keywords required");
      return;
    }

    const newSchedule: ScheduleHistory = {
      id: `#SCH${Math.floor(Math.random() * 10000)}`,
      asin,
      keywords: keywordInput.split(",").map((k) => k.trim()),
      frequency,
      nextRun: "2026-02-17 09:00 AM",
      lastRun: "Not executed yet",
      status: "active",
      totalExecutions: 0,
    };

    setSchedules([newSchedule, ...schedules]);
    setKeywordInput("");
    setAsin("");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-10 space-y-10">
        <h1 className="text-3xl font-bold">Scheduled Rank Tasks</h1>

        {/* Create Schedule */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="font-semibold mb-6">Create Scheduled Task</h2>

          <div className="grid grid-cols-3 gap-6">
            <Input
              label="Keywords (comma separated)"
              value={keywordInput}
              onChange={setKeywordInput}
              placeholder="dish mat, kitchen mat"
            />

            <Input
              label="ASIN"
              value={asin}
              onChange={setAsin}
              placeholder="B0GLH9JBDP"
            />

            <div>
              <label className="text-sm text-gray-500">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="mt-1 w-full border rounded-lg p-2"
              >
                <option>Hourly</option>
                <option>Every 6 Hours</option>
                <option>Daily</option>
                <option>Weekly</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCreateSchedule}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Schedule Task
          </button>
        </div>

        {/* Scheduled History */}
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-white p-6 rounded-xl border shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold text-lg">{schedule.id}</h3>
                <p className="text-sm text-gray-500">
                  ASIN: {schedule.asin}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  schedule.status === "active"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {schedule.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-gray-500">Keywords</p>
                <p>{schedule.keywords.join(", ")}</p>
              </div>

              <div>
                <p className="text-gray-500">Frequency</p>
                <p>{schedule.frequency}</p>
              </div>

              <div>
                <p className="text-gray-500">Total Executions</p>
                <p>{schedule.totalExecutions}</p>
              </div>

              <div>
                <p className="text-gray-500">Last Run</p>
                <p>{schedule.lastRun}</p>
              </div>

              <div>
                <p className="text-gray-500">Next Run</p>
                <p>{schedule.nextRun}</p>
              </div>
            </div>
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