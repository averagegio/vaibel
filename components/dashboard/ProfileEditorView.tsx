"use client";

import type { SessionUser } from "@/components/auth/AuthProvider";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useBillingStatus } from "@/hooks/useBillingStatus";
import { fileToResizedJpegDataUrl } from "@/lib/client-image";

const BIO_MAX = 480;

function ProfileEditorBody({
  user,
  updateProfile,
  signOut,
  router,
}: {
  user: SessionUser;
  updateProfile: ReturnType<typeof useAuth>["updateProfile"];
  signOut: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      const url = await fileToResizedJpegDataUrl(file, {
        maxWidth: 512,
        maxHeight: 512,
        maxBytes: 220_000,
      });
      if (!url) {
        setErr("Could not compress that image small enough. Try a smaller file or JPG/PNG.");
        return;
      }
      updateProfile({ avatarDataUrl: url });
      setMsg("Profile photo updated.");
    } finally {
      setBusy(false);
    }
  }

  async function onHeaderPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      const url = await fileToResizedJpegDataUrl(file, {
        maxWidth: 1600,
        maxHeight: 480,
        maxBytes: 420_000,
      });
      if (!url) {
        setErr("Could not compress the header image enough. Try a wider, shorter image under ~2MB.");
        return;
      }
      updateProfile({ headerDataUrl: url });
      setMsg("Header image updated.");
    } finally {
      setBusy(false);
    }
  }

  function onSaveText(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    updateProfile({ name: name.trim() || user.name, bio: bio.slice(0, BIO_MAX) });
    setMsg("Profile saved.");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-vaibee-cyan">Profile</p>
        <h1 className="text-3xl font-semibold tracking-tight text-vaibee-navy">Edit your hive card</h1>
        <p className="text-sm text-vaibee-muted">
          Photos stay in this browser (demo storage). Swap for cloud uploads when you wire production auth.
        </p>
      </header>

      {msg ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{msg}</p>
      ) : null}
      {err ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">{err}</p>
      ) : null}

      <section className="overflow-hidden rounded-3xl border border-vaibee-border bg-vaibee-card shadow-sm">
        <div className="relative h-36 sm:h-44">
          {user.headerDataUrl ? (
            <div className="relative h-full w-full">
              <Image
                src={user.headerDataUrl}
                alt=""
                fill
                className="object-cover"
                unoptimized
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#0a1a33] via-[#0d3d52] to-[#12a4b7]" aria-hidden />
          )}
        </div>
        <div className="space-y-6 px-6 py-6 sm:px-8">
          <div className="flex flex-wrap items-end gap-4">
            <div className="relative -mt-20 h-24 w-24 overflow-hidden rounded-2xl border-4 border-vaibee-card bg-vaibee-surface shadow-md sm:h-28 sm:w-28">
              {user.avatarDataUrl ? (
                <div className="relative h-full w-full">
                  <Image
                    src={user.avatarDataUrl}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="112px"
                  />
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[var(--vaibee-cyan-dim)] text-2xl font-semibold text-vaibee-navy">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 pb-1">
              <label className="cursor-pointer rounded-xl border border-vaibee-border bg-white px-3 py-2 text-xs font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40">
                {busy ? "Working…" : "Change photo"}
                <input type="file" accept="image/*" className="sr-only" onChange={onAvatarPick} disabled={busy} />
              </label>
              {user.avatarDataUrl ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    updateProfile({ avatarDataUrl: null });
                    setMsg("Profile photo removed.");
                  }}
                  className="rounded-xl border border-vaibee-border px-3 py-2 text-xs font-semibold text-vaibee-muted transition hover:text-vaibee-navy disabled:opacity-50"
                >
                  Remove photo
                </button>
              ) : null}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-vaibee-muted">Header image</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <label className="cursor-pointer rounded-xl border border-vaibee-border bg-white px-3 py-2 text-xs font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40">
                {busy ? "Working…" : "Upload header"}
                <input type="file" accept="image/*" className="sr-only" onChange={onHeaderPick} disabled={busy} />
              </label>
              {user.headerDataUrl ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    updateProfile({ headerDataUrl: null });
                    setMsg("Header image removed.");
                  }}
                  className="rounded-xl border border-vaibee-border px-3 py-2 text-xs font-semibold text-vaibee-muted transition hover:text-vaibee-navy disabled:opacity-50"
                >
                  Remove header
                </button>
              ) : null}
            </div>
          </div>

          <form className="space-y-4" onSubmit={onSaveText}>
            <label className="block text-sm font-medium text-vaibee-navy">
              Display name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                className="mt-1.5 w-full rounded-2xl border border-vaibee-border bg-white px-3 py-3 text-sm outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
              />
            </label>
            <label className="block text-sm font-medium text-vaibee-navy">
              Bio
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
                rows={4}
                maxLength={BIO_MAX}
                placeholder="What you build, what agents you run, what vibe you ship with…"
                className="mt-1.5 w-full resize-y rounded-2xl border border-vaibee-border bg-white px-3 py-3 text-sm outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
              />
              <span className="mt-1 block text-xs text-vaibee-muted">
                {bio.length}/{BIO_MAX} characters
              </span>
            </label>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={busy}
                className="rounded-2xl bg-vaibee-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft disabled:opacity-50"
              >
                Save name & bio
              </button>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-2xl border border-vaibee-border px-5 py-3 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
              >
                Back to dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
                className="inline-flex items-center justify-center rounded-2xl border border-transparent px-3 py-3 text-sm font-semibold text-vaibee-muted underline-offset-2 hover:text-vaibee-navy hover:underline"
              >
                Sign out
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export function ProfileEditorView() {
  const router = useRouter();
  const { user, ready, signOut, updateProfile } = useAuth();
  const billing = useBillingStatus(user?.email, ready);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/auth?next=/dashboard/profile");
    }
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-sm text-vaibee-muted">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-vaibee-border border-t-vaibee-cyan" aria-hidden />
        <p>Loading…</p>
      </div>
    );
  }

  if (billing.loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-sm text-vaibee-muted">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-vaibee-border border-t-vaibee-cyan" aria-hidden />
        <p>Checking your subscription…</p>
      </div>
    );
  }

  if (!billing.active) {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-6 text-center">
        <h1 className="text-2xl font-semibold text-vaibee-navy">Subscription required</h1>
        <p className="text-sm text-vaibee-muted">Profile editing is available once your plan is active.</p>
        <Link
          href="/pricing"
          className="inline-flex rounded-2xl bg-vaibee-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft"
        >
          View plans
        </Link>
      </div>
    );
  }

  return (
    <ProfileEditorBody
      key={user.email}
      user={user}
      updateProfile={updateProfile}
      signOut={signOut}
      router={router}
    />
  );
}
