"use client";

import { startTransition, useEffect, useState } from "react";

export type BillingState = { loading: boolean; active: boolean; tier: string | null };

export function useBillingStatus(email: string | undefined, ready: boolean): BillingState {
  const [billing, setBilling] = useState<BillingState>({
    loading: true,
    active: false,
    tier: null,
  });

  useEffect(() => {
    if (!ready || !email) {
      startTransition(() => {
        setBilling({ loading: false, active: false, tier: null });
      });
      return;
    }

    let cancelled = false;
    startTransition(() => {
      setBilling({ loading: true, active: false, tier: null });
    });

    async function load() {
      try {
        const res = await fetch("/api/subscription/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = (await res.json().catch(() => null)) as {
          active?: boolean;
          tier?: string | null;
        } | null;
        if (cancelled) return;
        startTransition(() => {
          setBilling({
            loading: false,
            active: Boolean(data?.active),
            tier: data?.tier ?? null,
          });
        });
      } catch {
        if (!cancelled) {
          startTransition(() => {
            setBilling({ loading: false, active: false, tier: null });
          });
        }
      }
    }

    void load();
    const onFocus = () => {
      void load();
    };
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
    };
  }, [ready, email]);

  return billing;
}
