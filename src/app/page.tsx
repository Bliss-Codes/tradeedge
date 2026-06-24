"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp, useVisibleTrades } from "@/stores/useApp";
import { computeStats, equityCurve, dailyPnl, fmtPF, fmtPct, fmtR, fmtDate, ruleAdherence, signColor } from "@/lib/metrics";
import { buildInsights } from "@/lib/insights";
import { Button, Card, EmptyState, OutcomePill, SectionTitle, Stat } from "@/components/ui/primitives";
import { InsightsPanel } from "@/components/ui/InsightsPanel";
import { EquityCurve, DailyPnlBars } from "@/components/charts/EquityCurve";
import { MonthCalendar } from "@/components/charts/MonthCalendar";
import { RiskBanner } from "@/components/layout/RiskBanner";
import { TradeModal } from "@/components/trades/TradeModal";
import { TradeDetail } from "@/components/trades/TradeDetail";
import { DayReviewModal } from "@/components/trades/DayReviewModal";
import { Trade } from "@/lib/types";

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function startOfWeek(d: Date) {
  const x = startOfDay(d);
  const day = (x.getDay() + 6) % 7; // Monday start
  x.setDate(x.getDate() - day);
  return x;
}
function startOfMonth(d: Date) {
  const x = startOfDay(d);
  x.setDate(1);
  return x;
}

function PeriodCard({ label, trades }: { label: string; trades: Trade[] }) {
  const s = computeStats(trades);
  return (
    <Card>
      <div className="text-xs font-medium uppercase tracking-wider text-mute">{label}</div>
      <div className={`mt-2 font-mono text-xl font-semibold ${signColor(s.netRR)}`}>{fmtR(s.netRR)}</div>
      <div className="mt-1 text-xs text-mute">
        {s.total} trade{s.total === 1 ? "" : "s"} · {s.total ? fmtPct(s.winRate) + " win rate" : "no trades yet"}
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const trades = useVisibleTrades();
  const hasAnyData = useApp((s) => s.trades.length > 0 || s.accounts.length > 0);
  const loadSample = useApp((s) => s.loadSampleData);
  const strategies = useApp((s) => s.strategies);
  const reviews = useApp((s) => s.reviews);
  const [logOpen, setLogOpen] = useState(false);
  const [selected, setSelected] = useState<Trade | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  const stats = useMemo(() => computeStats(trades), [trades]);
  const adherence = useMemo(() => ruleAdherence(trades), [trades]);
  const curve = useMemo(() => equityCurve(trades, "pnl"), [trades]);
  const daily = useMemo(() => dailyPnl(trades), [trades]);
  const recent = useMemo(() => [...trades].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8), [trades]);
  const insights = useMemo(() => buildInsights(trades, strategies), [trades, strategies]);
  const reviewedToday = reviews.some((r) => r.date === todayKey());

  const now = new Date();
  const today = trades.filter((t) => new Date(t.date) >= startOfDay(now));
  const week = trades.filter((t) => new Date(t.date) >= startOfWeek(now));
  const month = trades.filter((t) => new Date(t.date) >= startOfMonth(now));

  if (!hasAnyData) {
    return (
      <EmptyState
        title="Welcome to TradeEdge"
        body="Your journal is empty. Create an account and log your first trade, or load sample data to explore the workstation."
        action={
          <div className="flex gap-2">
            <Button onClick={loadSample}>Load sample data</Button>
            <Link href="/accounts"><Button variant="ghost">Create an account</Button></Link>
          </div>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <RiskBanner />
      {/* Headline stats — hero panel */}
      <div className="relative overflow-hidden rounded-2xl border border-edge bg-gradient-to-br from-accent/[0.06] via-card to-bg p-5 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.55)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          <Stat label="Rule adherence" value={fmtPct(adherence)} tone={adherence >= 70 ? 1 : adherence >= 50 ? 0 : -1} hint="followed plan" />
          <Stat label="Net RR" value={fmtR(stats.netRR)} tone={stats.netRR} />
          <Stat label="Win rate" value={fmtPct(stats.winRate)} hint={`${stats.wins}W · ${stats.losses}L · ${stats.breakevens}BE`} />
          <Stat label="Profit factor" value={fmtPF(stats.profitFactor)} />
          <Stat label="Expectancy" value={`${stats.avgRR.toFixed(2)}R`} tone={stats.avgRR} hint="per trade" />
          <Stat
            label="Current streak"
            value={stats.currentStreak === 0 ? "—" : `${Math.abs(stats.currentStreak)} ${stats.currentStreak > 0 ? "wins" : "losses"}`}
            tone={stats.currentStreak}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Largest win" value={fmtR(stats.largestWin)} tone={1} />
        <Stat label="Largest loss" value={fmtR(stats.largestLoss)} tone={-1} />
        <Stat label="Max drawdown" value={`−${stats.maxDrawdownR.toFixed(2)}R`} tone={-1} />
        <Stat label="Total trades" value={String(stats.total)} />
      </div>

      {/* P&L charts */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <SectionTitle action={<Link href="/analytics" className="text-xs text-accent hover:underline">Open analytics →</Link>}>
            Daily net cumulative P&L
          </SectionTitle>
          <EquityCurve points={curve} mode="money" />
        </Card>
        <Card>
          <SectionTitle>Net daily P&L</SectionTitle>
          <DailyPnlBars days={daily} />
        </Card>
      </div>

      {/* Trading calendar */}
      <MonthCalendar trades={trades} reviews={reviews} onSelectTrade={setSelected} />

      {/* Periods */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <PeriodCard label="Today" trades={today} />
        <PeriodCard label="This week" trades={week} />
        <PeriodCard label="This month" trades={month} />
      </div>

      {/* Insights — what to do, before the deep stats */}
      <InsightsPanel insights={insights} />

      {/* Daily review nudge */}
      {!reviewedToday && (
        <Card className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div>
            <div className="text-sm font-medium text-ink">You haven&apos;t reviewed today</div>
            <p className="text-sm text-mute">Two minutes of reflection at the close does more for your edge than another chart.</p>
          </div>
          <Button onClick={() => setReviewOpen(true)}>Write today&apos;s review</Button>
        </Card>
      )}

      {/* Recent trades */}
      <Card>
        <SectionTitle action={<Button onClick={() => setLogOpen(true)}>Log trade</Button>}>Recent trades</SectionTitle>
        {recent.length === 0 ? (
          <div className="py-8 text-center text-sm text-mute">No trades for this account yet.</div>
        ) : (
          <div className="divide-y divide-edge/50">
            {recent.map((t) => (
              <button key={t.id} onClick={() => setSelected(t)} className="flex w-full items-center justify-between gap-4 py-3 text-left transition-colors hover:bg-surface/40">
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${t.direction === "long" ? "bg-pos" : "bg-neg"}`} />
                  <div>
                    <div className="text-sm font-medium text-ink">{t.pair}</div>
                    <div className="text-xs text-mute">{fmtDate(t.date)} · {t.session}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-sm ${signColor(t.rr)}`}>{fmtR(t.rr)}</span>
                  <OutcomePill rr={t.rr} pnl={t.pnl} />
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      <TradeModal open={logOpen} onClose={() => setLogOpen(false)} />
      {selected && <TradeDetail trade={selected} onClose={() => setSelected(null)} />}
      {reviewOpen && <DayReviewModal date={todayKey()} onClose={() => setReviewOpen(false)} />}
    </div>
  );
}
