import { NextRequest, NextResponse } from "next/server";
import type { TavilySearchOptions } from "@tavily/core";
import { appendSearchLog } from "@/lib/tavily-db";
import { getTavily, isTavilyConfigured } from "@/lib/tavily-server";

export const runtime = "nodejs";

type SearchBody = {
  query?: string;
  searchDepth?: TavilySearchOptions["searchDepth"];
  topic?: TavilySearchOptions["topic"];
  maxResults?: number;
  includeAnswer?: TavilySearchOptions["includeAnswer"];
};

export async function POST(req: NextRequest) {
  if (!isTavilyConfigured()) {
    return NextResponse.json({ error: "Tavily is not configured. Set TAVILY_API_KEY." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const b = body as SearchBody;
  const query = typeof b.query === "string" ? b.query.trim() : "";
  if (!query || query.length > 2000) {
    return NextResponse.json({ error: "Missing or invalid query (max 2000 chars)." }, { status: 400 });
  }

  const maxResults =
    typeof b.maxResults === "number" && Number.isFinite(b.maxResults)
      ? Math.min(20, Math.max(1, Math.floor(b.maxResults)))
      : 8;

  const options: TavilySearchOptions = {
    maxResults,
    includeAnswer: b.includeAnswer ?? true,
  };
  if (b.searchDepth) options.searchDepth = b.searchDepth;
  if (b.topic) options.topic = b.topic;

  try {
    const tv = getTavily();
    const res = await tv.search(query, options);

    const logEntry = await appendSearchLog({
      query: res.query ?? query,
      requestId: res.requestId,
      responseTime: res.responseTime,
      answer: res.answer,
      results: (res.results ?? []).map((r) => ({ title: r.title, url: r.url })),
    });

    return NextResponse.json({
      tavily: res,
      log: { id: logEntry.id, createdAt: logEntry.createdAt },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Tavily request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
