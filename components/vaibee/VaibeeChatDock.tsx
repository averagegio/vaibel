"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/components/auth/AuthProvider";

type Msg = { id: string; role: "user" | "assistant"; content: string };

const DOCK_OFFSET_KEY = "vaibee-dock-offset-v1";

function clampDockOffset(x: number, y: number) {
  if (typeof window === "undefined") return { x, y };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxX = Math.max(48, vw * 0.42);
  const maxYUp = Math.max(80, vh * 0.52);
  return {
    x: Math.max(-maxX, Math.min(maxX, x)),
    y: Math.max(-maxYUp, Math.min(72, y)),
  };
}

function readStoredOffset(): { x: number; y: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DOCK_OFFSET_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as unknown;
    if (!p || typeof p !== "object") return null;
    const x = Number((p as { x?: unknown }).x);
    const y = Number((p as { y?: unknown }).y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return clampDockOffset(x, y);
  } catch {
    return null;
  }
}

/** Grip control: drag to reposition the dock (pointer + touch). */
function DockDragHandle(props: {
  label: string;
  variant?: "navy" | "light";
  className?: string;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerCancel: (e: React.PointerEvent) => void;
}) {
  const v = props.variant ?? "light";
  const surface =
    v === "navy"
      ? "text-white/70 hover:bg-white/10 hover:text-white"
      : "text-vaibee-muted hover:bg-black/[0.05] hover:text-vaibee-navy";
  return (
    <button
      type="button"
      tabIndex={0}
      aria-label={props.label}
      title={props.label}
      onPointerDown={props.onPointerDown}
      onPointerMove={props.onPointerMove}
      onPointerUp={props.onPointerUp}
      onPointerCancel={props.onPointerCancel}
      className={[
        "touch-none mb-0.5 flex h-10 w-9 shrink-0 cursor-grab items-center justify-center rounded-xl transition active:cursor-grabbing sm:w-10",
        surface,
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <circle cx="9" cy="8" r="1.35" />
        <circle cx="15" cy="8" r="1.35" />
        <circle cx="9" cy="12" r="1.35" />
        <circle cx="15" cy="12" r="1.35" />
        <circle cx="9" cy="16" r="1.35" />
        <circle cx="15" cy="16" r="1.35" />
      </svg>
    </button>
  );
}

export function VaibeeChatDock() {
  const { user } = useAuth();
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalEl(document.body);
  }, []);

  /** FAB vs expanded composer */
  const [dockOpen, setDockOpen] = useState(false);
  /** Transcript sheet above composer */
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const offsetRef = useRef(offset);
  const dragRef = useRef<{ pointerId: number; ox: number; oy: number; bx: number; by: number } | null>(null);

  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    const s = readStoredOffset();
    if (s) setOffset(s);
  }, []);

  useEffect(() => {
    const onResize = () => setOffset((o) => clampDockOffset(o.x, o.y));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const persistOffset = useCallback((o: { x: number; y: number }) => {
    try {
      window.localStorage.setItem(DOCK_OFFSET_KEY, JSON.stringify(o));
    } catch {
      /* ignore */
    }
  }, []);

  const onDragPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const o = offsetRef.current;
    dragRef.current = {
      pointerId: e.pointerId,
      ox: e.clientX,
      oy: e.clientY,
      bx: o.x,
      by: o.y,
    };
  }, []);

  const onDragPointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    const nx = d.bx + (e.clientX - d.ox);
    const ny = d.by + (e.clientY - d.oy);
    setOffset(clampDockOffset(nx, ny));
  }, []);

  const onDragPointerEnd = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      if (!d || e.pointerId !== d.pointerId) return;
      dragRef.current = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      setOffset((o) => {
        const c = clampDockOffset(o.x, o.y);
        persistOffset(c);
        return c;
      });
    },
    [persistOffset],
  );

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [msgs, transcriptOpen, scrollToBottom]);

  useEffect(() => {
    if (!dockOpen && !transcriptOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (transcriptOpen) {
        setTranscriptOpen(false);
        return;
      }
      if (dockOpen) {
        setDockOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dockOpen, transcriptOpen]);

  useEffect(() => {
    if (dockOpen) {
      textareaRef.current?.focus();
    }
  }, [dockOpen]);

  function openDock() {
    setDockOpen(true);
    if (msgs.length > 0) setTranscriptOpen(true);
  }

  function closeDock() {
    setDockOpen(false);
    setTranscriptOpen(false);
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const prior: { role: "user" | "assistant"; content: string }[] = msgs.map(({ role, content }) => ({
      role,
      content,
    }));
    setInput("");
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    setMsgs((m) => [...m, userMsg]);
    setLoading(true);
    setDockOpen(true);
    setTranscriptOpen(true);
    try {
      const res = await fetch("/api/vaibee/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, messages: prior, email: user?.email ?? undefined }),
      });
      const data = (await res.json().catch(() => null)) as {
        reply?: string;
        error?: string;
        articleUrl?: string | null;
      } | null;
      let reply =
        res.ok && data?.reply
          ? data.reply
          : data?.error ?? "Something went wrong — try again in a moment.";
      if (res.ok && data?.articleUrl) {
        reply = `${reply}\n\nPublished: ${data.articleUrl}`;
      }
      setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: reply }]);
    } catch {
      setMsgs((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Network hiccup — check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const dragHandleProps = {
    onPointerDown: onDragPointerDown,
    onPointerMove: onDragPointerMove,
    onPointerUp: onDragPointerEnd,
    onPointerCancel: onDragPointerEnd,
  } as const;

  /** Portal root is `document.body` so `position:fixed` is always relative to the viewport (never a transformed/stacking ancestor inside the layout tree). */
  const dockUi = (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 left-0 right-0 z-[100] flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 sm:px-4 sm:pb-4"
      aria-live="polite"
      data-vaibee-chat-dock-root
    >
      <div
        className="pointer-events-auto flex w-full max-w-3xl flex-col items-center gap-2"
        style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      >
        {!dockOpen ? (
          <div className="flex max-w-full items-stretch overflow-hidden rounded-full border border-black/[0.08] bg-vaibee-navy text-white shadow-[0_10px_40px_-12px_rgba(10,17,40,0.55)]">
            <DockDragHandle
              variant="navy"
              label="Drag to move Ask Vaibee"
              className="mb-0 rounded-none rounded-l-[999px] py-2.5 sm:py-3"
              {...dragHandleProps}
            />
            <button
              type="button"
              onClick={openDock}
              className="flex min-w-0 flex-1 items-center gap-2.5 py-2.5 pr-5 pl-2 text-left transition hover:bg-white/5 active:scale-[0.98] sm:px-5 sm:py-3"
              aria-expanded={false}
              aria-controls="vaibee-composer"
            >
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 ring-1 ring-white/20">
                <Image src="/vai-bee.png" alt="Vaibee" width={36} height={36} className="object-contain p-0.5" unoptimized />
              </span>
              <span className="text-sm font-semibold tracking-wide">Ask Vaibee</span>
            </button>
          </div>
        ) : (
          <div id="vaibee-composer" className="flex w-full flex-col gap-2">
            {transcriptOpen ? (
              <div
                id="vaibee-chat-panel"
                className="flex h-[min(380px,48vh)] max-h-[min(380px,48vh)] w-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white/95 shadow-[0_-8px_40px_-12px_rgba(10,17,40,0.25)] backdrop-blur-md supports-[backdrop-filter]:bg-white/90"
                role="dialog"
                aria-label="Vaibee conversation"
              >
                <div className="flex items-center gap-2 border-b border-black/[0.06] px-2 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
                  <DockDragHandle
                    variant="light"
                    label="Drag to move Vaibee"
                    className="mb-0 h-9 w-9 shrink-0 sm:h-10 sm:w-10"
                    {...dragHandleProps}
                  />
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-[var(--vaibee-cyan-dim)] ring-1 ring-black/[0.06] sm:h-9 sm:w-9">
                      <Image
                        src="/vai-bee.png"
                        alt="Vaibee"
                        width={36}
                        height={36}
                        className="object-contain p-0.5"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-vaibee-navy">Vaibee</p>
                      <p className="truncate text-xs text-vaibee-muted">Conversation</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTranscriptOpen(false)}
                    className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-vaibee-muted transition hover:bg-black/[0.04] hover:text-vaibee-navy"
                  >
                    Hide
                  </button>
                </div>
                <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3 sm:px-4">
                  {msgs.length === 0 ? (
                    <p className="text-sm leading-relaxed text-vaibee-muted">
                      Send a message below — I will answer with the hive context. Use the dotted grip on the left to move
                      the whole dock. Tap the arrow to show or hide this thread, or close when you are done.
                    </p>
                  ) : (
                    msgs.map((msg) => (
                      <div
                        key={msg.id}
                        className={[
                          "max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                          msg.role === "user"
                            ? "ml-auto bg-vaibee-navy text-white"
                            : "mr-auto border border-vaibee-border bg-vaibee-surface text-vaibee-navy",
                        ].join(" ")}
                      >
                        {msg.content}
                      </div>
                    ))
                  )}
                  {loading ? (
                    <p className="text-xs text-vaibee-muted" aria-busy>
                      Vaibee is thinking…
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="flex w-full items-end gap-2 rounded-[1.35rem] border border-black/[0.09] bg-white/95 py-2 pl-2 pr-2 shadow-[0_12px_48px_-16px_rgba(10,17,40,0.35)] backdrop-blur-md supports-[backdrop-filter]:bg-white/92 sm:gap-2.5 sm:pl-2.5 sm:pr-3">
              <DockDragHandle variant="light" label="Drag to move Vaibee" {...dragHandleProps} />
              <button
                type="button"
                onClick={closeDock}
                className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-vaibee-muted transition hover:bg-black/[0.05] hover:text-vaibee-navy"
                aria-label="Close Ask Vaibee"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setTranscriptOpen((v) => !v)}
                className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-vaibee-muted transition hover:bg-black/[0.05] hover:text-vaibee-navy"
                aria-label={transcriptOpen ? "Hide transcript" : "Show transcript"}
                aria-expanded={transcriptOpen}
                aria-controls={transcriptOpen ? "vaibee-chat-panel" : undefined}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  {transcriptOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  )}
                </svg>
              </button>
              <span className="mb-2 shrink-0 rounded-full bg-[var(--vaibee-cyan-dim)] px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-vaibee-navy ring-1 ring-vaibee-cyan/25 sm:hidden">
                Ask Vaibee
              </span>
              <label className="sr-only" htmlFor="vaibee-chat-input">
                Message to Vaibee
              </label>
              <textarea
                ref={textareaRef}
                id="vaibee-chat-input"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder="Message Vaibee…"
                className="max-h-28 min-h-[2.5rem] flex-1 resize-none rounded-xl border-0 bg-transparent px-1 py-2 text-sm text-vaibee-navy outline-none ring-0 placeholder:text-vaibee-muted/80 sm:max-h-32 sm:px-2"
              />
              <button
                type="button"
                disabled={loading || !input.trim()}
                onClick={() => void send()}
                className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vaibee-navy text-white transition hover:bg-vaibee-navy-soft disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!portalEl) return null;
  return createPortal(dockUi, portalEl);
}
