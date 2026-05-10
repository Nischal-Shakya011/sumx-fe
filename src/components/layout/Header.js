"use client";

import { Bell, Search, Menu } from "lucide-react";

export default function Header({ onMenuToggle }) {
  return (
    <header
      className="flex items-center gap-4 px-6"
      style={{
        height: "var(--header-height)",
        background: "rgba(8,14,26,0.85)",
        borderBottom: "1px solid rgba(99,102,241,0.1)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <button
        onClick={onMenuToggle}
        className="md:hidden btn btn-ghost btn-icon"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      <div className="relative flex-1 max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "rgba(148,163,184,0.5)" }}
        />
        <input
          type="text"
          placeholder="Search..."
          className="input-base pl-9"
          style={{ background: "rgba(15,23,42,0.6)" }}
        />
      </div>

      <div className="flex-1" />

      <button
        className="relative btn btn-ghost btn-icon"
        aria-label="Notifications"
      >
        <Bell size={18} />
        <span
          className="absolute top-1 right-1 w-2 h-2 rounded-full"
          style={{ background: "#6366f1" }}
        />
      </button>

      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer hover:ring-2 transition-all"
        style={{
          background: "linear-gradient(135deg,#6366f1,#a78bfa)",
          color: "#fff",
          ringColor: "#6366f1",
        }}
      >
        SJ
      </div>
    </header>
  );
}
