"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useApp, useVisibleTrades, uid, useDisplayCurrency } from "@/stores/useApp";
import { Strategy, CustomFieldDef, FieldType } from "@/lib/types";
import { computeStats, fmtPF, fmtPct, fmtR, fmtMoney, signColor } from "@/lib/metrics";
import { Button, Card, EmptyState, Field, Input, Modal, Select, TagChip, Textarea } from "@/components/ui/primitives";
import { useAllTags } from "@/stores/useApp";
import { STRATEGY_TEMPLATES } from "@/lib/data/templates";

function OptionsInput({ value, onChange, className = "" }: { value: string[]; onChange: (arr: string[]) => void; className?: string }) {
  const [text, setText] = useState(value.join(", "));
  const focused = useRef(false);
  useEffect(() => {
    if (!focused.current) setText(value.join(", "));
  }, [value]);
  return (
    <Input
      className={className}
      value={text}
      onFocus={() => (focused.current = true)}
      onBlur={() => (focused.current = false)}
      onChange={(e) => {
        setText(e.target.value);
        onChange(e.target.value.split(",").map((o) => o.trim()).filter(Boolean));
      }}
      placeholder="Options, comma-separated (e.g. Bullish, Bearish)"
    />
  );
}

function FieldBuilder({ fields, onChange }: { fields: CustomFieldDef[]; onChange: (f: CustomFieldDef[]) => void }) {
  const update = (id: string, patch: Partial<CustomFieldDef>) => onChange(fields.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  return (
    <div className="space-y-2">
      {fields.map((f) => (
        <div key={f.id} className="rounded-xl border border-edge bg-surface/40 p-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-center">
            <Input
              className="sm:col-span-4"
              value={f.name}
              onChange={(e) => update(f.id, { name: e.target.value })}
              placeholder="Field name (e.g. Entry Model)"
            />
            <Select className="sm:col-span-3" value={f.type} onChange={(e) => update(f.id, { type: e.target.value as FieldType })}>
              <option value="select">Dropdown</option>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="boolean">Yes / No</option>
            </Select>
            <label className="flex items-center gap-2 text-xs text-mute sm:col-span-3">
              <input type="checkbox" checked={!!f.required} onChange={(e) => update(f.id, { required: e.target.checked })} />
              Required
            </label>
            <button onClick={() => onChange(fields.filter((x) => x.id !== f.id))} className="text-left text-xs text-neg hover:underline sm:col-span-2 sm:text-right">
              Remove
            </button>
          </div>
          {f.type === "select" && (
            <OptionsInput
              className="mt-2"
              value={f.options ?? []}
              onChange={(arr) => update(f.id, { options: arr })}
            />
          )}
        </div>
      ))}
      <Button variant="ghost" onClick={() => onChange([...fields, { id: uid(), name: "", type: "select", options: [] }])}>
        + Add field
      </Button>
    </div>
  );
}

function StrategyModal({ open, onClose, existing }: { open: boolean; onClose: () => void; existing?: Strategy | null }) {
  const addStrategy = useApp((s) => s.addStrategy);
  const updateStrategy = useApp((s) => s.updateStrategy);
  const allTags = useAllTags();
  const blank: Strategy = { id: uid(), name: "", description: "", rules: [], checklist: [], tags: [], fields: [], createdAt: new Date().toISOString() };
  const [s, setS] = useState<Strategy>(existing ?? blank);
  const [rulesText, setRulesText] = useState((existing?.rules ?? []).join("\n"));
  const [checkText, setCheckText] = useState((existing?.checklist ?? []).join("\n"));

  const applyTemplate = (key: string) => {
    const tpl = STRATEGY_TEMPLATES.find((t) => t.key === key);
    if (!tpl) return;
    const built = tpl.build();
    setS({ ...built, id: s.id, createdAt: s.createdAt });
    setRulesText(built.rules.join("\n"));
    setCheckText(built.checklist.join("\n"));
  };

  const save = () => {
    if (!s.name.trim()) return;
    const final: Strategy = {
      ...s,
      name: s.name.trim(),
      rules: rulesText.split("\n").map((r) => r.trim()).filter(Boolean),
      checklist: checkText.split("\n").map((r) => r.trim()).filter(Boolean),
      fields: (s.fields ?? []).filter((f) => f.name.trim()).map((f) => ({ ...f, name: f.name.trim() })),
    };
    if (existing) updateStrategy(final);
    else addStrategy(final);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={existing ? "Edit strategy" : "Create strategy"} wide persistent>
      <div className="space-y-4">
        {!existing && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-edge bg-surface/40 p-3">
            <span className="text-xs uppercase tracking-wider text-mute">Start from template:</span>
            {STRATEGY_TEMPLATES.map((t) => (
              <Button key={t.key} variant="ghost" onClick={() => applyTemplate(t.key)}>{t.label}</Button>
            ))}
          </div>
        )}
        <Field label="Name"><Input value={s.name} onChange={(e) => setS({ ...s, name: e.target.value })} placeholder="My strategy" autoFocus /></Field>
        <Field label="Description"><Textarea rows={2} value={s.description ?? ""} onChange={(e) => setS({ ...s, description: e.target.value })} placeholder="What this setup is and when it applies." /></Field>
        <Field label="Rules (one per line)"><Textarea rows={3} value={rulesText} onChange={(e) => setRulesText(e.target.value)} placeholder={"Bias aligned\nClear setup\nConfirmation"} /></Field>
        <Field label="Checklist (one per line)"><Textarea rows={3} value={checkText} onChange={(e) => setCheckText(e.target.value)} placeholder={"Bias marked\nRisk ≤ 1%"} /></Field>
        <div>
          <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-mute">Custom fields</div>
          <p className="mb-2 text-xs text-mute">These appear in the trade form when this strategy is selected, and become break-downs in Analytics.</p>
          <FieldBuilder fields={s.fields ?? []} onChange={(fields) => setS({ ...s, fields })} />
        </div>
        <div>
          <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-mute">Tags</div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((t) => (
              <TagChip key={t} tag={t} active={s.tags.includes(t)} onClick={() => setS({ ...s, tags: s.tags.includes(t) ? s.tags.filter((x) => x !== t) : [...s.tags, t] })} />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-edge pt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={!s.name.trim()}>{existing ? "Save changes" : "Create strategy"}</Button>
        </div>
      </div>
    </Modal>
  );
}

