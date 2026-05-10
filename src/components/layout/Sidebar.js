"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart2,
  Settings,
  Bell,
  ChevronRight,
  Zap,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Employees", href: "/dashboard/employees", icon: Users },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const secondaryItems = [
  { label: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col h-full"
      style={{
        width: "var(--sidebar-width)",
        minWidth: "var(--sidebar-width)",
        background: "var(--sidebar-bg)",
        borderRight: "1px solid rgba(99,102,241,0.12)",
      }}
    >
      <div
        className="flex items-center gap-3 px-5"
        style={{ height: "var(--header-height)", borderBottom: "1px solid rgba(99,102,241,0.1)" }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 10px rgba(99,102,241,0.4)" }}
        >
          <Zap size={16} fill="white" color="white" />
        </div>
        <span className="text-lg font-bold gradient-text tracking-tight">SumX</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest px-2 mb-3" style={{ color: "rgba(148,163,184,0.5)" }}>
          Main Menu
        </p>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                active
                  ? "nav-link-active text-white"
                  : "text-slate-400 hover:text-slate-200"
              )}
              style={
                active
                  ? { background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.2)" }
                  : { border: "1px solid transparent" }
              }
            >
              <Icon
                size={18}
                className="shrink-0 transition-colors"
                style={{ color: active ? "#818cf8" : undefined }}
              />
              {label}
              {active && (
                <ChevronRight size={14} className="ml-auto" style={{ color: "#818cf8" }} />
              )}
            </Link>
          );
        })}

        <div className="pt-4">
          <p className="text-xs font-semibold uppercase tracking-widest px-2 mb-3" style={{ color: "rgba(148,163,184,0.5)" }}>
            Support
          </p>
          {secondaryItems.map(({ label, href, icon: Icon, badge }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  active ? "text-white nav-link-active" : "text-slate-400 hover:text-slate-200"
                )}
                style={
                  active
                    ? { background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.18)" }
                    : { border: "1px solid transparent" }
                }
              >
                <Icon size={18} className="shrink-0" />
                {label}
                {badge && (
                  <span
                    className="ml-auto text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                    style={{ background: "#6366f1", color: "#fff" }}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div
        className="px-3 py-4"
        style={{ borderTop: "1px solid rgba(99,102,241,0.1)" }}
      >
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg group cursor-pointer hover:bg-white/5 transition-colors">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: "linear-gradient(135deg,#6366f1,#a78bfa)", color: "#fff" }}
          >
            SJ
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">Sagar Joshi</p>
            <p className="text-xs text-slate-500 truncate">sagar@sumx.io</p>
          </div>
          <LogOut size={15} className="text-slate-500 group-hover:text-slate-300 transition-colors shrink-0" />
        </div>
      </div>
    </aside>
  );
}
