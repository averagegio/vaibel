import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { saveInquiry } from "@/lib/inquiries-store";

export const runtime = "nodejs";

const ROLES = new Set([
  "engineering",
  "design",
  "growth",
  "operations",
  "community",
  "other",
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();
    const links = String(formData.get("links") ?? "").trim();
    const pitch = String(formData.get("pitch") ?? "").trim();

    if (!name || !email || !role || !pitch) {
      return NextResponse.json({ ok: false, error: "Name, email, role, and pitch are required." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
    }

    if (!ROLES.has(role)) {
      return NextResponse.json({ ok: false, error: "Pick a valid role area." }, { status: 400 });
    }

    if (pitch.length < 30) {
      return NextResponse.json({ ok: false, error: "Tell us a bit more — at least 30 characters." }, { status: 400 });
    }

    if (links) {
      const first = links.split(/\s+/)[0];
      try {
        new URL(first);
      } catch {
        return NextResponse.json({ ok: false, error: "Links must start with a valid URL." }, { status: 400 });
      }
    }

    const id = randomUUID();

    await saveInquiry({
      id,
      kind: "career",
      name,
      email,
      topic: null,
      role,
      links: links || null,
      message: pitch,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not submit your application." }, { status: 500 });
  }
}
