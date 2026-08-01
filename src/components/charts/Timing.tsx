"use client";

import { useMemo, useState } from "react";
import { Trade } from "@/lib/types";
import { fmtMoney, fmtPct } from "@/lib/metrics";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Hour × weekday matrix. The single most revealing timing visual: it exposes
 * whether your edge lives in a specific window (e.g. Tue–Thu London open)
 * rather than being spread evenly — which a per-hour bar chart hides, because
 * it averages a great Wednesday with a terrible Friday at the same hour.
 */
export function TimeMatrix({ trades, currency = "USD" }: { trades: Trade[]; currency?: string }) {
  const [metric, setMetric] = useState<"pnl" | "count" | "winRate">("pnl");
  const [hover, setHover] = useState<{ day: number; hour: number; pnl: number; n: number; wins: number } | null>(null);

  const { grid, hours, maxAbs } = useMemo(() => {
    const g = new Map<string, { pnl: number; n: number; wins: number }>();
    const hourSet = new Set<number>();
    for (const t of trades) {
      const d = new Date(t.date);
      const day = d.getDay();
      const hour = d.getHours();
      hourSet.add(hour);
      const k = `${day}-${hour}`;
      const prev = g.get(k) ?? { pnl: 0, n: 0, wins: 0 };
      g.set(k, { pnl: prev.pnl + t.pnl, n: prev.n + 1, wins: prev.wins + (t.pnl > 0 ? 1 : 0) });
    }
    // Show a contiguous band covering the traded hours, min 8 wide for shape.
    const list = [...hourSet].sort((a, b) => a - b);
    const lo = list.length ? Math.max(0, Math.min(...list) - 1) : 6;
    const hi = list.length ? Math.min(23, Math.max(...list) + 1) : 20;
    const hours = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
    let maxAbs = 0;
    for (const v of g.values()) if (Math.abs(v.pnl) > maxAbs) maxAbs = Math.abs(v.pnl);
    return { grid: g, hours, maxAbs: maxAbs || 1 };
  }, [trades]);

  if (trades.length === 0) return null;

  const cellFill = (cell: { pnl: number; n: number; wins: number } | undefined) => {
    if (!cell || cell.n === 0) return "rgb(var(--surface) / 0.5)";
    if (metric === "count") {
      const t = Math.min(1, cell.n / 6);
      return `rgb(var(--accent) / ${0.15 + t * 0.75})`;
    }
    if (metric === "winRate") {
      const wr = cell.wins / cell.n;
      return wr >= 0.5 ? `rgb(var(--pos) / ${0.2 + wr * 0.7})` : `rgb(var(--neg) / ${0.2 + (1 - wr) * 0.7})`;
    }
    const t = Math.min(1, Math.abs(cell.pnl) / maxAbs);
    return cell.pnl >= 0 ? `rgb(var(--pos) / ${0.18 + t * 0.8})` : `rgb(var(--neg) / ${0.18 + t * 0.8})`;
  };

  return (
    <div>
      <div className="mb-3 flex gap-1.5">
        {([
          ["pnl", "Net P&L"],
          ["winRate", "Win rate"],
          ["count", "Volume"],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setMetric(k)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              metric === k ? "border-accent bg-accent/15 text-accent" : "border-edge text-mute hover:text-sub"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full border-separate" style={{ borderSpacing: 3 }}>
          <thead>
            <tr>
              <th className="w-10" />
              {hours.map((h) => (
                <th key={h} className="pb-1 text-center font-mono text-[9px] font-normal text-mute">
                  {String(h).padStart(2, "0")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 0].map((day) => (
              <tr key={day}>
                <td className="pr-1 text-right text-[10px] text-mute">{DAYS[day]}</td>
                {hours.map((h) => {
                  const cell = grid.get(`${day}-${h}`);
                  return (
                    <td key={h}>
                      <div
                        className="h-6 min-w-[18px] rounded transition-all"
                        style={{ background: cellFill(cell) }}
                        onMouseEnter={() =>
                          cell && setHover({ day, hour: h, pnl: cell.pnl, n: cell.n, wins: cell.wins })
                        }
                        onMouseLeave={() => setHover(null)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hover ? (
        <div className="mt-2 rounded-lg border border-edge bg-surface/50 px-3 py-2 text-xs">
          <span className="font-medium text-ink">
            {DAYS[hover.day]} {String(hover.hour).padStart(2, "0")}:00
          </span>
          <span className="ml-3 text-mute">{hover.n} trades</span>
          <span className="ml-3 text-mute">{fmtPct((hover.wins / hover.n) * 100)} win</span>
          <span className={`ml-3 font-mono ${hover.pnl >= 0 ? "text-pos" : "text-neg"}`}>{fmtMoney(hover.pnl, currency)}</span>
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-mute">
          Hover a cell for detail. Clusters of green in one day-and-hour block are where your edge actually lives.
        </p>
      )}
    </div>
  );
}

/**
 * Day-of-week performance. Separate from the matrix because the aggregate is
 * often the actionable cut — "stop trading Fridays" is a rule you can keep.
 */
export function DayOfWeek({ trades, currency = "USD" }: { trades: Trade[]; currency?: string }) {
  const rows = useMemo(() => {
    const g = new Map<number, { pnl: number; n: number; wins: number; r: number }>();
    for (const t of trades) {
      const day = new Date(t.date).getDay();
      const prev = g.get(day) ?? { pnl: 0, n: 0, wins: 0, r: 0 };
      g.set(day, { pnl: prev.pnl + t.pnl, n: prev.n + 1, wins: prev.wins + (t.pnl > 0 ? 1 : 0), r: prev.r + t.rr });
    }
    return [1, 2, 3, 4, 5].map((d) => ({ day: d, label: DAYS[d], ...(g.get(d) ?? { pnl: 0, n: 0, wins: 0, r: 0 }) }));
  }, [trades]);

  const maxAbs = Math.max(1, ...rows.map((r) => Math.abs(r.pnl)));
  const best = [...rows].filter((r) => r.n > 0).sort((a, b) => b.r - a.r)[0];
  const worst = [...rows].filter((r) => r.n > 0).sort((a, b) => a.r - b.r)[0];

  return (
    <div>
      <div className="space-y-2">
        {rows.map((r) => {
          const pct = (Math.abs(r.pnl) / maxAbs) * 50;
          const pos = r.pnl >= 0;
          return (
            <div key={r.day} className="flex items-center gap-3">
              <div className="w-9 shrink-0 text-xs text-sub">{r.label}</div>
              <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-surface/60">
                <div className="absolute left-1/2 top-0 h-full w-px bg-edge" />
                {r.n > 0 && (
                  <div
                    className="absolute top-0 h-full"
                    style={{
                      left: pos ? "50%" : `${50 - pct}%`,
                      width: `${pct}%`,
                      background: pos ? "rgb(var(--pos) / 0.75)" : "rgb(var(--neg) / 0.75)",
                    }}
                  />
                )}
                <div className="absolute inset-y-0 right-2 flex items-center gap-3 font-mono text-[10px] text-mute">
                  <span>{r.n}t</span>
                  <span>{r.n ? fmtPct((r.wins / r.n) * 100) : "—"}</span>
                  <span className={r.pnl >= 0 ? "text-pos" : "text-neg"}>{r.n ? fmtMoney(r.pnl, currency) : ""}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {best && worst && best.day !== worst.day && (
        <p className="mt-3 text-[11px] text-mute">
          Best day <span className="text-pos">{best.label}</span> at {best.r.toFixed(1)}R · worst{" "}
          <span className="text-neg">{worst.label}</span> at {worst.r.toFixed(1)}R
          {worst.r < 0 ? " — a standing rule to skip it is worth considering." : "."}
        </p>
      )}
    </div>
  );
}

/**
 * Trade frequency. Overtrading is the most common silent killer, so this
 * surfaces cadence against the discipline target of ~2 trades/day.
 */
export function TradeFrequency({ trades, targetPerDay = 2 }: { trades: Trade[]; targetPerDay?: number }) {
  const m = useMemo(() => {
    if (trades.length === 0) return null;
    const byDay = new Map<string, number>();
    for (const t of trades) {
      const k = t.date.slice(0, 10);
      byDay.set(k, (byDay.get(k) ?? 0) + 1);
    }
    const counts = [...byDay.values()];
    const activeDays = counts.length;
    const sorted = [...trades].sort((a, b) => a.date.localeCompare(b.date));
    const spanDays = Math.max(
      1,
      Math.round((new Date(sorted[sorted.length - 1].date).getTime() - new Date(sorted[0].date).getTime()) / 86400000) + 1
    );
    const weeks = Math.max(1, spanDays / 7);
    const overDays = counts.filter((c) => c > targetPerDay).length;
    return {
      perActiveDay: trades.length / activeDays,
      perWeek: trades.length / weeks,
      activeDays,
      spanDays,
      busiest: Math.max(...counts),
      overDays,
      overPct: (overDays / activeDays) * 100,
    };
  }, [trades, targetPerDay]);

  if (!m) return null;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-mute">Per active day</div>
          <div className={`mt-1.5 font-mono text-2xl font-semibold ${m.perActiveDay > targetPerDay ? "text-warn" : "text-ink"}`}>
            {m.perActiveDay.toFixed(1)}
          </div>
          <div className="mt-0.5 text-[11px] text-mute">target ≤ {targetPerDay}</div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-mute">Per week</div>
          <div className="mt-1.5 font-mono text-2xl font-semibold text-ink">{m.perWeek.toFixed(1)}</div>
          <div className="mt-0.5 text-[11px] text-mute">{m.activeDays} active of {m.spanDays} days</div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-mute">Busiest day</div>
          <div className="mt-1.5 font-mono text-2xl font-semibold text-ink">{m.busiest}</div>
          <div className="mt-0.5 text-[11px] text-mute">trades in one day</div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-mute">Over limit</div>
          <div className={`mt-1.5 font-mono text-2xl font-semibold ${m.overPct > 20 ? "text-neg" : m.overPct > 0 ? "text-warn" : "text-pos"}`}>
            {Math.round(m.overPct)}%
          </div>
          <div className="mt-0.5 text-[11px] text-mute">{m.overDays} days above {targetPerDay}</div>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-mute">
        {m.perActiveDay > targetPerDay
          ? "You're averaging above the cap. Overtrading is usually the quiet cause of a red month, not a bad strategy."
          : "Cadence is inside the cap — fewer, higher-quality decisions is exactly the intent."}
      </p>
    </div>
  );
}
