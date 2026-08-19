# TradeEdge — Prop-Firm SMC Upgrade: Implementation

This document covers the six requested deliverables. The headline: because each record is stored as a single `jsonb` object (Supabase) or JSON blob (local), **adding fields needs no destructive migration and old records stay valid**. That property drove every decision below.

---

## 1. Database migration plan

**No schema migration is required.** All new fields are optional properties on the existing per-entity `data` jsonb column. Existing trades simply lack the new keys and read back as `undefined`, which every screen handles.

What changes, and how it's handled:

| Change | Backward-compatibility strategy |
|---|---|
| Grade `C` removed | `C` removed from the selectable `GRADES` list, but the `Grade` type still *accepts* `"C"` so old trades keep displaying it. Analytics group grades dynamically, so a legacy `C` still appears in the Grades tab. No data rewrite. |
| Emotions replaced | New `EMOTIONS` set. Old values (Confidence, Discipline, Greed, Anxiety, Frustration) are no longer selectable but still display and still group in Psychology analytics. No data rewrite. |
| `market` removed | Field made **optional** (`market?`). Old trades keep their value harmlessly; the input and the detail row are gone. No data rewrite. |
| New SMC fields | All optional. Only enforced for *new* saves via form validation (below). |

**Optional backfill (not required):** if you want old trades to count toward the new analytics, edit them — the form will require the new fields on save. There is no automated backfill because the historical SMC context can't be reconstructed reliably, and inventing it would corrupt the analytics.

If you are on the SQL backend, `supabase/schema.sql` is unchanged and does **not** need to be re-run.

---

## 2. Updated schema (TypeScript domain model — `src/lib/types.ts`)

New/changed enums:

- `GRADES = ["A+","A","B"]`; `Grade = "A+"|"A"|"B"|"C"` (C accepted for legacy display only)
- `EMOTIONS = ["Neutral","Focused","Fear","FOMO","Revenge","Frustrated"]`
- `HTF_BIAS = ["Bullish","Bearish"]`
- `ENTRY_MODELS` = the six liquidity/MSS × FVG/OB/Breaker combinations
- `POI_TYPES = ["FVG","Order Block","Supply Zone","Demand Zone","Breaker Block"]`
- `LIQUIDITY_TYPES` = PDH/PDL/Asian/Equal/Session/Weekly/Trendline
- `EXIT_REASONS = ["Take Profit","Stop Loss","Breakeven","Manual Close","Partial Close"]`
- `QUALITY_LABELS` = 1 Poor … 5 Textbook Setup
- `MISSED_REASONS = ["Sleeping","Working","Hesitation","Did Not See Setup","News Event","No Alert","Other"]`

New optional `Trade` fields: `htfBias`, `entryModel`, `poiType`, `liquidityTaken`, `exitReason`, `qualityScore` (1–5), and review booleans `followedHtfBias`, `waitedForLiquidity`, `waitedForConfirmation`, `respectedRisk` (the 5th item, `followedPlan`, already existed). `market` is now optional. The trade's `date` is the **exact entry timestamp** (datetime-local, minute precision) and drives the Time-of-Day analysis — no separate redundant field, to keep entry friction low.

---

## 3. Backend changes

The `Backend` interface (`src/lib/data/backend.ts`) is unchanged — it stores whole objects, so new fields flow through automatically in both `LocalBackend` and `SupabaseBackend`. CSV import/export and full backup/restore also carry the new fields with no change. No new endpoints, no new tables.

---

## 4. Frontend changes

- **Trade entry modal** (`TradeModal.tsx`): removed Market; added a required **Setup (SMC)** section (HTF Bias, Liquidity Taken, POI Type, Entry Model); added Quality Score (1–5 with labels) and Exit Reason; replaced the single plan toggle with the 5-item **Trade Review** checklist; added **validation** that blocks save and lists missing required fields.
- **Trade detail** (`TradeDetail.tsx`): shows the SMC fields, quality, exit reason, and the review checklist as ✓/✗ chips; removed Market.
- **Dashboard** (`page.tsx`): **Rule Adherence %** is now the first headline KPI.
- **Analytics** (`analytics/page.tsx`): new tabs — **Entry Models** (+ POI + Liquidity tables), **HTF Bias** (Bullish vs Bearish WR & Net RR), **Time of Day** (Net RR and Win Rate by entry hour), **Exits** (TP/SL/BE/Manual/Partial distribution), **Quality** (by 1–5 score). Overview gained Rule Adherence KPI + weekly/monthly trend.
- **Reviews** (`reviews/page.tsx`, new route + sidebar item): auto-generated **Weekly** and **Monthly** reviews.
- **Missed trades**: reason list swapped to the new options.

---

## 5. Analytics calculations (`src/lib/metrics.ts`)

- `ruleAdherence(trades)` = `followedPlan === true` count ÷ total × 100.
- `adherenceTrend(trades, "week"|"month", limit)` = adherence % bucketed by ISO week or calendar month, oldest→newest.
- `statsByHour(trades)` = full `Stats` per entry hour (0–23) from the trade timestamp.
- `distribution(trades, key)` = counts + percentages for a field (used for exit reasons).
- `statsByGroup(trades, key)` (existing) powers Entry Model, HTF Bias, POI, Liquidity, and Quality tables.
- `bestWorst(rows, min)` and `mostCommonMistake(trades)` feed the Weekly/Monthly highlights.

All grouping suppresses `undefined` keys, so trades missing a field never create a phantom row.

---

## 6. Step-by-step implementation order (as applied)

1. Extend the domain model (enums + optional Trade fields), keeping `Grade` C-tolerant and `market` optional for backward compatibility.
2. Add analytics calculations to the metrics module.
3. Rework the trade entry modal: remove Market, add SMC section, quality, exit, review checklist, and required-field validation.
4. Surface the new fields in the trade detail view.
5. Add the analytics tabs and the dashboard Rule Adherence KPI.
6. Build the Weekly/Monthly Reviews page and add it to navigation.
7. Update missed-trade reasons.
8. Update the sample generator to populate the new fields and drop legacy values.
9. Build + verify (production build green across 14 routes; 18-check data/analytics harness all passing).

---

## Honest notes

- **Validation applies to all modal saves**, including backtest/forward entries logged via the form. For an SMC-focused platform that's intentional, but it does add friction to quick backtest logging. CSV import stays lenient for bulk history.
- **Editing an old trade** now requires filling the new SMC fields before it can be re-saved. That's the cost of making them required; it only triggers on edit.
- The new analytics only become meaningful with sample size. Treat any group under ~20 trades as a hypothesis, not an edge.
