"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

function digitsOnly(str) {
  return String(str || "").replace(/\D/g, "");
}
function formatPhone(raw) {
  const d = digitsOnly(raw).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="toggle-switch focus-ring"
      style={{
        background: checked ? "#6366f1" : "rgba(99,102,241,0.12)",
        border: `1px solid ${checked ? "#6366f1" : "rgba(99,102,241,0.25)"}`,
      }}
    >
      <span
        className="toggle-thumb"
        style={{ transform: checked ? "translateX(1.125rem)" : "translateX(0)" }}
      />
    </button>
  );
}

function PhoneInput({ value, onChange, onBlur, error, name }) {
  const [display, setDisplay] = useState(() => formatPhone(value));
  useEffect(() => { setDisplay(formatPhone(value)); }, [value]);

  return (
    <div className="relative">
      <span
        className="absolute left-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none select-none"
        style={{ color: "rgba(148,163,184,0.5)" }}
      >
        📞
      </span>
      <input
        type="tel"
        name={name}
        value={display}
        placeholder="(555) 000-0000"
        maxLength={14}
        aria-invalid={!!error}
        className={cn("input-base pl-8", error && "input-error")}
        style={{ minWidth: 165 }}
        onChange={(e) => {
          const fmt = formatPhone(e.target.value);
          setDisplay(fmt);
          onChange(fmt);
        }}
        onBlur={onBlur}
      />
    </div>
  );
}

function CurrencyInput({ value, onChange, onBlur, error, name }) {
  const [display, setDisplay] = useState(() => {
    const n = parseFloat(value);
    return isNaN(n) ? "" : n.toFixed(2);
  });
  useEffect(() => {
    const n = parseFloat(value);
    setDisplay(isNaN(n) ? "" : n.toFixed(2));
  }, [value]);

  return (
    <div className="relative">
      <span
        className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold pointer-events-none select-none"
        style={{ color: "#818cf8" }}
      >
        $
      </span>
      <input
        type="text"
        inputMode="decimal"
        name={name}
        value={display}
        placeholder="0.00"
        aria-invalid={!!error}
        className={cn("input-base pl-7", error && "input-error")}
        style={{ minWidth: 130 }}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d.]/g, "");
          setDisplay(raw);
          const n = parseFloat(raw);
          onChange(isNaN(n) ? 0 : n);
        }}
        onBlur={() => {
          const n = parseFloat(display.replace(/[^\d.]/g, ""));
          setDisplay(isNaN(n) ? "" : n.toFixed(2));
          onBlur?.();
        }}
      />
    </div>
  );
}

function PercentageInput({ value, onChange, onBlur, error, name }) {
  const [display, setDisplay] = useState(() => {
    const n = parseFloat(value);
    return isNaN(n) ? "" : String(n);
  });
  useEffect(() => {
    const n = parseFloat(value);
    setDisplay(isNaN(n) ? "" : String(n));
  }, [value]);

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="decimal"
        name={name}
        value={display}
        placeholder="0"
        aria-invalid={!!error}
        className={cn("input-base pr-8", error && "input-error")}
        style={{ minWidth: 100 }}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d.]/g, "");
          setDisplay(raw);
          const n = parseFloat(raw);
          onChange(isNaN(n) ? 0 : Math.min(100, Math.max(0, n)));
        }}
        onBlur={onBlur}
      />
      <span
        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold pointer-events-none select-none"
        style={{ color: "#818cf8" }}
      >
        %
      </span>
    </div>
  );
}

export default function FieldInput({
  type = "text",
  value,
  onChange,
  onBlur,
  name,
  options = [],
  error,
  placeholder,
}) {
  if (type === "checkbox") {
    return (
      <div className="flex items-center gap-2">
        <ToggleSwitch checked={Boolean(value)} onChange={onChange} />
        <span className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>
          {value ? "Yes" : "No"}
        </span>
      </div>
    );
  }

  if (type === "select") {
    return (
      <select
        name={name}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        className={cn("input-base", error && "input-error")}
        style={{ minWidth: 130, background: "#0f172a" }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} style={{ background: "#0f172a" }}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (type === "date") {
    return (
      <input
        type="date"
        name={name}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        className={cn("input-base", error && "input-error")}
        style={{ minWidth: 145, colorScheme: "dark" }}
      />
    );
  }

  if (type === "phone")    return <PhoneInput    value={value} onChange={onChange} onBlur={onBlur} error={error} name={name} />;
  if (type === "currency") return <CurrencyInput value={value} onChange={onChange} onBlur={onBlur} error={error} name={name} />;
  if (type === "percentage") return <PercentageInput value={value} onChange={onChange} onBlur={onBlur} error={error} name={name} />;

  return (
    <input
      type={type === "number" ? "number" : type === "email" ? "email" : "text"}
      name={name}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) =>
        onChange(type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)
      }
      onBlur={onBlur}
      aria-invalid={!!error}
      className={cn("input-base", error && "input-error")}
      style={{ minWidth: 120 }}
    />
  );
}
