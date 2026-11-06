"use client";

import { EdgeScore, SCORE_MIN_TRADES } from "@/lib/score";
import { Card, SectionTitle } from "@/components/ui/primitives";

const tone = (v: number) => (v >= 70 ? "text-pos" : v >= 45 ? "text-warn" : "text-neg");
const bar = (v: number) => (v >= 70 ? "bg-pos" : v >= 45 ? "bg-warn" : "bg-neg");

export function EdgeScoreCard({ score }: { score: EdgeScore | null }) {
  if (!score) {
    return (
      <Card>
        <SectionTitle>Edge score</SectionTitle>
        <p className="text-sm text-mute">Log {SCORE_MIN_TRADES}+ trades to get a 0–100 consistency score.</p>
      </Card>
    );
  }
  return (
    <Card>
      <SectionTitle>Edge score</SectionTitle>
      <div className="flex items-baseline gap-2">
        <span className={`font-mono text-5xl font-semibold ${tone(score.total)}`}>{score.total}</span>
        <span className="text-sm text-mute">/ 100 · {score.sample} trades</span>
      </div>
      <div className="mt-4 space-y-3">
        {score.components.map((c) => (
          <div key={c.key}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink">{c.label}</span>
              <span className={`font-mono ${tone(c.score)}`}>{Math.round(c.score)}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface">
              <div className={`h-full ${bar(c.score)}`} style={{ width: `${c.score}%` }} />
            </div>
            <p className="mt-0.5 text-[11px] text-mute">{c.detail}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
