import { randomUUID } from "crypto";

/** URL-safe slug from display text */
export function slugify(text: string): string {
  const s = text
    .trim()
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "agent";
}

/** Append short suffix until slug is not in `taken` */
export function ensureUniqueSlug(baseSlug: string, taken: Set<string>): string {
  let slug = baseSlug;
  while (taken.has(slug)) {
    slug = `${baseSlug}-${randomUUID().slice(0, 8)}`;
  }
  return slug;
}
