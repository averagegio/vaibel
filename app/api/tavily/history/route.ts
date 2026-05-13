import { NextRequest, NextResponse } from "next/server";
import { listSearchLog } from "@/lib/tavily-db";
import { hasNeonDatabase } from "@/lib/db";
import { isTavilyConfigured } from "@/lib/tavily-server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!isTavilyConfigured() && !hasNeonDatabase()) {
    return NextResponse.json(
      { error: "Configure TAVILY_API_KEY and/or DATABASE_URL to read search history." },
      { status: 503 },
    );
  }

  const limit = Number.parseInt(req.nextUrl.searchParams.get("limit") ?? "50", 10);
  const entries = await listSearchLog(Number.isFinite(limit) ? limit : 50);
  return NextResponse.json({ entries });
}
