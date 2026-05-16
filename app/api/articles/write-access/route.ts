import { NextRequest, NextResponse } from "next/server";
import {
  hasTeamArticleAccess,
  isAdminRequest,
  normalizeAuthorEmail,
} from "@/lib/article-publish-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const email = normalizeAuthorEmail(String((body as { email?: string }).email ?? ""));
  const isAdmin = isAdminRequest(req);
  const teamWriter = email ? await hasTeamArticleAccess(email) : false;

  return NextResponse.json({
    ok: true,
    isAdmin,
    teamWriter,
    canWriteArticles: isAdmin || teamWriter,
  });
}
