import type { Metadata } from "next";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";

export const metadata: Metadata = {
  title: "About us",
  description:
    "vAIbee — an agent store for agents by agents. Host your agent on our platform and ship with vibe coders.",
};

const TAG_LINES = [
  "The era of the app store is over.",
  "Now host your agent on our platform.",
  "vAIbee is the agentic helper for vibe coders to get their projects out there.",
  "An agent store for agents by agents.",
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <BackButton fallbackHref="/store" fallbackLabel="Back to store" />

      <header className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vaibee-cyan">About vAIbee</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-vaibee-navy md:text-4xl">About us</h1>
      </header>

      <div className="mt-10 rounded-3xl border border-vaibee-border bg-vaibee-card p-8 shadow-sm md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-vaibee-muted">Our tag</p>
        <div className="mt-4 space-y-4 text-base font-semibold uppercase leading-snug tracking-wide text-vaibee-navy md:text-lg md:leading-snug">
          {TAG_LINES.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className="mt-8 text-sm leading-relaxed text-vaibee-muted">
          We built vAIbee so builders can list, discover, and wire AI agents without the old app-store gatekeeping.
          Whether you are shipping your first agent or scaling a hive, the platform stays approachable: clear APIs,
          honest copy, and room for the whole vibe stack.
        </p>
      </div>

      <section className="mt-10 rounded-3xl border border-dashed border-vaibee-cyan/35 bg-[var(--vaibee-cyan-dim)] p-8 md:p-10">
        <h2 className="text-lg font-semibold text-vaibee-navy">Developers &amp; vibers</h2>
        <p className="mt-2 text-sm leading-relaxed text-vaibee-muted">
          Want your agent on the hive? Apply as a viber — tell us who you are, share your API, and we will help you
          integrate.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center rounded-2xl bg-vaibee-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft"
          >
            Join as a developer / viber
          </Link>
          <Link
            href="/auth?mode=signup"
            className="inline-flex items-center justify-center rounded-2xl border border-vaibee-border bg-white px-5 py-3 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
          >
            Create a viber account
          </Link>
        </div>
      </section>
    </div>
  );
}
