"use client";

import { useMemo, useState } from "react";
import { useApp, useVisibleTrades, useDisplayCurrency } from "@/stores/useApp";
import { Trade } from "@/lib/types";
import { computeStats, fmtPct, fmtR, fmtMoney, signColor } from "@/lib/metrics";
import { Button, Card, Modal, OutcomePill, Tabs } from "@/components/ui/primitives";
import { TradeDetail } from "@/components/trades/TradeDetail";
import { DayReviewModal } from "@/components/trades/DayReviewModal";

const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function DayTradesModal({ date, trades, onClose, onSelect, onReview, currency }: { date: string; trades: Trade[]; onClose: () => void; onSelect: (t: Trade) => void; onReview: () => void; currency: string }) {
  const s = computeStats(trades);
  return (
    <Modal open onClose={onClose} title={new Date(date + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-4 text-sm text-mute">
          <span>{s.total} trades</span>
          <span>{fmtPct(s.winRate)} WR</span>
          <span className={`font-mono ${signColor(s.netPnl)}`}>{fmtMoney(s.netPnl, currency)}</span>
        </div>
        <Button variant="ghost" onClick={onReview}>Review this day</Button>
      </div>
      <div className="divide-y divide-edge/50">
        {trades.map((t) => (
          <button key={t.id} onClick={() => onSelect(t)} className="flex w-full items-center justify-between py-3 text-left hover:bg-surface/40">
            <div>
              <span className="text-sm font-medium text-ink">{t.pair}</span>
              <span className="ml-2 text-xs text-mute">{t.session} · {t.direction}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-mono text-sm ${signColor(t.pnl)}`}>{t.pnl !== 0 ? fmtMoney(t.pnl, currency) : fmtR(t.rr)}</span>
              <OutcomePill rr={t.rr} pnl={t.pnl} />
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}

export default function CalendarPage() {
  const trades = useVisibleTrades();
  const reviews = useApp((s) => s.reviews);
  const currency = useDisplayCurrency();
  const [view, setView] = useState("Monthly");
  const [cursor, setCursor] = useState(() => new Date());
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [selected, setSelected] = useState<Trade | null>(null);
  const [reviewDay, setReviewDay] = useState<string | null>(null);

  const reviewedDays = useMemo(() => new Set(reviews.map((r) => r.date)), [reviews]);

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

  const move = (delta: number) => {
    const d = new Date(cursor);
    if (view === "Monthly") d.setMonth(d.getMonth() + delta);
    else if (view === "Weekly") d.setDate(d.getDate() + delta * 7);
    else d.setDate(d.getDate() + delta);
    setCursor(d);
  };

  const DayCell = ({ date, tall }: { date: Date; tall?: boolean }) => {
    const k = dayKey(date);
    const dayTrades = byDay.get(k) ?? [];
    const net = dayTrades.reduce((a, t) => a + t.pnl, 0);
    const inMonth = date.getMonth() === cursor.getMonth();
    const isToday = k === dayKey(new Date());
    const reviewed = reviewedDays.has(k);
    return (
      <button
        onClick={() => setOpenDay(k)}
        className={`relative flex flex-col rounded-xl border p-2 text-left transition-colors hover:border-accent/40 ${tall ? "min-h-28" : "min-h-20"} ${
          isToday ? "border-accent/50" : "border-edge"
        } ${dayTrades.length === 0 ? "bg-surface/30" : net > 0 ? "bg-pos/10" : net < 0 ? "bg-neg/10" : "bg-card"} ${
          inMonth || view !== "Monthly" ? "" : "opacity-35"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs ${isToday ? "font-semibold text-accent" : "text-mute"}`}>{date.getDate()}</span>
          {reviewed && <span className="h-1.5 w-1.5 rounded-full bg-accent" title="Reviewed" />}
        </div>
        {dayTrades.length > 0 && (
          <>
            <span className={`mt-auto font-mono text-sm font-medium ${signColor(net)}`}>{fmtMoney(net, currency)}</span>
            <span className="text-[10px] text-mute">{dayTrades.length} trade{dayTrades.length === 1 ? "" : "s"}</span>
          </>
        )}
      </button>
    );
  };

  let body: React.ReactNode;
  let heading: string;

  if (view === "Monthly") {
    heading = cursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = new Date(first);
    start.setDate(start.getDate() - ((first.getDay() + 6) % 7));
    const cells: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      cells.push(d);
    }
    // week rows of 7 + stats per week (count only current-month days)
    const weekRows = Array.from({ length: 6 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
    const weekStats = weekRows.map((row) => {
      let pnl = 0;
      let count = 0;
      for (const d of row) {
        if (d.getMonth() !== cursor.getMonth()) continue;
        const dayTrades = byDay.get(dayKey(d)) ?? [];
        pnl += dayTrades.reduce((a, t) => a + t.pnl, 0);
        count += dayTrades.length;
      }
      return { pnl, count };
    });
    const monthPnl = weekStats.reduce((a, w) => a + w.pnl, 0);
    const monthCount = weekStats.reduce((a, w) => a + w.count, 0);
    const weekTone = (v: number, c: number) =>
      c === 0 ? "border-edge bg-surface/30 text-mute" : v > 0 ? "border-pos/40 bg-pos/10 text-pos" : v < 0 ? "border-neg/40 bg-neg/10 text-neg" : "border-edge bg-surface/40 text-mute";
    body = (
      <>
        <div className="mb-2 grid grid-cols-[repeat(7,1fr)_88px] gap-2 text-center text-xs uppercase tracking-wider text-mute">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d}>{d}</div>)}
          <div>Total</div>
        </div>
        <div className="space-y-2">
          {weekRows.map((row, w) => (
            <div key={w} className="grid grid-cols-[repeat(7,1fr)_88px] gap-2">
              {row.map((d) => <DayCell key={d.toISOString()} date={d} />)}
              <div className={`flex flex-col items-start justify-between rounded-xl border p-2 ${weekTone(weekStats[w].pnl, weekStats[w].count)}`}>
                <div className="flex w-full items-center justify-between text-[10px] text-mute">
                  <span>{weekStats[w].count} trade{weekStats[w].count === 1 ? "" : "s"}</span>
                  <span>w{w + 1}</span>
                </div>
                <span className="font-mono text-sm font-semibold">{weekStats[w].count > 0 ? fmtMoney(weekStats[w].pnl, currency) : "—"}</span>
              </div>
            </div>
          ))}
        </div>
        <div className={`mt-3 flex items-center justify-end gap-3 rounded-xl border px-4 py-2.5 ${weekTone(monthPnl, monthCount)}`}>
          <span className="text-xs text-mute">Month total:</span>
          <span className="font-mono text-base font-bold">{fmtMoney(monthPnl, currency)}</span>
          <span className="text-xs text-mute">{monthCount} trade{monthCount === 1 ? "" : "s"}</span>
        </div>
      </>
    );
  } else if (view === "Weekly") {
    const start = new Date(cursor);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    heading = `${start.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
    const cells = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
    body = (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {cells.map((d) => <DayCell key={d.toISOString()} date={d} tall />)}
      </div>
    );
  } else {
    heading = cursor.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const k = dayKey(cursor);
    const dayTrades = byDay.get(k) ?? [];
    const s = computeStats(dayTrades);
    const dayReview = reviews.find((r) => r.date === k);
    body = (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex gap-5 text-sm text-mute">
            <span>{s.total} trades</span>
            <span>{dayTrades.length ? fmtPct(s.winRate) + " WR" : "—"}</span>
            <span className={`font-mono ${signColor(s.netPnl)}`}>{fmtMoney(s.netPnl, currency)}</span>
          </div>
          <Button variant="ghost" onClick={() => setReviewDay(k)}>{dayReview ? "Edit review" : "Review this day"}</Button>
        </div>
        {dayReview && (
          <div className="rounded-xl border border-edge bg-surface/40 p-4 text-sm">
            <div className="mb-2 flex items-center gap-3 text-xs text-mute">
              {dayReview.disciplineRating && <span>Discipline {dayReview.disciplineRating}/5</span>}
              {dayReview.followedPlan !== undefined && <span className={dayReview.followedPlan ? "text-pos" : "text-neg"}>{dayReview.followedPlan ? "Followed plan" : "Off plan"}</span>}
              {dayReview.mood && <span>{dayReview.mood}</span>}
            </div>
            {dayReview.wentWell && <p className="text-sub"><span className="text-mute">Did well:</span> {dayReview.wentWell}</p>}
            {dayReview.toImprove && <p className="mt-1 text-sub"><span className="text-mute">Improve:</span> {dayReview.toImprove}</p>}
          </div>
        )}
        {dayTrades.length === 0 ? (
          <div className="py-8 text-center text-sm text-mute">No trades on this day.</div>
        ) : (
          <div className="divide-y divide-edge/50">
            {dayTrades.map((t) => (
              <button key={t.id} onClick={() => setSelected(t)} className="flex w-full items-center justify-between py-3 text-left hover:bg-surface/40">
                <div>
                  <span className="text-sm font-medium text-ink">{t.pair}</span>
                  <span className="ml-2 text-xs text-mute">{t.session} · {t.direction}</span>
                </div>
                <span className={`font-mono text-sm ${signColor(t.pnl)}`}>{t.pnl !== 0 ? fmtMoney(t.pnl, currency) : fmtR(t.rr)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs tabs={["Daily", "Weekly", "Monthly"]} active={view} onChange={setView} />
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => move(-1)}>←</Button>
          <span className="min-w-44 text-center text-sm font-medium text-ink">{heading}</span>
          <Button variant="ghost" onClick={() => move(1)}>→</Button>
          <Button variant="subtle" onClick={() => setCursor(new Date())}>Today</Button>
        </div>
      </div>
      <Card>{body}</Card>

      {openDay && (
        <DayTradesModal
          date={openDay}
          trades={byDay.get(openDay) ?? []}
          currency={currency}
          onClose={() => setOpenDay(null)}
          onSelect={(t) => {
            setOpenDay(null);
            setSelected(t);
          }}
          onReview={() => {
            const d = openDay;
            setOpenDay(null);
            setReviewDay(d);
          }}
        />
      )}
      {selected && <TradeDetail trade={selected} onClose={() => setSelected(null)} />}
      {reviewDay && <DayReviewModal date={reviewDay} onClose={() => setReviewDay(null)} />}
    </div>
  );
}
