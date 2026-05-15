import { NextRequest, NextResponse } from "next/server";
import { requireAdminSecret } from "@/lib/admin-auth";
import { readApplications } from "@/lib/application-records";
import { readApprovedListings } from "@/lib/approved-listings-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = requireAdminSecret(req);
  if (denied) return denied;

  const status = req.nextUrl.searchParams.get("status");
  let rows = await readApplications();
  if (status) {
    rows = rows.filter((r) => r.status === status);
  }

  const publishedIds = new Set((await readApprovedListings()).map((p) => p.applicationId));
  const applications = rows.map((r) => ({
    id: r.id,
    status: r.status,
    applicantName: r.applicantName,
    cofounderEmail: r.cofounderEmail,
    agentDisplayName: r.agentDisplayName,
    agentApiUrl: r.agentApiUrl,
    createdAt: r.createdAt,
    published: publishedIds.has(r.id),
  }));

  return NextResponse.json({ ok: true, applications });
}
