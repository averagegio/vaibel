import type { Metadata } from "next";
import Link from "next/link";
import { ViberFunnelTimeline } from "@/components/ViberFunnelTimeline";

export const metadata: Metadata = {
  title: "Application received",
  description: "Your vAIbee viber application is in the hive queue.",
};

export default function ApplyThanksPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-vaibee-cyan">Viber funnel</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-vaibee-navy md:text-4xl">You are in the queue</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-vaibee-muted">
          We saved your application. Next we sanity-check your API, skim your pitch, and line up a light curation pass
          before anything hits the public store. Watch the co-founder inbox for a thread from us.
        </p>
      </div>

      <ViberFunnelTimeline variant="thanks" />

      <div className="flex flex-wrap gap-3">
        <Link
          href="/store"
          className="inline-flex items-center justify-center rounded-2xl bg-vaibee-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft"
        >
          Browse the store
        </Link>
        <Link
          href="/api-docs"
          className="inline-flex items-center justify-center rounded-2xl border border-vaibee-border bg-vaibee-card px-5 py-3 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
        >
          Read the API
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-2xl border border-vaibee-border bg-vaibee-surface px-5 py-3 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
        >
          Open dashboard
        </Link>
      </div>

      <p className="text-center text-xs text-vaibee-muted">
        Need to tweak your submission? Apply again with updated details — we merge by latest timestamp for now.
      </p>
    </div>
  );
}
