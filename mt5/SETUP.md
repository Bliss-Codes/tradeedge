# MT5 → TradeEdge auto-sync (free)

Every trade you close in MT5 appears in TradeEdge automatically. One-time setup, ~10 minutes.

## 1. Two env vars in Vercel
Vercel → your project → Settings → Environment Variables → add:

| Name | Value |
|---|---|
| `MT5_SYNC_SECRET` | Any long random string (e.g. from https://randomkeygen.com). You'll paste the same value into the EA. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API → **service_role** key. ⚠️ Server-only secret — never put it in the EA or share it. |

Then **Redeploy** (Deployments → ⋯ → Redeploy) so the vars take effect.

## 2. Install the EA in MT5
1. In MT5: **File → Open Data Folder** → `MQL5/Experts/` → copy `TradeEdgeSync.mq5` there.
2. In MT5: **Tools → MetaQuotes Language Editor** (F4) → open the file → **Compile** (F7). Zero errors expected.
3. Back in MT5: **Tools → Options → Expert Advisors** → tick **Allow WebRequest for listed URL** and add your site, e.g. `https://your-app.vercel.app`.

## 3. Attach + configure
Drag **TradeEdgeSync** from the Navigator onto any chart (one chart is enough — it hears all trades on the account). In the Inputs tab:

| Input | Value |
|---|---|
| `WebhookURL` | `https://your-app.vercel.app/api/mt5` |
| `SecretKey` | the same value as `MT5_SYNC_SECRET` |
| `UserId` | TradeEdge → **Settings → MT5 auto-sync** |
| `AccountId` | same place — the TradeEdge account these trades belong to |
| `BackfillDays` | how much history to import on start (default 30; set 0 to disable) |

Make sure the **Algo Trading** button (toolbar) is ON. The EA prints its activity in the **Experts** tab.

## What syncs
- Fires when a position **closes** (including partial closes — each close logs its own portion).
- Sends: pair, direction, entry/exit prices, SL/TP (if set), lot size, open time (converted to UTC), and the **actual $ profit** including swap and commission.
- TradeEdge derives the **session** from the trade time and **RR** from entry/SL/exit.
- Duplicates are impossible: each MT5 deal has a fixed id; re-sends and backfills are ignored server-side.
- Synced trades carry an `mt5-sync` tag so you can filter them.

## Limits (honest ones)
- Syncs only while **your MT5 terminal is running**. Trades closed while it was off are picked up by the backfill next time you start MT5 (set `BackfillDays` accordingly).
- SL/TP are read from the closing deal — if you never set them, RR can't be derived and stays 0 (edit the trade to add it).
- Strategy, grade, emotions, screenshots stay manual — that's your journaling.
