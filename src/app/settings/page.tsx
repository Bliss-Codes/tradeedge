"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/stores/useApp";
import { download, snapshotToJSON, tradesToCSV } from "@/lib/csv";
import { clearImages } from "@/lib/data/images";
import { Button, Card, Modal, SectionTitle } from "@/components/ui/primitives";
import { Snapshot } from "@/lib/types";
import { supabase, isSupabaseEnabled } from "@/lib/supabase/client";

export default function SettingsPage() {
  const state = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [mt5Token, setMt5Token] = useState<string>("");
  const [tokenBusy, setTokenBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data }) => {
      const token = data.user?.user_metadata?.tradeedge_mt5_sync_token;
      if (active && typeof token === "string") setMt5Token(token);
    });
    return () => { active = false; };
  }, []);

  const copyValue = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied((x) => (x === key ? null : x)), 1400);
    } catch {
      setMsg("Could not copy to clipboard.");
    }
  };

  const generateMt5Token = async () => {
    if (!supabase) { setMsg("Sign in with Supabase to use MT5 sync."); return; }
    setTokenBusy(true);
    try {
      const bytes = new Uint8Array(32);
      crypto.getRandomValues(bytes);
      const token = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
      const { error } = await supabase.auth.updateUser({
        data: { tradeedge_mt5_sync_token: token },
      });
      if (error) throw error;
      setMt5Token(token);
      setMsg("MT5 sync token generated. Copy it into the EA inputs.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not generate MT5 sync token.");
    } finally {
      setTokenBusy(false);
    }
  };

  const snapshot: Snapshot = {
    accounts: state.accounts,
    trades: state.trades,
    strategies: state.strategies,
    missed: state.missed,
    reviews: state.reviews,
    customViolations: state.customViolations,
    customEmotions: state.customEmotions,
    customTags: state.customTags,
  };

  const restore = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text());
      const data = parsed?.data ?? parsed;
      if (!data || !Array.isArray(data.trades)) {
        setMsg("That file doesn't look like a TradeEdge backup.");
        return;
      }
      state.restoreBackup(data as Snapshot);
      setMsg(`Backup restored — ${data.trades.length} trades, ${data.accounts?.length ?? 0} accounts.`);
    } catch {
      setMsg("Couldn't read that file. Make sure it's a TradeEdge JSON backup.");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <SectionTitle>MT5 auto-sync</SectionTitle>
            <p className="mb-4 max-w-xl text-sm text-mute">Connect the TradeEdgeSync EA to automatically import closed MT5 trades. Your existing journal data is left untouched; synced trades are added using their MT5 deal IDs.</p>
          </div>
          <span className={`mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${mt5Token ? "border-pos/25 bg-pos/10 text-pos" : "border-edge bg-surface text-mute"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${mt5Token ? "bg-pos" : "bg-mute"}`} />
            {mt5Token ? "Ready" : "Not connected"}
          </span>
        </div>

        {!isSupabaseEnabled ? (
          <div className="rounded-xl border border-edge bg-surface/40 px-3 py-3 text-sm text-mute">Sign in with Supabase to connect MT5.</div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl border border-edge bg-surface/40 p-3">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-mute">Private sync token</div>
              <div className="flex items-center gap-2">
                <code className="min-w-0 flex-1 truncate rounded-lg bg-bg px-3 py-2 font-mono text-xs text-ink">{mt5Token || "Generate a token to connect this account"}</code>
                {mt5Token && <Button variant="ghost" className="shrink-0 px-3" onClick={() => void copyValue(mt5Token, "token")}>{copied === "token" ? "Copied" : "Copy"}</Button>}
                <Button variant="ghost" className="shrink-0 px-3" disabled={tokenBusy} onClick={() => void generateMt5Token()}>{tokenBusy ? "Generating…" : mt5Token ? "Regenerate" : "Generate"}</Button>
              </div>
              <p className="mt-2 text-[11px] text-mute">This token authenticates only your TradeEdge user. Keep it private. Regenerating it disconnects any EA using the old token.</p>
            </div>

            <div className="rounded-xl border border-edge bg-surface/40 p-3 text-sm">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-mute">TradeEdge User ID</span>
                <Button variant="subtle" className="px-2 py-1 text-xs" onClick={() => state.user?.id && void copyValue(state.user.id, "user")}>{copied === "user" ? "Copied" : "Copy"}</Button>
              </div>
              <code className="block break-all font-mono text-xs text-ink">{state.user?.id ?? "—"}</code>
            </div>

            {state.accounts.filter((a) => !a.archived).length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-mute">Choose the TradeEdge account that matches your MT5 account</div>
                {state.accounts.filter((a) => !a.archived).map((a) => (
                  <div key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-edge bg-surface/40 px-3 py-2.5">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-ink">{a.name}</div>
                      <code className="font-mono text-[10px] text-mute">{a.id}</code>
                    </div>
                    <Button variant="ghost" className="shrink-0 px-3 py-1.5 text-xs" onClick={() => void copyValue(a.id, `account-${a.id}`)}>{copied === `account-${a.id}` ? "Copied" : "Copy ID"}</Button>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-xl border border-edge bg-surface/30 px-3 py-3 text-xs text-mute">
              <div className="mb-1 font-medium text-sub">MT5 setup</div>
              <ol className="list-decimal space-y-1 pl-4">
                <li>Generate your private token above.</li>
                <li>Copy the token, User ID, and the correct Account ID into <span className="font-mono text-sub">TradeEdgeSync.mq5</span>.</li>
                <li>Add your TradeEdge domain under MT5 → Tools → Options → Expert Advisors → Allow WebRequest.</li>
                <li>Compile the EA, attach it to one chart, and keep MT5 running.</li>
              </ol>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <SectionTitle>Export</SectionTitle>
        <p className="mb-4 text-sm text-mute">Your data is yours. Take it anywhere, any time.</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => download("tradeedge-trades.csv", tradesToCSV(state.trades), "text/csv")}>
            Export trades (CSV)
          </Button>
          <Button variant="ghost" onClick={() => download("tradeedge-trades.json", JSON.stringify(state.trades, null, 2), "application/json")}>
            Export trades (JSON)
          </Button>
          <Button onClick={() => download("tradeedge-backup.json", snapshotToJSON(snapshot), "application/json")}>
            Full backup (JSON)
          </Button>
        </div>
        <p className="mt-3 text-xs text-mute">The JSON file includes accounts, trades, strategies, missed trades, and tags. Screenshots aren&apos;t embedded in this file — when signed in they live in your private Supabase storage bucket (or in this browser in local mode), referenced by id.</p>
      </Card>

      <Card>
        <SectionTitle>Restore</SectionTitle>
        <p className="mb-4 text-sm text-mute">Restore from a full backup. This replaces everything currently in the journal.</p>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void restore(f);
            e.target.value = "";
          }}
        />
        <Button variant="ghost" onClick={() => fileRef.current?.click()}>Choose backup file</Button>
      </Card>

      <Card>
        <SectionTitle>Data</SectionTitle>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => { state.loadSampleData(); const n = useApp.getState().trades.filter((t) => t.type === "live").length; setMsg(`Sample data loaded — ${n} live trades across 3 accounts. Open the Dashboard to see it.`); }}>
            Load sample data
          </Button>
          <Button variant="danger" onClick={() => setConfirmClear(true)}>Clear everything</Button>
        </div>
        <p className="mt-3 text-xs text-mute">
          {state.cloud
            ? `Signed in${state.user?.email ? ` as ${state.user.email}` : ""}. Your journal syncs to your Supabase account and is available on any device you sign in to. Screenshots are stored in your private Supabase bucket.`
            : "TradeEdge is running in local mode — everything is stored in this browser. Add Supabase keys (see README) to sync to the cloud and sign in across devices. No code changes needed; the data layer is already abstracted behind a backend interface."}
        </p>
      </Card>

      {msg && <p className="text-sm text-sub">{msg}</p>}

      {confirmClear && (
        <Modal open onClose={() => setConfirmClear(false)} title="Clear everything">
          <p className="text-sm text-sub">
            This deletes all accounts, trades, strategies, missed trades, tags, and screenshots from this device. Export a backup first if you want a way back.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmClear(false)}>Keep my data</Button>
            <Button
              variant="danger"
              onClick={async () => {
                await state.clearAll();
                await clearImages();
                setConfirmClear(false);
                setMsg("All data cleared.");
              }}
            >
              Delete everything
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
