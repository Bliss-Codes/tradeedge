"use client";

import { useId, useMemo } from "react";

/**
 * Small, composable SVG chart primitives shared across pages. Deliberately
 * lightweight and token-themed so any page can go from a table of numbers to
 * something readable at a glance without pulling in a chart library.
 */

/* ── Diverging bars ──────────────────────────────────────────────────
   Comparing groups where the sign matters (emotions, sessions, tags).
   Zero sits in the middle so wins and losses read instantly.          */
export interface DivergingRow {
  label: string;
  value: number;
  sub?: string;
}

export function DivergingBars({ rows, format, height = 26 }: { rows: DivergingRow[]; format: (v: number) => string; height?: number }) {
  const maxAbs = useMemo(() => Math.max(1, ...rows.map((r) => Math.abs(r.value))), [rows]);
  if (rows.length === 0) return null;

  return (
    <div className="space-y-1.5">
      {rows.map((r) => {
        const pct = (Math.abs(r.value) / maxAbs) * 50;
        const pos = r.value >= 0;
        return (
          <div key={r.label} className="flex items-center gap-3">
            <div className="w-28 shrink-0 truncate text-xs text-sub" title={r.label}>
              {r.label}
            </div>
            <div className="relative flex-1 overflow-hidden rounded-md bg-surface/60" style={{ height }}>
              <div className="absolute left-1/2 top-0 h-full w-px bg-edge" />
              <div
                className="absolute top-0 h-full transition-all"
                style={{
                  left: pos ? "50%" : `${50 - pct}%`,
                  width: `${pct}%`,
                  background: pos ? "rgb(var(--pos) / 0.75)" : "rgb(var(--neg) / 0.75)",
                }}
              />
              <div
                className={`absolute top-1/2 -translate-y-1/2 px-2 font-mono text-[11px] ${pos ? "text-pos" : "text-neg"}`}
                style={pos ? { left: `calc(50% + ${pct}% + 6px)` } : { right: `calc(50% + ${pct}% + 6px)` }}
              >
                {format(r.value)}
              </div>
            </div>
            {r.sub && <div className="w-16 shrink-0 text-right text-[11px] text-mute">{r.sub}</div>}
          </div>
        );
      })}
    </div>
  );
}

/* ── Donut ───────────────────────────────────────────────────────────
   Composition at a glance (win/loss/BE, adherence split, tag mix).    */
export interface DonutSlice {
  label: string;
  value: number;
  color: string; // css color, e.g. "rgb(var(--pos))"
}

