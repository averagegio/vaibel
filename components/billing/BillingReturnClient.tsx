"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

export function BillingReturnClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, ready } = useAuth();
  const sessionId = searchParams.get("session_id");

  const [attempt, setAttempt] = useState(0);
  const [phase, setPhase] = useState<"idle" | "working" | "done" | "error">(() =>
    sessionId ? "idle" : "error",
  );
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(() => (sessionId ? null : "Missing checkout session."));

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    (async () => {
      setPhase("working");
      setError(null);
      try {
        const res = await fetch("/api/billing/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = (await res.json().catch(() => null)) as
          | { ok?: boolean; error?: string; email?: string | null }
          | null;
        if (cancelled) return;
        if (!res.ok || !data?.ok) {
          setPhase("error");
          setError(data?.error ?? "Could not confirm your subscription.");
          return;
        }
        const em = typeof data.email === "string" && data.email.trim() ? data.email.trim().toLowerCase() : null;
        setConfirmedEmail(em);
        setPhase("done");
      } catch {
        if (!cancelled) {
          setPhase("error");
          setError("Network error. Try again in a moment.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, attempt]);

  useEffect(() => {
    if (phase !== "done" || !ready || !user || !confirmedEmail) return;
    if (user.email === confirmedEmail) {
      router.replace("/dashboard");
    }
  }, [phase, ready, user, confirmedEmail, router]);

  return (
    <div className="mx-auto max-w-lg space-y-8 py-12">
      <header className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-vaibee-cyan">Billing</p>
        <h1 className="text-3xl font-semibold tracking-tight text-vaibee-navy">
          {phase === "working" ? "Confirming your subscription…" : null}
          {phase === "done" ? "You are subscribed" : null}
          {phase === "error" ? "We could not finish that step" : null}
          {phase === "idle" ? "One moment…" : null}
        </h1>
        <p className="text-sm leading-relaxed text-vaibee-muted">
          {phase === "working"
            ? "Talking to Stripe and saving your plan to the hive."
            : null}
          {phase === "done"
            ? "Your workspace is ready. Sign in with the same email you used at checkout, then open the dashboard."
            : null}
          {phase === "error" ? error : null}
        </p>
      </header>

      {phase === "done" ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/auth?next=/dashboard&notice=subscribed"
            className="inline-flex items-center justify-center rounded-2xl bg-vaibee-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft"
          >
            Sign in to open dashboard
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-2xl border border-vaibee-border bg-vaibee-card px-6 py-3 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
          >
            Go to dashboard
          </Link>
        </div>
      ) : null}

      {phase === "error" ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-2xl bg-vaibee-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft"
          >
            Back to pricing
          </Link>
          {sessionId ? (
            <button
              type="button"
              onClick={() => {
                setPhase("idle");
                setError(null);
                setAttempt((n) => n + 1);
              }}
              className="inline-flex items-center justify-center rounded-2xl border border-vaibee-border px-6 py-3 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
            >
              Retry
            </button>
          ) : null}
        </div>
      ) : null}

      {phase === "working" ? (
        <div className="flex justify-center">
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-vaibee-border border-t-vaibee-cyan"
            aria-hidden
          />
        </div>
      ) : null}
    </div>
  );
}
