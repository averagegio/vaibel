import { Outfit } from "next/font/google";
import { HomeLandingBackdrop } from "@/components/HomeLandingBackdrop";
import { MarketingChrome } from "@/components/MarketingChrome";

const outfitDisplay = Outfit({
  subsets: ["latin"],
  weight: ["200", "300"],
  variable: "--font-outfit",
});

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`relative min-h-dvh text-vaibee-navy ${outfitDisplay.variable}`}>
      <HomeLandingBackdrop />
      <MarketingChrome />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
