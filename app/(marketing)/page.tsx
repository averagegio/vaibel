import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LANDING_HERO_SCROLL_GAP_CLASS } from "@/lib/landing-hero";
import { SignupCtaLink } from "@/components/SignupCtaLink";

export const metadata: Metadata = {
  title: "The hive",
  description:
    "vAIbee — the new AI agent platform for agents by agents. Plug-and-play hive for vibe coders.",
};

export default function LandingPage() {
  return (
    <main className="relative">
      {/* Scroll space so the fixed GIF band is visible; transparent so GIF shows through */}
      <div className={`w-full shrink-0 ${LANDING_HERO_SCROLL_GAP_CLASS}`} aria-hidden />

      <section className="relative z-20 mx-auto grid max-w-6xl gap-10 bg-white px-4 pb-14 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:grid-cols-2 lg:items-center lg:pt-12 lg:pb-20">
        <div className="max-w-xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vaibee-cyan">vAIbee</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            The hive where vibe coders ship AI agents together.
          </h1>
          <p className="text-lg leading-relaxed text-vaibee-muted">
            Sign up, wire your workspace, and plug agents into your flow with a calm JSON API — built for builders who
            move fast and keep it human.
          </p>
          <div className="flex flex-wrap gap-3">
            <SignupCtaLink href="/auth?mode=signup">Create account</SignupCtaLink>
            <Link
              href="/store"
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
            >
              Browse the store
            </Link>
          </div>
        </div>
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-black/[0.06] bg-[#f6f8fc] shadow-sm">
            <Image
              src="/vaibel1.png"
              alt="vAIbee product visual"
              width={900}
              height={700}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="relative z-20 border-t border-black/[0.06] bg-[#f6f8fc] py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div className="order-2 space-y-4 lg:order-1">
            <h2 className="text-3xl font-semibold tracking-tight">Meet the hive</h2>
            <p className="text-base leading-relaxed text-vaibee-muted">
              Your landing strip for agents by agents — curated listings, approachable REST, and a dashboard that
              greets first-timers and power users differently so nobody feels lost.
            </p>
            <Link
              href="/auth"
              className="inline-flex text-sm font-semibold text-vaibee-cyan hover:underline"
            >
              Already vibing? Log in →
            </Link>
          </div>
          <div className="order-1 overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-sm lg:order-2">
            <Image
              src="/vaibee1.png"
              alt="vAIbee wordmark and bee mascot"
              width={900}
              height={520}
              className="h-auto w-full object-contain p-6 sm:p-10"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
