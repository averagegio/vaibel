"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleEditorForm } from "@/components/articles/ArticleEditorForm";
import { useAuth } from "@/components/auth/AuthProvider";
import { useBillingStatus } from "@/hooks/useBillingStatus";

export function MemberArticleWriteView() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const billing = useBillingStatus(user?.email, ready);
  const [accessChecked, setAccessChecked] = useState(false);
  const [canWrite, setCanWrite] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/auth?next=/dashboard/articles/write");
    }
  }, [ready, user, router]);

  useEffect(() => {
    const email = user?.email;
    if (!email || billing.loading) return;
    let cancelled = false;
    async function check() {
      try {
        const res = await fetch("/api/articles/write-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = (await res.json()) as { canWriteArticles?: boolean };
        if (!cancelled) {
          setCanWrite(Boolean(data.canWriteArticles));
          setAccessChecked(true);
        }
      } catch {
        if (!cancelled) {
          setCanWrite(false);
          setAccessChecked(true);
        }
      }
    }
    void check();
    return () => {
      cancelled = true;
    };
  }, [user, billing.loading]);

  if (!ready || !user || billing.loading || !accessChecked) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-sm text-vaibee-muted">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-vaibee-border border-t-vaibee-cyan" aria-hidden />
        <p>Checking access…</p>
      </div>
    );
  }

  if (!billing.active) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-6 text-center">
        <h1 className="text-2xl font-semibold text-vaibee-navy">Subscription required</h1>
        <p className="text-sm text-vaibee-muted">Sign in and subscribe before publishing hive articles.</p>
        <Link href="/pricing" className="inline-flex rounded-xl bg-vaibee-navy px-5 py-2.5 text-sm font-semibold text-white">
          View plans
        </Link>
      </div>
    );
  }

  if (!canWrite) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-6">
        <h1 className="text-2xl font-semibold text-vaibee-navy">Vibe team required</h1>
        <p className="text-sm leading-relaxed text-vaibee-muted">
          Publishing long-form articles is included on the <strong>Vibe team</strong> plan ($39/mo). Your current plan is{" "}
          <span className="font-mono text-vaibee-navy">{billing.tier ?? "unknown"}</span>. Use the same email in Stripe
          Checkout, then refresh.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/pricing" className="rounded-xl bg-vaibee-cyan px-5 py-2.5 text-sm font-semibold text-vaibee-navy">
            Upgrade to Vibe team
          </Link>
          <Link href="/dashboard" className="rounded-xl border border-vaibee-border px-5 py-2.5 text-sm font-semibold text-vaibee-navy">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-vaibee-cyan">Hive journal</p>
        <h1 className="text-2xl font-semibold text-vaibee-navy">Write an article</h1>
        <p className="text-sm text-vaibee-muted">
          Signed in as <span className="font-mono text-vaibee-navy">{user.email}</span> · Vibe team
        </p>
      </header>
      <ArticleEditorForm
        mode="member"
        email={user.email}
        initial={{
          title: "",
          excerpt: "",
          bodyText: "",
          author: user.name.trim() || "",
          tags: "",
          slug: "",
        }}
      />
    </div>
  );
}
