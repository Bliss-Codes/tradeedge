"use client";

import { useMemo, useState } from "react";
import { useApp, useVisibleTrades, useDisplayCurrency, CapitalStage, stageOf } from "@/stores/useApp";
import { isoWeekKey, dedupeBySetup, setupCounts } from "@/lib/metrics";
import {
  computeStats,
  type Stats,
  equityCurve,
  fmtPF,
  fmtPct,
  fmtR,
  fmtMoney,
  statsByGroup,
  tagCombos,
  executionSummary,
  executionFindings,
  ruleAdherence,
  adherenceTrend,
  statsByHour,
  distribution,
  winLossSummary,
  avgPlannedRR,
  breakevenMisses,
  filterByMoneyScope,
  moneySplit,
  MoneyScope,
  monthlyPerformance,
  signColor,
} from "@/lib/metrics";
import type { MonthlyYearRow } from "@/lib/metrics";
import { Card, EmptyState, SectionTitle, Stat, Tabs, Select } from "@/components/ui/primitives";
import { GroupTable } from "@/components/ui/GroupTable";
import { EdgeCheck } from "@/components/analytics/EdgeCheck";
import { KpiRadar, KpiAxis } from "@/components/charts/KpiRadar";
import { RHistogram, Donut } from "@/components/charts/Primitives";
import { RingCompare } from "@/components/charts/WinnersLosers";
import { TimeMatrix, DayOfWeek, TradeFrequency } from "@/components/charts/Timing";
import { YearHeatmap } from "@/components/charts/YearHeatmap";
import { DisciplineQuadrant, QuadrantPoint } from "@/components/charts/DisciplineQuadrant";
import { EquityCurve, BarRow } from "@/components/charts/EquityCurve";
import { SessionRadar } from "@/components/charts/SessionRadar";
import { GRADES, EXIT_REASONS, QUALITY_LABELS, SESSIONS, outcomeOf } from "@/lib/types";
import { availableBreakdownFields, fieldValueByName, strategyMap } from "@/lib/fields";

const TABS = [
  "Overview",
  "Breakdowns",
  "Timing",
  "Exits",
  "Quality",
  "Pairs",
  "Sessions",
  "Strategies",
  "Accounts",
  "Tags",
  "Grades",
  "Execution",
  "Violations",
];

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function hourLabel(h: number): string {
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h).padStart(2, "0")}:00 · ${h12} ${ampm}`;
}

function MonthlyGrid({ rows, currency, startingBalance }: { rows: MonthlyYearRow[]; currency: string; startingBalance?: number }) {
  const [mode, setMode] = useState<"money" | "pct">(startingBalance ? "pct" : "money");
  if (rows.length === 0) return <div className="py-8 text-center text-sm text-mute">No trades to chart by month yet.</div>;

  const cell = (val: number | null, pct: number | null) => {
    if (val === null) return <div className="rounded-lg border border-edge/60 bg-surface/30 px-2 py-2 text-center text-xs text-mute">—</div>;
    const show = mode === "pct" && pct !== null ? `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%` : fmtMoney(val, currency);
    const tone = val > 0 ? "bg-pos/10 text-pos" : val < 0 ? "bg-neg/10 text-neg" : "bg-surface/40 text-mute";
    return <div className={`rounded-lg px-2 py-2 text-center text-xs font-medium ${tone}`}>{show}</div>;
  };

  return (
    <div>
      {startingBalance ? (
        <div className="mb-3 flex gap-1 text-xs">
          <button onClick={() => setMode("pct")} className={`rounded-lg px-2.5 py-1 transition-colors ${mode === "pct" ? "bg-accent text-bg" : "border border-edge text-mute hover:text-sub"}`}>% return</button>
          <button onClick={() => setMode("money")} className={`rounded-lg px-2.5 py-1 transition-colors ${mode === "money" ? "bg-accent text-bg" : "border border-edge text-mute hover:text-sub"}`}>{currency}</button>
        </div>
      ) : (
        <p className="mb-3 text-[11px] text-mute">Set a starting balance on the account to see % returns.</p>
      )}
      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="mb-1.5 grid grid-cols-[56px_repeat(12,1fr)_72px] gap-1.5">
            <div />
            {MONTH_LABELS.map((m) => <div key={m} className="text-center text-[10px] font-medium uppercase tracking-wider text-mute">{m}</div>)}
            <div className="text-center text-[10px] font-medium uppercase tracking-wider text-mute">Year</div>
          </div>
          {rows.map((r) => (
            <div key={r.year} className="mb-1.5 grid grid-cols-[56px_repeat(12,1fr)_72px] items-stretch gap-1.5">
              <div className="flex items-center justify-center rounded-lg border border-edge bg-surface/40 text-xs font-semibold text-ink">{r.year}</div>
              {r.months.map((v, i) => <div key={i}>{cell(v, r.pctMonths[i])}</div>)}
              <div className={`flex items-center justify-center rounded-lg text-xs font-semibold ${r.total > 0 ? "bg-pos/15 text-pos" : r.total < 0 ? "bg-neg/15 text-neg" : "bg-surface/40 text-mute"}`}>
                {mode === "pct" && startingBalance ? `${r.totalPct >= 0 ? "+" : ""}${r.totalPct.toFixed(1)}%` : fmtMoney(r.total, currency)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WLList({ rows }: { rows: [string, string][] }) {
  return (
    <div className="mt-1 divide-y divide-edge/50">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between py-2 text-sm">
          <span className="text-mute">{k}</span>
          <span className="font-mono font-semibold text-ink">{v}</span>
        </div>
      ))}
    </div>
  );
}


/** Weekly discipline rating (1–5, from Reviews) side by side with that week's R. */
function DisciplineTrend() {
  const reviews = useApp((s) => s.reviews);
  const trades = useVisibleTrades();

  const rows = useMemo(() => {
    const weekly = reviews.filter((r) => r.scope === "week" && r.disciplineRating !== undefined);
    if (weekly.length === 0) return [];
    const rByWeek = new Map<string, number>();
    for (const t of trades) {
      const k = isoWeekKey(new Date(t.date));
      rByWeek.set(k, (rByWeek.get(k) ?? 0) + t.rr);
    }
    return weekly
      .map((r) => ({ week: r.date, rating: r.disciplineRating as number, r: rByWeek.get(r.date) ?? 0 }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-12);
  }, [reviews, trades]);

  if (rows.length === 0) return null;
  const maxAbsR = Math.max(1, ...rows.map((x) => Math.abs(x.r)));

  return (
    <Card>
      <SectionTitle action={<span className="text-xs text-mute">last {rows.length} rated week{rows.length === 1 ? "" : "s"}</span>}>
        Discipline vs performance
      </SectionTitle>
      <div className="space-y-1">
        {rows.map((x) => (
          <div key={x.week} className="flex items-center gap-3 py-1">
            <div className="w-20 shrink-0 font-mono text-xs text-mute">{x.week}</div>
            <div className="flex w-24 shrink-0 gap-1" title={`Discipline ${x.rating}/5`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={`h-2.5 w-2.5 rounded-sm ${n <= x.rating ? (x.rating >= 4 ? "bg-pos" : x.rating >= 3 ? "bg-warn" : "bg-neg") : "bg-surface"}`} />
              ))}
            </div>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface">
              <div
                className="absolute top-0 h-full rounded-full"
                style={{
                  left: x.r >= 0 ? "50%" : `${50 - (Math.abs(x.r) / maxAbsR) * 50}%`,
                  width: `${(Math.abs(x.r) / maxAbsR) * 50}%`,
                  backgroundColor: x.r >= 0 ? "rgb(var(--pos))" : "rgb(var(--neg))",
                }}
              />
              <div className="absolute left-1/2 top-0 h-full w-px bg-edge" />
            </div>
            <div className={`w-16 shrink-0 text-right font-mono text-xs ${signColor(x.r)}`}>{fmtR(x.r)}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-mute">Rate each week in Reviews — over time this shows whether your green weeks are also your disciplined ones.</p>
    </Card>
  );
}


/** The six KPIs that define the prop-trading sweet spot, as one shape. */
function KpiScorecard() {
  const trades = useVisibleTrades();
  const stats = useMemo(() => computeStats(dedupeBySetup(trades)), [trades]);
  const adherence = useMemo(() => ruleAdherence(trades), [trades]);
  const thesisRate = useMemo(
    () => (trades.length ? (trades.filter((t) => (t.thesis ?? "").trim()).length / trades.length) * 100 : 0),
    [trades]
  );

  if (trades.length === 0) return null;

  const wins = trades.filter((t) => t.pnl > 0);
  const avgWinR = wins.length ? wins.reduce((s, t) => s + Math.abs(t.rr), 0) / wins.length : 0;

  const axes: KpiAxis[] = [
    { key: "exp", label: "Expectancy", value: Math.max(0, stats.avgRR), target: 0.3, max: 1.0, format: (v) => `${v.toFixed(2)}R` },
    { key: "wr", label: "Win rate", value: stats.winRate, target: 45, max: 70, format: (v) => `${v.toFixed(0)}%` },
    { key: "rr", label: "Avg winner", value: avgWinR, target: 2, max: 4, format: (v) => `${v.toFixed(1)}R` },
    { key: "pf", label: "Profit factor", value: Math.min(stats.profitFactor, 4), target: 1.5, max: 3, format: (v) => v.toFixed(2) },
    { key: "adh", label: "Adherence", value: adherence, target: 90, max: 100, format: (v) => `${v.toFixed(0)}%` },
    { key: "th", label: "Thesis rate", value: thesisRate, target: 100, max: 100, format: (v) => `${v.toFixed(0)}%` },
  ];

  return (
    <Card>
      <SectionTitle action={<span className="text-xs text-mute">vs prop sweet spot</span>}>KPI scorecard</SectionTitle>
      <div className="mx-auto max-w-md">
        <KpiRadar axes={axes} />
      </div>
      <p className="mt-2 text-[11px] text-mute">
        Dashed ring is the target. Any point inside it is the KPI to work on next.
      </p>
    </Card>
  );
}


/** Weekly discipline vs weekly R, quadrant-shaded. */
function DisciplineScatter() {
  const reviews = useApp((s) => s.reviews);
  const trades = useVisibleTrades();
  const points = useMemo<QuadrantPoint[]>(() => {
    const rByWeek = new Map<string, number>();
    for (const t of trades) {
      const k = isoWeekKey(new Date(t.date));
      rByWeek.set(k, (rByWeek.get(k) ?? 0) + t.rr);
    }
    return reviews
      .filter((r) => r.scope === "week" && r.disciplineRating !== undefined)
      .map((r) => ({ label: r.date, x: r.disciplineRating as number, y: rByWeek.get(r.date) ?? 0 }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [reviews, trades]);

  if (points.length === 0) return null;

  return (
    <Card>
      <SectionTitle action={<span className="text-xs text-mute">{points.length} rated weeks</span>}>Does discipline pay?</SectionTitle>
      <DisciplineQuadrant points={points} />
      <p className="mt-2 text-[11px] text-mute">
        If the dots trend up-right, your process — not the market — is what pays you.
      </p>
    </Card>
  );
}


/** Compact dropdown styled as a pill — quiet until active. */
function FilterPill({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
}) {
  const active = Boolean(value);
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none rounded-full border py-1.5 pl-3.5 pr-8 text-xs outline-none transition ${
          active ? "border-accent/60 bg-accent/10 text-accent" : "border-edge bg-card text-sub hover:border-mute/50"
        }`}
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {v === "" || v === "all" ? label : l}
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}

