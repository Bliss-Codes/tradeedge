"use client";

import { useEffect, useState } from "react";
import { Trade } from "@/lib/types";
import { useApp } from "@/stores/useApp";
import { fmtDate, fmtMoney, fmtR, signColor, plannedRR } from "@/lib/metrics";
import { Button, Modal, OutcomePill, TagChip } from "@/components/ui/primitives";
import { ImageThumb, Lightbox } from "@/components/trades/Images";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-edge/60 py-2 text-sm last:border-0">
      <span className="text-mute">{label}</span>
      <span className="text-right text-sub">{value}</span>
    </div>
  );
}

export function TradeDetail({
  trade,
  onClose,
  onEdit,
  replay = false,
}: {
  trade: Trade | null;
  onClose: () => void;
  onEdit?: (t: Trade) => void;
  replay?: boolean;
}) {
  const strategies = useApp((s) => s.strategies);
  const accounts = useApp((s) => s.accounts);
  const [revealed, setRevealed] = useState(!replay);
  const [lightbox, setLightbox] = useState<{ ids: string[]; index: number } | null>(null);

  useEffect(() => {
    setRevealed(!replay);
  }, [trade?.id, replay]);

  if (!trade) return null;
  const strategy = strategies.find((s) => s.id === trade.strategyId);
  const account = accounts.find((a) => a.id === trade.accountId);

  return (
    <Modal open onClose={onClose} title={`${trade.pair} · ${trade.direction === "long" ? "Long" : "Short"}`} wide>
      <div className="space-y-6">
        {/* The setup — always visible */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-mute">Before</div>
            {trade.beforeImageIds.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {trade.beforeImageIds.map((id, i) => (
                  <ImageThumb key={id} id={id} onOpen={() => setLightbox({ ids: trade.beforeImageIds, index: i })} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-edge p-6 text-center text-xs text-mute">No before screenshot</div>
            )}
            {trade.thesis && (
              <div className="mt-4">
                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-mute">Thesis</div>
                <p className="text-sm leading-relaxed text-sub">{trade.thesis}</p>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {trade.tags.map((t) => (
                <TagChip key={t} tag={t} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-edge bg-surface/50 p-4">
            <Row label="Date" value={fmtDate(trade.date)} />
            <Row label="Account" value={account?.name ?? "—"} />
            <Row label="Session" value={trade.session} />
            <Row label="Strategy" value={strategy?.name ?? "—"} />
            {trade.grade && <Row label="Grade" value={<span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-xs text-accent">{trade.grade}</span>} />}
            {trade.qualityScore && <Row label="Quality" value={<span className="font-mono">{trade.qualityScore}/5</span>} />}
            {(strategy?.fields ?? []).map((f) => {
              const v = trade.fieldValues?.[f.id];
              if (v === undefined || v === "") return null;
              return <Row key={f.id} label={f.name} value={typeof v === "boolean" ? (v ? "Yes" : "No") : String(v)} />;
            })}
            {!trade.fieldValues && trade.htfBias && <Row label="HTF bias" value={<span className={trade.htfBias === "Bullish" ? "text-pos" : "text-neg"}>{trade.htfBias}</span>} />}
            {!trade.fieldValues && trade.entryModel && <Row label="Entry model" value={trade.entryModel} />}
            {!trade.fieldValues && trade.poiType && <Row label="POI" value={trade.poiType} />}
            {!trade.fieldValues && trade.liquidityTaken && <Row label="Liquidity taken" value={trade.liquidityTaken} />}
            {trade.exitReason && <Row label="Exit reason" value={trade.exitReason} />}
            {trade.entry !== undefined && <Row label="Entry" value={<span className="font-mono">{trade.entry}</span>} />}
            {trade.stopLoss !== undefined && <Row label="Stop loss" value={<span className="font-mono">{trade.stopLoss}</span>} />}
            {trade.takeProfit !== undefined && <Row label="Take profit" value={<span className="font-mono">{trade.takeProfit}</span>} />}
            {trade.riskPercent !== undefined && <Row label="Risk" value={<span className="font-mono">{trade.riskPercent}%</span>} />}
            <Row label="Emotion before" value={trade.emotionBefore ?? "—"} />
            {trade.violations.length > 0 && <Row label="Violations" value={trade.violations.join(", ")} />}
          </div>
        </div>

        {/* The result — hidden in replay mode until revealed */}
        {!revealed ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-edge py-10">
            <p className="text-sm text-mute">Re-read the setup. What would you do here?</p>
            <Button onClick={() => setRevealed(true)}>Reveal result</Button>
          </div>
        ) : (
          <div className="space-y-4 rounded-xl border border-edge bg-surface/40 p-5">
            <div className="flex flex-wrap items-center gap-4">
              <OutcomePill rr={trade.rr} pnl={trade.pnl} />
              <span className={`font-mono text-xl font-semibold ${signColor(trade.rr)}`}>{fmtR(trade.rr)}</span>
              {trade.pnl !== 0 && <span className={`font-mono text-sm ${signColor(trade.pnl)}`}>{fmtMoney(trade.pnl, account?.currency)}</span>}
              {trade.exit !== undefined && <span className="font-mono text-sm text-mute">Exit {trade.exit}</span>}
              {trade.emotionAfter && <span className="text-sm text-mute">Felt: {trade.emotionAfter}</span>}
            </div>

            {(() => {
              const planned = plannedRR(trade);
              if (planned === undefined) return null;
              const capture = trade.rr / planned;
              let note: { text: string; cls: string } | null = null;
              if (trade.rr < -1.05) note = { text: `Lost ${trade.rr.toFixed(2)}R against a 1R stop — the stop was moved or the position was oversized.`, cls: "text-neg" };
              else if (trade.rr > 0 && capture < 0.7 && planned >= 1.5) note = { text: `Planned ${planned.toFixed(2)}R, took ${trade.rr.toFixed(2)}R — about ${(planned - trade.rr).toFixed(1)}R left on the table.`, cls: "text-warn" };
              else if (capture >= 0.95) note = { text: `Captured the full ${planned.toFixed(2)}R target. Textbook execution.`, cls: "text-pos" };
              return (
                <div className="flex items-center justify-between rounded-lg border border-edge bg-card px-3 py-2 text-sm">
                  <span className="text-mute">Planned <span className="font-mono text-sub">{planned.toFixed(2)}R</span> · Realized <span className={`font-mono ${signColor(trade.rr)}`}>{fmtR(trade.rr)}</span></span>
                  {note && <span className={note.cls}>{note.text}</span>}
                </div>
              );
            })()}
            {trade.afterImageIds.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {trade.afterImageIds.map((id, i) => (
                  <ImageThumb key={id} id={id} onOpen={() => setLightbox({ ids: trade.afterImageIds, index: i })} />
                ))}
              </div>
            )}
            {trade.notes && (
              <div>
                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-mute">Notes</div>
                <p className="text-sm leading-relaxed text-sub">{trade.notes}</p>
              </div>
            )}
            {trade.lessons && (
              <div>
                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-mute">Lessons learned</div>
                <p className="text-sm leading-relaxed text-sub">{trade.lessons}</p>
              </div>
            )}
            {([
              ["Followed HTF Bias", trade.followedHtfBias],
              ["Waited for Liquidity", trade.waitedForLiquidity],
              ["Waited for Confirmation", trade.waitedForConfirmation],
              ["Respected Risk", trade.respectedRisk],
              ["Followed Plan", trade.followedPlan],
            ] as [string, boolean | undefined][]).some(([, v]) => v !== undefined) && (
              <div>
                <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-mute">Review checklist</div>
                <div className="flex flex-wrap gap-2">
                  {([
                    ["Followed HTF Bias", trade.followedHtfBias],
                    ["Waited for Liquidity", trade.waitedForLiquidity],
                    ["Waited for Confirmation", trade.waitedForConfirmation],
                    ["Respected Risk", trade.respectedRisk],
                    ["Followed Plan", trade.followedPlan],
                  ] as [string, boolean | undefined][]).map(([label, v]) => (
                    <span
                      key={label}
                      className={`rounded-full border px-2.5 py-0.5 text-xs ${
                        v === true ? "border-pos/40 bg-pos/10 text-pos" : v === false ? "border-neg/40 bg-neg/10 text-neg" : "border-edge text-mute"
                      }`}
                    >
                      {v === true ? "✓" : v === false ? "✗" : "—"} {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {onEdit && (
          <div className="flex justify-end gap-2 border-t border-edge pt-4">
            <Button variant="ghost" onClick={() => onEdit(trade)}>Edit trade</Button>
          </div>
        )}
      </div>
      {lightbox && <Lightbox ids={lightbox.ids} index={lightbox.index} onClose={() => setLightbox(null)} />}
    </Modal>
  );
}
