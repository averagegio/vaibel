"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { XPostImageField, type XPostImageValue } from "@/components/articles/XPostImageField";
import { textFromParagraphs } from "@/lib/hive-article-utils";
import { useAdminSecret } from "@/lib/use-admin-secret";

export type ArticleEditorInitial = {
  title: string;
  excerpt: string;
  bodyText: string;
  author: string;
  tags: string;
  slug: string;
};

type Props = {
  mode: "admin" | "member";
  email?: string;
  initial?: ArticleEditorInitial;
  existingSlug?: string;
};

export function ArticleEditorForm({ mode, email, initial, existingSlug }: Props) {
  const router = useRouter();
  const { secret, setSecret, adminHeaders } = useAdminSecret();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [bodyText, setBodyText] = useState(initial?.bodyText ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "");
  const [tags, setTags] = useState(initial?.tags ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [xImage, setXImage] = useState<XPostImageValue>(null);
  const [postToX, setPostToX] = useState(true);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const payload = {
      title,
      excerpt,
      bodyText,
      author: author.trim() || (mode === "member" ? "Hive member" : "vAIbee Editorial"),
      tags,
      slug,
      ...(mode === "admin" && existingSlug ? { existingSlug } : {}),
      ...(mode === "member" && email ? { email } : {}),
      postToX,
      ...(xImage ? { xImageBase64: xImage.base64, xImageMimeType: xImage.mimeType } : {}),
    };

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(mode === "admin" ? adminHeaders() : {}),
      };

      const url = mode === "admin" ? "/api/admin/articles" : "/api/articles/publish";
      const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload) });
      const raw = await res.text();
      let data: {
        ok?: boolean;
        error?: string;
        url?: string;
        code?: string;
        xTweetUrl?: string | null;
        xError?: string | null;
      } = {};
      try {
        data = raw ? (JSON.parse(raw) as typeof data) : {};
      } catch {
        setError(
          res.ok
            ? "Unexpected server response."
            : `Server error (${res.status}). Check Vercel logs or /api/health/db.`,
        );
        return;
      }

      if (!res.ok || !data.ok) {
        if (data.code === "team_required") {
          setError("Upgrade to Vibe team on the Pricing page, using this same email in Stripe Checkout.");
        } else if (res.status === 401) {
          setError(
            data.error ??
              "Unauthorized — use the Admin secret field below (must match VAIBEE_ADMIN_SECRET on Vercel).",
          );
        } else {
          setError(data.error ?? `Could not publish (${res.status}).`);
        }
        return;
      }

      const dest = data.url ?? "/articles";
      if (data.xTweetUrl) {
        window.open(data.xTweetUrl, "_blank", "noopener,noreferrer");
      }
      if (data.xError) {
        setError(`Article published, but X post failed: ${data.xError}`);
        router.push(dest);
        router.refresh();
        return;
      }
      router.push(dest);
      router.refresh();
    } catch {
      setError("Could not reach the server — check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-5">
      {mode === "admin" ? (
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-vaibee-muted">Admin secret</span>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="VAIBEE_ADMIN_SECRET from your environment"
            autoComplete="off"
            className="w-full rounded-xl border border-vaibee-border bg-white px-3 py-2 text-sm text-vaibee-navy outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
          />
        </label>
      ) : null}

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-vaibee-muted">Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={160}
          className="w-full rounded-xl border border-vaibee-border bg-white px-3 py-2 text-sm text-vaibee-navy outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-vaibee-muted">URL slug (optional)</span>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="auto-generated from title"
          maxLength={80}
          className="w-full rounded-xl border border-vaibee-border bg-white px-3 py-2 font-mono text-sm text-vaibee-navy outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-vaibee-muted">Excerpt</span>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          maxLength={320}
          placeholder="Short summary for cards and SEO — leave blank to auto-generate from body"
          className="w-full resize-none rounded-xl border border-vaibee-border bg-white px-3 py-2 text-sm text-vaibee-navy outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-vaibee-muted">Body</span>
        <textarea
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          required
          rows={12}
          placeholder="One paragraph per block. Separate paragraphs with a blank line (at least ~40 characters each)."
          className="w-full resize-y rounded-xl border border-vaibee-border bg-white px-3 py-2 text-sm leading-relaxed text-vaibee-navy outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-vaibee-muted">Author byline</span>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={80}
            className="w-full rounded-xl border border-vaibee-border bg-white px-3 py-2 text-sm text-vaibee-navy outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-vaibee-muted">Tags (comma-separated)</span>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="API, Strategy"
            className="w-full rounded-xl border border-vaibee-border bg-white px-3 py-2 text-sm text-vaibee-navy outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
          />
        </label>
      </div>

      <XPostImageField
        value={xImage}
        onChange={setXImage}
        postToX={postToX}
        onPostToXChange={setPostToX}
      />

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy || (mode === "admin" && !secret.trim())}
          className="rounded-xl bg-vaibee-cyan px-5 py-2.5 text-sm font-semibold text-vaibee-navy transition hover:brightness-105 disabled:opacity-40"
        >
          {busy ? "Publishing…" : existingSlug ? "Save changes" : "Publish article"}
        </button>
      </div>
    </form>
  );
}

export function articleToEditorInitial(article: {
  title: string;
  excerpt: string;
  body: string[];
  author: string;
  tags: string[];
  slug: string;
}): ArticleEditorInitial {
  return {
    title: article.title,
    excerpt: article.excerpt,
    bodyText: textFromParagraphs(article.body),
    author: article.author,
    tags: article.tags.join(", "),
    slug: article.slug,
  };
}
