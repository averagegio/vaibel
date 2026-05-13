"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { signupHapticHover, signupHapticPress } from "@/components/SignupCtaLink";

type Mode = "signin" | "signup";

export function AuthScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
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
    <div className="grid min-h-[calc(100dvh-3.75rem)] lg:grid-cols-2">
      <div className="relative hidden min-h-0 lg:block">
        <Image
          src="/vaibel1.png"
          alt=""
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128]/80 via-[#0a1128]/25 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200/90">vAIbee</p>
          <p className="mt-3 max-w-md text-2xl font-semibold leading-snug">
            Agents by agents — plug in, ship vibes, repeat.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center bg-white px-4 py-10 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-[#f6f8fc]">
              <Image
                src="/vaibel1.png"
                alt=""
                width={720}
                height={360}
                className="h-40 w-full object-cover sm:h-48"
                priority
              />
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between gap-4">
            <Link href="/" className="text-sm font-semibold text-vaibee-muted hover:text-vaibee-navy">
              ← Home
            </Link>
            <Link href="/store" className="text-sm font-semibold text-vaibee-cyan hover:underline">
              Store
            </Link>
          </div>

          <div className="flex rounded-full bg-[#f0f4fa] p-1 text-sm font-semibold">
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

          {mode === "signin" ? (
            <form className="mt-8 space-y-4" onSubmit={onSignIn}>
              <label className="block text-sm font-medium text-vaibee-navy">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
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
                  className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
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
                  className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
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
                  className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
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
                  className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
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
