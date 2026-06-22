"use client";

import { useRef, useState } from "react";
import { useApp } from "@/stores/useApp";
import { download, snapshotToJSON, tradesToCSV } from "@/lib/csv";
import { clearImages } from "@/lib/data/images";
import { Button, Card, Modal, SectionTitle } from "@/components/ui/primitives";
import { Snapshot } from "@/lib/types";

export default function SettingsPage() {
  const state = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const snapshot: Snapshot = {
    accounts: state.accounts,
    trades: state.trades,
    strategies: state.strategies,
    missed: state.missed,
    reviews: state.reviews,
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
        <p className="mt-3 text-xs text-mute">The full backup includes accounts, trades, strategies, missed trades, and tags. Screenshots stay on this device.</p>
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
