"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Next.js client navigations often skip native hash scroll — align target after paint. */
export function ApiDocsHashScroller() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname?.startsWith("/api-docs")) return;

    const scrollToHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    scrollToHash();
    const t = window.setTimeout(scrollToHash, 120);
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [pathname]);

  return null;
}