/** Active-filter chip with an inline clear. */
function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-[11px] text-sub">
      {label}
      <button onClick={onClear} className="text-mute transition hover:text-neg" aria-label={`Clear ${label}`}>
        ×
      </button>
    </span>
  );
}


/** Inline stat for chart-card headers. */
function HeadStat({
  label,
  value,
  tone,
  sup,
  delta,
}: {
  label: string;
  value: string;
  tone?: number;
  sup?: string;
  delta?: number;
}) {
  return (
    <div>
      <div className="text-xs text-mute">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className={`font-mono text-2xl font-semibold ${tone !== undefined ? signColor(tone) : "text-ink"}`}>
          {value}
          {sup && <span className="ml-1 align-super text-[11px] font-normal text-mute">{sup}</span>}
        </span>
        {delta !== undefined && Number.isFinite(delta) && (
          <span className={`text-xs ${delta >= 0 ? "text-pos" : "text-neg"}`}>
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(2)}%
          </span>
        )}
      </div>
    </div>
  );
}

/** Compact metric card with a sparkline sitting flush at the bottom. */
function MiniMetric({
  label,
  value,
  rightLabel,
  rightValue,
  series,
  note,
}: {
  label: string;
  value: string;
  rightLabel: string;
  rightValue: string;
  series: number[];
  note?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-edge bg-card pt-4">
      <div className="flex items-start justify-between px-4">
        <div>
          <div className="text-[11px] text-mute">{label}</div>
          <div className="mt-1 font-mono text-2xl font-semibold text-ink">{value}</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-mute">{rightLabel}</div>
          <div className="mt-1 font-mono text-sm text-sub">{rightValue}</div>
        </div>
      </div>
      {note && <div className="mt-2 px-4 text-[11px] leading-snug text-mute">{note}</div>}
      {series.length > 1 && (
        <div className="mt-2">
          <MiniArea values={series} />
        </div>
      )}
      {series.length <= 1 && <div className="h-4" />}
    </div>
  );
}

/** Edge-to-edge area sparkline for MiniMetric. */
function MiniArea({ values, height = 46 }: { values: number[]; height?: number }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const W = 300;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * W, height - ((v - min) / range) * (height - 6) - 3]);
  const line = pts.map((p) => `${p[0]},${p[1]}`).join(" ");
  const area = `${line} ${W},${height} 0,${height}`;
  return (
    <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" className="block w-full" style={{ height }}>
      <polygon points={area} fill="rgb(var(--accent) / 0.12)" />
      <polyline points={line} fill="none" stroke="rgb(var(--accent))" strokeWidth={1.75} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}


