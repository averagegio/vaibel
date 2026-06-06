import type { Metadata } from "next";
import { BackButton } from "@/components/BackButton";
import { InquiryForm, type InquiryField } from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Careers",
  description: "Help build the agent store for agents. Open roles and how to reach the vAIbee team.",
};

const FIELDS: InquiryField[] = [
  { name: "name", label: "Your name", required: true, placeholder: "Grace Hopper" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "you@studio.dev" },
  {
    name: "role",
    label: "Area",
    type: "select",
    required: true,
    placeholder: "Where do you fit?",
    options: [
      { value: "engineering", label: "Engineering" },
      { value: "design", label: "Design" },
      { value: "growth", label: "Growth / Marketing" },
      { value: "operations", label: "Operations" },
      { value: "community", label: "Community" },
      { value: "other", label: "Other" },
    ],
  },
  {
    name: "links",
    label: "Portfolio / GitHub / LinkedIn",
    type: "url",
    placeholder: "https://github.com/you",
  },
  {
    name: "pitch",
    label: "Why vAIbee?",
    type: "textarea",
    required: true,
    minLength: 30,
    rows: 6,
    placeholder: "Tell us what you'd build and why you're a fit.",
  },
];

const PERKS = [
  "Remote-first, async-friendly",
  "Ship real product weekly",
  "Work directly with the founder",
  "Equity for early builders",
] as const;

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <BackButton fallbackHref="/" fallbackLabel="Home" />

      <header className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vaibee-cyan">Careers</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-vaibee-navy md:text-4xl">
          Build the hive with us
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-vaibee-muted">
          We&apos;re a small team shipping the agent store for agents. We don&apos;t always have open seats, but we
          always read great intros — tell us how you&apos;d help and we&apos;ll reach out when there&apos;s a fit.
        </p>
      </header>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        {PERKS.map((perk) => (
          <div
            key={perk}
            className="flex items-center gap-3 rounded-2xl border border-vaibee-border bg-vaibee-surface px-4 py-3 text-sm font-medium text-vaibee-navy"
          >
            <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-vaibee-cyan" aria-hidden />
            {perk}
          </div>
        ))}
      </section>

      <div className="mt-10 rounded-3xl border border-vaibee-border bg-vaibee-card p-8 shadow-sm md:p-10">
        <h2 className="text-lg font-semibold text-vaibee-navy">Introduce yourself</h2>
        <p className="mt-1 text-sm text-vaibee-muted">No open req needed — we keep great intros on file.</p>
        <div className="mt-6">
          <InquiryForm
            endpoint="/api/careers"
            fields={FIELDS}
            submitLabel="Submit intro"
            successTitle="Intro received."
            successBody="Thanks — we'll reach out by email if there's a fit."
          />
        </div>
      </div>
    </div>
  );
}
