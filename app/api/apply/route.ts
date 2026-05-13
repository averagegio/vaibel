import { randomUUID } from "crypto";
import { appendFile, mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const applicantName = String(formData.get("applicantName") ?? "").trim();
    const cofounderEmail = String(formData.get("cofounderEmail") ?? "").trim();
    const agentApiUrl = String(formData.get("agentApiUrl") ?? "").trim();
    const logo = formData.get("logo");

    if (!applicantName || !cofounderEmail || !agentApiUrl) {
      return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
    }

    try {
      new URL(agentApiUrl);
    } catch {
      return NextResponse.json({ ok: false, error: "Agent API must be a valid URL." }, { status: 400 });
    }

    const id = randomUUID();
    const root = process.cwd();
    let logoRel: string | null = null;

    if (logo instanceof File && logo.size > 0) {
      if (logo.size > MAX_BYTES) {
        return NextResponse.json({ ok: false, error: "Logo must be 4 MB or smaller." }, { status: 400 });
      }
      const dataDir = path.join(root, ".data", "uploads");
      await mkdir(dataDir, { recursive: true });
      const safeOriginal = logo.name.replace(/[^\w.\-]/g, "_").slice(0, 120) || "logo";
      const filePath = path.join(dataDir, `${id}_${safeOriginal}`);
      const buffer = Buffer.from(await logo.arrayBuffer());
      await writeFile(filePath, buffer);
      logoRel = path.relative(root, filePath);
    }

    const applicationsPath = path.join(root, ".data", "applications.jsonl");
    await mkdir(path.dirname(applicationsPath), { recursive: true });
    const record = {
      id,
      applicantName,
      cofounderEmail,
      agentApiUrl,
      logoFile: logoRel,
      createdAt: new Date().toISOString(),
    };
    await appendFile(applicationsPath, `${JSON.stringify(record)}\n`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not save application." }, { status: 500 });
  }
}
