"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

const nav = [
  { href: "/store", label: "Agent store" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About us" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/api-docs", label: "REST API" },
  { href: "/apply", label: "Apply for vibers" },
  { href: "/admin/articles", label: "Admin · articles" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-dvh bg-vaibee-surface text-vaibee-navy">
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#0a1128]/35 backdrop-blur-[2px] md:hidden"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        id="app-sidebar"
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col border-r border-black/[0.06] bg-vaibee-card shadow-sm transition-transform duration-200 md:static md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="border-b border-black/[0.06] bg-white px-4 py-3">
          <Link href="/" className="flex items-center py-1" onClick={() => setSidebarOpen(false)}>
            <Image
              src="/vaibee-header.png"
              alt="vAIbee"
              width={200}
              height={48}
              priority
              className="h-10 w-auto max-w-[11.5rem] object-contain object-left"
            />
          </Link>
        </div>

        <div className="px-3 py-4">
          {user ? (
            <div className="rounded-2xl border border-vaibee-border bg-vaibee-surface px-3 py-3">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-vaibee-border bg-white">
                  {user.avatarDataUrl ? (
                    <Image
                      src={user.avatarDataUrl}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                      sizes="44px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[var(--vaibee-cyan-dim)] text-sm font-bold text-vaibee-navy">
                      {user.name.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-vaibee-navy">{user.name}</p>
                  <p className="truncate text-xs text-vaibee-muted">{user.email}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Link
                  href="/auth"
                  className="flex-1 rounded-xl border border-vaibee-border bg-white px-2 py-2 text-center text-xs font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
                >
                  Switch account
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="flex-1 rounded-xl bg-vaibee-navy px-2 py-2 text-xs font-semibold text-white transition hover:bg-vaibee-navy-soft"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/auth"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-vaibee-border bg-vaibee-surface px-3 py-2.5 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/50 hover:shadow-[0_0_0_3px_var(--vaibee-cyan-dim)]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Log in
            </Link>
          )}
          {!user ? (
            <p className="mt-2 px-1 text-xs text-vaibee-muted">Create a viber account to personalize your hive.</p>
          ) : null}
        </div>

        <nav className="flex-1 space-y-1 px-3 pb-6">
          {nav.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : item.href === "/dashboard/profile"
                  ? pathname.startsWith("/dashboard/profile")
                  : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "block rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-[var(--vaibee-cyan-dim)] text-vaibee-navy ring-1 ring-vaibee-cyan/30"
                    : "text-vaibee-muted hover:bg-vaibee-surface hover:text-vaibee-navy",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-vaibee-border px-4 py-4 text-xs text-vaibee-muted">
          Plug-and-play agents for vibe coders, by vibe coders.
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col md:pl-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-vaibee-border bg-vaibee-card/90 px-4 py-3 backdrop-blur md:hidden">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-vaibee-border bg-vaibee-surface text-vaibee-navy hover:border-vaibee-cyan/40"
            aria-expanded={sidebarOpen}
            aria-controls="app-sidebar"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <span className="sr-only">Open navigation</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-vaibee-navy">vAIbee</p>
            <p className="truncate text-xs text-vaibee-muted">AI agent app store</p>
          </div>
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-xl bg-vaibee-navy px-3 py-2 text-xs font-semibold text-white"
            >
              Hive
            </Link>
          ) : (
            <Link href="/auth" className="rounded-xl bg-vaibee-navy px-3 py-2 text-xs font-semibold text-white">
              Log in
            </Link>
          )}
        </header>

        <main className="flex-1 px-4 py-8 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
