"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isMarketingHeroRoute } from "@/lib/landing-hero";
import { SignupCtaLink } from "@/components/SignupCtaLink";

/** Marketing hero routes: GIF reads through the pill; solid white pill on hover or focus-within */
const heroNavLink =
  "rounded-md px-3 py-2 text-white/95 outline-none transition-colors duration-300 [text-shadow:0_2px_10px_rgba(0,0,0,0.72)] group-hover/header:text-vaibee-navy group-hover/header:[text-shadow:none] group-hover/header:hover:bg-[#eef2f8] group-focus-within/header:text-vaibee-navy group-focus-within/header:[text-shadow:none] group-focus-within/header:hover:bg-[#eef2f8] focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent group-hover/header:focus-visible:ring-vaibee-navy/35 group-hover/header:focus-visible:ring-offset-white";

export function MarketingChrome() {
  const pathname = usePathname();
  const isFloatingHero = isMarketingHeroRoute(pathname);

  const logo = (
    <Link href="/" className="flex shrink-0 items-center py-2 pr-2">
      <Image
        src="/vaibee-header.png"
        alt="vAIbee"
        width={200}
        height={48}
        priority
        className={[
          "h-9 w-auto max-w-[min(200px,52vw)] object-contain object-left transition-[drop-shadow] duration-300",
          isFloatingHero ? "drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] group-hover/header:drop-shadow-none" : "",
        ].join(" ")}
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

  return (
    <header
      className={[
        "sticky top-0 z-30",
        isFloatingHero ? "border-0 bg-transparent pt-3 sm:pt-4" : "border-b border-black/[0.06] bg-white",
      ].join(" ")}
    >
      {isFloatingHero ? (
        <div className="mx-auto max-w-6xl px-3 sm:px-6">
          <div
            className={[
              "group/header flex min-h-[3.75rem] w-full flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-2xl border border-transparent bg-transparent px-2 py-1 shadow-none transition-all duration-300 ease-out sm:flex-nowrap sm:px-3",
              "hover:border-black/[0.06] hover:bg-white hover:shadow-md",
              "focus-within:border-black/[0.06] focus-within:bg-white focus-within:shadow-md",
            ].join(" ")}
          >
            {logo}
            {nav}
          </div>
        </div>
      ) : (
        <div className="mx-auto flex h-[3.75rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          {logo}
          {nav}
        </div>
      )}
    </header>
  );
}
