"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/stores/useApp";
import { Modal } from "@/components/ui/primitives";
import { fmtR } from "@/lib/metrics";
import { AuthScreen } from "@/components/layout/AuthScreen";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const NAV_GROUPS: { heading: string; items: { href: string; label: string; icon: string }[] }[] = [
  {
    heading: "Menu",
    items: [
      { href: "/", label: "Dashboard", icon: "M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z" },
      { href: "/journal", label: "Journal", icon: "M4 4h16v16H4z M8 8h8 M8 12h8 M8 16h5" },
      { href: "/analytics", label: "Analytics", icon: "M4 20V10 M10 20V4 M16 20v-7 M22 20H2" },
    ],
  },
  {
    heading: "Trading",
    items: [
      { href: "/challenge", label: "Challenge", icon: "M12 22a10 10 0 100-20 10 10 0 000 20z M12 18a6 6 0 100-12 6 6 0 000 12z M12 14a2 2 0 100-4 2 2 0 000 4z" },
      { href: "/calculator", label: "Calculator", icon: "M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z M7 7h10 M7 12h.01 M12 12h.01 M17 12h.01 M7 16h.01 M12 16h.01 M17 16h.01" },
      { href: "/backtesting", label: "Backtesting", icon: "M12 8v4l3 3 M21 12a9 9 0 11-9-9c2.5 0 4.8 1 6.4 2.6L21 8" },
      { href: "/accounts", label: "Accounts", icon: "M21 12V7H5a2 2 0 010-4h14v4 M3 5v14a2 2 0 002 2h16v-5 M18 12a2 2 0 000 4h4v-4h-4z" },
      { href: "/strategies", label: "Strategies", icon: "M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" },
    ],
  },
  {
    heading: "Review",
    items: [
      { href: "/psychology", label: "Psychology", icon: "M9.5 2a5.5 5.5 0 00-5.5 5.5c0 1.6.7 3 1.8 4A5.5 5.5 0 009 21h6a5.5 5.5 0 003.2-9.5c1.1-1 1.8-2.4 1.8-4A5.5 5.5 0 0014.5 2c-1 0-1.9.3-2.5.7A4.5 4.5 0 009.5 2z" },
      { href: "/decisions", label: "Decisions", icon: "M9 11l3 3 8-8 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h9" },
      { href: "/reviews", label: "Reviews", icon: "M4 4h16v16H4z M9 9h6 M9 13h6 M9 17h4" },
      { href: "/settings", label: "Settings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" },
    ],
  },
];
const NAV = NAV_GROUPS.flatMap((g) => g.items);

function Icon({ d }: { d: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {d.split(" M").map((seg, i) => (
        <path key={i} d={(i === 0 ? "" : "M") + seg} />
      ))}
    </svg>
  );
}


