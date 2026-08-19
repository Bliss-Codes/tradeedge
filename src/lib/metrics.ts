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
    // Profit factor is computed in R, not money, deliberately: risk % differs
    // between challenge (higher) and funded (lower) accounts, so money-based
    // gross profit/loss would be distorted by position size rather than edge.
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
  const risk = Math.abs(entry - sl);
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
/**
 * Adherence over REVIEWED trades only.
 *
 * Previously this divided by every trade, so an unreviewed trade
 * (followedPlan === undefined) counted as a rule break. That reports a
 * disciplined trader who simply hasn't ticked the checklist as 0% adherent,
 * which is not true — it's unknown, not bad. Use `adherenceDetail` when you
 * need to show how much of the sample is actually reviewed.
 */
const REVIEW_KEYS = [
  "followedHtfBias",
  "waitedForLiquidity",
  "waitedForConfirmation",
  "respectedRisk",
  "followedPlan",
] as const;

function reviewStatus(t: Trade): "reviewed" | "unreviewed" | "partial" {
  const values = REVIEW_KEYS.map((k) => t[k]);
  // Legacy trades may only have the original followedPlan flag.
  const hasNewReviewFields = values.slice(0, -1).some((v) => v !== undefined);
  if (!hasNewReviewFields) return t.followedPlan === undefined ? "unreviewed" : "reviewed";
  return values.every((v) => v !== undefined) ? "reviewed" : "partial";
}

function followedReview(t: Trade): boolean {
  const status = reviewStatus(t);
  if (status !== "reviewed") return false;
  const hasNewReviewFields = REVIEW_KEYS.slice(0, -1).some((k) => t[k] !== undefined);
  if (!hasNewReviewFields) return t.followedPlan === true;
  return REVIEW_KEYS.every((k) => t[k] === true);
}

/**
 * Rule adherence uses the complete review checklist for new trades:
 * HTF bias, liquidity, confirmation, risk, and overall plan. Partially
 * reviewed trades are excluded from the denominator instead of being treated
 * as violations. Legacy trades that only have followedPlan keep the old rule.
 */
export function ruleAdherence(trades: Trade[]): number {
  const reviewed = trades.filter((t) => reviewStatus(t) === "reviewed");
  if (reviewed.length === 0) return 0;
  return (reviewed.filter(followedReview).length / reviewed.length) * 100;
}

