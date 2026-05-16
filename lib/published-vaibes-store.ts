import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import { hasNeonDatabase } from "@/lib/db";
import type { PublishedVaibeStored } from "@/lib/published-vaibe-types";
import {
  findPublishedVaibeBySlugInNeon,
  insertPublishedVaibeInNeon,
  readPublishedVaibesFromNeon,
} from "@/lib/vaibes-neon";

type StoreFile = { vaibes: PublishedVaibeStored[] };

const STORE_PATH = path.join(process.cwd(), ".data", "published-vaibes.json");

function isPgUniqueViolation(err: unknown): boolean {
  const o = err as { code?: string };
  return o?.code === "23505";
}

async function readPublishedVaibesFromFile(): Promise<PublishedVaibeStored[]> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as StoreFile;
    if (!parsed.vaibes || !Array.isArray(parsed.vaibes)) return [];
    return parsed.vaibes;
  } catch {
    return [];
  }
}

async function appendPublishedVaibeToFile(entry: PublishedVaibeStored): Promise<void> {
  const prev = await readPublishedVaibesFromFile();
  if (prev.some((p) => p.slug === entry.slug)) {
    throw new Error("duplicate_slug");
  }
  const vaibes = [entry, ...prev];
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  const tmp = `${STORE_PATH}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify({ vaibes }, null, 2)}\n`, "utf8");
  await rename(tmp, STORE_PATH);
}

export async function readPublishedVaibes(): Promise<PublishedVaibeStored[]> {
  if (hasNeonDatabase()) {
    try {
      return await readPublishedVaibesFromNeon();
    } catch (err) {
      console.error("[vaibel] hive_vaibes read failed — using file store if available. Did you run db/neon/003_hive_vaibes.sql?", err);
      return readPublishedVaibesFromFile();
    }
  }
  return readPublishedVaibesFromFile();
}

export async function findPublishedVaibeBySlug(slug: string): Promise<PublishedVaibeStored | null> {
  if (hasNeonDatabase()) {
    try {
      return await findPublishedVaibeBySlugInNeon(slug);
    } catch (err) {
      console.error("[vaibel] hive_vaibes slug lookup failed.", err);
      const rows = await readPublishedVaibesFromFile();
      return rows.find((v) => v.slug === slug) ?? null;
    }
  }
  const rows = await readPublishedVaibesFromFile();
  return rows.find((v) => v.slug === slug) ?? null;
}

export async function appendPublishedVaibe(entry: PublishedVaibeStored): Promise<void> {
  const prev = await readPublishedVaibes();
  if (prev.some((p) => p.slug === entry.slug)) {
    throw new Error("duplicate_slug");
  }

  if (hasNeonDatabase()) {
    try {
      await insertPublishedVaibeInNeon(entry);
      return;
    } catch (e) {
      if (isPgUniqueViolation(e)) {
        throw new Error("duplicate_slug");
      }
      throw e;
    }
  }

  await appendPublishedVaibeToFile(entry);
}
