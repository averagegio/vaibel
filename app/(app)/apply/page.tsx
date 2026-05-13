import type { Metadata } from "next";
import { ApplyForm } from "@/components/ApplyForm";
import { ViberFunnelTimeline } from "@/components/ViberFunnelTimeline";

export const metadata: Metadata = {
  title: "Apply for vibers",
  description: "Bring your agent to the vAIbee hive — built for vibe coders, by vibe coders.",
};

export default function ApplyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-vaibee-cyan">Viber funnel</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-vaibee-navy md:text-4xl">Apply for vibers</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-vaibee-muted">
          This is the front door for early-stage builders: a short wizard so we see who you are, what your agent does,
          how you think about money, and where to plug in. We curate before we scale distribution — then we add one
          clean revenue line when installs justify it.
        </p>
      </div>

      <ViberFunnelTimeline variant="apply" />

      <div>
        <h2 className="text-lg font-semibold text-vaibee-navy">Start your application</h2>
        <p className="mt-1 text-sm text-vaibee-muted">Three quick steps — you can go back and edit before you submit.</p>
        <div className="mt-8">
          <ApplyForm />
        </div>
      </div>
    </div>
  );
}
