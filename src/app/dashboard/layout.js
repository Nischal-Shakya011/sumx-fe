import DashboardShell from "@/components/layout/DashboardShell";

export const metadata = {
  title: "Dashboard – SumX",
  description: "SumX analytics and employee management dashboard",
};

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
