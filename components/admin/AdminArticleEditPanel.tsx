"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArticleEditorForm,
  articleToEditorInitial,
  type ArticleEditorInitial,
} from "@/components/articles/ArticleEditorForm";
import type { HiveArticleStored } from "@/lib/hive-article-types";
import { useAdminSecret } from "@/lib/use-admin-secret";

export function AdminArticleEditPanel({ slug }: { slug?: string }) {
  const { secret, setSecret, adminHeaders } = useAdminSecret();
  const [initial, setInitial] = useState<ArticleEditorInitial | undefined>(slug ? undefined : { title: "", excerpt: "", bodyText: "", author: "vAIbee Editorial", tags: "", slug: "" });
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!slug || !secret.trim()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/articles/${encodeURIComponent(slug)}`, { headers: adminHeaders() });
      const data = (await res.json()) as { ok?: boolean; article?: HiveArticleStored; error?: string };
      if (!res.ok || !data.ok || !data.article) {
        setError(data.error ?? "Article not found.");
        return;
      }
      const a = data.article;
      setInitial(
        articleToEditorInitial({
          title: a.title,
          excerpt: a.excerpt,
          body: a.body,
          author: a.author,
          tags: a.tags,
          slug: a.slug,
        }),
      );
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, [adminHeaders, secret, slug]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/admin/articles" className="text-sm font-semibold text-vaibee-cyan hover:underline">
          ← All articles
        </Link>
        {slug ? (
          <Link href={`/articles/${slug}`} className="text-sm font-semibold text-vaibee-muted hover:text-vaibee-navy">
            View live
          </Link>
        ) : null}
      </div>

      {!slug ? (
        <label className="block max-w-md">
          <span className="mb-1 block text-xs font-semibold text-vaibee-muted">Admin secret</span>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full rounded-xl border border-vaibee-border bg-white px-3 py-2 text-sm outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
          />
        </label>
      ) : null}

      {loading ? <p className="text-sm text-vaibee-muted">Loading…</p> : null}
      {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}

      {initial && !loading ? (
        <ArticleEditorForm mode="admin" initial={initial} existingSlug={slug} />
      ) : null}
    </div>
  );
}
