import { NextRequest, NextResponse } from "next/server";
import { getEntitlement, normalizeBillingEmail } from "@/lib/billing-store";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = typeof (body as { email?: string }).email === "string" ? (body as { email: string }).email : "";
  const email = normalizeBillingEmail(raw);
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }

  const ent = await getEntitlement(email);
  const active = Boolean(ent?.active);
  return NextResponse.json({
    active,
    tier: active ? ent?.tier ?? null : null,
    stripeSubscriptionId: ent?.stripeSubscriptionId ?? null,
  });
}
