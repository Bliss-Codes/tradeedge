// ── Position sizing engine ────────────────────────────────────────────
// Converts (risk amount, stop distance) into a lot size. Pip values assume a
// USD-denominated account; USD-base pairs derive pip value from the entry
// price, and everything is overridable because broker contract specs differ.

export interface PairSpec {
  /** Price increment that equals one pip (0.0001 FX, 0.01 JPY pairs, 0.1 gold). */
  pipSize: number;
  /**
   * USD value of one pip per standard lot. Undefined → derive from price
   * (USD-base pairs) or fall back to $10 with a warning (crosses).
   */
  pipValuePerLot?: number;
  units: number; // contract size per 1.0 lot
}

const FX_USD_QUOTE: PairSpec = { pipSize: 0.0001, pipValuePerLot: 10, units: 100_000 };
const FX_USD_BASE: PairSpec = { pipSize: 0.0001, units: 100_000 }; // value from price
const FX_JPY: PairSpec = { pipSize: 0.01, units: 100_000 }; // value from price
const FX_CROSS: PairSpec = { pipSize: 0.0001, units: 100_000 }; // needs quote→USD rate

export const PAIR_SPECS: Record<string, PairSpec> = {
  EURUSD: FX_USD_QUOTE, GBPUSD: FX_USD_QUOTE, AUDUSD: FX_USD_QUOTE, NZDUSD: FX_USD_QUOTE,
  USDJPY: FX_JPY, USDCAD: FX_USD_BASE, USDCHF: FX_USD_BASE,
  GBPJPY: { ...FX_JPY }, EURJPY: { ...FX_JPY }, AUDJPY: { ...FX_JPY },
  EURGBP: FX_CROSS,
  XAUUSD: { pipSize: 0.1, pipValuePerLot: 10, units: 100 }, // 100 oz/lot, 0.1 move = $10
  XAGUSD: { pipSize: 0.01, pipValuePerLot: 50, units: 5_000 },
  BTCUSD: { pipSize: 1, pipValuePerLot: 1, units: 1 },
  ETHUSD: { pipSize: 1, pipValuePerLot: 1, units: 1 },
  US30: { pipSize: 1, pipValuePerLot: 1, units: 1 },
  NAS100: { pipSize: 1, pipValuePerLot: 1, units: 1 },
  SPX500: { pipSize: 1, pipValuePerLot: 1, units: 1 },
  GER40: { pipSize: 1, pipValuePerLot: 1, units: 1 },
  UK100: { pipSize: 1, pipValuePerLot: 1, units: 1 },
};

export function specFor(pair: string): PairSpec {
  const p = pair.toUpperCase().trim();
  if (PAIR_SPECS[p]) return PAIR_SPECS[p];
  if (p.endsWith("JPY")) return FX_JPY;
  if (p.endsWith("USD")) return FX_USD_QUOTE;
  if (p.startsWith("USD")) return FX_USD_BASE;
  return FX_CROSS;
}

export interface SizingInput {
  pair: string;
  riskAmount: number; // account currency (USD assumed)
  entry?: number;
  stopLoss?: number;
  stopPips?: number; // used when entry/SL not both given
  takeProfit?: number;
  pipValueOverride?: number; // per standard lot
}

export interface SizingResult {
  stopPips: number;
  pipValuePerLot: number; // per standard lot
  pipValueDerived: boolean; // true if computed from entry price
  pipValueAssumed: boolean; // true if we fell back to $10 (cross pair, no rate)
  lots: number; // rounded down to 0.01
  units: number;
  riskAtLots: number; // actual risk at the rounded lot size
  rr?: number; // if TP given
  perPipAtSize: number;
  warnings: string[];
}

const floor2 = (v: number) => Math.floor(v * 100) / 100;

export function computePosition(input: SizingInput): SizingResult | null {
  const spec = specFor(input.pair);
  const warnings: string[] = [];

  let stopPips = input.stopPips ?? 0;
  if (input.entry !== undefined && input.stopLoss !== undefined && input.entry !== input.stopLoss) {
    stopPips = Math.abs(input.entry - input.stopLoss) / spec.pipSize;
  }
  if (!(stopPips > 0) || !(input.riskAmount > 0)) return null;

  let pipValuePerLot = spec.pipValuePerLot;
  let derived = false;
  let assumed = false;
  if (input.pipValueOverride && input.pipValueOverride > 0) {
    pipValuePerLot = input.pipValueOverride;
  } else if (pipValuePerLot === undefined) {
    const p = input.pair.toUpperCase();
    if (p.startsWith("USD") && input.entry) {
      // quote-currency pip → USD via the pair's own price
      pipValuePerLot = (spec.pipSize / input.entry) * spec.units;
      derived = true;
    } else {
      pipValuePerLot = 10;
      assumed = true;
      warnings.push("Cross pair: pip value assumed $10/lot — set the override for accuracy.");
    }
  }

  const rawLots = input.riskAmount / (stopPips * pipValuePerLot);
  const lots = Math.max(0, floor2(rawLots));
  if (lots === 0) warnings.push("Risk too small for a 0.01 lot at this stop — widen risk or tighten the stop.");

  const riskAtLots = lots * stopPips * pipValuePerLot;
  const units = Math.round(lots * spec.units);

  let rr: number | undefined;
  if (input.takeProfit !== undefined && input.entry !== undefined && input.stopLoss !== undefined) {
    const stopDist = Math.abs(input.entry - input.stopLoss);
    if (stopDist > 0) rr = Math.abs(input.takeProfit - input.entry) / stopDist;
  }

  return {
    stopPips,
    pipValuePerLot,
    pipValueDerived: derived,
    pipValueAssumed: assumed,
    lots,
    units,
    riskAtLots,
    rr,
    perPipAtSize: lots * pipValuePerLot,
    warnings,
  };
}
