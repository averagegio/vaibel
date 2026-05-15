import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedAgents } from "@/lib/agents";

export const metadata: Metadata = {
  title: "REST API",
  description: "Plug-and-play JSON API for listing agents and wiring installs.",
};

export const dynamic = "force-dynamic";

const base = "/api/v1";

export default async function ApiDocsPage() {
  const agents = await listPublishedAgents();
  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-vaibee-cyan">Developer surface</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-vaibee-navy md:text-4xl">Approachable REST API</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-vaibee-muted">
        Predictable JSON, no ceremony. Use these endpoints from your vibe stack, CI bots, or internal tools.
      </p>

      <div className="mt-10 space-y-8">
        <section className="rounded-2xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-900">GET</span>
            <code className="font-mono text-sm text-vaibee-navy">{base}/agents</code>
          </div>
          <p className="mt-3 text-sm text-vaibee-muted">Returns every public listing in the store catalog.</p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-vaibee-navy p-4 text-xs leading-relaxed text-white">
{`curl -s https://your-domain.com${base}/agents | jq`}
          </pre>
        </section>

        <section className="rounded-2xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-900">GET</span>
            <code className="font-mono text-sm text-vaibee-navy">{base}/agents/:slug</code>
          </div>
          <p className="mt-3 text-sm text-vaibee-muted">Fetch a single agent by slug — ideal for detail pages.</p>
        </section>

        <section className="rounded-2xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-sky-100 px-2 py-1 text-xs font-bold text-sky-900">POST</span>
            <code className="font-mono text-sm text-vaibee-navy">{base}/installs</code>
          </div>
          <p className="mt-3 text-sm text-vaibee-muted">
            Reserved for authenticated installs. Returns a short-lived token your agent can exchange for webhooks.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-vaibee-surface p-4 text-xs leading-relaxed text-vaibee-navy ring-1 ring-vaibee-border">
{`{
  "agentSlug": "vibe-linter",
  "workspaceId": "ws_123"
}`}
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-vaibee-navy">Agent slugs in this demo</h2>
          <ul className="mt-4 space-y-3">
            {agents.map((agent) => (
              <li key={agent.slug} id={`agent-${agent.slug}`} className="rounded-xl border border-vaibee-border bg-vaibee-card px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-mono text-sm text-vaibee-navy">{agent.slug}</p>
                  <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
                    <Link className="text-xs font-semibold text-vaibee-cyan hover:underline" href={`/store/${agent.slug}`}>
                      Store listing
                    </Link>
                    <Link className="text-xs font-semibold text-vaibee-cyan hover:underline" href={`${base}/agents/${agent.slug}`}>
                      Open JSON
                    </Link>
                  </div>
                </div>
                <p className="mt-1 text-sm text-vaibee-muted">{agent.name}</p>
                {agent.agentApiUrl ? (
                  <p className="mt-2 font-mono text-[11px] text-vaibee-muted break-all">
                    Builder API: {agent.agentApiUrl}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
