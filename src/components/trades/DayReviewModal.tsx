"use client";

import { useState } from "react";
import { DayReview, EMOTIONS, Emotion } from "@/lib/types";
import { useApp, uid } from "@/stores/useApp";
import { Button, Field, Modal, Select, Textarea } from "@/components/ui/primitives";

export function DayReviewModal({ date, onClose }: { date: string; onClose: () => void }) {
  const reviews = useApp((s) => s.reviews);
  const upsert = useApp((s) => s.upsertReview);
  const del = useApp((s) => s.deleteReview);
  const existing = reviews.find((r) => r.date === date);

  const [r, setR] = useState<DayReview>(
    existing ?? {
      id: uid(),
      date,
      disciplineRating: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  const set = <K extends keyof DayReview>(k: K, v: DayReview[K]) => setR((p) => ({ ...p, [k]: v }));

  const pretty = new Date(date + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <Modal open onClose={onClose} title={`Daily review · ${pretty}`}>
      <div className="space-y-4">
        <Field label="Market conditions">
          <Textarea rows={2} value={r.marketNotes ?? ""} onChange={(e) => set("marketNotes", e.target.value || undefined)} placeholder="Trend, news, ranges, what the session offered." />
        </Field>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="What I did well"><Textarea rows={3} value={r.wentWell ?? ""} onChange={(e) => set("wentWell", e.target.value || undefined)} placeholder="Keep doing this." /></Field>
          <Field label="What to improve"><Textarea rows={3} value={r.toImprove ?? ""} onChange={(e) => set("toImprove", e.target.value || undefined)} placeholder="The one thing for tomorrow." /></Field>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-mute">Discipline (1–5)</div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set("disciplineRating", n)}
                  className={`flex-1 rounded-xl border py-2 font-mono text-sm transition-colors ${
                    r.disciplineRating === n ? "border-accent/50 bg-accent/15 text-accent" : "border-edge bg-surface text-mute hover:text-sub"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-mute">Followed my plan</div>
            <div className="flex gap-1.5">
              {[{ v: true, label: "Yes" }, { v: false, label: "No" }].map((o) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => set("followedPlan", r.followedPlan === o.v ? undefined : o.v)}
                  className={`flex-1 rounded-xl border py-2 text-sm transition-colors ${
                    r.followedPlan === o.v ? (o.v ? "border-pos/40 bg-pos/15 text-pos" : "border-neg/40 bg-neg/15 text-neg") : "border-edge bg-surface text-mute hover:text-sub"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <Field label="Overall mood">
            <Select value={r.mood ?? ""} onChange={(e) => set("mood", (e.target.value || undefined) as Emotion | undefined)}>
              <option value="">—</option>
              {EMOTIONS.map((em) => <option key={em}>{em}</option>)}
            </Select>
          </Field>
        </div>
        <div className="flex items-center justify-between border-t border-edge pt-4">
          {existing ? (
            <Button variant="subtle" onClick={() => { del(existing.id); onClose(); }}><span className="text-neg">Delete review</span></Button>
          ) : <span />}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={() => { upsert(r); onClose(); }}>{existing ? "Save review" : "Save review"}</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
