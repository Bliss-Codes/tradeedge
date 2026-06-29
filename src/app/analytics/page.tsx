"use client";

import { useMemo, useState } from "react";
import { useApp, useVisibleTrades, useDisplayCurrency } from "@/stores/useApp";
import {
  computeStats,
  type Stats,
  equityCurve,
  fmtPF,
  fmtPct,
  fmtR,
  fmtMoney,
  statsByGroup,
  tagCombos,
  executionSummary,
  executionFindings,
  ruleAdherence,
  adherenceTrend,
  statsByHour,
  distribution,
  winLossSummary,
  monthlyPerformance,
  signColor,
} from "@/lib/metrics";
import type { MonthlyYearRow } from "@/lib/metrics";
import { Card, EmptyState, SectionTitle, Stat, Tabs, Select } from "@/components/ui/primitives";
import { GroupTable } from "@/components/ui/GroupTable";
import { EquityCurve, BarRow } from "@/components/charts/EquityCurve";
import { SessionRadar } from "@/components/charts/SessionRadar";
import { GRADES, EXIT_REASONS, QUALITY_LABELS, SESSIONS, outcomeOf } from "@/lib/types";
import { availableBreakdownFields, fieldValueByName, strategyMap } from "@/lib/fields";

const TABS = [
  "Overview",
  "Breakdowns",
  "Time of Day",
  "Exits",
  "Quality",
  "Pairs",
  "Sessions",
  "Strategies",
  "Accounts",
  "Tags",
  "Grades",
  "Execution",
  "Violations",
];

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function MonthlyGrid({ rows, currency, startingBalance }: { rows: MonthlyYearRow[]; currency: string; startingBalance?: number }) {
  const [mode, setMode] = useState<"money" | "pct">(startingBalance ? "pct" : "money");
  if (rows.length === 0) return <div className="py-8 text-center text-sm text-mute">No trades to chart by month yet.</div>;

  const cell = (val: number | null, pct: number | null) => {
    if (val === null) return <div className="rounded-lg border border-edge/60 bg-surface/30 px-2 py-2 text-center text-xs text-mute">—</div>;
    const show = mode === "pct" && pct !== null ? `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%` : fmtMoney(val, currency);
    const tone = val > 0 ? "bg-pos/10 text-pos" : val < 0 ? "bg-neg/10 text-neg" : "bg-surface/40 text-mute";
    return <div className={`rounded-lg px-2 py-2 text-center text-xs font-medium ${tone}`}>{show}</div>;
  };

  return (
    <div>
      {startingBalance ? (
        <div className="mb-3 flex gap-1 text-xs">
          <button onClick={() => setMode("pct")} className={`rounded-lg px-2.5 py-1 transition-colors ${mode === "pct" ? "bg-accent text-bg" : "border border-edge text-mute hover:text-sub"}`}>% return</button>
          <button onClick={() => setMode("money")} className={`rounded-lg px-2.5 py-1 transition-colors ${mode === "money" ? "bg-accent text-bg" : "border border-edge text-mute hover:text-sub"}`}>{currency}</button>
        </div>
      ) : (
        <p className="mb-3 text-[11px] text-mute">Set a starting balance on the account to see % returns.</p>
      )}
      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="mb-1.5 grid grid-cols-[56px_repeat(12,1fr)_72px] gap-1.5">
            <div />
            {MONTH_LABELS.map((m) => <div key={m} className="text-center text-[10px] font-medium uppercase tracking-wider text-mute">{m}</div>)}
            <div className="text-center text-[10px] font-medium uppercase tracking-wider text-mute">Year</div>
          </div>
          {rows.map((r) => (
            <div key={r.year} className="mb-1.5 grid grid-cols-[56px_repeat(12,1fr)_72px] items-stretch gap-1.5">
              <div className="flex items-center justify-center rounded-lg border border-edge bg-surface/40 text-xs font-semibold text-ink">{r.year}</div>
              {r.months.map((v, i) => <div key={i}>{cell(v, r.pctMonths[i])}</div>)}
              <div className={`flex items-center justify-center rounded-lg text-xs font-semibold ${r.total > 0 ? "bg-pos/15 text-pos" : r.total < 0 ? "bg-neg/15 text-neg" : "bg-surface/40 text-mute"}`}>
                {mode === "pct" && startingBalance ? `${r.totalPct >= 0 ? "+" : ""}${r.totalPct.toFixed(1)}%` : fmtMoney(r.total, currency)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WLList({ rows }: { rows: [string, string][] }) {
  return (
    <div className="mt-1 divide-y divide-edge/50">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between py-2 text-sm">
          <span className="text-mute">{k}</span>
          <span className="font-mono font-semibold text-ink">{v}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const visible = useVisibleTrades();
  const currency = useDisplayCurrency();
  const strategies = useApp((s) => s.strategies);
  const accounts = useApp((s) => s.accounts);
  const [tab, setTab] = useState("Overview");
  const [comboSize, setComboSize] = useState("All");

  // Horizontal filter bar — applies to every tab.
  const [fRange, setFRange] = useState("all");
  const [fStrategy, setFStrategy] = useState("");
  const [fSession, setFSession] = useState("");
  const [fSide, setFSide] = useState("");
  const [fOutcome, setFOutcome] = useState("");

  const trades = useMemo(() => {
    const days = fRange === "all" ? Infinity : parseInt(fRange, 10);
    const cutoff = days === Infinity ? -Infinity : Date.now() - days * 86400000;
    return visible.filter((t) => {
      if (fStrategy && t.strategyId !== fStrategy) return false;
      if (fSession && t.session !== fSession) return false;
      if (fSide && t.direction !== fSide) return false;
      if (fOutcome && outcomeOf(t) !== fOutcome) return false;
      if (new Date(t.date).getTime() < cutoff) return false;
      return true;
    });
  }, [visible, fRange, fStrategy, fSession, fSide, fOutcome]);

  const stats = useMemo(() => computeStats(trades), [trades]);
  const curve = useMemo(() => equityCurve(trades, "pnl"), [trades]);
  const wl = useMemo(() => winLossSummary(trades), [trades]);
  const startingBalance = useMemo(() => {
    const active = accounts.filter((a) => !a.archived);
    if (fStrategy === "" && fSession === "" && fSide === "" && fOutcome === "") {
      // when not filtered down, balance = selected account or sum of active accounts
      const sel = useApp.getState().selectedAccountId;
      if (sel !== "all") return accounts.find((a) => a.id === sel)?.balance;
      return active.reduce((s, a) => s + (a.balance || 0), 0) || undefined;
    }
    return undefined;
  }, [accounts, fStrategy, fSession, fSide, fOutcome]);
  const monthly = useMemo(() => monthlyPerformance(trades, startingBalance), [trades, startingBalance]);
  const monthlyCurrency = useDisplayCurrency();
  const bySide = useMemo(
    () => statsByGroup(trades, (t) => (t.direction === "long" ? "Long" : "Short")),
    [trades]
  );

  const byPair = useMemo(() => statsByGroup(trades, (t) => t.pair), [trades]);
  const bySession = useMemo(() => statsByGroup(trades, (t) => t.session), [trades]);
  const radarPoints = (pick: (st: Stats) => number, fmt: (v: number) => string) =>
    SESSIONS.map((s) => {
      const row = bySession.find((r) => r.key === s);
      const st = row?.stats;
      const value = st ? pick(st) : 0;
      return { session: s, value, label: fmt(value), total: st?.total ?? 0 };
    });
  const byStrategy = useMemo(
    () => statsByGroup(trades, (t) => (t.strategyId ? strategies.find((s) => s.id === t.strategyId)?.name ?? "Unknown" : "No strategy")),
    [trades, strategies]
  );
  const byAccount = useMemo(
    () => statsByGroup(trades, (t) => accounts.find((a) => a.id === t.accountId)?.name ?? "Unknown"),
    [trades, accounts]
  );
  const combos = useMemo(() => tagCombos(trades, 2), [trades]);
  const filteredCombos = useMemo(() => {
    if (comboSize === "All") return combos.slice(0, 40);
    const n = comboSize === "Single tags" ? 1 : comboSize === "Pairs of tags" ? 2 : 3;
    return combos.filter((c) => c.key.split(" + ").length === n).slice(0, 40);
  }, [combos, comboSize]);

  const byGrade = useMemo(() => {
    const order = new Map(GRADES.map((g, i) => [g as string, i]));
    return statsByGroup(trades, (t) => t.grade).sort((a, b) => (order.get(a.key) ?? 9) - (order.get(b.key) ?? 9));
  }, [trades]);
  const exec = useMemo(() => executionSummary(trades), [trades]);
  const execFindings = useMemo(() => executionFindings(trades), [trades]);

  const byId = useMemo(() => strategyMap(strategies), [strategies]);
  const breakdownFields = useMemo(() => availableBreakdownFields(trades, strategies), [trades, strategies]);
  const [breakdownField, setBreakdownField] = useState<string>("");
  const activeField = breakdownField || breakdownFields[0] || "";
  const byField = useMemo(
    () => (activeField ? statsByGroup(trades, (t) => fieldValueByName(t, activeField, byId)) : []),
    [trades, activeField, byId]
  );
  const byHour = useMemo(() => statsByHour(trades), [trades]);
  const exitDist = useMemo(() => distribution(trades, (t) => t.exitReason), [trades]);
  const byQuality = useMemo(() => {
    return statsByGroup(trades, (t) => (t.qualityScore ? String(t.qualityScore) : undefined)).sort((a, b) => Number(a.key) - Number(b.key));
  }, [trades]);
  const adherence = useMemo(() => ruleAdherence(trades), [trades]);
  const adherenceWeekly = useMemo(() => adherenceTrend(trades, "week", 10), [trades]);
  const adherenceMonthly = useMemo(() => adherenceTrend(trades, "month", 6), [trades]);

  const violationRows = useMemo(() => {
    const withV = trades.filter((t) => t.violations.length > 0);
    const rows = statsByGroup(
      withV.flatMap((t) => t.violations.map((v) => ({ ...t, _v: v }))),
      (t) => (t as { _v?: string })._v
    );
    return rows.sort((a, b) => a.stats.netPnl - b.stats.netPnl);
  }, [trades]);

  const cleanStats = useMemo(() => computeStats(trades.filter((t) => t.violations.length === 0)), [trades]);
  const dirtyStats = useMemo(() => computeStats(trades.filter((t) => t.violations.length > 0)), [trades]);

  if (visible.length === 0) {
    return <EmptyState title="Nothing to analyze yet" body="Once you've logged trades, this page breaks down what's working — by pair, session, strategy, tag, and rule discipline." />;
  }

  return (
    <div className="space-y-6">
      {/* Horizontal filter bar */}
      <div className="rounded-2xl border border-edge bg-card p-3">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-xs font-medium uppercase tracking-wider text-mute">Filters</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-mute">{trades.length} trades</span>
            {(fRange !== "all" || fStrategy || fSession || fSide || fOutcome) && (
              <button
                onClick={() => { setFRange("all"); setFStrategy(""); setFSession(""); setFSide(""); setFOutcome(""); }}
                className="rounded-lg border border-edge px-2 py-1 text-xs text-mute hover:text-sub"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="min-w-[130px] flex-1">
            <Select value={fRange} onChange={(e) => setFRange(e.target.value)}>
              <option value="all">All time</option>
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
            </Select>
          </div>
          <div className="min-w-[130px] flex-1">
            <Select value={fStrategy} onChange={(e) => setFStrategy(e.target.value)}>
              <option value="">All strategies</option>
              {strategies.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </div>
          <div className="min-w-[130px] flex-1">
            <Select value={fSession} onChange={(e) => setFSession(e.target.value)}>
              <option value="">All sessions</option>
              {SESSIONS.map((s) => <option key={s}>{s}</option>)}
            </Select>
          </div>
          <div className="min-w-[130px] flex-1">
            <Select value={fSide} onChange={(e) => setFSide(e.target.value)}>
              <option value="">Long & short</option>
              <option value="long">Long</option>
              <option value="short">Short</option>
            </Select>
          </div>
          <div className="min-w-[130px] flex-1">
            <Select value={fOutcome} onChange={(e) => setFOutcome(e.target.value)}>
              <option value="">All outcomes</option>
              <option value="win">Wins</option>
              <option value="loss">Losses</option>
              <option value="be">Breakeven</option>
            </Select>
          </div>
        </div>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {trades.length === 0 ? (
        <EmptyState title="No trades match these filters" body="Adjust or clear the filters above." />
      ) : (
      <>
      {tab === "Overview" && (
        <div className="space-y-6">
          {/* KPI strip */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            <Stat label="Total P&L" value={fmtMoney(stats.netPnl, currency)} tone={stats.netPnl} />
            <Stat label="Net P&L" value={fmtMoney(stats.netPnl, currency)} tone={stats.netPnl} hint={fmtR(stats.netRR)} />
            <Stat label="Win rate" value={fmtPct(stats.winRate)} hint={`${stats.wins}W · ${stats.losses}L`} />
            <Stat label="Total trades" value={String(stats.total)} hint={`${stats.breakevens} breakeven`} />
            <Stat label="Profit factor" value={fmtPF(stats.profitFactor)} />
            <Stat label="Expectancy" value={`${stats.avgRR.toFixed(2)}R`} tone={stats.avgRR} hint="per trade" />
          </div>

          <Card>
            <SectionTitle action={<span className="font-mono text-xs text-mute">{fmtMoney(stats.netPnl, currency)} cumulative</span>}>Daily net cumulative P&amp;L</SectionTitle>
            <EquityCurve points={curve} mode="money" currency={currency} />
          </Card>

          {/* Expectancy & profit factor + winners/losers */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card>
              <SectionTitle>Expectancy & profit factor</SectionTitle>
              <div className="flex items-baseline gap-3">
                <span className={`font-mono text-2xl font-semibold ${signColor(stats.avgRR)}`}>{fmtMoney(wl.avgWinPnl * (stats.winRate / 100) + wl.avgLossPnl * (1 - stats.winRate / 100), currency)}</span>
                <span className="text-xs text-mute">expectancy / trade · PF {fmtPF(stats.profitFactor)}</span>
              </div>
              <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-surface">
                <div className="h-full bg-pos" style={{ width: `${(wl.grossWinPnl / (wl.grossWinPnl - wl.grossLossPnl || 1)) * 100}%` }} />
                <div className="h-full bg-neg" style={{ width: `${(-wl.grossLossPnl / (wl.grossWinPnl - wl.grossLossPnl || 1)) * 100}%` }} />
              </div>
              <div className="mt-1.5 flex justify-between font-mono text-xs">
                <span className="text-pos">{fmtMoney(wl.grossWinPnl, currency)}</span>
                <span className="text-neg">{fmtMoney(wl.grossLossPnl, currency)}</span>
              </div>
            </Card>
            <Card>
              <SectionTitle>Performance by side</SectionTitle>
              <GroupTable rows={bySide} keyLabel="Side" currency={currency} />
            </Card>
          </div>

          <Card>
            <SectionTitle>Performance by month</SectionTitle>
            <MonthlyGrid rows={monthly} currency={monthlyCurrency} startingBalance={startingBalance} />
          </Card>

          {/* Winners vs losers */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card className="border-pos/20">
              <SectionTitle>Winners</SectionTitle>
              <WLList
                rows={[
                  ["Total winners", String(wl.winners)],
                  ["Best win", fmtR(wl.bestWinR)],
                  ["Average win", `${wl.avgWinR.toFixed(2)}R`],
                  ["Avg win P&L", fmtMoney(wl.avgWinPnl, currency)],
                  ["Max consecutive wins", String(wl.maxConsecutiveWins)],
                  ["Avg consecutive wins", wl.avgConsecutiveWins.toFixed(2)],
                ]}
              />
            </Card>
            <Card className="border-neg/20">
              <SectionTitle>Losers</SectionTitle>
              <WLList
                rows={[
                  ["Total losers", String(wl.losers)],
                  ["Worst loss", fmtR(wl.worstLossR)],
                  ["Average loss", `${wl.avgLossR.toFixed(2)}R`],
                  ["Avg loss P&L", fmtMoney(wl.avgLossPnl, currency)],
                  ["Max consecutive losses", String(wl.maxConsecutiveLosses)],
                  ["Avg consecutive losses", wl.avgConsecutiveLosses.toFixed(2)],
                ]}
              />
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card>
              <SectionTitle>Rule adherence — weekly</SectionTitle>
              {adherenceWeekly.length === 0 ? (
                <div className="py-6 text-center text-sm text-mute">Mark trades as followed-plan to build this trend.</div>
              ) : (
                adherenceWeekly.map((p) => (
                  <BarRow key={p.label} label={p.label} value={p.value} max={100} display={`${p.value.toFixed(0)}% · ${p.total}t`} color={p.value >= 70 ? "#22C55E" : p.value >= 50 ? "#F59E0B" : "#EF4444"} />
                ))
              )}
            </Card>
            <Card>
              <SectionTitle>Rule adherence — monthly</SectionTitle>
              {adherenceMonthly.length === 0 ? (
                <div className="py-6 text-center text-sm text-mute">Mark trades as followed-plan to build this trend.</div>
              ) : (
                adherenceMonthly.map((p) => (
                  <BarRow key={p.label} label={p.label} value={p.value} max={100} display={`${p.value.toFixed(0)}% · ${p.total}t`} color={p.value >= 70 ? "#22C55E" : p.value >= 50 ? "#F59E0B" : "#EF4444"} />
                ))
              )}
            </Card>
          </div>
        </div>
      )}

      {tab === "Breakdowns" && (
        <div className="space-y-4">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionTitle>Performance by field</SectionTitle>
              {breakdownFields.length > 0 && (
                <Select value={activeField} onChange={(e) => setBreakdownField(e.target.value)} className="w-auto">
                  {breakdownFields.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </Select>
              )}
            </div>
            <p className="mb-4 text-sm text-mute">
              Group your trades by any field your strategies define — Entry Model, HTF Bias, Zone Type, Trigger, anything. This is how the journal stays methodology-agnostic.
            </p>
            {breakdownFields.length === 0 ? (
              <div className="py-8 text-center text-sm text-mute">
                No custom fields yet. Add fields to a strategy (Strategies → Create → Custom fields, or start from a template) and they&apos;ll show up here.
              </div>
            ) : (
              <>
                <GroupTable rows={byField} keyLabel={activeField} />
                {byField.length > 0 && (
                  <div className="mt-5">
                    <div className="mb-2 text-xs font-medium uppercase tracking-wider text-mute">Net RR by {activeField}</div>
                    {byField.map((r) => (
                      <BarRow
                        key={r.key}
                        label={r.key}
                        value={Math.abs(r.stats.netPnl)}
                        max={Math.max(...byField.map((x) => Math.abs(x.stats.netPnl)), 1)}
                        display={`${fmtMoney(r.stats.netPnl, currency)} · ${r.stats.total}t`}
                        color={r.stats.netPnl >= 0 ? "#22C55E" : "#EF4444"}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      )}

      {tab === "Time of Day" && (
        <div className="space-y-6">
          {byHour.length === 0 ? (
            <EmptyState title="No timing data yet" body="Each trade's entry timestamp drives this. Log trades to see which hours pay." />
          ) : (
            <>
              <Card>
                <SectionTitle>Net RR by entry hour</SectionTitle>
                {byHour.map((h) => (
                  <BarRow
                    key={h.hour}
                    label={`${String(h.hour).padStart(2, "0")}:00`}
                    value={Math.abs(h.stats.netPnl)}
                    max={Math.max(...byHour.map((x) => Math.abs(x.stats.netPnl)), 1)}
                    display={`${fmtMoney(h.stats.netPnl, currency)} · ${h.stats.total}t`}
                    color={h.stats.netPnl >= 0 ? "#22C55E" : "#EF4444"}
                  />
                ))}
              </Card>
              <Card>
                <SectionTitle>Win rate by entry hour</SectionTitle>
                {byHour.map((h) => (
                  <BarRow
                    key={h.hour}
                    label={`${String(h.hour).padStart(2, "0")}:00`}
                    value={h.stats.winRate}
                    max={100}
                    display={`${fmtPct(h.stats.winRate)} · ${h.stats.total}t`}
                    color="#A3E635"
                  />
                ))}
              </Card>
            </>
          )}
        </div>
      )}

      {tab === "Exits" && (
        <div className="space-y-6">
          {exitDist.length === 0 ? (
            <EmptyState title="No exit data yet" body="Set an exit reason on your trades (Take Profit, Stop Loss, Breakeven, Manual, Partial) to see how you close." />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {EXIT_REASONS.map((r) => {
                  const d = exitDist.find((x) => x.key === r);
                  return <Stat key={r} label={r} value={d ? fmtPct(d.pct) : "0%"} hint={d ? `${d.count} trades` : "—"} />;
                })}
              </div>
              <Card>
                <SectionTitle>Exit distribution</SectionTitle>
                {exitDist.map((d) => (
                  <BarRow key={d.key} label={d.key} value={d.pct} max={100} display={`${fmtPct(d.pct)} · ${d.count}t`} color={d.key === "Stop Loss" ? "#EF4444" : d.key === "Take Profit" ? "#22C55E" : "#94A3B8"} />
                ))}
              </Card>
            </>
          )}
        </div>
      )}

      {tab === "Quality" && (
        <Card>
          <SectionTitle>Performance by setup quality score</SectionTitle>
          <p className="mb-4 text-sm text-mute">Higher scores should produce higher expectancy. If a 3 out-earns your 5s, recalibrate what &quot;textbook&quot; means.</p>
          {byQuality.length === 0 ? (
            <div className="py-8 text-center text-sm text-mute">Score setups 1–5 as you log them to populate this.</div>
          ) : (
            <GroupTable rows={byQuality.map((r) => ({ ...r, key: `${r.key} · ${QUALITY_LABELS[Number(r.key)] ?? ""}` }))} keyLabel="Quality score" />
          )}
        </Card>
      )}

      {tab === "Pairs" && (
        <Card>
          <SectionTitle>Performance by pair</SectionTitle>
          <GroupTable rows={byPair} keyLabel="Pair" currency={currency} />
        </Card>
      )}

      {tab === "Sessions" && (
        <div className="space-y-6">
          <Card>
            <SectionTitle>Performance by session</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SessionRadar title="Win Rate" points={radarPoints((st) => st.winRate, (v) => fmtPct(v))} />
              <SessionRadar title="Total Trades" points={radarPoints((st) => st.total, (v) => String(Math.round(v)))} />
              <SessionRadar title="Avg RR" points={radarPoints((st) => st.avgRR, (v) => `${v.toFixed(2)}R`)} />
              <SessionRadar title="Profit" points={radarPoints((st) => st.netPnl, (v) => fmtMoney(v, currency))} />
            </div>
            <p className="mt-3 text-[11px] text-mute">Sessions are set from each trade&apos;s time (UTC = your Accra local time): London 08:00–13:00, Overlap 13:00–16:00, New York 16:00–22:00, Asia 22:00–08:00.</p>
          </Card>
          <Card>
            <SectionTitle>Session breakdown</SectionTitle>
            <GroupTable rows={bySession} keyLabel="Session" currency={currency} />
          </Card>
          <Card>
            <SectionTitle>Net RR by session</SectionTitle>
            {bySession.map((r) => (
              <BarRow
                key={r.key}
                label={r.key}
                value={Math.abs(r.stats.netPnl)}
                max={Math.max(...bySession.map((x) => Math.abs(x.stats.netPnl)), 1)}
                display={fmtMoney(r.stats.netPnl, currency)}
                color={r.stats.netPnl >= 0 ? "#22C55E" : "#EF4444"}
              />
            ))}
          </Card>
        </div>
      )}

      {tab === "Strategies" && (
        <Card>
          <SectionTitle>Performance by strategy</SectionTitle>
          <GroupTable rows={byStrategy} keyLabel="Strategy" currency={currency} />
        </Card>
      )}

      {tab === "Accounts" && (
        <Card>
          <SectionTitle>Performance by account</SectionTitle>
          <GroupTable rows={byAccount} keyLabel="Account" currency={currency} />
        </Card>
      )}

      {tab === "Tags" && (
        <Card>
          <SectionTitle
            action={
              <Tabs tabs={["All", "Single tags", "Pairs of tags", "Triples"]} active={comboSize} onChange={setComboSize} />
            }
          >
            Tags & combinations
          </SectionTitle>
          <p className="mb-4 text-sm text-mute">
            Combinations need at least 2 trades to appear. This is where the system shows you which confluences actually pay.
          </p>
          <GroupTable rows={filteredCombos} keyLabel="Tag combination" currency={currency} />
        </Card>
      )}

      {tab === "Grades" && (
        <div className="space-y-6">
          <Card>
            <SectionTitle>Performance by setup grade</SectionTitle>
            <p className="mb-4 text-sm text-mute">
              The test of good grading: your A+ setups should out-earn your B and C setups. If they don&apos;t, your idea of an A+ needs work.
            </p>
            {byGrade.length === 0 ? (
              <div className="py-8 text-center text-sm text-mute">No graded trades yet. Grade setups A+ / A / B / C as you log them.</div>
            ) : (
              <GroupTable rows={byGrade} keyLabel="Grade" currency={currency} />
            )}
          </Card>
          {byGrade.length > 0 && (
            <Card>
              <SectionTitle>Avg RR by grade</SectionTitle>
              {byGrade.map((r) => (
                <BarRow
                  key={r.key}
                  label={r.key}
                  value={Math.abs(r.stats.avgRR)}
                  max={Math.max(...byGrade.map((x) => Math.abs(x.stats.avgRR)), 1)}
                  display={`${r.stats.avgRR.toFixed(2)}R`}
                  color={r.stats.avgRR >= 0 ? "#A3E635" : "#EF4444"}
                />
              ))}
            </Card>
          )}
        </div>
      )}

      {tab === "Execution" && (
        <div className="space-y-6">
          {exec.sampled === 0 ? (
            <EmptyState
              title="No execution data yet"
              body="Add entry, stop loss, and take profit to your trades. TradeEdge then compares your planned RR to what you actually took — and shows where you cut winners early or let losers run."
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Stat label="Trades measured" value={String(exec.sampled)} hint="with entry/SL/TP" />
                <Stat label="Target capture" value={fmtPct(exec.avgCapture * 100)} hint="of planned R on winners" />
                <Stat label="Avg planned RR" value={`${exec.avgPlanned.toFixed(2)}R`} />
                <Stat label="Avg realized RR" value={`${exec.avgRealized.toFixed(2)}R`} tone={exec.avgRealized} />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <div className="text-xs font-medium uppercase tracking-wider text-mute">Cut winners early</div>
                  <div className="mt-2 font-mono text-2xl font-semibold text-warn">{exec.cutEarly}</div>
                  <div className="mt-1 text-xs text-mute">
                    ~{exec.cutEarlyCostR.toFixed(1)}R left on the table. Your winners can take more room.
                  </div>
                </Card>
                <Card>
                  <div className="text-xs font-medium uppercase tracking-wider text-mute">Let losers run past stop</div>
                  <div className="mt-2 font-mono text-2xl font-semibold text-neg">{exec.letRun}</div>
                  <div className="mt-1 text-xs text-mute">
                    ~{exec.letRunCostR.toFixed(1)}R of avoidable damage from moved stops or oversizing.
                  </div>
                </Card>
              </div>
              <Card className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-edge text-left text-xs uppercase tracking-wider text-mute">
                        <th className="py-2.5 pl-5 pr-4 font-medium">Pair</th>
                        <th className="py-2.5 pr-4 font-medium text-right">Planned</th>
                        <th className="py-2.5 pr-4 font-medium text-right">Realized</th>
                        <th className="py-2.5 pr-4 font-medium text-right">Capture</th>
                        <th className="py-2.5 pr-5 font-medium">Read</th>
                      </tr>
                    </thead>
                    <tbody>
                      {execFindings
                        .filter((f) => f.kind === "cut_early" || f.kind === "let_run")
                        .slice(0, 20)
                        .map((f) => (
                          <tr key={f.trade.id} className="border-b border-edge/50 last:border-0">
                            <td className="py-3 pl-5 pr-4 font-medium text-ink">{f.trade.pair}</td>
                            <td className="py-3 pr-4 text-right font-mono text-sub">{f.planned.toFixed(2)}R</td>
                            <td className={`py-3 pr-4 text-right font-mono ${signColor(f.realized)}`}>{fmtR(f.realized)}</td>
                            <td className="py-3 pr-4 text-right font-mono text-sub">{fmtPct(f.capture * 100)}</td>
                            <td className="py-3 pr-5">
                              <span className={f.kind === "cut_early" ? "text-warn" : "text-neg"}>
                                {f.kind === "cut_early" ? "Cut early" : "Ran past stop"}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </div>
      )}

      {tab === "Violations" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <div className="text-xs font-medium uppercase tracking-wider text-mute">Rule-following trades</div>
              <div className={`mt-2 font-mono text-2xl font-semibold ${signColor(cleanStats.netPnl)}`}>{fmtMoney(cleanStats.netPnl, currency)}</div>
              <div className="mt-1 text-xs text-mute">{cleanStats.total} trades · {fmtPct(cleanStats.winRate)} win rate · {cleanStats.avgRR.toFixed(2)}R expectancy</div>
            </Card>
            <Card>
              <div className="text-xs font-medium uppercase tracking-wider text-mute">Trades with violations</div>
              <div className={`mt-2 font-mono text-2xl font-semibold ${signColor(dirtyStats.netPnl)}`}>{fmtMoney(dirtyStats.netPnl, currency)}</div>
              <div className="mt-1 text-xs text-mute">{dirtyStats.total} trades · {fmtPct(dirtyStats.winRate)} win rate · {dirtyStats.avgRR.toFixed(2)}R expectancy</div>
            </Card>
          </div>
          <Card>
            <SectionTitle>Impact by violation</SectionTitle>
            {violationRows.length === 0 ? (
              <div className="py-8 text-center text-sm text-mute">No rule violations logged. Keep it that way.</div>
            ) : (
              <GroupTable rows={violationRows} keyLabel="Violation" currency={currency} />
            )}
          </Card>
        </div>
      )}
      </>
      )}
    </div>
  );
}
