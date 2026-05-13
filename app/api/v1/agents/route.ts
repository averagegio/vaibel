import { NextResponse } from "next/server";
import { AGENTS } from "@/lib/agents";

export function GET() {
  return NextResponse.json({
    data: AGENTS,
    meta: {
      version: "2024-11-01",
      count: AGENTS.length,
    },
  });
}
