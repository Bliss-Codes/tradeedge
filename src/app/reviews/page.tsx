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
  isoWeekKey,
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

/**
 * Reads the period's trades and names the pattern, so the reflection is written
 * against evidence instead of memory. Memory reliably remembers the last trade
 * and forgets the repeated one.
 */
function detectPatterns(trades: Trade[]): { headline: string | null; notes: string[]; suggestion: string | null } {
  if (trades.length === 0) return { headline: null, notes: [], suggestion: null };
  const notes: string[] = [];

  const noThesis = trades.filter((t) => !(t.thesis ?? "").trim());
  const withThesis = trades.filter((t) => (t.thesis ?? "").trim());
  const avgR = (list: Trade[]) => (list.length ? list.reduce((a, t) => a + t.rr, 0) / list.length : 0);

  let headline: string | null = null;
  let suggestion: string | null = null;
  if (noThesis.length > 0) {
    suggestion = "No thesis, no entry — write the setup before clicking buy.";
    headline = `${noThesis.length} of ${trades.length} trades had no thesis (${avgR(noThesis).toFixed(2)}R avg vs ${avgR(withThesis).toFixed(2)}R when documented)`;
  }

  // Session drift: any session materially worse than the best one
  const bySession = new Map<string, Trade[]>();
  for (const t of trades) bySession.set(t.session, [...(bySession.get(t.session) ?? []), t]);
  if (bySession.size > 1) {
    const ranked = [...bySession.entries()].map(([k, v]) => ({ k, r: avgR(v), n: v.length })).sort((a, b) => b.r - a.r);
    const worst = ranked[ranked.length - 1];
    if (worst.r < 0) {
      notes.push(`${worst.k} session is losing (${worst.r.toFixed(2)}R over ${worst.n} trades) — best is ${ranked[0].k} at ${ranked[0].r.toFixed(2)}R`);
      if (!suggestion) suggestion = `Trade ${ranked[0].k} only — skip ${worst.k} entirely.`;
    }
  }

  // Emotional entries
  const hot = trades.filter((t) => t.emotionBefore === "FOMO" || t.emotionBefore === "Revenge" || t.emotionBefore === "Frustrated");
  if (hot.length > 0) {
    notes.push(`${hot.length} trade${hot.length === 1 ? "" : "s"} entered on FOMO/revenge/frustration (${avgR(hot).toFixed(2)}R avg)`);
    if (!suggestion) suggestion = "If the entry feeling is FOMO or revenge, close the platform for the session.";
  }

  // Violations tally
  const vio = new Map<string, number>();
  for (const t of trades) for (const v of t.violations) vio.set(v, (vio.get(v) ?? 0) + 1);
  const topVio = [...vio.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topVio) notes.push(`"${topVio[0]}" broken ${topVio[1]}× this period`);

  if (topVio && !suggestion) suggestion = `Eliminate "${topVio[0]}" — it is the most repeated break.`;
  if (!headline && notes.length > 0) headline = notes.shift() ?? null;
  return { headline, notes, suggestion };
}

function ReviewJournal({ periodKey, scope, label, trades }: { periodKey: string; scope: "week" | "month"; label: string; trades: Trade[] }) {
  const patterns = useMemo(() => detectPatterns(trades), [trades]);
  const reviews = useApp((s) => s.reviews);
  const upsertReview = useApp((s) => s.upsertReview);
  const existing = useMemo(() => reviews.find((r) => r.date === periodKey), [reviews, periodKey]);

  const [wentWell, setWentWell] = useState("");
  const [toImprove, setToImprove] = useState("");
  const [focusNext, setFocusNext] = useState("");
  const [discipline, setDiscipline] = useState<number | undefined>(undefined);
  const [saved, setSaved] = useState(false);

  // Reset the form only when the period changes or a different stored review
  // appears — NOT on every background hydrate (auth refresh / MT5 sync), which
  // previously wiped in-progress drafts.
  useEffect(() => {
    setWentWell(existing?.wentWell ?? "");
    setToImprove(existing?.toImprove ?? "");
    setFocusNext(existing?.focusNext ?? "");
    setDiscipline(existing?.disciplineRating);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodKey, existing?.id]);
  useEffect(() => setSaved(false), [periodKey]);

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
      {patterns.headline && (
        <div className="mb-4 rounded-xl border border-edge bg-surface/40 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-mute">What the data says</div>
          <p className="mt-1.5 text-sm font-medium text-ink">{patterns.headline}</p>
          {patterns.notes.length > 0 && (
            <ul className="mt-2 space-y-1">
              {patterns.notes.map((n) => (
                <li key={n} className="text-xs text-sub">— {n}</li>
              ))}
            </ul>
          )}
          <p className="mt-2.5 text-[11px] text-mute">Write your reflection against this, not from memory. Memory keeps the last trade and forgets the repeated one.</p>
        </div>
      )}
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
          {patterns.suggestion && !focusNext.trim() && (
            <button
              type="button"
              onClick={() => setFocusNext(patterns.suggestion as string)}
              className="mt-1.5 text-left text-[11px] text-accent hover:underline"
            >
              Use the fix the data points to: &ldquo;{patterns.suggestion}&rdquo;
            </button>
          )}
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

      <ReviewJournal periodKey={periodKey} scope={view === "Weekly" ? "week" : "month"} label={label} trades={period} />

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
