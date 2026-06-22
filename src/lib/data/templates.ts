import { Strategy, CustomFieldDef } from "@/lib/types";

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export interface StrategyTemplate {
  key: string;
  label: string;
  description: string;
  build: () => Strategy;
}

function field(name: string, type: CustomFieldDef["type"], opts?: { options?: string[]; required?: boolean }): CustomFieldDef {
  return { id: uid(), name, type, options: opts?.options, required: opts?.required };
}

export const STRATEGY_TEMPLATES: StrategyTemplate[] = [
  {
    key: "smc",
    label: "Smart Money Concepts (SMC / ICT)",
    description: "Liquidity sweep into a POI with market-structure confirmation.",
    build: () => ({
      id: uid(),
      name: "Smart Money Concepts",
      description: "Sweep of liquidity → MSS/ChoCH → entry at POI (FVG / OB / Breaker).",
      rules: ["HTF bias aligned", "Sweep of obvious liquidity", "MSS with displacement", "Entry at refined POI"],
      checklist: ["Followed HTF bias", "Waited for liquidity sweep", "Confirmed MSS / ChoCH", "Entry at POI", "Respected risk"],
      tags: ["Liquidity", "MSS", "POI", "FVG", "OB"],
      fields: [
        field("HTF Bias", "select", { options: ["Bullish", "Bearish"], required: true }),
        field("Entry Model", "select", {
          options: [
            "Liquidity Sweep + FVG",
            "Liquidity Sweep + OB",
            "Liquidity Sweep + Breaker",
            "MSS + FVG",
            "MSS + OB",
            "MSS + Breaker",
          ],
          required: true,
        }),
        field("POI Type", "select", { options: ["FVG", "Order Block", "Supply Zone", "Demand Zone", "Breaker Block"], required: true }),
        field("Liquidity Taken", "select", {
          options: ["PDH", "PDL", "Asian High", "Asian Low", "Equal Highs", "Equal Lows", "Session High", "Session Low", "Weekly High", "Weekly Low"],
          required: true,
        }),
      ],
      createdAt: new Date().toISOString(),
    }),
  },
  {
    key: "breakout",
    label: "Breakout / Momentum",
    description: "Range or level break with momentum and volume confirmation.",
    build: () => ({
      id: uid(),
      name: "Breakout",
      description: "Break of a key level or range with momentum confirmation.",
      rules: ["Clear level / range", "Strong break candle", "Retest holds"],
      checklist: ["Level marked", "Momentum confirmed", "Retest entry", "Respected risk"],
      tags: ["Breakout", "Momentum"],
      fields: [
        field("Level Type", "select", { options: ["Range High", "Range Low", "Daily High", "Daily Low", "Trendline", "Round Number"], required: true }),
        field("Trigger", "select", { options: ["Break & retest", "Break & go", "Failed break (reversal)"], required: true }),
        field("Volume Confirmation", "boolean"),
      ],
      createdAt: new Date().toISOString(),
    }),
  },
  {
    key: "supply_demand",
    label: "Supply & Demand",
    description: "Reaction from a fresh supply or demand zone.",
    build: () => ({
      id: uid(),
      name: "Supply & Demand",
      description: "Entry on the first return to a fresh, unmitigated zone.",
      rules: ["Fresh zone", "Strong departure (imbalance)", "First mitigation"],
      checklist: ["Zone fresh", "Imbalance present", "Confirmation on LTF", "Respected risk"],
      tags: ["Supply", "Demand"],
      fields: [
        field("Zone Type", "select", { options: ["Supply", "Demand"], required: true }),
        field("Zone Freshness", "select", { options: ["Fresh", "1 tap", "Mitigated"], required: true }),
        field("Curve Location", "select", { options: ["Discount", "Premium", "Equilibrium"] }),
      ],
      createdAt: new Date().toISOString(),
    }),
  },
];

export function buildTemplate(key: string): Strategy | null {
  return STRATEGY_TEMPLATES.find((t) => t.key === key)?.build() ?? null;
}
