"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/stores/useApp";
import { Account } from "@/lib/types";
import { fmtMoney, fmtPct, signColor } from "@/lib/metrics";
import {
  CHALLENGE_PRESETS,
  CHALLENGE_PHASES,
  ChallengeConfig,
  ChallengeLevel,
  ChallengeState,
  computeChallengeState,
  defaultChallengeConfig,
} from "@/lib/challenge";
import { Button, Card, EmptyState, Field, Modal, NumberInput, SectionTitle, Select, Stat } from "@/components/ui/primitives";

// ── shared bits ───────────────────────────────────────────────────────

const LEVEL_TONE: Record<ChallengeLevel, { label: string; chip: string; bar: string }> = {
  passed: { label: "PASSED", chip: "bg-pos/15 text-pos", bar: "#22C55E" },
  ok: { label: "ON TRACK", chip: "bg-pos/15 text-pos", bar: "#22C55E" },
  warn: { label: "CAUTION", chip: "bg-warn/15 text-warn", bar: "#F59E0B" },
  "daily-stop": { label: "DONE FOR TODAY", chip: "bg-warn/15 text-warn", bar: "#F59E0B" },
  breached: { label: "BREACHED", chip: "bg-neg/15 text-neg", bar: "#EF4444" },
};

function Bar({ used, limit, color }: { used: number; limit: number; color: string }) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function Limit({ label, used, limit, remaining, color, ccy }: { label: string; used: number; limit: number; remaining: number; color: string; ccy: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-mute">
        <span>{label}</span>
        <span className="font-mono">{fmtMoney(used, ccy)} / {fmtMoney(limit, ccy)}</span>
      </div>
      <Bar used={used} limit={limit} color={color} />
      <div className="mt-1 text-[11px] text-mute">{fmtMoney(remaining, ccy)} left</div>
    </div>
  );
}

// ── setup / edit modal ────────────────────────────────────────────────

