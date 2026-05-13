import { HomeLandingBackdrop } from "@/components/HomeLandingBackdrop";
import { MarketingChrome } from "@/components/MarketingChrome";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh text-vaibee-navy">
      <HomeLandingBackdrop />
      <MarketingChrome />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
