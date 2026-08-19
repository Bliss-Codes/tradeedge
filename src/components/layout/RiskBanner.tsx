"use client";

import { useApp } from "@/stores/useApp";
import { riskStatus, fmtMoney, fmtPct } from "@/lib/metrics";
import { Account } from "@/lib/types";

function Bar({ used, limit, color }: { used: number; limit: number; color: string }) {
  const pct = limit > 0 ? Math.min(100, Math.max(0, (used / limit) * 100)) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function AccountRisk({ account }: { account: Account }) {
  const trades = useApp((s) => s.trades);
  const r = riskStatus(account, trades);

  const tone = r.level === "breach"
    ? { border: "border-neg/40", bg: "bg-neg/10", text: "text-neg", bar: "#EF4444" }
    : r.level === "warn"
    ? { border: "border-warn/40", bg: "bg-warn/10", text: "text-warn", bar: "#F59E0B" }
    : { border: "border-edge", bg: "bg-card", text: "text-ink", bar: "#8B5CF6" };

  return (
    <div className={`rounded-2xl border ${tone.border} ${tone.bg} p-4`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className={`text-sm font-semibold ${tone.text}`}>Risk overview · {account.name}</div>
          <div className="mt-0.5 text-[11px] text-mute">Account-level risk is independent of Analytics filters.</div>
        </div>
        <div className="rounded-lg border border-edge bg-surface px-2.5 py-1 text-xs font-medium text-sub">
          Equity {fmtMoney(r.currentEquity, account.currency)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <div className="rounded-xl border border-edge bg-card/60 p-3"><div className="text-[10px] uppercase tracking-wide text-mute">Current DD</div><div className="mt-1 font-mono text-sm text-ink">{fmtMoney(r.drawdown, account.currency)}</div><div className="text-[10px] text-mute">{fmtPct(r.currentDrawdownPct)}</div></div>
        <div className="rounded-xl border border-edge bg-card/60 p-3"><div className="text-[10px] uppercase tracking-wide text-mute">Max DD</div><div className="mt-1 font-mono text-sm text-neg">{fmtMoney(r.maxDrawdown, account.currency)}</div><div className="text-[10px] text-mute">{fmtPct(r.maxDrawdownPct)}</div></div>
        <div className="rounded-xl border border-edge bg-card/60 p-3"><div className="text-[10px] uppercase tracking-wide text-mute">Avg risk</div><div className="mt-1 font-mono text-sm text-ink">{r.avgRiskPercent ? fmtPct(r.avgRiskPercent) : "—"}</div><div className="text-[10px] text-mute">{r.avgRiskAmount ? fmtMoney(r.avgRiskAmount, account.currency) : "No risk data"}</div></div>
        <div className="rounded-xl border border-edge bg-card/60 p-3"><div className="text-[10px] uppercase tracking-wide text-mute">Max risk</div><div className="mt-1 font-mono text-sm text-ink">{r.maxRiskPercent ? fmtPct(r.maxRiskPercent) : "—"}</div><div className="text-[10px] text-mute">{r.maxConsecutiveLosses} max consecutive losses</div></div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {r.dailyLossLimit !== undefined && (
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-mute"><span>Today's loss</span><span className="font-mono">{fmtMoney(r.dailyLoss, account.currency)} / {fmtMoney(r.dailyLossLimit, account.currency)}</span></div>
            <Bar used={r.dailyLoss} limit={r.dailyLossLimit} color={tone.bar} />
            <div className="mt-1 text-[11px] text-mute">{fmtMoney(r.dailyRemaining ?? 0, account.currency)} remaining</div>
          </div>
        )}
        {r.maxDrawdownLimit !== undefined && (
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-mute"><span>Drawdown limit</span><span className="font-mono">{fmtMoney(r.drawdown, account.currency)} / {fmtMoney(r.maxDrawdownLimit, account.currency)}</span></div>
            <Bar used={r.drawdown} limit={r.maxDrawdownLimit} color={tone.bar} />
            <div className="mt-1 text-[11px] text-mute">{fmtMoney(r.ddRemaining ?? 0, account.currency)} buffer remaining</div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-mute">
        <span>Today RISK: <b className="font-mono text-ink">{fmtMoney(r.dailyRiskAmount, account.currency)}</b></span>
        <span>Largest loss: <b className="font-mono text-neg">{fmtMoney(r.largestLoss, account.currency)}</b></span>
        <span>Max losing streak: <b className="font-mono text-ink">{r.maxConsecutiveLosses}</b></span>
        <span>Risk breaches: <b className={`font-mono ${r.riskBreaches ? "text-neg" : "text-ink"}`}>{r.riskBreaches}</b></span>
      </div>
    </div>
  );
}

/** Account-level risk analytics and guardrails. */
export function RiskBanner() {
  const accounts = useApp((s) => s.accounts);
  const selectedAccountId = useApp((s) => s.selectedAccountId);
  const shown = selectedAccountId === "all" ? accounts.filter((a) => !a.archived) : accounts.filter((a) => a.id === selectedAccountId);
  if (shown.length === 0) return null;
  return <div className="space-y-3">{shown.map((a) => <AccountRisk key={a.id} account={a} />)}</div>;
}
