import { NextRequest, NextResponse } from "next/server";
import { getEntitlement, normalizeBillingEmail } from "@/lib/billing-store";
import type { SubscriptionTier } from "@/lib/stripe-server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeAdminSecret(raw: string | undefined): string {
  if (!raw) return "";
  let s = raw.trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

export function serverAdminSecret(): string {
  return normalizeAdminSecret(process.env.VAIBEE_ADMIN_SECRET);
}

export function adminSecretFromRequest(req: NextRequest): string {
  const auth = req.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const header = req.headers.get("x-vaibee-admin-secret")?.trim() ?? "";
  return bearer || header;
}

export function isAdminRequest(req: NextRequest): boolean {
  const secret = serverAdminSecret();
  if (!secret) return false;
  const token = normalizeAdminSecret(adminSecretFromRequest(req));
  return Boolean(token && token === secret);
}

export function requireAdminRequest(req: NextRequest): NextResponse | null {
  const secret = serverAdminSecret();
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "VAIBEE_ADMIN_SECRET is not set on the server." },
      { status: 503 },
    );
  }
  if (!isAdminRequest(req)) {
    const sent = normalizeAdminSecret(adminSecretFromRequest(req));
    return NextResponse.json(
      {
        ok: false,
        error: sent
          ? "Admin secret does not match VAIBEE_ADMIN_SECRET on the server. Check Vercel env vars and redeploy."
          : "Missing admin secret. Paste VAIBEE_ADMIN_SECRET into the Admin secret field in the form.",
      },
      { status: 401 },
    );
  }
  return null;
}

export function normalizeAuthorEmail(raw: string): string | null {
  const email = normalizeBillingEmail(raw);
  if (!email || !EMAIL_RE.test(email)) return null;
  return email;
}

/** Vibe team (and admin via separate check) may publish long-form articles. */
export async function hasTeamArticleAccess(email: string): Promise<boolean> {
  const ent = await getEntitlement(email);
  return Boolean(ent?.active && ent.tier === "team");
}

export function tierAllowsArticles(tier: SubscriptionTier | null | undefined): boolean {
  return tier === "team";
}
