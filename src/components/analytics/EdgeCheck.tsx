"use client";

import { useMemo } from "react";
import { Trade } from "@/lib/types";
import { dedupeBySetup, setupCounts } from "@/lib/metrics";
import { Card, SectionTitle } from "@/components/ui/primitives";

/**
 * The gate before scaling: does the track record actually show an edge, and is
 * it built on enough INDEPENDENT setups to believe? Counts by setup, not by
 * fill — three accounts trading one idea is one data point, not three.
 */

const MIN_SETUPS = 50;

export function EdgeCheck({ trades }: { trades: Trade[] }) {
  const m = useMemo(() => {
    const counts = setupCounts(trades);
    const ideas = dedupeBySetup(trades).filter((t) => t.rr !== 0 || t.pnl !== 0);
    const decided = ideas.filter((t) => t.pnl !== 0);
    const wins = decided.filter((t) => t.pnl > 0);
    const losses = decided.filter((t) => t.pnl < 0);
    const winRate = decided.length ? wins.length / decided.length : 0;
    const avgWinR = wins.length ? wins.reduce((s, t) => s + Math.abs(t.rr), 0) / wins.length : 0;
    const avgLossR = losses.length ? losses.reduce((s, t) => s + Math.abs(t.rr), 0) / losses.length : 1;
    // Expectancy in R per setup — the number the whole scaling plan rests on.
    const expectancy = winRate * avgWinR - (1 - winRate) * avgLossR;
    return { counts, n: decided.length, winRate, avgWinR, avgLossR, expectancy };
  }, [trades]);

  const enoughData = m.n >= MIN_SETUPS;
  const positive = m.expectancy > 0;
  const ready = enoughData && positive;

  const verdict = !enoughData
    ? { text: "NOT ENOUGH DATA", tone: "bg-warn/15 text-warn" }
    : positive
    ? { text: "EDGE CONFIRMED", tone: "bg-pos/15 text-pos" }
    : { text: "NO EDGE YET", tone: "bg-neg/15 text-neg" };

  return (
    <Card>
      <SectionTitle action={<span className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wider ${verdict.tone}`}>{verdict.text}</span>}>
        Edge check — before you scale
      </SectionTitle>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-mute">Expectancy</div>
          <div className={`mt-2 font-mono text-2xl font-semibold ${positive ? "text-pos" : "text-neg"}`}>
            {m.expectancy >= 0 ? "+" : ""}{m.expectancy.toFixed(2)}R
          </div>
          <div className="mt-1 text-xs text-mute">per setup</div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-mute">Independent setups</div>
          <div className={`mt-2 font-mono text-2xl font-semibold ${enoughData ? "text-ink" : "text-warn"}`}>
            {m.n} <span className="text-sm text-mute">/ {MIN_SETUPS}</span>
          </div>
          <div className="mt-1 text-xs text-mute">
            {m.counts.executions !== m.counts.setups ? `${m.counts.executions} fills across accounts` : "one fill each"}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-mute">Win rate</div>
          <div className="mt-2 font-mono text-2xl font-semibold text-ink">{(m.winRate * 100).toFixed(1)}%</div>
          <div className="mt-1 text-xs text-mute">of decided setups</div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-mute">Avg winner</div>
          <div className="mt-2 font-mono text-2xl font-semibold text-ink">{m.avgWinR.toFixed(2)}R</div>
          <div className="mt-1 text-xs text-mute">avg loser {m.avgLossR.toFixed(2)}R</div>
        </div>
      </div>

      <div className="mt-5 border-t border-edge pt-4">
        {ready ? (
          <p className="text-sm text-sub">
            Your edge is positive over {m.n} independent setups. At 0.75% risk this expectancy supports buying the next challenge —
            the plan&apos;s gate is met.
          </p>
        ) : !enoughData ? (
          <p className="text-sm text-sub">
            {MIN_SETUPS - m.n} more setups needed before this number means anything. Keep trading the current account at 0.75% —
            don&apos;t buy a bigger challenge on a sample this small, however good it looks.
          </p>
        ) : (
          <p className="text-sm text-sub">
            Expectancy is negative over {m.n} setups. A bigger account multiplies this, it doesn&apos;t fix it. Fix the edge first —
            check which pairs and sessions are actually losing before spending another fee.
          </p>
        )}
      </div>
    </Card>
  );
}
