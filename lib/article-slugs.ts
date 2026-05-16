import { editorialArticleSlugs } from "@/lib/articles";
import { readHiveArticles } from "@/lib/hive-articles-store";
import { readPublishedVaibes } from "@/lib/published-vaibes-store";

export async function collectReservedArticleSlugs(): Promise<Set<string>> {
  const [vaibes, articles] = await Promise.all([readPublishedVaibes(), readHiveArticles()]);
  return new Set([
    ...editorialArticleSlugs(),
    ...vaibes.map((v) => v.slug),
    ...articles.map((a) => a.slug),
  ]);
}
