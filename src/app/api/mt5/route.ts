import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
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
  login: number | string;
  userId: string;
  accountId: string;
  deals: IncomingDeal[];
}

function cleanSymbol(s: string): string {
  // strip common broker suffixes like ".r", ".pro", "m", "+" cautiously (keep if ambiguous)
  return s.replace(/[._-](r|pro|raw|ecn|m|c)$/i, "").toUpperCase();
}

export async function POST(req: NextRequest) {
  const secret = process.env.MT5_SYNC_SECRET;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!secret || !serviceKey || !url) {
    return NextResponse.json({ error: "Sync not configured. Set MT5_SYNC_SECRET and SUPABASE_SERVICE_ROLE_KEY in Vercel." }, { status: 500 });
  }
  if (req.headers.get("x-sync-key") !== secret) {
    return NextResponse.json({ error: "Invalid sync key" }, { status: 401 });
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
