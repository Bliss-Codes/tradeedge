"use client";

import { useState } from "react";
import { useApp, uid } from "@/stores/useApp";
import { Account, ACCOUNT_TYPES, AccountType } from "@/lib/types";
import { computeStats, fmtMoney, fmtPct, fmtR, signColor } from "@/lib/metrics";
import { Button, Card, EmptyState, Field, Input, Modal, Select } from "@/components/ui/primitives";

function AccountModal({ open, onClose, existing }: { open: boolean; onClose: () => void; existing?: Account | null }) {
  const addAccount = useApp((s) => s.addAccount);
  const updateAccount = useApp((s) => s.updateAccount);
  const blank: Account = { id: uid(), name: "", type: "Personal", balance: 0, currency: "USD", createdAt: new Date().toISOString() };
  const [a, setA] = useState<Account>(existing ?? blank);

  const save = () => {
    if (!a.name.trim()) return;
    const final = { ...a, name: a.name.trim() };
    if (existing) updateAccount(final);
    else addAccount(final);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={existing ? "Edit account" : "Create account"}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name"><Input value={a.name} onChange={(e) => setA({ ...a, name: e.target.value })} placeholder="FundingPips 10K" autoFocus /></Field>
        <Field label="Type">
          <Select value={a.type} onChange={(e) => setA({ ...a, type: e.target.value as AccountType })}>
            {ACCOUNT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </Select>
        </Field>
        <Field label="Broker"><Input value={a.broker ?? ""} onChange={(e) => setA({ ...a, broker: e.target.value || undefined })} placeholder="IC Markets" /></Field>
        <Field label="Prop firm"><Input value={a.propFirm ?? ""} onChange={(e) => setA({ ...a, propFirm: e.target.value || undefined })} placeholder="Optional" /></Field>
        <Field label="Starting balance"><Input type="number" step="any" value={a.balance} onChange={(e) => setA({ ...a, balance: parseFloat(e.target.value) || 0 })} /></Field>
        <Field label="Currency"><Input value={a.currency} onChange={(e) => setA({ ...a, currency: e.target.value.toUpperCase() })} placeholder="USD" /></Field>
        <div className="rounded-xl border border-edge bg-surface/40 p-3">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-mute">Prop-firm risk limits (optional)</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Daily loss limit">
              <Input
                type="number"
                step="any"
                value={a.dailyLossLimit ?? ""}
                onChange={(e) => setA({ ...a, dailyLossLimit: e.target.value === "" ? undefined : parseFloat(e.target.value) })}
                placeholder={`e.g. 500 ${a.currency}`}
              />
            </Field>
            <Field label="Max drawdown limit">
              <Input
                type="number"
                step="any"
                value={a.maxDrawdownLimit ?? ""}
                onChange={(e) => setA({ ...a, maxDrawdownLimit: e.target.value === "" ? undefined : parseFloat(e.target.value) })}
                placeholder={`e.g. 1000 ${a.currency}`}
              />
            </Field>
          </div>
          <p className="mt-2 text-[11px] text-mute">When set, the dashboard warns you as you approach these on this account.</p>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2 border-t border-edge pt-4">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={save} disabled={!a.name.trim()}>{existing ? "Save changes" : "Create account"}</Button>
      </div>
    </Modal>
  );
}

const typeBadge: Record<AccountType, string> = {
  Personal: "bg-accent/15 text-accent",
  Demo: "bg-edge text-mute",
  Challenge: "bg-warn/15 text-warn",
  Funded: "bg-pos/15 text-pos",
  Backtest: "bg-edge text-sub",
};

export default function AccountsPage() {
  const accounts = useApp((s) => s.accounts);
  const trades = useApp((s) => s.trades);
  const deleteAccount = useApp((s) => s.deleteAccount);
  const updateAccount = useApp((s) => s.updateAccount);
  const setSelected = useApp((s) => s.setSelectedAccount);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [confirming, setConfirming] = useState<Account | null>(null);

  const active = accounts.filter((a) => !a.archived);
  const archived = accounts.filter((a) => a.archived);

  const card = (a: Account) => {
    const accountTrades = trades.filter((t) => t.accountId === a.id && t.type === "live");
    const st = computeStats(accountTrades);
    const equity = a.balance + st.netPnl;
    return (
      <Card key={a.id} className={a.archived ? "opacity-75" : ""}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-base font-semibold text-ink">{a.name}</div>
            <div className="mt-1 text-xs text-mute">{[a.broker, a.propFirm].filter(Boolean).join(" · ") || "—"}</div>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadge[a.type]}`}>{a.type}</span>
        </div>
        <div className="mt-4 font-mono text-2xl font-semibold text-ink">{fmtMoney(equity, a.currency)}</div>
        <div className="mt-1 text-xs text-mute">
          Start {fmtMoney(a.balance, a.currency)} · P&L <span className={signColor(st.netPnl)}>{fmtMoney(st.netPnl, a.currency)}</span>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-edge bg-surface/50 px-3 py-2 text-xs text-mute">
          <span>{st.total} trades</span>
          <span>{st.total ? fmtPct(st.winRate) : "—"} WR</span>
          <span className={`font-mono ${signColor(st.netRR)}`}>{fmtR(st.netRR)}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="ghost" className="flex-1" onClick={() => setSelected(a.id)}>Review</Button>
          <Button variant="ghost" onClick={() => setEditing(a)}>Edit</Button>
          {a.archived ? (
            <Button variant="subtle" onClick={() => updateAccount({ ...a, archived: false })}>Restore</Button>
          ) : (
            <Button variant="subtle" onClick={() => updateAccount({ ...a, archived: true })}>Archive</Button>
          )}
          <Button variant="danger" onClick={() => setConfirming(a)}>Delete</Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-mute">Archive finished or blown accounts to keep their history without cluttering your active view.</p>
        <Button onClick={() => setCreateOpen(true)}>Create account</Button>
      </div>

      {accounts.length === 0 ? (
        <EmptyState title="No accounts yet" body="Create your first account — personal, demo, challenge, funded, or backtest. Every trade belongs to one." action={<Button onClick={() => setCreateOpen(true)}>Create account</Button>} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{active.map(card)}</div>
          {archived.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-medium uppercase tracking-wider text-mute">Archived ({archived.length})</div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{archived.map(card)}</div>
            </div>
          )}
        </>
      )}

      {createOpen && <AccountModal open onClose={() => setCreateOpen(false)} />}
      {editing && <AccountModal open onClose={() => setEditing(null)} existing={editing} />}
      {confirming && (
        <Modal open onClose={() => setConfirming(null)} title="Delete account permanently">
          <p className="text-sm text-sub">
            Deleting <span className="font-medium text-ink">{confirming.name}</span> also <span className="text-neg">permanently removes its {trades.filter((t) => t.accountId === confirming.id).length} trades</span> and their stats. This can&apos;t be undone.
          </p>
          <p className="mt-2 text-sm text-mute">
            If this is a finished or blown prop account, use <span className="font-medium text-ink">Archive</span> instead — it keeps the trade history for review and just hides the account from your active view.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            {!confirming.archived && (
              <Button variant="subtle" onClick={() => { updateAccount({ ...confirming, archived: true }); setConfirming(null); }}>Archive instead</Button>
            )}
            <Button variant="ghost" onClick={() => setConfirming(null)}>Keep account</Button>
            <Button variant="danger" onClick={() => { deleteAccount(confirming.id); setConfirming(null); }}>Delete permanently</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
