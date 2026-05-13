import { NextRequest, NextResponse } from "next/server";
import { getAppOrigin, getPriceIdForTier, getStripe, type SubscriptionTier } from "@/lib/stripe-server";

export const runtime = "nodejs";

const TIERS = new Set<SubscriptionTier>(["starter", "team", "scale"]);

const EMAIL_MAX = 254;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeOptionalEmail(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed || trimmed.length > EMAIL_MAX) return undefined;
  if (!EMAIL_RE.test(trimmed)) return undefined;
  return trimmed;
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Billing is not configured yet. Add STRIPE_SECRET_KEY and price IDs in your environment." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = body as { tier?: string; email?: string };
  const tier = parsed.tier;
  if (!tier || !TIERS.has(tier as SubscriptionTier)) {
    return NextResponse.json({ error: "Missing or invalid tier." }, { status: 400 });
  }

  const customerEmail = normalizeOptionalEmail(parsed.email);

  const priceId = getPriceIdForTier(tier as SubscriptionTier);
  if (!priceId) {
    return NextResponse.json(
      {
        error:
          "Stripe price ID missing for this tier. Set STRIPE_PRICE_STARTER, STRIPE_PRICE_TEAM, and STRIPE_PRICE_SCALE.",
      },
      { status: 503 },
    );
  }

  const origin = getAppOrigin(req);

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/billing/return?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=1`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      ...(customerEmail
        ? { customer_email: customerEmail, client_reference_id: customerEmail }
        : {}),
      subscription_data: {
        metadata: { tier },
      },
      metadata: { tier },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Checkout session did not return a URL." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
