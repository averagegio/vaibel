import { getSql } from "@/lib/db";
import type { InquiryRecord } from "@/lib/inquiry-types";

export async function insertInquiryInNeon(entry: InquiryRecord): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO inquiries (id, kind, name, email, topic, role, links, message, created_at)
    VALUES (
      ${entry.id},
      ${entry.kind},
      ${entry.name},
      ${entry.email},
      ${entry.topic},
      ${entry.role},
      ${entry.links},
      ${entry.message},
      ${entry.createdAt}
    )
  `;
}
