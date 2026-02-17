import { ReactNode } from "react";

export default function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;   // ✅ FIXED
  subtitle: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-semibold mt-2">
        {value}
      </h2>
      <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
    </div>
  );
}