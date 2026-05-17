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

    const tables = (await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('hive_articles', 'hive_vaibes', 'agent_store_listings')
    `) as { table_name: string }[];
    const present = new Set(tables.map((t) => t.table_name));
    const required = ["hive_articles", "hive_vaibes"] as const;
    const missing = required.filter((t) => !present.has(t));

    return NextResponse.json({
      ok: missing.length === 0,
      n: n ?? null,
      tables: Object.fromEntries(required.map((t) => [t, present.has(t)])),
      missing: missing.length ? missing : undefined,
      hint:
        missing.length > 0
          ? "Run db/neon/003_hive_vaibes.sql and 004_hive_articles.sql on this Neon database (same branch as DATABASE_URL)."
          : undefined,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Database check failed";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
