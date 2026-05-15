import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import {
  findApprovedListingBySlugInNeon,
  insertApprovedListingInNeon,
  readApprovedListingsFromNeon,
} from "@/lib/agent-listings-neon";
import type { ApprovedListingStored } from "@/lib/agent-listing-types";
import { hasNeonDatabase } from "@/lib/db";

export type { ApprovedListingStored } from "@/lib/agent-listing-types";

type StoreFile = {
  listings: ApprovedListingStored[];
};

const STORE_PATH = path.join(process.cwd(), ".data", "approved-listings.json");

function isPgUniqueViolation(err: unknown): boolean {
  const o = err as { code?: string };
  return o?.code === "23505";
}

async function readApprovedListingsFromFile(): Promise<ApprovedListingStored[]> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as StoreFile;
    if (!parsed.listings || !Array.isArray(parsed.listings)) return [];
    return parsed.listings;
  } catch {
    return [];
  }
}

async function appendApprovedListingToFile(entry: ApprovedListingStored): Promise<void> {
  const prev = await readApprovedListingsFromFile();
  if (prev.some((p) => p.applicationId === entry.applicationId)) {
    throw new Error("duplicate_application");
  }
  const listings = [...prev, entry];
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  const tmp = `${STORE_PATH}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify({ listings }, null, 2)}\n`, "utf8");
  await rename(tmp, STORE_PATH);
}

export async function readApprovedListings(): Promise<ApprovedListingStored[]> {
  if (hasNeonDatabase()) {
    return readApprovedListingsFromNeon();
  }
  return readApprovedListingsFromFile();
}

export async function findApprovedListingBySlug(slug: string): Promise<ApprovedListingStored | null> {
  if (hasNeonDatabase()) {
    return findApprovedListingBySlugInNeon(slug);
  }
  const rows = await readApprovedListingsFromFile();
  return rows.find((a) => a.slug === slug) ?? null;
}

export async function appendApprovedListing(entry: ApprovedListingStored): Promise<void> {
  const prev = await readApprovedListings();
  if (prev.some((p) => p.applicationId === entry.applicationId)) {
    throw new Error("duplicate_application");
  }

  if (hasNeonDatabase()) {
    try {
      await insertApprovedListingInNeon(entry);
    } catch (e) {
      if (isPgUniqueViolation(e)) {
        throw new Error("duplicate_application");
      }
      throw e;
    }
    return;
  }

  await appendApprovedListingToFile(entry);
}

export function collectTakenSlugs(seedSlugs: string[], approved: ApprovedListingStored[]): Set<string> {
  return new Set([...seedSlugs, ...approved.map((a) => a.slug)]);
}
