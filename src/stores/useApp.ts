"use client";

import { create } from "zustand";
import { Account, MissedTrade, Snapshot, Strategy, Trade, DayReview, EMPTY_SNAPSHOT, DEFAULT_TAGS } from "@/lib/types";
import { backend } from "@/lib/data/backend";
import { buildSampleData } from "@/lib/data/sample";
import { supabase, isSupabaseEnabled } from "@/lib/supabase/client";

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export interface AuthUser {
  id: string;
  email: string | null;
}

interface AppState extends Snapshot {
  hydrated: boolean;
  syncError: string | null;
  clearSyncError: () => void;
  selectedAccountId: string; // "all" or an account id
  searchOpen: boolean;

  // auth (only meaningful when Supabase is enabled)
  cloud: boolean;
  authReady: boolean;
  user: AuthUser | null;

  initAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;

  hydrate: () => Promise<void>;
  setSelectedAccount: (id: string) => void;
  setSearchOpen: (open: boolean) => void;

  addTrade: (t: Trade) => void;
  updateTrade: (t: Trade) => void;
  deleteTrades: (ids: string[]) => void;
  importTrades: (ts: Trade[]) => void;

  addAccount: (a: Account) => void;
  updateAccount: (a: Account) => void;
  deleteAccount: (id: string) => void;

  addStrategy: (s: Strategy) => void;
  updateStrategy: (s: Strategy) => void;
  deleteStrategy: (id: string) => void;

  addMissed: (m: MissedTrade) => void;
  updateMissed: (m: MissedTrade) => void;
  deleteMissed: (id: string) => void;

  upsertReview: (r: DayReview) => void;
  deleteReview: (id: string) => void;

  addCustomTag: (tag: string) => void;

  loadSampleData: () => void;
  restoreBackup: (s: Snapshot) => void;
  clearAll: () => Promise<void>;
}

/** Fire-and-forget cloud writes: log + surface failures instead of swallowing them. */
function reportSync(p: Promise<unknown>) {
  p.catch((e: unknown) => {
    const msg = e instanceof Error ? e.message : "Cloud save failed";
    console.error("TradeEdge cloud sync failed:", e);
    useApp.setState({ syncError: msg });
  });
}

