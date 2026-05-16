import type { Article } from "@/lib/articles";
import type { HiveArticleStored } from "@/lib/hive-article-types";
import { readMinutesForBody } from "@/lib/hive-article-utils";

export function hiveArticleToArticle(row: HiveArticleStored): Article {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    author: row.author,
    publishedAt: row.publishedAt.slice(0, 10),
    readMinutes: readMinutesForBody(row.body),
    tags: row.tags,
  };
}
