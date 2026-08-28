import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sessionFromDate, Session } from "@/lib/types";

/**
 * MT5 → TradeEdge sync endpoint.
 *
 * The TradeEdgeSync EA posts closed deals here. Each user gets a private
 * sync token stored in Supabase Auth user metadata, so one user's MT5
 * connection cannot be used to write into another user's journal.
 *
 * Required Vercel env var:
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
  login: number | string;
  userId: string;
  accountId: string;
  deals: IncomingDeal[];
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
      PER_USER_SYNC_TOKEN: true,
      SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    },
  });
}

export async function POST(req: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceKey || !url) {
    return NextResponse.json({ error: "Sync not configured. Set SUPABASE_SERVICE_ROLE_KEY in Vercel." }, { status: 500 });
  }
  let body: SyncBody;
  try {
    body = (await req.json()) as SyncBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.userId || !body.accountId || !Array.isArray(body.deals)) {
    return NextResponse.json({ error: "Missing userId, accountId or deals" }, { status: 400 });
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  // Prefer a private per-user token stored in Auth metadata. This lets the
  // EA authenticate as the intended TradeEdge user without exposing a global
  // secret that could write to any user's journal.
  const providedKey = req.headers.get("x-sync-key") ?? "";
  let authenticated = false;

  {
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(String(body.userId));
    if (authError || !authUser.user) {
      return NextResponse.json({ error: "Unknown TradeEdge user" }, { status: 401 });
    }
    const expectedToken = authUser.user.user_metadata?.tradeedge_mt5_sync_token;
    if (!expectedToken || providedKey !== expectedToken) {
      return NextResponse.json({ error: "Invalid MT5 sync token" }, { status: 401 });
    }
    authenticated = true;
  }

  if (!authenticated) {
    return NextResponse.json({ error: "Invalid MT5 sync token" }, { status: 401 });
  }

  const { data: accountRows, error: accountError } = await supabase
    .from("accounts")
    .select("id")
    .eq("id", String(body.accountId))
    .eq("user_id", String(body.userId))
    .limit(1);

  if (accountError) return NextResponse.json({ error: accountError.message }, { status: 500 });
  if (!accountRows?.length) {
    return NextResponse.json({ error: "TradeEdge account not found for this user" }, { status: 403 });
  }

  const rows = body.deals
    .filter((d) => d && d.ticket != null && d.symbol && d.openTimeUtc)
    .map((d) => {
      const date = new Date(d.openTimeUtc);
      const iso = isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
      const session: Session = sessionFromDate(new Date(iso));
      // RR from prices when a stop exists; falls back to 0 (user can edit).
      let rr = 0;
      if (d.entry != null && d.stopLoss != null && d.exit != null && d.entry !== d.stopLoss) {
        const risk = Math.abs(d.entry - d.stopLoss);
        const reward = d.direction === "long" ? d.exit - d.entry : d.entry - d.exit;
        rr = +(reward / risk).toFixed(2);
      }
      const id = `mt5-${body.login}-${d.ticket}`;
      const trade = {
        id,
        accountId: body.accountId,
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
        pnl: +(+d.profit).toFixed(2),
        session,
        tags: ["mt5-sync"],
        violations: [],
        beforeImageIds: [],
        afterImageIds: [],
        notes: "",
        createdAt: new Date().toISOString(),
      };
      return { id, user_id: body.userId, data: trade };
    });

  if (rows.length === 0) return NextResponse.json({ received: 0, inserted: 0 });

  // Insert, ignoring rows whose id already exists (dedupe on re-send/backfill).
  const { data, error } = await supabase.from("trades").upsert(rows, { onConflict: "id", ignoreDuplicates: true }).select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ received: rows.length, inserted: data?.length ?? 0 });
}
