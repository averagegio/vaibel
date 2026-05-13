/** Browser-only: resize image file to JPEG data URL for localStorage-safe sizes. */

function approxBytesFromDataUrl(dataUrl: string): number {
  const idx = dataUrl.indexOf(",");
  if (idx === -1) return dataUrl.length;
  const b64 = dataUrl.slice(idx + 1).replace(/=+$/, "");
  return Math.floor((b64.length * 3) / 4);
}

export async function fileToResizedJpegDataUrl(
  file: File,
  options: { maxWidth: number; maxHeight: number; maxBytes: number },
): Promise<string | null> {
  if (typeof window === "undefined") return null;
  if (!file.type.startsWith("image/")) return null;

  const { maxWidth, maxHeight, maxBytes } = options;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return null;

  const { width, height } = bitmap;
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  let w = Math.max(1, Math.round(width * ratio));
  let h = Math.max(1, Math.round(height * ratio));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return null;
  }

  let quality = 0.88;
  let dataUrl = "";

  for (let attempt = 0; attempt < 12; attempt += 1) {
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(bitmap, 0, 0, w, h);
    dataUrl = canvas.toDataURL("image/jpeg", quality);
    if (approxBytesFromDataUrl(dataUrl) <= maxBytes) break;
    if (quality > 0.52) {
      quality -= 0.06;
    } else {
      w = Math.max(32, Math.floor(w * 0.85));
      h = Math.max(32, Math.floor(h * 0.85));
      quality = 0.82;
    }
  }

  bitmap.close();
  if (!dataUrl || approxBytesFromDataUrl(dataUrl) > maxBytes) {
    return null;
  }
  return dataUrl;
}
