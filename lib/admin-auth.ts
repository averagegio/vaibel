import { NextRequest, NextResponse } from "next/server";

export function requireAdminSecret(req: NextRequest): NextResponse | null {
  const secret = process.env.VAIBEE_ADMIN_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ ok: false, error: "VAIBEE_ADMIN_SECRET is not set on the server." }, { status: 503 });
  }
  const auth = req.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const header = req.headers.get("x-vaibee-admin-secret")?.trim() ?? "";
  const token = bearer || header;
  if (!token || token !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  return null;
}
