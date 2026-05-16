import type { HiveArticleStored } from "@/lib/hive-article-types";
import { getSql } from "@/lib/db";

type NeonArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: unknown;
  author: string;
  author_email: string | null;
  tags: unknown;
  published_at: string | Date;
  updated_at: string | Date;
};

function parseBody(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((p): p is string => typeof p === "string" && p.trim().length > 0);
}

function parseTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((t): t is string => typeof t === "string" && t.trim().length > 0);
}

function rowToStored(r: NeonArticleRow): HiveArticleStored {
  const publishedAt =
    typeof r.published_at === "string" ? r.published_at : new Date(r.published_at).toISOString();
  const updatedAt =
    typeof r.updated_at === "string" ? r.updated_at : new Date(r.updated_at).toISOString();
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    body: parseBody(r.body),
    author: r.author,
    authorEmail: r.author_email,
    tags: parseTags(r.tags),
    publishedAt,
    updatedAt,
  };
}

export async function readHiveArticlesFromNeon(): Promise<HiveArticleStored[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, slug, title, excerpt, body, author, author_email, tags, published_at, updated_at
    FROM hive_articles
    ORDER BY published_at DESC
  `) as NeonArticleRow[];
  return rows.map(rowToStored);
}

export async function findHiveArticleBySlugInNeon(slug: string): Promise<HiveArticleStored | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, slug, title, excerpt, body, author, author_email, tags, published_at, updated_at
    FROM hive_articles
    WHERE slug = ${slug}
    LIMIT 1
  `) as NeonArticleRow[];
  return rows[0] ? rowToStored(rows[0]) : null;
}

export async function upsertHiveArticleInNeon(entry: HiveArticleStored): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO hive_articles (
      id, slug, title, excerpt, body, author, author_email, tags, published_at, updated_at
    )
    VALUES (
      ${entry.id},
      ${entry.slug},
      ${entry.title},
      ${entry.excerpt},
      ${JSON.stringify(entry.body)}::jsonb,
      ${entry.author},
      ${entry.authorEmail},
      ${JSON.stringify(entry.tags)}::jsonb,
      ${entry.publishedAt},
      ${entry.updatedAt}
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      excerpt = EXCLUDED.excerpt,
      body = EXCLUDED.body,
      author = EXCLUDED.author,
      author_email = EXCLUDED.author_email,
      tags = EXCLUDED.tags,
      updated_at = EXCLUDED.updated_at
  `;
}

export async function deleteHiveArticleInNeon(slug: string): Promise<boolean> {
  const sql = getSql();
  const rows = (await sql`
    DELETE FROM hive_articles WHERE slug = ${slug} RETURNING slug
  `) as { slug: string }[];
  return rows.length > 0;
}
