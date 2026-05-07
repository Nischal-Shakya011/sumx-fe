"use client";

import { z } from "zod";
import { AvatarCell, StatusBadge, DeptBadge } from "@/components/table/CellRenderers";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DEPARTMENTS, STATUSES, ROLES } from "@/lib/mockData";

/**
 * Zod validation schema for an employee row.
 * At least name, email (required + email format), and salary (positive number) are validated.
 */
export const employeeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Must be a valid email address"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
  status: z.string().min(1, "Status is required"),
  salary: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .refine((v) => v > 0, "Salary must be a positive number"),
  joinDate: z.string().optional(),
  avatar: z.string().optional(),
});

/**
 * TanStack Table column definitions for the Employees table.
 * `meta.editable = false` means the field renders as read-only text in edit mode.
 * `meta.type` controls what input is rendered while editing.
 * `meta.options` provides choices for select inputs.
 */
export const employeeColumns = [
  {
    accessorKey: "name",
    header: "Employee",
    meta: { editable: true, type: "text" },
    cell: ({ row }) => (
      <AvatarCell avatar={row.original.avatar} name={row.original.name} />
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: { editable: true, type: "email" },
    cell: ({ getValue }) => (
      <span style={{ color: "rgba(148,163,184,0.85)", fontSize: "0.8125rem" }}>
        {getValue()}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    meta: { editable: true, type: "select", options: ROLES },
    cell: ({ getValue }) => (
      <span className="text-sm text-slate-300">{getValue()}</span>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
    meta: { editable: true, type: "select", options: DEPARTMENTS },
    cell: ({ getValue }) => <DeptBadge dept={getValue()} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: { editable: true, type: "select", options: STATUSES },
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  },
  {
    accessorKey: "salary",
    header: "Salary",
    meta: { editable: true, type: "number" },
    cell: ({ getValue }) => (
      <span className="text-sm font-medium" style={{ color: "#a5b4fc" }}>
        {formatCurrency(getValue())}
      </span>
    ),
  },
  {
    accessorKey: "joinDate",
    header: "Joined",
    meta: { editable: false },
    cell: ({ getValue }) => (
      <span style={{ color: "rgba(148,163,184,0.7)", fontSize: "0.8125rem" }}>
        {formatDate(getValue())}
      </span>
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
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
