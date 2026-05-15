"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { isMarketingHeroRoute } from "@/lib/landing-hero";
import { SignupCtaLink } from "@/components/SignupCtaLink";

/** Pixels scrolled past top before hero nav hides (avoids flicker on tiny moves). */
const HERO_NAV_HIDE_AFTER_SCROLL_PX = 40;

/** Marketing hero routes: GIF reads through the pill; solid white pill on hover or focus-within */
const heroNavLink =
  "rounded-md px-3 py-2 text-white/95 outline-none transition-colors duration-300 [text-shadow:0_2px_10px_rgba(0,0,0,0.72)] group-hover/header:text-vaibee-navy group-hover/header:[text-shadow:none] group-hover/header:hover:bg-[#eef2f8] group-focus-within/header:text-vaibee-navy group-focus-within/header:[text-shadow:none] group-focus-within/header:hover:bg-[#eef2f8] focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent group-hover/header:focus-visible:ring-vaibee-navy/35 group-hover/header:focus-visible:ring-offset-white";

export function MarketingChrome() {
  const pathname = usePathname();
  const isFloatingHero = isMarketingHeroRoute(pathname);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const [heroNavPinned, setHeroNavPinned] = useState(true);

  useEffect(() => {
    setPortalEl(document.body);
  }, []);

  useEffect(() => {
    if (!isFloatingHero) {
      setHeroNavPinned(true);
      return;
    }
    const onScroll = () => {
      setHeroNavPinned(window.scrollY < HERO_NAV_HIDE_AFTER_SCROLL_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isFloatingHero, pathname]);

  const defaultLogo = (
    <Link href="/" className="flex shrink-0 items-center py-2 pr-2">
      <Image
        src="/vaibeelogos.png"
        alt="vAIbee"
        width={160}
        height={88}
        priority
        className="h-9 w-auto max-w-[min(200px,52vw)] bg-transparent object-contain object-left"
      />
    </Link>
  );

  /** Home link as a compact icon-style control inside the hero pill (same box as nav links). */
  const heroLogoIcon = (
    <Link
      href="/"
      aria-label="vAIbee home"
      className="inline-flex h-10 min-w-10 shrink-0 items-center justify-center rounded-xl border border-white/35 bg-white/10 px-2 outline-none transition hover:bg-white/18 focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent group-hover/header:border-black/[0.08] group-hover/header:bg-[#eef2f8] group-hover/header:shadow-sm group-focus-within/header:border-black/[0.08] group-focus-within/header:bg-[#eef2f8] group-hover/header:focus-visible:ring-vaibee-navy/35 group-hover/header:focus-visible:ring-offset-white"
    >
      <Image
        src="/vaibeelogos.png"
        alt=""
        width={120}
        height={66}
        priority
        className="h-7 w-auto max-w-[4.25rem] bg-transparent object-contain object-center drop-shadow-[0_1px_6px_rgba(0,0,0,0.55)] transition-[drop-shadow] duration-300 group-hover/header:drop-shadow-none"
      />
    </Link>
  );

  const nav = (
    <nav className="flex flex-wrap items-center justify-end gap-1 text-sm font-semibold sm:gap-2">
      <Link href="/store" className={isFloatingHero ? heroNavLink : "rounded-full px-3 py-2 text-vaibee-muted transition hover:bg-[#f4f7fb] hover:text-vaibee-navy"}>
        Store
      </Link>
      <Link href="/pricing" className={isFloatingHero ? heroNavLink : "rounded-full px-3 py-2 text-vaibee-muted transition hover:bg-[#f4f7fb] hover:text-vaibee-navy"}>
        Pricing
      </Link>
      <Link href="/about" className={isFloatingHero ? heroNavLink : "rounded-full px-3 py-2 text-vaibee-muted transition hover:bg-[#f4f7fb] hover:text-vaibee-navy"}>
        About
      </Link>
      <Link href="/auth" className={isFloatingHero ? heroNavLink : "rounded-full px-3 py-2 text-vaibee-muted transition hover:bg-[#f4f7fb] hover:text-vaibee-navy"}>
        Log in
      </Link>
      <SignupCtaLink href="/auth?mode=signup" size="sm" variant={isFloatingHero ? "hero" : "default"}>
        Sign up
      </SignupCtaLink>
    </nav>
  );

  if (isFloatingHero) {
    const heroHeader = (
      <header
        className={[
          "fixed left-0 right-0 top-0 z-40 border-0 bg-transparent pt-3 transition-[transform,opacity] duration-300 ease-out sm:pt-4",
          heroNavPinned ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-[calc(100%+0.5rem)] opacity-0",
        ].join(" ")}
        data-marketing-hero-nav
      >
        <div className="mx-auto max-w-6xl px-3 sm:px-6">
          <div
            className={[
              "group/header flex min-h-[3.75rem] w-full flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-2xl border border-transparent bg-transparent px-2 py-1 shadow-none transition-all duration-300 ease-out sm:flex-nowrap sm:px-3",
              "hover:border-black/[0.06] hover:bg-white hover:shadow-md",
              "focus-within:border-black/[0.06] focus-within:bg-white focus-within:shadow-md",
            ].join(" ")}
          >
            {heroLogoIcon}
            {nav}
          </div>
        </div>
      </header>
    );

    return (
      <>
        <div
          className={[
            "overflow-hidden transition-[height] duration-300 ease-out",
            heroNavPinned ? "h-[5rem] sm:h-[5.25rem]" : "h-0",
          ].join(" ")}
          aria-hidden
        />
        {portalEl ? createPortal(heroHeader, portalEl) : null}
      </>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white">
      <div className="mx-auto flex h-[3.75rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {defaultLogo}
        {nav}
      </div>
    </header>
  );
}
