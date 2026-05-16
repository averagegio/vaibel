import type { Article } from "@/lib/articles";
import type { PublishedVaibeStored } from "@/lib/published-vaibe-types";

export function vaibeToArticle(v: PublishedVaibeStored): Article {
  const title = v.headline.trim() || excerptFromBody(v.body) || "A vaibe from the hive";
  const excerpt = excerptFromBody(v.body);
  const publishedAt = v.publishedAt.slice(0, 10);
  const words = v.body.trim().split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    slug: v.slug,
    title,
    excerpt,
    body: [v.body.trim()],
    author: v.author.trim() || "Hive",
    publishedAt,
    readMinutes,
    tags: ["Vaibe"],
  };
}

function excerptFromBody(body: string): string {
  const t = body.trim().replace(/\s+/g, " ");
  if (!t) return "";
  if (t.length <= 160) return t;
  return `${t.slice(0, 157)}…`;
}
