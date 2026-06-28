"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import { signColor } from "@/lib/metrics";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-edge bg-card p-5 shadow-[var(--card-shadow)] transition-colors ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-sm font-medium uppercase tracking-widest text-mute">{children}</h2>
      {action}
    </div>
  );
}

export function Stat({ label, value, tone, hint }: { label: string; value: string; tone?: number; hint?: string }) {
  return (
    <Card className="min-w-0">
      <div className="text-xs font-medium uppercase tracking-wider text-mute">{label}</div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className={`truncate font-mono text-2xl font-semibold ${tone !== undefined ? signColor(tone) : "text-ink"}`}>{value}</span>
        {tone !== undefined && tone !== 0 && <span className={`text-sm ${signColor(tone)}`}>{tone > 0 ? "↑" : "↓"}</span>}
      </div>
      {hint && <div className="mt-1 text-xs text-mute">{hint}</div>}
    </Card>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger" | "subtle";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const styles = {
    primary: "bg-accent text-bg font-semibold hover:bg-accent/90",
    ghost: "text-sub border border-edge hover:bg-surface hover:text-ink",
    danger: "text-neg border border-neg/30 hover:bg-neg/10",
    subtle: "text-mute hover:text-ink",
  }[variant];
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function TagChip({
  tag,
  active,
  onClick,
  onRemove,
}: {
  tag: string;
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
        active
          ? "border-accent/50 bg-accent/15 text-accent"
          : "border-edge bg-surface text-sub hover:border-accent/40 hover:text-ink"
      }`}
    >
      {tag}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-mute hover:text-neg"
          aria-label={`Remove ${tag}`}
        >
          ×
        </button>
      )}
    </span>
  );
}

export function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-mute">{label}</span>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl border border-edge bg-surface px-3 py-2 text-sm text-ink placeholder:text-mute focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/40 transition-colors";

/**
 * Number input that keeps the user's raw keystrokes (so "0.02", "1.", "-" mid-typing
 * survive) and only emits a parsed number. Re-syncs when the external value changes
 * to something different from what's typed (e.g. auto-calculated fields).
 */
export function NumberInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: number | undefined;
  onChange: (n: number | undefined) => void;
  placeholder?: string;
  className?: string;
}) {
  const [text, setText] = useState(value === undefined || Number.isNaN(value) ? "" : String(value));
  const focused = useRef(false);

  useEffect(() => {
    if (focused.current) return; // don't fight the user mid-type
    const parsed = text === "" ? undefined : parseFloat(text);
    if (parsed !== value) setText(value === undefined || Number.isNaN(value) ? "" : String(value));
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <input
      type="text"
      inputMode="decimal"
      className={`${inputCls} ${className}`}
      placeholder={placeholder}
      value={text}
      onFocus={() => (focused.current = true)}
      onBlur={() => (focused.current = false)}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw !== "" && !/^-?\d*\.?\d*$/.test(raw)) return; // allow only number-ish input
        setText(raw);
        const n = raw === "" || raw === "-" || raw === "." ? undefined : parseFloat(raw);
        onChange(Number.isNaN(n as number) ? undefined : n);
      }}
    />
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

type CardOption = string | { value: string; label?: string; hint?: string };

/**
 * Tap-to-select cards/pills — a professional replacement for small dropdowns.
 * Selected option fills with the accent; clicking an active option clears it
 * when `clearable`. Use for short enumerations (sessions, exit reasons, etc.).
 */
export function OptionCards({
  label,
  value,
  options,
  onChange,
  clearable,
  tone = "accent",
}: {
  label?: string;
  value?: string;
  options: readonly CardOption[];
  onChange: (v: string | undefined) => void;
  clearable?: boolean;
  tone?: "accent" | "pos" | "neg";
}) {
  const norm = options.map((o) => (typeof o === "string" ? { value: o, label: o } : { ...o, label: o.label ?? o.value }));
  const toneCls =
    tone === "pos"
      ? "border-pos/50 bg-pos/15 text-pos"
      : tone === "neg"
      ? "border-neg/50 bg-neg/15 text-neg"
      : "border-accent/50 bg-accent/15 text-accent";
  return (
    <div>
      {label && <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-mute">{label}</div>}
      <div className="flex flex-wrap gap-1.5">
        {norm.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              title={o.hint}
              onClick={() => onChange(clearable && active ? undefined : o.value)}
              className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
                active ? toneCls : "border-edge bg-surface text-mute hover:border-accent/40 hover:text-sub"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-xl border border-edge bg-surface p-1">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`rounded-lg px-3.5 py-1.5 text-sm transition-colors ${
            active === t ? "bg-card text-ink shadow-sm" : "text-mute hover:text-sub"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
  persistent,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
  persistent?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !persistent && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, persistent]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-8" onClick={persistent ? undefined : onClose}>
      <div
        className={`mt-4 w-full ${wide ? "max-w-4xl" : "max-w-2xl"} rounded-2xl border border-edge bg-card shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-edge px-6 py-4">
          <h3 className="text-base font-semibold text-ink">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-mute transition-colors hover:text-ink" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <Card className="flex flex-col items-center gap-3 py-14 text-center">
      <div className="text-base font-medium text-ink">{title}</div>
      <p className="max-w-sm text-sm text-mute">{body}</p>
      {action}
    </Card>
  );
}

export function OutcomePill({ rr, pnl }: { rr: number; pnl: number }) {
  const v = pnl !== 0 ? pnl : rr;
  const label = v > 0 ? "Win" : v < 0 ? "Loss" : "BE";
  const cls = v > 0 ? "bg-pos/15 text-pos" : v < 0 ? "bg-neg/15 text-neg" : "bg-edge text-mute";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{label}</span>;
}
