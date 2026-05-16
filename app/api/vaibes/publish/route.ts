import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { collectReservedArticleSlugs } from "@/lib/article-slugs";
import { appendPublishedVaibe } from "@/lib/published-vaibes-store";
import type { PublishedVaibeStored } from "@/lib/published-vaibe-types";
import { ensureUniqueSlug, slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 500;
const MAX_HEADLINE = 120;
const MAX_AUTHOR = 80;

type PublishBody = {
  headline?: string;
  body?: string;
  author?: string;
};

function publishSecret(): string | undefined {
  return process.env.VAIBE_PUBLISH_SECRET?.trim();
}

function denyUnlessAuthorized(req: NextRequest): NextResponse | null {
  const secret = publishSecret();
  if (!secret) return null;
  const header = req.headers.get("x-vaibe-publish-secret")?.trim() ?? "";
  if (header !== secret) {
    return NextResponse.json({ ok: false, error: "Invalid publish key." }, { status: 401 });
  }
  return null;
}

function slugBase(headline: string, body: string): string {
  const fromHeadline = slugify(headline);
  if (fromHeadline !== "agent") return fromHeadline;
  const fromBody = slugify(body.slice(0, 48));
  return fromBody !== "agent" ? fromBody : "vaibe";
}

export async function POST(req: NextRequest) {
  const denied = denyUnlessAuthorized(req);
  if (denied) return denied;

  let body: PublishBody;
  try {
    body = (await req.json()) as PublishBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const headline = String(body.headline ?? "").trim().slice(0, MAX_HEADLINE);
  const text = String(body.body ?? "").trim().slice(0, MAX_BODY);
  const author = String(body.author ?? "Hive").trim().slice(0, MAX_AUTHOR) || "Hive";

  if (text.length < 12) {
    return NextResponse.json({ ok: false, error: "Write at least 12 characters to publish." }, { status: 400 });
  }

  const taken = await collectReservedArticleSlugs();
  const slug = ensureUniqueSlug(slugBase(headline, text), taken);

  const entry: PublishedVaibeStored = {
    id: randomUUID(),
    slug,
    headline,
    body: text,
    author,
    publishedAt: new Date().toISOString(),
  };

  try {
    await appendPublishedVaibe(entry);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "duplicate_slug") {
      return NextResponse.json({ ok: false, error: "Slug conflict — try again." }, { status: 409 });
    }
    throw e;
  }

  revalidatePath("/articles");
  revalidatePath(`/articles/${slug}`);

  return NextResponse.json({ ok: true, slug, url: `/articles/${slug}` });
}
