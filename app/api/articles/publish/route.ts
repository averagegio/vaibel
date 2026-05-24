import { NextRequest, NextResponse } from "next/server";
import { hasTeamArticleAccess, normalizeAuthorEmail } from "@/lib/article-publish-auth";
import { parseArticleDraft } from "@/lib/hive-article-publish";
import { extractXMediaFromBody } from "@/lib/extract-x-media";
import { publishHiveArticleServer } from "@/lib/publish-hive-article-server";
import { getAppOrigin } from "@/lib/stripe-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = body as { email?: string; tags?: string; postToX?: boolean };
  const email = normalizeAuthorEmail(String(raw.email ?? ""));
  if (!email) {
    return NextResponse.json({ ok: false, error: "Sign in with a valid email to publish." }, { status: 400 });
  }

  if (!(await hasTeamArticleAccess(email))) {
    return NextResponse.json(
      {
        ok: false,
        error: "Publishing articles requires an active Vibe team subscription on this email.",
        code: "team_required",
      },
      { status: 403 },
    );
  }

  const parsed = parseArticleDraft(raw);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const xMediaResult = extractXMediaFromBody(body);
  if (!xMediaResult.ok) {
    return NextResponse.json({ ok: false, error: xMediaResult.error }, { status: 400 });
  }

  const memberTags = ["Hive member", ...parsed.draft.tags.filter((t) => t.toLowerCase() !== "hive member")];
  const postToX = raw.postToX !== false;

  const published = await publishHiveArticleServer({
    title: parsed.draft.title,
    excerpt: parsed.draft.excerpt,
    bodyText: parsed.draft.paragraphs.join("\n\n"),
    author: parsed.draft.author,
    tags: memberTags.join(", "),
    slug: parsed.draft.slugHint,
    authorEmail: email,
    appOrigin: getAppOrigin(req),
    postToX,
    xMedia: xMediaResult.media,
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
}