export const useApp = create<AppState>((set, get) => ({
  ...EMPTY_SNAPSHOT,
  hydrated: false,
  syncError: null,
  clearSyncError: () => set({ syncError: null }),
  selectedAccountId: "all",
  searchOpen: false,

  cloud: isSupabaseEnabled,
  authReady: !isSupabaseEnabled,
  user: null,

  initAuth: async () => {
    if (!isSupabaseEnabled || !supabase) {
      set({ authReady: true });
      return;
    }
    const { data } = await supabase.auth.getUser();
    set({
      user: data.user ? { id: data.user.id, email: data.user.email ?? null } : null,
      authReady: true,
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ? { id: session.user.id, email: session.user.email ?? null } : null;
      const had = get().user?.id;
      set({ user: u });
      if (u && u.id !== had) {
        set({ hydrated: false });
        void get().hydrate();
      }
      if (!u) {
        set({ ...EMPTY_SNAPSHOT, selectedAccountId: "all", hydrated: false });
      }
    });
  },

  signIn: async (email, password) => {
    if (!supabase) return "Supabase is not configured.";
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  },
  signUp: async (email, password) => {
    if (!supabase) return "Supabase is not configured.";
    const { error } = await supabase.auth.signUp({ email, password });
    return error ? error.message : null;
  },
  signOut: async () => {
    if (supabase) await supabase.auth.signOut();
  },

  hydrate: async () => {
    if (isSupabaseEnabled && !get().user) {
      set({ hydrated: true });
      return;
    }
    try {
      const snap = await backend.fetchAll();
      set({ ...EMPTY_SNAPSHOT, ...snap, hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },

  setSelectedAccount: (id) => set({ selectedAccountId: id }),
  setSearchOpen: (open) => set({ searchOpen: open }),

  addTrade: (t) => {
    set((s) => ({ trades: [t, ...s.trades] }));
    reportSync(backend.upsertTrade(t));
  },
  updateTrade: (t) => {
    set((s) => ({ trades: s.trades.map((x) => (x.id === t.id ? t : x)) }));
    reportSync(backend.upsertTrade(t));
  },
  deleteTrades: (ids) => {
    const drop = new Set(ids);
    set((s) => ({ trades: s.trades.filter((x) => !drop.has(x.id)) }));
    reportSync(backend.deleteTrades(ids));
  },
  importTrades: (ts) => {
    set((s) => ({ trades: [...ts, ...s.trades] }));
    reportSync(backend.upsertTrades(ts));
  },

  addAccount: (a) => {
    set((s) => ({ accounts: [...s.accounts, a] }));
    reportSync(backend.upsertAccount(a));
  },
  updateAccount: (a) => {
    set((s) => ({ accounts: s.accounts.map((x) => (x.id === a.id ? a : x)) }));
    reportSync(backend.upsertAccount(a));
  },
  deleteAccount: (id) => {
    const removedTradeIds = get().trades.filter((t) => t.accountId === id).map((t) => t.id);
    set((s) => ({
      accounts: s.accounts.filter((x) => x.id !== id),
      trades: s.trades.filter((t) => t.accountId !== id),
      selectedAccountId: s.selectedAccountId === id ? "all" : s.selectedAccountId,
    }));
    reportSync(backend.deleteTrades(removedTradeIds));
    reportSync(backend.deleteAccount(id));
  },

  addStrategy: (st) => {
    set((s) => ({ strategies: [...s.strategies, st] }));
    reportSync(backend.upsertStrategy(st));
  },
  updateStrategy: (st) => {
    set((s) => ({ strategies: s.strategies.map((x) => (x.id === st.id ? st : x)) }));
    reportSync(backend.upsertStrategy(st));
  },
  deleteStrategy: (id) => {
    const changed = get()
      .trades.filter((t) => t.strategyId === id)
      .map((t) => ({ ...t, strategyId: undefined }));
    set((s) => ({
      strategies: s.strategies.filter((x) => x.id !== id),
      trades: s.trades.map((t) => (t.strategyId === id ? { ...t, strategyId: undefined } : t)),
    }));
    reportSync(backend.deleteStrategy(id));
    if (changed.length) reportSync(backend.upsertTrades(changed));
  },

  addMissed: (m) => {
    set((s) => ({ missed: [m, ...s.missed] }));
    reportSync(backend.upsertMissed(m));
  },
  updateMissed: (m) => {
    set((s) => ({ missed: s.missed.map((x) => (x.id === m.id ? m : x)) }));
    reportSync(backend.upsertMissed(m));
  },
  deleteMissed: (id) => {
    set((s) => ({ missed: s.missed.filter((x) => x.id !== id) }));
    reportSync(backend.deleteMissed(id));
  },

  upsertReview: (r) => {
    const stamped = { ...r, updatedAt: new Date().toISOString() };
    set((s) => {
      const exists = s.reviews.some((x) => x.id === r.id || x.date === r.date);
      return {
        reviews: exists
          ? s.reviews.map((x) => (x.id === r.id || x.date === r.date ? stamped : x))
          : [stamped, ...s.reviews],
      };
    });
    reportSync(backend.upsertReview(stamped));
  },
  deleteReview: (id) => {
    set((s) => ({ reviews: s.reviews.filter((x) => x.id !== id) }));
    reportSync(backend.deleteReview(id));
  },

  addCustomTag: (tag) => {
    const clean = tag.trim();
    if (!clean) return;
    if (get().customTags.includes(clean) || DEFAULT_TAGS.includes(clean)) return;
    const next = [...get().customTags, clean];
    set({ customTags: next });
    reportSync(backend.setCustomTags(next));
  },

  loadSampleData: () => {
    const snap = buildSampleData();
    set({ ...snap, selectedAccountId: "all" });
    reportSync(backend.replaceAll(snap));
  },

  restoreBackup: (snap) => {
    const full = { ...EMPTY_SNAPSHOT, ...snap };
    set({ ...full, selectedAccountId: "all" });
    reportSync(backend.replaceAll(full));
  },

  clearAll: async () => {
    set({ ...EMPTY_SNAPSHOT, selectedAccountId: "all" });
    await backend.clearAll();
  },
}));

// ── selectors ─────────────────────────────────────────────────────────

/** Currency to display aggregate money in: the selected account's, else the first active account's. */
export function useDisplayCurrency(): string {
  const accounts = useApp((s) => s.accounts);
  const selected = useApp((s) => s.selectedAccountId);
  if (selected !== "all") {
    const a = accounts.find((x) => x.id === selected);
    if (a) return a.currency;
  }
  return accounts.filter((a) => !a.archived)[0]?.currency ?? "USD";
}

/** Trades visible under the global account selector (live trades only). */
export function useVisibleTrades(type: Trade["type"] = "live"): Trade[] {
  const trades = useApp((s) => s.trades);
  const accounts = useApp((s) => s.accounts);
  const selected = useApp((s) => s.selectedAccountId);
  const effective = selected === "all" || accounts.some((a) => a.id === selected) ? selected : "all";
  const activeIds = new Set(accounts.filter((a) => !a.archived).map((a) => a.id));
  return trades.filter(
    (t) =>
      t.type === type &&
      (effective === "all" ? activeIds.has(t.accountId) : t.accountId === effective)
  );
}

export function useAllTags(): string[] {
  const custom = useApp((s) => s.customTags);
  const trades = useApp((s) => s.trades);
  const used = new Set<string>([...DEFAULT_TAGS, ...custom]);
  trades.forEach((t) => t.tags.forEach((tag) => used.add(tag)));
  return Array.from(used).sort();
}
