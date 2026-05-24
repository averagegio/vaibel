const MAX_BYTES = 4 * 1024 * 1024;

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export type ParsedXImage =
  | { ok: true; buffer: Buffer; mimeType: string }
  | { ok: false; error: string };

export function parseXImagePayload(raw: {
  xImageBase64?: string;
  xImageMimeType?: string;
}): ParsedXImage {
  const b64 = typeof raw.xImageBase64 === "string" ? raw.xImageBase64.trim() : "";
  if (!b64) {
    return { ok: false, error: "No image provided." };
  }

  const mimeType = (typeof raw.xImageMimeType === "string" ? raw.xImageMimeType : "image/jpeg")
    .trim()
    .toLowerCase();

  if (!ALLOWED_MIME.has(mimeType)) {
    return { ok: false, error: "Image must be JPEG, PNG, WebP, or GIF." };
  }

  try {
    const buffer = Buffer.from(b64, "base64");
    if (buffer.length < 32) {
      return { ok: false, error: "Image file is too small." };
    }
    if (buffer.length > MAX_BYTES) {
      return { ok: false, error: "Image must be 4 MB or smaller." };
    }
    return { ok: true, buffer, mimeType };
  } catch {
    return { ok: false, error: "Invalid image data." };
  }
}
