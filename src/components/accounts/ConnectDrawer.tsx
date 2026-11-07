"use client";

import { useEffect, useState } from "react";
import { useApp, uid } from "@/stores/useApp";
import { Account, ACCOUNT_TYPES, AccountType } from "@/lib/types";
import { tradesFromCSV, download } from "@/lib/csv";
import { supabase } from "@/lib/supabase/client";
import { Button, Field, Input, NumberInput, Select } from "@/components/ui/primitives";
import { useMt5Links, linkState } from "@/lib/useMt5Links";
import { Mt5StatusPill, timeAgo } from "@/components/accounts/Mt5Status";

type View = "choose" | "file" | "mt5";
const NEW = "__new__";

const newToken = () => {
  const b = new Uint8Array(24);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
};

function Option({ title, body, badge, onClick }: { title: string; body: string; badge?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full rounded-2xl border border-edge bg-surface/40 p-4 text-left transition-colors hover:border-accent/50 hover:bg-surface/70">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-ink">{title}</span>
        {badge && <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">{badge}</span>}
      </div>
      <p className="mt-1 text-xs text-mute">{body}</p>
    </button>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-edge bg-surface/40 px-3 py-2">
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-mute">{label}</div>
        <div className="truncate font-mono text-xs text-ink">{value}</div>
      </div>
      <Button variant="ghost" onClick={async () => { try { await navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 1500); } catch { /* clipboard blocked */ } }}>
        {done ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}

export function ConnectDrawer({ open, onClose, onManual, initialAccountId }: {
  open: boolean;
  onClose: () => void;
  onManual: () => void;
  initialAccountId?: string | null;
}) {
  const accounts = useApp((s) => s.accounts).filter((a) => !a.archived);
  const addAccount = useApp((s) => s.addAccount);
  const importTrades = useApp((s) => s.importTrades);
  const { links, refresh, available, error } = useMt5Links(4000);

  const [view, setView] = useState<View>(initialAccountId ? "mt5" : "choose");
  const [pick, setPick] = useState<string>(initialAccountId ?? accounts[0]?.id ?? NEW);
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("Funded");
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [linkedAccountId, setLinkedAccountId] = useState<string | null>(null);
  const [serverReady, setServerReady] = useState<boolean | null>(null);

  useEffect(() => {
    if (!open) return;
    setView(initialAccountId ? "mt5" : "choose");
    setPick(initialAccountId ?? accounts[0]?.id ?? NEW);
    setMsg(null);
    setLinkedAccountId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialAccountId]);

  // Is the server able to receive syncs (service-role key set)?
  useEffect(() => {
    if (!open || view !== "mt5") return;
    fetch("/api/mt5", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setServerReady(Boolean(j?.configured?.SUPABASE_SERVICE_ROLE_KEY && j?.configured?.NEXT_PUBLIC_SUPABASE_URL)))
      .catch(() => setServerReady(null));
  }, [open, view]);

  if (!open) return null;

  const resolveAccount = (): string | null => {
    if (pick !== NEW) return pick;
    if (!name.trim()) { setMsg("Give the account a name."); return null; }
    const a: Account = { id: uid(), name: name.trim(), type, balance: balance ?? 0, currency: "USD", createdAt: new Date().toISOString() };
    addAccount(a);
    setPick(a.id);
    return a.id;
  };

  const picker = (
    <div className="space-y-3">
      <Field label="Account">
        <Select value={pick} onChange={(e) => setPick(e.target.value)}>
          {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          <option value={NEW}>+ New account</option>
        </Select>
      </Field>
      {pick === NEW && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name" className="col-span-2"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="FundedNext EVA P2" /></Field>
          <Field label="Type">
            <Select value={type} onChange={(e) => setType(e.target.value as AccountType)}>
              {ACCOUNT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Starting balance"><NumberInput value={balance} onChange={setBalance} placeholder="e.g. 5000" /></Field>
        </div>
      )}
    </div>
  );

  const doImport = async (file: File | undefined) => {
    setMsg(null);
    if (!file) { setMsg("Choose a CSV file first."); return; }
    const accountId = resolveAccount();
    if (!accountId) return;
    setBusy(true);
    try {
      const { trades, errors } = tradesFromCSV(await file.text(), accountId, "live");
      const kept = startDate ? trades.filter((t) => t.date.slice(0, 10) >= startDate) : trades;
      if (kept.length) importTrades(kept);
      setMsg(`Imported ${kept.length} trade${kept.length === 1 ? "" : "s"}${trades.length !== kept.length ? ` (${trades.length - kept.length} before the start date skipped)` : ""}.${errors.length ? ` ${errors.length} row(s) skipped: ${errors.slice(0, 2).join("; ")}` : ""}`);
    } finally {
      setBusy(false);
    }
  };

  const startMt5 = async () => {
    setMsg(null);
    if (!supabase) return;
    const accountId = resolveAccount();
    if (!accountId) return;
    setBusy(true);
    try {
      const existing = links.find((l) => l.account_id === accountId && !l.revoked);
      if (!existing) {
        const { error: err } = await supabase.from("mt5_links").insert({ token: newToken(), account_id: accountId });
        if (err) { setMsg(err.message.includes("mt5_links") ? "Run supabase/20261104_mt5_links.sql in the Supabase SQL editor first." : err.message); return; }
      }
      await refresh();
      setLinkedAccountId(accountId);
    } finally {
      setBusy(false);
    }
  };

  const activeLink = links.find((l) => l.account_id === (linkedAccountId ?? (view === "mt5" && initialAccountId ? initialAccountId : "")) && !l.revoked);
  const state = linkState(activeLink);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const downloadEa = async () => {
    if (!activeLink) return;
    const src = await (await fetch("/TradeEdgeSync.mq5")).text();
    const out = src
      .replace(/(input string WebhookURL\s*=\s*)"[^"]*"/, `$1"${origin}/api/mt5"`)
      .replace(/(input string LinkToken\s*=\s*)"[^"]*"/, `$1"${activeLink.token}"`);
    download("TradeEdgeSync.mq5", out);
  };

  const title = view === "choose" ? "Add account" : view === "file" ? "Upload a file" : "Connect MetaTrader 5";

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-black/60" onClick={onClose} aria-label="Close" />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-edge bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-edge px-5 py-4">
          <div>
            {view !== "choose" && <button onClick={() => { setView("choose"); setMsg(null); setLinkedAccountId(null); }} className="mb-1 text-xs text-accent">← All options</button>}
            <h2 className="text-base font-semibold text-ink">{title}</h2>
          </div>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {view === "choose" && (
            <>
              <Option title="Connect MetaTrader 5" badge="Auto-sync" body="Closed trades flow in on their own. Download a ready-made EA, no fields to fill in." onClick={() => setView("mt5")} />
              <Option title="Upload a file" body="Import a CSV of past trades. Pick a start date so old history doesn't flood the account." onClick={() => setView("file")} />
              <Option title="Create manually" body="Make an empty account and log trades yourself." onClick={() => { onClose(); onManual(); }} />
            </>
          )}

          {view === "file" && (
            <>
              {picker}
              <Field label="Start date (optional)"><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></Field>
              <Field label="CSV file"><input id="csvfile" type="file" accept=".csv,text/csv" className="block w-full text-sm text-mute file:mr-3 file:rounded-lg file:border-0 file:bg-surface file:px-3 file:py-2 file:text-sm file:text-ink" /></Field>
              <p className="text-xs text-mute">Needs columns for date, pair, direction and either rr or pnl. Use Settings → Export trades (CSV) as a template.</p>
              <Button disabled={busy} onClick={() => doImport((document.getElementById("csvfile") as HTMLInputElement | null)?.files?.[0])}>{busy ? "Importing…" : "Import trades"}</Button>
            </>
          )}

          {view === "mt5" && (
            <>
              {!available ? (
                <div className="rounded-xl border border-warn/40 bg-warn/10 p-3 text-sm text-warn">
                  Auto-sync needs cloud mode (Supabase) and a signed-in account. Until then, use Upload a file or Create manually.
                </div>
              ) : (
                <>
                  {serverReady === false && (
                    <div className="rounded-xl border border-warn/40 bg-warn/10 p-3 text-xs text-warn">
                      The server can&apos;t receive syncs yet. In Vercel → Settings → Environment Variables add <span className="font-mono">SUPABASE_SERVICE_ROLE_KEY</span> (Supabase → Settings → API → service_role), then redeploy. One time only.
                    </div>
                  )}
                  {error && <div className="rounded-xl border border-warn/40 bg-warn/10 p-3 text-xs text-warn">{error}</div>}

                  {!activeLink ? (
                    <>
                      {picker}
                      <Button disabled={busy} onClick={startMt5}>{busy ? "Preparing…" : "Continue"}</Button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between rounded-xl border border-edge bg-surface/40 px-3 py-3">
                        <div>
                          <div className="text-xs text-mute">{accounts.find((a) => a.id === activeLink.account_id)?.name ?? "Account"}</div>
                          <div className="mt-1"><Mt5StatusPill state={state} /></div>
                        </div>
                        <div className="text-right text-xs text-mute">
                          {state === "online" || state === "offline" ? (
                            <>
                              <div>MT5 #{activeLink.login ?? "—"}</div>
                              <div>{activeLink.server ?? ""}</div>
                              <div>seen {timeAgo(activeLink.last_seen)}</div>
                            </>
                          ) : (
                            <div>Finish the steps below</div>
                          )}
                        </div>
                      </div>

                      {state === "online" ? (
                        <div className="rounded-xl border border-pos/40 bg-pos/10 p-3 text-sm text-pos">
                          Connected. Recent history is backfilling now, and every trade you close will appear on its own.
                        </div>
                      ) : (
                        <ol className="space-y-3 text-sm text-sub">
                          <li>
                            <div className="mb-2 font-medium text-ink">1. Download your EA</div>
                            <Button onClick={downloadEa}>Download TradeEdgeSync.mq5</Button>
                            <p className="mt-1 text-xs text-mute">It already contains your site address and this account&apos;s private link.</p>
                          </li>
                          <li>
                            <div className="font-medium text-ink">2. Install it in MT5</div>
                            <p className="text-xs text-mute">File → Open Data Folder → MQL5 → Experts. Paste the file there, open it in MetaEditor (F4) and press Compile (F7).</p>
                          </li>
                          <li>
                            <div className="mb-2 font-medium text-ink">3. Allow it to reach TradeEdge</div>
                            <p className="mb-2 text-xs text-mute">Tools → Options → Expert Advisors → tick &quot;Allow WebRequest for listed URL&quot; and add:</p>
                            <CopyRow label="Site address" value={origin} />
                          </li>
                          <li>
                            <div className="font-medium text-ink">4. Switch it on</div>
                            <p className="text-xs text-mute">Drag TradeEdgeSync onto any chart and click Algo Trading in the toolbar. This page turns green within a minute.</p>
                          </li>
                        </ol>
                      )}
                      <p className="text-[11px] text-mute">Using several MT5 logins? Repeat this for each account, each gets its own EA file. Some prop firms restrict EAs, so check yours. This one only reads closed trades and never places orders.</p>
                    </>
                  )}
                </>
              )}
            </>
          )}

          {msg && <p className="text-xs text-warn">{msg}</p>}
        </div>
      </aside>
    </div>
  );
}