/** Sidebar profile: avatar, name, plan chip, preset avatars and photo upload. */
function SidebarProfile() {
  const profile = useApp((s) => s.profile);
  const setProfile = useApp((s) => s.setProfile);
  const user = useApp((s) => s.user);
  const accounts = useApp((s) => s.accounts);
  const [editing, setEditing] = useState(false);
  const [avatarMenu, setAvatarMenu] = useState(false);
  const [draft, setDraft] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const name = profile?.displayName?.trim() || user?.email?.split("@")[0] || "Trader";
  const funded = accounts.filter((a) => !a.archived && a.type === "Funded").length;
  const chip = funded > 0 ? `${funded} funded` : "Free";

  const presetAvatars = [
    { id: "emerald", label: "Emerald", src: "/avatars/emerald.svg" },
    { id: "cobalt", label: "Cobalt", src: "/avatars/cobalt.svg" },
    { id: "violet", label: "Violet", src: "/avatars/violet.svg" },
    { id: "amber", label: "Amber", src: "/avatars/amber.svg" },
    { id: "rose", label: "Rose", src: "/avatars/rose.svg" },
    { id: "teal", label: "Teal", src: "/avatars/teal.svg" },
    { id: "gold", label: "Gold", src: "/avatars/gold.svg" },
    { id: "navy", label: "Navy", src: "/avatars/navy.svg" },
  ];

  const pickAvatar = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile({ avatarDataUrl: String(reader.result) });
      setAvatarMenu(false);
    };
    reader.readAsDataURL(file);
  };

  const choosePreset = (id: string) => {
    setProfile({ avatarDataUrl: `preset:${id}` });
    setAvatarMenu(false);
  };

  const preset = profile?.avatarDataUrl?.startsWith("preset:")
    ? presetAvatars.find((a) => a.id === profile.avatarDataUrl?.slice(7))
    : undefined;

  return (
    <div className="sidebar-profile border-b border-edge px-5 pb-5">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <button
            onClick={() => setAvatarMenu((v) => !v)}
            className="group relative h-[68px] w-[68px] overflow-hidden rounded-full border border-edge bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md"
            title="Change avatar"
            aria-label="Change avatar"
            aria-expanded={avatarMenu}
          >
            {profile?.avatarDataUrl?.startsWith("data:image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarDataUrl} alt={name} className="h-full w-full object-cover" />
            ) : preset ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preset.src} alt={preset.label} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-lg font-semibold text-mute">
                {name.slice(0, 2).toUpperCase()}
              </span>
            )}
            <span className="absolute inset-0 flex items-end justify-center bg-black/0 pb-1 text-[9px] font-medium text-white opacity-0 transition-opacity group-hover:bg-black/45 group-hover:opacity-100">
              Change
            </span>
          </button>

          <span className="absolute -right-2 -top-1 rounded-full bg-accent px-2 py-0.5 text-[9px] font-semibold text-bg shadow-sm">
            {chip}
          </span>

          {avatarMenu && (
            <div className="avatar-picker absolute left-1/2 top-[78px] z-50 w-64 -translate-x-1/2 rounded-2xl border border-edge bg-card p-3 text-left shadow-2xl">
              <div className="mb-2 px-1">
                <div className="text-xs font-semibold text-ink">Profile avatar</div>
                <div className="text-[10px] text-mute">Choose an avatar or upload your own photo.</div>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {presetAvatars.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => choosePreset(a.id)}
                    title={a.label}
                    className="h-9 w-9 overflow-hidden rounded-full ring-1 ring-edge transition-transform hover:scale-110 hover:ring-accent/60"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.src} alt={a.label} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="my-3 h-px bg-edge" />

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center gap-2.5 rounded-xl border border-edge bg-surface px-3 py-2 text-xs font-medium text-ink transition-colors hover:border-accent/40 hover:bg-accent/5"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent">↑</span>
                <span>
                  <span className="block">Upload photo</span>
                  <span className="block text-[9px] font-normal text-mute">JPG, PNG or WebP · max 1 MB</span>
                </span>
              </button>

              {profile?.avatarDataUrl && (
                <button
                  type="button"
                  onClick={() => { setProfile({ avatarDataUrl: undefined }); setAvatarMenu(false); }}
                  className="mt-2 w-full rounded-lg px-2 py-1.5 text-[10px] text-mute hover:bg-neg/5 hover:text-neg"
                >
                  Remove avatar
                </button>
              )}
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              pickAvatar(e.target.files?.[0]);
              e.currentTarget.value = "";
            }}
          />
        </div>

        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => { setProfile({ displayName: draft.trim() || undefined }); setEditing(false); }}
            onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
            className="mt-2.5 w-full rounded-lg border border-edge bg-surface px-2 py-1 text-center text-sm text-ink outline-none"
          />
        ) : (
          <button
            onClick={() => { setDraft(profile?.displayName ?? ""); setEditing(true); }}
            className="mt-2.5 max-w-full truncate text-sm font-semibold text-ink hover:text-accent"
            title="Rename"
          >
            {name}
          </button>
        )}
        {user?.email && <div className="mt-0.5 max-w-full truncate text-[10px] text-mute">{user.email}</div>}
      </div>
    </div>
  );
}
function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="app-sidebar fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-edge lg:flex">
      <div className="brand-row flex items-center gap-3 px-5 py-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="TradeEdge" className="brand-logo h-9 w-9 rounded-xl object-cover" />
        <div>
          <div className="text-sm font-semibold tracking-tight text-ink">TradeEdge</div>
          <div className="text-[10px] uppercase tracking-widest text-mute">Journal &amp; Analytics</div>
        </div>
      </div>
      <SidebarProfile />
      <nav className="sidebar-nav flex-1 space-y-5 overflow-y-auto px-3 pb-4 pt-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.heading}>
            <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-mute/70">{group.heading}</div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 ${
                      active ? "nav-item-active bg-accent text-bg shadow-[0_8px_22px_-10px_rgb(var(--accent)/0.65)]" : "text-sub hover:bg-surface hover:text-ink"
                    }`}
                  >
                    <Icon d={item.icon} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="sidebar-footer px-3 pb-4">
        <div className="sidebar-quick rounded-2xl p-4 text-bg" style={{ background: "linear-gradient(135deg, rgb(var(--ink)), rgb(var(--ink)/0.85))" }}>
          <div className="text-sm font-semibold" style={{ color: "rgb(var(--card))" }}>Log faster</div>
          <div className="mt-0.5 text-[11px]" style={{ color: "rgb(var(--mute))" }}>Record a trade in a few taps.</div>
          <Link href="/journal?new=1" className="mt-3 flex items-center justify-center rounded-xl bg-accent px-3 py-1.5 text-xs font-semibold text-bg">
            + New trade
          </Link>
        </div>
      </div>
    </aside>
  );
}

function AccountSelector() {
  const accounts = useApp((s) => s.accounts);
  const selected = useApp((s) => s.selectedAccountId);
  const setSelected = useApp((s) => s.setSelectedAccount);

  // Keep the control honest: if the selected account vanished, snap back to All.
  useEffect(() => {
    if (selected !== "all" && !accounts.some((a) => a.id === selected)) {
      setSelected("all");
    }
  }, [selected, accounts, setSelected]);

  const value = selected !== "all" && accounts.some((a) => a.id === selected) ? selected : "all";
  const active = accounts.filter((a) => !a.archived);
  const archived = accounts.filter((a) => a.archived);
  return (
    <select
      value={value}
      onChange={(e) => setSelected(e.target.value)}
      className="rounded-xl border border-edge bg-card px-3 py-2 text-sm text-ink focus:border-accent/60 focus:outline-none"
      aria-label="Account"
    >
      <option value="all">All accounts (active)</option>
      {active.map((a) => (
        <option key={a.id} value={a.id}>
          {a.name}
        </option>
      ))}
      {archived.length > 0 && (
        <optgroup label="Archived">
          {archived.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </optgroup>
      )}
    </select>
  );
}

function GlobalSearch() {
  const open = useApp((s) => s.searchOpen);
  const setOpen = useApp((s) => s.setSearchOpen);
  const trades = useApp((s) => s.trades);
  const strategies = useApp((s) => s.strategies);
  const accounts = useApp((s) => s.accounts);
  const [q, setQ] = useState("");
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return null;
    const has = (s?: string) => (s ?? "").toLowerCase().includes(needle);
    return {
      trades: trades
        .filter((t) => has(t.pair) || has(t.notes) || has(t.thesis) || has(t.lessons) || t.tags.some((tag) => has(tag)))
        .slice(0, 8),
      strategies: strategies.filter((s) => has(s.name) || has(s.description) || s.tags.some((t) => has(t))).slice(0, 5),
      accounts: accounts.filter((a) => has(a.name) || has(a.broker) || has(a.propFirm)).slice(0, 5),
    };
  }, [q, trades, strategies, accounts]);

  const go = (path: string) => {
    setOpen(false);
    setQ("");
    router.push(path);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Search">
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search trades, strategies, accounts, tags, notes…"
        className="w-full rounded-xl border border-edge bg-surface px-4 py-3 text-sm text-ink placeholder:text-mute focus:border-accent/60 focus:outline-none"
      />
      {results && (
        <div className="mt-4 max-h-80 space-y-4 overflow-y-auto">
          {results.trades.length > 0 && (
            <div>
              <div className="mb-1 text-xs uppercase tracking-wider text-mute">Trades</div>
              {results.trades.map((t) => (
                <button key={t.id} onClick={() => go(`/journal?trade=${t.id}`)} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-sub hover:bg-surface">
                  <span>
                    <span className="font-medium text-ink">{t.pair}</span> · {t.direction} · {new Date(t.date).toLocaleDateString()}
                  </span>
                  <span className={`font-mono ${t.rr >= 0 ? "text-pos" : "text-neg"}`}>{fmtR(t.rr)}</span>
                </button>
              ))}
            </div>
          )}
          {results.strategies.length > 0 && (
            <div>
              <div className="mb-1 text-xs uppercase tracking-wider text-mute">Strategies</div>
              {results.strategies.map((s) => (
                <button key={s.id} onClick={() => go("/strategies")} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-sub hover:bg-surface">
                  {s.name}
                </button>
              ))}
            </div>
          )}
          {results.accounts.length > 0 && (
            <div>
              <div className="mb-1 text-xs uppercase tracking-wider text-mute">Accounts</div>
              {results.accounts.map((a) => (
                <button key={a.id} onClick={() => go("/accounts")} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-sub hover:bg-surface">
                  {a.name}
                </button>
              ))}
            </div>
          )}
          {results.trades.length + results.strategies.length + results.accounts.length === 0 && (
            <div className="py-6 text-center text-sm text-mute">No matches. Try a pair, tag, or note keyword.</div>
          )}
        </div>
      )}
    </Modal>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const initAuth = useApp((s) => s.initAuth);
  const hydrate = useApp((s) => s.hydrate);
  const hydrated = useApp((s) => s.hydrated);
  const syncError = useApp((s) => s.syncError);
  const clearSyncError = useApp((s) => s.clearSyncError);
  const setSearchOpen = useApp((s) => s.setSearchOpen);
  const cloud = useApp((s) => s.cloud);
  const authReady = useApp((s) => s.authReady);
  const user = useApp((s) => s.user);
  const signOut = useApp((s) => s.signOut);
  const pathname = usePathname();

  useEffect(() => {
    void initAuth();
  }, [initAuth]);

  const signedIn = !cloud || !!user;
  useEffect(() => {
    if (authReady && signedIn && !hydrated) void hydrate();
  }, [authReady, signedIn, hydrated, hydrate]);

  const title = NAV.find((n) => (n.href === "/" ? pathname === "/" : pathname.startsWith(n.href)))?.label ?? "TradeEdge";

  // Cloud mode, signed out → show the auth screen instead of the app.
  if (cloud && authReady && !user) return <AuthScreen />;

  return (
    <div className="app-shell min-h-screen bg-bg text-ink">
      <Sidebar />
      <div className="app-content lg:pl-[248px]">
        <header className="app-topbar sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-edge bg-bg/80 px-5 py-3.5 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="TradeEdge" className="h-7 w-7 rounded-lg object-cover lg:hidden" />
            <div><div className="topbar-eyebrow hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-mute sm:block">Trading workspace</div><h1 className="text-base font-semibold tracking-tight">{title}</h1></div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="topbar-search hidden items-center gap-2 rounded-xl border border-edge bg-card px-3 py-2 text-sm text-mute transition-all sm:flex"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4-4" />
              </svg>
              Search
              <kbd className="rounded border border-edge bg-surface px-1.5 text-[10px] text-mute">⌘K</kbd>
            </button>
            <AccountSelector />
            <ThemeToggle />
            {cloud && user && (
              <div className="hidden items-center gap-2 sm:flex">
                <span className="max-w-32 truncate text-xs text-mute" title={user.email ?? ""}>{user.email}</span>
                <button onClick={() => void signOut()} className="topbar-action rounded-xl border border-edge bg-card px-3 py-2 text-sm text-mute transition-all hover:text-ink">
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>
        <nav className="mobile-nav flex gap-1 overflow-x-auto border-b border-edge bg-surface px-3 py-2 lg:hidden">
          {NAV.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs transition-colors ${active ? "bg-card text-ink shadow-sm" : "text-mute hover:text-ink"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <main className="app-main mx-auto max-w-[1440px] px-5 py-7 lg:px-8 lg:py-8">
          {syncError && (
            <div className="sync-banner mb-5 flex items-center justify-between gap-3 rounded-xl border border-neg/30 bg-neg/10 px-4 py-3 text-xs text-neg">
              <span>Cloud save failed: {syncError} — your change is only on this device. Check your connection or Supabase setup, then retry.</span>
              <button onClick={clearSyncError} className="shrink-0 rounded-lg border border-neg/40 px-2 py-1 hover:bg-neg/15">Dismiss</button>
            </div>
          )}
          {hydrated ? children : <div className="loading-state flex min-h-[55vh] items-center justify-center text-sm text-mute"><div className="flex items-center gap-3"><span className="loading-dot h-2 w-2 rounded-full bg-accent"></span><span>Loading your journal…</span></div></div>}
        </main>
      </div>
      <GlobalSearch />
    </div>
  );
}
