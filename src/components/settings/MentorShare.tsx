"use client";

import { useCallback, useEffect, useState } from "react";
import { useApp } from "@/stores/useApp";
import { supabase } from "@/lib/supabase/client";
import { Button, Card, SectionTitle } from "@/components/ui/primitives";

interface ShareRow {
  token: string;
  label: string | null;
  account_id: string | null;
  hide_money: boolean;
  revoked: boolean;
  created_at: string;
}

const newToken = () => {
  const b = new Uint8Array(24);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
};

export function MentorShare() {
  const user = useApp((s) => s.user);
  const accounts = useApp((s) => s.accounts);
  const [rows, setRows] = useState<ShareRow[]>([]);
  const [label, setLabel] = useState("");
  const [accountId, setAccountId] = useState("");
  const [hideMoney, setHideMoney] = useState(true);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    if (!supabase || !user) return;
    const { data, error } = await supabase.from("shares").select("*").order("created_at", { ascending: false });
    if (error) setMsg(error.message.includes("shares") ? "Run supabase/20261102_shares.sql in the Supabase SQL editor first." : error.message);
    else setRows((data ?? []) as ShareRow[]);
  }, [user]);

  useEffect(() => { void load(); }, [load]);

  const link = (t: string) => `${window.location.origin}/share/${t}`;

  const create = async () => {
    if (!supabase || !user) return;
    setMsg("");
    const { error } = await supabase.from("shares").insert({
      token: newToken(),
      label: label.trim() || "Shared journal",
      account_id: accountId || null,
      hide_money: hideMoney,
    });
    if (error) { setMsg(error.message); return; }
    setLabel("");
    await load();
  };

  const revoke = async (token: string) => {
    if (!supabase) return;
    await supabase.from("shares").update({ revoked: true }).eq("token", token);
    await load();
  };

  const remove = async (token: string) => {
    if (!supabase) return;
    await supabase.from("shares").delete().eq("token", token);
    await load();
  };

  const copy = async (token: string) => {
    try { await navigator.clipboard.writeText(link(token)); setMsg("Link copied."); } catch { setMsg(link(token)); }
  };

  return (
    <Card>
      <SectionTitle>Mentor sharing</SectionTitle>
      {!supabase || !user ? (
        <p className="text-sm text-mute">Sharing needs cloud mode (Supabase) and a signed-in account.</p>
      ) : (
        <>
          <p className="mb-3 text-sm text-mute">
            Create a read-only link. Anyone with it sees stats, equity curve, score, and trades. Screenshots are never shared. Revoke any time.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label (e.g. For Coach Sam)" className="rounded-xl border border-edge bg-surface/40 px-3 py-2 text-sm" />
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="rounded-xl border border-edge bg-surface/40 px-3 py-2 text-sm">
              <option value="">All accounts</option>
              {accounts.filter((a) => !a.archived).map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <label className="mt-2 flex items-center gap-2 text-sm text-mute">
            <input type="checkbox" checked={hideMoney} onChange={(e) => setHideMoney(e.target.checked)} />
            Hide dollar amounts (R only)
          </label>
          <div className="mt-3"><Button onClick={create}>Create link</Button></div>
          {msg && <p className="mt-2 text-xs text-warn">{msg}</p>}
          <div className="mt-4 space-y-2">
            {rows.map((r) => (
              <div key={r.token} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-edge bg-surface/40 px-3 py-2 text-sm">
                <div className="min-w-0">
                  <div className="text-ink">{r.label} {r.revoked && <span className="text-xs text-neg">· revoked</span>}</div>
                  <div className="text-xs text-mute">{r.account_id ? accounts.find((a) => a.id === r.account_id)?.name ?? "1 account" : "All accounts"}{r.hide_money ? " · R only" : " · shows $"}</div>
                </div>
                <div className="flex gap-2">
                  {!r.revoked && <Button variant="ghost" onClick={() => copy(r.token)}>Copy link</Button>}
                  {!r.revoked && <Button variant="ghost" onClick={() => revoke(r.token)}>Revoke</Button>}
                  <Button variant="ghost" onClick={() => remove(r.token)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
