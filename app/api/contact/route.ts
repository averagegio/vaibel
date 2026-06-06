import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { saveInquiry } from "@/lib/inquiries-store";

export const runtime = "nodejs";

const TOPICS = new Set(["general", "support", "partnership", "press", "billing", "other"]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const topic = String(formData.get("topic") ?? "general").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Name, email, and message are required." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
    }

    if (message.length < 10) {
      return NextResponse.json({ ok: false, error: "Message must be at least 10 characters." }, { status: 400 });
    }

    const safeTopic = TOPICS.has(topic) ? topic : "general";
    const id = randomUUID();

    await saveInquiry({
      id,
      kind: "contact",
      name,
      email,
      topic: safeTopic,
      role: null,
      links: null,
      message,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not send your message." }, { status: 500 });
  }
}
