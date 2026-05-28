import { parseXImagePayload } from "@/lib/x-image";
import type { XMediaAttachment } from "@/lib/x-server";

export function extractXMediaFromBody(
  body: unknown,
): { ok: true; media?: XMediaAttachment } | { ok: false; error: string } {
  const raw = body as { xImageBase64?: string; xImageMimeType?: string };
  const b64 = typeof raw.xImageBase64 === "string" ? raw.xImageBase64.trim() : "";
  if (!b64) {
    return { ok: true, media: undefined };
  }
  const parsed = parseXImagePayload(raw);
  if (!parsed.ok) {
    return { ok: false, error: parsed.error };
  }
  return { ok: true, media: { buffer: parsed.buffer, mimeType: parsed.mimeType } };
}