function ConfigModal({ account, open, onClose }: { account: Account; open: boolean; onClose: () => void }) {
  const updateAccount = useApp((s) => s.updateAccount);
  const [c, setC] = useState<ChallengeConfig>(account.challenge ?? defaultChallengeConfig());

  const applyPreset = (name: string) => {
    const p = CHALLENGE_PRESETS.find((x) => x.name === name);
    if (p) setC({ ...c, ...p.config });
  };

  const save = () => {
    updateAccount({ ...account, challenge: { ...c, enabled: true } });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Challenge rules · ${account.name}`} persistent>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Preset">
            <Select value="" onChange={(e) => e.target.value && applyPreset(e.target.value)}>
              <option value="">Apply a preset…</option>
              {CHALLENGE_PRESETS.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
            </Select>
          </Field>
          <p className="mt-1 text-[11px] text-mute">Presets are a starting point — verify every number against your firm dashboard before trading.</p>
        </div>
        <Field label="Phase">
          <Select value={c.phase} onChange={(e) => setC({ ...c, phase: e.target.value as ChallengeConfig["phase"] })}>
            {CHALLENGE_PHASES.map((p) => <option key={p}>{p}</option>)}
          </Select>
        </Field>
        <Field label="Drawdown mode">
          <Select value={c.drawdownMode} onChange={(e) => setC({ ...c, drawdownMode: e.target.value as ChallengeConfig["drawdownMode"] })}>
            <option value="static">Static (from starting balance)</option>
            <option value="trailing">Trailing (from peak equity)</option>
          </Select>
        </Field>
        <Field label="Profit target %">
          <NumberInput value={c.profitTargetPct || undefined} onChange={(v) => setC({ ...c, profitTargetPct: v ?? 0 })} placeholder="8" />
        </Field>
        <Field label="Max drawdown %">
          <NumberInput value={c.maxDrawdownPct || undefined} onChange={(v) => setC({ ...c, maxDrawdownPct: v ?? 0 })} placeholder="10" />
        </Field>
        <Field label="Firm daily loss %">
          <NumberInput value={c.dailyLossPct || undefined} onChange={(v) => setC({ ...c, dailyLossPct: v ?? 0 })} placeholder="5" />
        </Field>
        <Field label="Your risk per trade %">
          <NumberInput value={c.baseRiskPct || undefined} onChange={(v) => setC({ ...c, baseRiskPct: v ?? 0 })} placeholder="0.75" />
        </Field>
        <Field label="Personal daily stop % (yours)">
          <NumberInput value={c.personalDailyStopPct} onChange={(v) => setC({ ...c, personalDailyStopPct: v })} placeholder={`default ${(c.dailyLossPct / 2).toFixed(1)}`} />
        </Field>
        {c.phase === "Funded" && (
          <>
            <Field label="Benchmark day target">
              <NumberInput value={c.benchmarkDayTarget} onChange={(v) => setC({ ...c, benchmarkDayTarget: v })} placeholder="200 for 50K+, 100 for 25K" />
            </Field>
            <Field label="Consistency cap % (optional)">
              <NumberInput value={c.consistencyCapPct} onChange={(v) => setC({ ...c, consistencyCapPct: v })} placeholder="e.g. 40" />
            </Field>
          </>
        )}
      </div>
      <div className="mt-5 flex justify-between gap-2 border-t border-edge pt-4">
        {account.challenge?.enabled ? (
          <Button variant="danger" onClick={() => { updateAccount({ ...account, challenge: { ...c, enabled: false } }); onClose(); }}>
            Disable Challenge Mode
          </Button>
        ) : <span />}
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={save}>Save rules</Button>
        </div>
      </div>
    </Modal>
  );
}

// ── per-account dashboard ─────────────────────────────────────────────

function ChallengeCard({ account, state, onEdit }: { account: Account; state: ChallengeState; onEdit: () => void }) {
  const tone = LEVEL_TONE[state.level];
  const ccy = account.currency;
  const c = state.config;
  const funded = c.phase === "Funded";

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-ink">{account.name}</div>
            <div className="mt-1 text-xs text-mute">
              {[account.propFirm, c.phase, c.drawdownMode === "trailing" ? "Trailing DD" : "Static DD"].filter(Boolean).join(" · ")}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wider ${tone.chip}`}>{tone.label}</span>
            <Button variant="ghost" onClick={onEdit}>Edit rules</Button>
          </div>
        </div>
        {state.messages.length > 0 && (
          <div className="mt-3 space-y-1">
            {state.messages.map((m) => <div key={m} className="text-xs text-sub">{m}</div>)}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Equity" value={fmtMoney(state.equity, ccy)} tone={state.netPnl} hint={`${state.netPnl >= 0 ? "+" : ""}${fmtMoney(state.netPnl, ccy)} net`} />
        {!funded ? (
          <Stat label="To target" value={fmtMoney(state.toTarget, ccy)} hint={`${fmtPct(state.progressPct)} of ${fmtMoney(state.targetAmount, ccy)}`} />
        ) : (
          <Stat label="Benchmark days" value={`${state.benchmark?.daysHit ?? 0} / ${state.benchmark?.fullPayoutAt ?? 30}`} hint={`min ${state.benchmark?.minForPayout ?? 5} to withdraw · 30 for full payouts`} />
        )}
        <Stat label="DD buffer left" value={fmtMoney(state.ddRemaining, ccy)} hint={`of ${fmtMoney(state.ddLimit, ccy)} max`} />
        <Stat label="Today" value={fmtMoney(state.todayPnl, ccy)} tone={state.todayPnl} hint={`${state.wins}W · ${state.losses}L · ${state.breakevens}BE overall`} />
      </div>

      <Card>
        <SectionTitle>Next trade</SectionTitle>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-mute">Suggested risk</div>
            <div className="mt-2 font-mono text-2xl font-semibold text-ink">
              {state.suggestedRiskAmount > 0 ? fmtMoney(state.suggestedRiskAmount, ccy) : "—"}
            </div>
            <div className="mt-1 text-xs text-mute">
              {state.suggestedRiskAmount > 0
                ? `${state.suggestedRiskPct.toFixed(2)}% — capped by your daily stop and DD buffer`
                : "No risk available — stand down."}
            </div>
          </div>
          <Limit label="Your daily stop" used={state.todayLossUsed} limit={state.personalDailyStop} remaining={state.personalRemaining} color={tone.bar} ccy={ccy} />
          <Limit label="Firm daily limit" used={state.todayLossUsed} limit={state.dailyLimit} remaining={state.dailyRemaining} color={tone.bar} ccy={ccy} />
        </div>
        {!funded && state.estTradesToTarget !== undefined && (
          <p className="mt-4 text-xs text-mute">
            At your current win rate and average winner, roughly <span className="font-mono text-sub">{state.estTradesToTarget}</span> more trades to target. Slow is allowed — there is no time limit.
          </p>
        )}
      </Card>

      {!funded && (
        <Card>
          <SectionTitle>Progress to target</SectionTitle>
          <Limit label="Profit target" used={Math.max(0, state.netPnl)} limit={state.targetAmount} remaining={state.toTarget} color="#22C55E" ccy={ccy} />
          <div className="mt-4">
            <Limit label={`Drawdown (${c.drawdownMode})`} used={state.ddUsed} limit={state.ddLimit} remaining={state.ddRemaining} color={tone.bar} ccy={ccy} />
          </div>
        </Card>
      )}

      {funded && state.benchmark && (
        <Card>
          <SectionTitle>Payout eligibility</SectionTitle>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-mute">Benchmark days</div>
              <div className="mt-2 font-mono text-2xl font-semibold text-ink">{state.benchmark.daysHit}</div>
              <div className="mt-1 text-xs text-mute">
                Days with ≥ {fmtMoney(state.benchmark.target, ccy)} closed profit · {state.benchmark.minForPayout} unlocks withdrawals, {state.benchmark.fullPayoutAt} unlocks 100%
              </div>
            </div>
            {state.benchmark.bestDayPct !== undefined && (
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-mute">Best day share</div>
                <div className={`mt-2 font-mono text-2xl font-semibold ${state.benchmark.consistencyOk === false ? "text-warn" : "text-ink"}`}>
                  {fmtPct(state.benchmark.bestDayPct)}
                </div>
                <div className="mt-1 text-xs text-mute">
                  {state.benchmark.consistencyCapPct !== undefined
                    ? `of total profit · cap ${state.benchmark.consistencyCapPct}%`
                    : "of total profit"}
                </div>
              </div>
            )}
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-mute">Net profit</div>
              <div className={`mt-2 font-mono text-2xl font-semibold ${signColor(state.netPnl)}`}>{fmtMoney(state.netPnl, ccy)}</div>
              <div className="mt-1 text-xs text-mute">Withdrawing 100% resets the drawdown buffer — consider leaving a cushion.</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────

export default function ChallengePage() {
  const accounts = useApp((s) => s.accounts);
  const trades = useApp((s) => s.trades);
  const selectedAccountId = useApp((s) => s.selectedAccountId);
  const [editing, setEditing] = useState<Account | null>(null);

  const eligible = useMemo(
    () => accounts.filter((a) => !a.archived && (a.type === "Challenge" || a.type === "Funded")),
    [accounts]
  );
  const visible = selectedAccountId === "all" ? eligible : eligible.filter((a) => a.id === selectedAccountId);

  const active = visible.filter((a) => a.challenge?.enabled);
  const inactive = visible.filter((a) => !a.challenge?.enabled);

  return (
    <div className="space-y-6">
      {active.map((a) => {
        const state = computeChallengeState(a, trades);
        return state ? <ChallengeCard key={a.id} account={a} state={state} onEdit={() => setEditing(a)} /> : null;
      })}

      {inactive.length > 0 && (
        <Card>
          <SectionTitle>Not tracking yet</SectionTitle>
          <div className="space-y-2">
            {inactive.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl border border-edge bg-surface/40 px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-ink">{a.name}</div>
                  <div className="text-xs text-mute">{[a.type, a.propFirm].filter(Boolean).join(" · ")}</div>
                </div>
                <Button variant="ghost" onClick={() => setEditing(a)}>Set up rules</Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {visible.length === 0 && (
        <EmptyState
          title="No challenge or funded accounts"
          body="Create an account with type Challenge or Funded on the Accounts page, then set its rules here to get live drawdown buffers and a capped risk suggestion for every trade."
        />
      )}

      {editing && <ConfigModal account={editing} open onClose={() => setEditing(null)} />}
    </div>
  );
}
