import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Public, read-only journal snapshot for a share token.
 * Any failure (bad token, revoked, expired, misconfigured) returns the same 404
 * so tokens can't be probed. Screenshots are never included.
 */
export const dynamic = "force-dynamic";

const notFound = () => NextResponse.json({ error: "Not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = params.token;
  if (!url || !serviceKey || !/^[a-f0-9]{48}$/.test(token)) return notFound();

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data: share } = await supabase.from("shares").select("*").eq("token", token).maybeSingle();
  if (!share || share.revoked) return notFound();
  if (share.expires_at && new Date(share.expires_at).getTime() < Date.now()) return notFound();

  const uid = share.user_id as string;
  const [tradesRes, acctRes, stratRes] = await Promise.all([
    supabase.from("trades").select("data").eq("user_id", uid).limit(5000),
    supabase.from("accounts").select("data").eq("user_id", uid),
    supabase.from("strategies").select("data").eq("user_id", uid),
  ]);
  if (tradesRes.error || acctRes.error || stratRes.error) return notFound();

  const hideMoney = share.hide_money !== false;
  const trades = (tradesRes.data ?? [])
    .map((r) => r.data as Record<string, unknown> & { accountId?: string; pnl?: number })
    .filter((t) => !share.account_id || t.accountId === share.account_id)
    .map((t) => {
      const { beforeImageIds, afterImageIds, ...rest } = t as Record<string, unknown>;
      void beforeImageIds;
      void afterImageIds;
      const out: Record<string, unknown> = { ...rest, beforeImageIds: [], afterImageIds: [] };
      if (hideMoney) {
        // Keep only the sign so win/loss classification still works; drop all amounts.
        out.pnl = Math.sign(Number(t.pnl ?? 0));
        delete out.riskAmount;
        delete out.lotSize;
      }
      return out;
    });

  const accounts = (acctRes.data ?? [])
    .map((r) => r.data as { id: string; name: string; type: string })
    .filter((a) => !share.account_id || a.id === share.account_id)
    .map((a) => ({ id: a.id, name: a.name, type: a.type }));
  const strategies = (stratRes.data ?? []).map((r) => {
    const s = r.data as { id: string; name: string };
    return { id: s.id, name: s.name };
  });

  return NextResponse.json(
    { label: share.label ?? "Shared journal", hideMoney, trades, accounts, strategies },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } }
  );
}
