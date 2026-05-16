import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/article-publish-auth";
import { deleteHiveArticle, findHiveArticleBySlug } from "@/lib/hive-articles-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const denied = requireAdminRequest(req);
  if (denied) return denied;

  const { slug } = await ctx.params;
  const article = await findHiveArticleBySlug(slug);
  if (!article) {
    return NextResponse.json({ ok: false, error: "Article not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, article });
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const denied = requireAdminRequest(req);
  if (denied) return denied;

  const { slug } = await ctx.params;
  const deleted = await deleteHiveArticle(slug);
  if (!deleted) {
    return NextResponse.json({ ok: false, error: "Article not found." }, { status: 404 });
  }

  revalidatePath("/articles");
  revalidatePath(`/articles/${slug}`);

  return NextResponse.json({ ok: true });
}
