"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LANDING_INTRO_FADE_DISTANCE_PX } from "@/lib/landing-hero";

/**
 * Full-viewport opening: edge-to-edge vaibo.gif, headline, CTA. Fades on scroll.
 */
export function LandingIntroHero() {
  const [fade, setFade] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setFade(Math.min(1, Math.max(0, window.scrollY / LANDING_INTRO_FADE_DISTANCE_PX)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const opacity = 1 - fade;
  const hidden = opacity < 0.04;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[25] overflow-hidden"
      style={{
        opacity,
        visibility: hidden ? "hidden" : "visible",
        transform: `translateY(${fade * -24}px)`,
      }}
      aria-hidden={hidden}
    >
      <div className="absolute inset-0">
        {/* px-3 below sm only; desktop img fills viewport with cover */}
        <div className="flex h-full w-full items-start justify-center px-3 sm:block sm:p-0">
          <img
            src="/vaibo.gif"
            alt=""
            className="h-auto max-h-[100dvh] w-full object-contain object-top sm:absolute sm:inset-0 sm:h-full sm:max-h-none sm:w-full sm:object-cover sm:object-center"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,7,18,0.35) 0%, rgba(3,7,18,0.12) 40%, rgba(3,7,18,0.55) 78%, rgba(3,7,18,0.82) 100%)",
        }}
        aria-hidden
      />

      <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-10 flex w-full flex-col items-center px-3 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-16 text-center sm:px-4 sm:pb-10">
        <h1 className="landing-intro-title max-w-3xl text-white/88 [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]">
          vibe agent store
        </h1>

        <Link
          href="/store"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-medium tracking-wide text-white/95 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.5)] backdrop-blur-md transition hover:border-white/50 hover:bg-white/18 active:scale-[0.98] sm:text-[0.8125rem]"
        >
          Agent store
          <span className="text-[0.65rem] text-white/70" aria-hidden>
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
