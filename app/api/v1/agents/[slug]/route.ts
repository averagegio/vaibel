import { NextResponse } from "next/server";
import { getPublishedAgentBySlug } from "@/lib/agents";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const agent = await getPublishedAgentBySlug(slug);
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }
  return NextResponse.json({ data: agent });
}
