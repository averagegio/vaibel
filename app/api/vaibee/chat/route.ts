import { NextRequest, NextResponse } from "next/server";
import { getAppOrigin } from "@/lib/stripe-server";
import { canVaibeeChatPublishArticles } from "@/lib/vaibee-chat-publish";
import { normalizeAuthorEmail } from "@/lib/article-publish-auth";
import { isOpenAIConfigured, runVaibeeOpenAIChat, runVaibeeOpenAIChatWithTools } from "@/lib/vaibee-openai";
import { isTavilyConfigured } from "@/lib/tavily-server";

export const runtime = "nodejs";

function buildFallbackReply(message: string): string {
  const m = message.trim();
  const lower = m.toLowerCase();
  if (!m) {
    return "Drop a question in the box — I am here to help you explore the hive.";
  }
  if (/^(hi|hey|hello)\b/.test(lower)) {
    return "Hey — I am Vaibee. Ask me about agents, pricing, Stripe checkout, or how to use the REST API.";
  }
  if (lower.includes("price") || lower.includes("billing") || lower.includes("subscribe")) {
    return "Plans live on the Pricing page — Stripe Checkout handles billing. I can point you to /pricing or the dashboard once you are signed in.";
  }
  if (lower.includes("api") || lower.includes("rest") || lower.includes("install")) {
    return "The REST API docs cover installs, agents by slug, and webhooks. Open /api-docs from the nav for the full reference.";
  }
  if (lower.includes("store") || lower.includes("agent")) {
    return "Browse curated agents in the store — each listing links to API details so you can wire the slug into your stack.";
  }
  if (
    (lower.includes("article") || lower.includes("publish")) &&
    (lower.includes("write") || lower.includes("post") || lower.includes("create"))
  ) {
    if (!isOpenAIConfigured()) {
      return "Set OPENAI_API_KEY to let me draft and publish articles from chat.";
    }
    if (!canVaibeeChatPublishArticles()) {
      return "Chat publishing is off — set VAIBEE_ADMIN_SECRET and VAIBEE_CHAT_PUBLISH_ARTICLES=true on the server, or use /admin/articles.";
    }
    return "Ask me again with OPENAI enabled — I can search the web and publish articles to /articles when server tools are configured.";
  }
  const preview = m.length > 160 ? `${m.slice(0, 160)}…` : m;
  return `You said: “${preview}”. Set OPENAI_API_KEY (and optionally OPENAI_MODEL) for full conversational answers. Until then, try the store, pricing, or API docs from the header.`;
}

type ChatTurn = { role: "user" | "assistant"; content: string };

function sanitizePrior(raw: unknown): ChatTurn[] {
  if (!Array.isArray(raw)) return [];
  const out: ChatTurn[] = [];
  for (const item of raw) {
    if (out.length >= 24) break;
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: string }).role;
    const content = (item as { content?: string }).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
    const t = content.trim();
    if (!t) continue;
    out.push({ role, content: t.slice(0, 8000) });
  }
  return out;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const message = typeof (body as { message?: string }).message === "string" ? (body as { message: string }).message.trim() : "";
  if (!message || message.length > 8000) {
    return NextResponse.json({ error: "Missing or invalid message (max 8000 chars)." }, { status: 400 });
  }

  const prior = sanitizePrior((body as { messages?: unknown }).messages);
  const requesterEmail = normalizeAuthorEmail(String((body as { email?: string }).email ?? ""));
  const appOrigin = getAppOrigin(req);
  const useTools =
    isOpenAIConfigured() && (canVaibeeChatPublishArticles(requesterEmail) || isTavilyConfigured());

  try {
    if (isOpenAIConfigured()) {
      if (useTools) {
        const { reply, articleUrl, toolsUsed } = await runVaibeeOpenAIChatWithTools(
          message,
          prior,
          appOrigin,
          requesterEmail,
        );
        return NextResponse.json({
          reply,
          source: "openai" as const,
          articleUrl: articleUrl ?? null,
          toolsUsed: toolsUsed.length ? toolsUsed : undefined,
        });
      }
      const reply = await runVaibeeOpenAIChat(message, prior);
      return NextResponse.json({ reply, source: "openai" as const });
    }
    const reply = buildFallbackReply(message);
    return NextResponse.json({ reply, source: "fallback" as const });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Chat request failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
