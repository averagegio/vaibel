"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

export function DashboardView() {
  const router = useRouter();
  const { user, ready, signOut, completeOnboarding } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/auth?next=/dashboard");
    }
  }, [ready, user, router]);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-sm text-vaibee-muted">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-vaibee-border border-t-vaibee-cyan" aria-hidden />
        <p>Loading your hive…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-sm text-vaibee-muted">
        <p>Taking you to sign in…</p>
      </div>
    );
  }

  const isNew = !user.onboardingComplete;

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-vaibee-cyan">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-vaibee-navy md:text-4xl">
            {isNew ? `Welcome, ${user.name}` : `Good to see you, ${user.name}`}
          </h1>
          <p className="mt-2 max-w-2xl text-vaibee-muted">
            {isNew
              ? "You are in the new viber path — finish the quick checklist so your workspace feels like home."
              : "Here is a snapshot of your hive. Jump back into the store or wire another agent when inspiration hits."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/store"
            className="rounded-xl border border-vaibee-border bg-vaibee-card px-4 py-2 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
          >
            Open store
          </Link>
          <button
            type="button"
            onClick={() => {
              signOut();
              router.push("/");
            }}
            className="rounded-xl bg-vaibee-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft"
          >
            Sign out
          </button>
        </div>
      </header>

      {isNew ? (
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-vaibee-navy">New viber checklist</h2>
            <ol className="mt-4 space-y-4 text-sm text-vaibee-muted">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--vaibee-cyan-dim)] text-xs font-bold text-vaibee-navy">
                  1
                </span>
                <span>
                  <span className="font-semibold text-vaibee-navy">Skim the REST API</span> — endpoints are tiny on
                  purpose so you can vibe-code integrations fast.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--vaibee-cyan-dim)] text-xs font-bold text-vaibee-navy">
                  2
                </span>
                <span>
                  <span className="font-semibold text-vaibee-navy">Add your first agent</span> from the store and note
                  the slug you will call from your app.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--vaibee-cyan-dim)] text-xs font-bold text-vaibee-navy">
                  3
                </span>
                <span>
                  <span className="font-semibold text-vaibee-navy">Optional:</span> apply as a viber builder if you want
                  your own agent listed publicly.
                </span>
              </li>
            </ol>
            <button
              type="button"
              onClick={() => completeOnboarding()}
              className="mt-6 w-full rounded-2xl bg-vaibee-navy py-3 text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft sm:w-auto sm:px-8"
            >
              Mark onboarding done
            </button>
            <p className="mt-3 text-xs text-vaibee-muted">
              You can always revisit tips from the store — this simply switches you to the returning viber dashboard.
            </p>
          </div>
          <div className="space-y-4 rounded-3xl border border-dashed border-vaibee-cyan/40 bg-[var(--vaibee-cyan-dim)] p-6">
            <h3 className="text-base font-semibold text-vaibee-navy">Your account</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-vaibee-muted">Email</dt>
                <dd className="mt-1 font-mono text-sm text-vaibee-navy">{user.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-vaibee-muted">Member since</dt>
                <dd className="mt-1 text-sm text-vaibee-navy">
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </dd>
              </div>
            </dl>
            <Link href="/api-docs" className="inline-flex text-sm font-semibold text-vaibee-cyan hover:underline">
              Read the API docs →
            </Link>
          </div>
        </section>
      ) : (
        <section className="grid gap-5 md:grid-cols-3">
          {[
            { label: "Agents installed", value: "3", hint: "Demo counter — wire persistence next." },
            { label: "API calls (24h)", value: "1.2k", hint: "Synthetic pulse for returning vibers." },
            { label: "Workspace health", value: "99.2%", hint: "Based on mock heartbeat checks." },
          ].map((card) => (
            <div key={card.label} className="rounded-3xl border border-vaibee-border bg-vaibee-card p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-vaibee-muted">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold text-vaibee-navy">{card.value}</p>
              <p className="mt-2 text-xs text-vaibee-muted">{card.hint}</p>
            </div>
          ))}
        </section>
      )}

      {!isNew ? (
        <section className="rounded-3xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-vaibee-navy">Recently touched agents</h2>
            <Link href="/store" className="text-sm font-semibold text-vaibee-cyan hover:underline">
              Browse all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-vaibee-border text-sm">
            {["Vibe Linter", "Ship-it Sprite", "Doc Whisperer"].map((name) => (
              <li key={name} className="flex items-center justify-between gap-3 py-3">
                <span className="font-medium text-vaibee-navy">{name}</span>
                <span className="text-xs text-vaibee-muted">Synced · demo data</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
