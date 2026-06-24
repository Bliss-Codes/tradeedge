"use client";

import { useMemo, useRef, useState } from "react";
import { useApp } from "@/stores/useApp";
import { tradesFromCSV } from "@/lib/csv";
import { TradeType } from "@/lib/types";
import { computeStats, equityCurve, fmtPF, fmtPct, fmtR, signColor } from "@/lib/metrics";
import { Button, Card, Field, Modal, SectionTitle, Select } from "@/components/ui/primitives";
import { EquityCurve } from "@/components/charts/EquityCurve";
import { TradeModal } from "@/components/trades/TradeModal";

const COLS: { label: string; type: TradeType; hint: string }[] = [
  { label: "Backtest", type: "backtest", hint: "Historical replay" },
  { label: "Forward test", type: "forward", hint: "Demo, real time" },
  { label: "Live", type: "live", hint: "Real money" },
];

export default function BacktestingPage() {
  const trades = useApp((s) => s.trades);
  const accounts = useApp((s) => s.accounts);
  const selectedAccount = useApp((s) => s.selectedAccountId);
  const importTrades = useApp((s) => s.importTrades);
  const strategies = useApp((s) => s.strategies);

  const [importOpen, setImportOpen] = useState(false);
  const [importType, setImportType] = useState<TradeType>("backtest");
  const [importAccount, setImportAccount] = useState("");
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [logOpen, setLogOpen] = useState(false);
  const [strategyFilter, setStrategyFilter] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const scoped = useMemo(
    () =>
      trades.filter(
        (t) =>
          (selectedAccount === "all" || t.accountId === selectedAccount) &&
          (!strategyFilter || t.strategyId === strategyFilter)
      ),
    [trades, selectedAccount, strategyFilter]
  );

  const byType = useMemo(
    () => Object.fromEntries(COLS.map((c) => [c.type, scoped.filter((t) => t.type === c.type)])) as Record<TradeType, typeof scoped>,
    [scoped]
  );

  const handleFile = async (file: File) => {
    const text = await file.text();
    const accountId = importAccount || accounts[0]?.id;
    if (!accountId) {
      setImportMsg("Create an account first — imported trades need a home.");
      return;
    }
    const { trades: parsed, errors } = tradesFromCSV(text, accountId, importType);
    if (parsed.length) importTrades(parsed);
    setImportMsg(
      parsed.length
        ? `Imported ${parsed.length} trade${parsed.length === 1 ? "" : "s"}.${errors.length ? ` ${errors.length} row(s) skipped.` : ""}`
        : errors.join(" ") || "Nothing to import."
    );
  };

  const live = computeStats(byType.live);
  const back = computeStats(byType.backtest);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-mute">
          Test a system on history, prove it forward, then compare against live execution. If live numbers drift far from the backtest, the gap is usually you — not the system.
        </p>
        <div className="flex gap-2">
          <Select value={strategyFilter} onChange={(e) => setStrategyFilter(e.target.value)} className="w-auto">
            <option value="">All strategies</option>
            {strategies.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <Button variant="ghost" onClick={() => setLogOpen(true)}>Log test trade</Button>
          <Button onClick={() => { setImportMsg(null); setImportOpen(true); }}>Import CSV</Button>
        </div>
      </div>

      {/* Comparison */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {COLS.map((c) => {
          const list = byType[c.type];
          const s = computeStats(list);
          return (
            <Card key={c.type}>
              <div className="flex items-baseline justify-between">
                <div className="text-sm font-semibold text-ink">{c.label}</div>
                <div className="text-xs text-mute">{c.hint}</div>
              </div>
              <div className="mt-4 space-y-2.5 text-sm">
                {[
                  ["Trades", String(s.total), "text-ink"],
                  ["Win rate", s.total ? fmtPct(s.winRate) : "—", "text-ink"],
                  ["Avg RR (expectancy)", s.total ? `${s.avgRR.toFixed(2)}R` : "—", signColor(s.avgRR)],
                  ["Profit factor", s.total ? fmtPF(s.profitFactor) : "—", "text-ink"],
                  ["Net RR", s.total ? fmtR(s.netRR) : "—", signColor(s.netRR)],
                  ["Max drawdown", s.total ? `−${s.maxDrawdownR.toFixed(2)}R` : "—", "text-neg"],
                ].map(([label, value, cls]) => (
                  <div key={label} className="flex justify-between border-b border-edge/50 pb-2 last:border-0">
                    <span className="text-mute">{label}</span>
                    <span className={`font-mono ${cls}`}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <EquityCurve points={equityCurve(list)} height={120} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Backtest vs live verdict */}
      {back.total > 0 && live.total > 0 && (
        <Card>
          <SectionTitle>Backtest vs live</SectionTitle>
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            {[
              ["Win rate gap", `${(live.winRate - back.winRate).toFixed(1)}pp`, live.winRate - back.winRate],
              ["Expectancy gap", `${(live.avgRR - back.avgRR).toFixed(2)}R`, live.avgRR - back.avgRR],
              ["PF gap", back.profitFactor !== Infinity && live.profitFactor !== Infinity ? (live.profitFactor - back.profitFactor).toFixed(2) : "—", live.profitFactor - back.profitFactor],
              ["Drawdown gap", `${(live.maxDrawdownR - back.maxDrawdownR).toFixed(2)}R`, back.maxDrawdownR - live.maxDrawdownR],
            ].map(([label, value, tone]) => (
              <div key={label as string} className="rounded-xl border border-edge bg-surface/50 p-4">
                <div className="text-xs uppercase tracking-wider text-mute">{label}</div>
                <div className={`mt-1 font-mono text-lg font-semibold ${signColor(tone as number)}`}>{value}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-mute">Positive numbers mean live is outperforming the backtest. Small negative gaps are normal; large ones point to execution issues.</p>
        </Card>
      )}

      {/* Import modal */}
      <Modal open={importOpen} onClose={() => setImportOpen(false)} title="Import trades from CSV">
        <div className="space-y-4">
          <p className="text-sm text-mute">
            Required: <span className="font-mono text-sub">date</span>, <span className="font-mono text-sub">pair</span>, <span className="font-mono text-sub">direction</span>, and <span className="font-mono text-sub">rr</span> or <span className="font-mono text-sub">pnl</span>. Optional: <span className="font-mono text-sub">session, tags, notes</span>. Commas, semicolons or tabs all work, and common header names (Symbol, Asset, Side, Return) are recognised automatically.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Import as">
              <Select value={importType} onChange={(e) => setImportType(e.target.value as TradeType)}>
                <option value="backtest">Backtest trades</option>
                <option value="forward">Forward test trades</option>
                <option value="live">Live trades</option>
              </Select>
            </Field>
            <Field label="Into account">
              <Select value={importAccount} onChange={(e) => setImportAccount(e.target.value)}>
                <option value="">{accounts[0] ? `${accounts[0].name} (default)` : "No accounts"}</option>
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </Select>
            </Field>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
              e.target.value = "";
            }}
          />
          <Button onClick={() => fileRef.current?.click()}>Choose CSV file</Button>
          {importMsg && <p className="text-sm text-sub">{importMsg}</p>}
        </div>
      </Modal>

      <TradeModal open={logOpen} onClose={() => setLogOpen(false)} defaultType="backtest" />
    </div>
  );
}