export function adherenceDetail(trades: Trade[]): {
  pct: number;
  reviewed: number;
  total: number;
  coverage: number;
  partial: number;
} {
  const reviewed = trades.filter((t) => reviewStatus(t) === "reviewed");
  const partial = trades.filter((t) => reviewStatus(t) === "partial").length;
  const followed = reviewed.filter(followedReview).length;
  return {
    pct: reviewed.length ? (followed / reviewed.length) * 100 : 0,
    reviewed: reviewed.length,
    total: trades.length,
    coverage: trades.length ? (reviewed.length / trades.length) * 100 : 0,
    partial,
  };
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
  // Classify with outcomeOf so every card agrees on what a "win" is.
  // Using t.rr here gave a different winner count than the header stats
  // whenever pnl and rr disagreed (e.g. pnl logged, rr left at 0).
  const wins = chron.filter((t) => outcomeOf(t) === "win");
  const losses = chron.filter((t) => outcomeOf(t) === "loss");
  const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
  const avg = (a: number[]) => (a.length ? sum(a) / a.length : 0);

  // consecutive runs
  const winRuns: number[] = [];
  const lossRuns: number[] = [];
  let run = 0;
  let runSign = 0;
  for (const t of chron) {
    const o = outcomeOf(t);
    const s = o === "win" ? 1 : o === "loss" ? -1 : 0;
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
  dailyLoss: number;
  dailyPnl: number;
  dailyRemaining?: number;
  maxDrawdownLimit?: number;
  ddRemaining?: number;
  drawdown: number;
  maxDrawdown: number;
  currentDrawdownPct: number;
  maxDrawdownPct: number;
  currentEquity: number;
  peakEquity: number;
  netPnl: number;
  avgRiskAmount: number;
  maxRiskAmount: number;
  avgRiskPercent: number;
  maxRiskPercent: number;
  dailyRiskAmount: number;
  largestLoss: number;
  largestWin: number;
  maxConsecutiveLosses: number;
  maxConsecutiveWins: number;
  riskBreaches: number;
  dailyLossBreaches: number;
  drawdownBreaches: number;
  oneTradeAway: boolean;
  level: "ok" | "warn" | "breach";
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/**
 * Account-level risk snapshot. `account.balance` is the immutable starting
 * balance; all realized P&L is applied to it. Risk metrics are calculated
 * from this account's trades only and never from the current Analytics filter.
 */
export function riskStatus(account: Account, trades: Trade[]): RiskStatus {
  const acctTrades = trades
    .filter((t) => t.accountId === account.id)
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

  const now = new Date();
  const todayTrades = acctTrades.filter((t) => isSameDay(new Date(t.date), now));
  const dailyPnl = todayTrades.reduce((s, t) => s + t.pnl, 0);
  const dailyLoss = dailyPnl < 0 ? -dailyPnl : 0;
  const dailyRiskAmount = todayTrades.reduce((s, t) => s + Math.max(0, t.riskAmount ?? 0), 0);

  let equity = account.balance;
  let peak = account.balance;
  let maxDD = 0;
  let maxConsecutiveLosses = 0;
  let maxConsecutiveWins = 0;
  let lossStreak = 0;
  let winStreak = 0;
  let largestLoss = 0;
  let largestWin = 0;

  for (const t of acctTrades) {
    equity += t.pnl;
    if (equity > peak) peak = equity;
    maxDD = Math.max(maxDD, peak - equity);

    if (t.pnl < largestLoss) largestLoss = t.pnl;
    if (t.pnl > largestWin) largestWin = t.pnl;

    if (t.pnl < 0) { lossStreak += 1; winStreak = 0; }
    else if (t.pnl > 0) { winStreak += 1; lossStreak = 0; }
    else { lossStreak = 0; winStreak = 0; }
    maxConsecutiveLosses = Math.max(maxConsecutiveLosses, lossStreak);
    maxConsecutiveWins = Math.max(maxConsecutiveWins, winStreak);
  }

  const currentDrawdown = Math.max(0, peak - equity);
  const currentDrawdownPct = peak > 0 ? (currentDrawdown / peak) * 100 : 0;
  const maxDrawdownPct = account.balance > 0 ? (maxDD / account.balance) * 100 : 0;

  const riskAmounts = acctTrades.map((t) => t.riskAmount ?? 0).filter((v) => v > 0);
  const riskPcts = acctTrades.map((t) => t.riskPercent ?? 0).filter((v) => v > 0);
  const avgRiskAmount = riskAmounts.length ? riskAmounts.reduce((a, b) => a + b, 0) / riskAmounts.length : 0;
  const maxRiskAmount = riskAmounts.length ? Math.max(...riskAmounts) : 0;
  const avgRiskPercent = riskPcts.length ? riskPcts.reduce((a, b) => a + b, 0) / riskPcts.length : 0;
  const maxRiskPercent = riskPcts.length ? Math.max(...riskPcts) : 0;

  const dll = account.dailyLossLimit;
  const mdd = account.maxDrawdownLimit;
  const dailyRemaining = dll !== undefined ? Math.max(0, dll - dailyLoss) : undefined;
  const ddRemaining = mdd !== undefined ? Math.max(0, mdd - currentDrawdown) : undefined;

  const dailyLossBreaches = dll !== undefined
    ? acctTrades.reduce((count, t) => {
        const day = acctTrades.filter((x) => isSameDay(new Date(x.date), new Date(t.date))).reduce((s, x) => s + x.pnl, 0);
        return day < -dll ? count + 1 : count;
      }, 0) > 0 ? 1 : 0
    : 0;
  const drawdownBreaches = mdd !== undefined && maxDD >= mdd ? 1 : 0;
  const riskBreaches = dailyLossBreaches + drawdownBreaches;

  const typicalRisk = avgRiskAmount;
  const oneTradeAway = dailyRemaining !== undefined && typicalRisk > 0 && dailyRemaining <= typicalRisk && dailyRemaining > 0;

  let level: RiskStatus["level"] = "ok";
  if ((dll !== undefined && dailyLoss >= dll) || (mdd !== undefined && currentDrawdown >= mdd)) level = "breach";
  else if (
    (dailyRemaining !== undefined && dll! > 0 && dailyRemaining <= dll! * 0.3) ||
    (ddRemaining !== undefined && mdd! > 0 && ddRemaining <= mdd! * 0.3) ||
    oneTradeAway
  ) level = "warn";

  return {
    hasLimits: dll !== undefined || mdd !== undefined,
    dailyLossLimit: dll,
    dailyLoss,
    dailyPnl,
    dailyRemaining,
    maxDrawdownLimit: mdd,
    ddRemaining,
    drawdown: currentDrawdown,
    maxDrawdown: maxDD,
    currentDrawdownPct,
    maxDrawdownPct,
    currentEquity: equity,
    peakEquity: peak,
    netPnl: equity - account.balance,
    avgRiskAmount,
    maxRiskAmount,
    avgRiskPercent,
    maxRiskPercent,
    dailyRiskAmount,
    largestLoss,
    largestWin,
    maxConsecutiveLosses,
    maxConsecutiveWins,
    riskBreaches,
    dailyLossBreaches,
    drawdownBreaches,
    oneTradeAway,
    level,
  };
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

/** ISO week key like "2026-W27" — matches the Reviews page period keys. */
export function isoWeekKey(d: Date): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((date.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}


/**
 * Collapse multi-account executions of one setup into a single representative
 * trade, so edge metrics (win rate, expectancy, R) reflect IDEAS, not fills.
 *
 * - Trades sharing a setupId become one entry.
 * - R is averaged across the executions (they should be near-identical).
 * - P&L is summed on purpose: the money really was made on every account, so
 *   money totals stay identical in both counting modes. Only the edge stats
 *   (win rate, expectancy, sample size) collapse to one data point.
 * - Trades without a setupId are untouched.
 */
export function dedupeBySetup(trades: Trade[]): Trade[] {
  const groups = new Map<string, Trade[]>();
  const singles: Trade[] = [];
  for (const t of trades) {
    if (!t.setupId) { singles.push(t); continue; }
    const g = groups.get(t.setupId);
    if (g) g.push(t); else groups.set(t.setupId, [t]);
  }
  const merged: Trade[] = [];
  for (const g of groups.values()) {
    const first = [...g].sort((a, b) => a.date.localeCompare(b.date))[0];
    const avgR = g.reduce((s, t) => s + t.rr, 0) / g.length;
    merged.push({ ...first, rr: avgR, pnl: g.reduce((s, t) => s + t.pnl, 0) });
  }
  return [...singles, ...merged].sort((a, b) => b.date.localeCompare(a.date));
}

/** How many raw executions map to how many distinct setups. */
export function setupCounts(trades: Trade[]): { executions: number; setups: number } {
  const ids = new Set<string>();
  let loose = 0;
  for (const t of trades) { if (t.setupId) ids.add(t.setupId); else loose++; }
  return { executions: trades.length, setups: ids.size + loose };
}


export interface BreakevenMiss {
  /** Losing trades that ran at least `threshold` R in profit first. */
  count: number;
  /** How many losers have MFE data at all (denominator for honesty). */
  withData: number;
  /** Average peak R reached by those trades before they turned. */
  avgPeakR: number;
  /** The best one that got away. */
  maxPeakR: number;
  /** R that would have been saved by moving to breakeven at the threshold. */
  rSaved: number;
}

/**
 * "Could have been breakeven": losing trades that first ran `threshold` R in
 * profit. Each one is a full R lost that a breakeven stop would have saved —
 * usually the cheapest available improvement in a trading system.
 */
export function breakevenMisses(trades: Trade[], threshold = 1): BreakevenMiss {
  const losers = trades.filter((t) => t.pnl < 0);
  const withData = losers.filter((t) => t.maxFavorableR !== undefined);
  const missed = withData.filter((t) => (t.maxFavorableR as number) >= threshold);
  const peaks = missed.map((t) => t.maxFavorableR as number);
  return {
    count: missed.length,
    withData: withData.length,
    avgPeakR: peaks.length ? peaks.reduce((a, b) => a + b, 0) / peaks.length : 0,
    maxPeakR: peaks.length ? Math.max(...peaks) : 0,
    rSaved: missed.reduce((s, t) => s + Math.abs(t.rr), 0),
  };
}

/** Average planned RR across trades that have entry, stop and target set. */
export function avgPlannedRR(trades: Trade[]): { avg: number; n: number } {
  const vals = trades.map(plannedRR).filter((v): v is number => v !== undefined && v > 0);
  return { avg: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0, n: vals.length };
}


/**
 * Challenge P&L is not money you can withdraw — it is score in an evaluation.
 * Funded P&L converts to payouts at your profit split. Mixing the two makes
 * every dollar figure meaningless: a 2%-risk challenge account swamps a
 * 0.75%-risk funded account and the totals show "progress" that never
 * reached a bank.
 *
 * R multiples ARE comparable across both — an R is an R regardless of stake —
 * which is why edge stats should run on everything while money stats run on
 * real accounts only.
 */
export type MoneyScope = "Real money" | "Challenge" | "All";

export function isRealMoneyAccount(a: Account | undefined): boolean {
  return a?.type === "Funded" || a?.type === "Personal";
}

export function filterByMoneyScope(trades: Trade[], accounts: Account[], scope: MoneyScope): Trade[] {
  if (scope === "All") return trades;
  const byId = new Map(accounts.map((a) => [a.id, a]));
  const wantReal = scope === "Real money";
  return trades.filter((t) => isRealMoneyAccount(byId.get(t.accountId)) === wantReal);
}

export interface MoneySplit {
  realPnl: number;
  realTrades: number;
  challengePnl: number;
  challengeTrades: number;
  /** Real P&L after the profit split — what actually reaches you. */
  payoutEstimate: number;
}

export function moneySplit(trades: Trade[], accounts: Account[], profitSplitPct = 80): MoneySplit {
  const byId = new Map(accounts.map((a) => [a.id, a]));
  let realPnl = 0, realTrades = 0, challengePnl = 0, challengeTrades = 0;
  for (const t of trades) {
    if (isRealMoneyAccount(byId.get(t.accountId))) { realPnl += t.pnl; realTrades++; }
    else { challengePnl += t.pnl; challengeTrades++; }
  }
  return {
    realPnl,
    realTrades,
    challengePnl,
    challengeTrades,
    payoutEstimate: realPnl > 0 ? realPnl * (profitSplitPct / 100) : realPnl,
  };
}

/* ── Process vs outcome quadrants ──────────────────────────────────────
   Sorting trades by process AND result separates skill from luck. The
   dangerous cell is Type 3: breaking the plan and getting paid for it,
   because the market just rewarded the behaviour that will eventually
   blow the account. Type 2 is the opposite — a good trade that lost, which
   is simply the cost of doing business and must not be "fixed". */

export type TradeType = "type1" | "type2" | "type3" | "type4" | "unclassified";

export interface QuadrantMeta {
  key: TradeType;
  label: string;
  short: string;
  verdict: string;
  tone: "pos" | "neg" | "warn" | "mute";
}

export const TRADE_TYPES: QuadrantMeta[] = [
  {
    key: "type1",
    label: "Followed plan · won",
    short: "Type 1",
    verdict: "Repeat these. This is the system working exactly as designed.",
    tone: "pos",
  },
  {
    key: "type2",
    label: "Followed plan · stopped out",
    short: "Type 2",
    verdict: "Accept these. A good trade that lost is the cost of the edge, not a mistake to fix.",
    tone: "mute",
  },
  {
    key: "type3",
    label: "Broke plan · won",
    short: "Type 3",
    verdict: "The most dangerous cell. You got paid for bad process, which teaches you to repeat it.",
    tone: "warn",
  },
  {
    key: "type4",
    label: "Broke plan · lost",
    short: "Type 4",
    verdict: "Eliminate these. Pure cost — bad process and bad outcome with nothing learned but the lesson.",
    tone: "neg",
  },
];

/**
 * A trade counts as "followed plan" when followedPlan is true, or when it has
 * a thesis and no violations logged. Explicit false, any violation, a
 * reactive entry emotion, or a missing thesis marks it off-plan.
 */
export function followedPlanOf(t: Trade): boolean | undefined {
  if (t.followedPlan === false) return false;
  if (t.violations.length > 0) return false;
  const reactive = t.emotionBefore === "FOMO" || t.emotionBefore === "Revenge" || t.emotionBefore === "Frustrated";
  if (reactive) return false;
  if (t.followedPlan === true) return true;
  if ((t.thesis ?? "").trim()) return true;
  return undefined; // not enough information to judge
}

export function quadrantOf(t: Trade): TradeType {
  const followed = followedPlanOf(t);
  if (followed === undefined) return "unclassified";
  const o = outcomeOf(t);
  if (o === "be") return followed ? "type2" : "type4"; // breakeven sits with the non-winners
  const won = o === "win";
  if (followed) return won ? "type1" : "type2";
  return won ? "type3" : "type4";
}

export interface QuadrantStats {
  key: TradeType;
  n: number;
  r: number;
  pnl: number;
  share: number; // % of classified trades
}

export function quadrantBreakdown(trades: Trade[]): {
  rows: QuadrantStats[];
  unclassified: number;
  classified: number;
  processQuality: number; // % of classified trades that followed the plan
  luckShare: number; // % of winners that came from broken process
} {
  const buckets: Record<TradeType, Trade[]> = {
    type1: [], type2: [], type3: [], type4: [], unclassified: [],
  };
  for (const t of trades) buckets[quadrantOf(t)].push(t);
  const classified = trades.length - buckets.unclassified.length;

  const rows = TRADE_TYPES.map(({ key }) => {
    const list = buckets[key];
    return {
      key,
      n: list.length,
      r: list.reduce((a, t) => a + t.rr, 0),
      pnl: list.reduce((a, t) => a + t.pnl, 0),
      share: classified ? (list.length / classified) * 100 : 0,
    };
  });

  const onPlan = buckets.type1.length + buckets.type2.length;
  const winners = buckets.type1.length + buckets.type3.length;
  return {
    rows,
    unclassified: buckets.unclassified.length,
    classified,
    processQuality: classified ? (onPlan / classified) * 100 : 0,
    luckShare: winners ? (buckets.type3.length / winners) * 100 : 0,
  };
}
