import { NextRequest, NextResponse } from "next/server";
import { isOpenAIConfigured, runVaibeeOpenAIChat } from "@/lib/vaibee-openai";

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

  try {
    if (isOpenAIConfigured()) {
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
