import { Account, MissedTrade, Snapshot, Strategy, Trade, DayReview, DEFAULT_TAGS, Session, Emotion, Violation, Grade } from "@/lib/types";
import { buildTemplate } from "@/lib/data/templates";

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const PAIRS = ["EURUSD", "GBPUSD", "XAUUSD", "GBPJPY", "US30", "NAS100"];
const SESSIONS: Session[] = ["London", "New York", "Asia", "Overlap"];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Fill a strategy's custom fields with random valid values (for sample data). */
function sampleFieldValues(strategy: Strategy): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const f of strategy.fields ?? []) {
    if (f.type === "select" && f.options?.length) out[f.id] = pick(f.options);
    else if (f.type === "boolean") out[f.id] = Math.random() < 0.6;
    else if (f.type === "number") out[f.id] = Math.floor(Math.random() * 5) + 1;
    else if (f.type === "text") out[f.id] = "sample";
  }
  return out;
}

export function buildSampleData(): Snapshot {
  const now = new Date();
  const accounts: Account[] = [
    { id: uid(), name: "Personal", type: "Personal", broker: "IC Markets", balance: 5000, currency: "USD", createdAt: now.toISOString() },
    { id: uid(), name: "FundingPips 10K", type: "Challenge", broker: "FundingPips", propFirm: "FundingPips", balance: 10000, currency: "USD", createdAt: now.toISOString() },
    { id: uid(), name: "Demo", type: "Demo", broker: "IC Markets", balance: 100000, currency: "USD", createdAt: now.toISOString() },
  ];

  // Two strategies from templates so the sample demonstrates the flexible,
  // strategy-defined field system (SMC + a non-SMC breakout strategy).
  const strategies: Strategy[] = [
    { ...(buildTemplate("smc") as Strategy), createdAt: now.toISOString() },
    { ...(buildTemplate("breakout") as Strategy), createdAt: now.toISOString() },
  ];

  const trades: Trade[] = [];
  for (let i = 0; i < 64; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(7 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0);

    const strategy = pick(strategies);
    const win = Math.random() < 0.55;
    const be = !win && Math.random() < 0.12;
    const rr = be ? 0 : win ? +(1.5 + Math.random() * 3).toFixed(2) : -1;
    const riskAmount = 50 + Math.floor(Math.random() * 50);
    const acct = pick(accounts);
    const tags = [...new Set([...strategy.tags, ...(Math.random() < 0.5 ? [pick(DEFAULT_TAGS)] : [])])];
    const violations: Violation[] =
      !win && Math.random() < 0.35 ? [pick(["Entered Early", "No Confirmation", "FOMO", "Revenge Trade"] as const)] : [];
    const emotionBefore: Emotion = pick(["Neutral", "Focused", "FOMO", "Fear"] as const);
    const emotionAfter: Emotion = win ? pick(["Focused", "Neutral"] as const) : pick(["Frustrated", "Neutral", "Revenge"] as const);

    // Synthetic but coherent price geometry so planned RR is meaningful.
    const long = Math.random() < 0.5;
    const entryPx = +(1 + Math.random()).toFixed(4);
    const riskDist = +(0.001 + Math.random() * 0.004).toFixed(4);
    const plannedTargetR = 2 + Math.random() * 2;
    const stopPx = long ? +(entryPx - riskDist).toFixed(4) : +(entryPx + riskDist).toFixed(4);
    const tpPx = long ? +(entryPx + riskDist * plannedTargetR).toFixed(4) : +(entryPx - riskDist * plannedTargetR).toFixed(4);
    // Exit roughly tracks the realized rr, with occasional early cuts / stop runs.
    const exitPx = long ? +(entryPx + riskDist * rr).toFixed(4) : +(entryPx - riskDist * rr).toFixed(4);

    const grade: Grade = win ? pick(["A+", "A", "A", "B"] as const) : pick(["A", "B", "B"] as const);
    const checklistDone = win
      ? strategy.checklist
      : strategy.checklist.slice(0, Math.max(1, strategy.checklist.length - (Math.random() < 0.5 ? 1 : 2)));

    const exitReason = be ? "Breakeven" : win ? (Math.random() < 0.8 ? "Take Profit" : "Partial Close") : (Math.random() < 0.85 ? "Stop Loss" : "Manual Close");
    const qualityScore = win ? pick([5, 4, 4, 3] as const) : pick([3, 2, 2, 1] as const);
    const followed = violations.length === 0;
    const fieldValues = sampleFieldValues(strategy);

    trades.push({
      id: uid(),
      accountId: acct.id,
      type: "live",
      pair: pick(PAIRS),
      direction: long ? "long" : "short",
      date: d.toISOString(),
      entry: entryPx,
      exit: exitPx,
      stopLoss: stopPx,
      takeProfit: tpPx,
      riskPercent: 1,
      riskAmount,
      rr,
      pnl: +(rr * riskAmount).toFixed(2),
      session: pick(SESSIONS),
      strategyId: strategy.id,
      grade,
      exitReason,
      qualityScore,
      fieldValues,
      respectedRisk: Math.random() < 0.9,
      checklistDone,
      followedPlan: followed,
      tags,
      notes: win ? "Clean execution, followed the plan." : be ? "Moved to breakeven after partial." : "Setup invalidated faster than expected.",
      thesis: "Expecting a sweep of liquidity into the H1 POI, then continuation with session momentum.",
      lessons: win ? "Patience at the POI paid off." : "Wait for confirmation before committing risk.",
      emotionBefore,
      emotionAfter,
      violations,
      beforeImageIds: [],
      afterImageIds: [],
      createdAt: d.toISOString(),
    });
  }

  // A handful of backtest + forward trades so the lab has something to compare.
  for (let i = 0; i < 40; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - 120 - Math.floor(Math.random() * 120));
    const win = Math.random() < 0.6;
    const rr = win ? +(2 + Math.random() * 2.5).toFixed(2) : -1;
    trades.push({
      id: uid(),
      accountId: accounts[2].id,
      type: i < 28 ? "backtest" : "forward",
      pair: pick(PAIRS),
      direction: Math.random() < 0.5 ? "long" : "short",
      date: d.toISOString(),
      rr,
      pnl: 0,
      session: pick(SESSIONS),
      strategyId: strategies[0].id,
      tags: strategies[0].tags,
      violations: [],
      beforeImageIds: [],
      afterImageIds: [],
      createdAt: d.toISOString(),
    });
  }

  const missed: MissedTrade[] = [
    {
      id: uid(),
      pair: "XAUUSD",
      date: new Date(now.getTime() - 3 * 864e5).toISOString(),
      expectedRR: 3.2,
      session: "New York",
      reason: "Hesitation",
      notes: "Perfect sweep + MSS but waited for one more confirmation.",
      tags: ["Liquidity", "MSS"],
      imageIds: [],
      createdAt: now.toISOString(),
    },
    {
      id: uid(),
      pair: "GBPUSD",
      date: new Date(now.getTime() - 9 * 864e5).toISOString(),
      expectedRR: 2.5,
      session: "London",
      reason: "Away from screen",
      tags: ["OB"],
      imageIds: [],
      createdAt: now.toISOString(),
    },
  ];

  const dk = (offset: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const reviews: DayReview[] = [
    {
      id: uid(),
      date: dk(1),
      marketNotes: "Clean London trend day, news-free.",
      wentWell: "Waited for the MSS before entering. No revenge trades after the early stop.",
      toImprove: "Took partials too early on the runner — let winners breathe.",
      disciplineRating: 4,
      followedPlan: true,
      mood: "Focused",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: uid(),
      date: dk(2),
      marketNotes: "Choppy, low volatility Asia into a slow NY.",
      wentWell: "Recognized the range and sat on my hands most of the day.",
      toImprove: "Forced one trade out of boredom. That's the FOMO pattern again.",
      disciplineRating: 2,
      followedPlan: false,
      mood: "Frustrated",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];

  return { accounts, trades, strategies, missed, reviews, customTags: [] };
}
