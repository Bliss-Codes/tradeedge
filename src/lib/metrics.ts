import { Trade, outcomeOf } from "@/lib/types";

export interface Stats {
  total: number;
  wins: number;
  losses: number;
  breakevens: number;
  winRate: number; // 0–100, breakevens excluded
  netRR: number;
  avgRR: number; // expectancy in R
  profitFactor: number;
  netPnl: number;
  largestWin: number; // R
  largestLoss: number; // R
  maxDrawdownR: number; // peak-to-trough in cumulative R
  currentStreak: number; // + wins, − losses
}

export function computeStats(trades: Trade[]): Stats {
  const sorted = [...trades].sort((a, b) => a.date.localeCompare(b.date));
  let wins = 0,
    losses = 0,
    be = 0,
    netRR = 0,
    netPnl = 0,
    grossWin = 0,
    grossLoss = 0,
    largestWin = 0,
    largestLoss = 0;

  let equity = 0,
    peak = 0,
    maxDD = 0;

  for (const t of sorted) {
    const o = outcomeOf(t);
    if (o === "win") wins++;
    else if (o === "loss") losses++;
    else be++;
    netRR += t.rr;
    netPnl += t.pnl;
    if (t.rr > 0) grossWin += t.rr;
    if (t.rr < 0) grossLoss += -t.rr;
    if (t.rr > largestWin) largestWin = t.rr;
    if (t.rr < largestLoss) largestLoss = t.rr;
    equity += t.rr;
    if (equity > peak) peak = equity;
    if (peak - equity > maxDD) maxDD = peak - equity;
  }

  let streak = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    const o = outcomeOf(sorted[i]);
    if (o === "be") continue;
    const dir = o === "win" ? 1 : -1;
    if (streak === 0) streak = dir;
    else if (Math.sign(streak) === dir) streak += dir;
    else break;
  }

  const decided = wins + losses;
  return {
    total: trades.length,
    wins,
    losses,
    breakevens: be,
    winRate: decided ? (wins / decided) * 100 : 0,
    netRR,
    avgRR: trades.length ? netRR / trades.length : 0,
    profitFactor: grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? Infinity : 0,
    netPnl,
    largestWin,
    largestLoss,
    maxDrawdownR: maxDD,
    currentStreak: streak,
  };
}

export interface EquityPoint {
  date: string;
  value: number;
}

export function equityCurve(trades: Trade[], by: "rr" | "pnl" = "rr"): EquityPoint[] {
  const sorted = [...trades].sort((a, b) => a.date.localeCompare(b.date));
  let acc = 0;
  return sorted.map((t) => {
    acc += by === "rr" ? t.rr : t.pnl;
    return { date: t.date, value: acc };
  });
}

export function groupBy<K extends string>(trades: Trade[], key: (t: Trade) => K | undefined): Map<K, Trade[]> {
  const map = new Map<K, Trade[]>();
  for (const t of trades) {
    const k = key(t);
    if (k === undefined) continue;
    const arr = map.get(k) ?? [];
    arr.push(t);
    map.set(k, arr);
  }
  return map;
}

export interface GroupRow {
  key: string;
  stats: Stats;
}

export function statsByGroup(trades: Trade[], key: (t: Trade) => string | undefined): GroupRow[] {
  return Array.from(groupBy(trades, key).entries())
    .map(([k, ts]) => ({ key: k, stats: computeStats(ts) }))
    .sort((a, b) => b.stats.netRR - a.stats.netRR);
}

/** Tag combinations (sizes 1–3) with at least `min` trades, best first. */
export function tagCombos(trades: Trade[], min = 1): GroupRow[] {
  const map = new Map<string, Trade[]>();
  for (const t of trades) {
    const tags = [...new Set(t.tags)].sort();
    const combos: string[][] = [];
    for (let i = 0; i < tags.length; i++) {
      combos.push([tags[i]]);
      for (let j = i + 1; j < tags.length; j++) {
        combos.push([tags[i], tags[j]]);
        for (let k = j + 1; k < tags.length; k++) {
          combos.push([tags[i], tags[j], tags[k]]);
        }
      }
    }
    for (const c of combos) {
      const id = c.join(" + ");
      const arr = map.get(id) ?? [];
      arr.push(t);
      map.set(id, arr);
    }
  }
  return Array.from(map.entries())
    .filter(([, ts]) => ts.length >= min)
    .map(([key, ts]) => ({ key, stats: computeStats(ts) }))
    .sort((a, b) => b.stats.netRR - a.stats.netRR);
}

// ── execution quality ─────────────────────────────────────────────────

/**
 * Planned reward-to-risk from entry, stop, and target.
 * Returns undefined unless all three are present and risk is positive.
 */
export function plannedRR(t: Trade): number | undefined {
  const { entry, stopLoss: sl, takeProfit: tp, direction } = t;
  if (entry === undefined || sl === undefined || tp === undefined) return undefined;
  const risk = direction === "long" ? entry - sl : sl - entry;
  const reward = direction === "long" ? tp - entry : entry - tp;
  if (risk <= 0) return undefined;
  return reward / risk;
}

export interface ExecutionFinding {
  trade: Trade;
  planned: number;
  realized: number;
  capture: number; // realized / planned
  kind: "cut_early" | "let_run" | "on_plan" | "exceeded";
}