/** Profit-factor ring. Fills proportionally up to 3.0 so the arc means something
 *  (the reference's version was an empty circle showing nothing). */
function PFRing({ value, size = 74 }: { value: number; size?: number }) {
  const R = (size - 9) / 2;
  const C = 2 * Math.PI * R;
  const frac = Math.max(0, Math.min(1, (Number.isFinite(value) ? value : 3) / 3));
  const color = value >= 1.5 ? "rgb(var(--pos))" : value >= 1 ? "rgb(var(--warn))" : "rgb(var(--neg))";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" role="img" aria-label="profit factor">
      <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke="rgb(var(--surface))" strokeWidth={7} />
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={`${frac * C} ${C}`}
        />
      </g>
    </svg>
  );
}

type CountMode = "By setup" | "By execution";

export default function AnalyticsPage() {
  const [countMode, setCountMode] = useState<CountMode>("By setup");
  const [curveMode, setCurveMode] = useState<"Money" | "R">("Money");
  /** Challenge money is notional; funded money is real. Never blend them. */
  const [stage, setStage] = useState<CapitalStage>("all");
  const allAccounts = useApp((s) => s.accounts);
  const allTradesRaw = useApp((s) => s.trades);
  /** True when live trades exist on both challenge and funded accounts. */
  /** Live trade counts per stage, shown on the pills so a differing headline
   *  count reads as scope rather than a bug. */
  const stageCounts = useMemo(() => {
    const c: Record<CapitalStage, number> = { all: 0, funded: 0, challenge: 0 };
    for (const t of allTradesRaw) {
      if (t.type !== "live") continue;
      const acct = allAccounts.find((a) => a.id === t.accountId && !a.archived);
      if (!acct) continue;
      c.all++;
      const st = stageOf(acct.type);
      if (st === "funded") c.funded++;
      else if (st === "challenge") c.challenge++;
    }
    return c;
  }, [allTradesRaw, allAccounts]);
  const allLiveCount = useMemo(
    () => allTradesRaw.filter((t) => t.type === "live").length,
    [allTradesRaw]
  );
  const mixedStages = useMemo(() => {
    const stages = new Set<string>();
    for (const t of allTradesRaw) {
      if (t.type !== "live") continue;
      const acct = allAccounts.find((a) => a.id === t.accountId && !a.archived);
      if (!acct) continue;
      const st = stageOf(acct.type);
      if (st === "funded" || st === "challenge") stages.add(st);
    }
    return stages.size > 1;
  }, [allTradesRaw, allAccounts]);
  // Challenge P&L is score, funded P&L is income. Default to real money so the
  // dollar figures on this page always mean withdrawable profit.
  const [moneyScope, setMoneyScope] = useState<MoneyScope>("Real money");
  const accounts = useApp((s) => s.accounts);
  const rawVisible = useVisibleTrades("live", stage);
  const counts = useMemo(() => setupCounts(rawVisible), [rawVisible]);
  const hasLinked = counts.executions !== counts.setups;
  // Edge metrics must count IDEAS, not fills — otherwise the same setup taken on
  // 3 accounts inflates the sample 3x and overstates confidence in the edge.
  const scoped = useMemo(() => filterByMoneyScope(rawVisible, accounts, moneyScope), [rawVisible, accounts, moneyScope]);
  const split = useMemo(() => moneySplit(rawVisible, accounts), [rawVisible, accounts]);
  const visible = useMemo(
    () => (countMode === "By setup" ? dedupeBySetup(scoped) : scoped),
    [scoped, countMode]
  );
  const currency = useDisplayCurrency();
  const strategies = useApp((s) => s.strategies);
  const [tab, setTab] = useState("Overview");
  const [comboSize, setComboSize] = useState("All");

  // Horizontal filter bar — applies to every tab.
  const [fRange, setFRange] = useState("all");
  const [fStrategy, setFStrategy] = useState("");
  const [fSession, setFSession] = useState("");
  const [fSide, setFSide] = useState("");
  const [fOutcome, setFOutcome] = useState("");

  const trades = useMemo(() => {
    const days = fRange === "all" ? Infinity : parseInt(fRange, 10);
    const cutoff = days === Infinity ? -Infinity : Date.now() - days * 86400000;
    return visible.filter((t) => {
      if (fStrategy && t.strategyId !== fStrategy) return false;
      if (fSession && t.session !== fSession) return false;
      if (fSide && t.direction !== fSide) return false;
      if (fOutcome && outcomeOf(t) !== fOutcome) return false;
      if (new Date(t.date).getTime() < cutoff) return false;
      return true;
    });
  }, [visible, fRange, fStrategy, fSession, fSide, fOutcome]);

  const stats = useMemo(() => computeStats(trades), [trades]);
  /** Running series + averages powering the RR strip. */
  const planned = useMemo(() => avgPlannedRR(trades), [trades]);
  const beMiss = useMemo(() => breakevenMisses(trades), [trades]);
  const { rrSeries, winSeries, avgWinR, avgLossR } = useMemo(() => {
    const ordered = [...trades].sort((a, b) => a.date.localeCompare(b.date));
    const rrSeries: number[] = [];
    let sum = 0;
    ordered.forEach((t, i) => { sum += t.rr; rrSeries.push(sum / (i + 1)); });
    const wins = ordered.filter((t) => t.pnl > 0);
    const losses = ordered.filter((t) => t.pnl < 0);
    const avgWinR = wins.length ? wins.reduce((a, t) => a + Math.abs(t.rr), 0) / wins.length : 0;
    const avgLossR = losses.length ? losses.reduce((a, t) => a + Math.abs(t.rr), 0) / losses.length : 1;
    let ws = 0;
    const winSeries = wins.map((t, i) => { ws += Math.abs(t.rr); return ws / (i + 1); });
    return { rrSeries, winSeries, avgWinR, avgLossR };
  }, [trades]);
  const curve = useMemo(() => equityCurve(trades, curveMode === "R" ? "rr" : "pnl"), [trades, curveMode]);
  const wl = useMemo(() => winLossSummary(trades), [trades]);
  const expectancyMoney = useMemo(
    () => (trades.length ? trades.reduce((a, t) => a + t.pnl, 0) / trades.length : 0),
    [trades]
  );
  const grossSplit = useMemo(() => {
    const total = wl.grossWinPnl - wl.grossLossPnl;
    return total > 0 ? (wl.grossWinPnl / total) * 100 : 50;
  }, [wl]);
  /** Long/short counts and win rates, shared by the by-side visuals. */
  const sideSplit = useMemo(() => {
    const wr = (list: typeof trades) => {
      const decided = list.filter((t) => t.pnl !== 0);
      return decided.length ? (decided.filter((t) => t.pnl > 0).length / decided.length) * 100 : 0;
    };
    const longs = trades.filter((t) => t.direction === "long");
    const shorts = trades.filter((t) => t.direction === "short");
    return { longN: longs.length, shortN: shorts.length, longWR: wr(longs), shortWR: wr(shorts) };
  }, [trades]);
  const winMoney = useMemo(() => trades.filter((t) => t.pnl > 0).reduce((s2, t) => s2 + t.pnl, 0), [trades]);
  const lossMoney = useMemo(() => trades.filter((t) => t.pnl < 0).reduce((s2, t) => s2 + t.pnl, 0), [trades]);
  const startingBalance = useMemo(() => {
    // Only accounts in the selected capital stage count — showing funded
    // analytics against combined funded+challenge capital is meaningless.
    const active = accounts.filter((a) => !a.archived && (stage === "all" || stageOf(a.type) === stage));
    if (fStrategy === "" && fSession === "" && fSide === "" && fOutcome === "") {
      const sel = useApp.getState().selectedAccountId;
      if (sel !== "all") {
        const acct = accounts.find((a) => a.id === sel);
        if (!acct) return undefined;
        return stage === "all" || stageOf(acct.type) === stage ? acct.balance : undefined;
      }
      return active.reduce((s2, a) => s2 + (a.balance || 0), 0) || undefined;
    }
    return undefined;
  }, [accounts, stage, fStrategy, fSession, fSide, fOutcome]);
  /** Account balance and its % change, for the chart header. */
  const balance = startingBalance !== undefined ? startingBalance + stats.netPnl : undefined;
  const pctChange = startingBalance ? (stats.netPnl / startingBalance) * 100 : undefined;
  const monthly = useMemo(() => monthlyPerformance(trades, startingBalance), [trades, startingBalance]);
  const monthlyCurrency = useDisplayCurrency();
  const bySide = useMemo(
    () => statsByGroup(trades, (t) => (t.direction === "long" ? "Long" : "Short")),
    [trades]
  );

  const byPair = useMemo(() => statsByGroup(trades, (t) => t.pair), [trades]);
  const bySession = useMemo(() => statsByGroup(trades, (t) => t.session), [trades]);
  const radarPoints = (pick: (st: Stats) => number, fmt: (v: number) => string) =>
    SESSIONS.map((s) => {
      const row = bySession.find((r) => r.key === s);
      const st = row?.stats;
      const value = st ? pick(st) : 0;
      return { session: s, value, label: fmt(value), total: st?.total ?? 0 };
    });
  const byStrategy = useMemo(
    () => statsByGroup(trades, (t) => (t.strategyId ? strategies.find((s) => s.id === t.strategyId)?.name ?? "Unknown" : "No strategy")),
    [trades, strategies]
  );
  const byAccount = useMemo(
    () => statsByGroup(trades, (t) => accounts.find((a) => a.id === t.accountId)?.name ?? "Unknown"),
    [trades, accounts]
  );
  const combos = useMemo(() => tagCombos(trades, 2), [trades]);
  const filteredCombos = useMemo(() => {
    if (comboSize === "All") return combos.slice(0, 40);
    const n = comboSize === "Single tags" ? 1 : comboSize === "Pairs of tags" ? 2 : 3;
    return combos.filter((c) => c.key.split(" + ").length === n).slice(0, 40);
  }, [combos, comboSize]);

  const byGrade = useMemo(() => {
    const order = new Map(GRADES.map((g, i) => [g as string, i]));
    return statsByGroup(trades, (t) => t.grade).sort((a, b) => (order.get(a.key) ?? 9) - (order.get(b.key) ?? 9));
  }, [trades]);
  const exec = useMemo(() => executionSummary(trades), [trades]);
  const execFindings = useMemo(() => executionFindings(trades), [trades]);

  const byId = useMemo(() => strategyMap(strategies), [strategies]);
  const breakdownFields = useMemo(() => availableBreakdownFields(trades, strategies), [trades, strategies]);
  const [breakdownField, setBreakdownField] = useState<string>("");
  const activeField = breakdownField || breakdownFields[0] || "";
  const byField = useMemo(
    () => (activeField ? statsByGroup(trades, (t) => fieldValueByName(t, activeField, byId)) : []),
    [trades, activeField, byId]
  );
  const byHour = useMemo(() => statsByHour(trades), [trades]);
  const exitDist = useMemo(() => distribution(trades, (t) => t.exitReason), [trades]);
  const byQuality = useMemo(() => {
    return statsByGroup(trades, (t) => (t.qualityScore ? String(t.qualityScore) : undefined)).sort((a, b) => Number(a.key) - Number(b.key));
  }, [trades]);
  const adherence = useMemo(() => ruleAdherence(trades), [trades]);
  const adherenceWeekly = useMemo(() => adherenceTrend(trades, "week", 10), [trades]);
  const adherenceMonthly = useMemo(() => adherenceTrend(trades, "month", 6), [trades]);

  const violationRows = useMemo(() => {
    const withV = trades.filter((t) => t.violations.length > 0);
    const rows = statsByGroup(
      withV.flatMap((t) => t.violations.map((v) => ({ ...t, _v: v }))),
      (t) => (t as { _v?: string })._v
    );
    return rows.sort((a, b) => a.stats.netPnl - b.stats.netPnl);
  }, [trades]);

  const cleanStats = useMemo(() => computeStats(trades.filter((t) => t.violations.length === 0)), [trades]);
  const dirtyStats = useMemo(() => computeStats(trades.filter((t) => t.violations.length > 0)), [trades]);

  return (
    <div className="space-y-6">
      {/* Compact pill filters — chips below show only what's active, so the
          bar stays quiet until you use it. */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-full border border-edge p-0.5">
          {([
            ["all", "All"],
            ["funded", "Funded"],
            ["challenge", "Challenge"],
          ] as [CapitalStage, string][]).map(([v, l]) => (
            <button
              key={v}
              onClick={() => setStage(v)}
              className={`rounded-full px-3 py-1 text-xs transition ${
                stage === v ? "bg-surface text-ink" : "text-mute hover:text-sub"
              }`}
            >
              {l}
              {stageCounts[v] > 0 && <span className="ml-1.5 font-mono opacity-60">{stageCounts[v]}</span>}
            </button>
          ))}
        </div>
        <FilterPill label="Range" value={fRange === "all" ? "" : `${fRange}d`} onChange={setFRange}
          options={[["all", "All time"], ["7", "7 days"], ["30", "30 days"], ["90", "90 days"], ["365", "1 year"]]} />
        <FilterPill label="Strategy" value={fStrategy} onChange={setFStrategy}
          options={[["", "All strategies"], ...strategies.map((x) => [x.id, x.name] as [string, string])]} />
        <FilterPill label="Session" value={fSession} onChange={setFSession}
          options={[["", "All sessions"], ...SESSIONS.map((x) => [x, x] as [string, string])]} />
        <FilterPill label="Side" value={fSide} onChange={setFSide}
          options={[["", "Long & short"], ["long", "Long"], ["short", "Short"]]} />
        <FilterPill label="Outcome" value={fOutcome} onChange={setFOutcome}
          options={[["", "All outcomes"], ["win", "Wins"], ["loss", "Losses"], ["be", "Breakeven"]]} />

        <FilterPill label="Money" value={moneyScope === "All" ? "" : moneyScope} onChange={(v) => setMoneyScope((v || "All") as MoneyScope)}
          options={[["Real money", "Real money only"], ["Challenge", "Challenge only"], ["", "All accounts"]]} />

        <div className="ml-auto flex items-center gap-3">
          <span className="font-mono text-xs text-mute">{trades.length} trades</span>
          {hasLinked && (
            <Tabs tabs={["By setup", "By execution"]} active={countMode} onChange={(v) => setCountMode(v as CountMode)} />
          )}
        </div>
      </div>

      {(fRange !== "all" || fStrategy || fSession || fSide || fOutcome) && (
        <div className="-mt-3 flex flex-wrap items-center gap-1.5">
          {fRange !== "all" && <FilterChip label={`last ${fRange} days`} onClear={() => setFRange("all")} />}
          {fStrategy && <FilterChip label={strategies.find((x) => x.id === fStrategy)?.name ?? "strategy"} onClear={() => setFStrategy("")} />}
          {fSession && <FilterChip label={fSession} onClear={() => setFSession("")} />}
          {fSide && <FilterChip label={fSide} onClear={() => setFSide("")} />}
          {fOutcome && <FilterChip label={fOutcome} onClear={() => setFOutcome("")} />}
          <button
            onClick={() => { setFRange("all"); setFStrategy(""); setFSession(""); setFSide(""); setFOutcome(""); }}
            className="ml-1 text-[11px] text-mute underline-offset-2 hover:text-sub hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {split.challengeTrades > 0 && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-edge bg-surface/40 px-4 py-2.5 text-xs">
          <span className="text-mute">
            {moneyScope === "Real money"
              ? "Showing withdrawable profit only — challenge trades excluded."
              : moneyScope === "Challenge"
              ? "Showing evaluation accounts only — this P&L is score, not money."
              : "Showing everything — dollar totals mix real profit with challenge score."}
          </span>
          <span className="ml-auto flex items-center gap-4 font-mono">
            <span className={signColor(split.realPnl)}>
              real {fmtMoney(split.realPnl, currency)}
              <span className="ml-1 text-[10px] text-mute">({split.realTrades})</span>
            </span>
            <span className="text-mute">
              challenge {fmtMoney(split.challengePnl, currency)}
              <span className="ml-1 text-[10px]">({split.challengeTrades})</span>
            </span>
          </span>
        </div>
      )}

      {stage === "all" && mixedStages && (
        <div className="rounded-xl border border-warn/40 bg-warn/[0.06] px-4 py-3 text-xs text-sub">
          <span className="font-medium text-warn">Mixed capital stages.</span> Challenge P&amp;L is notional — you never
          receive it, and it is usually traded at a different risk %. Blending it with funded money makes the equity
          curve and every money stat misleading. Switch to <span className="font-medium">Funded</span> for real earnings,
          or <span className="font-medium">Challenge</span> to review pass attempts. R-based stats stay comparable either way.
        </div>
      )}

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {hasLinked && countMode === "By setup" && (
        <p className="-mt-2 text-[11px] text-mute">
          Counting each idea once. The same setup taken on multiple accounts is one data point — money totals still count every fill.
        </p>
      )}

      {trades.length === 0 ? (
        <EmptyState
          title={
            allLiveCount === 0
              ? "Nothing to analyze yet"
              : rawVisible.length === 0
              ? "No trades in this view"
              : "No trades match these filters"
          }
          body={
            allLiveCount === 0
              ? "Once you've logged trades, this page breaks down what's working — by pair, session, strategy, tag, and rule discipline."
              : rawVisible.length === 0
              ? `You have ${allLiveCount} logged trade${allLiveCount === 1 ? "" : "s"}, but none in the current account or capital stage. Check the account selector above and the All/Funded/Challenge switch.`
              : `${rawVisible.length} trade${rawVisible.length === 1 ? "" : "s"} in view, but the filters exclude them all. Clear the filter chips above.`
          }
        />
      ) : (
      <>
      {tab === "Overview" && (
        <div className="space-y-6">
          <Card>
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-ink">Profit and loss</h3>
                <p className="text-xs text-mute">
                  {stage === "funded"
                    ? "funded accounts only — real money"
                    : stage === "challenge"
                    ? "challenge accounts only — notional"
                    : mixedStages
                    ? "all accounts — funded and challenge combined"
                    : "over time"}
                </p>
              </div>
              <div className="flex rounded-lg border border-edge p-0.5">
                {(["Money", "R"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setCurveMode(m)}
                    className={`rounded-md px-3 py-1 text-xs transition ${
                      curveMode === m ? "bg-surface text-ink" : "text-mute hover:text-sub"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {/* Stats live in the chart header rather than separate cards — fewer
                boxes, and the numbers sit next to the shape that produced them. */}
            {/* Only headline account figures live here — profit factor,
                expectancy and RR each have their own card below. */}
            <div className="mb-5 grid grid-cols-2 justify-items-start gap-x-4 gap-y-5 border-b border-edge/60 pb-5 sm:grid-cols-5">
              <HeadStat label="Net P&L" value={fmtMoney(stats.netPnl, currency)} delta={pctChange} />
              <HeadStat label="Account balance" value={balance !== undefined ? fmtMoney(balance, currency) : "—"} delta={pctChange} />
              <HeadStat label="Win rate" value={fmtPct(stats.winRate)} />
              <HeadStat label="Total trades" value={String(stats.total)} sup={`${stats.wins}/${stats.losses}`} />
              <HeadStat label="Breakeven trades" value={String(stats.breakevens)} />
            </div>
            <EquityCurve points={curve} mode={curveMode === "R" ? "R" : "money"} currency={currency} />
          </Card>

          {/* RR analytics strip — mirrors the inspiration's compact metric row. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MiniMetric
              label="Avg planned RR"
              value={planned.n ? planned.avg.toFixed(2) : "—"}
              rightLabel="Realized on winners"
              rightValue={`${avgWinR.toFixed(2)}R`}
              series={rrSeries}
              note={
                planned.n
                  ? `${planned.n} with a target set · winners deliver ${((avgWinR / (planned.avg || 1)) * 100).toFixed(0)}% of what you plan`
                  : "Set entry, stop and target to track this"
              }
            />
            <MiniMetric
              label="Avg winner"
              value={`${avgWinR.toFixed(2)}R`}
              rightLabel="Avg loser"
              rightValue={`${avgLossR.toFixed(2)}R`}
              series={winSeries}
              note={`best ${stats.largestWin.toFixed(2)}R`}
            />
            <MiniMetric
              label="Could have been BE"
              value={beMiss.withData ? String(beMiss.count) : "—"}
              rightLabel="Peak reached"
              rightValue={beMiss.count ? `${beMiss.maxPeakR.toFixed(2)}R` : "—"}
              series={[]}
              note={
                beMiss.withData === 0
                  ? "Log peak R on losing trades to track this"
                  : beMiss.count
                  ? `${beMiss.rSaved.toFixed(1)}R lost that a BE stop would have saved · avg peak ${beMiss.avgPeakR.toFixed(2)}R`
                  : "No loser ran 1R in profit first — stops are placed well"
              }
            />
          </div>

          {/* Expectancy & profit factor — sits directly under the RR strip so the
              headline edge numbers stay together. */}
          <div>
            <SectionTitle>Expectancy &amp; profit factor</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card>
                <div className="flex items-center justify-between gap-5">
                  <div className="min-w-0">
                    <div className="text-[11px] text-mute">Expectancy</div>
                    <div className={`mt-1 font-mono text-2xl font-semibold ${signColor(expectancyMoney)}`}>
                      {fmtMoney(expectancyMoney, currency)}
                    </div>
                    <div className="mt-0.5 text-[11px] text-mute">per trade · {stats.avgRR.toFixed(2)}R</div>
                  </div>
                  <div className="w-1/2 shrink-0">
                    <div className="flex h-2.5 overflow-hidden rounded-full bg-surface">
                      <div className="h-full rounded-l-full" style={{ width: `${grossSplit}%`, background: "linear-gradient(90deg, rgb(var(--pos)/0.6), rgb(var(--pos)))" }} />
                      <div className="h-full rounded-r-full bg-neg" style={{ width: `${100 - grossSplit}%` }} />
                    </div>
                    <div className="mt-1.5 flex justify-between font-mono text-[11px]">
                      <span className="text-pos">{fmtMoney(wl.grossWinPnl, currency)}</span>
                      <span className="text-neg">{fmtMoney(wl.grossLossPnl, currency)}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <div className="text-[11px] text-mute">Profit factor</div>
                    <div className={`mt-1 font-mono text-2xl font-semibold ${stats.profitFactor >= 1.5 ? "text-pos" : stats.profitFactor >= 1 ? "text-warn" : "text-neg"}`}>
                      {fmtPF(stats.profitFactor)}
                    </div>
                    <div className="mt-0.5 text-[11px] text-mute">
                      {stats.profitFactor >= 2 ? "strong" : stats.profitFactor >= 1.5 ? "good" : stats.profitFactor >= 1 ? "marginal" : "losing"} · target 1.5+
                    </div>
                  </div>
                  <PFRing value={stats.profitFactor} />
                </div>
              </Card>
            </div>
          </div>

          {/* Winners vs losers */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card className="border-pos/40 bg-pos/[0.03]">
              <SectionTitle action={<span className="font-mono text-sm text-pos">{fmtMoney(winMoney, currency)}</span>}>Winners</SectionTitle>
              <WLList
                rows={[
                  ["Total winners", String(wl.winners)],
                  ["Best win", fmtR(wl.bestWinR)],
                  ["Average win", `${wl.avgWinR.toFixed(2)}R`],
                  ["Avg win P&L", fmtMoney(wl.avgWinPnl, currency)],
                  ["Max consecutive wins", String(wl.maxConsecutiveWins)],
                  ["Avg consecutive wins", wl.avgConsecutiveWins.toFixed(2)],
                ]}
              />
            </Card>
            <Card className="border-neg/40 bg-neg/[0.03]">
              <SectionTitle action={<span className="font-mono text-sm text-neg">{fmtMoney(lossMoney, currency)}</span>}>Losers</SectionTitle>
              <WLList
                rows={[
                  ["Total losers", String(wl.losers)],
                  ["Worst loss", fmtR(wl.worstLossR)],
                  ["Average loss", `${wl.avgLossR.toFixed(2)}R`],
                  ["Avg loss P&L", fmtMoney(wl.avgLossPnl, currency)],
                  ["Max consecutive losses", String(wl.maxConsecutiveLosses)],
                  ["Avg consecutive losses", wl.avgConsecutiveLosses.toFixed(2)],
                ]}
              />
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <KpiScorecard />
            <DisciplineScatter />
          </div>

          <EdgeCheck trades={rawVisible} />

          <div>
            <SectionTitle>Performance by side</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card>
                <div className="mb-3 text-sm font-medium text-sub">Trade split</div>
                <Donut
                  slices={[
                    { label: "Long", value: sideSplit.longN, color: "rgb(var(--pos))" },
                    { label: "Short", value: sideSplit.shortN, color: "rgb(var(--accent))" },
                  ]}
                  center={{ value: String(sideSplit.longN + sideSplit.shortN), label: "trades" }}
                />
              </Card>
              <Card>
                <div className="mb-3 text-sm font-medium text-sub">Win rate by side</div>
                <RingCompare
                  rings={[
                    { label: "Long", value: sideSplit.longWR, max: 100, color: "rgb(var(--pos))" },
                    { label: "Short", value: sideSplit.shortWR, max: 100, color: "rgb(var(--accent))" },
                  ]}
                  center={`${sideSplit.longN}L / ${sideSplit.shortN}S`}
                />
                <p className="mt-3 text-[11px] text-mute">
                  {Math.abs(sideSplit.longWR - sideSplit.shortWR) >= 15 && sideSplit.longN >= 3 && sideSplit.shortN >= 3
                    ? `${sideSplit.longWR > sideSplit.shortWR ? "Longs" : "Shorts"} are winning materially more — worth checking whether the weaker side is worth trading at all.`
                    : "Both sides performing comparably."}
                </p>
              </Card>
            </div>
            <Card className="mt-4">
              <GroupTable rows={bySide} keyLabel="Side" currency={currency} />
            </Card>
          </div>

          <Card>
            <SectionTitle action={<span className="text-xs text-mute">{visible.length} trades</span>}>Outcome distribution</SectionTitle>
            <RHistogram rs={visible.map((t) => t.rr)} />
            <p className="mt-2 text-[11px] text-mute">
              A fat left tail past −1R means stops aren&apos;t holding. A healthy shape clusters losses at −1R and spreads winners right.
            </p>
          </Card>

          <DisciplineTrend />

          <Card>
            <SectionTitle>Performance by month</SectionTitle>
            <MonthlyGrid rows={monthly} currency={monthlyCurrency} startingBalance={startingBalance} />
          </Card>

          <Card>
            <SectionTitle>Performance by session</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SessionRadar title="Win Rate" points={radarPoints((st) => st.winRate, (v) => fmtPct(v))} />
              <SessionRadar title="Total Trades" points={radarPoints((st) => st.total, (v) => String(Math.round(v)))} />
              <SessionRadar title="Avg RR" points={radarPoints((st) => st.avgRR, (v) => `${v.toFixed(2)}R`)} />
              <SessionRadar title="Profit" points={radarPoints((st) => st.netPnl, (v) => fmtMoney(v, currency))} />
            </div>
            <p className="mt-3 text-[11px] text-mute">Sessions set from each trade&apos;s time (UTC = your Accra local time). Full breakdown in the Sessions tab.</p>
          </Card>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card>
              <SectionTitle>Rule adherence — weekly</SectionTitle>
              {adherenceWeekly.length === 0 ? (
                <div className="py-6 text-center text-sm text-mute">Mark trades as followed-plan to build this trend.</div>
              ) : (
                adherenceWeekly.map((p) => (
                  <BarRow key={p.label} label={p.label} value={p.value} max={100} display={`${p.value.toFixed(0)}% · ${p.total}t`} color={p.value >= 70 ? "#22C55E" : p.value >= 50 ? "#F59E0B" : "#EF4444"} />
                ))
              )}
            </Card>
            <Card>
              <SectionTitle>Rule adherence — monthly</SectionTitle>
              {adherenceMonthly.length === 0 ? (
                <div className="py-6 text-center text-sm text-mute">Mark trades as followed-plan to build this trend.</div>
              ) : (
                adherenceMonthly.map((p) => (
                  <BarRow key={p.label} label={p.label} value={p.value} max={100} display={`${p.value.toFixed(0)}% · ${p.total}t`} color={p.value >= 70 ? "#22C55E" : p.value >= 50 ? "#F59E0B" : "#EF4444"} />
                ))
              )}
            </Card>
          </div>
        </div>
      )}

      {tab === "Breakdowns" && (
        <div className="space-y-4">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionTitle>Performance by field</SectionTitle>
              {breakdownFields.length > 0 && (
                <Select value={activeField} onChange={(e) => setBreakdownField(e.target.value)} className="w-auto">
                  {breakdownFields.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </Select>
              )}
            </div>
            <p className="mb-4 text-sm text-mute">
              Group your trades by any field your strategies define — Entry Model, HTF Bias, Zone Type, Trigger, anything. This is how the journal stays methodology-agnostic.
            </p>
            {breakdownFields.length === 0 ? (
              <div className="py-8 text-center text-sm text-mute">
                No custom fields yet. Add fields to a strategy (Strategies → Create → Custom fields, or start from a template) and they&apos;ll show up here.
              </div>
            ) : (
              <>
                <GroupTable rows={byField} keyLabel={activeField} />
                {byField.length > 0 && (
                  <div className="mt-5">
                    <div className="mb-2 text-xs font-medium uppercase tracking-wider text-mute">Net P&L by {activeField}</div>
                    {byField.map((r) => (
                      <BarRow
                        key={r.key}
                        label={r.key}
                        value={Math.abs(r.stats.netPnl)}
                        max={Math.max(...byField.map((x) => Math.abs(x.stats.netPnl)), 1)}
                        display={`${fmtMoney(r.stats.netPnl, currency)} · ${r.stats.total}t`}
                        color={r.stats.netPnl >= 0 ? "#22C55E" : "#EF4444"}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      )}

      {tab === "Timing" && (
        <div className="space-y-6">
          {visible.length === 0 ? (
            <EmptyState title="No timing data yet" body="Each trade's entry timestamp drives this. Log trades to see when your edge actually shows up." />
          ) : (
            <>
              <Card>
                <SectionTitle action={<span className="text-xs text-mute">local time (Accra, UTC+0)</span>}>
                  Performance by time
                </SectionTitle>
                <TimeMatrix trades={visible} currency={currency} />
              </Card>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card>
                  <SectionTitle>Performance by day</SectionTitle>
                  <DayOfWeek trades={visible} currency={currency} />
                </Card>
                <Card>
                  <SectionTitle>Trade frequency</SectionTitle>
                  <TradeFrequency trades={visible} />
                </Card>
              </div>

              <Card>
                <SectionTitle action={<span className="text-xs text-mute">daily net P&amp;L</span>}>Performance calendar</SectionTitle>
                <YearHeatmap trades={visible} currency={currency} />
              </Card>

              {byHour.length > 0 && (
                <Card>
                  <SectionTitle>Net P&amp;L by entry hour</SectionTitle>
                  {byHour.map((h) => (
                    <BarRow
                      key={h.hour}
                      label={hourLabel(h.hour)}
                      value={Math.abs(h.stats.netPnl)}
                      max={Math.max(...byHour.map((x) => Math.abs(x.stats.netPnl)), 1)}
                      display={`${fmtMoney(h.stats.netPnl, currency)} · ${h.stats.total}t`}
                      color={h.stats.netPnl >= 0 ? "rgb(var(--pos))" : "rgb(var(--neg))"}
                    />
                  ))}
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {tab === "Exits" && (
        <div className="space-y-6">
          {exitDist.length === 0 ? (
            <EmptyState title="No exit data yet" body="Set an exit reason on your trades (Take Profit, Stop Loss, Breakeven, Manual, Partial) to see how you close." />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {EXIT_REASONS.map((r) => {
                  const d = exitDist.find((x) => x.key === r);
                  return <Stat key={r} label={r} value={d ? fmtPct(d.pct) : "0%"} hint={d ? `${d.count} trades` : "—"} />;
                })}
              </div>
              <Card>
                <SectionTitle>Exit distribution</SectionTitle>
                {exitDist.map((d) => (
                  <BarRow key={d.key} label={d.key} value={d.pct} max={100} display={`${fmtPct(d.pct)} · ${d.count}t`} color={d.key === "Stop Loss" ? "#EF4444" : d.key === "Take Profit" ? "#22C55E" : "#94A3B8"} />
                ))}
              </Card>
            </>
          )}
        </div>
      )}

      {tab === "Quality" && (
        <Card>
          <SectionTitle>Performance by setup quality score</SectionTitle>
          <p className="mb-4 text-sm text-mute">Higher scores should produce higher expectancy. If a 3 out-earns your 5s, recalibrate what &quot;textbook&quot; means.</p>
          {byQuality.length === 0 ? (
            <div className="py-8 text-center text-sm text-mute">Score setups 1–5 as you log them to populate this.</div>
          ) : (
            <GroupTable rows={byQuality.map((r) => ({ ...r, key: `${r.key} · ${QUALITY_LABELS[Number(r.key)] ?? ""}` }))} keyLabel="Quality score" />
          )}
        </Card>
      )}

      {tab === "Pairs" && (
        <Card>
          <SectionTitle>Performance by pair</SectionTitle>
          <GroupTable rows={byPair} keyLabel="Pair" currency={currency} />
        </Card>
      )}

      {tab === "Sessions" && (
        <div className="space-y-6">
          <Card>
            <SectionTitle>Performance by session</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SessionRadar title="Win Rate" points={radarPoints((st) => st.winRate, (v) => fmtPct(v))} />
              <SessionRadar title="Total Trades" points={radarPoints((st) => st.total, (v) => String(Math.round(v)))} />
              <SessionRadar title="Avg RR" points={radarPoints((st) => st.avgRR, (v) => `${v.toFixed(2)}R`)} />
              <SessionRadar title="Profit" points={radarPoints((st) => st.netPnl, (v) => fmtMoney(v, currency))} />
            </div>
            <p className="mt-3 text-[11px] text-mute">Sessions are set from each trade&apos;s time (UTC = your Accra local time): London 08:00–13:00, Overlap 13:00–16:00, New York 16:00–22:00, Asia 22:00–08:00.</p>
          </Card>
          <Card>
            <SectionTitle>Session breakdown</SectionTitle>
            <GroupTable rows={bySession} keyLabel="Session" currency={currency} />
          </Card>
          <Card>
            <SectionTitle>Net P&L by session</SectionTitle>
            {bySession.map((r) => (
              <BarRow
                key={r.key}
                label={r.key}
                value={Math.abs(r.stats.netPnl)}
                max={Math.max(...bySession.map((x) => Math.abs(x.stats.netPnl)), 1)}
                display={fmtMoney(r.stats.netPnl, currency)}
                color={r.stats.netPnl >= 0 ? "#22C55E" : "#EF4444"}
              />
            ))}
          </Card>
        </div>
      )}

      {tab === "Strategies" && (
        <Card>
          <SectionTitle>Performance by strategy</SectionTitle>
          <GroupTable rows={byStrategy} keyLabel="Strategy" currency={currency} />
        </Card>
      )}

      {tab === "Accounts" && (
        <Card>
          <SectionTitle>Performance by account</SectionTitle>
          <GroupTable rows={byAccount} keyLabel="Account" currency={currency} />
        </Card>
      )}

      {tab === "Tags" && (
        <Card>
          <SectionTitle
            action={
              <Tabs tabs={["All", "Single tags", "Pairs of tags", "Triples"]} active={comboSize} onChange={setComboSize} />
            }
          >
            Tags & combinations
          </SectionTitle>
          <p className="mb-4 text-sm text-mute">
            Combinations need at least 2 trades to appear. This is where the system shows you which confluences actually pay.
          </p>
          <GroupTable rows={filteredCombos} keyLabel="Tag combination" currency={currency} />
        </Card>
      )}

      {tab === "Grades" && (
        <div className="space-y-6">
          <Card>
            <SectionTitle>Performance by setup grade</SectionTitle>
            <p className="mb-4 text-sm text-mute">
              The test of good grading: your A+ setups should out-earn your B and C setups. If they don&apos;t, your idea of an A+ needs work.
            </p>
            {byGrade.length === 0 ? (
              <div className="py-8 text-center text-sm text-mute">No graded trades yet. Grade setups A+ / A / B / C as you log them.</div>
            ) : (
              <GroupTable rows={byGrade} keyLabel="Grade" currency={currency} />
            )}
          </Card>
          {byGrade.length > 0 && (
            <Card>
              <SectionTitle>Avg RR by grade</SectionTitle>
              {byGrade.map((r) => (
                <BarRow
                  key={r.key}
                  label={r.key}
                  value={Math.abs(r.stats.avgRR)}
                  max={Math.max(...byGrade.map((x) => Math.abs(x.stats.avgRR)), 1)}
                  display={`${r.stats.avgRR.toFixed(2)}R`}
                  color={r.stats.avgRR >= 0 ? "#A3E635" : "#EF4444"}
                />
              ))}
            </Card>
          )}
        </div>
      )}

      {tab === "Execution" && (
        <div className="space-y-6">
          {exec.sampled === 0 ? (
            <EmptyState
              title="No execution data yet"
              body="Add entry, stop loss, and take profit to your trades. TradeEdge then compares your planned RR to what you actually took — and shows where you cut winners early or let losers run."
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Stat label="Trades measured" value={String(exec.sampled)} hint="with entry/SL/TP" />
                <Stat label="Target capture" value={fmtPct(exec.avgCapture * 100)} hint="of planned R on winners" />
                <Stat label="Avg planned RR" value={`${exec.avgPlanned.toFixed(2)}R`} />
                <Stat label="Avg realized RR" value={`${exec.avgRealized.toFixed(2)}R`} tone={exec.avgRealized} />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <div className="text-xs font-medium uppercase tracking-wider text-mute">Cut winners early</div>
                  <div className="mt-2 font-mono text-2xl font-semibold text-warn">{exec.cutEarly}</div>
                  <div className="mt-1 text-xs text-mute">
                    ~{exec.cutEarlyCostR.toFixed(1)}R left on the table. Your winners can take more room.
                  </div>
                </Card>
                <Card>
                  <div className="text-xs font-medium uppercase tracking-wider text-mute">Let losers run past stop</div>
                  <div className="mt-2 font-mono text-2xl font-semibold text-neg">{exec.letRun}</div>
                  <div className="mt-1 text-xs text-mute">
                    ~{exec.letRunCostR.toFixed(1)}R of avoidable damage from moved stops or oversizing.
                  </div>
                </Card>
              </div>
              <Card className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-edge text-left text-xs uppercase tracking-wider text-mute">
                        <th className="py-2.5 pl-5 pr-4 font-medium">Pair</th>
                        <th className="py-2.5 pr-4 font-medium text-right">Planned</th>
                        <th className="py-2.5 pr-4 font-medium text-right">Realized</th>
                        <th className="py-2.5 pr-4 font-medium text-right">Capture</th>
                        <th className="py-2.5 pr-5 font-medium">Read</th>
                      </tr>
                    </thead>
                    <tbody>
                      {execFindings
                        .filter((f) => f.kind === "cut_early" || f.kind === "let_run")
                        .slice(0, 20)
                        .map((f) => (
                          <tr key={f.trade.id} className="border-b border-edge/50 last:border-0">
                            <td className="py-3 pl-5 pr-4 font-medium text-ink">{f.trade.pair}</td>
                            <td className="py-3 pr-4 text-right font-mono text-sub">{f.planned.toFixed(2)}R</td>
                            <td className={`py-3 pr-4 text-right font-mono ${signColor(f.realized)}`}>{fmtR(f.realized)}</td>
                            <td className="py-3 pr-4 text-right font-mono text-sub">{fmtPct(f.capture * 100)}</td>
                            <td className="py-3 pr-5">
                              <span className={f.kind === "cut_early" ? "text-warn" : "text-neg"}>
                                {f.kind === "cut_early" ? "Cut early" : "Ran past stop"}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </div>
      )}

      {tab === "Violations" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <div className="text-xs font-medium uppercase tracking-wider text-mute">Rule-following trades</div>
              <div className={`mt-2 font-mono text-2xl font-semibold ${signColor(cleanStats.netPnl)}`}>{fmtMoney(cleanStats.netPnl, currency)}</div>
              <div className="mt-1 text-xs text-mute">{cleanStats.total} trades · {fmtPct(cleanStats.winRate)} win rate · {cleanStats.avgRR.toFixed(2)}R expectancy</div>
            </Card>
            <Card>
              <div className="text-xs font-medium uppercase tracking-wider text-mute">Trades with violations</div>
              <div className={`mt-2 font-mono text-2xl font-semibold ${signColor(dirtyStats.netPnl)}`}>{fmtMoney(dirtyStats.netPnl, currency)}</div>
              <div className="mt-1 text-xs text-mute">{dirtyStats.total} trades · {fmtPct(dirtyStats.winRate)} win rate · {dirtyStats.avgRR.toFixed(2)}R expectancy</div>
            </Card>
          </div>
          <Card>
            <SectionTitle>Impact by violation</SectionTitle>
            {violationRows.length === 0 ? (
              <div className="py-8 text-center text-sm text-mute">No rule violations logged. Keep it that way.</div>
            ) : (
              <GroupTable rows={violationRows} keyLabel="Violation" currency={currency} />
            )}
          </Card>
        </div>
      )}
      </>
      )}
    </div>
  );
}
