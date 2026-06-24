"use client";

import { GroupRow, fmtPF, fmtPct, fmtMoney, signColor } from "@/lib/metrics";

export function GroupTable({ rows, keyLabel, currency = "USD" }: { rows: GroupRow[]; keyLabel: string; currency?: string }) {
  if (rows.length === 0) {
    return <div className="py-10 text-center text-sm text-mute">No trades to analyze yet.</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-edge text-left text-xs uppercase tracking-wider text-mute">
            <th className="py-2.5 pr-4 font-medium">{keyLabel}</th>
            <th className="py-2.5 pr-4 text-right font-medium">Trades</th>
            <th className="py-2.5 pr-4 text-right font-medium">Win rate</th>
            <th className="py-2.5 pr-4 text-right font-medium">Avg RR</th>
            <th className="py-2.5 pr-4 text-right font-medium">Profit factor</th>
            <th className="py-2.5 text-right font-medium">Net P&L</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-edge/50 transition-colors last:border-0 hover:bg-surface/50">
              <td className="py-3 pr-4 font-medium text-ink">{r.key}</td>
              <td className="py-3 pr-4 text-right font-mono text-sub">{r.stats.total}</td>
              <td className="py-3 pr-4 text-right font-mono text-sub">{fmtPct(r.stats.winRate)}</td>
              <td className={`py-3 pr-4 text-right font-mono ${signColor(r.stats.avgRR)}`}>{r.stats.avgRR.toFixed(2)}</td>
              <td className="py-3 pr-4 text-right font-mono text-sub">{fmtPF(r.stats.profitFactor)}</td>
              <td className={`py-3 text-right font-mono font-medium ${signColor(r.stats.netPnl)}`}>{fmtMoney(r.stats.netPnl, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
