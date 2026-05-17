import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { collectReservedArticleSlugs } from "@/lib/article-slugs";
import { hasTeamArticleAccess, normalizeAuthorEmail } from "@/lib/article-publish-auth";
import { buildHiveArticle, parseArticleDraft, slugFromDraft } from "@/lib/hive-article-publish";
import { upsertHiveArticle } from "@/lib/hive-articles-store";
import { ensureUniqueSlug } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = body as { email?: string; tags?: string };
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

  const memberTags = ["Hive member", ...parsed.draft.tags.filter((t) => t.toLowerCase() !== "hive member")];
  const draft = { ...parsed.draft, tags: memberTags };

  const taken = await collectReservedArticleSlugs();
  const slug = ensureUniqueSlug(slugFromDraft(draft), taken);
  const entry = buildHiveArticle(draft, slug, email, null);

  try {
    await upsertHiveArticle(entry);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "duplicate_slug") {
      return NextResponse.json({ ok: false, error: "Slug conflict — try again." }, { status: 409 });
    }
    console.error("[vaibel] member article publish failed:", e);
    return NextResponse.json(
      { ok: false, error: msg || "Could not save article to the database." },
      { status: 500 },
    );
  }

  revalidatePath("/articles");
  revalidatePath(`/articles/${slug}`);

  return NextResponse.json({ ok: true, slug, url: `/articles/${slug}` });
}
