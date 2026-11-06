"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Trade, outcomeOf } from "@/lib/types";
import { computeStats, equityCurve, fmtDate, fmtPF, fmtPct, fmtR, signColor } from "@/lib/metrics";
import { computeEdgeScore } from "@/lib/score";
import { Card, SectionTitle } from "@/components/ui/primitives";
import { EdgeScoreCard } from "@/components/ui/EdgeScoreCard";
import { EquityCurve } from "@/components/charts/EquityCurve";

interface Payload {
  label: string;
  hideMoney: boolean;
  trades: Trade[];
  accounts: { id: string; name: string; type: string }[];
  strategies: { id: string; name: string }[];
}

export default function SharedJournalPage() {
  const params = useParams<{ token: string }>();
  const [data, setData] = useState<Payload | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    let live = true;
    fetch(`/api/share/${params.token}`, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error("nf");
        return (await r.json()) as Payload;
      })
      .then((d) => { if (live) { setData(d); setState("ok"); } })
      .catch(() => { if (live) setState("missing"); });
    return () => { live = false; };
  }, [params.token]);

  const trades = data?.trades ?? [];
  const stats = useMemo(() => computeStats(trades), [trades]);
  const score = useMemo(() => computeEdgeScore(trades), [trades]);
  const curve = useMemo(() => equityCurve(trades, "rr"), [trades]);
  const recent = useMemo(() => [...trades].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 100), [trades]);
  const stratName = (id?: string) => data?.strategies.find((s) => s.id === id)?.name ?? "—";

  if (state === "loading") return <div className="p-8 text-sm text-mute">Loading shared journal…</div>;
  if (state === "missing" || !data) {
    return (
      <div className="mx-auto max-w-md p-8">
        <Card>
          <SectionTitle>Link unavailable</SectionTitle>
          <p className="text-sm text-mute">This share link is invalid, expired, or has been revoked.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-5 lg:p-8">
      <meta name="robots" content="noindex" />
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-mute">TradeEdge · read-only</div>
        <h1 className="text-xl font-semibold tracking-tight">{data.label}</h1>
        <p className="text-xs text-mute">{trades.length} trades{data.hideMoney ? " · dollar amounts hidden" : ""}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          ["Net R", fmtR(stats.netRR)],
          ["Win rate", fmtPct(stats.winRate)],
          ["Profit factor", fmtPF(stats.profitFactor)],
          ["Expectancy", fmtR(stats.avgRR)],
          ["Max drawdown", `${stats.maxDrawdownR.toFixed(1)}R`],
        ].map(([k, v]) => (
          <Card key={k}>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-mute">{k}</div>
            <div className="mt-1 font-mono text-xl font-semibold">{v}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <SectionTitle>Equity curve (R)</SectionTitle>
            <EquityCurve points={curve} />
          </Card>
        </div>
        <EdgeScoreCard score={score} />
      </div>

      <Card>
        <SectionTitle>Recent trades</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-mute">
              <tr>
                <th className="py-2 pr-3">Date</th><th className="pr-3">Pair</th><th className="pr-3">Dir</th>
                <th className="pr-3">Strategy</th><th className="pr-3">Result</th><th className="pr-3">R</th><th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((t) => (
                <tr key={t.id} className="border-t border-edge align-top">
                  <td className="py-2 pr-3 font-mono text-xs">{fmtDate(t.date)}</td>
                  <td className="pr-3">{t.pair}</td>
                  <td className="pr-3 capitalize">{t.direction}</td>
                  <td className="pr-3">{stratName(t.strategyId)}</td>
                  <td className="pr-3 capitalize">{outcomeOf(t)}</td>
                  <td className={`pr-3 font-mono ${t.rrUnknown ? "text-mute" : signColor(t.rr)}`}>{t.rrUnknown ? "n/a" : fmtR(t.rr)}</td>
                  <td className="max-w-[320px] text-xs text-mute">{t.notes || t.thesis || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
