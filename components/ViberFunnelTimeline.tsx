import { POST_APPLY_STEPS } from "@/lib/viber-funnel";

type Props = {
  /** "apply" = before submit framing; "thanks" = after submit next steps */
  variant?: "apply" | "thanks";
};

export function ViberFunnelTimeline({ variant = "apply" }: Props) {
  const title =
    variant === "apply"
      ? "After you apply — how we work with vibe coders"
      : "Your path from application to listing";

  return (
    <section className="rounded-3xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-semibold text-vaibee-navy">{title}</h2>
      <p className="mt-2 text-sm text-vaibee-muted">
        Early-stage hive: one funnel (this form), light process, ship when it is real.
      </p>
      <ol className="mt-6 space-y-5">
        {POST_APPLY_STEPS.map((step, i) => (
          <li key={step.id} className="flex gap-4">
            <div className="flex shrink-0 flex-col items-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--vaibee-cyan-dim)] text-sm font-bold text-vaibee-navy ring-1 ring-vaibee-cyan/30">
                {i + 1}
              </span>
              {i < POST_APPLY_STEPS.length - 1 ? (
                <span className="mt-1 w-px flex-1 min-h-[1.25rem] bg-vaibee-border" aria-hidden />
              ) : null}
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="font-semibold text-vaibee-navy">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-vaibee-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
