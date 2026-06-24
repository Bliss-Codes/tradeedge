"use client";

import { useId, useMemo, useState } from "react";
import { EquityPoint, fmtR, fmtMoney } from "@/lib/metrics";

function niceNum(x: number) {
  if (x <= 0) return 1;
  const exp = Math.floor(Math.log10(x));
  const f = x / Math.pow(10, exp);
  const nf = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10;
  return nf * Math.pow(10, exp);
}
function niceTicks(min: number, max: number, count = 4) {
  const range = max - min || 1;
  const step = niceNum(range / count);
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + step * 0.001; v += step) ticks.push(+v.toFixed(4));
  return { ticks, niceMin, niceMax };
}

export function EquityCurve({ points, height = 280, mode = "R" }: { points: EquityPoint[]; height?: number; mode?: "R" | "money" }) {
  const fmt = mode === "money" ? fmtMoney : fmtR;
  const gid = useId();
  const [hover, setHover] = useState<number | null>(null);
  const W = 1000;
  const H = height;
  const PAD_T = 12;
  const PAD_B = 12;

  const model = useMemo(() => {
    if (points.length === 0) return null;
    const values = [0, ...points.map((p) => p.value)];
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const { ticks, niceMin, niceMax } = niceTicks(rawMin, rawMax, 4);
    const span = niceMax - niceMin || 1;
    const n = values.length;
    const x = (i: number) => (i / Math.max(n - 1, 1)) * W;
    const y = (v: number) => PAD_T + (1 - (v - niceMin) / span) * (H - PAD_T - PAD_B);
    const coords = values.map((v, i) => [x(i), y(v)] as [number, number]);
    const path = coords.map(([cx, cy], i) => `${i === 0 ? "M" : "L"}${cx.toFixed(1)},${cy.toFixed(1)}`).join(" ");
    const area = `${path} L${W},${H - PAD_B} L0,${H - PAD_B} Z`;
    const zeroY = niceMin <= 0 && niceMax >= 0 ? y(0) : null;
    // x labels: sample ~6 dates (skip the synthetic start point at index 0)
    const labelCount = Math.min(6, points.length);
    const xLabels = Array.from({ length: labelCount }, (_, k) => {
      const idx = Math.round((k / Math.max(labelCount - 1, 1)) * (points.length - 1));
      return { frac: (idx + 1) / Math.max(n - 1, 1), date: points[idx].date };
    });
    return { coords, path, area, ticks, y, zeroY, xLabels, last: points[points.length - 1].value };
  }, [points, H]);

  if (!model) {
    return (
      <div className="flex items-center justify-center text-sm text-mute" style={{ height }}>
        Log a trade to start the curve.
      </div>
    );
  }

  const { coords, path, area, ticks, y, zeroY, xLabels, last } = model;
  const positive = last >= 0;
  const stroke = positive ? "#22C55E" : "#EF4444";
  const hoverPoint = hover !== null && hover > 0 ? points[hover - 1] : null;

  return (
    <div>
      <div className="relative" style={{ paddingLeft: 46 }}>
        {/* Y axis labels */}
        {ticks.map((v) => (
          <span
            key={v}
            className="absolute left-0 -translate-y-1/2 font-mono text-[10px] text-mute"
            style={{ top: `${(y(v) / H) * 100}%`, width: 40, textAlign: "right" }}
          >
            {fmtR(v)}
          </span>
        ))}
        <div className="relative" style={{ height }}>
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
                <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
                <stop offset="100%" stopColor={stroke} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* gridlines */}
            {ticks.map((v) => (
              <line key={v} x1="0" x2={W} y1={y(v)} y2={y(v)} className="stroke-edge" strokeOpacity="0.5" strokeDasharray="3 4" />
            ))}
            {zeroY !== null && <line x1="0" x2={W} y1={zeroY} y2={zeroY} className="stroke-mute" strokeOpacity="0.4" />}
            <path d={area} fill={`url(#${gid})`} />
            <path d={path} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            {hover !== null && (
              <g>
                <line x1={coords[hover][0]} x2={coords[hover][0]} y1={PAD_T} y2={H - PAD_B} className="stroke-mute" strokeOpacity="0.5" />
                <circle cx={coords[hover][0]} cy={coords[hover][1]} r="4" fill={stroke} className="stroke-bg" strokeWidth="2" />
              </g>
            )}
          </svg>
          {/* X axis labels */}
          {xLabels.map((l, i) => (
            <span
              key={i}
              className="absolute -translate-x-1/2 whitespace-nowrap text-[10px] text-mute"
              style={{ left: `${l.frac * 100}%`, bottom: -2 }}
            >
              {new Date(l.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-5 flex justify-between pl-[46px] text-xs text-mute">
        <span>{hoverPoint ? new Date(hoverPoint.date).toLocaleDateString() : "Cumulative R"}</span>
        <span className={`font-mono ${(hoverPoint ? hoverPoint.value : last) >= 0 ? "text-pos" : "text-neg"}`}>
          {hoverPoint ? fmt(hoverPoint.value) : hover === 0 ? fmt(0) : fmt(last)}
        </span>
      </div>
    </div>
  );
}

export function DailyPnlBars({ days, height = 220 }: { days: { date: string; pnl: number }[]; height?: number }) {
  if (days.length === 0) {
    return <div className="flex items-center justify-center text-sm text-mute" style={{ height }}>No daily P&L yet.</div>;
  }
  const max = Math.max(1, ...days.map((d) => Math.abs(d.pnl)));
  // nice top tick
  const exp = Math.floor(Math.log10(max));
  const f = max / Math.pow(10, exp);
  const nf = f < 1.5 ? 1.5 : f < 3 ? 3 : f < 7 ? 7 : 10;
  const top = nf * Math.pow(10, exp);
  const ticks = [top, top / 2, 0, -top / 2, -top];
  const recent = days.slice(-22); // keep it readable
  return (
    <div className="flex" style={{ height }}>
      <div className="flex w-14 shrink-0 flex-col justify-between py-1 pr-2 text-right">
        {ticks.map((t) => (
          <span key={t} className="font-mono text-[10px] text-mute">{fmtMoney(t)}</span>
        ))}
      </div>
      <div className="relative flex-1">
        {/* gridlines */}
        {ticks.map((t, i) => (
          <div key={t} className="absolute left-0 right-0 border-t border-edge/50" style={{ top: `${(i / (ticks.length - 1)) * 100}%` }} />
        ))}
        {/* bars */}
        <div className="absolute inset-0 flex items-stretch gap-1">
          {recent.map((d) => {
            const h = (Math.abs(d.pnl) / top) * 50; // % of half-height
            const pos = d.pnl >= 0;
            return (
              <div key={d.date} className="group relative flex flex-1 flex-col" title={`${new Date(d.date).toLocaleDateString()} · ${fmtMoney(d.pnl)}`}>
                <div className="flex h-1/2 items-end justify-center">
                  {pos && <div className="w-full max-w-[18px] rounded-t bg-pos transition-opacity group-hover:opacity-80" style={{ height: `${h * 2}%` }} />}
                </div>
                <div className="flex h-1/2 items-start justify-center">
                  {!pos && <div className="w-full max-w-[18px] rounded-b bg-neg transition-opacity group-hover:opacity-80" style={{ height: `${h * 2}%` }} />}
                </div>
              </div>
            );
          })}
        </div>
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
