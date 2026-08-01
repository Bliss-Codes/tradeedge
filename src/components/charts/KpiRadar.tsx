"use client";

import { useMemo } from "react";

/**
 * Six-axis radar plotting your KPIs against the prop-trading sweet spot.
 * Each axis is normalised so the dashed ring IS the target — inside the ring
 * means below target, outside means clear. One glance tells you which axis is
 * weak, which a table of six numbers never does.
 */

export interface KpiAxis {
  key: string;
  label: string;
  value: number; // raw
  target: number; // sweet-spot floor
  /** ceiling for normalisation, so one great axis doesn't blow out the shape */
  max: number;
  format: (v: number) => string;
}

export function KpiRadar({ axes, size = 300 }: { axes: KpiAxis[]; size?: number }) {
  // The canvas is wider than tall: axis labels sit outside the circle and the
  // left/right ones need room for their full text, which a square viewBox clips.
  const PAD_X = 82;
  const PAD_Y = 30;
  const W = size + PAD_X * 2;
  const H = size + PAD_Y * 2;
  const cx = W / 2;
  const cy = H / 2;
  const R = size * 0.32;

  const pts = useMemo(() => {
    const n = axes.length;
    return axes.map((a, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2; // start at top
      const norm = Math.max(0, Math.min(1, a.value / a.max));
      const targetNorm = Math.max(0, Math.min(1, a.target / a.max));
      return {
        ...a,
        angle,
        norm,
        targetNorm,
        x: cx + Math.cos(angle) * R * norm,
        y: cy + Math.sin(angle) * R * norm,
        tx: cx + Math.cos(angle) * R * targetNorm,
        ty: cy + Math.sin(angle) * R * targetNorm,
        lx: cx + Math.cos(angle) * (R + 22),
        ly: cy + Math.sin(angle) * (R + 22),
        hit: a.value >= a.target,
      };
    });
  }, [axes, cx, cy, R]);

  const shape = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const targetShape = pts.map((p) => `${p.tx},${p.ty}`).join(" ");
  const hits = pts.filter((p) => p.hit).length;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="KPI scorecard against targets">
        {/* rings */}
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <circle key={r} cx={cx} cy={cy} r={R * r} fill="none" stroke="rgb(var(--edge))" strokeWidth={0.5} />
        ))}
        {/* spokes */}
        {pts.map((p) => (
          <line key={p.key} x1={cx} y1={cy} x2={cx + Math.cos(p.angle) * R} y2={cy + Math.sin(p.angle) * R} stroke="rgb(var(--edge))" strokeWidth={0.5} />
        ))}

        {/* target ring — the sweet spot */}
        <polygon points={targetShape} fill="none" stroke="rgb(var(--mute))" strokeWidth={1} strokeDasharray="4 3" />

        {/* actual */}
        <polygon points={shape} fill="rgb(var(--accent) / 0.18)" stroke="rgb(var(--accent))" strokeWidth={1.75} strokeLinejoin="round" />

        {pts.map((p) => (
          <circle key={p.key} cx={p.x} cy={p.y} r={3} fill={p.hit ? "rgb(var(--pos))" : "rgb(var(--warn))"} />
        ))}

        {/* labels */}
        {pts.map((p) => {
          // Vertical-ish axes centre their text; side axes read outward so the
          // longest labels grow into the padding instead of off the canvas.
          const anchor = Math.abs(p.lx - cx) < 20 ? "middle" : p.lx > cx ? "start" : "end";
          return (
            <g key={p.key}>
              <text x={p.lx} y={p.ly - 3} fontSize={9} fill="rgb(var(--mute))" textAnchor={anchor}>
                {p.label}
              </text>
              <text x={p.lx} y={p.ly + 8} fontSize={10} fontWeight={600} fill={p.hit ? "rgb(var(--pos))" : "rgb(var(--warn))"} textAnchor={anchor}>
                {p.format(p.value)}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-1 flex items-center justify-between text-[10px] text-mute">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0 w-4 border-t border-dashed border-mute" /> target
        </span>
        <span className={hits === axes.length ? "text-pos" : hits >= axes.length / 2 ? "text-warn" : "text-neg"}>
          {hits} of {axes.length} KPIs at target
        </span>
      </div>
    </div>
  );
}
