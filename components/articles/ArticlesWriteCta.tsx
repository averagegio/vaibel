"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useBillingStatus } from "@/hooks/useBillingStatus";

export function ArticlesWriteCta() {
  const { user, ready } = useAuth();
  const billing = useBillingStatus(user?.email, ready);
  const [canWrite, setCanWrite] = useState(false);

  useEffect(() => {
    if (!user?.email || billing.loading) {
      setCanWrite(false);
      return;
    }
    if (billing.tier === "team") {
      setCanWrite(true);
      return;
    }
    let cancelled = false;
    void fetch("/api/articles/write-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    })
      .then((r) => r.json())
      .then((d: { canWriteArticles?: boolean }) => {
        if (!cancelled) setCanWrite(Boolean(d.canWriteArticles));
      })
      .catch(() => {
        if (!cancelled) setCanWrite(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.email, billing.loading, billing.tier]);

  if (!ready || !user) {
    return (
      <p className="text-sm text-vaibee-muted">
        <Link href="/auth?next=/articles" className="font-semibold text-vaibee-cyan hover:underline">
          Sign in
        </Link>{" "}
        to compose vaibes or publish articles with a Vibe team plan.
      </p>
    );
  }

  if (canWrite) {
    return (
      <Link
        href="/dashboard/articles/write"
        className="inline-flex items-center justify-center rounded-xl bg-vaibee-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft"
      >
        Write an article
      </Link>
    );
  }

  return (
    <Link
      href="/pricing"
      className="inline-flex items-center justify-center rounded-xl border border-vaibee-border bg-white px-4 py-2.5 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
    >
      Upgrade to Vibe team to write articles
    </Link>
  );
}
