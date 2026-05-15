import { NextResponse } from "next/server";
import { listPublishedAgents } from "@/lib/agents";

export const dynamic = "force-dynamic";

export async function GET() {
  const agents = await listPublishedAgents();
  return NextResponse.json({
    data: agents,
    meta: {
      version: "2024-11-01",
      count: agents.length,
    },
  });
}
