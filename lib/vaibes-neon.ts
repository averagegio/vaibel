import type { PublishedVaibeStored } from "@/lib/published-vaibe-types";
import { getSql } from "@/lib/db";

type NeonVaibeRow = {
  id: string;
  slug: string;
  headline: string;
  body: string;
  author: string;
  published_at: string | Date;
};

function rowToStored(r: NeonVaibeRow): PublishedVaibeStored {
  const publishedAt =
    typeof r.published_at === "string" ? r.published_at : new Date(r.published_at).toISOString();
  return {
    id: r.id,
    slug: r.slug,
    headline: r.headline,
    body: r.body,
    author: r.author,
    publishedAt,
  };
}

export async function readPublishedVaibesFromNeon(): Promise<PublishedVaibeStored[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, slug, headline, body, author, published_at
    FROM hive_vaibes
    ORDER BY published_at DESC
  `) as NeonVaibeRow[];
  return rows.map(rowToStored);
}

export async function findPublishedVaibeBySlugInNeon(slug: string): Promise<PublishedVaibeStored | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, slug, headline, body, author, published_at
    FROM hive_vaibes
    WHERE slug = ${slug}
    LIMIT 1
  `) as NeonVaibeRow[];
  return rows[0] ? rowToStored(rows[0]) : null;
}

export async function insertPublishedVaibeInNeon(entry: PublishedVaibeStored): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO hive_vaibes (id, slug, headline, body, author, published_at)
    VALUES (
      ${entry.id},
      ${entry.slug},
      ${entry.headline},
      ${entry.body},
      ${entry.author},
      ${entry.publishedAt}
    )
  `;
}
