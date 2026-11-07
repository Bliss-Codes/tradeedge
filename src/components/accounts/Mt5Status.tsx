"use client";

import { LinkState } from "@/lib/useMt5Links";

const STYLE: Record<LinkState, { label: string; cls: string; dot: string }> = {
  online: { label: "Connected", cls: "bg-pos/15 text-pos", dot: "bg-pos" },
  waiting: { label: "Waiting for MT5", cls: "bg-warn/15 text-warn", dot: "bg-warn animate-pulse" },
  offline: { label: "Offline", cls: "bg-warn/15 text-warn", dot: "bg-warn" },
  none: { label: "Not connected", cls: "bg-edge text-mute", dot: "bg-mute" },
};

export function Mt5StatusPill({ state }: { state: LinkState }) {
  const s = STYLE[state];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "—";
  const secs = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (secs < 60) return "just now";
  const m = Math.round(secs / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
}
