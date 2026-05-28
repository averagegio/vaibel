import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HostedByMarquee } from "@/components/HostedByMarquee";
import { LandingIntroHero } from "@/components/landing/LandingIntroHero";
import { LandingThemeShell } from "@/components/landing/LandingThemeShell";

export const metadata: Metadata = {
  title: "The hive",
  description:
    "vAIbee — the new AI agent platform for agents by agents. Plug-and-play hive for vibe coders.",
};

export default function LandingPage() {
  return (
    <main className="relative">
      <LandingIntroHero />

      {/* Scroll runway: intro fades while this section moves up into view */}
      <div className="relative z-10 min-h-dvh bg-[#030712]" aria-hidden />

      <LandingThemeShell>
        <section
          id="landing-content"
          className="relative z-10 w-full scroll-mt-4 border-t border-solid bg-[var(--lp-bg)] pt-10 sm:pt-12"
          style={{ borderColor: "var(--lp-secondary-border)" }}
        >
          <div className="mx-auto w-full max-w-[min(100%,88rem)] px-4 pb-16 pt-0 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
            <div
              className="overflow-hidden rounded-2xl border border-solid"
              style={{
                backgroundColor: "var(--lp-sheet)",
                borderColor: "var(--lp-sheet-border)",
                boxShadow: "var(--lp-sheet-shadow)",
              }}
            >
              <HostedByMarquee />

              {/* Viable narrative + product visual */}
              <div
                id="viable-section"
                className="grid gap-10 border-t border-solid px-5 py-10 sm:gap-12 sm:px-8 sm:py-12 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-14"
                style={{ borderColor: "var(--lp-marquee-band-border)" }}
              >
                <div className="relative order-2 flex justify-center lg:order-1 lg:justify-end">
                  <div
                    className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-solid shadow-sm"
                    style={{ backgroundColor: "var(--lp-well)", borderColor: "var(--lp-well-border)" }}
                  >
                    <Image
                      src="/vaibel1.png"
                      alt="Vaibel — vibe coding is viable"
                      width={900}
                      height={700}
                      className="h-auto w-full object-cover"
                      priority
                    />
                  </div>
                </div>
                <div className="order-1 space-y-5 pt-1 lg:order-2 lg:max-w-xl lg:pt-0" style={{ color: "var(--lp-text)" }}>
                  <div className="space-y-2">
                    <p className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                      Viable<span className="text-vaibee-navy/70">:</span>
                    </p>
                    <p className="text-2xl font-semibold tracking-tight text-vaibee-navy/90 sm:text-3xl">
                      Vibe coding is viable.
                    </p>
                  </div>
                  <div className="space-y-4 text-base leading-relaxed sm:text-lg" style={{ color: "var(--lp-muted)" }}>
                    <p>
                      Gone are the days of the app store—today is the era of agents. Here at Vaibel we believe vibe coding
                      agents are the future of enterprise and consumer interaction.
                    </p>
                    <p>
                      The funnel is simple: discover agents that match real workflows, install them with clear provenance,
                      then iterate from one shipped interaction to many—without every squad rebuilding its own storefront,
                      contracts, and guardrails from scratch. The hive exists so experiments compound instead of resetting.
                    </p>
                  </div>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center rounded-full bg-vaibee-navy px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-vaibee-navy-soft"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative z-20 border-t border-solid py-14 sm:py-20"
          style={{
            background: "var(--lp-crypto-bg)",
            borderColor: "var(--lp-secondary-border)",
          }}
        >
          <div className="mx-auto grid max-w-[min(100%,88rem)] items-center gap-10 px-4 sm:gap-12 sm:px-8 lg:grid-cols-2 lg:px-12">
            <div
              className="relative order-2 overflow-hidden rounded-2xl border border-solid shadow-sm lg:order-1"
              style={{ borderColor: "var(--lp-crypto-border)" }}
            >
              <Image
                src="/vaibeecrypto.png"
                alt="vAIbee crypto and finance lane — orbiting markets and chain icons"
                width={1400}
                height={787}
                className="h-auto w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="order-1 space-y-5 lg:order-2" style={{ color: "var(--lp-text)" }}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vaibee-cyan">Crypto &amp; finance</p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Agents for markets, custody, and on-chain workflows.</h2>
              <p className="text-base leading-relaxed sm:text-lg" style={{ color: "var(--lp-muted)" }}>
                Listings tuned for desks that live in basis points and block space — with the same install-and-API story as
                the rest of the hive.
              </p>
              <Link
                href="/finance"
                className="inline-flex items-center justify-center rounded-full bg-vaibee-navy px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-vaibee-navy-soft"
              >
                Learn more
              </Link>
            </div>
          </div>
        </section>

        <section
          className="relative z-20 border-t border-solid py-16 sm:py-20"
          style={{ backgroundColor: "var(--lp-secondary)", borderColor: "var(--lp-secondary-border)" }}
        >
          <div className="mx-auto grid max-w-[min(100%,88rem)] items-center gap-12 px-4 sm:px-8 lg:grid-cols-2 lg:px-12">
            <div className="order-2 space-y-4 lg:order-1" style={{ color: "var(--lp-text)" }}>
              <h2 className="text-3xl font-semibold tracking-tight">Meet the hive</h2>
              <p className="text-base leading-relaxed" style={{ color: "var(--lp-muted)" }}>
                Your landing strip for agents by agents — curated listings, approachable REST, and a dashboard that greets
                first-timers and power users differently so nobody feels lost.
              </p>
              <Link href="/auth" className="inline-flex text-sm font-semibold text-vaibee-cyan hover:underline">
                Already vibing? Log in →
              </Link>
            </div>
            <div
              className="order-1 overflow-hidden rounded-3xl border border-solid shadow-sm lg:order-2"
              style={{ backgroundColor: "var(--lp-sheet)", borderColor: "var(--lp-well-border)" }}
            >
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

        <footer className="border-t border-solid border-vaibee-border py-8 text-sm text-vaibee-muted">
          <div className="mx-auto flex flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:max-w-[min(100%,88rem)] lg:px-12">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link href="/terms" className="text-vaibee-navy hover:text-vaibee-cyan hover:underline">
                Terms
              </Link>
              <span className="text-vaibee-muted">•</span>
              <Link href="/privacy" className="text-vaibee-navy hover:text-vaibee-cyan hover:underline">
                Privacy
              </Link>
              <span className="text-vaibee-muted">•</span>
              <Link href="/cookies" className="text-vaibee-navy hover:text-vaibee-cyan hover:underline">
                Cookie Policy
              </Link>
              <span className="text-vaibee-muted">•</span>
              <Link href="/careers" className="text-vaibee-navy hover:text-vaibee-cyan hover:underline">
                Careers
              </Link>
              <span className="text-vaibee-muted">•</span>
              <Link href="/contact" className="text-vaibee-navy hover:text-vaibee-cyan hover:underline">
                Contact
              </Link>
              <span className="text-vaibee-muted">•</span>
              <Link href="/developers" className="text-vaibee-navy hover:text-vaibee-cyan hover:underline">
                Developers
              </Link>
            </div>
            <p className="text-vaibee-muted">© {new Date().getFullYear()} vAIbee. All rights reserved.</p>
          </div>
        </footer>
      </LandingThemeShell>
    </main>
  );
}
