import Link from "next/link";
import type { AgentListing } from "@/lib/agents";

export function AgentCard({ agent }: { agent: AgentListing }) {
  const detailHref = `/store/${agent.slug}`;

  return (
    <article className="group flex flex-col rounded-2xl border border-vaibee-border bg-vaibee-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-vaibee-cyan/35 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-vaibee-cyan">{agent.category}</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-vaibee-navy">
            <Link href={detailHref} className="hover:text-vaibee-cyan">
              {agent.name}
            </Link>
          </h2>
        </div>
        <span className="rounded-full bg-vaibee-surface px-2.5 py-1 text-xs font-medium text-vaibee-muted">
          ★ {agent.rating.toFixed(1)}
        </span>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-vaibee-muted">{agent.tagline}</p>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-vaibee-muted">
        <span>{agent.installsLabel} installs</span>
        <span className="truncate">{agent.author}</span>
      </div>
      <div className="mt-5 flex gap-2">
        <Link
          href={detailHref}
          className="flex-1 rounded-xl bg-vaibee-navy px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft"
        >
          View listing
        </Link>
        <Link
          href={`/api-docs#agent-${agent.slug}`}
          className="flex-1 rounded-xl border border-vaibee-border bg-vaibee-surface px-3 py-2 text-center text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
        >
          API
        </Link>
      </div>
    </article>
  );
}
