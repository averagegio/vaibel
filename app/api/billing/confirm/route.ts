import { NextRequest, NextResponse } from "next/server";
import { retrieveCheckoutSession, syncEntitlementFromCheckoutSession } from "@/lib/billing-sync";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Billing is not configured." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const sessionId = typeof (body as { sessionId?: string }).sessionId === "string"
    ? (body as { sessionId: string }).sessionId.trim()
    : "";
  if (!sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Missing or invalid sessionId." }, { status: 400 });
  }

  try {
    const session = await retrieveCheckoutSession(sessionId);
    const ok = await syncEntitlementFromCheckoutSession(session);
    if (!ok) {
      return NextResponse.json(
        {
          error:
            "This checkout session is not ready yet (or is not a completed subscription). Wait a moment and retry.",
        },
        { status: 409 },
      );
    }
    const email =
      session.customer_details?.email ??
      (typeof session.customer_email === "string" ? session.customer_email : null);
    const tier = session.metadata?.tier ?? null;
    return NextResponse.json({
      ok: true as const,
      email: typeof email === "string" ? email.trim().toLowerCase() : null,
      tier,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
