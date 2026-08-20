"use client";

import { Account, DayReview, MissedTrade, Snapshot, Strategy, Trade, EMPTY_SNAPSHOT, Profile } from "@/lib/types";
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
      sb.from("profiles").select("custom_tags, profile").maybeSingle(),
    ]);
    const rows = <T,>(name: string, r: { data: { data: T }[] | null; error: { message?: string } | null }) => {
      if (r.error) throw new Error(`Failed to load ${name}: ${r.error.message ?? "Supabase query failed"}`);
      return (r.data ?? []).map((x) => x.data);
    };
    if (profile.error) {
      throw new Error(`Failed to load profile: ${profile.error.message ?? "Supabase query failed"}`);
    }
    return {
      accounts: rows<Account>("accounts", accounts),
      trades: rows<Trade>("trades", trades),
      strategies: rows<Strategy>("strategies", strategies),
      missed: rows<MissedTrade>("missed trades", missed),
      reviews: rows<DayReview>("day reviews", reviews),
      customTags: (profile.data?.custom_tags as string[] | undefined) ?? [],
      customViolations: ((profile.data?.profile as Profile | undefined)?.customViolations as string[] | undefined) ?? [],
      customEmotions: ((profile.data?.profile as Profile | undefined)?.customEmotions as string[] | undefined) ?? [],
      profile: (profile.data?.profile as Profile | undefined) ?? {},
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

  async setProfile(profile: Profile) {
    const uid = await userId();
    const { error } = await db().from("profiles").upsert({ user_id: uid, profile });
    if (error) throw error;
  }

  async replaceAll(snapshot: Snapshot) {
    // Replace is an explicit destructive operation (sample load / backup restore).
    // Write the incoming snapshot first, then remove records that are no longer present.
    // This avoids turning a failed insert into an empty account.
    const uid = await userId();
    const sb = db();
    const itemsByTable: Record<string, { id: string }[]> = {
      [TABLES.account]: snapshot.accounts,
      [TABLES.trade]: snapshot.trades,
      [TABLES.strategy]: snapshot.strategies,
      [TABLES.missed]: snapshot.missed,
      [TABLES.review]: snapshot.reviews,
    };

    for (const [table, items] of Object.entries(itemsByTable)) {
      if (items.length === 0) continue;
      const { error } = await sb.from(table).upsert(items.map((it) => ({ id: it.id, user_id: uid, data: it })));
      if (error) throw error;
    }

    const incomingIds = new Set<string>();
    for (const [table, items] of Object.entries(itemsByTable)) {
      items.forEach((it) => incomingIds.add(`${table}:${it.id}`));
      const { data: existing, error } = await sb.from(table).select("id");
      if (error) throw error;
      const stale = (existing ?? []).map((x: { id: string }) => x.id).filter((id: string) => !incomingIds.has(`${table}:${id}`));
      if (stale.length) {
        const { error: deleteError } = await sb.from(table).delete().in("id", stale);
        if (deleteError) throw deleteError;
      }
    }

    await this.setCustomTags(snapshot.customTags);
    await this.setProfile(snapshot.profile ?? {});
  }

  async clearAll() {
    const sb = db();
    const uid = await userId();
    const results = await Promise.all(
      Object.values(TABLES).map((t) => sb.from(t).delete().eq("user_id", uid))
    );
    const failed = results.find((r: { error: unknown }) => r.error);
    if (failed?.error) throw failed.error;
    const { error: profileError } = await sb.from("profiles").upsert({ user_id: uid, custom_tags: [], profile: {} });
    if (profileError) throw profileError;
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
