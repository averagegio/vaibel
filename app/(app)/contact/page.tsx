import type { Metadata } from "next";
import { BackButton } from "@/components/BackButton";
import { InquiryForm, type InquiryField } from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to the vAIbee team — support, partnerships, press, or general questions.",
};

const FIELDS: InquiryField[] = [
  { name: "name", label: "Your name", required: true, placeholder: "Ada Lovelace" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "you@studio.dev" },
  {
    name: "topic",
    label: "What's this about?",
    type: "select",
    required: true,
    placeholder: "Pick a topic",
    options: [
      { value: "general", label: "General" },
      { value: "support", label: "Support" },
      { value: "partnership", label: "Partnership" },
      { value: "press", label: "Press" },
      { value: "billing", label: "Billing" },
      { value: "other", label: "Other" },
    ],
  },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    required: true,
    minLength: 10,
    rows: 6,
    placeholder: "How can we help?",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <BackButton fallbackHref="/" fallbackLabel="Home" />

      <header className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vaibee-cyan">Contact</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-vaibee-navy md:text-4xl">Get in touch</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-vaibee-muted">
          Questions, partnerships, or press — send a note and we&apos;ll route it to the right corner of the hive.
        </p>
      </header>

      <div className="mt-10 rounded-3xl border border-vaibee-border bg-vaibee-card p-8 shadow-sm md:p-10">
        <InquiryForm
          endpoint="/api/contact"
          fields={FIELDS}
          submitLabel="Send message"
          successTitle="Message sent."
          successBody="Thanks for reaching out — we&apos;ll reply to your email soon."
        />
      </div>
    </div>
  );
}
