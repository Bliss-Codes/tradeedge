import { Account, DayReview, EMPTY_SNAPSHOT, MissedTrade, Snapshot, Strategy, Trade } from "@/lib/types";

export interface IntegrityResult<T> {
  value: T;
  errors: string[];
}

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function uniqueById<T extends { id: string }>(items: T[], label: string, errors: string[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (!nonEmpty(item.id)) {
      errors.push(`${label}: removed record with missing id.`);
      continue;
    }
    if (seen.has(item.id)) {
      errors.push(`${label}: removed duplicate id ${item.id}.`);
      continue;
    }
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

export function validateTrade(t: Trade, accounts: Account[], strategies: Strategy[]): string[] {
  const errors: string[] = [];
  if (!nonEmpty(t.id)) errors.push("Trade is missing an id.");
  if (!nonEmpty(t.accountId)) errors.push(`Trade ${t.id || "(unknown)"} is missing accountId.`);
  else if (!accounts.some((a) => a.id === t.accountId)) errors.push(`Trade ${t.id} references a missing account.`);
  if (!nonEmpty(t.pair)) errors.push(`Trade ${t.id} is missing a pair.`);
  if (!Number.isFinite(t.rr)) errors.push(`Trade ${t.id} has an invalid RR.`);
  if (!Number.isFinite(t.pnl)) errors.push(`Trade ${t.id} has an invalid P&L.`);
  if (t.strategyId && !strategies.some((s) => s.id === t.strategyId)) errors.push(`Trade ${t.id} references a missing strategy.`);
  if (!Array.isArray(t.tags)) errors.push(`Trade ${t.id} has invalid tags.`);
  if (!Array.isArray(t.violations)) errors.push(`Trade ${t.id} has invalid violations.`);
  return errors;
}

export function validateAccount(a: Account): string[] {
  const errors: string[] = [];
  if (!nonEmpty(a.id)) errors.push("Account is missing an id.");
  if (!nonEmpty(a.name)) errors.push(`Account ${a.id || "(unknown)"} is missing a name.`);
  if (!Number.isFinite(a.balance) || a.balance < 0) errors.push(`Account ${a.id} has an invalid starting balance.`);
  if (!nonEmpty(a.currency)) errors.push(`Account ${a.id} is missing a currency.`);
  return errors;
}

/**
 * Normalizes persisted/imported data before it reaches analytics.
 * It deliberately removes only structurally unsafe records; it never rewrites
 * valid trading outcomes or recalculates P&L/R values.
 */
export function normalizeSnapshot(input?: Partial<Snapshot> | null): IntegrityResult<Snapshot> {
  const errors: string[] = [];
  const raw = { ...EMPTY_SNAPSHOT, ...(input ?? {}) } as Snapshot;

  const accounts = uniqueById(Array.isArray(raw.accounts) ? raw.accounts : [], "Accounts", errors)
    .filter((a) => validateAccount(a).length === 0);

  const strategies = uniqueById(Array.isArray(raw.strategies) ? raw.strategies : [], "Strategies", errors);
  const accountIds = new Set(accounts.map((a) => a.id));
  const strategyIds = new Set(strategies.map((s) => s.id));

  const trades = uniqueById(Array.isArray(raw.trades) ? raw.trades : [], "Trades", errors).filter((t) => {
    const tradeErrors = validateTrade(t, accounts, strategies);
    if (tradeErrors.length) {
      errors.push(...tradeErrors);
      return false;
    }
    return accountIds.has(t.accountId) && (!t.strategyId || strategyIds.has(t.strategyId));
  });

  const missed = uniqueById(Array.isArray(raw.missed) ? raw.missed : [], "Missed trades", errors).filter((m) => {
    if (!nonEmpty(m.id) || !nonEmpty(m.pair) || !Number.isFinite(m.expectedRR) || !nonEmpty(m.date)) {
      errors.push(`Missed trade ${m.id || "(unknown)"} is structurally invalid.`);
      return false;
    }
    if (m.accountId && !accountIds.has(m.accountId)) {
      errors.push(`Missed trade ${m.id} references a missing account.`);
      return false;
    }
    return true;
  });

  const reviews = uniqueById(Array.isArray(raw.reviews) ? raw.reviews : [], "Reviews", errors);

  return {
    value: {
      profile: raw.profile ?? {},
      accounts,
      trades,
      strategies,
      missed,
      reviews,
      customTags: Array.isArray(raw.customTags) ? [...new Set(raw.customTags.filter(nonEmpty))] : [],
      customViolations: Array.isArray(raw.customViolations) ? [...new Set(raw.customViolations.filter(nonEmpty))] : [],
      customEmotions: Array.isArray(raw.customEmotions) ? [...new Set(raw.customEmotions.filter(nonEmpty))] : [],
    },
    errors,
  };
}
