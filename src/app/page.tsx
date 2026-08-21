"use client";

import { useMemo, useState } from "react";
import { useApp, useVisibleTrades, useDisplayCurrency } from "@/stores/useApp";
import { computeStats, equityCurve, dailyPnl, fmtPF, fmtPct, fmtR, fmtMoney, fmtDate, adherenceDetail, signColor } from "@/lib/metrics";
import { buildInsights } from "@/lib/insights";
import { Button, Card, EmptyState, OutcomePill, SectionTitle, Stat } from "@/components/ui/primitives";
import { InsightsPanel } from "@/components/ui/InsightsPanel";
import { EquityCurve, DailyPnlBars } from "@/components/charts/EquityCurve";
import { CalendarPanel } from "@/components/calendar/CalendarPanel";
import { stageOf } from "@/stores/useApp";
import { YearHeatmap } from "@/components/charts/YearHeatmap";
import { isoWeekKey } from "@/lib/metrics";
import Link from "next/link";
import { RiskBanner } from "@/components/layout/RiskBanner";
import { TradeModal } from "@/components/trades/TradeModal";
import { TradeDetail } from "@/components/trades/TradeDetail";
import { DayReviewModal } from "@/components/trades/DayReviewModal";
import { Trade, outcomeOf } from "@/lib/types";

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
      <div className="kpi-hero dashboard-hero-kpi relative min-h-[168px] overflow-hidden rounded-[22px] p-5" style={{ color: "rgb(var(--kpi-hero-ink))" }}>
        <div className="hero-kpi-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="hero-kpi-glow absolute -right-10 -top-10 h-36 w-36 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/12 ring-1 ring-white/10">
              <KpiIcon d={icon} />
            </div>
            <span className="rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">
              Discipline
            </span>
          </div>
          <div className="mt-auto">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: "rgb(var(--kpi-hero-sub))" }}>{label}</div>
            <div className="mt-1 font-mono text-3xl font-bold tabular-nums tracking-tight">{value}</div>
            {sub && <div className="mt-1 text-xs" style={{ color: "rgb(var(--kpi-hero-sub))" }}>{sub}</div>}
          </div>
        </div>
        <svg className="hero-kpi-spark absolute bottom-3 right-4 h-12 w-28 opacity-70" viewBox="0 0 112 48" fill="none" aria-hidden="true">
          <path d="M2 40C14 37 18 27 29 30C39 33 43 16 53 20C64 24 69 13 77 16C88 20 91 6 110 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M2 40C14 37 18 27 29 30C39 33 43 16 53 20C64 24 69 13 77 16C88 20 91 6 110 8V48H2Z" fill="url(#heroFill)"/>
          <defs><linearGradient id="heroFill" x1="56" y1="8" x2="56" y2="48" gradientUnits="userSpaceOnUse"><stop stopColor="white" stopOpacity=".18"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient></defs>
        </svg>
      </div>
    );
  }
  const valTone = tone > 0 ? "text-pos" : tone < 0 ? "text-neg" : "text-ink";
  return (
    <div className="premium-card dashboard-kpi relative min-h-[168px] overflow-hidden rounded-[22px] border border-edge bg-card p-5">
      <div className="kpi-card-accent absolute right-0 top-0 h-20 w-20 rounded-full opacity-0 blur-2xl" aria-hidden="true" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-sub ring-1 ring-edge/60">
            <KpiIcon d={icon} />
          </div>
          <span className={`h-1.5 w-1.5 rounded-full ${tone > 0 ? "bg-pos" : tone < 0 ? "bg-neg" : "bg-edge"}`} />
        </div>
        <div className="mt-auto">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">{label}</div>
          <div className={`mt-1 font-mono text-2xl font-bold tabular-nums tracking-tight ${valTone}`}>{value}</div>
          {sub && <div className="mt-1 text-xs text-mute">{sub}</div>}
        </div>
      </div>
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


/** Surfaces last week's "focus for next week" all through the current week. */
function WeeklyFocusBanner() {
  const reviews = useApp((s) => s.reviews);
  const focus = useMemo(() => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const key = isoWeekKey(lastWeek);
    return reviews.find((r) => r.date === key && r.scope === "week")?.focusNext;
  }, [reviews]);
  if (!focus) return null;
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-accent/30 bg-accent/5 px-5 py-3.5">
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">This week&apos;s focus</div>
        <div className="mt-1 whitespace-pre-line text-sm leading-relaxed text-sub">{focus}</div>
      </div>
      <Link href="/reviews" className="shrink-0 text-xs text-mute hover:text-sub">from last week&apos;s reflection →</Link>
    </div>
  );
}


/** Splits notional challenge P&L from real funded earnings. Blending them is
 *  what makes a journal look flat while the funded account is actually paying. */
