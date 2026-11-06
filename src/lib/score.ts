import { Trade } from "@/lib/types";
import { computeStats, ruleAdherence } from "@/lib/metrics";

export interface ScoreComponent {
  key: "adherence" | "profitFactor" | "expectancy" | "drawdown" | "riskConsistency";
  label: string;
  score: number; // 0–100
  weight: number; // original weight before redistribution
  detail: string;
}

export interface EdgeScore {
  total: number; // 0–100
  components: ScoreComponent[];
  sample: number;
}

export const SCORE_MIN_TRADES = 10;

const clamp = (v: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, v));
const lerp = (v: number, from: number, to: number) => clamp(((v - from) / (to - from)) * 100);

/**
 * One 0–100 number summarising consistency, not just profit.
 * Components with too little data are dropped and the remaining weights are
 * renormalised, so a missing input never silently counts as zero.
 * Trades with unknown R are excluded from the R-based parts by computeStats.
 */
export function computeEdgeScore(trades: Trade[]): EdgeScore | null {
  if (trades.length < SCORE_MIN_TRADES) return null;
  const s = computeStats(trades);
  const comps: ScoreComponent[] = [];

  const adh = ruleAdherence(trades);
  comps.push({ key: "adherence", label: "Rule adherence", weight: 30, score: clamp(adh), detail: `${adh.toFixed(0)}% of trades followed the plan` });

  const pf = Number.isFinite(s.profitFactor) ? s.profitFactor : 3;
  comps.push({ key: "profitFactor", label: "Profit factor", weight: 20, score: lerp(pf, 0.8, 2.5), detail: `${Number.isFinite(s.profitFactor) ? s.profitFactor.toFixed(2) : "∞"} (100 at 2.5+)` });

  comps.push({ key: "expectancy", label: "Expectancy", weight: 20, score: lerp(s.avgRR, -0.2, 0.6), detail: `${s.avgRR.toFixed(2)}R per trade (100 at 0.6R+)` });

  comps.push({ key: "drawdown", label: "Drawdown control", weight: 15, score: 100 - lerp(s.maxDrawdownR, 3, 15), detail: `${s.maxDrawdownR.toFixed(1)}R max drawdown (0 at 15R+)` });

  // Risk consistency: how stable the amount risked per trade is (needs 5+ trades with risk data).
  const risks = trades.map((t) => t.riskAmount).filter((v): v is number => typeof v === "number" && v > 0);
  if (risks.length >= 5) {
    const mean = risks.reduce((a, b) => a + b, 0) / risks.length;
    const sd = Math.sqrt(risks.reduce((a, b) => a + (b - mean) ** 2, 0) / risks.length);
    const cv = mean > 0 ? sd / mean : 0;
    comps.push({ key: "riskConsistency", label: "Risk consistency", weight: 15, score: 100 - lerp(cv, 0.1, 0.8), detail: `${(cv * 100).toFixed(0)}% variation in risk per trade` });
  }

  const totalWeight = comps.reduce((a, c) => a + c.weight, 0);
  const total = comps.reduce((a, c) => a + c.score * c.weight, 0) / totalWeight;
  return { total: Math.round(total), components: comps, sample: trades.length };
}
