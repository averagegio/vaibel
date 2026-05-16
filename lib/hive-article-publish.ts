import { randomUUID } from "crypto";
import type { HiveArticleStored } from "@/lib/hive-article-types";
import {
  excerptFromParagraphs,
  paragraphsFromText,
  parseTagsInput,
} from "@/lib/hive-article-utils";
import { slugify } from "@/lib/slug";

const MAX_TITLE = 160;
const MAX_EXCERPT = 320;
const MAX_AUTHOR = 80;
const MAX_BODY_CHARS = 24_000;
const MIN_PARAGRAPHS = 1;
const MIN_PARAGRAPH_CHARS = 40;

export type ArticleDraftInput = {
  title?: string;
  excerpt?: string;
  bodyText?: string;
  author?: string;
  tags?: string;
  slug?: string;
};

export type ParsedArticleDraft = {
  title: string;
  excerpt: string;
  paragraphs: string[];
  author: string;
  tags: string[];
  slugHint: string;
};

export function parseArticleDraft(raw: ArticleDraftInput): { ok: true; draft: ParsedArticleDraft } | { ok: false; error: string } {
  const title = String(raw.title ?? "").trim().slice(0, MAX_TITLE);
  const bodyText = String(raw.bodyText ?? "").trim().slice(0, MAX_BODY_CHARS);
  const paragraphs = paragraphsFromText(bodyText);
  const author = String(raw.author ?? "Hive").trim().slice(0, MAX_AUTHOR) || "Hive";
  const tags = parseTagsInput(String(raw.tags ?? ""));
  const slugHint = String(raw.slug ?? "").trim();

  if (title.length < 4) {
    return { ok: false, error: "Title must be at least 4 characters." };
  }
  if (paragraphs.length < MIN_PARAGRAPHS) {
    return { ok: false, error: "Add at least one paragraph (separate paragraphs with a blank line)." };
  }
  const short = paragraphs.find((p) => p.length < MIN_PARAGRAPH_CHARS);
  if (short) {
    return { ok: false, error: `Each paragraph needs at least ${MIN_PARAGRAPH_CHARS} characters.` };
  }

  let excerpt = String(raw.excerpt ?? "").trim().slice(0, MAX_EXCERPT);
  if (!excerpt) excerpt = excerptFromParagraphs(paragraphs, MAX_EXCERPT);
  if (excerpt.length < 20) {
    return { ok: false, error: "Excerpt is too short — add a summary or more body copy." };
  }

  return { ok: true, draft: { title, excerpt, paragraphs, author, tags, slugHint } };
}

export function buildHiveArticle(
  draft: ParsedArticleDraft,
  slug: string,
  authorEmail: string | null,
  existing?: HiveArticleStored | null,
): HiveArticleStored {
  const now = new Date().toISOString();
  return {
    id: existing?.id ?? randomUUID(),
    slug,
    title: draft.title,
    excerpt: draft.excerpt,
    body: draft.paragraphs,
    author: draft.author,
    authorEmail,
    tags: draft.tags,
    publishedAt: existing?.publishedAt ?? now,
    updatedAt: now,
  };
}

export function slugFromDraft(draft: ParsedArticleDraft): string {
  const fromHint = slugify(draft.slugHint);
  if (fromHint !== "agent") return fromHint;
  return slugify(draft.title);
}
