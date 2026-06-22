import { Strategy, Trade } from "@/lib/types";

/**
 * The strategy is the template. A trade's structured values live in
 * `trade.fieldValues`, keyed by the field id defined on its strategy.
 * Legacy SMC fields (htfBias, entryModel, …) are bridged here by name so
 * old trades still appear in the same breakdowns as new strategy-defined ones.
 */

const LEGACY_FIELD_NAMES: Record<string, (t: Trade) => unknown> = {
  "HTF Bias": (t) => t.htfBias,
  "Entry Model": (t) => t.entryModel,
  "POI Type": (t) => t.poiType,
  "Liquidity Taken": (t) => t.liquidityTaken,
};

export function strategyMap(strategies: Strategy[]): Map<string, Strategy> {
  return new Map(strategies.map((s) => [s.id, s]));
}

/** The value of a named field for a trade, from fieldValues or legacy bridge. */
export function fieldValueByName(trade: Trade, name: string, byId: Map<string, Strategy>): string | undefined {
  const strat = trade.strategyId ? byId.get(trade.strategyId) : undefined;
  const def = strat?.fields?.find((f) => f.name === name);
  if (def) {
    const v = trade.fieldValues?.[def.id];
    if (v !== undefined && v !== "" && v !== null) return String(v);
  }
  const legacy = LEGACY_FIELD_NAMES[name]?.(trade);
  return legacy !== undefined && legacy !== null && legacy !== "" ? String(legacy) : undefined;
}

/** All field names available to break down by: strategy-defined + legacy in use. */
export function availableBreakdownFields(trades: Trade[], strategies: Strategy[]): string[] {
  const names = new Set<string>();
  for (const s of strategies) for (const f of s.fields ?? []) names.add(f.name);
  for (const [name, get] of Object.entries(LEGACY_FIELD_NAMES)) {
    if (trades.some((t) => get(t))) names.add(name);
  }
  return Array.from(names).sort();
}
