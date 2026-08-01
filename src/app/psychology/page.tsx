"use client";

import { useMemo, useState } from "react";
import { useVisibleTrades, useDisplayCurrency } from "@/stores/useApp";
import { statsByGroup, computeStats, fmtR, fmtMoney, fmtPct, signColor } from "@/lib/metrics";
import { Card, EmptyState, SectionTitle, Stat, Tabs } from "@/components/ui/primitives";
import { GroupTable } from "@/components/ui/GroupTable";
import { BarRow } from "@/components/charts/EquityCurve";
import { DivergingBars, Donut, DivergingRow } from "@/components/charts/Primitives";

export default function PsychologyPage() {
  const trades = useVisibleTrades();
  const currency = useDisplayCurrency();
  const [view, setView] = useState("Before entry");

  const byBefore = useMemo(() => statsByGroup(trades, (t) => t.emotionBefore), [trades]);
  const byAfter = useMemo(() => statsByGroup(trades, (t) => t.emotionAfter), [trades]);
  const rows = view === "Before entry" ? byBefore : byAfter;

  const tagged = trades.filter((t) => t.emotionBefore);
  const disciplined = useMemo(
    () => computeStats(trades.filter((t) => t.emotionBefore === "Focused" || t.emotionBefore === "Neutral")),
    [trades]
  );
  const reactive = useMemo(
    () => computeStats(trades.filter((t) => t.emotionBefore && ["Fear", "FOMO", "Revenge", "Frustrated"].includes(t.emotionBefore))),
    [trades]
  );

  if (trades.length === 0) {
    return <EmptyState title="No trades yet" body="Log trades with an emotion before and after entry, and this page shows how your state of mind affects your results." />;
  }

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm text-mute">
        Every trade can carry an emotion before entry and after exit. Over time this shows which mental states make you money — and which ones quietly bleed you.
      </p>

      {tagged.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <SectionTitle>Calm vs reactive</SectionTitle>
            <DivergingBars
              rows={[
                { label: "Calm states", value: disciplined.netPnl, sub: `${disciplined.total} trades` },
                { label: "Reactive states", value: reactive.netPnl, sub: `${reactive.total} trades` },
              ]}
              format={(v) => fmtMoney(v, currency)}
            />
            <p className="mt-3 text-[11px] text-mute">
              {reactive.netPnl < 0 && disciplined.netPnl > 0
                ? "Your calm trades pay for your reactive ones. Removing the reactive column is a pay rise."
                : "Log emotion on entry to see which mental states actually make you money."}
            </p>
          </Card>
          <Card>
            <SectionTitle>State mix</SectionTitle>
            <Donut
              slices={[
                { label: "Calm (Neutral / Focused)", value: disciplined.total, color: "rgb(var(--pos))" },
                { label: "Reactive (Fear / FOMO / Revenge)", value: reactive.total, color: "rgb(var(--neg))" },
                { label: "Not logged", value: Math.max(0, trades.length - tagged.length), color: "rgb(var(--surface))" },
              ]}
              center={{ value: `${Math.round((disciplined.total / Math.max(1, disciplined.total + reactive.total)) * 100)}%`, label: "calm" }}
            />
          </Card>
        </div>
      )}

      {tagged.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Stat label="Trades with emotion logged" value={String(tagged.length)} hint={`of ${trades.length} total`} />
          <Card>
            <div className="text-xs font-medium uppercase tracking-wider text-mute">Calm states (Neutral / Focused)</div>
            <div className={`mt-2 font-mono text-xl font-semibold ${signColor(disciplined.netPnl)}`}>{fmtMoney(disciplined.netPnl, currency)}</div>
            <div className="mt-1 text-xs text-mute">{disciplined.total} trades · {fmtPct(disciplined.winRate)} WR</div>
          </Card>
          <Card>
            <div className="text-xs font-medium uppercase tracking-wider text-mute">Reactive states (Fear / FOMO / Revenge / Frustrated)</div>
            <div className={`mt-2 font-mono text-xl font-semibold ${signColor(reactive.netPnl)}`}>{fmtMoney(reactive.netPnl, currency)}</div>
            <div className="mt-1 text-xs text-mute">{reactive.total} trades · {fmtPct(reactive.winRate)} WR</div>
          </Card>
        </div>
      )}

      <Card>
        <SectionTitle action={<Tabs tabs={["Before entry", "After exit"]} active={view} onChange={setView} />}>
          Performance by emotion
        </SectionTitle>
        {rows.length === 0 ? (
          <div className="py-8 text-center text-sm text-mute">No emotions logged yet. Add them in the trade entry form.</div>
        ) : (
          <GroupTable rows={rows} keyLabel="Emotion" />
        )}
      </Card>

      {rows.length > 0 && (
        <Card>
          <SectionTitle>Net RR by emotion ({view.toLowerCase()})</SectionTitle>
          {rows.map((r) => (
            <BarRow
              key={r.key}
              label={r.key}
              value={Math.abs(r.stats.netPnl)}
              max={Math.max(...rows.map((x) => Math.abs(x.stats.netPnl)), 1)}
              display={fmtMoney(r.stats.netPnl, currency)}
              color={r.stats.netPnl >= 0 ? "#22C55E" : "#EF4444"}
            />
          ))}
        </Card>
      )}
    </div>
  );
}
