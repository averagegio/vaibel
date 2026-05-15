import type { ApprovedListingStored } from "@/lib/agent-listing-types";
import { getSql } from "@/lib/db";

type NeonListingRow = {
  application_id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  installs_label: string;
  rating: string | number;
  author: string;
  agent_api_url: string;
  approved_at: string | Date;
};

function rowToStored(r: NeonListingRow): ApprovedListingStored {
  const approvedAt =
    typeof r.approved_at === "string"
      ? r.approved_at
      : new Date(r.approved_at).toISOString();
  const rating = typeof r.rating === "number" ? r.rating : Number.parseFloat(String(r.rating));
  return {
    applicationId: r.application_id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    category: r.category,
    installsLabel: r.installs_label,
    rating: Number.isFinite(rating) ? rating : 5,
    author: r.author,
    agentApiUrl: r.agent_api_url,
    approvedAt,
  };
}

export async function readApprovedListingsFromNeon(): Promise<ApprovedListingStored[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT application_id, slug, name, tagline, category, installs_label, rating, author, agent_api_url, approved_at
    FROM agent_store_listings
    ORDER BY approved_at DESC
  `) as NeonListingRow[];
  return rows.map(rowToStored);
}

export async function findApprovedListingBySlugInNeon(slug: string): Promise<ApprovedListingStored | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT application_id, slug, name, tagline, category, installs_label, rating, author, agent_api_url, approved_at
    FROM agent_store_listings
    WHERE slug = ${slug}
    LIMIT 1
  `) as NeonListingRow[];
  return rows[0] ? rowToStored(rows[0]) : null;
}

export async function insertApprovedListingInNeon(entry: ApprovedListingStored): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO agent_store_listings (
      application_id,
      slug,
      name,
      tagline,
      category,
      installs_label,
      rating,
      author,
      agent_api_url,
      approved_at
    )
    VALUES (
      ${entry.applicationId},
      ${entry.slug},
      ${entry.name},
      ${entry.tagline},
      ${entry.category},
      ${entry.installsLabel},
      ${entry.rating},
      ${entry.author},
      ${entry.agentApiUrl},
      ${entry.approvedAt}
    )
  `;
}
