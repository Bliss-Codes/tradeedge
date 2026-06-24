"use client";

import { useEffect, useMemo, useState } from "react";
import { useVisibleTrades, useApp, uid, useDisplayCurrency } from "@/stores/useApp";
import { Trade, DayReview } from "@/lib/types";
import {
  computeStats,
  statsByGroup,
  bestWorst,
  mostCommonMistake,
  ruleAdherence,
  distribution,
  fmtPct,
  fmtR,
  fmtMoney,
  signColor,
} from "@/lib/metrics";
import { buildInsights } from "@/lib/insights";
import { availableBreakdownFields, fieldValueByName, strategyMap } from "@/lib/fields";
import { Button, Card, EmptyState, SectionTitle, Stat, Tabs, inputCls } from "@/components/ui/primitives";
import { GroupTable } from "@/components/ui/GroupTable";
import { InsightsPanel } from "@/components/ui/InsightsPanel";
import { BarRow } from "@/components/charts/EquityCurve";

function startOfWeek(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}

function Highlight({ label, value, tone }: { label: string; value: string; tone?: number }) {
  return (
    <div className="rounded-xl border border-edge bg-surface/50 p-3">
      <div className="text-[10px] uppercase tracking-wider text-mute">{label}</div>
      <div className={`mt-1 truncate text-sm font-medium ${tone !== undefined ? signColor(tone) : "text-ink"}`}>{value}</div>
    </div>
  );
}

