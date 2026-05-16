import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { collectReservedArticleSlugs } from "@/lib/article-slugs";
import { requireAdminRequest } from "@/lib/article-publish-auth";
import { buildHiveArticle, parseArticleDraft, slugFromDraft } from "@/lib/hive-article-publish";
import { findHiveArticleBySlug, readHiveArticles, upsertHiveArticle } from "@/lib/hive-articles-store";
import { ensureUniqueSlug } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = requireAdminRequest(req);
  if (denied) return denied;

  const articles = await readHiveArticles();
  return NextResponse.json({ ok: true, articles });
}

export async function POST(req: NextRequest) {
  const denied = requireAdminRequest(req);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parseArticleDraft(body as Parameters<typeof parseArticleDraft>[0]);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const existingSlug = String((body as { existingSlug?: string }).existingSlug ?? "").trim();
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
      return NextResponse.json({ ok: false, error: "Slug already in use." }, { status: 409 });
    }
    throw e;
  }

  revalidatePath("/articles");
  revalidatePath(`/articles/${slug}`);
  if (existingSlug && existingSlug !== slug) {
    revalidatePath(`/articles/${existingSlug}`);
  }

  return NextResponse.json({ ok: true, slug, url: `/articles/${slug}` });
}