export function executionFindings(trades: Trade[]): ExecutionFinding[] {
  const out: ExecutionFinding[] = [];
  for (const t of trades) {
    const planned = plannedRR(t);
    if (planned === undefined || planned <= 0) continue;
    const realized = t.rr;
    const capture = realized / planned;
    let kind: ExecutionFinding["kind"];
    if (realized < -1.05) kind = "let_run"; // lost more than 1R → stop moved / over-risk
    else if (realized > 0 && capture < 0.7 && planned >= 1.5) kind = "cut_early";
    else if (capture >= 0.95) kind = "exceeded";
    else kind = "on_plan";
    out.push({ trade: t, planned, realized, capture, kind });
  }
  return out;
}

export interface ExecutionSummary {
  sampled: number;
  avgPlanned: number;
  avgRealized: number;
  avgCapture: number; // % of planned R actually captured on winners
  cutEarly: number;
  cutEarlyCostR: number; // R left on the table
  letRun: number;
  letRunCostR: number; // extra R lost beyond -1
  onPlan: number;
}

export function executionSummary(trades: Trade[]): ExecutionSummary {
  const f = executionFindings(trades);
  const winners = f.filter((x) => x.realized > 0);
  const cut = f.filter((x) => x.kind === "cut_early");
  const ran = f.filter((x) => x.kind === "let_run");
  return {
    sampled: f.length,
    avgPlanned: f.length ? f.reduce((a, x) => a + x.planned, 0) / f.length : 0,
    avgRealized: f.length ? f.reduce((a, x) => a + x.realized, 0) / f.length : 0,
    avgCapture: winners.length ? winners.reduce((a, x) => a + Math.min(x.capture, 1), 0) / winners.length : 0,
    cutEarly: cut.length,
    cutEarlyCostR: cut.reduce((a, x) => a + (x.planned - x.realized), 0),
    letRun: ran.length,
    letRunCostR: ran.reduce((a, x) => a + (-1 - x.realized), 0),
    onPlan: f.filter((x) => x.kind === "on_plan" || x.kind === "exceeded").length,
  };
}

// ── prop-firm / SMC analytics ─────────────────────────────────────────

/** Rule adherence = trades where the plan was followed ÷ total, as a %. */
export function ruleAdherence(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  const followed = trades.filter((t) => t.followedPlan === true).length;
  return (followed / trades.length) * 100;
}

export interface TrendPoint {
  label: string;
  value: number; // adherence %
  total: number; // trades in the bucket
}

function weekKey(d: Date): string {
  // ISO-ish week label: year-Www based on Monday start
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - day + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((date.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}
function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Rule-adherence trend, bucketed by week or month, oldest→newest, last `limit`. */
export function adherenceTrend(trades: Trade[], by: "week" | "month", limit = 12): TrendPoint[] {
  const buckets = new Map<string, Trade[]>();
  for (const t of trades) {
    const k = by === "week" ? weekKey(new Date(t.date)) : monthKey(new Date(t.date));
    const arr = buckets.get(k) ?? [];
    arr.push(t);
    buckets.set(k, arr);
  }
  return Array.from(buckets.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-limit)
    .map(([label, ts]) => ({ label, value: ruleAdherence(ts), total: ts.length }));
}

export interface HourRow {
  hour: number; // 0–23
  stats: Stats;
}

/** Win rate / Net RR by entry hour (local time of the trade's timestamp). */
export function statsByHour(trades: Trade[]): HourRow[] {
  const map = new Map<number, Trade[]>();
  for (const t of trades) {
    const h = new Date(t.date).getHours();
    const arr = map.get(h) ?? [];
    arr.push(t);
    map.set(h, arr);
  }
  return Array.from(map.entries())
    .map(([hour, ts]) => ({ hour, stats: computeStats(ts) }))
    .sort((a, b) => a.hour - b.hour);
}

export interface DistRow {
  key: string;
  count: number;
  pct: number;
}

/** Distribution of a string field (e.g. exit reason) as counts + percentages. */
export function distribution(trades: Trade[], key: (t: Trade) => string | undefined): DistRow[] {
  const map = new Map<string, number>();
  let total = 0;
  for (const t of trades) {
    const k = key(t);
    if (!k) continue;
    map.set(k, (map.get(k) ?? 0) + 1);
    total++;
  }
  return Array.from(map.entries())
    .map(([k, count]) => ({ key: k, count, pct: total ? (count / total) * 100 : 0 }))
    .sort((a, b) => b.count - a.count);
}

/** Best / worst group by net RR, with a minimum sample to avoid noise. */
export function bestWorst(rows: GroupRow[], min = 1): { best?: GroupRow; worst?: GroupRow } {
  const eligible = rows.filter((r) => r.stats.total >= min);
  if (eligible.length === 0) return {};
  const sorted = [...eligible].sort((a, b) => b.stats.netRR - a.stats.netRR);
  return { best: sorted[0], worst: sorted[sorted.length - 1] };
}

/** Most frequent rule violation across the given trades. */
export function mostCommonMistake(trades: Trade[]): { violation: string; count: number } | null {
  const map = new Map<string, number>();
  for (const t of trades) for (const v of t.violations) map.set(v, (map.get(v) ?? 0) + 1);
  const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  return sorted.length ? { violation: sorted[0][0], count: sorted[0][1] } : null;
}

// ── formatting helpers ────────────────────────────────────────────────

export const fmtR = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(2)}R`;
export const fmtPct = (v: number) => `${v.toFixed(1)}%`;
export const fmtPF = (v: number) => (v === Infinity ? "∞" : v.toFixed(2));
export const fmtMoney = (v: number, ccy = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: ccy,
    maximumFractionDigits: 2,
  }).format(v);
export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
export const signColor = (v: number) => (v > 0 ? "text-pos" : v < 0 ? "text-neg" : "text-mute");
