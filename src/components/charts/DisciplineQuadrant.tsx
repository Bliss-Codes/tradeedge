"use client";

import { useMemo, useState } from "react";

/**
 * Weekly discipline rating (x) against that week's net R (y), with the
 * quadrants shaded. The point of the quadrants: the top-left box
 * ("lucky") and bottom-right ("unlucky") should be nearly empty if your
 * process drives your results. A cloud sitting on the diagonal is the proof
 * that discipline — not the market — is what pays you.
 */

export interface QuadrantPoint {
  label: string; // e.g. "2026-W27"
  x: number; // discipline 1–5
  y: number; // net R for the week
}

export function DisciplineQuadrant({ points, height = 260 }: { points: QuadrantPoint[]; height?: number }) {
  const [hover, setHover] = useState<QuadrantPoint | null>(null);
  const W = 520;
  const H = height;
  const PAD = { t: 14, r: 16, b: 28, l: 36 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;

  const { maxAbsY, mapped } = useMemo(() => {
    const maxAbsY = Math.max(2, ...points.map((p) => Math.abs(p.y)));
    const mapped = points.map((p) => ({
      ...p,
      px: PAD.l + ((p.x - 1) / 4) * plotW,
      py: PAD.t + plotH / 2 - (p.y / maxAbsY) * (plotH / 2),
    }));
    return { maxAbsY, mapped };
  }, [points, plotW, plotH, PAD.l, PAD.t]);

  const midX = PAD.l + plotW / 2;
  const midY = PAD.t + plotH / 2;

  if (points.length === 0) return null;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Discipline rating versus weekly R">
        {/* quadrant shading: disciplined+profitable (good), sloppy+losing (expected) */}
        <rect x={midX} y={PAD.t} width={plotW / 2} height={plotH / 2} fill="rgb(var(--pos) / 0.06)" />
        <rect x={PAD.l} y={midY} width={plotW / 2} height={plotH / 2} fill="rgb(var(--neg) / 0.06)" />

        {/* axes */}
        <line x1={PAD.l} y1={midY} x2={W - PAD.r} y2={midY} stroke="rgb(var(--edge))" strokeWidth={1} />
        <line x1={midX} y1={PAD.t} x2={midX} y2={H - PAD.b} stroke="rgb(var(--edge))" strokeWidth={0.5} strokeDasharray="3 3" />

        {/* y ticks */}
        {[maxAbsY, 0, -maxAbsY].map((v) => {
          const y = PAD.t + plotH / 2 - (v / maxAbsY) * (plotH / 2);
          return (
            <text key={v} x={PAD.l - 6} y={y + 3} fontSize={9} fill="rgb(var(--mute))" textAnchor="end">
              {v > 0 ? `+${v.toFixed(0)}R` : `${v.toFixed(0)}R`}
            </text>
          );
        })}
        {/* x ticks */}
        {[1, 2, 3, 4, 5].map((v) => (
          <text key={v} x={PAD.l + ((v - 1) / 4) * plotW} y={H - PAD.b + 14} fontSize={9} fill="rgb(var(--mute))" textAnchor="middle">
            {v}
          </text>
        ))}
        <text x={PAD.l + plotW / 2} y={H - 2} fontSize={9} fill="rgb(var(--mute))" textAnchor="middle">
          discipline rating
        </text>

        {/* quadrant captions */}
        <text x={W - PAD.r - 4} y={PAD.t + 11} fontSize={8.5} fill="rgb(var(--pos))" textAnchor="end" opacity={0.75}>
          disciplined &amp; profitable
        </text>
        <text x={PAD.l + 4} y={H - PAD.b - 5} fontSize={8.5} fill="rgb(var(--neg))" opacity={0.75}>
          sloppy &amp; losing
        </text>

        {mapped.map((p) => (
          <circle
            key={p.label}
            cx={p.px}
            cy={p.py}
            r={hover?.label === p.label ? 7 : 5}
            fill={p.y >= 0 ? "rgb(var(--pos) / 0.85)" : "rgb(var(--neg) / 0.85)"}
            stroke="rgb(var(--bg))"
            strokeWidth={1.5}
            onMouseEnter={() => setHover(p)}
            onMouseLeave={() => setHover(null)}
            className="cursor-default transition-all"
          />
        ))}
      </svg>

      {hover && (
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 rounded-lg border border-edge bg-bg px-2.5 py-1.5 text-xs shadow-lg">
          <span className="font-mono text-mute">{hover.label}</span>{" "}
          <span className="text-sub">discipline {hover.x}/5</span>{" "}
          <span className={hover.y >= 0 ? "text-pos" : "text-neg"}>
            {hover.y >= 0 ? "+" : ""}
            {hover.y.toFixed(1)}R
          </span>
        </div>
      )}
    </div>
  );
}