export function Donut({ slices, size = 132, thickness = 16, center }: { slices: DonutSlice[]; size?: number; thickness?: number; center?: { value: string; label: string } }) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  const R = (size - thickness) / 2;
  const C = 2 * Math.PI * R;
  let offset = 0;

  if (total === 0) return null;

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" role="img" aria-label="Composition chart">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {slices.map((s) => {
            const frac = s.value / total;
            const dash = frac * C;
            const el = (
              <circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return el;
          })}
        </g>
        {center && (
          <>
            <text x={size / 2} y={size / 2 - 2} textAnchor="middle" fontSize={20} fontWeight={600} fill="rgb(var(--ink))">
              {center.value}
            </text>
            <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fontSize={9} fill="rgb(var(--mute))">
              {center.label}
            </text>
          </>
        )}
      </svg>
      <div className="min-w-0 space-y-1.5">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: s.color }} />
            <span className="truncate text-sub">{s.label}</span>
            <span className="ml-auto font-mono text-mute">{total ? Math.round((s.value / total) * 100) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Gauge ───────────────────────────────────────────────────────────
   A single number against a target (adherence, buffer used, progress).*/
export function Gauge({
  value,
  max = 100,
  target,
  label,
  format = (v: number) => `${Math.round(v)}%`,
  size = 150,
}: {
  value: number;
  max?: number;
  target?: number;
  label?: string;
  format?: (v: number) => string;
  size?: number;
}) {
  const gid = useId();
  const R = size * 0.38;
  const cx = size / 2;
  const cy = size * 0.56;
  const start = Math.PI * 0.85;
  const end = Math.PI * 2.15;
  const frac = Math.max(0, Math.min(1, value / max));

  const arc = (from: number, to: number, r: number) => {
    const x1 = cx + Math.cos(from) * r;
    const y1 = cy + Math.sin(from) * r;
    const x2 = cx + Math.cos(to) * r;
    const y2 = cy + Math.sin(to) * r;
    const large = to - from > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  const valAngle = start + (end - start) * frac;
  const tone = target === undefined ? "rgb(var(--accent))" : value >= target ? "rgb(var(--pos))" : value >= target * 0.8 ? "rgb(var(--warn))" : "rgb(var(--neg))";

  return (
    <svg width={size} height={size * 0.78} viewBox={`0 0 ${size} ${size * 0.78}`} role="img" aria-label={label ?? "gauge"}>
      <path d={arc(start, end, R)} fill="none" stroke="rgb(var(--surface))" strokeWidth={11} strokeLinecap="round" />
      <path d={arc(start, valAngle, R)} fill="none" stroke={tone} strokeWidth={11} strokeLinecap="round" />
      {target !== undefined && (
        <line
          x1={cx + Math.cos(start + (end - start) * (target / max)) * (R - 9)}
          y1={cy + Math.sin(start + (end - start) * (target / max)) * (R - 9)}
          x2={cx + Math.cos(start + (end - start) * (target / max)) * (R + 9)}
          y2={cy + Math.sin(start + (end - start) * (target / max)) * (R + 9)}
          stroke="rgb(var(--mute))"
          strokeWidth={1.5}
          strokeDasharray="2 2"
        />
      )}
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize={22} fontWeight={600} fill="rgb(var(--ink))" key={gid}>
        {format(value)}
      </text>
      {label && (
        <text x={cx} y={cy + 15} textAnchor="middle" fontSize={9} fill="rgb(var(--mute))">
          {label}
        </text>
      )}
    </svg>
  );
}

/* ── Sparkline ───────────────────────────────────────────────────────
   Inline trend for compact rows (per-strategy equity, per-pair drift). */
export function Sparkline({ values, width = 92, height = 26 }: { values: number[]; width?: number; height?: number }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * width},${height - ((v - min) / range) * height}`);
  const last = values[values.length - 1];
  const first = values[0];
  const up = last >= first;
  const color = up ? "rgb(var(--pos))" : "rgb(var(--neg))";

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible" role="img" aria-label="trend">
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={width} cy={height - ((last - min) / range) * height} r={2.5} fill={color} />
    </svg>
  );
}

/* ── R-multiple histogram ────────────────────────────────────────────
   The shape of your outcomes — fat left tail means stops aren't holding. */
export function RHistogram({ rs, height = 130 }: { rs: number[]; height?: number }) {
  const bins = useMemo(() => {
    const edges = [-3, -2, -1, 0, 1, 2, 3, 4];
    const out = edges.slice(0, -1).map((e, i) => ({
      label: i === 0 ? `≤${edges[1]}` : i === edges.length - 2 ? `${e}+` : `${e}`,
      from: e,
      to: edges[i + 1],
      count: 0,
    }));
    for (const r of rs) {
      let idx = out.findIndex((b) => r >= b.from && r < b.to);
      if (r < edges[0]) idx = 0;
      if (r >= edges[edges.length - 1]) idx = out.length - 1;
      if (idx >= 0) out[idx].count++;
    }
    return out;
  }, [rs]);

  const maxCount = Math.max(1, ...bins.map((b) => b.count));
  if (rs.length === 0) return null;

  return (
    <div>
      <div className="flex items-end gap-1.5" style={{ height }}>
        {bins.map((b) => (
          <div key={b.label} className="flex flex-1 flex-col items-center justify-end gap-1">
            <span className="font-mono text-[10px] text-mute">{b.count || ""}</span>
            <div
              className="w-full rounded-t transition-all"
              style={{
                height: `${(b.count / maxCount) * (height - 22)}px`,
                minHeight: b.count ? 3 : 0,
                background: b.from < 0 ? "rgb(var(--neg) / 0.7)" : "rgb(var(--pos) / 0.7)",
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-1.5">
        {bins.map((b) => (
          <div key={b.label} className="flex-1 text-center font-mono text-[9px] text-mute">
            {b.label}R
          </div>
        ))}
      </div>
    </div>
  );
}
