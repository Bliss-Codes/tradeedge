"use client";

import { Account, DayReview, MissedTrade, Snapshot, Strategy, Trade, EMPTY_SNAPSHOT } from "@/lib/types";
import { supabase, SCREENSHOT_BUCKET } from "@/lib/supabase/client";
import type { Backend } from "@/lib/data/backend";

/**
 * Each entity is stored as a row { id (text, client-generated), user_id (uuid),
 * data (jsonb) }. Storing the whole object as jsonb keeps the app's schema and
 * the database in lockstep — adding a field like `grade` needs no migration —
 * while RLS scopes every row to its owner. See supabase/schema.sql.
 */

const TABLES = {
  account: "accounts",
  trade: "trades",
  strategy: "strategies",
  missed: "missed_trades",
  review: "day_reviews",
} as const;

function db() {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

async function userId(): Promise<string> {
  const { data, error } = await db().auth.getUser();
  if (error || !data.user) throw new Error("Not signed in.");
  return data.user.id;
}

export class SupabaseBackend implements Backend {
  async fetchAll(): Promise<Snapshot> {
    const sb = db();
    const [accounts, trades, strategies, missed, reviews, profile] = await Promise.all([
      sb.from(TABLES.account).select("data"),
      sb.from(TABLES.trade).select("data"),
      sb.from(TABLES.strategy).select("data"),
      sb.from(TABLES.missed).select("data"),
      sb.from(TABLES.review).select("data"),
      sb.from("profiles").select("custom_tags").maybeSingle(),
    ]);
    const rows = <T,>(r: { data: { data: T }[] | null; error: unknown }) => (r.data ?? []).map((x) => x.data);
    return {
      accounts: rows<Account>(accounts),
      trades: rows<Trade>(trades),
      strategies: rows<Strategy>(strategies),
      missed: rows<MissedTrade>(missed),
      reviews: rows<DayReview>(reviews),
      customTags: (profile.data?.custom_tags as string[] | undefined) ?? [],
    };
  }

  private async put(table: string, id: string, data: unknown) {
    const uid = await userId();
    const { error } = await db().from(table).upsert({ id, user_id: uid, data });
    if (error) throw error;
  }
  private async del(table: string, ids: string[]) {
    if (ids.length === 0) return;
    const { error } = await db().from(table).delete().in("id", ids);
    if (error) throw error;
  }

  upsertTrade = (t: Trade) => this.put(TABLES.trade, t.id, t);
  async upsertTrades(ts: Trade[]) {
    if (ts.length === 0) return;
    const uid = await userId();
    const { error } = await db()
      .from(TABLES.trade)
      .upsert(ts.map((t) => ({ id: t.id, user_id: uid, data: t })));
    if (error) throw error;
  }
  deleteTrades = (ids: string[]) => this.del(TABLES.trade, ids);

  upsertAccount = (a: Account) => this.put(TABLES.account, a.id, a);
  deleteAccount = (id: string) => this.del(TABLES.account, [id]);

  upsertStrategy = (s: Strategy) => this.put(TABLES.strategy, s.id, s);
  deleteStrategy = (id: string) => this.del(TABLES.strategy, [id]);

  upsertMissed = (m: MissedTrade) => this.put(TABLES.missed, m.id, m);
  deleteMissed = (id: string) => this.del(TABLES.missed, [id]);

  upsertReview = (r: DayReview) => this.put(TABLES.review, r.id, r);
  deleteReview = (id: string) => this.del(TABLES.review, [id]);

  async setCustomTags(tags: string[]) {
    const uid = await userId();
    const { error } = await db().from("profiles").upsert({ user_id: uid, custom_tags: tags });
    if (error) throw error;
  }

  async replaceAll(snapshot: Snapshot) {
    await this.clearAll();
    const uid = await userId();
    const sb = db();
    const ins = async (table: string, items: { id: string }[]) => {
      if (items.length === 0) return;
      const { error } = await sb.from(table).upsert(items.map((it) => ({ id: it.id, user_id: uid, data: it })));
      if (error) throw error;
    };
    await Promise.all([
      ins(TABLES.account, snapshot.accounts),
      ins(TABLES.trade, snapshot.trades),
      ins(TABLES.strategy, snapshot.strategies),
      ins(TABLES.missed, snapshot.missed),
      ins(TABLES.review, snapshot.reviews),
      this.setCustomTags(snapshot.customTags),
    ]);
  }

  async clearAll() {
    const sb = db();
    const uid = await userId();
    // RLS already scopes to the user; the filter is belt-and-suspenders.
    await Promise.all(
      Object.values(TABLES).map((t) => sb.from(t).delete().eq("user_id", uid))
    );
    await sb.from("profiles").upsert({ user_id: uid, custom_tags: [] });
  }
}

// ── screenshot storage (Supabase Storage) ─────────────────────────────

function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, b64] = dataUrl.split(",");
  const mime = /:(.*?);/.exec(meta)?.[1] ?? "image/jpeg";
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

async function imagePath(id: string): Promise<string> {
  return `${await userId()}/${id}.jpg`;
}

export async function sbPutImage(id: string, dataUrl: string): Promise<void> {
  const { error } = await db().storage.from(SCREENSHOT_BUCKET).upload(await imagePath(id), dataUrlToBlob(dataUrl), {
    upsert: true,
    contentType: "image/jpeg",
  });
  if (error) throw error;
}

export async function sbGetImage(id: string): Promise<string | null> {
  const { data, error } = await db().storage.from(SCREENSHOT_BUCKET).createSignedUrl(await imagePath(id), 3600);
  if (error) return null;
  return data?.signedUrl ?? null;
}

export async function sbDeleteImage(id: string): Promise<void> {
  await db().storage.from(SCREENSHOT_BUCKET).remove([await imagePath(id)]);
}

export async function sbClearImages(): Promise<void> {
  const sb = db();
  const folder = await userId();
  const { data } = await sb.storage.from(SCREENSHOT_BUCKET).list(folder);
  if (data?.length) await sb.storage.from(SCREENSHOT_BUCKET).remove(data.map((f) => `${folder}/${f.name}`));
}

export const EMPTY = EMPTY_SNAPSHOT;
