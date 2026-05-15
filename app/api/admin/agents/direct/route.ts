import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminSecret } from "@/lib/admin-auth";
import {
  appendApprovedListing,
  collectTakenSlugs,
  readApprovedListings,
} from "@/lib/approved-listings-store";
import { SEED_AGENTS } from "@/lib/agents";
import { ensureUniqueSlug, slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DirectBody = {
  name?: string;
  tagline?: string;
  agentApiUrl?: string;
  author?: string;
  category?: string;
  slug?: string;
  installsLabel?: string;
  rating?: number;
};

export async function POST(req: NextRequest) {
  const denied = requireAdminSecret(req);
  if (denied) return denied;

  let body: DirectBody;
  try {
    body = (await req.json()) as DirectBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const tagline = String(body.tagline ?? "").trim();
  const agentApiUrl = String(body.agentApiUrl ?? "").trim();
  const author = String(body.author ?? "").trim();

  if (!name || !tagline || !agentApiUrl || !author) {
    return NextResponse.json(
      { ok: false, error: "name, tagline, agentApiUrl, and author are required." },
      { status: 400 },
    );
  }

  if (tagline.length < 10) {
    return NextResponse.json({ ok: false, error: "tagline must be at least 10 characters." }, { status: 400 });
  }

  try {
    new URL(agentApiUrl);
  } catch {
    return NextResponse.json({ ok: false, error: "agentApiUrl must be a valid URL." }, { status: 400 });
  }

  const category =
    typeof body.category === "string" && body.category.trim()
      ? body.category.trim().slice(0, 48)
      : "Community";

  const installsLabel =
    typeof body.installsLabel === "string" && body.installsLabel.trim()
      ? body.installsLabel.trim().slice(0, 32)
      : "New";

  let rating = typeof body.rating === "number" && Number.isFinite(body.rating) ? body.rating : 5;
  rating = Math.min(5, Math.max(1, rating));

  const existing = await readApprovedListings();
  const seedSlugs = SEED_AGENTS.map((s) => s.slug);
  const taken = collectTakenSlugs(seedSlugs, existing);

  const requestedSlug =
    typeof body.slug === "string" && body.slug.trim() ? slugify(body.slug) : slugify(name);
  const slug = ensureUniqueSlug(requestedSlug || "agent", taken);

  const applicationId = `direct:${randomUUID()}`;
  const listing = {
    slug,
    name,
    tagline,
    category,
    installsLabel,
    rating,
    author,
    applicationId,
    agentApiUrl,
    approvedAt: new Date().toISOString(),
  };

  try {
    await appendApprovedListing(listing);
  } catch (e) {
    if (e instanceof Error && e.message === "duplicate_application") {
      return NextResponse.json({ ok: false, error: "Listing already exists." }, { status: 409 });
    }
    throw e;
  }

  return NextResponse.json({ ok: true, slug, listing });
}
