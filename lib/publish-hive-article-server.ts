import { revalidatePath } from "next/cache";
import { collectReservedArticleSlugs } from "@/lib/article-slugs";
import {
  buildHiveArticle,
  parseArticleDraft,
  slugFromDraft,
  type ArticleDraftInput,
} from "@/lib/hive-article-publish";
import { announceHiveArticle } from "@/lib/hive-article-announce";
import { findHiveArticleBySlug, upsertHiveArticle } from "@/lib/hive-articles-store";
import { ensureUniqueSlug } from "@/lib/slug";

export type PublishHiveArticleResult =
  | { ok: true; slug: string; path: string; xTweetUrl?: string; xError?: string }
  | { ok: false; error: string };

export async function publishHiveArticleServer(
  input: ArticleDraftInput & { existingSlug?: string; appOrigin?: string; postToX?: boolean },
): Promise<PublishHiveArticleResult> {
  const parsed = parseArticleDraft(input);
  if (!parsed.ok) {
    return { ok: false, error: parsed.error };
  }

  const existingSlug = String(input.existingSlug ?? "").trim();
  const existing = existingSlug ? await findHiveArticleBySlug(existingSlug) : null;

  const base = slugFromDraft(parsed.draft);
  const taken = await collectReservedArticleSlugs();
  if (existing) taken.delete(existing.slug);
  const slug = ensureUniqueSlug(base, taken);

  const entry = buildHiveArticle(parsed.draft, slug, existing?.authorEmail ?? null, existing);

  try {
    await upsertHiveArticle(entry);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "duplicate_slug") {
      return { ok: false, error: "Slug already in use." };
    }
    console.error("[vaibel] publishHiveArticleServer:", e);
    return { ok: false, error: msg || "Could not save article to the database." };
  }

  revalidatePath("/articles");
  revalidatePath(`/articles/${slug}`);
  if (existingSlug && existingSlug !== slug) {
    revalidatePath(`/articles/${existingSlug}`);
  }

  const path = `/articles/${slug}`;
  let xTweetUrl: string | undefined;
  let xError: string | undefined;

  const origin = input.appOrigin?.replace(/\/$/, "");
  if (origin) {
    const { x } = await announceHiveArticle({
      title: entry.title,
      excerpt: entry.excerpt,
      articleUrl: `${origin}${path}`,
      postToX: input.postToX,
    });
    if (x?.ok) {
      xTweetUrl = x.tweetUrl;
    } else if (x && !x.ok) {
      xError = x.error;
    }
  }

  return { ok: true, slug, path, xTweetUrl, xError };
}
