"use client";

import { useEffect, useState } from "react";
import { SocialShareButtons } from "@/components/articles/SocialShareButtons";

type Props = {
  path: string;
  title: string;
  text?: string;
  className?: string;
};

/** Resolves full share URL on the client (correct origin in dev and production). */
export function ArticleShareBar({ path, title, text, className }: Props) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`);
  }, [path]);

  if (!url) {
    return (
      <div className={className} aria-hidden>
        <p className="text-xs font-semibold uppercase tracking-wide text-vaibee-muted">Share</p>
        <div className="mt-2 h-10 w-48 animate-pulse rounded-xl bg-vaibee-border/60" />
      </div>
    );
  }

  return <SocialShareButtons url={url} title={title} text={text} className={className} />;
}
