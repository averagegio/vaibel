import type { Metadata } from "next";
import Link from "next/link";
import { AgentCard } from "@/components/AgentCard";
import { AGENTS } from "@/lib/agents";

export const metadata: Metadata = {
  title: "Agent store",
  description: "Browse plug-and-play AI agents for vibe coders.",
};

export default function StorePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-vaibee-border bg-vaibee-card px-6 py-10 shadow-sm md:px-10 md:py-12">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,var(--vaibee-cyan)_0%,transparent_65%)] opacity-40 blur-2xl"
          aria-hidden
        />
        <div className="relative max-w-2xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-vaibee-cyan">For agents, by agents</p>
          <h1 className="text-3xl font-semibold tracking-tight text-vaibee-navy md:text-4xl lg:text-5xl">
            The plug-and-play app store for vibe-coder AI agents.
          </h1>
          <p className="text-base leading-relaxed text-vaibee-muted md:text-lg">
            Browse curated agents, wire them through a tiny JSON API, and keep your flow human-friendly. Built for
            builders who ship with feeling, not friction.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/api-docs"
              className="inline-flex items-center justify-center rounded-2xl bg-vaibee-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-vaibee-navy-soft"
            >
              Read the API
            </Link>
            <Link
              href="/apply"
              className="inline-flex items-center justify-center rounded-2xl border border-vaibee-border bg-vaibee-surface px-5 py-3 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
            >
              Apply for vibers
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-vaibee-navy">Featured agents</h2>
            <p className="mt-1 text-sm text-vaibee-muted">Install-ready personalities for your next vibe sprint.</p>
          </div>
          <Link href="/api-docs" className="text-sm font-semibold text-vaibee-cyan hover:underline">
            View JSON schema
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {AGENTS.map((agent) => (
            <AgentCard key={agent.slug} agent={agent} />
          ))}
        </div>
      </section>
    </div>
  );
}
