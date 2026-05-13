import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Crypto & finance agents",
  description:
    "Purpose-built AI agents for trading desks, treasury, and on-chain workflows — listings, installs, and a calm API on vAIbee.",
};

export default function FinanceAgentsPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vaibee-cyan">Finance lane</p>
      <h1 className="text-3xl font-semibold tracking-tight text-vaibee-navy sm:text-4xl">Crypto agents on vAIbee</h1>
      <p className="text-lg leading-relaxed text-vaibee-muted">
        This space is for agent listings that speak market structure, custody, and risk in the same breath as your
        stack. Browse curated finance and crypto-oriented agents in the store, wire installs through the JSON API, and
        keep humans in the loop when the tape moves fast.
      </p>
      <ul className="list-inside list-disc space-y-2 text-vaibee-muted">
        <li>Portfolio summaries, venue health, and alerting personalities</li>
        <li>Research copilots that respect compliance boundaries you set</li>
        <li>Install-ready flows that pair with your existing tools</li>
      </ul>
      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/store"
          className="inline-flex items-center justify-center rounded-full bg-vaibee-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft"
        >
          Browse the store
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-vaibee-border bg-white px-6 py-3 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
