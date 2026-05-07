"use client";

import { TrendingUp, TrendingDown, Users, Activity, Calendar, DollarSign } from "lucide-react";

const iconMap = { Users, Activity, Calendar, DollarSign };

export default function StatCard({ label, value, change, trend, icon }) {
  const Icon = iconMap[icon] || Users;
  const isUp = trend === "up";

  return (
    <div
      className="glass-card stat-shine relative p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform duration-200"
      style={{ cursor: "default" }}
    >
      {/* Icon bubble */}
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.1))",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          <Icon size={18} style={{ color: "#818cf8" }} />
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full`}
          style={{
            background: isUp ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            color: isUp ? "#4ade80" : "#f87171",
            border: `1px solid ${isUp ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
          }}
        >
          {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {change}
        </span>
      </div>

      {/* Value */}
      <div>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        <p className="text-sm mt-0.5" style={{ color: "rgba(148,163,184,0.7)" }}>
          {label}
        </p>
      </div>

      {/* Mini sparkline (decorative) */}
      <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(99,102,241,0.1)" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: isUp ? "72%" : "38%",
            background: isUp
              ? "linear-gradient(90deg,#22c55e,#4ade80)"
              : "linear-gradient(90deg,#ef4444,#f87171)",
          }}
        />
      </div>
    </div>
  );
}
