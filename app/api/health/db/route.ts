import { NextResponse } from "next/server";
import { getSql, hasNeonDatabase } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  if (!hasNeonDatabase()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is not set." }, { status: 503 });
  }

  try {
    const sql = getSql();
    const rows = await sql`SELECT 1 AS n`;
    const n = (rows as { n?: number }[])[0]?.n;
    return NextResponse.json({ ok: true, n: n ?? null });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Database check failed";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
