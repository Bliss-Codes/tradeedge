// ── TradeEdge domain types ────────────────────────────────────────────

export type Direction = "long" | "short";
export type Outcome = "win" | "loss" | "be";
export type TradeType = "live" | "backtest" | "forward";

export const SESSIONS = ["London", "New York", "Asia", "Overlap"] as const;
export type Session = (typeof SESSIONS)[number];

/**
 * Map a timestamp to a forex session by UTC hour (the global convention):
 *  - Asia        22:00–08:00 UTC
 *  - London      08:00–13:00 UTC
 *  - Overlap     13:00–16:00 UTC  (London/New York both open — the busiest window)
 *  - New York    16:00–22:00 UTC
 */
export function sessionFromDate(d: Date): Session {
  const h = d.getUTCHours();
  if (h >= 8 && h < 13) return "London";
  if (h >= 13 && h < 16) return "Overlap";
  if (h >= 16 && h < 22) return "New York";
  return "Asia";
}

// `market` is legacy — the pair identifies the market now. Kept optional so
// older records remain valid; no longer collected on new trades.
export const MARKETS = ["Forex", "Indices", "Crypto", "Commodities", "Stocks"] as const;
export type Market = (typeof MARKETS)[number];

/** Common instruments for the quick-pick pair picker (you can still type any). */
export const COMMON_PAIRS = [
  "EURUSD", "GBPUSD", "XAUUSD", "GBPJPY", "USDJPY", "AUDUSD",
  "USDCAD", "NZDUSD", "EURJPY", "EURGBP", "USDCHF", "AUDJPY",
  "US30", "NAS100", "SPX500", "GER40", "UK100", "BTCUSD", "ETHUSD", "XAGUSD",
];

export const EMOTIONS = ["Neutral", "Focused", "Fear", "FOMO", "Revenge", "Frustrated"] as const;
export type Emotion = (typeof EMOTIONS)[number];

// SMC / liquidity trade taxonomy
export const HTF_BIAS = ["Bullish", "Bearish"] as const;
export type HtfBias = (typeof HTF_BIAS)[number];

export const ENTRY_MODELS = [
  "Liquidity Sweep + FVG",
  "Liquidity Sweep + OB",
  "Liquidity Sweep + Breaker",
  "MSS + FVG",
  "MSS + OB",
  "MSS + Breaker",
] as const;
export type EntryModel = (typeof ENTRY_MODELS)[number];

export const POI_TYPES = ["FVG", "Order Block", "Supply Zone", "Demand Zone", "Breaker Block"] as const;
export type PoiType = (typeof POI_TYPES)[number];

export const LIQUIDITY_TYPES = [
  "PDH",
  "PDL",
  "Asian High",
  "Asian Low",
  "Equal Highs",
  "Equal Lows",
  "Session High",
  "Session Low",
  "Weekly High",
  "Weekly Low",
  "Trendline Liquidity",
] as const;
export type LiquidityType = (typeof LIQUIDITY_TYPES)[number];

export const EXIT_REASONS = ["Take Profit", "Stop Loss", "Breakeven", "Manual Close", "Partial Close"] as const;
export type ExitReason = (typeof EXIT_REASONS)[number];

export const QUALITY_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Below Average",
  3: "Average",
  4: "Good",
  5: "Textbook Setup",
};

export const MISSED_REASONS = [
  "Sleeping",
  "Working",
  "Hesitation",
  "Did Not See Setup",
  "News Event",
  "No Alert",
  "Other",
] as const;
export type MissedReason = (typeof MISSED_REASONS)[number];

export const VIOLATIONS = [
  "Entered Early",
  "Entered Late",
  "No Confirmation",
  "FOMO",
  "Revenge Trade",
  "Overtrading",
  "Ignored Setup Rules",
] as const;
export type Violation = (typeof VIOLATIONS)[number];

