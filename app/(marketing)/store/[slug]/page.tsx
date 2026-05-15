import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getPublishedAgentBySlug } from "@/lib/agents";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getPublishedAgentBySlug(slug);
  if (!agent) return { title: "Agent" };
  return {
    title: `${agent.name} · Agent store`,
    description: agent.tagline,
  };
}

export default async function AgentStoreListingPage({ params }: Props) {
  const { slug } = await params;
  const agent = await getPublishedAgentBySlug(slug);
  if (!agent) notFound();

  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;

  const description = agent.longDescription ?? agent.tagline;
  const highlights = agent.highlights ?? [];

  return (
    <main className="relative pb-16 pt-4 sm:pb-20 sm:pt-6">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-vaibee-muted">
          <Link href="/store" className="font-semibold text-vaibee-cyan hover:underline">
            Agent store
          </Link>
          <span aria-hidden className="text-vaibee-border">
            /
          </span>
          <span className="truncate text-vaibee-navy">{agent.name}</span>
        </nav>

        <header className="rounded-3xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start gap-5">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[var(--vaibee-cyan-dim)] text-2xl font-bold text-vaibee-navy ring-1 ring-vaibee-cyan/25 sm:h-24 sm:w-24 sm:text-3xl"
              aria-hidden
            >
              {agent.name.slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-vaibee-cyan">{agent.category}</p>
              <h1 className="text-2xl font-semibold tracking-tight text-vaibee-navy sm:text-3xl">{agent.name}</h1>
              <p className="text-base leading-relaxed text-vaibee-muted">{agent.tagline}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-sm text-vaibee-muted">
                <span className="font-medium text-vaibee-navy">★ {agent.rating.toFixed(1)}</span>
                <span>{agent.installsLabel} installs</span>
                <span className="truncate">{agent.author}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {agent.websiteUrl ? (
              <a
                href={agent.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-vaibee-navy px-6 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-vaibee-navy-soft sm:flex-none sm:min-w-[11rem]"
              >
                Open website
              </a>
            ) : null}
            <Link
              href={`/api-docs#agent-${agent.slug}`}
              className="inline-flex flex-1 items-center justify-center rounded-2xl border border-vaibee-border bg-vaibee-surface px-6 py-3.5 text-center text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40 sm:flex-none sm:min-w-[11rem]"
            >
              Hive JSON / API
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex flex-1 items-center justify-center rounded-2xl border border-dashed border-vaibee-cyan/45 bg-[var(--vaibee-cyan-dim)] px-6 py-3.5 text-center text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/70 sm:flex-none sm:min-w-[11rem]"
            >
              Add to workspace
            </Link>
          </div>
        </header>

        <section className="mt-10 space-y-4">
          <h2 className="text-lg font-semibold text-vaibee-navy">About</h2>
          <p className="text-base leading-relaxed text-vaibee-muted">{description}</p>
        </section>

        {highlights.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-vaibee-navy">What you get</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-vaibee-muted">
              {highlights.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-vaibee-cyan" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {slug === "scriptids" ? (
          <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-950">
            Scriptids surfaces educational context—not diagnoses or dosing decisions. Always follow your clinician and
            pharmacist for medical decisions (consistent with scriptids.com).
          </p>
        ) : null}

        <section id="connect-hive" className="mt-12 rounded-2xl border border-vaibee-border bg-white px-5 py-6 shadow-sm">
          <h2 className="text-lg font-semibold text-vaibee-navy">Wire into the hive</h2>
          <p className="mt-2 text-sm leading-relaxed text-vaibee-muted">
            Fetch this listing from the catalog API, then pair it with your workspace flow. Installs return a short-lived
            token today (demo mode) — swap in your auth when ready.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-vaibee-navy p-4 text-xs leading-relaxed text-white">
            {`curl -s "${origin}/api/v1/agents/${agent.slug}" | jq`}
          </pre>
          <p className="mt-2 text-xs text-vaibee-muted">Uses your current site origin automatically in dev and production.</p>
          {agent.agentApiUrl ? (
            <p className="mt-4 text-sm text-vaibee-muted">
              <span className="font-semibold text-vaibee-navy">Builder endpoint:</span>{" "}
              <a href={agent.agentApiUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-xs break-all text-vaibee-cyan hover:underline">
                {agent.agentApiUrl}
              </a>
            </p>
          ) : null}
        </section>

        <p className="mt-10 text-center text-sm text-vaibee-muted">
          <Link href="/store" className="font-semibold text-vaibee-cyan hover:underline">
            ← Back to store
          </Link>
        </p>
      </div>
    </main>
  );
}
