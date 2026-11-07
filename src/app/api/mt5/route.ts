import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash, timingSafeEqual } from "crypto";
import { sessionFromDate, Session } from "@/lib/types";

/**
 * MT5 → TradeEdge sync endpoint.
 *
 * The TradeEdgeSync EA posts closed deals here. Auth is a shared secret
 * (MT5_SYNC_SECRET) checked against the x-sync-key header. Inserts use the
 * Supabase service-role key (server-only env var) with deterministic ids
 * (mt5-{login}-{ticket}) so re-sends and backfills never duplicate.
 *
 * Required Vercel env vars:
 *   MT5_SYNC_SECRET            — any long random string; same value goes in the EA input
 *   SUPABASE_SERVICE_ROLE_KEY  — Supabase dashboard → Settings → API → service_role
 */

interface IncomingDeal {
  ticket: number | string;
  symbol: string;
  direction: "long" | "short";
  openTimeUtc: string; // ISO
  entry?: number;
  exit?: number;
  stopLoss?: number;
  takeProfit?: number;
  volume?: number;
  profit: number;
}

interface SyncBody {
  login?: number | string;
  userId?: string;
  accountId?: string;
  deals?: IncomingDeal[];
  heartbeat?: boolean;
  server?: string;
  balance?: number;
}

/** Constant-time secret check (hashes first so lengths always match). */
function safeEqual(a: string | null, b: string): boolean {
  if (a === null) return false;
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

function cleanSymbol(s: string): string {
  // strip common broker suffixes like ".r", ".pro", "m", "+" cautiously (keep if ambiguous)
  return s.replace(/[._-](r|pro|raw|ecn|m|c)$/i, "").toUpperCase();
}

/**
 * Health check: open https://your-app.vercel.app/api/mt5 in a browser.
 * Shows which pieces are configured without leaking any secrets.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "POST deals here from the TradeEdgeSync EA",
    configured: {
      MT5_SYNC_SECRET: Boolean(process.env.MT5_SYNC_SECRET), // optional (legacy mode)
      SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    },
  });
}

export async function POST(req: NextRequest) {
  const legacySecret = process.env.MT5_SYNC_SECRET; // optional now: per-account tokens replace it
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceKey || !url) {
    return NextResponse.json({ error: "Sync not configured. Set SUPABASE_SERVICE_ROLE_KEY in Vercel and redeploy." }, { status: 500 });
  }

  let body: SyncBody;
  try {
    body = (await req.json()) as SyncBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const key = req.headers.get("x-sync-key") ?? "";

  let userId: string;
  let accountId: string;
  let linkToken: string | null = null;

  if (/^[a-f0-9]{48}$/.test(key)) {
    // Per-account link token (the easy path).
    const { data: link } = await supabase.from("mt5_links").select("user_id, account_id, revoked").eq("token", key).maybeSingle();
    if (!link || link.revoked) return NextResponse.json({ error: "Invalid sync key" }, { status: 401 });
    userId = link.user_id as string;
    accountId = link.account_id as string;
    linkToken = key;
  } else if (legacySecret && safeEqual(key, legacySecret)) {
    // Legacy shared secret + ids in the body.
    if (!body.userId || !body.accountId) return NextResponse.json({ error: "Missing userId or accountId" }, { status: 400 });
    userId = body.userId;
    accountId = body.accountId;
  } else {
    return NextResponse.json({ error: "Invalid sync key" }, { status: 401 });
  }

  const touchLink = async () => {
    if (!linkToken) return;
    const patch: Record<string, unknown> = { last_seen: new Date().toISOString() };
    if (body.login != null) patch.login = String(body.login);
    if (typeof body.server === "string") patch.server = body.server.slice(0, 80);
    if (typeof body.balance === "number" && Number.isFinite(body.balance)) patch.balance = body.balance;
    await supabase.from("mt5_links").update(patch).eq("token", linkToken);
  };

  if (body.heartbeat) {
    await touchLink();
    return NextResponse.json({ ok: true });
  }
  if (!Array.isArray(body.deals)) {
    return NextResponse.json({ error: "Missing deals" }, { status: 400 });
  }
  await touchLink();

  const rows = body.deals
    .filter((d) => d && d.ticket != null && d.symbol && d.openTimeUtc)
    .map((d) => {
      const date = new Date(d.openTimeUtc);
      const iso = isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
      const session: Session = sessionFromDate(new Date(iso));
      // RR from prices when a stop exists; otherwise flagged rrUnknown (user can set it).
      let rr = 0;
      let rrUnknown = true; // no stop loss → R is undefined; excluded from R stats until user sets it
      if (d.entry != null && d.stopLoss != null && d.exit != null && d.entry !== d.stopLoss) {
        const risk = Math.abs(d.entry - d.stopLoss);
        const reward = d.direction === "long" ? d.exit - d.entry : d.entry - d.exit;
        rr = +(reward / risk).toFixed(2);
        rrUnknown = false;
      }
      const id = `mt5-${body.login ?? "x"}-${d.ticket}`;
      const trade = {
        id,
        accountId,
        type: "live",
        pair: cleanSymbol(d.symbol),
        direction: d.direction,
        date: iso,
        entry: d.entry,
        exit: d.exit,
        stopLoss: d.stopLoss,
        takeProfit: d.takeProfit,
        lotSize: d.volume,
        rr,
        ...(rrUnknown ? { rrUnknown: true } : {}),
        pnl: +(+d.profit).toFixed(2),
        session,
        tags: ["mt5-sync"],
        violations: [],
        beforeImageIds: [],
        afterImageIds: [],
        notes: "",
        createdAt: new Date().toISOString(),
      };
      return { id, user_id: userId, data: trade };
    });

  if (rows.length === 0) return NextResponse.json({ received: 0, inserted: 0 });

  // Insert, ignoring rows whose id already exists (dedupe on re-send/backfill).
  const { data, error } = await supabase.from("trades").upsert(rows, { onConflict: "id", ignoreDuplicates: true }).select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ received: rows.length, inserted: data?.length ?? 0 });
}
