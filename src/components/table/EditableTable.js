"use client";

/**
 * EditableTable – reusable TanStack Table v8 component with inline editing.
 *
 * Props:
 *  - columns: ColumnDef[]  (TanStack column definitions)
 *  - data: object[]        (initial rows)
 *  - onEdit?   (rowId, updatedRow) => void
 *  - onSave?   (rowId, updatedRow) => void
 *  - onDelete? (rowId) => void
 *  - enableGlobalFilter? boolean
 *  - enablePagination?   boolean
 *  - enableSorting?      boolean
 *  - pageSize?           number
 */

import { useState, useCallback, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Pencil,
  Trash2,
  Check,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────
   Inline Edit Row Form
   ────────────────────────────────────────────── */
function EditRow({ row, columns, schema, onSave, onCancel }) {
  const editableColumns = columns.filter((c) => c.meta?.editable !== false);
  const defaultValues = {};
  row.original && Object.assign(defaultValues, row.original);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues,
    resolver: schema ? zodResolver(schema) : undefined,
  });

  const handleCancel = () => {
    reset(row.original);
    onCancel();
  };

  return (
    <tr
      style={{
        background: "rgba(99,102,241,0.07)",
        border: "1px solid rgba(99,102,241,0.25)",
      }}
    >
      {columns.map((col) => {
        const key = col.accessorKey || col.id;
        const meta = col.meta || {};
        const isEditable = meta.editable !== false && key !== "id";
        const error = errors[key];

        if (col.id === "_actions") {
          return (
            <td key="_actions" className="px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSubmit((data) => onSave(data))}
                  disabled={isSubmitting}
                  className="btn btn-success btn-icon"
                  title="Save"
                >
                  {isSubmitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-ghost btn-icon"
                  title="Cancel"
                >
                  <X size={14} />
                </button>
              </div>
            </td>
          );
        }

        return (
          <td key={key} className="px-4 py-2">
            {isEditable ? (
              <div>
                {meta.type === "select" ? (
                  <select
                    {...register(key)}
                    className={cn("input-base", error && "input-error")}
                    style={{ minWidth: 120 }}
                  >
                    {(meta.options || []).map((opt) => (
                      <option key={opt} value={opt} style={{ background: "#0f172a" }}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    {...register(key)}
                    type={meta.type || "text"}
                    className={cn("input-base", error && "input-error")}
                    style={{ minWidth: 120 }}
                  />
                )}
                {error && (
                  <p className="text-xs mt-1" style={{ color: "#f87171" }}>
                    {error.message}
                  </p>
                )}
              </div>
            ) : (
              <span className="text-sm" style={{ color: "rgba(148,163,184,0.7)" }}>
                {row.getValue(key) ?? "—"}
              </span>
            )}
          </td>
        );
      })}
    </tr>
  );
}

/* ──────────────────────────────────────────────
   Sort Icon
   ────────────────────────────────────────────── */
function SortIcon({ state }) {
  if (state === "asc") return <ChevronUp size={13} style={{ color: "#818cf8" }} />;
  if (state === "desc") return <ChevronDown size={13} style={{ color: "#818cf8" }} />;
  return <ChevronsUpDown size={13} style={{ color: "rgba(148,163,184,0.4)" }} />;
}

/* ──────────────────────────────────────────────
   Main EditableTable Component
   ────────────────────────────────────────────── */
export default function EditableTable({
  columns: columnDefs,
  data: initialData,
  schema,
  onEdit,
  onSave,
  onDelete,
  enableGlobalFilter = true,
  enablePagination = true,
  enableSorting = true,
  pageSize: defaultPageSize = 7,
}) {
  const [data, setData] = useState(initialData);
  const [editingRowId, setEditingRowId] = useState(null);
  const [deletingRowId, setDeletingRowId] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: defaultPageSize });

  /* Build action column */
  const actionColumn = useMemo(
    () => ({
      id: "_actions",
      header: "",
      enableSorting: false,
      meta: { editable: false },
      cell: ({ row }) => {
        const rowId = row.original.id ?? row.id;
        const isDeleting = deletingRowId === rowId;
        return (
          <div className="flex items-center gap-2 justify-end">
            <button
              className="btn btn-ghost btn-icon"
              title="Edit row"
              onClick={() => {
                setEditingRowId(rowId);
                onEdit?.(rowId, row.original);
              }}
            >
              <Pencil size={14} />
            </button>
            <button
              className="btn btn-danger btn-icon"
              title="Delete row"
              disabled={isDeleting}
              onClick={() => handleDelete(rowId)}
            >
              {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            </button>
          </div>
        );
      },
    }),
    [deletingRowId, onEdit]
  );

  const columns = useMemo(() => [...columnDefs, actionColumn], [columnDefs, actionColumn]);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableGlobalFilter ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    globalFilterFn: "includesString",
    manualPagination: false,
  });

  /* ── Handlers ── */
  const handleSave = useCallback(
    (rowId, updatedValues) => {
      setData((prev) =>
        prev.map((row) =>
          (row.id ?? row) === rowId ? { ...row, ...updatedValues } : row
        )
      );
      onSave?.(rowId, updatedValues);
      setEditingRowId(null);
    },
    [onSave]
  );

  const handleDelete = useCallback(
    async (rowId) => {
      setDeletingRowId(rowId);
      await new Promise((r) => setTimeout(r, 300)); // simulate async
      setData((prev) => prev.filter((row) => (row.id ?? row) !== rowId));
      onDelete?.(rowId);
      setDeletingRowId(null);
    },
    [onDelete]
  );

  const { pageIndex, pageSize } = table.getState().pagination;
  const total = table.getFilteredRowModel().rows.length;
  const from = pageIndex * pageSize + 1;
  const to = Math.min(from + pageSize - 1, total);

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      {enableGlobalFilter && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "rgba(148,163,184,0.45)" }}
            />
            <input
              type="text"
              placeholder="Search all columns…"
              value={globalFilter}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
                setPagination((p) => ({ ...p, pageIndex: 0 }));
              }}
              className="input-base pl-9"
            />
          </div>
          {globalFilter && (
            <button
              className="btn btn-ghost text-xs"
              onClick={() => setGlobalFilter("")}
            >
              <X size={12} /> Clear
            </button>
          )}
          <div className="ml-auto text-sm" style={{ color: "rgba(148,163,184,0.6)" }}>
            {total} {total === 1 ? "result" : "results"}
          </div>
        </div>
      )}

      {/* Table wrapper */}
      <div
        className="overflow-x-auto rounded-xl"
        style={{ border: "1px solid rgba(99,102,241,0.15)" }}
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr
                key={hg.id}
                style={{ background: "rgba(15,23,42,0.8)", borderBottom: "1px solid rgba(99,102,241,0.12)" }}
              >
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider select-none"
                    style={{ color: "rgba(148,163,184,0.7)" }}
                    onClick={header.column.getToggleSortingHandler?.()}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-1",
                        header.column.getCanSort() && "cursor-pointer hover:text-slate-200 transition-colors"
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <SortIcon state={header.column.getIsSorted()} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-16 text-sm"
                  style={{ color: "rgba(148,163,184,0.45)" }}
                >
                  No records found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                const rowId = row.original.id ?? row.id;
                const isEditing = editingRowId === rowId;

                if (isEditing) {
                  return (
                    <EditRow
                      key={row.id}
                      row={row}
                      columns={columns}
                      schema={schema}
                      onSave={(vals) => handleSave(rowId, vals)}
                      onCancel={() => setEditingRowId(null)}
                    />
                  );
                }

                return (
                  <tr
                    key={row.id}
                    className="table-row-hover transition-colors"
                    style={{ borderBottom: "1px solid rgba(30,41,59,0.8)" }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3"
                        style={{ color: "#e2e8f0" }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {enablePagination && total > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-3 text-sm">
          <p style={{ color: "rgba(148,163,184,0.6)" }}>
            Showing <strong style={{ color: "#e2e8f0" }}>{from}–{to}</strong> of{" "}
            <strong style={{ color: "#e2e8f0" }}>{total}</strong>
          </p>

          <div className="flex items-center gap-1">
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              title="First page"
            >
              <ChevronsLeft size={15} />
            </button>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              title="Previous"
            >
              <ChevronLeft size={15} />
            </button>

            {/* Page number pills */}
            {Array.from({ length: table.getPageCount() }, (_, i) => i).map((i) => (
              <button
                key={i}
                onClick={() => table.setPageIndex(i)}
                className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                style={
                  i === pageIndex
                    ? { background: "#6366f1", color: "#fff" }
                    : { background: "transparent", color: "rgba(148,163,184,0.7)" }
                }
              >
                {i + 1}
              </button>
            ))}

            <button
              className="btn btn-ghost btn-icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              title="Next"
            >
              <ChevronRight size={15} />
            </button>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              title="Last page"
            >
              <ChevronsRight size={15} />
            </button>
          </div>

          {/* Page size selector */}
          <div className="flex items-center gap-2" style={{ color: "rgba(148,163,184,0.6)" }}>
            Rows per page:
            <select
              value={pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
                table.setPageIndex(0);
              }}
              className="input-base"
              style={{ width: "auto", padding: "0.25rem 0.5rem" }}
            >
              {[5, 7, 10, 20, 50].map((n) => (
                <option key={n} value={n} style={{ background: "#0f172a" }}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