export const ACCOUNT_TYPES = ["Personal", "Demo", "Challenge", "Funded", "Backtest"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

// Grade C retired from new entries; older C trades still display in analytics.
export const GRADES = ["A+", "A", "B"] as const;
export type Grade = (typeof GRADES)[number] | "C";

export const DEFAULT_TAGS = [
  "Structure",
  "Liquidity",
  "MSS",
  "POI",
  "FVG",
  "OB",
  "Breaker",
  "Sweep",
  "Trendline",
  "ChoCH",
];

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  broker?: string;
  balance: number;
  propFirm?: string;
  currency: string;
  archived?: boolean; // hidden from active views; trades preserved for review
  dailyLossLimit?: number; // max loss allowed in one day (account currency)
  maxDrawdownLimit?: number; // max peak-to-trough drawdown (account currency)
  createdAt: string;
}

export type FieldType = "select" | "text" | "number" | "boolean";

/** A user-defined field attached to a strategy. The strategy is the template. */
export interface CustomFieldDef {
  id: string;
  name: string;
  type: FieldType;
  options?: string[]; // for select
  required?: boolean; // must be filled to save a trade using this strategy
}

export interface Strategy {
  id: string;
  name: string;
  description?: string;
  rules: string[];
  checklist: string[];
  tags: string[];
  fields?: CustomFieldDef[]; // strategy-specific structured fields
  createdAt: string;
}

export interface Trade {
  id: string;
  accountId: string;
  type: TradeType;
  pair: string;
  direction: Direction;
  market?: Market; // legacy/optional
  date: string; // ISO datetime — the exact entry timestamp
  entry?: number;
  exit?: number;
  stopLoss?: number;
  takeProfit?: number;
  riskPercent?: number;
  riskAmount?: number;
  lotSize?: number;
  rr: number; // realized R multiple (negative for losses)
  pnl: number; // currency P&L
  session: Session;
  strategyId?: string;
  grade?: Grade; // setup quality at entry

  // SMC / liquidity taxonomy — legacy optional. New trades store strategy-defined
  // values in `fieldValues`; these remain for backward compatibility and analytics bridging.
  htfBias?: HtfBias;
  entryModel?: EntryModel;
  poiType?: PoiType;
  liquidityTaken?: string;
  exitReason?: ExitReason;
  qualityScore?: number; // 1–5

  /** Values for the selected strategy's custom fields, keyed by field id. */
  fieldValues?: Record<string, string | number | boolean>;

  // post-trade review checklist (followedPlan is the 5th item, kept below)
  followedHtfBias?: boolean;
  waitedForLiquidity?: boolean;
  waitedForConfirmation?: boolean;
  respectedRisk?: boolean;

  checklistDone?: string[]; // strategy checklist items ticked at entry
  followedPlan?: boolean; // did execution match the plan
  tags: string[];
  notes?: string;
  thesis?: string;
  lessons?: string;
  emotionBefore?: Emotion;
  emotionAfter?: Emotion;
  violations: Violation[];
  beforeImageIds: string[];
  afterImageIds: string[];
  createdAt: string;
}

export interface MissedTrade {
  id: string;
  accountId?: string;
  pair: string;
  date: string;
  expectedRR: number;
  session: Session;
  reason: string;
  notes?: string;
  tags: string[];
  imageIds: string[];
  createdAt: string;
}

/** A structured end-of-day reflection, keyed to one calendar day. */
export interface DayReview {
  id: string;
  date: string; // YYYY-MM-DD for days; "YYYY-Www" weekly; "YYYY-Mmm" monthly
  scope?: "day" | "week" | "month";
  marketNotes?: string;
  wentWell?: string;
  toImprove?: string;
  focusNext?: string; // focus / goals for the coming week or month
  disciplineRating?: number; // 1–5
  followedPlan?: boolean;
  mood?: Emotion;
  createdAt: string;
  updatedAt: string;
}

/** Everything the app persists, in one snapshot. */
export interface Snapshot {
  accounts: Account[];
  trades: Trade[];
  strategies: Strategy[];
  missed: MissedTrade[];
  reviews: DayReview[];
  customTags: string[];
}

export const EMPTY_SNAPSHOT: Snapshot = {
  accounts: [],
  trades: [],
  strategies: [],
  missed: [],
  reviews: [],
  customTags: [],
};

export function outcomeOf(t: Pick<Trade, "rr" | "pnl">): Outcome {
  const v = t.pnl !== 0 ? t.pnl : t.rr;
  if (v > 0) return "win";
  if (v < 0) return "loss";
  return "be";
}
