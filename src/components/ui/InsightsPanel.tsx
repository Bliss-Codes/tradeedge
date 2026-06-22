"use client";

import { Insight } from "@/lib/insights";
import { Card, SectionTitle } from "@/components/ui/primitives";

const toneStyle: Record<Insight["tone"], { dot: string; label: string; labelCls: string }> = {
  good: { dot: "bg-pos", label: "Strength", labelCls: "text-pos" },
  bad: { dot: "bg-neg", label: "Leak", labelCls: "text-neg" },
  watch: { dot: "bg-warn", label: "Watch", labelCls: "text-warn" },
};

export function InsightsPanel({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) {
    return (
      <Card>
        <SectionTitle>What your data says</SectionTitle>
        <p className="text-sm text-mute">
          Log around five trades — with grades, stops, and targets — and TradeEdge will start telling you what to trade more, what to cut, and where your biggest leak is.
        </p>
      </Card>
    );
  }
  return (
    <Card>
      <SectionTitle>What your data says</SectionTitle>
      <div className="space-y-3">
        {insights.map((ins, i) => {
          const s = toneStyle[ins.tone];
          return (
            <div key={i} className="flex gap-3 rounded-xl border border-edge bg-surface/40 p-3.5">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${s.dot}`} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${s.labelCls}`}>{s.label}</span>
                  <span className="text-sm font-medium text-ink">{ins.title}</span>
                </div>
                <p className="mt-0.5 text-sm leading-relaxed text-mute">{ins.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-mute">Findings are drawn from your own history and need at least five trades to appear. They describe what has happened, not what will.</p>
    </Card>
  );
}
