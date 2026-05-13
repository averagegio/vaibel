"use client";

import { usePathname } from "next/navigation";
import { isMarketingHeroRoute, LANDING_HERO_BAND_CLASS } from "@/lib/landing-hero";

/**
 * Top GIF for `/` and `/store`: tall band behind the floating nav; soft gradient ends in white on `/` and `--vaibee-surface` on `/store`.
 */
export function HomeLandingBackdrop() {
  const pathname = usePathname();
  if (!isMarketingHeroRoute(pathname)) return null;

  const fadeBottom = pathname === "/" ? "#ffffff" : "var(--vaibee-surface)";

  return (
    <div
      className={`pointer-events-none fixed left-0 right-0 top-0 z-0 overflow-hidden ${LANDING_HERO_BAND_CLASS}`}
      aria-hidden
    >
      <div className="absolute inset-0">
        <img
          src="/vaibeestatic1.gif"
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
