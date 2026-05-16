"use client";

import { useCallback, useState } from "react";

type Props = {
  url: string;
  title: string;
  text?: string;
  className?: string;
};

function shareUrl(platform: "x" | "linkedin" | "facebook" | "reddit", url: string, title: string, text: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text || title);
  switch (platform) {
    case "x":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "reddit":
      return `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
  }
}

const btn =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-vaibee-border bg-vaibee-surface text-vaibee-navy transition hover:border-vaibee-cyan/40 hover:bg-[#f4f7fb]";

export function SocialShareButtons({ url, title, text, className }: Props) {
  const [copied, setCopied] = useState(false);
  const shareText = text ?? title;

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [url]);

  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-wide text-vaibee-muted">Share</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <a
          href={shareUrl("x", url, title, shareText)}
          target="_blank"
          rel="noopener noreferrer"
          className={btn}
          aria-label="Share on X"
          title="Share on X"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a
          href={shareUrl("linkedin", url, title, shareText)}
          target="_blank"
          rel="noopener noreferrer"
          className={btn}
          aria-label="Share on LinkedIn"
          title="Share on LinkedIn"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
        <a
          href={shareUrl("facebook", url, title, shareText)}
          target="_blank"
          rel="noopener noreferrer"
          className={btn}
          aria-label="Share on Facebook"
          title="Share on Facebook"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
        <a
          href={shareUrl("reddit", url, title, shareText)}
          target="_blank"
          rel="noopener noreferrer"
          className={btn}
          aria-label="Share on Reddit"
          title="Share on Reddit"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 013.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l-.882-4.153a.342.342 0 01-.14-.108.342.342 0 00-.108-.14L8.793 3.1a.342.342 0 00-.384.072l-1.12 1.12a.342.342 0 00-.072.384l1.47 3.47-2.597.547a1.25 1.25 0 01-1.249-1.25z" />
          </svg>
        </a>
        <button type="button" onClick={() => void copyLink()} className={btn} aria-label="Copy link" title="Copy link">
          {copied ? (
            <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
