"use client";

import { useMemo, useState } from "react";
import { fmtMoney } from "@/lib/metrics";
import { Trade } from "@/lib/types";

/**
 * A year of trading as a single grid — one cell per day, coloured by net P&L.
 * Reveals what a table never does: streaks, dead weeks, and whether the good
 * days cluster or scatter. Hand-rolled SVG so it inherits the app's tokens.
 */

const CELL = 12;
const GAP = 3;
const STEP = CELL + GAP;
const DOW_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function YearHeatmap({
  trades,
  currency = "USD",
  weeks = 27,
}: {
  trades: Trade[];
  currency?: string;
  weeks?: number;
}) {
  const [hover, setHover] = useState<{ x: number; y: number; date: string; pnl: number; n: number } | null>(null);

  const { cells, maxAbs, months } = useMemo(() => {
    const byDay = new Map<string, { pnl: number; n: number }>();
    for (const t of trades) {
      const k = dayKey(new Date(t.date));
      const prev = byDay.get(k) ?? { pnl: 0, n: 0 };
      byDay.set(k, { pnl: prev.pnl + t.pnl, n: prev.n + 1 });
    }

    // End on the current week's Saturday, walk back `weeks` weeks.
    const end = new Date();
    end.setDate(end.getDate() + (6 - end.getDay()));
    const start = new Date(end);
    start.setDate(start.getDate() - (weeks * 7 - 1));

    const out: { col: number; row: number; key: string; date: Date; pnl: number; n: number }[] = [];
    const monthMarks: { col: number; label: string }[] = [];
    let maxAbs = 0;
    let lastMonth = -1;

    for (let i = 0; i < weeks * 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const col = Math.floor(i / 7);
      const row = d.getDay();
      const k = dayKey(d);
      const hit = byDay.get(k);
      const pnl = hit?.pnl ?? 0;
      if (Math.abs(pnl) > maxAbs) maxAbs = Math.abs(pnl);
      out.push({ col, row, key: k, date: d, pnl, n: hit?.n ?? 0 });
      if (row === 0 && d.getMonth() !== lastMonth) {
        lastMonth = d.getMonth();
        monthMarks.push({ col, label: d.toLocaleDateString(undefined, { month: "short" }) });
      }
    }
    return { cells: out, maxAbs: maxAbs || 1, months: monthMarks };
  }, [trades, weeks]);

  const W = weeks * STEP + 34;
  const H = 7 * STEP + 22;

  const fill = (pnl: number, n: number) => {
    if (n === 0) return "rgb(var(--surface))";
    const t = Math.min(1, Math.abs(pnl) / maxAbs);
    const intensity = 0.18 + t * 0.82; // floor so tiny days stay visible
    return pnl >= 0 ? `rgb(var(--pos) / ${intensity})` : `rgb(var(--neg) / ${intensity})`;
  };

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: H * 1.6 }} role="img" aria-label="Daily profit and loss heatmap">
        {months.map((m) => (
          <text key={`${m.col}-${m.label}`} x={34 + m.col * STEP} y={9} fontSize={8} fill="rgb(var(--mute))">
            {m.label}
          </text>
        ))}
        {DOW_LABELS.map((l, i) =>
          l ? (
            <text key={l} x={0} y={22 + i * STEP + CELL - 3} fontSize={8} fill="rgb(var(--mute))">
              {l}
            </text>
          ) : null
        )}
        {cells.map((c) => (
          <rect
            key={c.key}
            x={34 + c.col * STEP}
            y={16 + c.row * STEP}
            width={CELL}
            height={CELL}
            rx={2.5}
            fill={fill(c.pnl, c.n)}
            stroke={c.n > 0 ? "rgb(var(--edge))" : "transparent"}
            strokeWidth={0.5}
            onMouseEnter={() =>
              setHover({
                x: 34 + c.col * STEP,
                y: 16 + c.row * STEP,
                date: c.date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
                pnl: c.pnl,
                n: c.n,
              })
            }
            onMouseLeave={() => setHover(null)}
            className="cursor-default"
          />
        ))}
      </svg>

      <div className="mt-2 flex items-center justify-between text-[10px] text-mute">
        <span>{trades.length} trades over {weeks} weeks</span>
        <span className="flex items-center gap-1.5">
          loss
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "rgb(var(--neg) / 0.85)" }} />
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "rgb(var(--surface))" }} />
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "rgb(var(--pos) / 0.85)" }} />
          profit
        </span>
      </div>

      {hover && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-edge bg-bg px-2.5 py-1.5 text-xs shadow-lg"
          style={{ left: `${(hover.x / W) * 100}%`, top: `${((hover.y - 4) / H) * 100}%`, transform: "translate(-50%, -100%)" }}
        >
          <div className="font-medium text-ink">{hover.date}</div>
          <div className={hover.n === 0 ? "text-mute" : hover.pnl >= 0 ? "text-pos" : "text-neg"}>
            {hover.n === 0 ? "no trades" : `${fmtMoney(hover.pnl, currency)} · ${hover.n} trade${hover.n === 1 ? "" : "s"}`}
          </div>
        </div>
      )}
    </div>
  );
}
