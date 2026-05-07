import { Settings2, Bell, Shield, Palette } from "lucide-react";

export const metadata = {
  title: "Settings – SumX Dashboard",
};

const sections = [
  { title: "General", icon: Settings2, desc: "Application preferences and defaults" },
  { title: "Notifications", icon: Bell, desc: "Configure alert and email rules" },
  { title: "Security", icon: Shield, desc: "Password, 2FA, and session management" },
  { title: "Appearance", icon: Palette, desc: "Theme and display preferences" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(148,163,184,0.7)" }}>
          Manage your account and application configuration.
        </p>
      </div>

      <div className="space-y-3">
        {sections.map(({ title, icon: Icon, desc }) => (
          <div
            key={title}
            className="glass-card p-5 flex items-center gap-4 cursor-pointer hover:-translate-y-0.5 transition-transform duration-150"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              <Icon size={18} style={{ color: "#818cf8" }} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-white">{title}</p>
              <p className="text-sm" style={{ color: "rgba(148,163,184,0.6)" }}>{desc}</p>
            </div>
            <div style={{ color: "rgba(148,163,184,0.3)" }}>›</div>
          </div>
        ))}
      </div>
    </div>
  );
}
