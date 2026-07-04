"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp, useVisibleTrades, useDisplayCurrency } from "@/stores/useApp";
import { computeStats, equityCurve, dailyPnl, fmtPF, fmtPct, fmtR, fmtMoney, fmtDate, ruleAdherence, signColor } from "@/lib/metrics";
import { buildInsights } from "@/lib/insights";
import { Button, Card, EmptyState, OutcomePill, SectionTitle, Stat } from "@/components/ui/primitives";
import { InsightsPanel } from "@/components/ui/InsightsPanel";
import { EquityCurve, DailyPnlBars } from "@/components/charts/EquityCurve";
import { CalendarPanel } from "@/components/calendar/CalendarPanel";
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

function KpiIcon({ d, className = "" }: { d: string; className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {d.split(" M").map((seg, i) => (
        <path key={i} d={(i === 0 ? "" : "M") + seg} />
      ))}
    </svg>
  );
}

function KpiCard({ icon, label, value, sub, tone = 0, hero = false }: { icon: string; label: string; value: string; sub?: string; tone?: number; hero?: boolean }) {
  if (hero) {
    return (
      <div className="kpi-hero relative overflow-hidden rounded-2xl p-5" style={{ color: "rgb(var(--kpi-hero-ink))" }}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <KpiIcon d={icon} />
          </div>
        </div>
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "rgb(var(--kpi-hero-sub))" }}>{label}</div>
        <div className="mt-1 font-mono text-2xl font-bold tabular-nums">{value}</div>
        {sub && <div className="mt-1 text-xs" style={{ color: "rgb(var(--kpi-hero-sub))" }}>{sub}</div>}
      </div>
    );
  }
  const valTone = tone > 0 ? "text-pos" : tone < 0 ? "text-neg" : "text-ink";
  return (
    <div className="premium-card relative overflow-hidden rounded-2xl border border-edge bg-card p-5">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-sub">
          <KpiIcon d={icon} />
        </div>
      </div>
      <div className="text-xs font-medium uppercase tracking-wider text-mute">{label}</div>
      <div className={`mt-1 font-mono text-2xl font-bold tabular-nums ${valTone}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-mute">{sub}</div>}
    </div>
  );
}

function PeriodCard({ label, trades, currency }: { label: string; trades: Trade[]; currency: string }) {
  const s = computeStats(trades);
  return (
    <Card>
      <div className="text-xs font-medium uppercase tracking-wider text-mute">{label}</div>
      <div className={`mt-2 font-mono text-xl font-semibold ${signColor(s.netPnl)}`}>{fmtMoney(s.netPnl, currency)}</div>
      <div className="mt-1 text-xs text-mute">
        {s.total ? `${s.total} trade${s.total === 1 ? "" : "s"} · ${fmtPct(s.winRate)} win · ${fmtR(s.netRR)}` : "no trades yet"}
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const trades = useVisibleTrades();
  const currency = useDisplayCurrency();
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
  const money = useMemo(() => {
    const pnls = trades.map((t) => t.pnl);
    let eq = 0, peak = 0, maxDD = 0;
    for (const t of [...trades].sort((a, b) => a.date.localeCompare(b.date))) {
      eq += t.pnl;
      if (eq > peak) peak = eq;
      const dd = peak - eq;
      if (dd > maxDD) maxDD = dd;
    }
    return {
      largestWin: pnls.length ? Math.max(0, ...pnls) : 0,
      largestLoss: pnls.length ? Math.min(0, ...pnls) : 0,
      maxDD,
      expectancy: trades.length ? stats.netPnl / trades.length : 0,
    };
  }, [trades, stats.netPnl]);
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
    <div className="space-y-6">
      <RiskBanner />
      {/* Headline KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          hero
          icon="M3 17l6-6 4 4 8-8 M21 7v5h-5"
          label="Net P&L"
          value={fmtMoney(stats.netPnl, currency)}
          sub={`${fmtR(stats.netRR)} · ${stats.total} trades`}
        />
        <KpiCard icon="M12 2a10 10 0 100 20 10 10 0 000-20z M12 6a6 6 0 100 12 6 6 0 000-12z M12 10a2 2 0 100 4 2 2 0 000-4z" label="Win rate" value={fmtPct(stats.winRate)} sub={`${stats.wins}W · ${stats.losses}L · ${stats.breakevens}BE`} />
        <KpiCard icon="M4 20V10 M10 20V4 M16 20v-7 M22 20H2" label="Profit factor" value={fmtPF(stats.profitFactor)} sub="gross win ÷ loss" />
        <KpiCard icon="M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" label="Expectancy" value={fmtMoney(money.expectancy, currency)} sub={`${stats.avgRR.toFixed(2)}R / trade`} tone={money.expectancy} />
        <KpiCard icon="M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" label="Rule adherence" value={fmtPct(adherence)} sub="followed plan" tone={adherence >= 70 ? 1 : adherence >= 50 ? 0 : -1} />
        <KpiCard
          icon="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"
          label="Current streak"
          value={stats.currentStreak === 0 ? "—" : `${Math.abs(stats.currentStreak)} ${stats.currentStreak > 0 ? "W" : "L"}`}
          sub={stats.currentStreak > 0 ? "winning" : stats.currentStreak < 0 ? "losing" : "flat"}
          tone={stats.currentStreak}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Largest win" value={fmtMoney(money.largestWin, currency)} tone={1} />
        <Stat label="Largest loss" value={fmtMoney(money.largestLoss, currency)} tone={-1} />
        <Stat label="Max drawdown" value={`−${fmtMoney(money.maxDD, currency).replace("-", "")}`} tone={-1} />
        <Stat label="Total trades" value={String(stats.total)} />
      </div>

      {/* P&L charts */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <SectionTitle action={<Link href="/analytics" className="text-xs text-accent hover:underline">Open analytics →</Link>}>
            Daily net cumulative P&L
          </SectionTitle>
          <EquityCurve points={curve} mode="money" currency={currency} />
        </Card>
        <Card>
          <SectionTitle>Net daily P&L</SectionTitle>
          <DailyPnlBars days={daily} currency={currency} />
        </Card>
      </div>

      {/* Trading calendar — full monthly/weekly view (moved from the old Calendar page) */}
      <CalendarPanel />

      {/* Periods */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <PeriodCard label="Today" trades={today} currency={currency} />
        <PeriodCard label="This week" trades={week} currency={currency} />
        <PeriodCard label="This month" trades={month} currency={currency} />
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
                  <span className={`font-mono text-sm ${signColor(t.pnl)}`}>{t.pnl !== 0 ? fmtMoney(t.pnl, currency) : fmtR(t.rr)}</span>
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
