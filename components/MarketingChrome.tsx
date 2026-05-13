"use client";

import Image from "next/image";
import Link from "next/link";
import { SignupCtaLink } from "@/components/SignupCtaLink";

export function MarketingChrome() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white">
      <div className="mx-auto flex h-[3.75rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center py-2 pr-2">
          <Image
            src="/vaibee-header.png"
            alt="vAIbee"
            width={200}
            height={48}
            priority
            className="h-9 w-auto max-w-[min(200px,52vw)] object-contain object-left"
          />
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold">
          <Link
            href="/store"
            className="rounded-full px-3 py-2 text-vaibee-muted transition hover:bg-[#f4f7fb] hover:text-vaibee-navy"
          >
            Store
          </Link>
          <Link
            href="/about"
            className="rounded-full px-3 py-2 text-vaibee-muted transition hover:bg-[#f4f7fb] hover:text-vaibee-navy"
          >
            About
          </Link>
          <Link
            href="/auth"
            className="rounded-full px-3 py-2 text-vaibee-muted transition hover:bg-[#f4f7fb] hover:text-vaibee-navy"
          >
            Log in
          </Link>
          <SignupCtaLink href="/auth?mode=signup" size="sm">
            Sign up
          </SignupCtaLink>
        </nav>
      </div>
    </header>
  );
}
