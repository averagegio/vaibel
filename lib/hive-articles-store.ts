import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import { hasNeonDatabase } from "@/lib/db";
import type { HiveArticleStored } from "@/lib/hive-article-types";
import {
  deleteHiveArticleInNeon,
  findHiveArticleBySlugInNeon,
  readHiveArticlesFromNeon,
  upsertHiveArticleInNeon,
} from "@/lib/hive-articles-neon";

type StoreFile = { articles: HiveArticleStored[] };

const STORE_PATH = path.join(process.cwd(), ".data", "hive-articles.json");

function isPgUniqueViolation(err: unknown): boolean {
  const o = err as { code?: string };
  return o?.code === "23505";
}

async function readHiveArticlesFromFile(): Promise<HiveArticleStored[]> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as StoreFile;
    if (!parsed.articles || !Array.isArray(parsed.articles)) return [];
    return parsed.articles;
  } catch {
    return [];
  }
}

async function writeHiveArticlesToFile(articles: HiveArticleStored[]): Promise<void> {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  const tmp = `${STORE_PATH}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify({ articles }, null, 2)}\n`, "utf8");
  await rename(tmp, STORE_PATH);
}

export async function readHiveArticles(): Promise<HiveArticleStored[]> {
  if (hasNeonDatabase()) {
    try {
      return await readHiveArticlesFromNeon();
    } catch (err) {
      console.error("[vaibel] hive_articles read failed — using file store. Run db/neon/004_hive_articles.sql?", err);
      return readHiveArticlesFromFile();
    }
  }
  return readHiveArticlesFromFile();
}

export async function findHiveArticleBySlug(slug: string): Promise<HiveArticleStored | null> {
  if (hasNeonDatabase()) {
    try {
      return await findHiveArticleBySlugInNeon(slug);
    } catch (err) {
      console.error("[vaibel] hive_articles slug lookup failed.", err);
      const rows = await readHiveArticlesFromFile();
      return rows.find((a) => a.slug === slug) ?? null;
    }
  }
  const rows = await readHiveArticlesFromFile();
  return rows.find((a) => a.slug === slug) ?? null;
}

export async function upsertHiveArticle(entry: HiveArticleStored): Promise<void> {
  if (hasNeonDatabase()) {
    try {
      await upsertHiveArticleInNeon(entry);
      return;
    } catch (e) {
      if (isPgUniqueViolation(e)) {
        throw new Error("duplicate_slug");
      }
      throw e;
    }
  }

  const prev = await readHiveArticlesFromFile();
  const idx = prev.findIndex((a) => a.slug === entry.slug);
  const next = [...prev];
  if (idx >= 0) {
    next[idx] = entry;
  } else {
    next.unshift(entry);
  }
  await writeHiveArticlesToFile(next);
}

export async function deleteHiveArticle(slug: string): Promise<boolean> {
  if (hasNeonDatabase()) {
    try {
      const deleted = await deleteHiveArticleInNeon(slug);
      if (deleted) return true;
    } catch (err) {
      console.error("[vaibel] hive_articles delete failed.", err);
    }
  }

  const prev = await readHiveArticlesFromFile();
  const next = prev.filter((a) => a.slug !== slug);
  if (next.length === prev.length) return false;
  await writeHiveArticlesToFile(next);
  return true;
}
