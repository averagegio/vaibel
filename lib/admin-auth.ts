import { NextRequest, NextResponse } from "next/server";
import { adminSecretFromRequest, serverAdminSecret } from "@/lib/article-publish-auth";

function normalizeToken(raw: string): string {
  let s = raw.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

export function requireAdminSecret(req: NextRequest): NextResponse | null {
  const secret = serverAdminSecret();
  if (!secret) {
    return NextResponse.json({ ok: false, error: "VAIBEE_ADMIN_SECRET is not set on the server." }, { status: 503 });
  }
  const token = normalizeToken(adminSecretFromRequest(req));
  if (!token || token !== secret) {
    return NextResponse.json(
      {
        ok: false,
        error: token
          ? "Admin secret does not match VAIBEE_ADMIN_SECRET on the server."
          : "Missing admin secret (x-vaibee-admin-secret header).",
      },
      { status: 401 },
    );
  }
  return null;
}
