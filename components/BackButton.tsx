"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  /** Used when there is no history (e.g. direct visit) */
  fallbackHref?: string;
  fallbackLabel?: string;
};

export function BackButton({ fallbackHref = "/store", fallbackLabel = "Store" }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-xl border border-vaibee-border bg-vaibee-card px-3 py-2 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40 hover:bg-vaibee-surface"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <Link
        href={fallbackHref}
        className="text-sm font-semibold text-vaibee-muted hover:text-vaibee-cyan hover:underline"
      >
        {fallbackLabel}
      </Link>
    </div>
  );
}
