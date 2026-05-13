import type { Metadata } from "next";
import { ApplyForm } from "@/components/ApplyForm";

export const metadata: Metadata = {
  title: "Apply for vibers",
  description: "Bring your agent to the vAIbee hive — built for vibe coders, by vibe coders.",
};

export default function ApplyPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-vaibee-cyan">Contact</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-vaibee-navy md:text-4xl">Apply for vibers</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-vaibee-muted">
        Tell us who you are, drop your co-founder&apos;s email, upload a logo, and share the API we should integrate.
        We read every application between shipping sessions.
      </p>
      <div className="mt-10">
        <ApplyForm />
      </div>
    </div>
  );
}
