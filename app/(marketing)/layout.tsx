import { MarketingChrome } from "@/components/MarketingChrome";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-white text-vaibee-navy">
      <MarketingChrome />
      {children}
    </div>
  );
}