function isoWeekKey(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((date.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function ReviewJournal({ periodKey, scope, label }: { periodKey: string; scope: "week" | "month"; label: string }) {
  const reviews = useApp((s) => s.reviews);
  const upsertReview = useApp((s) => s.upsertReview);
  const existing = useMemo(() => reviews.find((r) => r.date === periodKey), [reviews, periodKey]);

  const [wentWell, setWentWell] = useState("");
  const [toImprove, setToImprove] = useState("");
  const [focusNext, setFocusNext] = useState("");
  const [discipline, setDiscipline] = useState<number | undefined>(undefined);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setWentWell(existing?.wentWell ?? "");
    setToImprove(existing?.toImprove ?? "");
    setFocusNext(existing?.focusNext ?? "");
    setDiscipline(existing?.disciplineRating);
    setSaved(false);
  }, [periodKey, existing]);

  const dirty =
    wentWell !== (existing?.wentWell ?? "") ||
    toImprove !== (existing?.toImprove ?? "") ||
    focusNext !== (existing?.focusNext ?? "") ||
    discipline !== existing?.disciplineRating;

  const save = () => {
    const now = new Date().toISOString();
    const r: DayReview = {
      id: existing?.id ?? uid(),
      date: periodKey,
      scope,
      wentWell: wentWell.trim() || undefined,
      toImprove: toImprove.trim() || undefined,
      focusNext: focusNext.trim() || undefined,
      disciplineRating: discipline,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    upsertReview(r);
    setSaved(true);
  };

  const ta = `${inputCls} min-h-24 resize-y leading-relaxed`;

  return (
    <Card>
      <SectionTitle
        action={
          <div className="flex items-center gap-2">
            {saved && !dirty && <span className="text-xs text-pos">Saved ✓</span>}
            <Button onClick={save} disabled={!dirty}>Save reflection</Button>
          </div>
        }
      >
        {scope === "week" ? "Weekly" : "Monthly"} reflection — {label}
      </SectionTitle>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-sub">What went well</span>
          <textarea className={ta} value={wentWell} onChange={(e) => setWentWell(e.target.value)} placeholder="Setups I executed cleanly, good discipline moments, wins to repeat…" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-sub">What to improve</span>
          <textarea className={ta} value={toImprove} onChange={(e) => setToImprove(e.target.value)} placeholder="Mistakes, broken rules, patterns to fix…" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-sub">Focus for next {scope}</span>
          <textarea className={ta} value={focusNext} onChange={(e) => setFocusNext(e.target.value)} placeholder="The 1–2 things I'll concentrate on next…" />
        </label>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="text-xs font-medium text-sub">Discipline this {scope}</span>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setDiscipline(discipline === n ? undefined : n)}
              className={`h-8 w-8 rounded-lg border text-sm transition-colors ${discipline === n ? "border-accent bg-accent/15 text-accent" : "border-edge text-mute hover:text-sub"}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function ReviewsPage() {
  const trades = useVisibleTrades();
  const currency = useDisplayCurrency();
  const strategies = useApp((s) => s.strategies);
  const [view, setView] = useState("Weekly");
  const [cursor, setCursor] = useState(() => new Date());

  const { from, to, label } = useMemo(() => {
    if (view === "Weekly") {
      const from = startOfWeek(cursor);
      const to = new Date(from);
      to.setDate(to.getDate() + 7);
      const end = new Date(to.getTime() - 1);
      return {
        from,
        to,
        label: `${from.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`,
      };
    }
    const from = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const to = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    return { from, to, label: from.toLocaleDateString("en-GB", { month: "long", year: "numeric" }) };
  }, [view, cursor]);

  const period = useMemo(
    () => trades.filter((t) => { const d = new Date(t.date); return d >= from && d < to; }),
    [trades, from, to]
  );

  const move = (delta: number) => {
    const d = new Date(cursor);
    if (view === "Weekly") d.setDate(d.getDate() + delta * 7);
    else d.setMonth(d.getMonth() + delta);
    setCursor(d);
  };

  const byId = useMemo(() => strategyMap(strategies), [strategies]);
  const primaryField = useMemo(() => {
    const fields = availableBreakdownFields(period, strategies);
    return fields.includes("Entry Model") ? "Entry Model" : fields[0] ?? "";
  }, [period, strategies]);
  const stats = useMemo(() => computeStats(period), [period]);
  const byPair = useMemo(() => statsByGroup(period, (t) => t.pair), [period]);
  const bySession = useMemo(() => statsByGroup(period, (t) => t.session), [period]);
  const byEntryModel = useMemo(
    () => (primaryField ? statsByGroup(period, (t) => fieldValueByName(t, primaryField, byId)) : []),
    [period, primaryField, byId]
  );
  const pairBW = bestWorst(byPair);
  const sessionBW = bestWorst(bySession);
  const modelBest = bestWorst(byEntryModel).best;
  const mistake = useMemo(() => mostCommonMistake(period), [period]);
  const adherence = useMemo(() => ruleAdherence(period), [period]);
  const insights = useMemo(() => buildInsights(period, strategies), [period, strategies]);
  const exitDist = useMemo(() => distribution(period, (t) => t.exitReason), [period]);

  const periodKey = view === "Weekly" ? isoWeekKey(from) : `${cursor.getFullYear()}-M${String(cursor.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs tabs={["Weekly", "Monthly"]} active={view} onChange={(v) => setView(v)} />
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => move(-1)}>←</Button>
          <span className="min-w-48 text-center text-sm font-medium text-ink">{label}</span>
          <Button variant="ghost" onClick={() => move(1)}>→</Button>
          <Button variant="subtle" onClick={() => setCursor(new Date())}>This {view === "Weekly" ? "week" : "month"}</Button>
        </div>
      </div>

      <ReviewJournal periodKey={periodKey} scope={view === "Weekly" ? "week" : "month"} label={label} />

      {period.length === 0 ? (
        <EmptyState title={`No trades this ${view === "Weekly" ? "week" : "month"}`} body="Your reflection above is saved. Log trades to auto-generate the stats for this period." />
      ) : (
        <>
          {/* Headline */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            <Stat label="Total trades" value={String(stats.total)} />
            <Stat label="Win rate" value={fmtPct(stats.winRate)} />
            <Stat label="Net P&L" value={fmtMoney(stats.netPnl, currency)} tone={stats.netPnl} hint={fmtR(stats.netRR)} />
            <Stat label="Expectancy" value={`${stats.avgRR.toFixed(2)}R`} tone={stats.avgRR} />
            <Stat label="Rule adherence" value={fmtPct(adherence)} tone={adherence >= 70 ? 1 : adherence >= 50 ? 0 : -1} />
          </div>

          {/* Auto highlights */}
          <Card>
            <SectionTitle>{view} highlights</SectionTitle>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              <Highlight label="Best pair" value={pairBW.best ? `${pairBW.best.key} (${fmtMoney(pairBW.best.stats.netPnl, currency)})` : "—"} tone={1} />
              <Highlight label="Worst pair" value={pairBW.worst && pairBW.worst.key !== pairBW.best?.key ? `${pairBW.worst.key} (${fmtMoney(pairBW.worst.stats.netPnl, currency)})` : "—"} tone={-1} />
              <Highlight label="Best session" value={sessionBW.best ? `${sessionBW.best.key} (${fmtMoney(sessionBW.best.stats.netPnl, currency)})` : "—"} tone={1} />
              <Highlight label="Worst session" value={sessionBW.worst && sessionBW.worst.key !== sessionBW.best?.key ? `${sessionBW.worst.key} (${fmtMoney(sessionBW.worst.stats.netPnl, currency)})` : "—"} tone={-1} />
              <Highlight label={primaryField ? `Top ${primaryField}` : "Top setup"} value={modelBest ? `${modelBest.key}` : "—"} tone={1} />
              <Highlight label="Most common mistake" value={mistake ? `${mistake.violation} (${mistake.count})` : "None logged"} tone={mistake ? -1 : undefined} />
            </div>
          </Card>

          {view === "Monthly" && (
            <>
              <InsightsPanel insights={insights} />
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <Card>
                  <SectionTitle>{primaryField ? `${primaryField} this month` : "Setup breakdown"}</SectionTitle>
                  <GroupTable rows={byEntryModel} keyLabel="Entry model" currency={currency} />
                </Card>
                <Card>
                  <SectionTitle>Exit distribution</SectionTitle>
                  {exitDist.length === 0 ? (
                    <div className="py-6 text-center text-sm text-mute">No exit reasons logged this month.</div>
                  ) : (
                    exitDist.map((d) => (
                      <BarRow key={d.key} label={d.key} value={d.pct} max={100} display={`${fmtPct(d.pct)} · ${d.count}t`} color={d.key === "Stop Loss" ? "#EF4444" : d.key === "Take Profit" ? "#22C55E" : "#94A3B8"} />
                    ))
                  )}
                </Card>
              </div>
            </>
          )}

          {view === "Weekly" && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Card>
                <SectionTitle>By pair</SectionTitle>
                <GroupTable rows={byPair} keyLabel="Pair" currency={currency} />
              </Card>
              <Card>
                <SectionTitle>By session</SectionTitle>
                <GroupTable rows={bySession} keyLabel="Session" currency={currency} />
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
