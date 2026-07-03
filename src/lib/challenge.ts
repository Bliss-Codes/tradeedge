// ── Challenge Mode engine ─────────────────────────────────────────────
// Pure functions that turn an account's config + trade history into a live
// prop-firm challenge state: progress to target, drawdown buffers, a
// suggested (capped) risk for the next trade, and funded-phase payout
// tracking (benchmark days + consistency). No I/O — everything derives
// from the Account and its Trades, so the jsonb snapshot needs no new tables.

import { Account, Trade } from "@/lib/types";

export type ChallengePhase = "Phase 1" | "Phase 2" | "Funded";
export const CHALLENGE_PHASES: ChallengePhase[] = ["Phase 1", "Phase 2", "Funded"];

export type DrawdownMode = "static" | "trailing";

export interface ChallengeConfig {
  enabled: boolean;
  phase: ChallengePhase;
  /** % of starting balance to pass (0 for Funded — no target, just survive + payout rules). */
  profitTargetPct: number;
  /** Firm's max overall drawdown, % of starting balance. */
  maxDrawdownPct: number;
  /** Firm's max daily loss, % of starting balance. HARD rule. */
  dailyLossPct: number;
  /** "static" = measured from starting balance; "trailing" = from peak equity. */
  drawdownMode: DrawdownMode;
  /** Your planned risk per trade, % of starting balance (e.g. 0.75). */
  baseRiskPct: number;
  /** Your own daily stop, % — defaults to half the firm's daily limit. */
  personalDailyStopPct?: number;
  /** Funded only: min closed profit for a day to count as a Benchmark Day. */
  benchmarkDayTarget?: number;
  /** Funded only: warn if best day exceeds this % of total profit (FundedNext futures: 40). */
  consistencyCapPct?: number;
}

export interface ChallengePreset {
  name: string;
  config: Omit<ChallengeConfig, "enabled" | "baseRiskPct">;
}

/**
 * Common FundedNext CFD structures as of mid-2026. Firms revise rules —
 * always verify against the dashboard of the specific account.
 */
export const CHALLENGE_PRESETS: ChallengePreset[] = [
  {
    name: "FundedNext Stellar 2-Step · Phase 1",
    config: { phase: "Phase 1", profitTargetPct: 8, maxDrawdownPct: 10, dailyLossPct: 5, drawdownMode: "static" },
  },
  {
    name: "FundedNext Stellar 2-Step · Phase 2",
    config: { phase: "Phase 2", profitTargetPct: 5, maxDrawdownPct: 10, dailyLossPct: 5, drawdownMode: "static" },
  },
  {
    name: "FundedNext Stellar 1-Step",
    config: { phase: "Phase 1", profitTargetPct: 10, maxDrawdownPct: 6, dailyLossPct: 3, drawdownMode: "trailing" },
  },
  {
    name: "FundedNext CFD · Funded (Stellar)",
    config: {
      phase: "Funded",
      profitTargetPct: 0,
      maxDrawdownPct: 10,
      dailyLossPct: 5,
      drawdownMode: "static",
      // CFD Stellar: payouts gate on trading days/cycles — no per-day profit
      // minimum and no consistency rule, so both are left unset.
    },
  },
  {
    name: "FundedNext Futures · Funded (Legacy-style)",
    config: {
      phase: "Funded",
      profitTargetPct: 0,
      maxDrawdownPct: 10,
      dailyLossPct: 5,
      drawdownMode: "static",
      benchmarkDayTarget: 200, // $200/day for 50K–100K, $100/day for 25K
      consistencyCapPct: 40,
    },
  },
];

export function defaultChallengeConfig(): ChallengeConfig {
  return { enabled: true, ...CHALLENGE_PRESETS[0].config, baseRiskPct: 0.75 };
}

export type ChallengeLevel = "passed" | "ok" | "warn" | "daily-stop" | "breached";

