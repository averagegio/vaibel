import { BackButton } from "@/components/BackButton";

export type LegalSection = {
  heading: string;
  body: string[];
};

type Props = {
  kicker: string;
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
};

export function LegalDoc({ kicker, title, updated, intro, sections }: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      <BackButton fallbackHref="/" fallbackLabel="Home" />

      <header className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-vaibee-cyan">{kicker}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-vaibee-navy md:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-vaibee-muted">Last updated: {updated}</p>
        {intro ? <p className="mt-4 text-base leading-relaxed text-vaibee-muted">{intro}</p> : null}
      </header>

      <div className="mt-10 space-y-8 rounded-3xl border border-vaibee-border bg-vaibee-card p-8 shadow-sm md:p-10">
        {sections.map((section, i) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold text-vaibee-navy">
              {i + 1}. {section.heading}
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-vaibee-muted">
              {section.body.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-vaibee-muted">
        This document is provided for general information and is not legal advice. For questions, reach us via the{" "}
        <a href="/contact" className="font-semibold text-vaibee-navy hover:text-vaibee-cyan hover:underline">
          contact page
        </a>
        .
      </p>
    </div>
  );
}
