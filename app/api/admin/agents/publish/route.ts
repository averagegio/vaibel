import { NextRequest, NextResponse } from "next/server";
import { requireAdminSecret } from "@/lib/admin-auth";
import { findApplicationById } from "@/lib/application-records";
import {
  appendApprovedListing,
  collectTakenSlugs,
  readApprovedListings,
} from "@/lib/approved-listings-store";
import { SEED_AGENTS } from "@/lib/agents";
import { ensureUniqueSlug, slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function pitchToTagline(pitch: string, max = 200): string {
  const t = pitch.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

type PublishBody = {
  applicationId?: string;
  slug?: string;
  category?: string;
  tagline?: string;
};

export async function POST(req: NextRequest) {
  const denied = requireAdminSecret(req);
  if (denied) return denied;

  let body: PublishBody;
  try {
    body = (await req.json()) as PublishBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const applicationId = String(body.applicationId ?? "").trim();
  if (!applicationId) {
    return NextResponse.json({ ok: false, error: "applicationId is required." }, { status: 400 });
  }

  const application = await findApplicationById(applicationId);
  if (!application) {
    return NextResponse.json({ ok: false, error: "Application not found." }, { status: 404 });
  }

  const existing = await readApprovedListings();
  if (existing.some((e) => e.applicationId === applicationId)) {
    return NextResponse.json({ ok: false, error: "Application already published." }, { status: 409 });
  }

  const seedSlugs = SEED_AGENTS.map((s) => s.slug);
  const taken = collectTakenSlugs(seedSlugs, existing);

  const requestedSlug =
    typeof body.slug === "string" && body.slug.trim() ? slugify(body.slug) : slugify(application.agentDisplayName);
  const slug = ensureUniqueSlug(requestedSlug || "agent", taken);

  const taglineOverride =
    typeof body.tagline === "string" && body.tagline.trim().length >= 10 ? body.tagline.trim() : null;
  const tagline = taglineOverride ?? pitchToTagline(application.agentPitch);

  const category =
    typeof body.category === "string" && body.category.trim()
      ? body.category.trim().slice(0, 48)
      : "Community";

  const listing = {
    slug,
    name: application.agentDisplayName.trim(),
    tagline,
    category,
    installsLabel: "New",
    rating: 5,
    author: application.applicantName.trim(),
    applicationId: application.id,
    agentApiUrl: application.agentApiUrl.trim(),
    approvedAt: new Date().toISOString(),
  };

  try {
    await appendApprovedListing(listing);
  } catch (e) {
    if (e instanceof Error && e.message === "duplicate_application") {
      return NextResponse.json({ ok: false, error: "Application already published." }, { status: 409 });
    }
    throw e;
  }

  return NextResponse.json({ ok: true, slug, listing });
}
