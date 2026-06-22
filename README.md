# TradeEdge

A professional personal trading journal and analytics workstation. Not a SaaS, not a social platform — a calm, fast place to log trades, review them, find what works, and build consistency.

Dark mode only. Built with **Next.js 14 (App Router) · TypeScript · Tailwind CSS · Zustand**.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. First run shows an empty journal — load sample data from the dashboard (or Settings) to explore, then clear it when you're ready to go live.

## What's inside

| Section | What it does |
|---|---|
| **Dashboard** | "How am I doing?" — Net RR, win rate, profit factor, expectancy, streak, largest win/loss, drawdown, equity curve, today/week/month, recent trades. |
| **Journal** | The heart of the app. List view (sortable, searchable, filterable, bulk delete) and a screenshot-first Gallery view. Opening a trade from the gallery enters **replay mode**: setup, thesis, and tags first — result hidden until you reveal it. |
| **Trade entry** | One modal: account, pair, direction, market, prices, risk, session, strategy, **setup grade (A+/A/B/C)**, **live strategy checklist** (tick your rules at the moment of entry), **planned RR** computed from entry/SL/TP, **did-I-follow-my-plan**, tags, notes, thesis, lessons, emotion before/after, rule violations, and before/after screenshots (drag & drop, paste, upload, lightbox). |
| **Analytics** | Tabbed, never crowded: Overview · Pairs · Sessions · Strategies · Accounts · **Tags & combinations** · **Grades** (do your A+ setups actually win?) · **Execution** (planned vs. actual RR — where you cut winners early or let losers run) · Violations. |
| **Insights** | The dashboard leads with a plain-language summary of *your* data: strongest edge, biggest drag, costliest mistake, execution leaks, and whether your grading is honest. Answers "what to trade more, what to cut" before any deep stats. |
| **Daily review** | A two-minute end-of-day ritual: market conditions, what went well, what to improve, a discipline rating, did-I-follow-my-plan, and mood. Reviewed days are dotted on the calendar; the dashboard nudges you if today isn't done. |
| **Backtesting Lab** | Import CSV as backtest / forward / live. Side-by-side comparison with equity curves and a backtest-vs-live gap card. |
| **Missed trades** | Pair, screenshot, expected RR, session, reason, tags — plus most-missed setups and total potential RR missed. |
| **Psychology** | Win rate, avg RR, and net RR by emotion (before entry / after exit), calm vs reactive states. |
| **Accounts** | Personal / Demo / Challenge / Funded / Backtest. Broker, balance, prop firm, currency. The top-bar selector scopes the whole app. |
| **Strategies** | Rules, checklist, tags, and live statistics per strategy. |
| **Calendar** | Daily / weekly / monthly. Day cells are colored by net R; click a day to see its trades. |
| **Search** | ⌘K / Ctrl+K — trades, strategies, accounts, tags, notes. |
| **Export** | Trades as CSV or JSON, full JSON backup + restore (Settings). |

## CSV import format

Headers (case-insensitive, any order). Required: `date, pair, direction, rr`. Optional: `pnl, session, tags, notes` — tags separated by `;`.

```csv
date,pair,direction,rr,pnl,session,tags,notes
2026-05-02,EURUSD,long,2.4,120,London,Liquidity;MSS,Clean sweep entry
2026-05-03,XAUUSD,short,-1,-50,New York,OB,Stopped early
```

## Storage modes — local or Supabase

TradeEdge runs in two modes, chosen automatically by environment variables. **No env vars → local mode** (data in your browser, no account, works out of the box). **Supabase keys present → cloud mode** (sign-in, per-user data, sync across devices). The same app, same UI — only the storage backend changes, because everything goes through one `Backend` interface (`src/lib/data/backend.ts`).

### Running on Supabase

1. **Create a project** at supabase.com (free tier is fine).
2. **Run the schema.** Dashboard → SQL Editor → New query → paste all of `supabase/schema.sql` → Run. This creates the tables, Row Level Security policies (each user sees only their own rows), the `profiles` table for custom tags, and a private `screenshots` storage bucket with per-user folder policies.
3. **Get your keys.** Dashboard → Settings → API. Copy the **Project URL** and the **anon public** key.
4. **Configure the app.** Copy `.env.local.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   ```
5. **Run it.** `npm run dev`. You'll get a sign-in screen. Create an account and you're on the cloud.

By default Supabase requires email confirmation for new sign-ups. For solo use you can turn that off under Authentication → Providers → Email → "Confirm email" (off) to sign in immediately.

### How it maps

| App concept | Supabase |
|---|---|
| Accounts / trades / strategies / missed / reviews | One table each: `(id text, user_id uuid, data jsonb)`. The whole object is stored as `jsonb`, so adding a field never needs a migration. |
| Custom tags | `profiles.custom_tags text[]` |
| Screenshots | Private `screenshots` bucket, path `screenshots/<your-user-id>/<imageId>.jpg`, served via short-lived signed URLs |
| Per-user isolation | Row Level Security: `auth.uid() = user_id` on every table and storage object |
| Sign-in | Supabase Auth (email + password) |

Writes are granular and optimistic: each change updates the UI instantly and writes a single row in the background — not the whole dataset. Export / full backup / restore still work in both modes, so you can move data between local and cloud or between accounts.

> Security note: the `anon` key is meant to be public (it's safe in the browser) — your data is protected by Row Level Security, not by hiding the key. Never put the `service_role` key in this app.



```
src/
  lib/
    types.ts            Domain model (Trade, Account, Strategy, MissedTrade, Snapshot)
    metrics.ts          All statistics: win rate, PF, expectancy, drawdown, streaks,
                        equity curves, group stats, tag-combination analysis
    csv.ts              CSV parse/serialize, export, backup
    data/
      repository.ts     DataRepository interface + localStorage implementation
      images.ts         IndexedDB screenshot store (compressed JPEG, keyed by id)
      sample.ts         Sample data generator
  stores/useApp.ts      Single Zustand store; every mutation writes through the repository
  components/           Layout shell, UI primitives, charts (hand-rolled SVG), trade modals
  app/                  One route per section
```

### Strategy-defined fields (any methodology)

The journal is **not** SMC-only. Each **strategy is a template**: it carries a name, a checklist, and a set of custom fields (`CustomFieldDef` — name, type, options, required). When you select a strategy while logging a trade, its fields render in the form, and trades store their answers in `trade.fieldValues` keyed by field id. Analytics → **Breakdowns** then groups by any field any strategy defines. SMC ships as one preset (`src/lib/data/templates.ts`) alongside Breakout and Supply & Demand; add your own with the field builder in the strategy editor. Legacy SMC trades (top-level `htfBias`, `entryModel`, …) are bridged by name in `src/lib/fields.ts`, so old and new data appear in the same breakdowns.

### Storage backend

The app never touches storage directly — everything goes through the `Backend` interface in `src/lib/data/backend.ts` (granular per-entity reads and writes). Two implementations ship: `LocalBackend` (localStorage + IndexedDB for images) and `SupabaseBackend` (`src/lib/supabase/backend.ts`). The active one is selected at startup from whether Supabase env vars are present — no other code changes between modes.

## Design system

Background `#0B1020` · Surface `#111827` · Card `#151B2D` · Border `#1F2937` · Text `#F8FAFC / #CBD5E1 / #94A3B8` · Positive `#22C55E` · Negative `#EF4444` · Warning `#F59E0B` · Accent `#60A5FA`. Inter for UI, JetBrains Mono for every number.
