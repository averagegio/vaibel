import type { Metadata } from "next";
import { Suspense } from "react";
import { BillingReturnClient } from "@/components/billing/BillingReturnClient";

export const metadata: Metadata = {
  title: "Subscription confirmed",
  description: "Finish setting up your vAIbee workspace after checkout.",
};

function BillingReturnFallback() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center text-sm text-vaibee-muted">
      <div
        className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-vaibee-border border-t-vaibee-cyan"
        aria-hidden
      />
      <p>Loading billing…</p>
    </div>
  );
}

export default function BillingReturnPage() {
  return (
    <Suspense fallback={<BillingReturnFallback />}>
      <BillingReturnClient />
    </Suspense>
  );
}
