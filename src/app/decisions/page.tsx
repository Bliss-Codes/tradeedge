"use client";

import { useMemo, useState } from "react";
import { useApp, useVisibleTrades } from "@/stores/useApp";
import { Trade } from "@/lib/types";
import { isoWeekKey } from "@/lib/metrics";
import { Card, EmptyState, SectionTitle, Tabs } from "@/components/ui/primitives";

/**
 * The anti-ledger view. Everything else in the app shows outcomes (P&L, R).
 * This screen deliberately HIDES money and shows only the decision: did each
 * trade have a thesis, did you follow your plan, and — the point — what mistake
 * keeps repeating. Reviewing decisions is what changes a trader; reviewing
 * P&L just rides the rollercoaster.
 */

type Adherence = "clean" | "loose" | "broken";

function adherenceOf(t: Trade): Adherence {
  const hasThesis = Boolean((t.thesis ?? "").trim());
  const checks = [t.followedPlan, t.respectedRisk, t.waitedForConfirmation, t.followedHtfBias];
  const known = checks.filter((c) => c !== undefined) as boolean[];
  const brokeSomething = known.some((c) => c === false) || t.violations.length > 0 || !hasThesis;
  if (!hasThesis || t.followedPlan === false || t.violations.length > 1) return "broken";
  if (brokeSomething) return "loose";
  return "clean";
}

const ADH_TONE: Record<Adherence, { label: string; dot: string; text: string }> = {
  clean: { label: "Followed plan", dot: "bg-pos", text: "text-pos" },
  loose: { label: "Slipped", dot: "bg-warn", text: "text-warn" },
  broken: { label: "Broke plan", dot: "bg-neg", text: "text-neg" },
};

/** Tally the mistakes so the repeating one is unmissable. */
function repeatingMistakes(trades: Trade[]): { label: string; count: number }[] {
  const tally = new Map<string, number>();
  const bump = (k: string) => tally.set(k, (tally.get(k) ?? 0) + 1);
  for (const t of trades) {
    if (!(t.thesis ?? "").trim()) bump("Entered with no thesis");
    if (t.respectedRisk === false) bump("Broke risk rules");
    if (t.waitedForConfirmation === false) bump("Entered before confirmation");
    if (t.followedHtfBias === false) bump("Traded against HTF bias");
    if (t.followedPlan === false) bump("Deviated from the plan");
    for (const v of t.violations) bump(v);
  }
  return [...tally.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
}

export default function DecisionsPage() {
  const allLive = useVisibleTrades();
  const [scope, setScope] = useState("This week");

  const weeks = useMemo(() => {
    const now = new Date();
    const thisWeek = isoWeekKey(now);
    const lastWeek = isoWeekKey(new Date(now.getTime() - 7 * 86400000));
    return { thisWeek, lastWeek };
  }, []);

  const trades = useMemo(() => {
    const sorted = [...allLive].sort((a, b) => b.date.localeCompare(a.date));
    if (scope === "This week") return sorted.filter((t) => isoWeekKey(new Date(t.date)) === weeks.thisWeek);
    if (scope === "Last week") return sorted.filter((t) => isoWeekKey(new Date(t.date)) === weeks.lastWeek);
    return sorted.slice(0, 20); // "Last 20"
  }, [allLive, scope, weeks]);

  const mistakes = useMemo(() => repeatingMistakes(trades), [trades]);
  const counts = useMemo(() => {
    const c = { clean: 0, loose: 0, broken: 0 };
    for (const t of trades) c[adherenceOf(t)]++;
    return c;
  }, [trades]);
  const adherenceRate = trades.length ? Math.round((counts.clean / trades.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs tabs={["This week", "Last week", "Last 20"]} active={scope} onChange={setScope} />
        <div className="text-xs text-mute">Money is hidden here on purpose — this is about the decision, not the result.</div>
      </div>

      {trades.length === 0 ? (
        <EmptyState title="No trades in this window" body="Log some trades, then come here to review the decisions behind them — not the P&L." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <div className="text-xs font-medium uppercase tracking-wider text-mute">Adherence</div>
              <div className={`mt-2 font-mono text-3xl font-semibold ${adherenceRate >= 90 ? "text-pos" : adherenceRate >= 70 ? "text-warn" : "text-neg"}`}>
                {adherenceRate}%
              </div>
              <div className="mt-1 text-xs text-mute">
                {counts.clean} followed · {counts.loose} slipped · {counts.broken} broke
              </div>
              <p className="mt-2 text-[11px] text-mute">Target 90%+. This is your real scorecard — a disciplined loss still counts as followed.</p>
            </Card>

            <Card className="sm:col-span-2">
              <SectionTitle>Your repeating mistake</SectionTitle>
              {mistakes.length === 0 ? (
                <p className="text-sm text-pos">Nothing broken this window. Every trade had a thesis and held its rules — this is the version of you that wins.</p>
              ) : (
                <div className="space-y-2">
                  {mistakes.slice(0, 4).map((m, i) => (
                    <div key={m.label} className="flex items-center gap-3">
                      <div className="w-6 text-center font-mono text-xs text-mute">{m.count}×</div>
                      <div className={`flex-1 text-sm ${i === 0 ? "font-semibold text-neg" : "text-sub"}`}>{m.label}</div>
                      {i === 0 && <span className="rounded-full bg-neg/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neg">fix this</span>}
                    </div>
                  ))}
                  <p className="mt-2 border-t border-edge pt-2 text-[11px] text-mute">
                    The top row is the one thing to eliminate next week. One fix beats ten resolutions.
                  </p>
                </div>
              )}
            </Card>
          </div>

          <Card>
            <SectionTitle action={<span className="text-xs text-mute">{trades.length} decision{trades.length === 1 ? "" : "s"}</span>}>
              The decisions
            </SectionTitle>
            <div className="space-y-2">
              {trades.map((t) => {
                const a = adherenceOf(t);
                const tone = ADH_TONE[a];
                const thesis = (t.thesis ?? "").trim();
                return (
                  <div key={t.id} className="flex items-start gap-3 rounded-xl border border-edge bg-surface/40 px-4 py-3">
                    <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${tone.dot}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs text-mute">
                        <span className="font-mono">{new Date(t.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                        <span className="font-medium text-sub">{t.pair}</span>
                        <span>{t.direction}</span>
                        <span>·</span>
                        <span>{t.session}</span>
                        <span className={`ml-auto font-medium ${tone.text}`}>{tone.label}</span>
                      </div>
                      <div className={`mt-1 text-sm ${thesis ? "text-ink" : "text-neg italic"}`}>
                        {thesis || "No thesis logged — this is a gamble, not a setup."}
                      </div>
                      {t.violations.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {t.violations.map((v) => (
                            <span key={v} className="rounded-full bg-neg/10 px-2 py-0.5 text-[10px] text-neg">{v}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
