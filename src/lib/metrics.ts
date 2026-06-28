import { Trade, Account, outcomeOf } from "@/lib/types";

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

export interface WinLossSummary {
  winners: number;
  losers: number;
  bestWinR: number;
  worstLossR: number;
  avgWinR: number;
  avgLossR: number;
  avgWinPnl: number;
  avgLossPnl: number; // negative
  grossWinPnl: number;
  grossLossPnl: number; // negative
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
  avgConsecutiveWins: number;
  avgConsecutiveLosses: number;
}

/** Winner/loser breakdown including consecutive-streak stats (chronological). */
export function winLossSummary(trades: Trade[]): WinLossSummary {
  const chron = [...trades].sort((a, b) => a.date.localeCompare(b.date));
  const wins = chron.filter((t) => t.rr > 0);
  const losses = chron.filter((t) => t.rr < 0);
  const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
  const avg = (a: number[]) => (a.length ? sum(a) / a.length : 0);

  // consecutive runs
  const winRuns: number[] = [];
  const lossRuns: number[] = [];
  let run = 0;
  let runSign = 0;
  for (const t of chron) {
    const s = t.rr > 0 ? 1 : t.rr < 0 ? -1 : 0;
    if (s === 0) continue;
    if (s === runSign) run++;
    else {
      if (runSign === 1) winRuns.push(run);
      if (runSign === -1) lossRuns.push(run);
      runSign = s;
      run = 1;
    }
  }
  if (runSign === 1) winRuns.push(run);
  if (runSign === -1) lossRuns.push(run);

  return {
    winners: wins.length,
    losers: losses.length,
    bestWinR: wins.length ? Math.max(...wins.map((t) => t.rr)) : 0,
    worstLossR: losses.length ? Math.min(...losses.map((t) => t.rr)) : 0,
    avgWinR: avg(wins.map((t) => t.rr)),
    avgLossR: avg(losses.map((t) => t.rr)),
    avgWinPnl: avg(wins.map((t) => t.pnl)),
    avgLossPnl: avg(losses.map((t) => t.pnl)),
    grossWinPnl: sum(wins.map((t) => t.pnl)),
    grossLossPnl: sum(losses.map((t) => t.pnl)),
    maxConsecutiveWins: winRuns.length ? Math.max(...winRuns) : 0,
    maxConsecutiveLosses: lossRuns.length ? Math.max(...lossRuns) : 0,
    avgConsecutiveWins: avg(winRuns),
    avgConsecutiveLosses: avg(lossRuns),
  };
}

export interface DayPnl {
  date: string; // yyyy-mm-dd
  pnl: number;
  trades: number;
}

/** Net P&L grouped by calendar day (chronological). */
export function dailyPnl(trades: Trade[]): DayPnl[] {
  const map = new Map<string, { pnl: number; trades: number }>();
  for (const t of trades) {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const cur = map.get(key) ?? { pnl: 0, trades: 0 };
    cur.pnl += t.pnl;
    cur.trades += 1;
    map.set(key, cur);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, v]) => ({ date, ...v }));
}

export interface MonthlyYearRow {
  year: number;
  months: (number | null)[]; // 12 entries, net P&L per month (null = no trades)
  pctMonths: (number | null)[]; // % return per month vs starting balance
  total: number; // net P&L for the year
  totalPct: number; // % return for the year
}

/**
 * Net P&L per month, grouped by year (Jan→Dec), plus % return against a starting balance.
 * Pass the account's starting balance for the % column; defaults to making % null.
 */
export function monthlyPerformance(trades: Trade[], startingBalance?: number): MonthlyYearRow[] {
  const byYear = new Map<number, number[]>();
  for (const t of trades) {
    const d = new Date(t.date);
    const y = d.getFullYear();
    if (!byYear.has(y)) byYear.set(y, Array(12).fill(0));
    byYear.get(y)![d.getMonth()] += t.pnl;
  }
  // track which months actually had trades (so 0 shows as a real 0, not blank)
  const hadTrade = new Map<number, boolean[]>();
  for (const t of trades) {
    const d = new Date(t.date);
    const y = d.getFullYear();
    if (!hadTrade.has(y)) hadTrade.set(y, Array(12).fill(false));
    hadTrade.get(y)![d.getMonth()] = true;
  }
  return Array.from(byYear.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, months]) => {
      const had = hadTrade.get(year)!;
      const cells = months.map((v, i) => (had[i] ? v : null));
      const pct = cells.map((v) => (v === null || !startingBalance ? null : (v / startingBalance) * 100));
      const total = cells.reduce((s: number, v) => s + (v ?? 0), 0);
      const totalPct = startingBalance ? (total / startingBalance) * 100 : 0;
      return { year, months: cells, pctMonths: pct, total, totalPct };
    });
}

// ── prop-firm risk guardrails ─────────────────────────────────────────

export interface RiskStatus {
  hasLimits: boolean;
  dailyLossLimit?: number;
  dailyLoss: number; // positive number = currency lost today
  dailyRemaining?: number;
  maxDrawdownLimit?: number;
  drawdown: number; // current peak-to-trough drawdown in currency
  ddRemaining?: number;
  level: "ok" | "warn" | "breach";
  oneTradeAway: boolean; // a typical losing trade would breach the daily limit
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Evaluate an account's daily-loss and drawdown limits against its trades. */
export function riskStatus(account: Account, trades: Trade[]): RiskStatus {
  const acctTrades = trades.filter((t) => t.accountId === account.id);
  const today = new Date();
  const todayPnl = acctTrades.filter((t) => isSameDay(new Date(t.date), today)).reduce((s, t) => s + t.pnl, 0);
  const dailyLoss = todayPnl < 0 ? -todayPnl : 0;

  // Drawdown from peak equity over the account's history.
  const sorted = [...acctTrades].sort((a, b) => a.date.localeCompare(b.date));
  let equity = account.balance;
  let peak = account.balance;
  let maxDD = 0;
  for (const t of sorted) {
    equity += t.pnl;
    if (equity > peak) peak = equity;
    const dd = peak - equity;
    if (dd > maxDD) maxDD = dd;
  }
  const drawdown = peak - equity;

  const dll = account.dailyLossLimit;
  const mdd = account.maxDrawdownLimit;
  const hasLimits = !!dll || !!mdd;

  const dailyRemaining = dll !== undefined ? Math.max(0, dll - dailyLoss) : undefined;
  const ddRemaining = mdd !== undefined ? Math.max(0, mdd - drawdown) : undefined;

  // Typical risk per trade (from recent trades) to flag "one trade away".
  const risks = acctTrades.map((t) => t.riskAmount ?? 0).filter((r) => r > 0);
  const typicalRisk = risks.length ? risks.reduce((a, b) => a + b, 0) / risks.length : 0;

  let level: RiskStatus["level"] = "ok";
  if ((dll !== undefined && dailyLoss >= dll) || (mdd !== undefined && drawdown >= mdd)) level = "breach";
  else if (
    (dailyRemaining !== undefined && dll! > 0 && dailyRemaining <= dll! * 0.3) ||
    (ddRemaining !== undefined && mdd! > 0 && ddRemaining <= mdd! * 0.3)
  )
    level = "warn";

  const oneTradeAway =
    level !== "breach" && dailyRemaining !== undefined && typicalRisk > 0 && dailyRemaining <= typicalRisk;

  return { hasLimits, dailyLossLimit: dll, dailyLoss, dailyRemaining, maxDrawdownLimit: mdd, drawdown, ddRemaining, level, oneTradeAway };
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
