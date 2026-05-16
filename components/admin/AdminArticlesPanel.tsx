"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { HiveArticleStored } from "@/lib/hive-article-types";
import { useAdminSecret } from "@/lib/use-admin-secret";

export function AdminArticlesPanel() {
  const { secret, setSecret, adminHeaders } = useAdminSecret();
  const [articles, setArticles] = useState<HiveArticleStored[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!secret.trim()) {
      setArticles([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/articles", { headers: adminHeaders() });
      const data = (await res.json()) as { ok?: boolean; articles?: HiveArticleStored[]; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not load articles.");
        setArticles([]);
        return;
      }
      setArticles(data.articles ?? []);
    } catch {
      setError("Network error.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [adminHeaders, secret]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onDelete(slug: string) {
    if (!window.confirm(`Delete article “${slug}”?`)) return;
    const res = await fetch(`/api/admin/articles/${encodeURIComponent(slug)}`, {
      method: "DELETE",
      headers: adminHeaders(),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Delete failed.");
      return;
    }
    void load();
  }

  return (
    <div className="space-y-6">
      <label className="block max-w-md">
        <span className="mb-1 block text-xs font-semibold text-vaibee-muted">Admin secret</span>
        <div className="flex gap-2">
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="VAIBEE_ADMIN_SECRET"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-xl border border-vaibee-border bg-white px-3 py-2 text-sm outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
          />
          <button
            type="button"
            onClick={() => void load()}
            disabled={!secret.trim() || loading}
            className="shrink-0 rounded-xl bg-vaibee-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            {loading ? "…" : "Load"}
          </button>
        </div>
      </label>

      {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-vaibee-muted">
          {articles.length} published {articles.length === 1 ? "article" : "articles"} in storage (not counting static
          editorial seeds in code).
        </p>
        <Link
          href="/admin/articles/new"
          className="rounded-xl bg-vaibee-cyan px-4 py-2 text-sm font-semibold text-vaibee-navy hover:brightness-105"
        >
          New article
        </Link>
      </div>

      {articles.length > 0 ? (
        <ul className="divide-y divide-vaibee-border rounded-2xl border border-vaibee-border bg-white">
          {articles.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="font-semibold text-vaibee-navy">{a.title}</p>
                <p className="text-xs text-vaibee-muted">
                  /articles/{a.slug} · {a.author}
                  {a.authorEmail ? ` · ${a.authorEmail}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/articles/${a.slug}`}
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-vaibee-cyan hover:underline"
                >
                  View
                </Link>
                <Link
                  href={`/admin/articles/${encodeURIComponent(a.slug)}/edit`}
                  className="rounded-lg border border-vaibee-border px-2 py-1 text-xs font-semibold text-vaibee-navy hover:border-vaibee-cyan/40"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => void onDelete(a.slug)}
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : secret.trim() && !loading ? (
        <p className="text-sm text-vaibee-muted">No stored articles yet — create one.</p>
      ) : null}
    </div>
  );
}
