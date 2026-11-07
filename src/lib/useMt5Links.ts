"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useApp } from "@/stores/useApp";

export interface Mt5Link {
  token: string;
  account_id: string;
  revoked: boolean;
  created_at: string;
  last_seen: string | null;
  login: string | null;
  server: string | null;
  balance: number | null;
}

/** The EA pings every minute; no ping for 3 minutes means MT5 or the EA is off. */
export const ONLINE_MS = 3 * 60 * 1000;

export type LinkState = "none" | "waiting" | "online" | "offline";

export function linkState(l: Mt5Link | undefined): LinkState {
  if (!l || l.revoked) return "none";
  if (!l.last_seen) return "waiting";
  return Date.now() - new Date(l.last_seen).getTime() <= ONLINE_MS ? "online" : "offline";
}

/** Live list of this user's MT5 links (cloud mode only). Polls while mounted. */
export function useMt5Links(intervalMs = 15000) {
  const user = useApp((s) => s.user);
  const [links, setLinks] = useState<Mt5Link[]>([]);
  const [error, setError] = useState<string | null>(null);
  const available = Boolean(supabase && user);

  const refresh = useCallback(async () => {
    if (!supabase || !user) return;
    const { data, error: err } = await supabase.from("mt5_links").select("*").order("created_at", { ascending: false });
    if (err) {
      setError(err.message.includes("mt5_links") ? "Run supabase/20261104_mt5_links.sql in the Supabase SQL editor first." : err.message);
      return;
    }
    setError(null);
    setLinks((data ?? []) as Mt5Link[]);
  }, [user]);

  useEffect(() => {
    void refresh();
    if (!available) return;
    const id = setInterval(() => void refresh(), intervalMs);
    return () => clearInterval(id);
  }, [refresh, available, intervalMs]);

  /** Newest active link per account. */
  const byAccount = useMemo(() => {
    const m = new Map<string, Mt5Link>();
    for (const l of links) if (!l.revoked && !m.has(l.account_id)) m.set(l.account_id, l);
    return m;
  }, [links]);

  return { links, byAccount, refresh, available, error };
}
