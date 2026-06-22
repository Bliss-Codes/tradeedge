"use client";

import { useMemo, useState } from "react";
import { Trade, DayReview } from "@/lib/types";
import { computeStats, fmtPct, fmtR, signColor } from "@/lib/metrics";
import { Button, Card, Modal, OutcomePill, SectionTitle } from "@/components/ui/primitives";

const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function MonthCalendar({
  trades,
  reviews,
  onSelectTrade,
}: {
  trades: Trade[];
  reviews: DayReview[];
  onSelectTrade: (t: Trade) => void;
}) {
  const [cursor, setCursor] = useState(() => new Date());
  const [openDay, setOpenDay] = useState<string | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<string, Trade[]>();
    for (const t of trades) {
      const k = dayKey(new Date(t.date));
      const arr = map.get(k) ?? [];
      arr.push(t);
      map.set(k, arr);
    }
    return map;
  }, [trades]);

  const reviewedDays = useMemo(() => new Set(reviews.map((r) => r.date)), [reviews]);

  const monthTrades = useMemo(
    () => trades.filter((t) => { const d = new Date(t.date); return d.getMonth() === cursor.getMonth() && d.getFullYear() === cursor.getFullYear(); }),
    [trades, cursor]
  );
  const monthStats = computeStats(monthTrades);

  const cells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = new Date(first);
    start.setDate(start.getDate() - ((first.getDay() + 6) % 7));
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [cursor]);

  const move = (delta: number) => {
    const d = new Date(cursor);
    d.setMonth(d.getMonth() + delta);
    setCursor(d);
  };

  const openDayTrades = openDay ? byDay.get(openDay) ?? [] : [];

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-widest text-mute">{cursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</h2>
          <div className="mt-1 flex gap-4 text-xs text-mute">
            <span>{monthStats.total} trades</span>
            <span>{monthStats.total ? fmtPct(monthStats.winRate) + " WR" : "—"}</span>
            <span className={`font-mono ${signColor(monthStats.netRR)}`}>{fmtR(monthStats.netRR)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" onClick={() => move(-1)}>←</Button>
          <Button variant="subtle" onClick={() => setCursor(new Date())}>Today</Button>
          <Button variant="ghost" onClick={() => move(1)}>→</Button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-[10px] uppercase tracking-wider text-mute">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((d) => {
          const k = dayKey(d);
          const dayTrades = byDay.get(k) ?? [];
          const net = dayTrades.reduce((a, t) => a + t.rr, 0);
          const inMonth = d.getMonth() === cursor.getMonth();
          const isToday = k === dayKey(new Date());
          const reviewed = reviewedDays.has(k);
          return (
            <button
              key={k}
              onClick={() => dayTrades.length && setOpenDay(k)}
              className={`relative flex min-h-16 flex-col rounded-lg border p-1.5 text-left transition-colors ${
                dayTrades.length ? "cursor-pointer hover:border-accent/40" : "cursor-default"
              } ${isToday ? "border-accent/50" : "border-edge"} ${
                dayTrades.length === 0 ? "bg-surface/30" : net > 0 ? "bg-pos/10" : net < 0 ? "bg-neg/10" : "bg-card"
              } ${inMonth ? "" : "opacity-35"}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] ${isToday ? "font-semibold text-accent" : "text-mute"}`}>{d.getDate()}</span>
                {reviewed && <span className="h-1.5 w-1.5 rounded-full bg-accent" title="Reviewed" />}
              </div>
              {dayTrades.length > 0 && (
                <div className="mt-auto">
                  <div className={`font-mono text-xs font-medium ${signColor(net)}`}>{fmtR(net)}</div>
                  <div className="text-[9px] text-mute">{dayTrades.length}t</div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {openDay && (
        <Modal open onClose={() => setOpenDay(null)} title={new Date(openDay + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}>
          <div className="divide-y divide-edge/50">
            {openDayTrades.map((t) => (
              <button
                key={t.id}
                onClick={() => { setOpenDay(null); onSelectTrade(t); }}
                className="flex w-full items-center justify-between py-3 text-left hover:bg-surface/40"
              >
                <div>
                  <span className="text-sm font-medium text-ink">{t.pair}</span>
                  <span className="ml-2 text-xs text-mute">{t.session} · {t.direction}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-sm ${signColor(t.rr)}`}>{fmtR(t.rr)}</span>
                  <OutcomePill rr={t.rr} pnl={t.pnl} />
                </div>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </Card>
  );
}
