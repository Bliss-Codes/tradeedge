"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Trade,
  TradeType,
  SESSIONS,
  EMOTIONS,
  VIOLATIONS,
  GRADES,
  EXIT_REASONS,
  QUALITY_LABELS,
  COMMON_PAIRS,
  CustomFieldDef,
  Session,
  Emotion,
  Grade,
  ExitReason,
  Violation,
} from "@/lib/types";
import { useApp, useAllTags, uid } from "@/stores/useApp";
import { Button, Field, Input, Modal, Select, TagChip, Textarea, OptionCards } from "@/components/ui/primitives";
import { ImageUploader } from "@/components/trades/Images";
import { plannedRR } from "@/lib/metrics";

const num = (v: string) => (v.trim() === "" ? undefined : parseFloat(v));
const str = (v?: number) => (v === undefined || v === null || Number.isNaN(v) ? "" : String(v));

function StrategyFieldInput({
  def,
  value,
  onChange,
}: {
  def: CustomFieldDef;
  value: string | number | boolean | undefined;
  onChange: (v: string | number | boolean | undefined) => void;
}) {
  const label = `${def.name}${def.required ? " *" : ""}`;
  if (def.type === "boolean") {
    return (
      <div>
        <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-mute">{label}</div>
        <div className="flex gap-1.5">
          {[{ v: true, l: "Yes" }, { v: false, l: "No" }].map((o) => (
            <button
              key={o.l}
              type="button"
              onClick={() => onChange(value === o.v ? undefined : o.v)}
              className={`flex-1 rounded-xl border py-2 text-sm transition-colors ${
                value === o.v
                  ? o.v ? "border-pos/40 bg-pos/15 text-pos" : "border-neg/40 bg-neg/15 text-neg"
                  : "border-edge bg-surface text-mute hover:text-sub"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (def.type === "number") {
    return (
      <Field label={label}>
        <Input type="number" step="any" value={value === undefined ? "" : String(value)} onChange={(e) => onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))} />
      </Field>
    );
  }
  if (def.type === "text") {
    return (
      <Field label={label}>
        <Input value={value === undefined ? "" : String(value)} onChange={(e) => onChange(e.target.value || undefined)} />
      </Field>
    );
  }
  return (
    <OptionCards
      label={label}
      value={value === undefined ? undefined : String(value)}
      options={def.options ?? []}
      clearable={!def.required}
      onChange={(v) => onChange(v)}
    />
  );
}

export function TradeModal({
  open,
  onClose,
  existing,
  defaultType = "live",
}: {
  open: boolean;
  onClose: () => void;
  existing?: Trade | null;
  defaultType?: TradeType;
}) {
  const accounts = useApp((s) => s.accounts);
  const strategies = useApp((s) => s.strategies);
  const allTrades = useApp((s) => s.trades);
  const selectedAccount = useApp((s) => s.selectedAccountId);
  const addTrade = useApp((s) => s.addTrade);
  const updateTrade = useApp((s) => s.updateTrade);
  const addCustomTag = useApp((s) => s.addCustomTag);
  const allTags = useAllTags();

  const blank = useMemo<Trade>(
    () => ({
      id: uid(),
      accountId: selectedAccount !== "all" ? selectedAccount : accounts[0]?.id ?? "",
      type: defaultType,
      pair: "",
      direction: "long",
      date: new Date().toISOString().slice(0, 16) + ":00.000Z",
      rr: 0,
      pnl: 0,
      session: "London",
      tags: [],
      violations: [],
      beforeImageIds: [],
      afterImageIds: [],
      createdAt: new Date().toISOString(),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open]
  );

  const [t, setT] = useState<Trade>(existing ?? blank);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (open) setT(existing ? { ...existing } : blank);
  }, [open, existing, blank]);

  const set = <K extends keyof Trade>(key: K, value: Trade[K]) => setT((prev) => ({ ...prev, [key]: value }));

  const selectedStrategy = strategies.find((s) => s.id === t.strategyId);
  const planned = plannedRR(t);
  const strategyFields = selectedStrategy?.fields ?? [];

  // Pair picker: your most-used pairs first (one-tap), then common ones; type anything too.
  const { quickPairs, pairOptions } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const tr of allTrades) counts.set(tr.pair, (counts.get(tr.pair) ?? 0) + 1);
    const used = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).map(([p]) => p);
    const quick: string[] = [];
    for (const p of [...used, ...COMMON_PAIRS]) {
      if (!quick.includes(p) && quick.length < 6) quick.push(p);
    }
    const options = Array.from(new Set([...used, ...COMMON_PAIRS]));
    return { quickPairs: quick, pairOptions: options };
  }, [allTrades]);

  // One-tap outcome: fills RR, exit reason, and PnL (from risk amount) in a single click.
  const applyOutcome = (kind: "tp" | "sl" | "be") =>
    setT((prev) => {
      const rr = kind === "tp" ? plannedRR(prev) ?? (prev.rr > 0 ? prev.rr : 2) : kind === "sl" ? -1 : 0;
      const exitReason = kind === "tp" ? "Take Profit" : kind === "sl" ? "Stop Loss" : "Breakeven";
      const pnl = prev.riskAmount ? +(rr * prev.riskAmount).toFixed(2) : prev.pnl;
      return { ...prev, rr, exitReason, pnl };
    });

  const setFieldValue = (fid: string, v: string | number | boolean | undefined) =>
    setT((prev) => {
      const fv = { ...(prev.fieldValues ?? {}) };
      if (v === undefined || v === "") delete fv[fid];
      else fv[fid] = v;
      return { ...prev, fieldValues: fv };
    });

  const toggleChecklistItem = (item: string) =>
    set("checklistDone", (t.checklistDone ?? []).includes(item) ? (t.checklistDone ?? []).filter((x) => x !== item) : [...(t.checklistDone ?? []), item]);

  const toggleTag = (tag: string) =>
    set("tags", t.tags.includes(tag) ? t.tags.filter((x) => x !== tag) : [...t.tags, tag]);

  const toggleViolation = (v: Violation) =>
    set("violations", t.violations.includes(v) ? t.violations.filter((x) => x !== v) : [...t.violations, v]);

  // Universal requireds + whatever the chosen strategy marks required.
  const missing = useMemo(() => {
    const m: string[] = [];
    if (!t.accountId) m.push("Account");
    if (!t.pair.trim()) m.push("Pair");
    if (t.rr === undefined || Number.isNaN(t.rr)) m.push("RR");
    for (const f of strategyFields) {
      if (f.required) {
        const v = t.fieldValues?.[f.id];
        if (v === undefined || v === "" || v === null) m.push(f.name);
      }
    }
    return m;
  }, [t, strategyFields]);

  const save = () => {
    if (missing.length > 0) return;
    const final: Trade = { ...t, pair: t.pair.trim().toUpperCase() };
    if (existing) updateTrade(final);
    else addTrade(final);
    onClose();
  };

  const review: { key: keyof Trade; label: string }[] = [
    { key: "respectedRisk", label: "Respected Risk" },
    { key: "followedPlan", label: "Followed Plan" },
  ];

  const localDate = t.date ? new Date(t.date) : new Date();
  const dateValue = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  return (
    <Modal open={open} onClose={onClose} title={existing ? "Edit trade" : "Log trade"} wide>
      <div className="space-y-6">
        {/* Core */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Field label="Account">
            <Select value={t.accountId} onChange={(e) => set("accountId", e.target.value)}>
              {accounts.length === 0 && <option value="">No accounts yet</option>}
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Pair">
            <Input
              list="pair-options"
              value={t.pair}
              onChange={(e) => set("pair", e.target.value.toUpperCase())}
              placeholder="Type or pick"
              autoFocus
            />
            <datalist id="pair-options">
              {pairOptions.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </Field>
          <div>
            <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-mute">Direction</div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => set("direction", "long")}
                className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-colors ${
                  t.direction === "long" ? "border-pos/50 bg-pos/20 text-pos" : "border-edge bg-surface text-mute hover:text-sub"
                }`}
              >
                Long
              </button>
              <button
                type="button"
                onClick={() => set("direction", "short")}
                className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-colors ${
                  t.direction === "short" ? "border-neg/50 bg-neg/20 text-neg" : "border-edge bg-surface text-mute hover:text-sub"
                }`}
              >
                Short
              </button>
            </div>
          </div>
          <Field label="Entry date & time">
            <Input type="datetime-local" value={dateValue} onChange={(e) => set("date", new Date(e.target.value).toISOString())} />
          </Field>
        </div>

        {/* Quick pairs — one tap */}
        {quickPairs.length > 0 && (
          <div className="-mt-1 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-mute">Quick:</span>
            {quickPairs.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => set("pair", p)}
                className={`rounded-full border px-2.5 py-0.5 font-mono text-xs transition-colors ${
                  t.pair === p ? "border-accent/50 bg-accent/15 text-accent" : "border-edge bg-surface text-sub hover:border-accent/40"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <OptionCards label="Session" value={t.session} options={SESSIONS} onChange={(v) => v && set("session", v as Session)} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Strategy">
              <Select value={t.strategyId ?? ""} onChange={(e) => set("strategyId", e.target.value || undefined)}>
                <option value="">None</option>
                {strategies.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </Field>
            <OptionCards
              label="Type"
              value={t.type}
              options={[
                { value: "live", label: "Live" },
                { value: "forward", label: "Forward test" },
                { value: "backtest", label: "Backtest" },
              ]}
              onChange={(v) => v && set("type", v as TradeType)}
            />
          </div>
        </div>

        {/* Strategy fields — defined by the selected strategy (any methodology) */}
        {strategyFields.length > 0 && (
          <div className="rounded-xl border border-edge bg-surface/40 p-4">
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-accent">{selectedStrategy?.name} fields</div>
            <div className="space-y-4">
              {strategyFields.map((f) => (
                <StrategyFieldInput key={f.id} def={f} value={t.fieldValues?.[f.id]} onChange={(v) => setFieldValue(f.id, v)} />
              ))}
            </div>
          </div>
        )}
        {!t.strategyId && (
          <p className="-mt-2 text-xs text-mute">
            Tip: pick a strategy above to capture its custom fields (and feed the Breakdowns analytics). Create strategies under Strategies → templates included for SMC, Breakout, and Supply &amp; Demand.
          </p>
        )}

        {/* Prices & risk */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Field label="Entry"><Input type="number" step="any" value={str(t.entry)} onChange={(e) => set("entry", num(e.target.value))} /></Field>
          <Field label="Exit"><Input type="number" step="any" value={str(t.exit)} onChange={(e) => set("exit", num(e.target.value))} /></Field>
          <Field label="Stop loss"><Input type="number" step="any" value={str(t.stopLoss)} onChange={(e) => set("stopLoss", num(e.target.value))} /></Field>
          <Field label="Take profit"><Input type="number" step="any" value={str(t.takeProfit)} onChange={(e) => set("takeProfit", num(e.target.value))} /></Field>
          <Field label="Risk %"><Input type="number" step="any" value={str(t.riskPercent)} onChange={(e) => set("riskPercent", num(e.target.value))} /></Field>
          <Field label="Risk amount"><Input type="number" step="any" value={str(t.riskAmount)} onChange={(e) => set("riskAmount", num(e.target.value))} /></Field>
          <Field label="Lot size"><Input type="number" step="any" value={str(t.lotSize)} onChange={(e) => set("lotSize", num(e.target.value))} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="RR"><Input type="number" step="any" value={str(t.rr)} onChange={(e) => set("rr", num(e.target.value) ?? 0)} /></Field>
            <Field label="PnL"><Input type="number" step="any" value={str(t.pnl)} onChange={(e) => set("pnl", num(e.target.value) ?? 0)} /></Field>
          </div>
        </div>

        {/* One-tap outcome — fills RR + exit reason + PnL */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-mute">Quick outcome:</span>
          <button type="button" onClick={() => applyOutcome("tp")} className="rounded-xl border border-pos/30 bg-pos/10 px-3 py-1.5 text-sm text-pos transition-colors hover:bg-pos/20">
            ✓ Win {planned !== undefined ? `(+${planned.toFixed(1)}R)` : "(TP)"}
          </button>
          <button type="button" onClick={() => applyOutcome("sl")} className="rounded-xl border border-neg/30 bg-neg/10 px-3 py-1.5 text-sm text-neg transition-colors hover:bg-neg/20">
            ✗ Loss (−1R)
          </button>
          <button type="button" onClick={() => applyOutcome("be")} className="rounded-xl border border-edge bg-surface px-3 py-1.5 text-sm text-mute transition-colors hover:text-sub">
            Breakeven
          </button>
          {t.riskAmount ? <span className="text-xs text-mute">PnL auto-fills from risk amount</span> : <span className="text-xs text-mute">Set a risk amount to auto-fill PnL</span>}
        </div>

        {/* Grade · quality · exit */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-mute">Setup grade *</div>
            <div className="flex gap-1.5">
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => set("grade", t.grade === g ? undefined : (g as Grade))}
                  className={`flex-1 rounded-xl border py-2 font-mono text-sm font-semibold transition-colors ${
                    t.grade === g ? "border-accent/50 bg-accent/15 text-accent" : "border-edge bg-surface text-mute hover:text-sub"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-mute">
              <span>Quality score</span>
              <span className="text-mute normal-case">{t.qualityScore ? QUALITY_LABELS[t.qualityScore] : ""}</span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  title={QUALITY_LABELS[n]}
                  onClick={() => set("qualityScore", t.qualityScore === n ? undefined : n)}
                  className={`flex-1 rounded-xl border py-2 font-mono text-sm transition-colors ${
                    t.qualityScore === n ? "border-accent/50 bg-accent/15 text-accent" : "border-edge bg-surface text-mute hover:text-sub"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
        <OptionCards
          label="Exit reason"
          value={t.exitReason}
          options={EXIT_REASONS}
          clearable
          onChange={(v) => set("exitReason", v as ExitReason | undefined)}
        />

        {/* Planned RR read-out */}
        <div className="flex items-center gap-2 rounded-xl border border-edge bg-surface/50 px-3 py-2 text-sm">
          <span className="text-xs font-medium uppercase tracking-wider text-mute">Planned RR</span>
          {planned !== undefined ? (
            <span className="font-mono text-sub">{planned.toFixed(2)}R <span className="text-mute">from entry / SL / TP</span></span>
          ) : (
            <span className="text-mute">Add entry, stop & target to compute</span>
          )}
        </div>

        {/* Trade review checklist */}
        <div className="rounded-xl border border-edge bg-surface/40 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wider text-mute">Trade review</div>
            <span className="font-mono text-xs text-mute">{review.filter((r) => t[r.key] === true).length}/{review.length}</span>
          </div>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {review.map((r) => {
              const done = t[r.key] === true;
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => set(r.key, (done ? false : true) as never)}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${done ? "text-sub" : "text-mute hover:text-sub"}`}
                >
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${done ? "border-accent bg-accent/20 text-accent" : "border-edge"}`}>
                    {done ? "✓" : ""}
                  </span>
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Strategy checklist (live, only when a strategy with a checklist is selected) */}
        {selectedStrategy && selectedStrategy.checklist.length > 0 && (
          <div className="rounded-xl border border-edge bg-surface/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-wider text-mute">{selectedStrategy.name} checklist</div>
              <span className="font-mono text-xs text-mute">
                {(t.checklistDone ?? []).filter((c) => selectedStrategy.checklist.includes(c)).length}/{selectedStrategy.checklist.length}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {selectedStrategy.checklist.map((item) => {
                const done = (t.checklistDone ?? []).includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleChecklistItem(item)}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${done ? "text-sub" : "text-mute hover:text-sub"}`}
                  >
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${done ? "border-accent bg-accent/20 text-accent" : "border-edge"}`}>
                      {done ? "✓" : ""}
                    </span>
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tags */}
        <div>
          <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-mute">Tags</div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <TagChip key={tag} tag={tag} active={t.tags.includes(tag)} onClick={() => toggleTag(tag)} />
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag…"
              className="max-w-44"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newTag.trim()) {
                  e.preventDefault();
                  addCustomTag(newTag);
                  toggleTag(newTag.trim());
                  setNewTag("");
                }
              }}
            />
            <Button
              variant="ghost"
              onClick={() => {
                if (!newTag.trim()) return;
                addCustomTag(newTag);
                toggleTag(newTag.trim());
                setNewTag("");
              }}
            >
              Add tag
            </Button>
          </div>
        </div>

        {/* Psychology */}
        <div className="space-y-4">
          <OptionCards label="Emotion before" value={t.emotionBefore} options={EMOTIONS} clearable onChange={(v) => set("emotionBefore", v as Emotion | undefined)} />
          <OptionCards label="Emotion after" value={t.emotionAfter} options={EMOTIONS} clearable onChange={(v) => set("emotionAfter", v as Emotion | undefined)} />
        </div>

        {/* Rule violations */}
        <div>
          <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-mute">Rule violations</div>
          <div className="flex flex-wrap gap-2">
            {VIOLATIONS.map((v) => (
              <TagChip key={v} tag={v} active={t.violations.includes(v)} onClick={() => toggleViolation(v)} />
            ))}
          </div>
        </div>

        {/* Narrative */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="Trade thesis"><Textarea rows={3} value={t.thesis ?? ""} onChange={(e) => set("thesis", e.target.value || undefined)} placeholder="Why this trade, before entry." /></Field>
          <Field label="Notes"><Textarea rows={3} value={t.notes ?? ""} onChange={(e) => set("notes", e.target.value || undefined)} placeholder="Execution notes." /></Field>
          <Field label="Lessons learned"><Textarea rows={3} value={t.lessons ?? ""} onChange={(e) => set("lessons", e.target.value || undefined)} placeholder="After review." /></Field>
        </div>

        {/* Screenshots */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ImageUploader label="Before screenshots" ids={t.beforeImageIds} onChange={(ids) => set("beforeImageIds", ids)} />
          <ImageUploader label="After screenshots" ids={t.afterImageIds} onChange={(ids) => set("afterImageIds", ids)} />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-edge pt-4">
          <div className="text-xs text-mute">
            {missing.length > 0 ? (
              <span className="text-warn">Required: {missing.join(", ")}</span>
            ) : (
              <span className="text-pos">All required fields complete</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={save} disabled={missing.length > 0}>
              {existing ? "Save changes" : "Save trade"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
