import { BarChart2, TrendingUp, PieChart } from "lucide-react";

export const metadata = {
  title: "Analytics – SumX Dashboard",
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(148,163,184,0.7)" }}>
          Deep dive into workforce trends and performance metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Revenue per Employee", icon: TrendingUp, desc: "Charts coming soon" },
          { title: "Hiring Trends", icon: BarChart2, desc: "Charts coming soon" },
          { title: "Department Distribution", icon: PieChart, desc: "Charts coming soon" },
        ].map(({ title, icon: Icon, desc }) => (
          <div key={title} className="glass-card p-8 flex flex-col items-center justify-center gap-3 text-center min-h-48">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              <Icon size={22} style={{ color: "#818cf8" }} />
            </div>
            <p className="font-semibold text-white">{title}</p>
            <p className="text-sm" style={{ color: "rgba(148,163,184,0.5)" }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
