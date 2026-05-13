"use client";

import { usePathname } from "next/navigation";
import { LANDING_HERO_BAND } from "@/lib/landing-hero";

/**
 * Top-of-viewport GIF bleed for `/` only: ~upper third of the viewport, fixed under the nav.
 * No gradient overlay. Content below scrolls over solid white (see landing page).
 */
export function HomeLandingBackdrop() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-[3.75rem] z-0 overflow-hidden border-b border-black/20 shadow-[inset_0_-1px_0_rgba(255,255,255,0.06)]"
      style={{ height: LANDING_HERO_BAND }}
      aria-hidden
    >
      <img
        src="/vaibeestatic1.gif"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_35%] sm:object-center"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
