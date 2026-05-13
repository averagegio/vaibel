"use client";

import { useState } from "react";
import { CONSUMER_PLANS } from "@/lib/consumer-pricing";
import type { SubscriptionTier } from "@/lib/stripe-server";

export function PricingCards() {
  const [loadingTier, setLoadingTier] = useState<SubscriptionTier | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(tier: SubscriptionTier) {
    setError(null);
    setLoadingTier(tier);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!res.ok || !data?.url) {
        setError(data?.error ?? "Could not start checkout. Try again or contact support.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Check your connection and retry.");
    } finally {
      setLoadingTier(null);
    }
  }

  return (
    <div>
      {error ? (
        <p className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">{error}</p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        {CONSUMER_PLANS.map((plan) => (
          <article
            key={plan.id}
            className={[
              "relative flex flex-col rounded-3xl border p-6 shadow-sm transition sm:p-8",
              plan.highlight
                ? "border-vaibee-cyan/50 bg-[var(--vaibee-cyan-dim)] ring-2 ring-vaibee-cyan/30 lg:-translate-y-1 lg:shadow-lg"
                : "border-vaibee-border bg-vaibee-card hover:-translate-y-0.5 hover:border-vaibee-cyan/35 hover:shadow-md",
            ].join(" ")}
          >
            {plan.highlight ? (
              <p className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-vaibee-navy px-3 py-1 text-xs font-semibold text-white shadow">
                Most teams start here
              </p>
            ) : null}
            <h2 className="text-xl font-semibold text-vaibee-navy">{plan.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-vaibee-muted">{plan.blurb}</p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight text-vaibee-navy">{plan.price}</span>
              <span className="text-sm text-vaibee-muted">{plan.cadence}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-vaibee-navy">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="mt-0.5 text-vaibee-cyan" aria-hidden>
                    ✓
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={loadingTier !== null}
              onClick={() => startCheckout(plan.id)}
              className={[
                "mt-8 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
                plan.highlight
                  ? "bg-vaibee-navy text-white hover:bg-vaibee-navy-soft"
                  : "border border-vaibee-border bg-white text-vaibee-navy hover:border-vaibee-cyan/40",
              ].join(" ")}
            >
              {loadingTier === plan.id ? "Redirecting…" : "Subscribe"}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
