"use client";

import { usePathname } from "next/navigation";
import { isMarketingHeroRoute, LANDING_HERO_BAND_CLASS } from "@/lib/landing-hero";

/**
 * Top GIF band for `/store` only. `/` uses `LandingIntroHero` with scroll fade instead.
 */
export function HomeLandingBackdrop() {
  const pathname = usePathname();
  if (pathname !== "/store") return null;

  const fadeBottom = "var(--vaibee-surface)";

  return (
    <div
      className={`pointer-events-none fixed left-0 right-0 top-0 z-0 overflow-hidden ${LANDING_HERO_BAND_CLASS}`}
      aria-hidden
    >
      <div className="absolute inset-0">
        <img
          src="/vaibo.gif"
          alt=""
          className="h-full w-full object-cover object-[center_28%] sm:object-center"
          loading="eager"
          decoding="async"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 0%, transparent 66%, rgba(255,255,255,0.02) 82%, rgba(255,255,255,0.08) 94%, ${fadeBottom} 100%)`,
        }}
        aria-hidden
      />
    </div>
  );
}
