"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp, useVisibleTrades, useAllTags } from "@/stores/useApp";
import { Trade, SESSIONS, outcomeOf } from "@/lib/types";
import { fmtDate, fmtMoney, fmtR, signColor } from "@/lib/metrics";
import { Button, Card, EmptyState, Input, OutcomePill, Select, TagChip, Tabs } from "@/components/ui/primitives";
import { TradeModal } from "@/components/trades/TradeModal";
import { TradeDetail } from "@/components/trades/TradeDetail";
import { useImageUrl } from "@/components/trades/Images";

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
  const [session, setSession] = useState("");
  const [strategy, setStrategy] = useState("");
  const [outcome, setOutcome] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState<SortKey>("date");
  const [dir, setDir] = useState<1 | -1>(-1);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [logOpen, setLogOpen] = useState(false);
  const [editing, setEditing] = useState<Trade | null>(null);
  const [detailId, setDetailId] = useState<string | null>(params.get("trade"));
  const [replay, setReplay] = useState(false);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = trades.filter((t) => {
      if (needle) {
        const hay = `${t.pair} ${t.notes ?? ""} ${t.thesis ?? ""} ${t.lessons ?? ""} ${t.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (session && t.session !== session) return false;
      if (strategy && t.strategyId !== strategy) return false;
      if (outcome && outcomeOf(t) !== outcome) return false;
      if (tag && !t.tags.includes(tag)) return false;
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
  }, [trades, q, session, strategy, outcome, tag, sort, dir]);

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
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs tabs={["List", "Gallery"]} active={view} onChange={setView} />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pair, notes, tags…" className="max-w-60 flex-1" />
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
        <div className="ml-auto flex gap-2">
          {checked.size > 0 && (
            <Button
              variant="danger"
              onClick={() => {
                deleteTrades(Array.from(checked));
                setChecked(new Set());
              }}
            >
              Delete {checked.size}
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
                <tr className="border-b border-edge">
                  <th className="w-10 py-2.5 pl-5">
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
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="cursor-pointer border-b border-edge/50 transition-colors last:border-0 hover:bg-surface/50" onClick={() => { setReplay(false); setDetailId(t.id); }}>
                    <td className="py-3 pl-5" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" aria-label="Select trade" checked={checked.has(t.id)} onChange={() => toggleCheck(t.id)} />
                    </td>
                    <td className="py-3 pr-4 font-medium text-ink">{t.pair}</td>
                    <td className="py-3 pr-4 text-mute">{fmtDate(t.date)}</td>
                    <td className="py-3 pr-4">
                      <span className={t.direction === "long" ? "text-pos" : "text-neg"}>{t.direction === "long" ? "Long" : "Short"}</span>
                    </td>
                    <td className={`py-3 pr-4 font-mono ${signColor(t.rr)}`}>{fmtR(t.rr)}</td>
                    <td className={`py-3 pr-4 font-mono ${signColor(t.pnl)}`}>{t.pnl !== 0 ? fmtMoney(t.pnl) : "—"}</td>
                    <td className="py-3 pr-4 text-sub">{t.session}</td>
                    <td className="py-3 pr-4 text-sub">{strategies.find((s) => s.id === t.strategyId)?.name ?? "—"}</td>
                    <td className="py-3 pr-4">
                      <div className="flex max-w-48 flex-wrap gap-1">
                        {t.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full border border-edge px-1.5 py-0.5 text-[10px] text-mute">{tag}</span>
                        ))}
                        {t.tags.length > 3 && <span className="text-[10px] text-mute">+{t.tags.length - 3}</span>}
                      </div>
                    </td>
                    <td className="py-3 pr-5"><OutcomePill rr={t.rr} pnl={t.pnl} /></td>
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
