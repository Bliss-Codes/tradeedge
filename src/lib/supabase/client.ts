"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True only when both env vars are present, i.e. the app should run on Supabase. */
export const isSupabaseEnabled = Boolean(url && anonKey);

/**
 * The Supabase client, or null when the app is running in local mode.
 * Everything that touches `supabase` must null-check or be gated behind
 * `isSupabaseEnabled`, so a missing config never crashes the local build.
 */
export const supabase: SupabaseClient | null = isSupabaseEnabled
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

export const SCREENSHOT_BUCKET = "screenshots";
