"use client";

import { useState } from "react";
import { useApp } from "@/stores/useApp";
import { Field, Input } from "@/components/ui/primitives";

/** Decorative mini equity curve for the showcase panel. */
function MiniCurve() {
  return (
    <svg viewBox="0 0 260 80" className="w-full">
      <defs>
        <linearGradient id="authg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "rgb(var(--accent))" }} stopOpacity="0.25" />
          <stop offset="100%" style={{ stopColor: "rgb(var(--accent))" }} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0,66 L30,58 L60,61 L90,48 L120,38 L150,42 L180,28 L210,22 L240,12 L260,8 L260,80 L0,80 Z" fill="url(#authg)" />
      <path d="M0,66 L30,58 L60,61 L90,48 L120,38 L150,42 L180,28 L210,22 L240,12 L260,8" fill="none" style={{ stroke: "rgb(var(--accent))" }} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function AuthScreen() {
  const signIn = useApp((s) => s.signIn);
  const signUp = useApp((s) => s.signUp);
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async () => {
    if (!email.trim() || password.length < 6) {
      setMsg("Enter an email and a password of at least 6 characters.");
      return;
    }
    setBusy(true);
    setMsg(null);
    const err = mode === "in" ? await signIn(email.trim(), password) : await signUp(email.trim(), password);
    setBusy(false);
    if (err) setMsg(err);
    else if (mode === "up") setMsg("Account created. If email confirmation is on, check your inbox, then sign in.");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg">
      {/* ambient brand glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(900px 520px at 20% -10%, rgb(var(--accent)/0.10), transparent 60%), radial-gradient(700px 480px at 100% 110%, rgb(var(--accent)/0.06), transparent 55%)" }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col lg:flex-row lg:items-center lg:gap-14 lg:px-10">
        {/* ── Showcase (desktop) / compact header (mobile) ─────────────── */}
        <div className="flex flex-col items-center px-6 pt-10 lg:flex-1 lg:items-start lg:px-0 lg:pt-0">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="TradeEdge" className="h-12 w-12 rounded-2xl object-cover shadow-[0_8px_24px_-8px_rgb(var(--accent)/0.5)]" />
            <div>
              <div className="text-xl font-bold tracking-tight text-ink">TradeEdge</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-mute">Journal &amp; Analytics</div>
            </div>
          </div>

          <h1 className="mt-6 max-w-md text-center text-2xl font-bold leading-tight text-ink lg:mt-8 lg:text-left lg:text-4xl">
            Know exactly <span className="text-accent">what works</span> in your trading.
          </h1>
          <p className="mt-3 max-w-md text-center text-sm text-mute lg:text-left">
            Log trades in a few taps. See your edge by session, pair, and strategy — all your data in one place.
          </p>

          {/* floating preview cards — desktop only */}
          <div className="relative mt-10 hidden w-full max-w-md lg:block">
            <div className="premium-card rounded-2xl border border-edge bg-card p-5">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-mute">Equity curve</span>
                <span className="font-mono text-sm font-bold text-pos">+$12,480</span>
              </div>
              <MiniCurve />
            </div>
            <div className="premium-card absolute -right-8 -top-7 rounded-xl border border-edge bg-card px-4 py-3">
              <div className="text-[10px] uppercase tracking-wider text-mute">Win rate</div>
              <div className="font-mono text-lg font-bold text-ink">61.9%</div>
            </div>
            <div className="premium-card absolute -bottom-7 -left-6 rounded-xl border border-edge bg-card px-4 py-3">
              <div className="text-[10px] uppercase tracking-wider text-mute">Best session</div>
              <div className="font-mono text-lg font-bold text-accent">London</div>
            </div>
          </div>
        </div>

        {/* ── Form panel ───────────────────────────────────────────────── */}
        <div className="flex flex-1 items-start justify-center px-4 pb-10 pt-8 sm:px-6 lg:items-center lg:pt-0">
          <div className="premium-card w-full max-w-sm rounded-3xl border border-edge bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink">{mode === "in" ? "Welcome back" : "Create your account"}</h2>
            <p className="mt-1 text-sm text-mute">
              {mode === "in" ? "Sign in to your journal." : "Your journal syncs securely to your account."}
            </p>

            <div className="mt-6 space-y-4">
              <Field label="Email">
                <Input
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  autoComplete="email"
                  className="py-3 text-base sm:py-2 sm:text-sm"
                />
              </Field>
              <Field label="Password">
                <div className="relative">
                  <Input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={mode === "in" ? "current-password" : "new-password"}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    className="py-3 pr-11 text-base sm:py-2 sm:text-sm"
                  />
                  <button
                    type="button"
                    aria-label={showPw ? "Hide password" : "Show password"}
                    onClick={() => setShowPw(!showPw)}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-mute transition-colors hover:text-ink"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {showPw ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                          <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </Field>

              <button
                onClick={submit}
                disabled={busy}
                className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-bg shadow-[0_6px_24px_-8px_rgb(var(--accent)/0.6)] transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {busy ? "Working…" : mode === "in" ? "Sign in" : "Create account"}
              </button>
              {msg && <p className="text-sm text-sub">{msg}</p>}
            </div>

            <button
              onClick={() => {
                setMode(mode === "in" ? "up" : "in");
                setMsg(null);
              }}
              className="mt-6 w-full text-center text-sm text-accent hover:underline"
            >
              {mode === "in" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
