"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/stores/useApp";
import { COMMON_PAIRS } from "@/lib/types";
import { computeStats, fmtMoney } from "@/lib/metrics";
import { computeChallengeState } from "@/lib/challenge";
import { computePosition } from "@/lib/position";
import { Card, Field, Input, NumberInput, SectionTitle, Select } from "@/components/ui/primitives";

type RiskMode = "percent" | "amount";

export default function CalculatorPage() {
  const accounts = useApp((s) => s.accounts);
  const trades = useApp((s) => s.trades);
  const selectedAccountId = useApp((s) => s.selectedAccountId);

  const active = accounts.filter((a) => !a.archived);
  const [accountId, setAccountId] = useState<string>(
    selectedAccountId !== "all" && active.some((a) => a.id === selectedAccountId) ? selectedAccountId : active[0]?.id ?? "manual"
  );
  const account = active.find((a) => a.id === accountId);

  const [manualBalance, setManualBalance] = useState<number | undefined>(50000);
  const equity = useMemo(() => {
    if (!account) return manualBalance ?? 0;
    const st = computeStats(trades.filter((t) => t.accountId === account.id && t.type === "live"));
    return account.balance + st.netPnl;
  }, [account, trades, manualBalance]);
  const ccy = account?.currency ?? "USD";

  const challenge = account ? computeChallengeState(account, trades) : null;

  const [pair, setPair] = useState("EURUSD");
  const [riskMode, setRiskMode] = useState<RiskMode>("percent");
  const [riskPct, setRiskPct] = useState<number | undefined>(challenge ? undefined : 0.75);
  const [riskAmt, setRiskAmt] = useState<number | undefined>();
  const [entry, setEntry] = useState<number | undefined>();
  const [stopLoss, setStopLoss] = useState<number | undefined>();
  const [stopPips, setStopPips] = useState<number | undefined>();
  const [takeProfit, setTakeProfit] = useState<number | undefined>();
  const [pipOverride, setPipOverride] = useState<number | undefined>();

  // Risk resolution: explicit input wins; otherwise Challenge Mode's capped
  // suggestion; otherwise 0.75% of equity.
  const effectivePct = riskPct ?? challenge?.suggestedRiskPct ?? 0.75;
  const riskAmount =
    riskMode === "amount" && riskAmt !== undefined ? riskAmt : (effectivePct / 100) * (challenge?.startingBalance ?? equity);

  const result = computePosition({ pair, riskAmount, entry, stopLoss, stopPips, takeProfit, pipValueOverride: pipOverride });

  const overCap = challenge && challenge.suggestedRiskAmount > 0 && riskAmount > challenge.suggestedRiskAmount + 0.01;
  const standDown = challenge !== null && challenge.suggestedRiskAmount <= 0;

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle>Setup</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Account">
            <Select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              {active.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              <option value="manual">Manual balance</option>
            </Select>
          </Field>
          {!account ? (
            <Field label="Balance">
              <NumberInput value={manualBalance} onChange={setManualBalance} placeholder="50000" />
            </Field>
          ) : (
            <Field label="Equity">
              <div className="flex h-10 items-center rounded-xl border border-edge bg-surface/40 px-3 font-mono text-sm text-sub">{fmtMoney(equity, ccy)}</div>
            </Field>
          )}
          <Field label="Pair">
            <Input value={pair} onChange={(e) => setPair(e.target.value.toUpperCase())} list="calc-pairs" placeholder="EURUSD" />
            <datalist id="calc-pairs">{COMMON_PAIRS.map((p) => <option key={p} value={p} />)}</datalist>
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle>Risk</SectionTitle>
        {challenge && (
          <div className={`mb-4 rounded-xl border px-4 py-3 text-xs ${standDown ? "border-neg/40 bg-neg/10 text-neg" : "border-edge bg-surface/40 text-sub"}`}>
            {standDown
              ? "Challenge Mode: no risk available today — stand down."
              : <>Challenge Mode suggests <span className="font-mono">{fmtMoney(challenge.suggestedRiskAmount, ccy)} ({challenge.suggestedRiskPct.toFixed(2)}%)</span> max for the next trade. Leave risk blank to use it.</>}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Risk by">
            <Select value={riskMode} onChange={(e) => setRiskMode(e.target.value as RiskMode)}>
              <option value="percent">Percent of balance</option>
              <option value="amount">Fixed amount</option>
            </Select>
          </Field>
          {riskMode === "percent" ? (
            <Field label="Risk %">
              <NumberInput value={riskPct} onChange={setRiskPct} placeholder={challenge ? `suggested ${challenge.suggestedRiskPct.toFixed(2)}` : "0.75"} />
            </Field>
          ) : (
            <Field label={`Risk ${ccy}`}>
              <NumberInput value={riskAmt} onChange={setRiskAmt} placeholder="375" />
            </Field>
          )}
          <Field label="Risk in money">
            <div className={`flex h-10 items-center rounded-xl border px-3 font-mono text-sm ${overCap ? "border-warn/50 text-warn" : "border-edge bg-surface/40 text-sub"}`}>
              {fmtMoney(riskAmount, ccy)}
            </div>
          </Field>
        </div>
        {overCap && (
          <p className="mt-2 text-xs text-warn">Above the Challenge Mode cap of {fmtMoney(challenge!.suggestedRiskAmount, ccy)} — one loss cuts into buffers you planned to keep.</p>
        )}
      </Card>

      <Card>
        <SectionTitle>Trade levels</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Field label="Entry"><NumberInput value={entry} onChange={setEntry} placeholder="1.08500" /></Field>
          <Field label="Stop loss"><NumberInput value={stopLoss} onChange={setStopLoss} placeholder="1.08300" /></Field>
          <Field label="or stop (pips)"><NumberInput value={stopPips} onChange={setStopPips} placeholder="20" /></Field>
          <Field label="Take profit (optional)"><NumberInput value={takeProfit} onChange={setTakeProfit} placeholder="1.09100" /></Field>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Field label="Pip value / lot override">
            <NumberInput value={pipOverride} onChange={setPipOverride} placeholder="auto" />
          </Field>
        </div>
      </Card>

      {result ? (
        <Card>
          <SectionTitle>Position</SectionTitle>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-mute">Lot size</div>
              <div className="mt-2 font-mono text-3xl font-semibold text-accent">{result.lots.toFixed(2)}</div>
              <div className="mt-1 text-xs text-mute">{result.units.toLocaleString()} units</div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-mute">Stop distance</div>
              <div className="mt-2 font-mono text-2xl font-semibold text-ink">{result.stopPips.toFixed(1)}</div>
              <div className="mt-1 text-xs text-mute">pips</div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-mute">Actual risk</div>
              <div className="mt-2 font-mono text-2xl font-semibold text-ink">{fmtMoney(result.riskAtLots, ccy)}</div>
              <div className="mt-1 text-xs text-mute">{fmtMoney(result.perPipAtSize, ccy)} per pip at this size</div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-mute">Pip value / lot</div>
              <div className="mt-2 font-mono text-2xl font-semibold text-ink">{fmtMoney(result.pipValuePerLot, ccy)}</div>
              <div className="mt-1 text-xs text-mute">
                {result.pipValueDerived ? "derived from entry price" : result.pipValueAssumed ? "assumed — override if needed" : "standard"}
              </div>
            </div>
          </div>
          {result.rr !== undefined && (
            <p className="mt-4 text-xs text-sub">
              Planned R:R <span className="font-mono">{result.rr.toFixed(2)}R</span> — a win pays about <span className="font-mono">{fmtMoney(result.rr * result.riskAtLots, ccy)}</span>.
            </p>
          )}
          {result.warnings.map((w) => <p key={w} className="mt-2 text-xs text-warn">{w}</p>)}
        </Card>
      ) : (
        <Card>
          <p className="text-sm text-mute">Enter a risk and a stop (entry + SL, or pips) to size the position.</p>
        </Card>
      )}
    </div>
  );
}
