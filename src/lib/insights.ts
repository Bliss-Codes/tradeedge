import { Trade, Strategy } from "@/lib/types";
import { computeStats, statsByGroup, executionSummary, fmtR, fmtPct } from "@/lib/metrics";

export type InsightTone = "good" | "bad" | "watch";

export interface Insight {
  tone: InsightTone;
  title: string;
  detail: string;
  impactR: number; // absolute R weight, used for ranking
}

const MIN_SAMPLE = 5; // never draw conclusions from fewer trades than this

/**
 * Turns a trader's history into a short, ranked list of plain-language findings.
 * Everything is descriptive of the trader's own past results — not advice or a
 * prediction. Findings below MIN_SAMPLE are suppressed so noise doesn't pose as edge.
 */
export function buildInsights(trades: Trade[], strategies: Strategy[]): Insight[] {
  const insights: Insight[] = [];
  if (trades.length < MIN_SAMPLE) return insights;

  const named = (id?: string) => (id ? strategies.find((s) => s.id === id)?.name ?? "Unknown" : "No strategy");

  // Build candidate groups across the dimensions that matter most.
  const groups = [
    ...statsByGroup(trades, (t) => `${t.pair} · ${t.session}`).map((r) => ({ label: r.key, ...r })),
    ...statsByGroup(trades, (t) => t.pair).map((r) => ({ label: r.key, ...r })),
    ...statsByGroup(trades, (t) => named(t.strategyId)).map((r) => ({ label: r.key, ...r })),
  ].filter((g) => g.stats.total >= MIN_SAMPLE);

  // Best edge — keep doing / size into this.
  const best = [...groups].sort((a, b) => b.stats.netRR / b.stats.total - a.stats.netRR / a.stats.total)[0];
  if (best && best.stats.netRR > 0) {
    insights.push({
      tone: "good",
      title: `Your strongest edge: ${best.label}`,
      detail: `${best.stats.total} trades · ${fmtPct(best.stats.winRate)} win rate · ${best.stats.avgRR.toFixed(2)}R per trade · ${fmtR(best.stats.netRR)} net. This is where your money is made.`,
      impactR: Math.abs(best.stats.netRR),
    });
  }

  // Worst drag — candidate to cut from the system.
  const worst = [...groups].sort((a, b) => a.stats.netRR / a.stats.total - b.stats.netRR / b.stats.total)[0];
  if (worst && worst.stats.netRR < 0 && worst.label !== best?.label) {
    insights.push({
      tone: "bad",
      title: `Biggest drag: ${worst.label}`,
      detail: `${worst.stats.total} trades · ${fmtPct(worst.stats.winRate)} win rate · ${fmtR(worst.stats.netRR)} net. Removing setups like this would have lifted your bottom line.`,
      impactR: Math.abs(worst.stats.netRR),
    });
  }

  // Discipline gap — rules vs no rules.
  const clean = computeStats(trades.filter((t) => t.violations.length === 0));
  const dirty = computeStats(trades.filter((t) => t.violations.length > 0));
  if (dirty.total >= MIN_SAMPLE) {
    const gap = clean.avgRR - dirty.avgRR;
    insights.push({
      tone: dirty.netRR < 0 ? "bad" : "watch",
      title: "Rule-breaking trades cost you",
      detail: `${dirty.total} trades broke a rule and ran ${dirty.avgRR.toFixed(2)}R each, vs ${clean.avgRR.toFixed(2)}R when you followed your plan — a ${gap.toFixed(2)}R gap per trade. Their total impact: ${fmtR(dirty.netRR)}.`,
      impactR: Math.abs(dirty.netRR) + Math.abs(gap) * dirty.total,
    });
  }

  // Specific worst violation.
  const vRows = statsByGroup(
    trades.filter((t) => t.violations.length).flatMap((t) => t.violations.map((v) => ({ ...t, _v: v }))),
    (t) => (t as { _v?: string })._v
  ).filter((r) => r.stats.netRR < 0);
  const worstV = vRows.sort((a, b) => a.stats.netRR - b.stats.netRR)[0];
  if (worstV) {
    insights.push({
      tone: "bad",
      title: `"${worstV.key}" is your costliest mistake`,
      detail: `It appears in ${worstV.stats.total} trades for ${fmtR(worstV.stats.netRR)}. Cutting this one habit is the fastest win available to you.`,
      impactR: Math.abs(worstV.stats.netRR) + 2,
    });
  }

  // Execution leaks.
  const ex = executionSummary(trades);
  if (ex.sampled >= MIN_SAMPLE) {
    if (ex.cutEarly >= 2 && ex.cutEarlyCostR > 1) {
      insights.push({
        tone: "watch",
        title: "You cut winners early",
        detail: `On ${ex.cutEarly} trades you exited well before target, leaving about ${ex.cutEarlyCostR.toFixed(1)}R on the table. Your winners want more room.`,
        impactR: ex.cutEarlyCostR,
      });
    }
    if (ex.letRun >= 2 && ex.letRunCostR > 1) {
      insights.push({
        tone: "bad",
        title: "You let losers run past stop",
        detail: `${ex.letRun} trades lost more than 1R — roughly ${ex.letRunCostR.toFixed(1)}R of avoidable damage from moved stops or oversizing. Honor the stop.`,
        impactR: ex.letRunCostR + 1,
      });
    }
  }

  // Grade integrity — do your A+ calls actually outperform?
  const aPlus = computeStats(trades.filter((t) => t.grade === "A+"));
  const lower = computeStats(trades.filter((t) => t.grade === "B" || t.grade === "C"));
  if (aPlus.total >= MIN_SAMPLE && lower.total >= MIN_SAMPLE) {
    if (aPlus.avgRR <= lower.avgRR) {
      insights.push({
        tone: "watch",
        title: "Your grading needs recalibrating",
        detail: `A+ setups returned ${aPlus.avgRR.toFixed(2)}R vs ${lower.avgRR.toFixed(2)}R for B/C — your top grade isn't your best outcome. Re-examine what earns an A+.`,
        impactR: 3,
      });
    } else {
      insights.push({
        tone: "good",
        title: "Your A+ grading is honest",
        detail: `A+ setups returned ${aPlus.avgRR.toFixed(2)}R vs ${lower.avgRR.toFixed(2)}R for B/C. Your judgment of a good setup holds up — trust it and be selective.`,
        impactR: 2,
      });
    }
  }

  return insights.sort((a, b) => b.impactR - a.impactR).slice(0, 6);
}
