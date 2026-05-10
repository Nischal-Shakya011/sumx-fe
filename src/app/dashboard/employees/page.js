"use client";

import { useState, useCallback } from "react";
import EditableTable from "@/components/table/EditableTable";
import { employeeColumns, employeeSchema } from "@/components/table/employeeColumns";
import { employees as initialData } from "@/lib/mockData";
import { UserPlus, Download, CheckCircle2, AlertCircle, X } from "lucide-react";

function Toast({ message, type, onClose }) {
  const isSuccess = type === "success";
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl"
      style={{
        background: isSuccess ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
        border: `1px solid ${isSuccess ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
        backdropFilter: "blur(12px)",
        minWidth: 280,
      }}
    >
      {isSuccess ? (
        <CheckCircle2 size={16} style={{ color: "#4ade80", flexShrink: 0 }} />
      ) : (
        <AlertCircle size={16} style={{ color: "#f87171", flexShrink: 0 }} />
      )}
      <span className="text-sm flex-1" style={{ color: isSuccess ? "#4ade80" : "#f87171" }}>
        {message}
      </span>
      <button onClick={onClose} className="hover:opacity-70 transition-opacity">
        <X size={14} style={{ color: isSuccess ? "#4ade80" : "#f87171" }} />
      </button>
    </div>
  );
}

export default function EmployeesPage() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleEdit = useCallback((rowId) => {
    console.info("[Table] Editing row:", rowId);
  }, []);

  const handleSave = useCallback((rowId, updatedRow) => {
    showToast(`Employee "${updatedRow.name}" updated successfully.`);
    console.info("[Table] Saved row:", rowId, updatedRow);
  }, [showToast]);

  const handleDelete = useCallback((rowId) => {
    showToast(`Employee ${rowId} deleted.`, "error");
    console.info("[Table] Deleted row:", rowId);
  }, [showToast]);

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Employees</h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(148,163,184,0.7)" }}>
            Manage your team — edit inline, sort and filter in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost">
            <Download size={15} />
            Export CSV
          </button>
          <button className="btn btn-primary">
            <UserPlus size={15} />
            Add Employee
          </button>
        </div>
      </div>

      <div
        className="flex items-start gap-3 p-4 rounded-xl text-sm"
        style={{
          background: "rgba(99,102,241,0.08)",
          border: "1px solid rgba(99,102,241,0.18)",
        }}
      >
        <span className="text-lg leading-none">💡</span>
        <div style={{ color: "rgba(148,163,184,0.8)" }}>
          Click the <strong style={{ color: "#818cf8" }}>pencil icon</strong> on any row to enable
          inline editing. Fields with a{" "}
          <strong style={{ color: "#818cf8" }}>dropdown</strong> show a select input.{" "}
          <strong style={{ color: "#818cf8" }}>Email</strong> and{" "}
          <strong style={{ color: "#818cf8" }}>Salary</strong> are validated before saving.
          Press <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(255,255,255,0.07)" }}>✕</kbd> to cancel without saving.
        </div>
      </div>

      <div className="glass-card p-6">
        <EditableTable
          columns={employeeColumns}
          data={initialData}
          schema={employeeSchema}
          onEdit={handleEdit}
          onSave={handleSave}
          onDelete={handleDelete}
          enableGlobalFilter
          enablePagination
          enableSorting
          pageSize={7}
        />
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
