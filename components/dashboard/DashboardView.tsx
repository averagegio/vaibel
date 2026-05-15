"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AgentCard } from "@/components/AgentCard";
import { useAuth } from "@/components/auth/AuthProvider";
import { DashboardProfileCard } from "@/components/dashboard/DashboardProfileCard";
import { useBillingStatus } from "@/hooks/useBillingStatus";
import type { AgentListing } from "@/lib/agents";

export function DashboardView({ featuredPicks }: { featuredPicks: AgentListing[] }) {
  const router = useRouter();
  const { user, ready, signOut, completeOnboarding } = useAuth();
  const billing = useBillingStatus(user?.email, ready);

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

  if (billing.loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-sm text-vaibee-muted">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-vaibee-border border-t-vaibee-cyan" aria-hidden />
        <p>Checking your subscription…</p>
      </div>
    );
  }

  if (!billing.active) {
    return (
      <div className="mx-auto max-w-lg space-y-8 py-6">
        <header className="space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-vaibee-cyan">Dashboard</p>
          <h1 className="text-3xl font-semibold tracking-tight text-vaibee-navy">Active subscription required</h1>
          <p className="text-sm leading-relaxed text-vaibee-muted">
            Signed in as <span className="font-mono text-vaibee-navy">{user.email}</span>. We do not see an active plan
            for this email yet. Use the same address in Stripe Checkout, then refresh this page or focus the window to
            sync.
          </p>
        </header>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-2xl bg-vaibee-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft"
          >
            View plans
          </Link>
          <button
            type="button"
            onClick={() => {
              signOut();
              router.push("/auth?next=/dashboard&notice=subscribed");
            }}
            className="inline-flex items-center justify-center rounded-2xl border border-vaibee-border bg-vaibee-card px-6 py-3 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
          >
            Use a different account
          </button>
        </div>
      </div>
    );
  }

  const isNew = !user.onboardingComplete;
  const planLabel = billing.tier
    ? `Active plan · ${billing.tier.charAt(0).toUpperCase()}${billing.tier.slice(1)}`
    : null;
  const picks = featuredPicks;

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <DashboardProfileCard user={user} planLabel={planLabel} />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/apply"
          className="group flex flex-col justify-between rounded-3xl border border-vaibee-border bg-gradient-to-br from-vaibee-navy to-[#0d3d52] p-6 text-white shadow-sm ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-lg lg:col-span-2"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Ship</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">New agent ship</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/85">
              Package your API, pitch the hive, and list when you are ready. One funnel for builders going live.
            </p>
          </div>
          <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[var(--vaibee-cyan)] group-hover:underline">
            Start application →
          </span>
        </Link>
        <Link
          href="/apply"
          className="flex flex-col justify-between rounded-3xl border border-dashed border-vaibee-cyan/45 bg-[var(--vaibee-cyan-dim)] p-6 transition hover:border-vaibee-cyan/70 hover:shadow-md"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-vaibee-navy/70">Program</p>
            <h2 className="mt-2 text-lg font-semibold text-vaibee-navy">Apply for vibers</h2>
            <p className="mt-2 text-sm text-vaibee-navy/80">
              Join the curated builder program — review, feedback, and a path to the public store.
            </p>
          </div>
          <span className="mt-4 text-sm font-semibold text-vaibee-cyan">Learn more →</span>
        </Link>
        <div className="flex flex-col gap-2 rounded-3xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-vaibee-muted">Quick</p>
          <Link
            href="/store"
            className="rounded-xl border border-vaibee-border bg-white px-4 py-3 text-center text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
          >
            Open store
          </Link>
          <Link
            href="/dashboard/profile"
            className="rounded-xl bg-vaibee-navy px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft"
          >
            Edit profile
          </Link>
          <button
            type="button"
            onClick={() => {
              signOut();
              router.push("/");
            }}
            className="rounded-xl border border-transparent px-4 py-2 text-sm font-semibold text-vaibee-muted transition hover:text-vaibee-navy"
          >
            Sign out
          </button>
        </div>
      </section>

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

      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-vaibee-navy">Featured agents</h2>
            <p className="mt-1 text-sm text-vaibee-muted">Top-rated picks from the hive — wire one into your stack today.</p>
          </div>
          <Link href="/store" className="text-sm font-semibold text-vaibee-cyan hover:underline">
            Browse store
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {picks.map((agent) => (
            <AgentCard key={agent.slug} agent={agent} />
          ))}
        </div>
      </section>

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
