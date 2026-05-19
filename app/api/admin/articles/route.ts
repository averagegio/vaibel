import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/article-publish-auth";
import { parseArticleDraft } from "@/lib/hive-article-publish";
import { readHiveArticles } from "@/lib/hive-articles-store";
import { publishHiveArticleServer } from "@/lib/publish-hive-article-server";
import { getAppOrigin } from "@/lib/stripe-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = requireAdminRequest(req);
  if (denied) return denied;

  const articles = await readHiveArticles();
  return NextResponse.json({ ok: true, articles });
}

export async function POST(req: NextRequest) {
  try {
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
    const postToX = (body as { postToX?: boolean }).postToX !== false;

    const published = await publishHiveArticleServer({
      title: parsed.draft.title,
      excerpt: parsed.draft.excerpt,
      bodyText: parsed.draft.paragraphs.join("\n\n"),
      author: parsed.draft.author,
      tags: parsed.draft.tags.join(", "),
      slug: parsed.draft.slugHint,
      existingSlug,
      appOrigin: getAppOrigin(req),
      postToX,
    });

    if (!published.ok) {
      const status = published.error.includes("Slug") ? 409 : 500;
      return NextResponse.json({ ok: false, error: published.error }, { status });
    }

    return NextResponse.json({
      ok: true,
      slug: published.slug,
      url: published.path,
      xTweetUrl: published.xTweetUrl ?? null,
      xError: published.xError ?? null,
    });
  } catch (e) {
    console.error("[vaibel] admin articles POST:", e);
    const message = e instanceof Error ? e.message : "Publish failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
