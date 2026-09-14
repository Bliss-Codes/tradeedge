"use client";

import { useMemo, useState } from "react";
import { useApp, useAllTags, uid } from "@/stores/useApp";
import { MissedTrade, SESSIONS, Session, MISSED_REASONS, COMMON_PAIRS } from "@/lib/types";
import { fmtDate } from "@/lib/metrics";
import { Button, Card, EmptyState, Field, Input, Modal, NumberInput, SectionTitle, Select, Stat, TagChip, Textarea } from "@/components/ui/primitives";
import { ImageUploader, ImageThumb, Lightbox } from "@/components/trades/Images";
import { BarRow } from "@/components/charts/EquityCurve";

function MissedModal({ open, onClose, existing }: { open: boolean; onClose: () => void; existing?: MissedTrade | null }) {
  const addMissed = useApp((s) => s.addMissed);
  const updateMissed = useApp((s) => s.updateMissed);
  const addReason = useApp((s) => s.addCustomMissedReason);
  const customReasons = useApp((s) => s.profile?.customMissedReasons ?? []);
  const allTags = useAllTags();
  const [newReason, setNewReason] = useState("");
  const [reasonOpen, setReasonOpen] = useState(false);
  const blank: MissedTrade = { id: uid(), pair: "", date: new Date().toISOString(), expectedRR: 2, session: "London", reason: "Hesitation", tags: [], imageIds: [], createdAt: new Date().toISOString() };
  const [m, setM] = useState<MissedTrade>(existing ?? blank);
  const reasons = [...MISSED_REASONS, ...customReasons.filter((r) => !(MISSED_REASONS as readonly string[]).includes(r))];

  const saveReason = () => {
    const clean = newReason.trim();
    if (!clean) return;
    addReason(clean);
    setM((x) => ({ ...x, reason: clean }));
    setNewReason("");
    setReasonOpen(false);
  };

  const save = () => {
    if (!m.pair.trim()) return;
    const final = { ...m, pair: m.pair.trim().toUpperCase(), tags: [...new Set(m.tags)] };
    if (existing) updateMissed(final); else addMissed(final);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={existing ? "Edit missed trade" : "Log missed trade"} wide persistent>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Field label="Pair"><Select value={m.pair} autoFocus onChange={(e) => setM({ ...m, pair: e.target.value })}><option value="">Select pair</option>{(m.pair && !COMMON_PAIRS.includes(m.pair) ? [m.pair, ...COMMON_PAIRS] : COMMON_PAIRS).map((p) => <option key={p} value={p}>{p}</option>)}</Select></Field>
          <Field label="Date"><Input type="date" value={m.date.slice(0, 10)} onChange={(e) => setM({ ...m, date: new Date(`${e.target.value}T12:00:00`).toISOString() })} /></Field>
          <Field label="Expected RR"><NumberInput value={m.expectedRR || undefined} onChange={(v) => setM({ ...m, expectedRR: v ?? 0 })} /></Field>
          <Field label="Session"><Select value={m.session} onChange={(e) => setM({ ...m, session: e.target.value as Session })}>{SESSIONS.map((s) => <option key={s}>{s}</option>)}</Select></Field>
        </div>
        <Field label="Reason missed">
          <div className="flex gap-2"><Select className="flex-1" value={m.reason} onChange={(e) => setM({ ...m, reason: e.target.value })}>{reasons.map((r) => <option key={r}>{r}</option>)}</Select><Button variant="ghost" onClick={() => setReasonOpen((v) => !v)}>+ Add reason</Button></div>
          {reasonOpen && <div className="mt-2 flex gap-2"><Input value={newReason} onChange={(e) => setNewReason(e.target.value)} placeholder="e.g. Fear of losing" onKeyDown={(e) => e.key === "Enter" && saveReason()} /><Button onClick={saveReason}>Save</Button></div>}
        </Field>
        <div><div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-mute">Confluences / tags</div><div className="flex flex-wrap gap-2">{allTags.map((t) => <TagChip key={t} tag={t} active={m.tags.includes(t)} onClick={() => setM({ ...m, tags: m.tags.includes(t) ? m.tags.filter((x) => x !== t) : [...m.tags, t] })} />)}</div></div>
        <Field label="Review notes"><Textarea rows={3} value={m.notes ?? ""} onChange={(e) => setM({ ...m, notes: e.target.value || undefined })} placeholder="What happened? What should you do differently next time?" /></Field>
        <ImageUploader label="Missed setup screenshots" ids={m.imageIds} onChange={(ids) => setM({ ...m, imageIds: ids })} />
        <div className="flex justify-end gap-2 border-t border-edge pt-4"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={save} disabled={!m.pair.trim()}>{existing ? "Save changes" : "Save missed trade"}</Button></div>
      </div>
    </Modal>
  );
}

