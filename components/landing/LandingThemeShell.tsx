"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "vaibel-landing-theme";

export type LandingTheme = "light" | "dark";

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

export function LandingThemeShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<LandingTheme>("light");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "dark" || stored === "light") setTheme(stored);
    } catch {
      /* private mode */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme, hydrated]);

  const isDark = theme === "dark";

  return (
    <div
      className="landing-theme-root min-w-0 bg-[var(--lp-bg)] text-[var(--lp-text)] transition-[background-color,color] duration-300 ease-out"
      data-landing-theme={theme}
    >
      <div className="relative z-20 mx-auto flex w-full max-w-[min(100%,88rem)] justify-end px-4 pb-3 pt-0 sm:px-8 lg:px-12">
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={[
            "inline-flex h-10 w-10 items-center justify-center rounded-full border border-solid shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-vaibee-cyan/50 focus-visible:ring-offset-2",
            isDark
              ? "border-white/15 bg-neutral-950 text-amber-200 ring-offset-black hover:bg-neutral-900 focus-visible:ring-offset-neutral-950"
              : "border-black/10 bg-white text-vaibee-navy ring-offset-white hover:bg-[#f4f7fb]",
          ].join(" ")}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>
      </div>
      {children}
    </div>
  );
}
