"use client";

import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  /** Tighter padding for nav bar */
  size?: "sm" | "md";
  className?: string;
  /** Home hero: blends on video; matches solid bar when parent `group/header` is hovered/focused */
  variant?: "default" | "hero";
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

export function SignupCtaLink({
  href,
  children,
  size = "md",
  className = "",
  variant = "default",
}: Props) {
  const pad = size === "sm" ? "px-4 py-2 text-sm rounded-full" : "px-6 py-3 text-sm rounded-full";

  if (variant === "hero") {
    return (
      <Link
        href={href}
        className={[
          "inline-flex items-center justify-center font-semibold",
          pad,
          "rounded-full border border-transparent bg-transparent text-white/95 outline-none transition-all duration-300",
          "[text-shadow:0_2px_10px_rgba(0,0,0,0.72)]",
          "group-hover/header:border-vaibee-navy group-hover/header:bg-vaibee-navy group-hover/header:text-white group-hover/header:[text-shadow:none]",
          "group-focus-within/header:border-vaibee-navy group-focus-within/header:bg-vaibee-navy group-focus-within/header:text-white group-focus-within/header:[text-shadow:none]",
          "focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          "group-hover/header:focus-visible:ring-vaibee-navy/40 group-hover/header:focus-visible:ring-offset-white",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        onPointerEnter={() => signupHapticHover()}
        onPointerDown={() => signupHapticPress()}
      >
        {children}
      </Link>
    );
  }

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
