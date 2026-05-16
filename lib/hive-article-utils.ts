export function paragraphsFromText(raw: string): string[] {
  return raw
    .split(/\n\s*\n/)
    .map((p) => p.trim().replace(/\n/g, " "))
    .filter(Boolean);
}

export function textFromParagraphs(paragraphs: string[]): string {
  return paragraphs.join("\n\n");
}

export function parseTagsInput(raw: string): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const part of raw.split(",")) {
    const t = part.trim();
    if (!t || seen.has(t.toLowerCase())) continue;
    seen.add(t.toLowerCase());
    tags.push(t.slice(0, 32));
    if (tags.length >= 8) break;
  }
  return tags;
}

export function readMinutesForBody(paragraphs: string[]): number {
  const words = paragraphs.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function excerptFromParagraphs(paragraphs: string[], max = 320): string {
  const t = paragraphs.join(" ").trim().replace(/\s+/g, " ");
  if (!t) return "";
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}
