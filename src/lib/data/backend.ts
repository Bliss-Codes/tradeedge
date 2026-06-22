"use client";

import { Account, DayReview, MissedTrade, Snapshot, Strategy, Trade, EMPTY_SNAPSHOT } from "@/lib/types";
import { isSupabaseEnabled } from "@/lib/supabase/client";
import { SupabaseBackend } from "@/lib/supabase/backend";

/**
 * The single seam between TradeEdge and storage. Granular per-entity
 * operations so a real backend writes one row per change instead of the
 * whole dataset every time.
 *
 * - LocalBackend keeps the original localStorage behavior (no account needed).
 * - SupabaseBackend persists per-user rows in Postgres with RLS.
 *
 * The store never imports either implementation directly — it uses `backend`.
 */
export interface Backend {
  fetchAll(): Promise<Snapshot>;

  upsertTrade(t: Trade): Promise<void>;
  upsertTrades(ts: Trade[]): Promise<void>;
  deleteTrades(ids: string[]): Promise<void>;

  upsertAccount(a: Account): Promise<void>;
  deleteAccount(id: string): Promise<void>;

  upsertStrategy(s: Strategy): Promise<void>;
  deleteStrategy(id: string): Promise<void>;

  upsertMissed(m: MissedTrade): Promise<void>;
  deleteMissed(id: string): Promise<void>;

  upsertReview(r: DayReview): Promise<void>;
  deleteReview(id: string): Promise<void>;

  setCustomTags(tags: string[]): Promise<void>;

  replaceAll(snapshot: Snapshot): Promise<void>; // sample load / backup restore
  clearAll(): Promise<void>;
}

const KEY = "tradeedge.v1";

class LocalBackend implements Backend {
  private read(): Snapshot {
    if (typeof window === "undefined") return { ...EMPTY_SNAPSHOT };
    try {
      const raw = window.localStorage.getItem(KEY);
      return raw ? { ...EMPTY_SNAPSHOT, ...JSON.parse(raw) } : { ...EMPTY_SNAPSHOT };
    } catch {
      return { ...EMPTY_SNAPSHOT };
    }
  }
  private write(s: Snapshot) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KEY, JSON.stringify(s));
  }
  private mutate(fn: (s: Snapshot) => void) {
    const s = this.read();
    fn(s);
    this.write(s);
  }

  async fetchAll() {
    return this.read();
  }
  async upsertTrade(t: Trade) {
    this.mutate((s) => {
      const i = s.trades.findIndex((x) => x.id === t.id);
      if (i >= 0) s.trades[i] = t;
      else s.trades.unshift(t);
    });
  }
  async upsertTrades(ts: Trade[]) {
    this.mutate((s) => {
      const byId = new Map(ts.map((t) => [t.id, t]));
      s.trades = s.trades.map((x) => byId.get(x.id) ?? x);
      const existing = new Set(s.trades.map((x) => x.id));
      s.trades = [...ts.filter((t) => !existing.has(t.id)), ...s.trades];
    });
  }
  async deleteTrades(ids: string[]) {
    const drop = new Set(ids);
    this.mutate((s) => {
      s.trades = s.trades.filter((x) => !drop.has(x.id));
    });
  }
  async upsertAccount(a: Account) {
    this.mutate((s) => {
      const i = s.accounts.findIndex((x) => x.id === a.id);
      if (i >= 0) s.accounts[i] = a;
      else s.accounts.push(a);
    });
  }
  async deleteAccount(id: string) {
    this.mutate((s) => {
      s.accounts = s.accounts.filter((x) => x.id !== id);
    });
  }
  async upsertStrategy(st: Strategy) {
    this.mutate((s) => {
      const i = s.strategies.findIndex((x) => x.id === st.id);
      if (i >= 0) s.strategies[i] = st;
      else s.strategies.push(st);
    });
  }
  async deleteStrategy(id: string) {
    this.mutate((s) => {
      s.strategies = s.strategies.filter((x) => x.id !== id);
    });
  }
  async upsertMissed(m: MissedTrade) {
    this.mutate((s) => {
      const i = s.missed.findIndex((x) => x.id === m.id);
      if (i >= 0) s.missed[i] = m;
      else s.missed.unshift(m);
    });
  }
  async deleteMissed(id: string) {
    this.mutate((s) => {
      s.missed = s.missed.filter((x) => x.id !== id);
    });
  }
  async upsertReview(r: DayReview) {
    this.mutate((s) => {
      const i = s.reviews.findIndex((x) => x.id === r.id || x.date === r.date);
      if (i >= 0) s.reviews[i] = r;
      else s.reviews.unshift(r);
    });
  }
  async deleteReview(id: string) {
    this.mutate((s) => {
      s.reviews = s.reviews.filter((x) => x.id !== id);
    });
  }
  async setCustomTags(tags: string[]) {
    this.mutate((s) => {
      s.customTags = tags;
    });
  }
  async replaceAll(snapshot: Snapshot) {
    this.write({ ...EMPTY_SNAPSHOT, ...snapshot });
  }
  async clearAll() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(KEY);
  }
}

export const backend: Backend = isSupabaseEnabled ? new SupabaseBackend() : new LocalBackend();
