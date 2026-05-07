"use client";

import { DEPARTMENTS, STATUSES } from "@/lib/mockData";

const departmentColors = {
  Engineering: { bg: "rgba(99,102,241,0.15)", color: "#818cf8", border: "rgba(99,102,241,0.25)" },
  Product: { bg: "rgba(168,85,247,0.12)", color: "#c084fc", border: "rgba(168,85,247,0.25)" },
  Design: { bg: "rgba(236,72,153,0.12)", color: "#f472b6", border: "rgba(236,72,153,0.25)" },
  Analytics: { bg: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "rgba(59,130,246,0.25)" },
  Sales: { bg: "rgba(16,185,129,0.12)", color: "#34d399", border: "rgba(16,185,129,0.25)" },
  Marketing: { bg: "rgba(245,158,11,0.12)", color: "#fbbf24", border: "rgba(245,158,11,0.25)" },
};

export function StatusBadge({ status }) {
  const cls =
    status === "Active"
      ? "badge badge-active"
      : status === "Inactive"
      ? "badge badge-inactive"
      : "badge badge-leave";
  const dot =
    status === "Active" ? "#4ade80" : status === "Inactive" ? "#f87171" : "#fbbf24";

  return (
    <span className={cls}>
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ background: dot }}
      />
      {status}
    </span>
  );
}

export function DeptBadge({ dept }) {
  const style = departmentColors[dept] || {
    bg: "rgba(148,163,184,0.1)",
    color: "#94a3b8",
    border: "rgba(148,163,184,0.2)",
  };
  return (
    <span
      className="badge"
      style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}
    >
      {dept}
    </span>
  );
}

export function AvatarCell({ avatar, name }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{ background: "linear-gradient(135deg,#6366f1,#a78bfa)", color: "#fff" }}
      >
        {avatar}
      </div>
      <span className="font-medium text-slate-200 text-sm">{name}</span>
    </div>
  );
}