function CapitalSplit({ currency }: { currency: string }) {
  const trades = useApp((s) => s.trades);
  const accounts = useApp((s) => s.accounts);

  const split = useMemo(() => {
    let funded = 0, challenge = 0, fundedN = 0, challengeN = 0;
    for (const t of trades) {
      if (t.type !== "live") continue;
      const acct = accounts.find((a) => a.id === t.accountId && !a.archived);
      if (!acct) continue;
      const st = stageOf(acct.type);
      if (st === "funded") { funded += t.pnl; fundedN++; }
      else if (st === "challenge") { challenge += t.pnl; challengeN++; }
    }
    return { funded, challenge, fundedN, challengeN };
  }, [trades, accounts]);

  if (split.fundedN === 0 && split.challengeN === 0) return null;

  return (
    <Card>
      <SectionTitle>Real vs notional</SectionTitle>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-pos/30 bg-pos/[0.04] px-4 py-3">
          <div className="text-[11px] uppercase tracking-wider text-mute">Funded — real money</div>
          <div className={`mt-1 font-mono text-2xl font-semibold ${signColor(split.funded)}`}>
            {fmtMoney(split.funded, currency)}
          </div>
          <div className="mt-0.5 text-[11px] text-mute">{split.fundedN} trades · converts to payouts</div>
        </div>
        <div className="rounded-xl border border-edge bg-surface/40 px-4 py-3">
          <div className="text-[11px] uppercase tracking-wider text-mute">Challenge — notional</div>
          <div className="mt-1 font-mono text-2xl font-semibold text-sub">{fmtMoney(split.challenge, currency)}</div>
          <div className="mt-0.5 text-[11px] text-mute">{split.challengeN} trades · pass progress, not income</div>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-mute">
        Challenge profit is never paid out and is usually traded at a higher risk %. Keeping it separate is why your
        funded curve looks like progress instead of noise.
      </p>
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
  const adh = useMemo(() => adherenceDetail(trades), [trades]);
  const adherence = adh.pct;
  /** Share of trades that had a written thesis — the single strongest predictor
   *  in this journal's own data (documented setups vastly outperform blanks). */
  const thesisRate = useMemo(
    () => (trades.length ? (trades.filter((t) => (t.thesis ?? "").trim()).length / trades.length) * 100 : 0),
    [trades]
  );
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
      <div className="dashboard-intro flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Performance overview</div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Your trading at a glance.</h2>
          <p className="mt-1 max-w-2xl text-sm text-mute">A clean view of performance, discipline and risk — without the noise.</p>
        </div>
        <div className="dashboard-status rounded-xl border border-edge bg-card px-3.5 py-2.5 text-xs text-mute">
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-pos align-middle"></span>
          Journal synced
        </div>
      </div>
      <WeeklyFocusBanner />
      <RiskBanner />
      {/* Headline KPIs */}
      <div className="dashboard-kpis grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {/* Adherence leads on purpose: what you see first is what you optimise for.
            P&L is the outcome; adherence is the behaviour that produces it. */}
        <KpiCard
          hero
          icon="M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
          label="Rule adherence"
          value={adh.total === 0 ? "—" : fmtPct(adherence)}
          sub={
            adh.total === 0
              ? "no trades yet"
              : `${adh.followed} of ${adh.total} clean${adh.noThesis > 0 ? ` · ${adh.noThesis} with no thesis` : ""}`
          }
        />
        <KpiCard
          icon="M3 17l6-6 4 4 8-8 M21 7v5h-5"
          label="Net P&L"
          value={fmtMoney(stats.netPnl, currency)}
          sub={`${fmtR(stats.netRR)} · ${stats.total} trades`}
        />
        <KpiCard icon="M12 2a10 10 0 100 20 10 10 0 000-20z M12 6a6 6 0 100 12 6 6 0 000-12z M12 10a2 2 0 100 4 2 2 0 000-4z" label="Win rate" value={fmtPct(stats.winRate)} sub={`${stats.wins}W · ${stats.losses}L · ${stats.breakevens}BE`} />
        <KpiCard icon="M4 20V10 M10 20V4 M16 20v-7 M22 20H2" label="Profit factor" value={fmtPF(stats.profitFactor)} sub="gross win ÷ loss" />
        <KpiCard icon="M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" label="Expectancy" value={fmtMoney(money.expectancy, currency)} sub={`${stats.avgRR.toFixed(2)}R / trade`} />
        <KpiCard
          icon="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"
          label="Current streak"
          value={stats.currentStreak === 0 ? "—" : `${Math.abs(stats.currentStreak)} ${stats.currentStreak > 0 ? "W" : "L"}`}
          sub={stats.currentStreak > 0 ? "winning" : stats.currentStreak < 0 ? "losing" : "flat"}
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

      <CapitalSplit currency={currency} />

      <Card>
        <SectionTitle action={<span className="text-xs text-mute">daily net P&amp;L</span>}>Trading rhythm</SectionTitle>
        <YearHeatmap trades={trades} currency={currency} />
      </Card>

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
                  {/* Outcome, not direction: green win, red loss, amber breakeven. */}
                  <span
                    className={`h-2 w-2 rounded-full ${t.pnl > 0 ? "bg-pos" : t.pnl < 0 ? "bg-neg" : "bg-warn"}`}
                    title={t.pnl > 0 ? "Win" : t.pnl < 0 ? "Loss" : "Breakeven"}
                  />
                  <div>
                    <div className="text-sm font-medium text-ink">{t.pair}</div>
                    <div className="text-xs text-mute">{fmtDate(t.date)} · {t.session}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-sm ${signColor(t.pnl)}`}>{outcomeOf(t) !== "be" ? fmtMoney(t.pnl, currency) : fmtR(t.rr)}</span>
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
