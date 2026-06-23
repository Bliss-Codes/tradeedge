"use client";

import { useId, useMemo, useState } from "react";
import { EquityPoint, fmtR } from "@/lib/metrics";

export function EquityCurve({ points, height = 260 }: { points: EquityPoint[]; height?: number }) {
  const gid = useId();
  const [hover, setHover] = useState<number | null>(null);
  const W = 900;
  const H = height;
  const PAD = 16;

  const { path, area, coords, min, max } = useMemo(() => {
    if (points.length === 0) return { path: "", area: "", coords: [] as [number, number][], min: 0, max: 0 };
    const values = [0, ...points.map((p) => p.value)];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const n = values.length;
    const x = (i: number) => PAD + (i / Math.max(n - 1, 1)) * (W - PAD * 2);
    const y = (v: number) => PAD + (1 - (v - min) / span) * (H - PAD * 2);
    const coords = values.map((v, i) => [x(i), y(v)] as [number, number]);
    const path = coords.map(([cx, cy], i) => `${i === 0 ? "M" : "L"}${cx.toFixed(1)},${cy.toFixed(1)}`).join(" ");
    const area = `${path} L${coords[coords.length - 1][0].toFixed(1)},${H - PAD} L${coords[0][0].toFixed(1)},${H - PAD} Z`;
    return { path, area, coords, min, max };
  }, [points, H]);

  if (points.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-mute" style={{ height }}>
        Log a trade to start the curve.
      </div>
    );
  }

  const last = points[points.length - 1].value;
  const positive = last >= 0;
  const stroke = positive ? "#22C55E" : "#EF4444";
  const zeroY = max === min ? H / 2 : PAD + (1 - (0 - min) / (max - min)) * (H - PAD * 2);
  const hoverPoint = hover !== null && hover > 0 ? points[hover - 1] : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="none"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = (e.target as SVGElement).closest("svg")!.getBoundingClientRect();
          const px = ((e.clientX - rect.left) / rect.width) * W;
          let best = 0;
          let bestD = Infinity;
          coords.forEach(([cx], i) => {
            const d = Math.abs(cx - px);
            if (d < bestD) {
              bestD = d;
              best = i;
            }
          });
          setHover(best);
        }}
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        {zeroY > PAD && zeroY < H - PAD && (
          <line x1={PAD} x2={W - PAD} y1={zeroY} y2={zeroY} stroke="#272A27" strokeDasharray="4 4" />
        )}
        <path d={area} fill={`url(#${gid})`} />
        <path d={path} fill="none" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {hover !== null && (
          <g>
            <line x1={coords[hover][0]} x2={coords[hover][0]} y1={PAD} y2={H - PAD} stroke="#334155" />
            <circle cx={coords[hover][0]} cy={coords[hover][1]} r="4" fill={stroke} />
          </g>
        )}
      </svg>
      <div className="mt-1 flex justify-between text-xs text-mute">
        <span>{hoverPoint ? new Date(hoverPoint.date).toLocaleDateString() : "Start"}</span>
        <span className="font-mono">
          {hoverPoint ? fmtR(hoverPoint.value) : hover === 0 ? "0.00R" : fmtR(last)}
        </span>
      </div>
    </div>
  );
}

export function BarRow({ label, value, max, display, color = "#A3E635" }: { label: string; value: number; max: number; display: string; color?: string }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="w-28 shrink-0 truncate text-sm text-sub">{label}</div>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className="w-20 shrink-0 text-right font-mono text-sm text-ink">{display}</div>
    </div>
  );
}
