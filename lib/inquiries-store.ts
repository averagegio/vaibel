import { appendFile, mkdir } from "fs/promises";
import path from "path";
import { hasNeonDatabase } from "@/lib/db";
import { insertInquiryInNeon } from "@/lib/inquiries-neon";
import type { InquiryRecord } from "@/lib/inquiry-types";

/** One file per kind, mirroring the prior .data/*.jsonl approach. */
function filePathForKind(kind: InquiryRecord["kind"]): string {
  const name = kind === "career" ? "careers.jsonl" : "contact.jsonl";
  return path.join(process.cwd(), ".data", name);
}

async function appendInquiryToFile(entry: InquiryRecord): Promise<void> {
  const filePath = filePathForKind(entry.kind);
  await mkdir(path.dirname(filePath), { recursive: true });
  await appendFile(filePath, `${JSON.stringify(entry)}\n`);
}

/**
 * Persist a contact/career submission. Prefers Neon; falls back to local
 * .data/*.jsonl when no database is configured or the insert fails.
 */
export async function saveInquiry(entry: InquiryRecord): Promise<void> {
  if (hasNeonDatabase()) {
    try {
      await insertInquiryInNeon(entry);
      return;
    } catch (err) {
      console.error(
        "[vaibel] inquiries insert failed — using file store. Did you run db/neon/005_inquiries.sql?",
        err,
      );
      await appendInquiryToFile(entry);
      return;
    }
  }
  await appendInquiryToFile(entry);
}
