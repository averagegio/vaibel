import type { Metadata } from "next";
import Link from "next/link";
import { PricingCards } from "@/components/PricingCards";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Subscribe to vAIbee and add curated AI agents to your tech stack.",
};

type Props = {
  searchParams: Promise<{ session_id?: string; canceled?: string }>;
};

export default async function PricingPage({ searchParams }: Props) {
  const sp = await searchParams;
  const showSuccess = typeof sp.session_id === "string" && sp.session_id.length > 0;
  const showCanceled = sp.canceled === "1";

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-vaibee-cyan">For builders & teams</p>
        <h1 className="text-3xl font-semibold tracking-tight text-vaibee-navy md:text-4xl">
          One subscription — agents in your stack
        </h1>
        <p className="text-base leading-relaxed text-vaibee-muted">
          Pick a plan, pay securely with Stripe Checkout, and unlock installs across the hive.
        </p>
      </header>

      {showSuccess ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Payment session completed. Stripe will confirm the subscription — you can head to the{" "}
          <Link href="/store" className="font-semibold underline">
            store
          </Link>{" "}
          or{" "}
          <Link href="/dashboard" className="font-semibold underline">
            dashboard
          </Link>
          .
        </div>
      ) : null}

      {showCanceled ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Checkout canceled — no charge. Choose a plan when you are ready.
        </div>
      ) : null}

      <PricingCards />

      <p className="text-center text-xs text-vaibee-muted">
        Are you listing an agent? That path stays separate —{" "}
        <Link href="/apply" className="font-semibold text-vaibee-cyan hover:underline">
          Apply for vibers
        </Link>
        .
      </p>
    </div>
  );
}
