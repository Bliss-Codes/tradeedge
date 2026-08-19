"use client";

import { create } from "zustand";
import { Account, MissedTrade, Snapshot, Strategy, Trade, DayReview, EMPTY_SNAPSHOT, DEFAULT_TAGS, Profile, VIOLATIONS, EMOTIONS } from "@/lib/types";
import { backend } from "@/lib/data/backend";
import { buildSampleData } from "@/lib/data/sample";
import { supabase, isSupabaseEnabled } from "@/lib/supabase/client";
import { normalizeSnapshot, validateAccount, validateTrade } from "@/lib/integrity";

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
  setProfile: (patch: Partial<Profile>) => void;
  addCustomViolation: (v: string) => void;
  addCustomEmotion: (v: string) => void;

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
      const normalized = normalizeSnapshot(snap);
      set({ ...normalized.value, hydrated: true, syncError: normalized.errors.length ? normalized.errors.slice(0, 3).join(" ") : null });
    } catch {
      set({ hydrated: true });
    }
  },

  setSelectedAccount: (id) => set({ selectedAccountId: id }),
  setSearchOpen: (open) => set({ searchOpen: open }),

  addTrade: (t) => {
    const errors = validateTrade(t, get().accounts, get().strategies);
    if (errors.length) {
      set({ syncError: errors.join(" ") });
      return;
    }
    if (get().trades.some((x) => x.id === t.id)) {
      set({ syncError: `Trade ${t.id} already exists.` });
      return;
    }
    set((s) => ({ trades: [t, ...s.trades] }));
    reportSync(backend.upsertTrade(t));
  },
  updateTrade: (t) => {
    const errors = validateTrade(t, get().accounts, get().strategies);
    if (errors.length) {
      set({ syncError: errors.join(" ") });
      return;
    }
    if (!get().trades.some((x) => x.id === t.id)) {
      set({ syncError: `Cannot update missing trade ${t.id}.` });
      return;
    }
    set((s) => ({ trades: s.trades.map((x) => (x.id === t.id ? t : x)) }));
    reportSync(backend.upsertTrade(t));
  },
  deleteTrades: (ids) => {
    const drop = new Set(ids);
    set((s) => ({ trades: s.trades.filter((x) => !drop.has(x.id)) }));
    reportSync(backend.deleteTrades(ids));
  },
  importTrades: (ts) => {
    const existingIds = new Set(get().trades.map((x) => x.id));
    const seen = new Set<string>();
    const valid: Trade[] = [];
    const errors: string[] = [];
    for (const t of ts) {
      if (existingIds.has(t.id) || seen.has(t.id)) {
        errors.push(`Skipped duplicate trade ${t.id}.`);
        continue;
      }
      const tradeErrors = validateTrade(t, get().accounts, get().strategies);
      if (tradeErrors.length) {
        errors.push(...tradeErrors);
        continue;
      }
      seen.add(t.id);
      valid.push(t);
    }
    if (!valid.length) {
      if (errors.length) set({ syncError: errors.slice(0, 3).join(" ") });
      return;
    }
    set((s) => ({ trades: [...valid, ...s.trades], syncError: errors.length ? errors.slice(0, 3).join(" ") : null }));
    reportSync(backend.upsertTrades(valid));
  },

  addAccount: (a) => {
    const errors = validateAccount(a);
    if (errors.length) {
      set({ syncError: errors.join(" ") });
      return;
    }
    if (get().accounts.some((x) => x.id === a.id)) {
      set({ syncError: `Account ${a.id} already exists.` });
      return;
    }
    set((s) => ({ accounts: [...s.accounts, a] }));
    reportSync(backend.upsertAccount(a));
  },
  updateAccount: (a) => {
    const errors = validateAccount(a);
    if (errors.length) {
      set({ syncError: errors.join(" ") });
      return;
    }
    if (!get().accounts.some((x) => x.id === a.id)) {
      set({ syncError: `Cannot update missing account ${a.id}.` });
      return;
    }
    set((s) => ({ accounts: s.accounts.map((x) => (x.id === a.id ? a : x)) }));
    reportSync(backend.upsertAccount(a));
  },
  deleteAccount: (id) => {
    const account = get().accounts.find((a) => a.id === id);
    if (!account) {
      set({ syncError: `Cannot delete missing account ${id}.` });
      return;
    }
    const linkedTrades = get().trades.filter((t) => t.accountId === id).length;
    const linkedMissed = get().missed.filter((m) => m.accountId === id).length;
    if (linkedTrades || linkedMissed) {
      set({ syncError: `${account.name} has ${linkedTrades} trade${linkedTrades === 1 ? "" : "s"} and ${linkedMissed} missed setup${linkedMissed === 1 ? "" : "s"}. Archive it instead of deleting its history.` });
      return;
    }
    set((s) => ({
      accounts: s.accounts.filter((x) => x.id !== id),
      selectedAccountId: s.selectedAccountId === id ? "all" : s.selectedAccountId,
    }));
    reportSync(backend.deleteAccount(id));
  },

  addStrategy: (st) => {
    if (!st.id || !st.name.trim()) {
      set({ syncError: "Strategy requires a valid id and name." });
      return;
    }
    if (get().strategies.some((x) => x.id === st.id)) {
      set({ syncError: `Strategy ${st.id} already exists.` });
      return;
    }
    set((s) => ({ strategies: [...s.strategies, st] }));
    reportSync(backend.upsertStrategy(st));
  },
  updateStrategy: (st) => {
    set((s) => ({ strategies: s.strategies.map((x) => (x.id === st.id ? st : x)) }));
    reportSync(backend.upsertStrategy(st));
  },
  deleteStrategy: (id) => {
    const strategy = get().strategies.find((s) => s.id === id);
    if (!strategy) {
      set({ syncError: `Cannot delete missing strategy ${id}.` });
      return;
    }
    const linkedTrades = get().trades.filter((t) => t.strategyId === id).length;
    if (linkedTrades) {
      set({ syncError: `${strategy.name} has ${linkedTrades} historical trade${linkedTrades === 1 ? "" : "s"}. Archive it instead of deleting its history.` });
      return;
    }
    set((s) => ({ strategies: s.strategies.filter((x) => x.id !== id) }));
    reportSync(backend.deleteStrategy(id));
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

  setProfile: (patch) => {
    const next = { ...(get().profile ?? {}), ...patch };
    set({ profile: next });
    reportSync(backend.setProfile(next));
  },

  addCustomViolation: (v) => {
    const clean = v.trim();
    if (!clean) return;
    const existing = get().customViolations ?? [];
    if (existing.includes(clean) || (VIOLATIONS as readonly string[]).includes(clean)) return;
    const next = [...existing, clean];
    set({ customViolations: next });
    reportSync(backend.setProfile({ ...(get().profile ?? {}), customViolations: next }));
  },

  addCustomEmotion: (v) => {
    const clean = v.trim();
    if (!clean) return;
    const existing = get().customEmotions ?? [];
    if (existing.includes(clean) || (EMOTIONS as readonly string[]).includes(clean)) return;
    const next = [...existing, clean];
    set({ customEmotions: next });
    reportSync(backend.setProfile({ ...(get().profile ?? {}), customEmotions: next }));
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
    const snap = normalizeSnapshot(buildSampleData()).value;
    set({ ...snap, selectedAccountId: "all", syncError: null });
    reportSync(backend.replaceAll(snap));
  },

  restoreBackup: (snap) => {
    const normalized = normalizeSnapshot(snap);
    set({ ...normalized.value, selectedAccountId: "all", syncError: normalized.errors.length ? normalized.errors.slice(0, 3).join(" ") : null });
    reportSync(backend.replaceAll(normalized.value));
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
/**
 * Capital stage. Challenge P&L is NOTIONAL — you never receive it, and it is
 * usually traded at a different risk %, so mixing it with funded money makes
 * the equity curve and every money stat meaningless. Funded P&L is the only
 * thing that converts to payouts.
 */
export type CapitalStage = "all" | "funded" | "challenge";

export function stageOf(type: Account["type"]): CapitalStage | "other" {
  if (type === "Funded") return "funded";
  if (type === "Challenge") return "challenge";
  return "other";
}

export function useVisibleTrades(type: Trade["type"] = "live", stage: CapitalStage = "all"): Trade[] {
  const trades = useApp((s) => s.trades);
  const accounts = useApp((s) => s.accounts);
  const selected = useApp((s) => s.selectedAccountId);
  const effective = selected === "all" || accounts.some((a) => a.id === selected) ? selected : "all";
  const active = accounts.filter((a) => !a.archived);
  const activeIds = new Set(active.map((a) => a.id));
  const stageOk = (accountId: string) => {
    if (stage === "all") return true;
    const acct = active.find((a) => a.id === accountId);
    return acct ? stageOf(acct.type) === stage : false;
  };
  return trades.filter(
    (t) =>
      t.type === type &&
      (effective === "all" ? activeIds.has(t.accountId) : t.accountId === effective) &&
      stageOk(t.accountId)
  );
}

export function useAllTags(): string[] {
  const custom = useApp((s) => s.customTags);
  const trades = useApp((s) => s.trades);
  const used = new Set<string>([...DEFAULT_TAGS, ...custom]);
  trades.forEach((t) => t.tags.forEach((tag) => used.add(tag)));
  return Array.from(used).sort();
}
