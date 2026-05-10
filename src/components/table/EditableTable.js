"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  flexRender,
} from "@tanstack/react-table";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronUp, ChevronDown, ChevronsUpDown,
  Pencil, Trash2, Check, X, Search,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Loader2, SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import FieldInput from "./FieldInput";

function EditRow({ row, columns, schema, onSave, onCancel }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { ...row.original },
    resolver: schema ? zodResolver(schema) : undefined,
  });

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <tr
      role="row"
      aria-label="Editing row"
      style={{
        background: "rgba(99,102,241,0.07)",
        outline: "1px solid rgba(99,102,241,0.3)",
        outlineOffset: "-1px",
      }}
    >
      {columns.map((col) => {
        const key   = col.accessorKey || col.id;
        const meta  = col.meta || {};
        const isEditable = meta.editable !== false && key !== "id";

        if (col.id === "_actions") {
          return (
            <td key="_actions" className="px-3 py-2" role="gridcell">
              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleSubmit((data) => onSave(data))}
                  disabled={isSubmitting}
                  className="btn btn-success btn-icon"
                  title="Save (Enter)"
                  aria-label="Save row"
                >
                  {isSubmitting
                    ? <Loader2 size={14} className="animate-spin" />
                    : <Check size={14} />}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="btn btn-ghost btn-icon"
                  title="Cancel (Escape)"
                  aria-label="Cancel edit"
                >
                  <X size={14} />
                </button>
              </div>
            </td>
          );
        }

        const error = errors[key];

        return (
          <td key={key} className="px-3 py-1.5" role="gridcell">
            {isEditable ? (
              <div>
                <Controller
                  name={key}
                  control={control}
                  render={({ field }) => (
                    <FieldInput
                      type={meta.type || "text"}
                      options={meta.options || []}
                      error={error}
                      {...field}
                    />
                  )}
                />
                {error && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: "#f87171" }}
                    role="alert"
                    aria-live="polite"
                  >
                    {error.message}
                  </p>
                )}
              </div>
            ) : (
              <span style={{ color: "rgba(148,163,184,0.6)", fontSize: "0.85rem" }}>
                {flexRender(col.cell, { ...row.getVisibleCells().find(c => (c.column.columnDef.accessorKey || c.column.id) === key)?.getContext() })}
              </span>
            )}
          </td>
        );
      })}
    </tr>
  );
}
function ColumnFilterInput({ column }) {
  const type    = column.columnDef.meta?.type;
  const options = column.columnDef.meta?.options;
  const value   = (column.getFilterValue() ?? "");

  if (type === "select" && options?.length) {
    return (
      <select
        className="col-filter-input"
        value={value}
        aria-label={`Filter ${column.id}`}
        onChange={(e) => column.setFilterValue(e.target.value || undefined)}
      >
        <option value="">All</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }

  if (type === "checkbox") {
    return (
      <select
        className="col-filter-input"
        value={value}
        aria-label={`Filter ${column.id}`}
        onChange={(e) => column.setFilterValue(e.target.value || undefined)}
      >
        <option value="">All</option>
        <option value="true">Remote</option>
        <option value="false">On-site</option>
      </select>
    );
  }

  return (
    <input
      className="col-filter-input"
      value={value}
      placeholder="Filter…"
      aria-label={`Filter ${column.id}`}
      onChange={(e) => column.setFilterValue(e.target.value || undefined)}
    />
  );
}

function SortIcon({ state }) {
  if (state === "asc")  return <ChevronUp  size={12} style={{ color: "#818cf8" }} />;
  if (state === "desc") return <ChevronDown size={12} style={{ color: "#818cf8" }} />;
  return <ChevronsUpDown size={12} style={{ color: "rgba(148,163,184,0.35)" }} />;
}

export default function EditableTable({
  columns: columnDefs,
  data: initialData,
  schema,
  onEdit,
  onSave,
  onDelete,
  enableGlobalFilter = true,
  enablePagination   = true,
  enableSorting      = true,
  pageSize: defaultPageSize = 7,
}) {
  const [data,            setData           ] = useState(initialData);
  const [editingRowId,    setEditingRowId   ] = useState(null);
  const [deletingRowId,   setDeletingRowId  ] = useState(null);
  const [globalFilter,    setGlobalFilter   ] = useState("");
  const [columnFilters,   setColumnFilters  ] = useState([]);
  const [sorting,         setSorting        ] = useState([]);
  const [columnSizing,    setColumnSizing   ] = useState({});
  const [pagination,      setPagination     ] = useState({ pageIndex: 0, pageSize: defaultPageSize });
  const [showColFilters,  setShowColFilters ] = useState(false);

  const actionColumn = useMemo(() => ({
    id: "_actions",
    header: "",
    size: 90,
    minSize: 80,
    enableSorting: false,
    enableResizing: false,
    enableColumnFilter: false,
    meta: { editable: false },
    cell: ({ row }) => {
      const rowId      = row.original.id ?? row.id;
      const isDeleting = deletingRowId === rowId;
      return (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            className="btn btn-ghost btn-icon"
            title="Edit"
            aria-label="Edit row"
            onClick={() => {
              setEditingRowId(rowId);
              onEdit?.(rowId, row.original);
            }}
          >
            <Pencil size={13} />
          </button>
          <button
            className="btn btn-danger btn-icon"
            title="Delete"
            aria-label="Delete row"
            disabled={isDeleting}
            onClick={() => handleDelete(rowId)}
          >
            {isDeleting
              ? <Loader2 size={13} className="animate-spin" />
              : <Trash2  size={13} />}
          </button>
        </div>
      );
    },
  }), [deletingRowId, onEdit]);

  const columns = useMemo(() => [...columnDefs, actionColumn], [columnDefs, actionColumn]);

  const columnFilterFns = useMemo(() => {
    const fns = {};
    columnDefs.forEach((col) => {
      if (col.meta?.type === "checkbox") {
        fns[col.accessorKey] = (row, colId, filterValue) => {
          if (!filterValue) return true;
          return String(row.getValue(colId)) === filterValue;
        };
      }
    });
    return fns;
  }, [columnDefs]);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnFilters, sorting, pagination, columnSizing },
    onGlobalFilterChange:    (v) => { setGlobalFilter(v);   setPagination((p) => ({ ...p, pageIndex: 0 })); },
    onColumnFiltersChange:   (v) => { setColumnFilters(v);  setPagination((p) => ({ ...p, pageIndex: 0 })); },
    onSortingChange:         setSorting,
    onPaginationChange:      setPagination,
    onColumnSizingChange:    setColumnSizing,
    getCoreRowModel:         getCoreRowModel(),
    getSortedRowModel:       enableSorting      ? getSortedRowModel()       : undefined,
    getFilteredRowModel:     getFilteredRowModel(),
    getPaginationRowModel:   enablePagination   ? getPaginationRowModel()   : undefined,
    getFacetedRowModel:      getFacetedRowModel(),
    getFacetedUniqueValues:  getFacetedUniqueValues(),
    enableColumnResizing:    true,
    columnResizeMode:        "onChange",
    globalFilterFn:          "includesString",
    filterFns:               columnFilterFns,
  });

  const handleSave = useCallback((rowId, updated) => {
    setData((prev) =>
      prev.map((r) => ((r.id ?? r) === rowId ? { ...r, ...updated } : r))
    );
    onSave?.(rowId, updated);
    setEditingRowId(null);
  }, [onSave]);

  const handleDelete = useCallback(async (rowId) => {
    setDeletingRowId(rowId);
    await new Promise((r) => setTimeout(r, 280));
    setData((prev) => prev.filter((r) => (r.id ?? r) !== rowId));
    onDelete?.(rowId);
    setDeletingRowId(null);
  }, [onDelete]);

  const { pageIndex, pageSize } = table.getState().pagination;
  const total = table.getFilteredRowModel().rows.length;
  const from  = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to    = Math.min(from + pageSize - 1, total);
  const activeFilters = columnFilters.length + (globalFilter ? 1 : 0);

  return (
    <div className="flex flex-col gap-4">

      <div className="flex items-center gap-3 flex-wrap">
        {enableGlobalFilter && (
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "rgba(148,163,184,0.4)" }}
            />
            <input
              type="search"
              placeholder="Search all columns…"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="input-base pl-9"
              aria-label="Global search"
            />
          </div>
        )}

        <button
          className={cn("btn", showColFilters ? "btn-primary" : "btn-ghost")}
          onClick={() => setShowColFilters((v) => !v)}
          aria-pressed={showColFilters}
          aria-label="Toggle column filters"
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeFilters > 0 && (
            <span
              className="ml-1 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold"
              style={{ background: "#6366f1", color: "#fff" }}
            >
              {activeFilters}
            </span>
          )}
        </button>

        {activeFilters > 0 && (
          <button
            className="btn btn-ghost text-xs"
            onClick={() => { setGlobalFilter(""); setColumnFilters([]); }}
          >
            <X size={12} /> Clear all
          </button>
        )}

        <div className="ml-auto text-sm" style={{ color: "rgba(148,163,184,0.55)" }}>
          {total} {total === 1 ? "result" : "results"}
        </div>
      </div>

      <div
        className="overflow-x-auto rounded-xl"
        style={{ border: "1px solid rgba(99,102,241,0.15)" }}
      >
        <table
          role="grid"
          aria-label="Employee data table"
          aria-rowcount={total}
          style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse" }}
        >
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr
                key={hg.id}
                style={{ background: "rgba(15,23,42,0.9)", borderBottom: "1px solid rgba(99,102,241,0.12)" }}
              >
                {hg.headers.map((header) => {
                  const sortDir = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      role="columnheader"
                      aria-sort={
                        sortDir === "asc" ? "ascending"
                        : sortDir === "desc" ? "descending"
                        : header.column.getCanSort() ? "none"
                        : undefined
                      }
                      style={{
                        position: "relative",
                        width: header.getSize(),
                        minWidth: header.column.columnDef.minSize ?? 60,
                        padding: "0.75rem 1rem",
                        textAlign: "left",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "rgba(148,163,184,0.7)",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          header.column.getCanSort() && "cursor-pointer hover:text-slate-200 transition-colors"
                        )}
                        onClick={header.column.getToggleSortingHandler?.()}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <SortIcon state={sortDir} />
                        )}
                      </div>

                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={cn(
                            "col-resizer",
                            header.column.getIsResizing() && "is-resizing"
                          )}
                          title="Drag to resize"
                          aria-hidden="true"
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}

            {showColFilters && table.getHeaderGroups().map((hg) => (
              <tr
                key={`${hg.id}-filters`}
                style={{ background: "rgba(8,14,26,0.85)", borderBottom: "1px solid rgba(99,102,241,0.1)" }}
              >
                {hg.headers.map((header) => (
                  <th
                    key={`${header.id}-filter`}
                    style={{ padding: "0.4rem 0.75rem", width: header.getSize() }}
                  >
                    {header.column.getCanFilter() && header.column.columnDef.enableColumnFilter !== false ? (
                      <ColumnFilterInput column={header.column} />
                    ) : null}
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
                  style={{ color: "rgba(148,163,184,0.4)" }}
                >
                  No records match your search.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                const rowId    = row.original.id ?? row.id;
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
                    role="row"
                    className="table-row-hover transition-colors"
                    style={{ borderBottom: "1px solid rgba(30,41,59,0.7)" }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        role="gridcell"
                        style={{
                          padding: "0.75rem 1rem",
                          color: "#e2e8f0",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: cell.column.getSize(),
                        }}
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

      {enablePagination && total > 0 && (
        <div
          className="flex items-center justify-between flex-wrap gap-3 text-sm pt-1"
          aria-label="Table pagination"
        >
          <p style={{ color: "rgba(148,163,184,0.6)" }}>
            {total === 0 ? "No results" : (
              <>Showing <strong style={{ color: "#e2e8f0" }}>{from}–{to}</strong> of{" "}
              <strong style={{ color: "#e2e8f0" }}>{total}</strong></>
            )}
          </p>

          <div className="flex items-center gap-1" role="navigation" aria-label="Page navigation">
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="First page"
            ><ChevronsLeft size={14} /></button>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            ><ChevronLeft size={14} /></button>

            {Array.from({ length: table.getPageCount() }, (_, i) => i)
              .filter((i) => {
                const pc = table.getPageCount();
                return pc <= 7 || Math.abs(i - pageIndex) <= 2 || i === 0 || i === pc - 1;
              })
              .reduce((acc, i, idx, arr) => {
                if (idx > 0 && i - arr[idx - 1] > 1) acc.push("…");
                acc.push(i);
                return acc;
              }, [])
              .map((item, i) =>
                item === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-xs" style={{ color: "rgba(148,163,184,0.4)" }}>…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => table.setPageIndex(item)}
                    aria-label={`Page ${item + 1}`}
                    aria-current={item === pageIndex ? "page" : undefined}
                    className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                    style={
                      item === pageIndex
                        ? { background: "#6366f1", color: "#fff" }
                        : { background: "transparent", color: "rgba(148,163,184,0.7)" }
                    }
                  >
                    {item + 1}
                  </button>
                )
              )}

            <button
              className="btn btn-ghost btn-icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            ><ChevronRight size={14} /></button>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              aria-label="Last page"
            ><ChevronsRight size={14} /></button>
          </div>

          <div className="flex items-center gap-2" style={{ color: "rgba(148,163,184,0.6)" }}>
            <label htmlFor="page-size-select" className="text-xs">Rows:</label>
            <select
              id="page-size-select"
              value={pageSize}
              onChange={(e) => { table.setPageSize(Number(e.target.value)); table.setPageIndex(0); }}
              className="input-base"
              style={{ width: "auto", padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
              aria-label="Rows per page"
            >
              {[5, 7, 10, 20].map((n) => (
                <option key={n} value={n} style={{ background: "#0f172a" }}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
