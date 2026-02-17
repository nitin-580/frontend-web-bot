"use client";

import { useEffect, useState } from "react";

export default function ServerHealthCard() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;

  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_URL}/health`);
      if (!res.ok) throw new Error("Server down");

      const data = await res.json();
      setIsHealthy(data.status === "ok");
    } catch {
      setIsHealthy(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000); // check every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <h2 className="font-semibold mb-4 text-lg">Server Status</h2>

      {isHealthy === null && (
        <div className="text-gray-500 text-sm">Checking...</div>
      )}

      {isHealthy === true && (
        <div className="flex items-center gap-2 text-green-600 font-medium">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
          Server Online
        </div>
      )}

      {isHealthy === false && (
        <div className="flex items-center gap-2 text-red-600 font-medium">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          Server Down
        </div>
      )}
    </div>
  );
}