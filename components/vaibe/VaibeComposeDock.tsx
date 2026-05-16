"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { SocialShareButtons } from "@/components/articles/SocialShareButtons";

const DRAFT_KEY = "vaibel-vaibe-draft-v1";
const PUBLISH_KEY_STORAGE = "vaibel-vaibe-publish-key-v1";
const MAX_BODY = 500;
const MAX_AUTHOR = 80;

type Draft = { headline: string; body: string; updatedAt: string };

function readDraft(): Draft {
  if (typeof window === "undefined") return { headline: "", body: "", updatedAt: "" };
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return { headline: "", body: "", updatedAt: "" };
    const p = JSON.parse(raw) as Draft;
    return {
      headline: typeof p.headline === "string" ? p.headline : "",
      body: typeof p.body === "string" ? p.body.slice(0, MAX_BODY) : "",
      updatedAt: typeof p.updatedAt === "string" ? p.updatedAt : "",
    };
  } catch {
    return { headline: "", body: "", updatedAt: "" };
  }
}

function writeDraft(d: Draft) {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
  } catch {
    /* ignore */
  }
}

export function VaibeComposeDock() {
  const router = useRouter();
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [publishKey, setPublishKey] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setPortalEl(document.body);
    const d = readDraft();
    setHeadline(d.headline);
    setBody(d.body);
    try {
      const key = window.sessionStorage.getItem(PUBLISH_KEY_STORAGE);
      if (key) setPublishKey(key);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setShareUrl(window.location.href);
  }, [open]);

  const persist = useCallback((h: string, b: string) => {
    writeDraft({ headline: h, body: b.slice(0, MAX_BODY), updatedAt: new Date().toISOString() });
  }, []);

  const saveDraft = useCallback(() => {
    persist(headline, body);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  }, [headline, body, persist]);

  const publish = useCallback(async () => {
    const text = body.trim();
    if (text.length < 12) {
      setPublishError("Write at least 12 characters to publish.");
      return;
    }
    setPublishing(true);
    setPublishError(null);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const key = publishKey.trim();
      if (key) headers["x-vaibe-publish-secret"] = key;

      const res = await fetch("/api/vaibes/publish", {
        method: "POST",
        headers,
        body: JSON.stringify({
          headline: headline.trim(),
          body: text,
          author: author.trim() || "Hive",
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; url?: string };
      if (!res.ok || !data.ok) {
        if (res.status === 401) {
          setPublishError(data.error ?? "Publish key required. Add it below and try again.");
        } else {
          setPublishError(data.error ?? "Could not publish. Try again.");
        }
        return;
      }
      if (key) {
        try {
          window.sessionStorage.setItem(PUBLISH_KEY_STORAGE, key);
        } catch {
          /* ignore */
        }
      }
      writeDraft({ headline: "", body: "", updatedAt: "" });
      setHeadline("");
      setBody("");
      setOpen(false);
      router.push(data.url ?? "/articles");
      router.refresh();
    } catch {
      setPublishError("Network error — check your connection and try again.");
    } finally {
      setPublishing(false);
    }
  }, [author, body, headline, publishKey, router]);

  const shareTitle = headline.trim() || "A vaibe from the hive";
  const shareText = body.trim() ? `${headline.trim() ? `${headline.trim()}\n\n` : ""}${body.trim()}` : shareTitle;

  const dockUi = (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 left-0 z-[90] flex justify-start px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 sm:px-4 sm:pb-4"
      aria-live="polite"
      data-vaibe-compose-dock
    >
      <div className="pointer-events-auto flex w-full max-w-md flex-col items-start gap-2">
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-full border border-vaibee-cyan/40 bg-gradient-to-r from-vaibee-navy to-[#0d3d52] px-4 py-2.5 pr-5 text-left text-white shadow-[0_10px_40px_-12px_rgba(0,217,255,0.35)] transition hover:border-vaibee-cyan/60 active:scale-[0.98]"
            aria-expanded={false}
            aria-controls="vaibe-composer"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vaibee-cyan/20 text-lg ring-1 ring-vaibee-cyan/40">
              ✦
            </span>
            <span className="text-sm font-semibold tracking-wide">Compose a vaibe</span>
          </button>
        ) : (
          <div
            id="vaibe-composer"
            className="w-full overflow-hidden rounded-2xl border border-vaibee-cyan/30 bg-white/95 shadow-[0_12px_48px_-16px_rgba(10,17,40,0.4)] backdrop-blur-md supports-[backdrop-filter]:bg-white/92"
          >
            <div className="flex items-center justify-between gap-2 border-b border-black/[0.06] px-3 py-2.5">
              <p className="text-sm font-semibold text-vaibee-navy">Compose a vaibe</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-1 text-xs font-semibold text-vaibee-muted transition hover:bg-black/[0.04] hover:text-vaibee-navy"
                aria-label="Close composer"
              >
                Close
              </button>
            </div>
            <div className="space-y-3 px-3 py-3">
              <label className="block">
                <span className="sr-only">Headline</span>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => {
                    setHeadline(e.target.value);
                    persist(e.target.value, body);
                  }}
                  placeholder="Headline (optional)"
                  maxLength={120}
                  className="w-full rounded-xl border border-vaibee-border bg-vaibee-surface px-3 py-2 text-sm text-vaibee-navy outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
                />
              </label>
              <label className="block">
                <span className="sr-only">Your vaibe</span>
                <textarea
                  ref={textareaRef}
                  value={body}
                  onChange={(e) => {
                    const v = e.target.value.slice(0, MAX_BODY);
                    setBody(v);
                    persist(headline, v);
                  }}
                  rows={4}
                  placeholder="What are you shipping, learning, or vibing on?"
                  className="w-full resize-none rounded-xl border border-vaibee-border bg-vaibee-surface px-3 py-2 text-sm leading-relaxed text-vaibee-navy outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-vaibee-muted">Byline (optional)</span>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value.slice(0, MAX_AUTHOR))}
                  placeholder="Your name or handle"
                  maxLength={MAX_AUTHOR}
                  className="w-full rounded-xl border border-vaibee-border bg-vaibee-surface px-3 py-2 text-sm text-vaibee-navy outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-vaibee-muted">Publish key (if your site requires one)</span>
                <input
                  type="password"
                  value={publishKey}
                  onChange={(e) => setPublishKey(e.target.value)}
                  placeholder="Only needed when VAIBE_PUBLISH_SECRET is set"
                  autoComplete="off"
                  className="w-full rounded-xl border border-vaibee-border bg-vaibee-surface px-3 py-2 text-sm text-vaibee-navy outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
                />
              </label>
              <p className="text-right text-[0.65rem] text-vaibee-muted">
                {body.length}/{MAX_BODY}
              </p>
              {publishError ? (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-800" role="alert">
                  {publishError}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void publish()}
                  disabled={publishing || body.trim().length < 12}
                  className="rounded-xl bg-vaibee-cyan px-4 py-2 text-sm font-semibold text-vaibee-navy transition hover:brightness-105 disabled:opacity-40"
                >
                  {publishing ? "Publishing…" : "Publish to hive"}
                </button>
                <button
                  type="button"
                  onClick={saveDraft}
                  className="rounded-xl border border-vaibee-border bg-vaibee-surface px-4 py-2 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
                >
                  {savedFlash ? "Saved" : "Save draft"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const text = shareText;
                    void navigator.clipboard.writeText(text);
                  }}
                  disabled={!body.trim()}
                  className="rounded-xl border border-vaibee-border bg-vaibee-surface px-4 py-2 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40 disabled:opacity-40"
                >
                  Copy text
                </button>
              </div>
              {shareUrl && body.trim() ? (
                <SocialShareButtons
                  url={shareUrl}
                  title={shareTitle}
                  text={shareText.slice(0, 240)}
                  className="border-t border-vaibee-border pt-3"
                />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!portalEl) return null;
  return createPortal(dockUi, portalEl);
}
