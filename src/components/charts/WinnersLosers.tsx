"use client";

import { useMemo } from "react";
import { Trade, outcomeOf } from "@/lib/types";
import { fmtMoney } from "@/lib/metrics";

/**
 * Mirrored winners/losers panels. The value is in the symmetry: every metric
 * appears on both sides, so the asymmetries that matter — average win vs
 * average loss, how long you hold winners vs losers, streak lengths — jump out
 * without any mental arithmetic.
 */

interface SideStats {
  count: number;
  best: number;
  avg: number;
  maxStreak: number;
  avgStreak: number;
  totalR: number;
}

function sideStats(list: Trade[], all: Trade[], isWin: boolean): SideStats {
  const count = list.length;
  const rs = list.map((t) => t.rr);
  const best = rs.length ? (isWin ? Math.max(...rs) : Math.min(...rs)) : 0;
  const avg = rs.length ? rs.reduce((a, b) => a + b, 0) / rs.length : 0;

  // streaks across the full ordered history
  const ordered = [...all].sort((a, b) => a.date.localeCompare(b.date));
  const streaks: number[] = [];
  let run = 0;
  for (const t of ordered) {
    const hit = isWin ? outcomeOf(t) === "win" : outcomeOf(t) === "loss";
    if (hit) run++;
    else if (run > 0) {
      streaks.push(run);
      run = 0;
    }
  }
  if (run > 0) streaks.push(run);

  return {
    count,
    best,
    avg,
    maxStreak: streaks.length ? Math.max(...streaks) : 0,
    avgStreak: streaks.length ? streaks.reduce((a, b) => a + b, 0) / streaks.length : 0,
    totalR: rs.reduce((a, b) => a + b, 0),
  };
}

function Row({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-mute">{label}</span>
      <span className={`font-mono font-medium ${tone ?? "text-ink"}`}>{value}</span>
    </div>
  );
}

export function WinnersLosers({ trades, currency = "USD" }: { trades: Trade[]; currency?: string }) {
  const { w, l } = useMemo(() => {
    const wins = trades.filter((t) => outcomeOf(t) === "win");
    const losses = trades.filter((t) => outcomeOf(t) === "loss");
    return { w: sideStats(wins, trades, true), l: sideStats(losses, trades, false) };
  }, [trades]);

  if (trades.length === 0) return null;

  const winMoney = trades.filter((t) => outcomeOf(t) === "win").reduce((s, t) => s + t.pnl, 0);
  const lossMoney = trades.filter((t) => outcomeOf(t) === "loss").reduce((s, t) => s + t.pnl, 0);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-pos/40 bg-pos/[0.03] p-5">
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-base font-semibold text-pos">Winners</h3>
          <span className="font-mono text-sm text-pos">{fmtMoney(winMoney, currency)}</span>
        </div>
        <div className="divide-y divide-edge/60">
          <Row label="Total winners" value={String(w.count)} />
          <Row label="Best win" value={`${w.best.toFixed(2)}R`} tone="text-pos" />
          <Row label="Average win" value={`${w.avg.toFixed(2)}R`} tone="text-pos" />
          <Row label="Total R" value={`+${w.totalR.toFixed(1)}R`} tone="text-pos" />
          <Row label="Max consecutive" value={String(w.maxStreak)} />
          <Row label="Avg consecutive" value={w.avgStreak.toFixed(1)} />
        </div>
      </div>

      <div className="rounded-2xl border border-neg/40 bg-neg/[0.03] p-5">
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-base font-semibold text-neg">Losers</h3>
          <span className="font-mono text-sm text-neg">{fmtMoney(lossMoney, currency)}</span>
        </div>
        <div className="divide-y divide-edge/60">
          <Row label="Total losers" value={String(l.count)} />
          <Row label="Worst loss" value={`${l.best.toFixed(2)}R`} tone="text-neg" />
          <Row label="Average loss" value={`${l.avg.toFixed(2)}R`} tone="text-neg" />
          <Row label="Total R" value={`${l.totalR.toFixed(1)}R`} tone="text-neg" />
          <Row label="Max consecutive" value={String(l.maxStreak)} />
          <Row label="Avg consecutive" value={l.avgStreak.toFixed(1)} />
        </div>
      </div>
    </div>
  );
}

/**
 * Expectancy as a tug-of-war: average win pulling right, average loss pulling
 * left, sized by their contribution. Shows not just THAT you're positive but
 * WHY — big winners, or few losses.
 */
export function ExpectancyBar({ trades, currency = "USD" }: { trades: Trade[]; currency?: string }) {
  const m = useMemo(() => {
    const wins = trades.filter((t) => outcomeOf(t) === "win");
    const losses = trades.filter((t) => outcomeOf(t) === "loss");
    const n = trades.length || 1;
    const avgWin = wins.length ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : 0;
    const avgLoss = losses.length ? losses.reduce((s, t) => s + t.pnl, 0) / losses.length : 0;
    const winRate = wins.length / n;
    const expectancy = winRate * avgWin + (1 - winRate) * avgLoss;
    const pull = Math.abs(winRate * avgWin) + Math.abs((1 - winRate) * avgLoss) || 1;
    return {
      avgWin,
      avgLoss,
      expectancy,
      winPct: (Math.abs(winRate * avgWin) / pull) * 100,
      lossPct: (Math.abs((1 - winRate) * avgLoss) / pull) * 100,
    };
  }, [trades]);

  if (trades.length === 0) return null;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-mute">Expectancy per trade</span>
        <span className={`font-mono text-xl font-semibold ${m.expectancy >= 0 ? "text-pos" : "text-neg"}`}>
          {fmtMoney(m.expectancy, currency)}
        </span>
      </div>
      <div className="mt-2.5 flex h-3 overflow-hidden rounded-full bg-surface">
        <div className="transition-all" style={{ width: `${m.winPct}%`, background: "linear-gradient(90deg, rgb(var(--pos)/0.55), rgb(var(--pos)))" }} />
        <div className="transition-all" style={{ width: `${m.lossPct}%`, background: "linear-gradient(90deg, rgb(var(--neg)), rgb(var(--neg)/0.55))" }} />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px]">
        <span className="text-pos">avg win {fmtMoney(m.avgWin, currency)}</span>
        <span className="text-neg">avg loss {fmtMoney(m.avgLoss, currency)}</span>
      </div>
    </div>
  );
}

/**
 * Concentric rings comparing one metric across two groups (long vs short).
 * Reads faster than two separate donuts because the comparison is radial.
 */
export function RingCompare({
  rings,
  size = 150,
  center,
}: {
  rings: { label: string; value: number; max: number; color: string }[];
  size?: number;
  center?: string;
}) {
  const thickness = 11;
  const gap = 4;

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" role="img" aria-label="ring comparison">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {rings.map((r, i) => {
            const radius = size / 2 - thickness / 2 - i * (thickness + gap);
            const C = 2 * Math.PI * radius;
            const frac = Math.max(0, Math.min(1, r.value / r.max));
            return (
              <g key={r.label}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgb(var(--surface))" strokeWidth={thickness} />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={r.color}
                  strokeWidth={thickness}
                  strokeDasharray={`${frac * C} ${C}`}
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </g>
        {center && (
          <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fontSize={13} fontWeight={600} fill="rgb(var(--ink))">
            {center}
          </text>
        )}
      </svg>
      <div className="space-y-2">
        {rings.map((r) => (
          <div key={r.label} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
            <span className="text-sub">{r.label}</span>
            <span className="ml-auto font-mono text-ink">{r.value.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