export interface BenchmarkInfo {
  target: number; // 0 = trading-day mode (CFD): any traded day counts
  daysHit: number; // trading days, or days with closed profit ≥ target
  minForPayout: number; // 5
  fullPayoutAt?: number; // Futures only: 30 — below this, withdrawals capped at 50%
  bestDayPct?: number; // best day's share of total profit
  consistencyCapPct?: number;
  consistencyOk?: boolean;
}

export interface ChallengeState {
  config: ChallengeConfig;
  startingBalance: number;
  equity: number;
  netPnl: number;
  tradeCount: number;
  wins: number;
  losses: number;
  breakevens: number;

  // target
  targetAmount: number; // absolute profit needed (0 for Funded)
  toTarget: number; // remaining
  progressPct: number; // 0–100 toward target

  // drawdown
  ddLimit: number; // absolute
  ddUsed: number; // per drawdownMode
  ddRemaining: number;

  // today
  dailyLimit: number; // firm's, absolute
  personalDailyStop: number; // yours, absolute
  todayPnl: number;
  todayLossUsed: number;
  dailyRemaining: number; // vs firm limit
  personalRemaining: number; // vs your stop

  // guidance
  suggestedRiskPct: number;
  suggestedRiskAmount: number;
  estTradesToTarget?: number; // at avg winner R and current win rate

  level: ChallengeLevel;
  messages: string[];

