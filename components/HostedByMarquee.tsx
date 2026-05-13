/** Fictional host names for the landing ticker (replace with real partners when you have them). */
const HOST_COMPANIES = [
  "Northwind Labs",
  "Cobalt Robotics",
  "Blue Harbor",
  "Kite Systems",
  "Orbital Desk",
  "Silverline AI",
  "Patchwork Studio",
  "Grain & Signal",
  "Loft Analytics",
  "Frame Nine",
  "Harbor Circuit",
  "Brightline Ops",
];

export function HostedByMarquee() {
  return (
    <div className="landing-marquee border-b border-solid" style={{ backgroundColor: "var(--lp-marquee-band)", borderColor: "var(--lp-marquee-band-border)" }}>
      <p className="sr-only">Companies that have hosted on the platform</p>
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
            {HOST_COMPANIES.map((name) => (
              <span
                key={`${dup}-${name}`}
                className="whitespace-nowrap text-[0.8125rem] font-semibold uppercase tracking-[0.18em] sm:text-sm"
                style={{ color: "var(--lp-muted)" }}
              >
                {name}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
