"use client";

import { useApp } from "@/stores/useApp";
import { riskStatus, fmtMoney } from "@/lib/metrics";
import { Account } from "@/lib/types";

function Bar({ used, limit, color }: { used: number; limit: number; color: string }) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function AccountRisk({ account }: { account: Account }) {
  const trades = useApp((s) => s.trades);
  const r = riskStatus(account, trades);
  if (!r.hasLimits) return null;
  if (r.level === "ok" && !r.oneTradeAway) return null; // only surface when it matters

  const tone =
    r.level === "breach"
      ? { border: "border-neg/40", bg: "bg-neg/10", text: "text-neg", bar: "#EF4444" }
      : { border: "border-warn/40", bg: "bg-warn/10", text: "text-warn", bar: "#F59E0B" };

  return (
    <div className={`rounded-2xl border ${tone.border} ${tone.bg} p-4`}>
      <div className="mb-2 flex items-center justify-between">
        <div className={`text-sm font-semibold ${tone.text}`}>
          {r.level === "breach" ? "⚠ Risk limit breached" : r.oneTradeAway ? "One trade from your daily limit" : "Approaching risk limit"} · {account.name}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {r.dailyLossLimit !== undefined && (
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-mute">
              <span>Daily loss</span>
              <span className="font-mono">
                {fmtMoney(r.dailyLoss)} / {fmtMoney(r.dailyLossLimit)}
              </span>
            </div>
            <Bar used={r.dailyLoss} limit={r.dailyLossLimit} color={tone.bar} />
            <div className="mt-1 text-[11px] text-mute">{fmtMoney(r.dailyRemaining ?? 0)} left today</div>
          </div>
        )}
        {r.maxDrawdownLimit !== undefined && (
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-mute">
              <span>Drawdown</span>
              <span className="font-mono">
                {fmtMoney(r.drawdown)} / {fmtMoney(r.maxDrawdownLimit)}
              </span>
            </div>
            <Bar used={r.drawdown} limit={r.maxDrawdownLimit} color={tone.bar} />
            <div className="mt-1 text-[11px] text-mute">{fmtMoney(r.ddRemaining ?? 0)} of buffer left</div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Surfaces daily-loss / drawdown warnings for accounts with limits set. */
export function RiskBanner() {
  const accounts = useApp((s) => s.accounts);
  const selectedAccountId = useApp((s) => s.selectedAccountId);
  const shown = selectedAccountId === "all" ? accounts : accounts.filter((a) => a.id === selectedAccountId);
  if (shown.length === 0) return null;
  return (
    <div className="space-y-3">
      {shown.map((a) => (
        <AccountRisk key={a.id} account={a} />
      ))}
    </div>
  );
}