function MissedDetail({ trade, onClose, onEdit }: { trade: MissedTrade; onClose: () => void; onEdit: () => void }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  return <Modal open onClose={onClose} title={`${trade.pair} · Missed setup`} wide>
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Date" value={fmtDate(trade.date)} />
        <Stat label="Expected RR" value={`+${trade.expectedRR.toFixed(1)}R`} tone={1} />
        <Stat label="Session" value={trade.session} />
        <Stat label="Reason" value={trade.reason} />
        <Stat label="Screenshots" value={String(trade.imageIds.length)} />
      </div>
      {trade.imageIds.length ? <div><SectionTitle action={<span className="text-xs text-mute">Click an image to enlarge</span>}>Missed setup evidence</SectionTitle><div className="grid grid-cols-1 gap-3 md:grid-cols-2">{trade.imageIds.map((id, i) => <ImageThumb key={id} id={id} size="lg" onOpen={() => setLightbox(i)} />)}</div></div> : <div className="rounded-xl border border-dashed border-edge p-6 text-center text-sm text-mute">No screenshot attached to this missed trade.</div>}
      <div className="grid gap-4 md:grid-cols-2"><Card><SectionTitle>Why it was missed</SectionTitle><p className="text-sm text-ink">{trade.reason}</p></Card><Card><SectionTitle>Tags</SectionTitle><div className="flex flex-wrap gap-2">{trade.tags.length ? trade.tags.map((t) => <TagChip key={t} tag={t} />) : <span className="text-sm text-mute">No tags added.</span>}</div></Card></div>
      <Card><SectionTitle>Review notes</SectionTitle><p className="whitespace-pre-wrap text-sm leading-6 text-sub">{trade.notes || "No review notes recorded."}</p></Card>
      <div className="flex justify-end gap-2 border-t border-edge pt-4"><Button variant="ghost" onClick={onClose}>Close</Button><Button onClick={onEdit}>Edit missed trade</Button></div>
      {lightbox !== null && <Lightbox ids={trade.imageIds} index={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  </Modal>;
}

export function MissedPanel() {
  const missed = useApp((s) => s.missed);
  const deleteMissed = useApp((s) => s.deleteMissed);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<MissedTrade | null>(null);
  const [viewing, setViewing] = useState<MissedTrade | null>(null);
  const [query, setQuery] = useState("");
  const [reasonFilter, setReasonFilter] = useState("all");

  const filtered = useMemo(() => missed.filter((m) => (!query || `${m.pair} ${m.reason} ${m.notes ?? ""} ${m.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())) && (reasonFilter === "all" || m.reason === reasonFilter)), [missed, query, reasonFilter]);
  const totalRR = missed.reduce((a, m) => a + (Number(m.expectedRR) || 0), 0);
  const byReason = useMemo(() => { const map = new Map<string, { count: number; rr: number }>(); for (const m of missed) { const x = map.get(m.reason) ?? { count: 0, rr: 0 }; map.set(m.reason, { count: x.count + 1, rr: x.rr + (Number(m.expectedRR) || 0) }); } return [...map.entries()].sort((a,b) => b[1].count-a[1].count); }, [missed]);
  const byPair = useMemo(() => { const map = new Map<string, number>(); for (const m of missed) map.set(m.pair, (map.get(m.pair) ?? 0) + 1); return [...map.entries()].sort((a,b) => b[1]-a[1]).slice(0, 5); }, [missed]);
  const bySession = useMemo(() => { const map = new Map<string, number>(); for (const m of missed) map.set(m.session, (map.get(m.session) ?? 0) + 1); return [...map.entries()].sort((a,b) => b[1]-a[1]); }, [missed]);
  const topReason = byReason[0];

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center"><div><h2 className="text-lg font-semibold text-ink">Missed trade review</h2><p className="max-w-2xl text-sm text-mute">Turn missed opportunities into an execution-improvement system. Record the evidence, identify recurring causes, and review the pattern.</p></div><Button onClick={() => setCreateOpen(true)}>+ Log missed trade</Button></div>
    {missed.length === 0 ? <EmptyState title="No missed trades logged" body="When a valid setup runs without you, capture it here with a screenshot and the real reason you missed it." action={<Button onClick={() => setCreateOpen(true)}>Log missed trade</Button>} /> : <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4"><Stat label="Missed trades" value={String(missed.length)} /><Stat label="Potential RR missed" value={`+${totalRR.toFixed(1)}R`} tone={1} /><Stat label="Avg expected RR" value={`${(totalRR / missed.length).toFixed(2)}R`} /><Stat label="Top reason" value={topReason?.[0] ?? "—"} hint={topReason ? `${topReason[1].count} occurrences` : undefined} /></div>
      <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]"><Card><SectionTitle>What is costing you most?</SectionTitle>{topReason ? <div className="space-y-3"><div className="rounded-xl border border-warn/30 bg-warn/5 p-4"><div className="text-xs uppercase tracking-wider text-mute">Most frequent reason</div><div className="mt-1 text-xl font-semibold text-ink">{topReason[0]}</div><div className="mt-1 text-sm text-sub">{topReason[1].count} missed trades · +{topReason[1].rr.toFixed(1)}R potential left on the table</div></div><p className="text-sm leading-6 text-sub">Review these entries and decide whether the root problem is availability, preparation, hesitation, or lack of trust in your rules. Fix the cause—not just the missed trade.</p></div> : <p className="text-sm text-mute">Log more missed trades to generate insights.</p>}</Card><Card><SectionTitle>Pattern snapshot</SectionTitle><div className="space-y-3 text-sm">{byPair[0] && <div className="flex justify-between"><span className="text-mute">Most missed pair</span><span className="font-medium text-ink">{byPair[0][0]} · {byPair[0][1]}</span></div>}{bySession[0] && <div className="flex justify-between"><span className="text-mute">Most missed session</span><span className="font-medium text-ink">{bySession[0][0]} · {bySession[0][1]}</span></div>}<div className="flex justify-between"><span className="text-mute">Average opportunity</span><span className="font-mono text-warn">+{(totalRR / missed.length).toFixed(2)}R</span></div></div></Card></div>
      <div className="grid gap-5 lg:grid-cols-3"><Card><SectionTitle>Reasons</SectionTitle>{byReason.length ? byReason.map(([r,v]) => <BarRow key={r} label={r} value={v.count} max={byReason[0][1].count} display={`${v.count} · +${v.rr.toFixed(1)}R`} />) : <span className="text-sm text-mute">No data</span>}</Card><Card><SectionTitle>Pairs</SectionTitle>{byPair.length ? byPair.map(([p,c]) => <BarRow key={p} label={p} value={c} max={byPair[0][1]} display={String(c)} />) : <span className="text-sm text-mute">No data</span>}</Card><Card><SectionTitle>Sessions</SectionTitle>{bySession.length ? bySession.map(([s,c]) => <BarRow key={s} label={s} value={c} max={bySession[0][1]} display={String(c)} />) : <span className="text-sm text-mute">No data</span>}</Card></div>
      <Card className="p-4"><div className="mb-4 flex flex-col gap-3 md:flex-row"><Input className="md:max-w-sm" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search pair, reason, notes, tags…" /><Select className="md:w-56" value={reasonFilter} onChange={(e) => setReasonFilter(e.target.value)}><option value="all">All reasons</option>{byReason.map(([r]) => <option key={r}>{r}</option>)}</Select><span className="self-center text-xs text-mute">{filtered.length} of {missed.length} records</span></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{filtered.map((m) => <div key={m.id} className="group overflow-hidden rounded-xl border border-edge bg-surface/40 transition-colors hover:border-accent/50"><div className="relative h-44 bg-card">{m.imageIds[0] ? <ImageThumb id={m.imageIds[0]} size="lg" onOpen={() => setViewing(m)} /> : <button onClick={() => setViewing(m)} className="flex h-full w-full items-center justify-center text-sm text-mute">No screenshot · View record</button>}<div className="absolute left-2 top-2 rounded-md border border-edge bg-bg/85 px-2 py-1 text-xs font-medium text-ink">{m.pair}</div><div className="absolute right-2 top-2 rounded-md border border-edge bg-bg/85 px-2 py-1 text-xs text-warn">+{m.expectedRR.toFixed(1)}R</div></div><button className="block w-full p-3 text-left" onClick={() => setViewing(m)}><div className="flex items-center justify-between gap-2"><span className="truncate text-sm font-medium text-ink">{m.reason}</span><span className="text-[11px] text-mute">{fmtDate(m.date)}</span></div><div className="mt-1 truncate text-xs text-mute">{m.session} · {m.tags.slice(0, 3).join(" · ") || "No tags"}</div><p className="mt-2 line-clamp-2 text-xs text-sub">{m.notes || "No review notes recorded."}</p></button><div className="flex justify-end gap-1 border-t border-edge px-3 py-2"><Button variant="subtle" onClick={() => setEditing(m)}>Edit</Button><Button variant="subtle" onClick={() => deleteMissed(m.id)}><span className="text-neg">Delete</span></Button></div></div>)}</div>{filtered.length === 0 && <div className="py-8 text-center text-sm text-mute">No missed trades match these filters.</div>}</Card>
    </>}
    {createOpen && <MissedModal open onClose={() => setCreateOpen(false)} />}{editing && <MissedModal open onClose={() => setEditing(null)} existing={editing} />}{viewing && <MissedDetail trade={viewing} onClose={() => setViewing(null)} onEdit={() => { setEditing(viewing); setViewing(null); }} />}
  </div>;
}
