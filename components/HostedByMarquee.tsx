/** Live agent sites hosted on the platform (marquee links open in a new tab). */
const HOST_SITES: { href: string; label: string }[] = [
  { href: "https://www.peaksees.com/", label: "peaksees" },
  { href: "https://www.scriptids.com/", label: "Scriptids" },
  { href: "https://www.verdansc.com/", label: "VERDANSC" },
  { href: "https://www.bardty.com/", label: "Bardty" },
  { href: "https://www.mechmaru.com/", label: "Maru Robotics" },
  { href: "https://www.morgnow.com/", label: "morgnow" },
  { href: "https://www.clankthat.com/", label: "ClankThat" },
];

export function HostedByMarquee() {
  return (
    <div className="landing-marquee border-b border-solid" style={{ backgroundColor: "var(--lp-marquee-band)", borderColor: "var(--lp-marquee-band-border)" }}>
      <p className="sr-only">Agent sites and products on the platform</p>
      <div className="landing-marquee-scroll flex w-max">
        {[0, 1].map((dup) => (
          <div
            key={dup}
            className={[
              "flex shrink-0 items-center gap-x-10 px-6 py-3.5 sm:gap-x-14 sm:px-8 sm:py-4",
              dup === 1 ? "landing-marquee-strip-duplicate" : "",
            ].join(" ")}
            aria-hidden={dup === 1}
          >
            {HOST_SITES.map((site) => (
              <a
                key={`${dup}-${site.href}`}
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={dup === 1 ? -1 : 0}
                className="whitespace-nowrap text-[0.8125rem] font-semibold uppercase tracking-[0.18em] underline-offset-4 transition hover:opacity-90 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lp-accent,#12a4b7)] sm:text-sm"
                style={{ color: "var(--lp-muted)" }}
              >
                {site.label}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
