/**
 * Fixed landing GIF — `HomeLandingBackdrop` height (taller than a third of the viewport).
 */
export const LANDING_HERO_BAND_CLASS = "h-[min(44dvh,34rem)]";

/** Paths that show the GIF band + floating marketing nav pill (`MarketingChrome`). */
export const MARKETING_HERO_GIF_ROUTES = new Set(["/", "/store"]);

export function isMarketingHeroRoute(pathname: string): boolean {
  return MARKETING_HERO_GIF_ROUTES.has(pathname);
}

/**
 * In-flow spacer under sticky floating nav so content starts near the bottom of the GIF band.
 * Matches band height above; `sm:` offset aligns with pill + padding. Used on `/` and `/store`.
 */
export const LANDING_HERO_SCROLL_GAP_CLASS =
  "h-[max(0px,calc(min(44dvh,34rem)_-_5.75rem))] sm:h-[max(0px,calc(min(44dvh,34rem)_-_6rem))]";
