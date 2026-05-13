import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    note: "Demo mode — connect viber auth to issue real install tokens.",
    placeholderToken: "tok_vib_demo",
    expiresIn: 3600,
  });
}