export default function StrategiesPage() {
  const strategies = useApp((s) => s.strategies);
  const deleteStrategy = useApp((s) => s.deleteStrategy);
  const trades = useVisibleTrades();
  const currency = useDisplayCurrency();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Strategy | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const statsFor = useMemo(() => {
    const map = new Map<string, ReturnType<typeof computeStats>>();
    strategies.forEach((s) => map.set(s.id, computeStats(trades.filter((t) => t.strategyId === s.id))));
    return map;
  }, [strategies, trades]);

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>Create strategy</Button>
      </div>

      {strategies.length === 0 ? (
        <EmptyState title="No strategies yet" body="Define your setups with rules and a checklist. Every trade you tag with a strategy feeds its statistics." action={<Button onClick={() => setCreateOpen(true)}>Create strategy</Button>} />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {strategies.map((s) => {
            const st = statsFor.get(s.id)!;
            const open = expanded === s.id;
            return (
              <Card key={s.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-ink">{s.name}</div>
                    {s.description && <p className="mt-1 text-sm text-mute">{s.description}</p>}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="subtle" onClick={() => setEditing(s)}>Edit</Button>
                    <Button variant="subtle" onClick={() => deleteStrategy(s.id)}><span className="text-neg">Delete</span></Button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-5 gap-2 rounded-xl border border-edge bg-surface/50 p-3 text-center">
                  {[
                    ["Win rate", fmtPct(st.winRate), ""],
                    ["Avg RR", st.avgRR.toFixed(2), signColor(st.avgRR)],
                    ["PF", fmtPF(st.profitFactor), ""],
                    ["Net P&L", fmtMoney(st.netPnl, currency), signColor(st.netPnl)],
                    ["Trades", String(st.total), ""],
                  ].map(([label, value, cls]) => (
                    <div key={label}>
                      <div className="text-[10px] uppercase tracking-wider text-mute">{label}</div>
                      <div className={`mt-0.5 font-mono text-sm font-medium ${cls || "text-ink"}`}>{value}</div>
                    </div>
                  ))}
                </div>

                {s.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => <TagChip key={t} tag={t} />)}
                  </div>
                )}

                {(s.rules.length > 0 || s.checklist.length > 0) && (
                  <button className="mt-3 text-xs text-accent hover:underline" onClick={() => setExpanded(open ? null : s.id)}>
                    {open ? "Hide rules & checklist" : "Show rules & checklist"}
                  </button>
                )}
                {open && (
                  <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {s.rules.length > 0 && (
                      <div>
                        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-mute">Rules</div>
                        <ol className="list-decimal space-y-1 pl-5 text-sm text-sub">
                          {s.rules.map((r, i) => <li key={i}>{r}</li>)}
                        </ol>
                      </div>
                    )}
                    {s.checklist.length > 0 && (
                      <div>
                        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-mute">Checklist</div>
                        <ul className="space-y-1 text-sm text-sub">
                          {s.checklist.map((c, i) => <li key={i}>☐ {c}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {createOpen && <StrategyModal open onClose={() => setCreateOpen(false)} />}
      {editing && <StrategyModal open onClose={() => setEditing(null)} existing={editing} />}
    </div>
  );
}
