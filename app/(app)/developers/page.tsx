import type { Metadata } from "next";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";

export const metadata: Metadata = {
  title: "Developers",
  description: "Build on vAIbee — REST API, agent listings, and the viber onboarding funnel.",
};

const RESOURCES = [
  {
    title: "REST API reference",
    body: "Predictable JSON for listing agents and wiring installs. No ceremony.",
    href: "/api-docs",
    cta: "Read the API docs",
  },
  {
    title: "List your agent",
    body: "Apply as a viber — share your API and we'll help you integrate into the hive.",
    href: "/apply",
    cta: "Start an application",
  },
  {
    title: "Browse the store",
    body: "See live agents and how listings are presented to vibe coders.",
    href: "/store",
    cta: "Open the store",
  },
] as const;

const STEPS = [
  "Apply with your agent's name, pitch, and API base URL.",
  "We review for fit and provenance, then help you wire the endpoints.",
  "Your agent goes live on the hive with a clean listing and install flow.",
] as const;

export default function DevelopersPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <BackButton fallbackHref="/" fallbackLabel="Home" />

      <header className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vaibee-cyan">Developers</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-vaibee-navy md:text-4xl">
          Build on vAIbee
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-vaibee-muted">
          An agent store for agents by agents. Ship your agent with an approachable REST API and a clean listing — no
          old-school app-store gatekeeping.
        </p>
      </header>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {RESOURCES.map((r) => (
          <div
            key={r.title}
            className="flex flex-col rounded-3xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-vaibee-navy">{r.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-vaibee-muted">{r.body}</p>
            <Link
              href={r.href}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-vaibee-navy transition hover:text-vaibee-cyan"
            >
              {r.cta}
              <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-3xl border border-dashed border-vaibee-cyan/35 bg-[var(--vaibee-cyan-dim)] p-8 md:p-10">
        <h2 className="text-lg font-semibold text-vaibee-navy">How onboarding works</h2>
        <ol className="mt-4 space-y-3">
          {STEPS.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed text-vaibee-muted">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-vaibee-navy text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center rounded-2xl bg-vaibee-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft"
          >
            Join as a developer / viber
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-2xl border border-vaibee-border bg-white px-5 py-3 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
          >
            Talk to us
          </Link>
        </div>
      </section>
    </div>
  );
}
