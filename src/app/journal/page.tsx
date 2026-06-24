"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp, useVisibleTrades, useAllTags, uid } from "@/stores/useApp";
import { Trade, SESSIONS, outcomeOf } from "@/lib/types";
import { fmtDate, fmtMoney, fmtR, signColor } from "@/lib/metrics";
import { Button, Card, EmptyState, Input, Modal, OutcomePill, Select, TagChip, Tabs } from "@/components/ui/primitives";
import { TradeModal } from "@/components/trades/TradeModal";
import { TradeDetail } from "@/components/trades/TradeDetail";
import { RiskBanner } from "@/components/layout/RiskBanner";
import { useImageUrl } from "@/components/trades/Images";

/** Clone a trade's setup into a fresh trade, clearing the result for re-entry. */
function duplicateSeed(t: Trade): Trade {
  return {
    ...t,
    id: uid(),
    date: new Date().toISOString(),
    rr: 0,
    pnl: 0,
    entry: undefined,
    exit: undefined,
    stopLoss: undefined,
    takeProfit: undefined,
    exitReason: undefined,
    grade: undefined,
    qualityScore: undefined,
    followedPlan: undefined,
    respectedRisk: undefined,
    followedHtfBias: undefined,
    waitedForLiquidity: undefined,
    waitedForConfirmation: undefined,
    checklistDone: [],
    violations: [],
    emotionBefore: undefined,
    emotionAfter: undefined,
    notes: undefined,
    lessons: undefined,
    beforeImageIds: [],
    afterImageIds: [],
    createdAt: new Date().toISOString(),
  };
}

type SortKey = "date" | "rr" | "pnl" | "pair";

function GalleryCard({ trade, onOpen }: { trade: Trade; onOpen: () => void }) {
  const url = useImageUrl(trade.beforeImageIds[0] ?? null);
  return (
    <button onClick={onOpen} className="group overflow-hidden rounded-2xl border border-edge bg-card text-left transition-colors hover:border-accent/40">
      <div className="flex h-40 items-center justify-center bg-surface">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={`${trade.pair} setup`} className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]" />
        ) : (
          <span className="text-xs text-mute">No screenshot</span>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">{trade.pair}</span>
          <OutcomePill rr={trade.rr} pnl={trade.pnl} />
        </div>
        <div className="flex items-center justify-between text-xs text-mute">
          <span>{fmtDate(trade.date)}</span>
          <span className={`font-mono ${signColor(trade.rr)}`}>{fmtR(trade.rr)}</span>
        </div>
        {trade.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {trade.tags.slice(0, 4).map((t) => (
              <span key={t} className="rounded-full border border-edge px-2 py-0.5 text-[10px] text-mute">{t}</span>
            ))}
            {trade.tags.length > 4 && <span className="text-[10px] text-mute">+{trade.tags.length - 4}</span>}
          </div>
        )}
      </div>
    </button>
  );
}

