"use client";

import { z } from "zod";
import { AvatarCell, StatusBadge, DeptBadge } from "@/components/table/CellRenderers";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DEPARTMENTS, STATUSES, ROLES } from "@/lib/mockData";

export const employeeSchema = z.object({
  id:               z.string().optional(),
  name:             z.string().min(2, "Name must be at least 2 characters"),
  email:            z.string().email("Must be a valid email"),
  phone:            z.string()
                      .regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Use (XXX) XXX-XXXX format")
                      .optional()
                      .or(z.literal("")),
  role:             z.string().min(1, "Role is required"),
  department:       z.string().min(1, "Department is required"),
  status:           z.string().min(1, "Status is required"),
  salary:           z.union([z.string(), z.number()])
                      .transform((v) => Number(v))
                      .refine((v) => v > 0, "Salary must be positive"),
  performanceScore: z.union([z.string(), z.number()])
                      .transform((v) => Number(v))
                      .refine((v) => v >= 0 && v <= 100, "Must be 0–100")
                      .optional(),
  isRemote:         z.boolean().optional(),
  joinDate:         z.string().optional(),
  avatar:           z.string().optional(),
});

function scoreColor(score) {
  if (score >= 85) return "#4ade80";
  if (score >= 70) return "#fbbf24";
  return "#f87171";
}

export const employeeColumns = [
  {
    accessorKey: "name",
    header: "Employee",
    size: 190,
    meta: { editable: true, type: "text" },
    cell: ({ row }) => <AvatarCell avatar={row.original.avatar} name={row.original.name} />,
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 210,
    meta: { editable: true, type: "email" },
    cell: ({ getValue }) => (
      <span style={{ color: "rgba(148,163,184,0.85)", fontSize: "0.8rem" }}>{getValue()}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    size: 155,
    meta: { editable: true, type: "phone" },
    cell: ({ getValue }) => (
      <span style={{ color: "rgba(148,163,184,0.8)", fontVariantNumeric: "tabular-nums", fontSize: "0.8rem" }}>
        {getValue() || "-"}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    size: 175,
    meta: { editable: true, type: "select", options: ROLES },
    cell: ({ getValue }) => <span className="text-sm text-slate-300">{getValue()}</span>,
  },
  {
    accessorKey: "department",
    header: "Dept",
    size: 130,
    meta: { editable: true, type: "select", options: DEPARTMENTS },
    cell: ({ getValue }) => <DeptBadge dept={getValue()} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 115,
    meta: { editable: true, type: "select", options: STATUSES },
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  },
  {
    accessorKey: "salary",
    header: "Salary",
    size: 125,
    meta: { editable: true, type: "currency" },
    cell: ({ getValue }) => (
      <span className="text-sm font-medium" style={{ color: "#a5b4fc" }}>
        {formatCurrency(getValue())}
      </span>
    ),
  },
  {
    accessorKey: "performanceScore",
    header: "Score",
    size: 105,
    meta: { editable: true, type: "percentage" },
    cell: ({ getValue }) => {
      const v = getValue();
      if (v == null) return <span style={{ color: "rgba(148,163,184,0.4)" }}>—</span>;
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: scoreColor(v) }}>{v}%</span>
          <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(99,102,241,0.1)", minWidth: 32 }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${v}%`, background: scoreColor(v), transition: "width 0.4s" }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "isRemote",
    header: "Remote",
    size: 90,
    enableColumnFilter: false,
    meta: { editable: true, type: "checkbox" },
    cell: ({ getValue }) => (
      <span className="text-xs font-medium" style={{ color: getValue() ? "#4ade80" : "rgba(148,163,184,0.5)" }}>
        {getValue() ? "✓ Yes" : "✗ No"}
      </span>
    ),
  },
  {
    accessorKey: "joinDate",
    header: "Joined",
    size: 115,
    meta: { editable: true, type: "date" },
    cell: ({ getValue }) => (
      <span style={{ color: "rgba(148,163,184,0.7)", fontSize: "0.8rem" }}>
        {formatDate(getValue())}
      </span>
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
    size: 90,
    enableColumnFilter: false,
    enableSorting: false,
    meta: { editable: false },
    cell: ({ getValue }) => (
      <span
        className="text-xs font-mono px-2 py-0.5 rounded"
        style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8" }}
      >
        {getValue()}
      </span>
    ),
  },
];