  benchmark?: BenchmarkInfo; // Funded phase only
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const dayKey = (iso: string) => iso.slice(0, 10);

export function computeChallengeState(account: Account, allTrades: Trade[]): ChallengeState | null {
  const config = account.challenge;
  if (!config?.enabled) return null;

  const start = account.balance;
  const trades = allTrades
    .filter((t) => t.accountId === account.id && t.type === "live")
    .sort((a, b) => a.date.localeCompare(b.date));

  let equity = start;
  let peak = start;
  const dailyPnl = new Map<string, number>();
  let wins = 0, losses = 0, breakevens = 0;
  const winnerRs: number[] = [];

  for (const t of trades) {
    equity += t.pnl;
    if (equity > peak) peak = equity;
    dailyPnl.set(dayKey(t.date), (dailyPnl.get(dayKey(t.date)) ?? 0) + t.pnl);
    if (t.pnl > 0) { wins++; if (t.rr > 0) winnerRs.push(t.rr); }
    else if (t.pnl < 0) losses++;
    else breakevens++;
  }

  const netPnl = equity - start;
  const targetAmount = (config.profitTargetPct / 100) * start;
  const toTarget = Math.max(0, targetAmount - netPnl);
  const progressPct = targetAmount > 0 ? Math.max(0, Math.min(100, (netPnl / targetAmount) * 100)) : 0;

  const ddLimit = (config.maxDrawdownPct / 100) * start;
  const ddUsed = config.drawdownMode === "trailing" ? Math.max(0, peak - equity) : Math.max(0, start - equity);
  const ddRemaining = Math.max(0, ddLimit - ddUsed);

  const today = new Date();
  const todayPnl = trades.filter((t) => sameDay(new Date(t.date), today)).reduce((s, t) => s + t.pnl, 0);
  const todayLossUsed = todayPnl < 0 ? -todayPnl : 0;
  const dailyLimit = (config.dailyLossPct / 100) * start;
  const personalDailyStop = ((config.personalDailyStopPct ?? config.dailyLossPct / 2) / 100) * start;
  const dailyRemaining = Math.max(0, dailyLimit - todayLossUsed);
  const personalRemaining = Math.max(0, personalDailyStop - todayLossUsed);

  // Suggested risk: your base risk, capped so one stop-out can never exceed
  // what's left of your personal daily stop, and never eats more than 30% of
  // the remaining overall drawdown buffer in a single trade.
  const baseRiskAmount = (config.baseRiskPct / 100) * start;
  const suggestedRiskAmount = Math.max(0, Math.min(baseRiskAmount, personalRemaining, ddRemaining * 0.3));
  const suggestedRiskPct = start > 0 ? (suggestedRiskAmount / start) * 100 : 0;

  // Rough runway estimate at the trader's own numbers.
  const decided = wins + losses;
  const winRate = decided > 0 ? wins / decided : 0;
  const avgWinR = winnerRs.length ? winnerRs.reduce((a, b) => a + b, 0) / winnerRs.length : 0;
  let estTradesToTarget: number | undefined;
  if (toTarget > 0 && suggestedRiskAmount > 0 && winRate > 0 && avgWinR > 0) {
    const evPerTrade = suggestedRiskAmount * (winRate * avgWinR - (1 - winRate));
    if (evPerTrade > 0) estTradesToTarget = Math.ceil(toTarget / evPerTrade);
  }

  const passed = config.phase !== "Funded" && targetAmount > 0 && netPnl >= targetAmount && ddUsed < ddLimit;

  let level: ChallengeLevel = "ok";
  const messages: string[] = [];
  if (ddUsed >= ddLimit || todayLossUsed >= dailyLimit) {
    level = "breached";
    messages.push(ddUsed >= ddLimit ? "Max drawdown breached — account failed." : "Firm daily loss limit hit — account breached.");
  } else if (passed) {
    level = "passed";
    messages.push("Target reached. Close the phase — do not give it back.");
  } else if (todayLossUsed >= personalDailyStop) {
    level = "daily-stop";
    messages.push("Your personal daily stop is hit. Done for today — the market opens again tomorrow.");
  } else {
    if (dailyRemaining <= dailyLimit * 0.3) { level = "warn"; messages.push("Approaching the firm's daily loss limit."); }
    if (ddRemaining <= ddLimit * 0.3) { level = "warn"; messages.push("Approaching max drawdown — reduce risk."); }
    if (level === "ok" && suggestedRiskAmount > 0 && dailyRemaining <= suggestedRiskAmount) {
      level = "warn";
      messages.push("One losing trade from the daily limit at suggested risk.");
    }
  }

  // Funded phase: payout eligibility. CFD Stellar accounts gate payouts on
  // trading days / cycles, so with no benchmarkDayTarget set we count any
  // traded day. A target (Futures Legacy/Rapid style) switches to
  // profit-qualified benchmark days.
  let benchmark: BenchmarkInfo | undefined;
  if (config.phase === "Funded") {
    const target = config.benchmarkDayTarget && config.benchmarkDayTarget > 0 ? config.benchmarkDayTarget : undefined;
    let daysHit = 0;
    let bestDay = 0;
    for (const pnl of dailyPnl.values()) {
      if (target === undefined || pnl >= target) daysHit++;
      if (pnl > bestDay) bestDay = pnl;
    }
    const bestDayPct = netPnl > 0 ? (bestDay / netPnl) * 100 : undefined;
    benchmark = {
      target: target ?? 0,
      daysHit,
      minForPayout: 5,
      fullPayoutAt: target !== undefined ? 30 : undefined,
      bestDayPct,
      consistencyCapPct: config.consistencyCapPct && config.consistencyCapPct > 0 ? config.consistencyCapPct : undefined,
      consistencyOk:
        config.consistencyCapPct && config.consistencyCapPct > 0 && bestDayPct !== undefined
          ? bestDayPct <= config.consistencyCapPct
          : undefined,
    };
  }

  return {
    config,
    startingBalance: start,
    equity,
    netPnl,
    tradeCount: trades.length,
    wins,
    losses,
    breakevens,
    targetAmount,
    toTarget,
    progressPct,
    ddLimit,
    ddUsed,
    ddRemaining,
    dailyLimit,
    personalDailyStop,
    todayPnl,
    todayLossUsed,
    dailyRemaining,
    personalRemaining,
    suggestedRiskPct,
    suggestedRiskAmount,
    estTradesToTarget,
    level,
    messages,
    benchmark,
  };
}
