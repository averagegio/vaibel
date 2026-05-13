"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { signupHapticHover, signupHapticPress } from "@/components/SignupCtaLink";

type Mode = "signin" | "signup";

/** Matches fixed hero height — keep in sync with hero container */
const HERO_H = "clamp(13rem, 36vh, 24rem)";

export function AuthScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const subscribedNotice = searchParams.get("notice") === "subscribed";
  const modeParam = searchParams.get("mode");
  const initialMode: Mode = modeParam === "signup" ? "signup" : "signin";

  const { signIn, signUp, user, ready } = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const heading = useMemo(() => (mode === "signup" ? "Create your vAIbee account" : "Sign in to vAIbee"), [mode]);

  useEffect(() => {
    setMode(modeParam === "signup" ? "signup" : "signin");
  }, [modeParam]);

  useEffect(() => {
    if (!ready || !user) return;
    const target = next.startsWith("/") ? next : "/dashboard";
    router.replace(target);
  }, [ready, user, next, router]);

  async function onSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const res = await signIn(email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? "Could not sign in.");
      return;
    }
    router.replace(next.startsWith("/") ? next : "/dashboard");
  }

  async function onSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const name = String(fd.get("name") ?? "");
    const res = await signUp(email, password, name);
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? "Could not create account.");
      return;
    }
    router.replace("/dashboard");
  }

  return (
    <div className="relative min-h-[calc(100dvh-3.75rem)] w-full overflow-x-hidden bg-white">
      {/* Full-bleed hero: fixed under marketing header (3.75rem) */}
      <div
        className="pointer-events-none fixed left-0 right-0 top-[3.75rem] z-10 overflow-hidden border-b border-white/10 shadow-[0_12px_40px_-12px_rgba(6,16,34,0.45)]"
        style={{ height: HERO_H }}
        aria-hidden
      >
        <img
          src="/vaibeelanding2.gif"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_42%] sm:object-center"
          loading="eager"
          decoding="async"
        />
        {/* Readability scrim + seamless fade into page background */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#050a14]/60 via-[#0a1128]/12 to-white"
          aria-hidden
        />
      </div>

      {/* Content clears fixed hero; opaque base so scroll stays readable */}
      <div
        className="relative z-20 mx-auto flex w-full max-w-md flex-col px-4 pb-12 sm:px-6"
        style={{ paddingTop: HERO_H }}
      >
        <div className="mt-5 rounded-3xl border border-black/[0.07] bg-white/95 p-6 shadow-[0_8px_40px_-12px_rgba(10,17,40,0.12)] backdrop-blur-md supports-[backdrop-filter]:bg-white/88 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Link href="/store" className="text-sm font-semibold text-vaibee-cyan hover:underline">
              Store
            </Link>
            <Link
              href="/"
              className="inline-flex shrink-0 border-0 bg-transparent p-0 shadow-none outline-none ring-0 transition-opacity hover:opacity-90 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-vaibee-cyan/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-label="Home"
            >
              <Image
                src="/vaibeelogos.png"
                alt="vAIbee"
                width={140}
                height={72}
                className="h-10 w-auto max-w-[min(140px,42vw)] object-contain object-right"
                priority
              />
            </Link>
          </div>

          <div className="flex rounded-full bg-[#eef2f8] p-1 text-sm font-semibold ring-1 ring-black/[0.04]">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError(null);
              }}
              className={[
                "flex-1 rounded-full px-3 py-2 transition",
                mode === "signin" ? "bg-white text-vaibee-navy shadow-sm" : "text-vaibee-muted hover:text-vaibee-navy",
              ].join(" ")}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              className={[
                "flex-1 rounded-full px-3 py-2 transition",
                mode === "signup" ? "bg-white text-vaibee-navy shadow-sm" : "text-vaibee-muted hover:text-vaibee-navy",
              ].join(" ")}
            >
              Sign up
            </button>
          </div>

          <h1 className="mt-8 text-2xl font-semibold tracking-tight text-vaibee-navy">{heading}</h1>
          <p className="mt-2 text-sm text-vaibee-muted">
            Demo auth stores accounts in your browser only — swap for a real provider when you wire production.
          </p>

          {error ? (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">{error}</p>
          ) : null}

          {subscribedNotice ? (
            <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
              Subscription confirmed — sign in with the <span className="font-semibold">same email</span> you used at
              checkout to open the dashboard.
            </p>
          ) : null}

          {mode === "signin" ? (
            <form className="mt-8 space-y-4" onSubmit={onSignIn}>
              <label className="block text-sm font-medium text-vaibee-navy">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="mt-1.5 w-full rounded-2xl border border-black/12 bg-white px-3 py-3 text-sm text-vaibee-navy outline-none ring-vaibee-cyan/30 placeholder:text-vaibee-muted/70 focus:border-vaibee-cyan focus:ring-2"
                  placeholder="you@vibecoders.dev"
                />
              </label>
              <label className="block text-sm font-medium text-vaibee-navy">
                Password
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="mt-1.5 w-full rounded-2xl border border-black/12 bg-white px-3 py-3 text-sm text-vaibee-navy outline-none ring-vaibee-cyan/30 placeholder:text-vaibee-muted/70 focus:border-vaibee-cyan focus:ring-2"
                  placeholder="••••••••"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-vaibee-navy py-3 text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Log in"}
              </button>
            </form>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={onSignUp}>
              <label className="block text-sm font-medium text-vaibee-navy">
                Name
                <input
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="mt-1.5 w-full rounded-2xl border border-black/12 bg-white px-3 py-3 text-sm text-vaibee-navy outline-none ring-vaibee-cyan/30 placeholder:text-vaibee-muted/70 focus:border-vaibee-cyan focus:ring-2"
                  placeholder="Alex Vibe"
                />
              </label>
              <label className="block text-sm font-medium text-vaibee-navy">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="mt-1.5 w-full rounded-2xl border border-black/12 bg-white px-3 py-3 text-sm text-vaibee-navy outline-none ring-vaibee-cyan/30 placeholder:text-vaibee-muted/70 focus:border-vaibee-cyan focus:ring-2"
                  placeholder="you@vibecoders.dev"
                />
              </label>
              <label className="block text-sm font-medium text-vaibee-navy">
                Password
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  minLength={6}
                  className="mt-1.5 w-full rounded-2xl border border-black/12 bg-white px-3 py-3 text-sm text-vaibee-navy outline-none ring-vaibee-cyan/30 placeholder:text-vaibee-muted/70 focus:border-vaibee-cyan focus:ring-2"
                  placeholder="At least 6 characters"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                onPointerEnter={signupHapticHover}
                onPointerDown={signupHapticPress}
                className="signup-cta w-full rounded-2xl py-3 text-sm disabled:pointer-events-none disabled:opacity-60"
              >
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-xs text-vaibee-muted">
            By continuing you agree to vibe responsibly. This is a demo experience.
          </p>
        </div>
      </div>
    </div>
  );
}
