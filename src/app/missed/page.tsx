"use client";

import { useMemo, useState } from "react";
import { useApp, useAllTags, uid } from "@/stores/useApp";
import { MissedTrade, SESSIONS, Session, MISSED_REASONS } from "@/lib/types";
import { fmtDate } from "@/lib/metrics";
import { Button, Card, EmptyState, Field, Input, Modal, SectionTitle, Select, Stat, TagChip, Textarea } from "@/components/ui/primitives";
import { ImageUploader } from "@/components/trades/Images";
import { BarRow } from "@/components/charts/EquityCurve";

const REASONS = MISSED_REASONS;

function MissedModal({ open, onClose, existing }: { open: boolean; onClose: () => void; existing?: MissedTrade | null }) {
  const addMissed = useApp((s) => s.addMissed);
  const updateMissed = useApp((s) => s.updateMissed);
  const allTags = useAllTags();
  const blank: MissedTrade = {
    id: uid(), pair: "", date: new Date().toISOString(), expectedRR: 2, session: "London", reason: "Hesitation", tags: [], imageIds: [], createdAt: new Date().toISOString(),
  };
  const [m, setM] = useState<MissedTrade>(existing ?? blank);

  const save = () => {
    if (!m.pair.trim()) return;
    const final = { ...m, pair: m.pair.trim().toUpperCase() };
    if (existing) updateMissed(final);
    else addMissed(final);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={existing ? "Edit missed trade" : "Log missed trade"} wide>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Field label="Pair"><Input value={m.pair} onChange={(e) => setM({ ...m, pair: e.target.value })} placeholder="XAUUSD" autoFocus /></Field>
          <Field label="Date">
            <Input type="date" value={m.date.slice(0, 10)} onChange={(e) => setM({ ...m, date: new Date(e.target.value).toISOString() })} />
          </Field>
          <Field label="Expected RR"><Input type="number" step="any" value={m.expectedRR} onChange={(e) => setM({ ...m, expectedRR: parseFloat(e.target.value) || 0 })} /></Field>
          <Field label="Session">
            <Select value={m.session} onChange={(e) => setM({ ...m, session: e.target.value as Session })}>
              {SESSIONS.map((s) => <option key={s}>{s}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Reason missed">
          <Select value={m.reason} onChange={(e) => setM({ ...m, reason: e.target.value })}>
            {REASONS.map((r) => <option key={r}>{r}</option>)}
          </Select>
        </Field>
        <div>
          <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-mute">Tags</div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((t) => (
              <TagChip key={t} tag={t} active={m.tags.includes(t)} onClick={() => setM({ ...m, tags: m.tags.includes(t) ? m.tags.filter((x) => x !== t) : [...m.tags, t] })} />
            ))}
          </div>
        </div>
        <Field label="Notes"><Textarea rows={2} value={m.notes ?? ""} onChange={(e) => setM({ ...m, notes: e.target.value || undefined })} placeholder="What stopped you?" /></Field>
        <ImageUploader label="Screenshot" ids={m.imageIds} onChange={(ids) => setM({ ...m, imageIds: ids })} />
        <div className="flex justify-end gap-2 border-t border-edge pt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={!m.pair.trim()}>{existing ? "Save changes" : "Save missed trade"}</Button>
        </div>
      </div>
    </Modal>
  );
}

export default function MissedPage() {
  const missed = useApp((s) => s.missed);
  const deleteMissed = useApp((s) => s.deleteMissed);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<MissedTrade | null>(null);

  const totalRR = missed.reduce((acc, m) => acc + m.expectedRR, 0);

  const byTag = useMemo(() => {
    const map = new Map<string, { count: number; rr: number }>();
    for (const m of missed) for (const t of m.tags) {
      const cur = map.get(t) ?? { count: 0, rr: 0 };
      map.set(t, { count: cur.count + 1, rr: cur.rr + m.expectedRR });
    }
    return Array.from(map.entries()).sort((a, b) => b[1].count - a[1].count).slice(0, 8);
  }, [missed]);

  const byReason = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of missed) map.set(m.reason, (map.get(m.reason) ?? 0) + 1);
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [missed]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="max-w-xl text-sm text-mute">The trades you didn't take are data too. Track them to see what hesitation costs and which setups you keep skipping.</p>
        <Button onClick={() => setCreateOpen(true)}>Log missed trade</Button>
      </div>

      {missed.length === 0 ? (
        <EmptyState title="No missed trades logged" body="Next time a valid setup runs without you, log it here instead of letting it sting." action={<Button onClick={() => setCreateOpen(true)}>Log missed trade</Button>} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <Stat label="Missed trades" value={String(missed.length)} />
            <Stat label="Potential RR missed" value={`+${totalRR.toFixed(1)}R`} tone={1} />
            <Stat label="Avg expected RR" value={`${(totalRR / missed.length).toFixed(2)}R`} />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card>
              <SectionTitle>Most missed setups (by tag)</SectionTitle>
              {byTag.length === 0 ? <div className="py-6 text-center text-sm text-mute">Tag your missed trades to see patterns.</div> :
                byTag.map(([tag, v]) => (
                  <BarRow key={tag} label={tag} value={v.count} max={byTag[0][1].count} display={`${v.count} · +${v.rr.toFixed(1)}R`} color="#F59E0B" />
                ))}
            </Card>
            <Card>
              <SectionTitle>Why trades were missed</SectionTitle>
              {byReason.map(([reason, count]) => (
                <BarRow key={reason} label={reason} value={count} max={byReason[0][1]} display={String(count)} />
              ))}
            </Card>
          </div>

          <Card className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-edge text-left text-xs uppercase tracking-wider text-mute">
                    <th className="py-2.5 pl-5 pr-4 font-medium">Pair</th>
                    <th className="py-2.5 pr-4 font-medium">Date</th>
                    <th className="py-2.5 pr-4 font-medium">Expected RR</th>
                    <th className="py-2.5 pr-4 font-medium">Session</th>
                    <th className="py-2.5 pr-4 font-medium">Reason</th>
                    <th className="py-2.5 pr-4 font-medium">Tags</th>
                    <th className="py-2.5 pr-5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {missed.map((m) => (
                    <tr key={m.id} className="border-b border-edge/50 last:border-0 hover:bg-surface/50">
                      <td className="py-3 pl-5 pr-4 font-medium text-ink">{m.pair}</td>
                      <td className="py-3 pr-4 text-mute">{fmtDate(m.date)}</td>
                      <td className="py-3 pr-4 font-mono text-warn">+{m.expectedRR.toFixed(1)}R</td>
                      <td className="py-3 pr-4 text-sub">{m.session}</td>
                      <td className="py-3 pr-4 text-sub">{m.reason}</td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-1">
                          {m.tags.map((t) => <span key={t} className="rounded-full border border-edge px-1.5 py-0.5 text-[10px] text-mute">{t}</span>)}
                        </div>
                      </td>
                      <td className="py-3 pr-5 text-right">
                        <Button variant="subtle" onClick={() => setEditing(m)}>Edit</Button>
                        <Button variant="subtle" onClick={() => deleteMissed(m.id)}><span className="text-neg">Delete</span></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {createOpen && <MissedModal open onClose={() => setCreateOpen(false)} />}
      {editing && <MissedModal open onClose={() => setEditing(null)} existing={editing} />}
    </div>
  );
}
