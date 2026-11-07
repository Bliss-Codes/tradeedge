"use client";

import { useEffect, useRef, useState } from "react";
import { useApp, uid } from "@/stores/useApp";
import { Account, ACCOUNT_TYPES, AccountType } from "@/lib/types";
import { computeStats, fmtMoney, fmtPct, fmtR, signColor } from "@/lib/metrics";
import { Button, Card, EmptyState, Field, Input, Modal, NumberInput, Select } from "@/components/ui/primitives";
import { ConnectDrawer } from "@/components/accounts/ConnectDrawer";
import { Mt5StatusPill, timeAgo } from "@/components/accounts/Mt5Status";
import { useMt5Links, linkState } from "@/lib/useMt5Links";

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
    <Modal open={open} onClose={onClose} title={existing ? "Edit account" : "Create account"} persistent>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name"><Input value={a.name} onChange={(e) => setA({ ...a, name: e.target.value })} placeholder="FundingPips 10K" autoFocus /></Field>
        <Field label="Type">
          <Select value={a.type} onChange={(e) => setA({ ...a, type: e.target.value as AccountType })}>
            {ACCOUNT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </Select>
        </Field>
        <Field label="Broker"><Input value={a.broker ?? ""} onChange={(e) => setA({ ...a, broker: e.target.value || undefined })} placeholder="IC Markets" /></Field>
        <Field label="Prop firm"><Input value={a.propFirm ?? ""} onChange={(e) => setA({ ...a, propFirm: e.target.value || undefined })} placeholder="Optional" /></Field>
        <Field label="Starting balance"><NumberInput value={a.balance || undefined} onChange={(v) => setA({ ...a, balance: v ?? 0 })} placeholder="e.g. 100000" /></Field>
        <Field label="Currency"><Input value={a.currency} onChange={(e) => setA({ ...a, currency: e.target.value.toUpperCase() })} placeholder="USD" /></Field>
        <div className="rounded-xl border border-edge bg-surface/40 p-3">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-mute">Prop-firm risk limits (optional)</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Daily loss limit">
              <NumberInput value={a.dailyLossLimit} onChange={(v) => setA({ ...a, dailyLossLimit: v })} placeholder={`e.g. 500 ${a.currency}`} />
            </Field>
            <Field label="Max drawdown limit">
              <NumberInput value={a.maxDrawdownLimit} onChange={(v) => setA({ ...a, maxDrawdownLimit: v })} placeholder={`e.g. 1000 ${a.currency}`} />
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

function RowMenu({ items }: { items: { label: string; onClick: () => void; danger?: boolean }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} aria-label="Account actions" className="rounded-lg px-2 py-1 text-lg leading-none text-mute hover:bg-surface hover:text-ink">⋮</button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-edge bg-card py-1 shadow-xl">
          {items.map((it) => (
            <button key={it.label} onClick={() => { setOpen(false); it.onClick(); }} className={`block w-full px-3 py-2 text-left text-sm hover:bg-surface ${it.danger ? "text-neg" : "text-ink"}`}>{it.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AccountsPage() {
  const accounts = useApp((s) => s.accounts);
  const trades = useApp((s) => s.trades);
  const deleteAccount = useApp((s) => s.deleteAccount);
  const updateAccount = useApp((s) => s.updateAccount);
  const setSelected = useApp((s) => s.setSelectedAccount);
  const { byAccount } = useMt5Links();
  const [drawer, setDrawer] = useState<{ open: boolean; accountId: string | null }>({ open: false, accountId: null });
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [confirming, setConfirming] = useState<Account | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const active = accounts.filter((a) => !a.archived);
  const archived = accounts.filter((a) => a.archived);

  const row = (a: Account) => {
    const own = trades.filter((t) => t.accountId === a.id && t.type === "live");
    const st = computeStats(own);
    const link = byAccount.get(a.id);
    const state = linkState(link);
    const isMt5 = Boolean(link) || own.some((t) => t.tags.includes("mt5-sync"));
    const equity = link?.balance != null && state !== "none" ? link.balance : a.balance + st.netPnl;
    const lastTrade = own.reduce<string | null>((m, t) => (!m || t.createdAt > m ? t.createdAt : m), null);
    const updated = link?.last_seen ?? lastTrade;
    return (
      <tr key={a.id} className={`border-t border-edge ${a.archived ? "opacity-70" : ""}`}>
        <td className="py-3 pr-3">
          <div className="font-medium text-ink">{a.name}</div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-mute">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${typeBadge[a.type]}`}>{a.type}</span>
            {Array.from(new Set([a.broker, a.propFirm].filter(Boolean))).join(" · ")}
          </div>
        </td>
        <td className="pr-3"><span className="rounded-md bg-surface px-2 py-0.5 text-xs text-sub">{isMt5 ? "MT5" : "Manual"}</span></td>
        <td className="pr-3">{isMt5 ? <Mt5StatusPill state={state} /> : <span className="text-xs text-mute">—</span>}</td>
        <td className="pr-3 font-mono text-sm text-ink">{fmtMoney(equity, a.currency)}</td>
        <td className={`pr-3 font-mono text-sm ${signColor(st.netPnl)}`}>{fmtMoney(st.netPnl, a.currency)}</td>
        <td className="pr-3 text-sm text-sub">{st.total}{st.total ? <span className="text-xs text-mute"> · {fmtPct(st.winRate)}</span> : null}</td>
        <td className="pr-3 text-xs text-mute">{timeAgo(updated)}</td>
        <td className="text-right">
          <RowMenu
            items={[
              { label: "Review trades", onClick: () => setSelected(a.id) },
              { label: isMt5 && state !== "online" ? "Reconnect MT5" : isMt5 ? "MT5 details" : "Connect MT5", onClick: () => setDrawer({ open: true, accountId: a.id }) },
              { label: "Edit", onClick: () => setEditing(a) },
              a.archived ? { label: "Restore", onClick: () => updateAccount({ ...a, archived: false }) } : { label: "Archive", onClick: () => updateAccount({ ...a, archived: true }) },
              { label: "Delete…", onClick: () => setConfirming(a), danger: true },
            ]}
          />
        </td>
      </tr>
    );
  };

  const table = (list: Account[]) => (
    <Card className="p-0">
      <div className="overflow-x-auto px-5 pb-2">
        <table className="w-full min-w-[860px] text-left">
          <thead className="text-[11px] uppercase tracking-wider text-mute">
            <tr>
              <th className="py-3 pr-3">Account</th><th className="pr-3">Source</th><th className="pr-3">Status</th>
              <th className="pr-3">Balance</th><th className="pr-3">P&amp;L</th><th className="pr-3">Trades · WR</th><th className="pr-3">Last updated</th><th />
            </tr>
          </thead>
          <tbody>{list.map(row)}</tbody>
        </table>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-mute">Connect MT5 for automatic sync, upload a CSV, or create an account by hand. Archive finished accounts to keep their history.</p>
        <Button onClick={() => setDrawer({ open: true, accountId: null })}>Add account</Button>
      </div>

      {accounts.length === 0 ? (
        <EmptyState title="No accounts yet" body="Connect your MT5 account for automatic sync, or create one by hand. Every trade belongs to one account." action={<Button onClick={() => setDrawer({ open: true, accountId: null })}>Add account</Button>} />
      ) : (
        <>
          {table(active)}
          {archived.length > 0 && (
            <div className="pt-2">
              <button
                onClick={() => setShowArchived((v) => !v)}
                className="flex w-full items-center gap-2 rounded-xl border border-edge bg-surface/30 px-4 py-2.5 text-left text-sm text-sub transition-colors hover:bg-surface/60"
              >
                <span className={`text-mute transition-transform ${showArchived ? "rotate-90" : ""}`}>▶</span>
                <span className="font-medium">Archived accounts</span>
                <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-mute">{archived.length}</span>
                <span className="ml-auto text-xs text-mute">{showArchived ? "Hide" : "Show"}</span>
              </button>
              {showArchived && <div className="mt-4">{table(archived)}</div>}
            </div>
          )}
        </>
      )}

      <ConnectDrawer key={drawer.accountId ?? "new"} open={drawer.open} initialAccountId={drawer.accountId} onClose={() => setDrawer({ open: false, accountId: null })} onManual={() => setCreateOpen(true)} />
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
