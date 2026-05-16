import { VaibeComposeDock } from "@/components/vaibe/VaibeComposeDock";

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <VaibeComposeDock />
    </>
  );
}
