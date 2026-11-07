# MT5 auto-sync: easy setup (recommended)

1. One time, in Vercel → Settings → Environment Variables: add `SUPABASE_SERVICE_ROLE_KEY` (Supabase → Settings → API → service_role) and redeploy. In Supabase SQL editor run `supabase/20261104_mt5_links.sql`.
2. In TradeEdge open **Accounts → Add account → Connect MetaTrader 5**, pick the account, and **download the EA**. It already contains your site address and a private link for that account, so there is nothing to type.
3. Put it in MT5 (File → Open Data Folder → MQL5/Experts), compile in MetaEditor (F7), allow your site under Tools → Options → Expert Advisors → Allow WebRequest, drag it on any chart, and turn on Algo Trading.
4. The drawer turns green ("Connected") within a minute. The Accounts table shows live status, MT5 login, balance and last update.

Repeat for each MT5 login (each account gets its own EA file). `MT5_SYNC_SECRET` is no longer required; the steps below are the older manual method and still work.

---

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
- SL/TP are read from the closing deal — if you never set them, R can't be derived, so the trade is flagged "R unknown" and left out of R stats until you edit it.
- Strategy, grade, emotions, screenshots stay manual — that's your journaling.
