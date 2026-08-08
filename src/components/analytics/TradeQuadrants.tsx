"use client";

import { useMemo, useState } from "react";
import { Trade } from "@/lib/types";
import {
  TRADE_TYPES,
  TradeType,
  quadrantBreakdown,
  quadrantOf,
  fmtMoney,
  fmtR,
} from "@/lib/metrics";
import { Card, SectionTitle } from "@/components/ui/primitives";

const TONE: Record<string, { text: string; border: string; bg: string; dot: string }> = {
  pos: { text: "text-pos", border: "border-pos/40", bg: "bg-pos/[0.04]", dot: "bg-pos" },
  mute: { text: "text-sub", border: "border-edge", bg: "bg-surface/40", dot: "bg-mute" },
  warn: { text: "text-warn", border: "border-warn/40", bg: "bg-warn/[0.05]", dot: "bg-warn" },
  neg: { text: "text-neg", border: "border-neg/40", bg: "bg-neg/[0.04]", dot: "bg-neg" },
};

export function TradeQuadrants({ trades, currency = "USD" }: { trades: Trade[]; currency?: string }) {
  const [open, setOpen] = useState<TradeType | null>(null);
  const b = useMemo(() => quadrantBreakdown(trades), [trades]);
  const byType = useMemo(() => {
    const m = new Map<TradeType, Trade[]>();
    for (const t of trades) {
      const k = quadrantOf(t);
      m.set(k, [...(m.get(k) ?? []), t]);
    }
    return m;
  }, [trades]);

  if (trades.length === 0) return null;

  return (
    <Card>
      <SectionTitle
        action={
          <span className="text-xs text-mute">
            {b.classified} classified{b.unclassified > 0 ? ` · ${b.unclassified} need review` : ""}
          </span>
        }
      >
        Trade types — process vs outcome
      </SectionTitle>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TRADE_TYPES.map((meta) => {
          const row = b.rows.find((r) => r.key === meta.key)!;
          const tone = TONE[meta.tone];
          const isOpen = open === meta.key;
          return (
            <div key={meta.key} className={`rounded-xl border ${tone.border} ${tone.bg} p-4`}>
              <button onClick={() => setOpen(isOpen ? null : meta.key)} className="w-full text-left">
                <div className="flex items-baseline justify-between gap-2">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${tone.text}`}>{meta.short}</span>
                  <span className="font-mono text-lg font-semibold text-ink">{row.n}</span>
                </div>
                <div className="mt-0.5 text-sm text-sub">{meta.label}</div>
                <div className="mt-2 flex items-center gap-3 font-mono text-xs">
                  <span className={row.r >= 0 ? "text-pos" : "text-neg"}>{fmtR(row.r)}</span>
                  <span className="text-mute">{fmtMoney(row.pnl, currency)}</span>
                  <span className="ml-auto text-mute">{row.share.toFixed(0)}%</span>
                </div>
              </button>
              <p className="mt-2.5 border-t border-edge/60 pt-2 text-[11px] leading-snug text-mute">{meta.verdict}</p>

              {isOpen && (
                <div className="mt-2.5 space-y-1.5 border-t border-edge/60 pt-2.5">
                  {(byType.get(meta.key) ?? []).slice(0, 8).map((t) => (
                    <div key={t.id} className="flex items-center gap-2 text-[11px]">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`} />
                      <span className="font-medium text-sub">{t.pair}</span>
                      <span className="text-mute">{new Date(t.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                      <span className={`ml-auto font-mono ${t.rr >= 0 ? "text-pos" : "text-neg"}`}>{t.rr.toFixed(2)}R</span>
                    </div>
                  ))}
                  {(byType.get(meta.key)?.length ?? 0) > 8 && (
                    <div className="text-[11px] text-mute">+{(byType.get(meta.key)?.length ?? 0) - 8} more</div>
                  )}
                  {(byType.get(meta.key)?.length ?? 0) === 0 && (
                    <div className="text-[11px] text-mute">None in this period.</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 border-t border-edge pt-4 sm:grid-cols-2">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-mute">Process quality</div>
          <div className={`mt-1 font-mono text-2xl font-semibold ${b.processQuality >= 90 ? "text-pos" : b.processQuality >= 70 ? "text-warn" : "text-neg"}`}>
            {b.processQuality.toFixed(0)}%
          </div>
          <p className="mt-1 text-[11px] text-mute">
            Types 1 and 2 as a share of classified trades — how often you actually ran your system, regardless of result.
          </p>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-mute">Winners from broken process</div>
          <div className={`mt-1 font-mono text-2xl font-semibold ${b.luckShare === 0 ? "text-pos" : b.luckShare < 25 ? "text-warn" : "text-neg"}`}>
            {b.luckShare.toFixed(0)}%
          </div>
          <p className="mt-1 text-[11px] text-mute">
            Share of your wins that were Type 3. High here means the market is paying you for habits that will eventually cost you.
          </p>
        </div>
      </div>
    </Card>
  );
}
