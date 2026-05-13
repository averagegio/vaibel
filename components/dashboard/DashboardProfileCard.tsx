import type { SessionUser } from "@/components/auth/AuthProvider";
import Image from "next/image";
import Link from "next/link";

function formatMemberSince(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

type Props = {
  user: SessionUser;
  planLabel: string | null;
};

export function DashboardProfileCard({ user, planLabel }: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-vaibee-border bg-vaibee-card shadow-sm">
      <div className="relative h-40 sm:h-48">
        {user.headerDataUrl ? (
          <div className="relative h-full w-full">
            <Image
              src={user.headerDataUrl}
              alt=""
              fill
              className="object-cover"
              unoptimized
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        ) : (
          <div
            className="h-full w-full bg-gradient-to-br from-[#0a1a33] via-[#0d3d52] to-[#12a4b7]"
            aria-hidden
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden />
      </div>

      <div className="relative px-6 pb-6 pt-0 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
            <div className="relative -mt-14 h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-vaibee-card bg-vaibee-surface shadow-md ring-1 ring-black/5 sm:-mt-16 sm:h-32 sm:w-32">
                {user.avatarDataUrl ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={user.avatarDataUrl}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                      sizes="128px"
                    />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[var(--vaibee-cyan-dim)] text-3xl font-semibold text-vaibee-navy sm:text-4xl">
                    {user.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
            </div>
            <div className="min-w-0 pb-1 pt-1 sm:pb-2">
              <h1 className="text-2xl font-semibold tracking-tight text-vaibee-navy sm:text-3xl">{user.name}</h1>
              <p className="mt-1 font-mono text-xs text-vaibee-muted sm:text-sm">{user.email}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-vaibee-cyan">
                Member since {formatMemberSince(user.createdAt)}
              </p>
              {planLabel ? (
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-vaibee-cyan/90">{planLabel}</p>
              ) : null}
            </div>
          </div>
          <Link
            href="/dashboard/profile"
            className="inline-flex shrink-0 items-center justify-center self-start rounded-2xl border border-vaibee-border bg-white px-4 py-2.5 text-sm font-semibold text-vaibee-navy shadow-sm transition hover:border-vaibee-cyan/40 sm:self-auto"
          >
            Edit profile
          </Link>
        </div>
        {user.bio.trim() ? (
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-vaibee-muted">{user.bio.trim()}</p>
        ) : (
          <p className="mt-5 text-sm italic text-vaibee-muted">
            No bio yet — open Edit profile to tell the hive what you ship.
          </p>
        )}
      </div>
    </section>
  );
}
