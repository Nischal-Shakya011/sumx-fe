import StatCard from "@/components/dashboard/StatCard";
import { statCards, employees } from "@/lib/mockData";
import Link from "next/link";
import { ArrowRight, Users, TrendingUp, Activity } from "lucide-react";

export const metadata = {
  title: "Overview – SumX Dashboard",
  description: "Dashboard overview with key metrics and recent activity",
};

// Compute department breakdown
function getDeptBreakdown(data) {
  const map = {};
  data.forEach(({ department }) => {
    map[department] = (map[department] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

const deptColors = [
  "#6366f1", "#a78bfa", "#60a5fa", "#34d399", "#f59e0b",
];

export default function DashboardPage() {
  const deptBreakdown = getDeptBreakdown(employees);
  const maxDept = deptBreakdown[0]?.[1] || 1;
  const recent = employees.slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, <span className="gradient-text">John</span> 👋
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(148,163,184,0.7)" }}>
          Here's what's happening across your organization today.
        </p>
      </div>

      {/* Stat cards */}
      <section aria-label="Key metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department breakdown */}
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Users size={16} style={{ color: "#818cf8" }} />
              Department Breakdown
            </h2>
            <span className="text-xs" style={{ color: "rgba(148,163,184,0.5)" }}>
              By headcount
            </span>
          </div>
          <div className="space-y-4">
            {deptBreakdown.map(([dept, count], i) => (
              <div key={dept} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "#e2e8f0" }}>{dept}</span>
                  <span className="font-semibold" style={{ color: deptColors[i] }}>
                    {count}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full" style={{ background: "rgba(99,102,241,0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(count / maxDept) * 100}%`,
                      background: `linear-gradient(90deg, ${deptColors[i]}, ${deptColors[i]}99)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status summary */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white flex items-center gap-2 mb-5">
            <Activity size={16} style={{ color: "#818cf8" }} />
            Status Overview
          </h2>
          {[
            { label: "Active", count: employees.filter((e) => e.status === "Active").length, color: "#4ade80", bg: "rgba(34,197,94,0.1)" },
            { label: "On Leave", count: employees.filter((e) => e.status === "On Leave").length, color: "#fbbf24", bg: "rgba(245,158,11,0.1)" },
            { label: "Inactive", count: employees.filter((e) => e.status === "Inactive").length, color: "#f87171", bg: "rgba(239,68,68,0.1)" },
          ].map(({ label, count, color, bg }) => (
            <div
              key={label}
              className="flex items-center justify-between p-3 rounded-xl mb-3"
              style={{ background: bg, border: `1px solid ${color}22` }}
            >
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color }}>
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                {label}
              </div>
              <span className="text-xl font-bold" style={{ color }}>{count}</span>
            </div>
          ))}
          <div className="mt-4">
            <div className="flex overflow-hidden rounded-full h-3">
              {[
                { pct: employees.filter(e => e.status === "Active").length / employees.length * 100, color: "#4ade80" },
                { pct: employees.filter(e => e.status === "On Leave").length / employees.length * 100, color: "#fbbf24" },
                { pct: employees.filter(e => e.status === "Inactive").length / employees.length * 100, color: "#f87171" },
              ].map(({ pct, color }, i) => (
                <div key={i} style={{ width: `${pct}%`, background: color }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent employees */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <TrendingUp size={16} style={{ color: "#818cf8" }} />
            Recent Additions
          </h2>
          <Link
            href="/dashboard/employees"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: "#818cf8" }}
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
                {["Employee", "Role", "Department", "Status", "Joined"].map((h) => (
                  <th
                    key={h}
                    className="pb-3 text-left text-xs font-semibold uppercase tracking-wider pr-4"
                    style={{ color: "rgba(148,163,184,0.5)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((emp) => (
                <tr
                  key={emp.id}
                  className="table-row-hover transition-colors"
                  style={{ borderBottom: "1px solid rgba(30,41,59,0.6)" }}
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: "linear-gradient(135deg,#6366f1,#a78bfa)", color: "#fff" }}
                      >
                        {emp.avatar}
                      </div>
                      <span className="font-medium text-slate-200">{emp.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-slate-400">{emp.role}</td>
                  <td className="py-3 pr-4">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}>
                      {emp.department}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`badge ${emp.status === "Active" ? "badge-active" : emp.status === "Inactive" ? "badge-inactive" : "badge-leave"}`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500 text-xs">{emp.joinDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
