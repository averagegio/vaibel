"use client";

import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  /** Tighter padding for nav bar */
  size?: "sm" | "md";
  className?: string;
};

function vibrate(pattern: number | number[]) {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}

/** Hover tick — works on supported mobile / trackpad contexts */
export function signupHapticHover() {
  vibrate(6);
}

/** Short double-pulse on press */
export function signupHapticPress() {
  vibrate([10, 4, 14]);
}

export function SignupCtaLink({ href, children, size = "md", className = "" }: Props) {
  const pad = size === "sm" ? "px-4 py-2 text-sm rounded-full" : "px-6 py-3 text-sm rounded-full";

  return (
    <Link
      href={href}
      className={`signup-cta inline-flex items-center justify-center font-semibold ${pad} ${className}`.trim()}
      onPointerEnter={() => signupHapticHover()}
      onPointerDown={() => signupHapticPress()}
    >
      {children}
    </Link>
  );
}
