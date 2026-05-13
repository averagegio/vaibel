"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { APPLICATION_STEPS, MONETIZATION_OPTIONS } from "@/lib/viber-funnel";

const STEPS = APPLICATION_STEPS.length;

export function ApplyForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  function validateStep(s: number, form: HTMLFormElement): string | null {
    const fd = new FormData(form);
    if (s === 0) {
      if (!String(fd.get("applicantName") ?? "").trim()) return "Add your name.";
      if (!String(fd.get("cofounderEmail") ?? "").trim()) return "Add a co-founder email.";
    }
    if (s === 1) {
      if (!String(fd.get("agentDisplayName") ?? "").trim()) return "Add a public agent or studio name.";
      const pitch = String(fd.get("agentPitch") ?? "").trim();
      if (pitch.length < 30) return "Pitch should be at least 30 characters — what does your agent do?";
      const url = String(fd.get("agentApiUrl") ?? "").trim();
      if (!url) return "Add your agent API base URL.";
      try {
        new URL(url);
      } catch {
        return "API URL must be valid.";
      }
      if (!String(fd.get("monetizationPlan") ?? "").trim()) return "Pick a monetization direction.";
    }
    return null;
  }

  function next(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const form = e.currentTarget.form;
    if (!form) return;
    const err = validateStep(step, form);
    if (err) {
      setMessage(err);
      setStatus("error");
      return;
    }
    setMessage(null);
    setStatus("idle");
    setStep((x) => Math.min(x + 1, STEPS - 1));
  }

  function back() {
    setMessage(null);
    setStatus("idle");
    setStep((x) => Math.max(x - 1, 0));
  }

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    for (let s = 0; s < STEPS - 1; s++) {
      const err = validateStep(s, form);
      if (err) {
        setMessage(err);
        setStatus("error");
        setStep(s);
        return;
      }
    }
    setStatus("loading");
    setMessage(null);
    const fd = new FormData(form);

    try {
      const res = await fetch("/api/apply", { method: "POST", body: fd });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setStatus("error");
        setMessage(data?.error ?? "Something went wrong. Try again?");
        return;
      }
      router.push("/apply/thanks");
    } catch {
      setStatus("error");
      setMessage("Network error. Check your connection and retry.");
    } finally {
      setStatus("idle");
    }
  }

  return (
    <form noValidate onSubmit={submitForm} className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-vaibee-border bg-vaibee-surface px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-vaibee-muted">
          Step {step + 1} of {STEPS}
        </p>
        <p className="truncate text-sm font-medium text-vaibee-navy">{APPLICATION_STEPS[step]?.title}</p>
      </div>
      <div
        className="flex gap-1.5"
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={STEPS}
        aria-label="Application progress"
      >
        {APPLICATION_STEPS.map((_, i) => (
          <div
            key={i}
            className={["h-1.5 flex-1 rounded-full transition", i <= step ? "bg-vaibee-cyan" : "bg-vaibee-border"].join(" ")}
          />
        ))}
      </div>

      <div className={step === 0 ? "space-y-6" : "hidden"} aria-hidden={step !== 0}>
        <div className="rounded-2xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm">
          <label className="block text-sm font-medium text-vaibee-navy">
            Your name
            <input
              name="applicantName"
              required
              autoComplete="name"
              placeholder="Jamie Rivera"
              className="mt-1.5 w-full rounded-xl border border-vaibee-border bg-vaibee-surface px-3 py-2.5 text-sm outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
            />
          </label>
        </div>
        <div className="rounded-2xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm">
          <label className="block text-sm font-medium text-vaibee-navy">
            Co-founder email
            <input
              name="cofounderEmail"
              type="email"
              required
              autoComplete="email"
              placeholder="cofounder@studio.dev"
              className="mt-1.5 w-full rounded-xl border border-vaibee-border bg-vaibee-surface px-3 py-2.5 text-sm outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
            />
          </label>
          <p className="mt-2 text-xs text-vaibee-muted">We use this for onboarding threads and listing approvals.</p>
        </div>
      </div>

      <div className={step === 1 ? "space-y-6" : "hidden"} aria-hidden={step !== 1}>
        <div className="rounded-2xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm">
          <label className="block text-sm font-medium text-vaibee-navy">
            Agent or studio display name
            <input
              name="agentDisplayName"
              required
              placeholder="Ship-it Sprite"
              className="mt-1.5 w-full rounded-xl border border-vaibee-border bg-vaibee-surface px-3 py-2.5 text-sm outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
            />
          </label>
        </div>
        <div className="rounded-2xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm">
          <label className="block text-sm font-medium text-vaibee-navy">
            What does your agent do? (min. 30 characters)
            <textarea
              name="agentPitch"
              required
              rows={4}
              minLength={30}
              placeholder="e.g. Turns PR diffs into changelog drafts and Slack summaries for small teams…"
              className="mt-1.5 w-full resize-y rounded-xl border border-vaibee-border bg-vaibee-surface px-3 py-2.5 text-sm leading-relaxed outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
            />
          </label>
        </div>
        <div className="rounded-2xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm">
          <label className="block text-sm font-medium text-vaibee-navy">
            Agent API base URL
            <input
              name="agentApiUrl"
              type="url"
              required
              placeholder="https://api.yourstudio.dev/v1"
              className="mt-1.5 w-full rounded-xl border border-vaibee-border bg-vaibee-surface px-3 py-2.5 font-mono text-sm outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
            />
          </label>
          <p className="mt-2 text-xs text-vaibee-muted">
            We use this for manifest checks and sandbox calls during review.
          </p>
        </div>
        <div className="rounded-2xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm">
          <fieldset>
            <legend className="text-sm font-medium text-vaibee-navy">Monetization direction</legend>
            <p className="mt-1 text-xs text-vaibee-muted">Honest answers help us pick the right billing shape later.</p>
            <div className="mt-4 space-y-3">
              {MONETIZATION_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer gap-3 rounded-xl border border-vaibee-border bg-vaibee-surface p-3 has-[:checked]:border-vaibee-cyan has-[:checked]:ring-1 has-[:checked]:ring-vaibee-cyan/40"
                >
                  <input
                    type="radio"
                    name="monetizationPlan"
                    value={opt.value}
                    required
                    defaultChecked={opt.value === "undecided"}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-vaibee-navy">{opt.label}</span>
                    <span className="mt-0.5 block text-xs text-vaibee-muted">{opt.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <div className={step === 2 ? "space-y-6" : "hidden"} aria-hidden={step !== 2}>
        <div className="rounded-2xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm">
          <label className="block text-sm font-medium text-vaibee-navy">
            Company logo (optional)
            <input
              name="logo"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="mt-2 block w-full text-sm text-vaibee-muted file:mr-4 file:rounded-lg file:border-0 file:bg-vaibee-navy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-vaibee-navy-soft"
            />
          </label>
          <p className="mt-2 text-xs text-vaibee-muted">PNG, JPG, WebP, or SVG — up to 4&nbsp;MB.</p>
        </div>
      </div>

      {message ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">{message}</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={back}
            className="rounded-2xl border border-vaibee-border bg-vaibee-card px-5 py-3 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
          >
            Back
          </button>
        ) : null}
        {step < STEPS - 1 ? (
          <button
            type="button"
            onClick={next}
            className="min-w-[8rem] flex-1 rounded-2xl bg-vaibee-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft sm:flex-none"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "loading"}
            className="min-w-[8rem] flex-1 rounded-2xl bg-vaibee-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-vaibee-navy-soft disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
          >
            {status === "loading" ? "Submitting…" : "Submit application"}
          </button>
        )}
      </div>
    </form>
  );
}
