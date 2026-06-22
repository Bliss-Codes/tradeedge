"use client";

import { useState } from "react";
import { useApp } from "@/stores/useApp";
import { Button, Field, Input } from "@/components/ui/primitives";

export function AuthScreen() {
  const signIn = useApp((s) => s.signIn);
  const signUp = useApp((s) => s.signUp);
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-2xl border border-edge bg-card p-7">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 font-mono text-sm font-bold text-accent">TE</div>
          <div>
            <div className="text-base font-semibold tracking-tight text-ink">TradeEdge</div>
            <div className="text-[10px] uppercase tracking-widest text-mute">Journal & Analytics</div>
          </div>
        </div>

        <h1 className="text-lg font-semibold text-ink">{mode === "in" ? "Sign in" : "Create your account"}</h1>
        <p className="mt-1 text-sm text-mute">Your journal syncs securely to your account.</p>

        <div className="mt-5 space-y-4">
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email" />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === "in" ? "current-password" : "new-password"}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </Field>
          <Button onClick={submit} disabled={busy} className="w-full">
            {busy ? "Working…" : mode === "in" ? "Sign in" : "Create account"}
          </Button>
          {msg && <p className="text-sm text-sub">{msg}</p>}
        </div>

        <button
          onClick={() => {
            setMode(mode === "in" ? "up" : "in");
            setMsg(null);
          }}
          className="mt-5 w-full text-center text-sm text-accent hover:underline"
        >
          {mode === "in" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