function JournalInner() {
  const trades = useVisibleTrades();
  const strategies = useApp((s) => s.strategies);
  const deleteTrades = useApp((s) => s.deleteTrades);
  const allTags = useAllTags();
  const params = useSearchParams();

  const [view, setView] = useState("List");
  const [q, setQ] = useState("");
  const [pair, setPair] = useState("");
  const [session, setSession] = useState("");
  const [strategy, setStrategy] = useState("");
  const [outcome, setOutcome] = useState("");
  const [tag, setTag] = useState("");
  const [range, setRange] = useState("all");
  const [sort, setSort] = useState<SortKey>("date");
  const [dir, setDir] = useState<1 | -1>(-1);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [logOpen, setLogOpen] = useState(false);
  const [editing, setEditing] = useState<Trade | null>(null);
  const [seed, setSeed] = useState<Trade | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string[] | null>(null);
  const [detailId, setDetailId] = useState<string | null>(params.get("trade"));
  const [replay, setReplay] = useState(false);

  const pairOptions = useMemo(() => Array.from(new Set(trades.map((t) => t.pair))).sort(), [trades]);
  const lastTrade = useMemo(() => [...trades].sort((a, b) => b.date.localeCompare(a.date))[0] ?? null, [trades]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const now = Date.now();
    const days = range === "all" ? Infinity : parseInt(range, 10);
    const cutoff = days === Infinity ? -Infinity : now - days * 86400000;
    let list = trades.filter((t) => {
      if (needle) {
        const hay = `${t.pair} ${t.notes ?? ""} ${t.thesis ?? ""} ${t.lessons ?? ""} ${t.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (pair && t.pair !== pair) return false;
      if (session && t.session !== session) return false;
      if (strategy && t.strategyId !== strategy) return false;
      if (outcome && outcomeOf(t) !== outcome) return false;
      if (tag && !t.tags.includes(tag)) return false;
      if (new Date(t.date).getTime() < cutoff) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      const v =
        sort === "date" ? a.date.localeCompare(b.date) :
        sort === "pair" ? a.pair.localeCompare(b.pair) :
        sort === "rr" ? a.rr - b.rr : a.pnl - b.pnl;
      return v * dir;
    });
    return list;
  }, [trades, q, pair, session, strategy, outcome, tag, range, sort, dir]);

  const detail = trades.find((t) => t.id === detailId) ?? null;

  const toggleSort = (key: SortKey) => {
    if (sort === key) setDir((d) => (d === 1 ? -1 : 1));
    else {
      setSort(key);
      setDir(-1);
    }
  };

  const toggleCheck = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const Th = ({ label, k }: { label: string; k?: SortKey }) => (
    <th
      className={`py-2.5 pr-4 text-left text-xs font-medium uppercase tracking-wider text-mute ${k ? "cursor-pointer select-none hover:text-sub" : ""}`}
      onClick={k ? () => toggleSort(k) : undefined}
    >
      {label} {k && sort === k ? (dir === -1 ? "↓" : "↑") : ""}
    </th>
  );

  return (
    <div className="space-y-5">
      <RiskBanner />
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs tabs={["List", "Gallery"]} active={view} onChange={setView} />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pair, notes, tags…" className="max-w-60 flex-1" />
        <Select value={pair} onChange={(e) => setPair(e.target.value)} className="w-auto">
          <option value="">All pairs</option>
          {pairOptions.map((p) => <option key={p}>{p}</option>)}
        </Select>
        <Select value={session} onChange={(e) => setSession(e.target.value)} className="w-auto">
          <option value="">All sessions</option>
          {SESSIONS.map((s) => <option key={s}>{s}</option>)}
        </Select>
        <Select value={strategy} onChange={(e) => setStrategy(e.target.value)} className="w-auto">
          <option value="">All strategies</option>
          {strategies.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </Select>
        <Select value={outcome} onChange={(e) => setOutcome(e.target.value)} className="w-auto">
          <option value="">All outcomes</option>
          <option value="win">Wins</option>
          <option value="loss">Losses</option>
          <option value="be">Breakeven</option>
        </Select>
        <Select value={tag} onChange={(e) => setTag(e.target.value)} className="w-auto">
          <option value="">All tags</option>
          {allTags.map((t) => <option key={t}>{t}</option>)}
        </Select>
        <Select value={range} onChange={(e) => setRange(e.target.value)} className="w-auto">
          <option value="all">All time</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </Select>
        <div className="ml-auto flex gap-2">
          {checked.size > 0 && (
            <Button variant="danger" onClick={() => setDeleteTarget(Array.from(checked))}>
              Delete {checked.size}
            </Button>
          )}
          {lastTrade && (
            <Button variant="subtle" onClick={() => setSeed(duplicateSeed(lastTrade))}>
              Duplicate last
            </Button>
          )}
          <Button onClick={() => setLogOpen(true)}>Log trade</Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No trades match"
          body={trades.length === 0 ? "Log your first trade to start building your edge." : "Adjust the filters or search to find what you're looking for."}
          action={trades.length === 0 ? <Button onClick={() => setLogOpen(true)}>Log trade</Button> : undefined}
        />
      ) : view === "List" ? (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-edge bg-surface/40">
                  <th className="w-10 py-3 pl-5">
                    <input
                      type="checkbox"
                      aria-label="Select all"
                      checked={checked.size === filtered.length && filtered.length > 0}
                      onChange={(e) => setChecked(e.target.checked ? new Set(filtered.map((t) => t.id)) : new Set())}
                    />
                  </th>
                  <Th label="Pair" k="pair" />
                  <Th label="Date" k="date" />
                  <Th label="Direction" />
                  <Th label="RR" k="rr" />
                  <Th label="PnL" k="pnl" />
                  <Th label="Session" />
                  <Th label="Strategy" />
                  <Th label="Tags" />
                  <Th label="Outcome" />
                  <th className="py-2.5 pr-5 text-right text-xs font-medium uppercase tracking-wider text-mute">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="cursor-pointer border-b border-edge/50 transition-colors last:border-0 hover:bg-surface/40" onClick={() => { setReplay(false); setDetailId(t.id); }}>
                    <td className="py-3.5 pl-5" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" aria-label="Select trade" checked={checked.has(t.id)} onChange={() => toggleCheck(t.id)} />
                    </td>
                    <td className="py-3.5 pr-4 font-semibold text-ink">{t.pair}</td>
                    <td className="py-3.5 pr-4 text-mute">{fmtDate(t.date)}</td>
                    <td className="py-3.5 pr-4">
                      <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${t.direction === "long" ? "bg-pos/15 text-pos" : "bg-neg/15 text-neg"}`}>
                        {t.direction === "long" ? "Long" : "Short"}
                      </span>
                    </td>
                    <td className={`py-3.5 pr-4 font-mono font-semibold ${signColor(t.rr)}`}>{fmtR(t.rr)}</td>
                    <td className={`py-3.5 pr-4 font-mono ${signColor(t.pnl)}`}>{t.pnl !== 0 ? fmtMoney(t.pnl) : "—"}</td>
                    <td className="py-3.5 pr-4 text-sub">{t.session}</td>
                    <td className="py-3.5 pr-4 text-sub">{strategies.find((s) => s.id === t.strategyId)?.name ?? "—"}</td>
                    <td className="py-3.5 pr-4">
                      <div className="flex max-w-48 flex-wrap gap-1">
                        {t.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full border border-edge px-1.5 py-0.5 text-[10px] text-mute">{tag}</span>
                        ))}
                        {t.tags.length > 3 && <span className="text-[10px] text-mute">+{t.tags.length - 3}</span>}
                      </div>
                    </td>
                    <td className="py-3.5 pr-5"><OutcomePill rr={t.rr} pnl={t.pnl} /></td>
                    <td className="py-3.5 pr-5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditing(t)}
                          title="Edit"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-edge text-mute transition-colors hover:text-accent"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9 M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteTarget([t.id])}
                          title="Delete"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-edge text-mute transition-colors hover:text-neg hover:border-neg/40"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((t) => (
            <GalleryCard key={t.id} trade={t} onOpen={() => { setReplay(true); setDetailId(t.id); }} />
          ))}
        </div>
      )}

      <p className="text-xs text-mute">
        Tip: open a trade from the gallery to enter replay mode — the result stays hidden until you reveal it.
      </p>

      <TradeModal open={logOpen} onClose={() => setLogOpen(false)} />
      {seed && <TradeModal open onClose={() => setSeed(null)} seed={seed} />}
      {editing && <TradeModal open onClose={() => setEditing(null)} existing={editing} />}
      {detail && !editing && (
        <TradeDetail
          trade={detail}
          replay={replay}
          onClose={() => setDetailId(null)}
          onEdit={(t) => {
            setDetailId(null);
            setEditing(t);
          }}
        />
      )}

      {deleteTarget && (
        <Modal open onClose={() => setDeleteTarget(null)} title={`Delete ${deleteTarget.length} trade${deleteTarget.length > 1 ? "s" : ""}?`}>
          <div className="space-y-4">
            <p className="text-sm text-sub">This permanently removes {deleteTarget.length > 1 ? "these trades" : "this trade"} and any attached screenshots. This can&apos;t be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button
                variant="danger"
                onClick={() => {
                  deleteTrades(deleteTarget);
                  setChecked(new Set());
                  if (deleteTarget.includes(detailId ?? "")) setDetailId(null);
                  setDeleteTarget(null);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function JournalPage() {
  return (
    <Suspense>
      <JournalInner />
    </Suspense>
  );
}
