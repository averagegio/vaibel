import { mkdir, readFile, rename, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { randomUUID } from "crypto";
import { getSql, hasNeonDatabase } from "@/lib/db";

const FILE = join(process.cwd(), ".data", "tavily-search-log.json");
const MAX_ENTRIES = 200;

export type TavilySearchLogEntry = {
  id: string;
  query: string;
  createdAt: string;
  requestId: string;
  responseTime: number;
  answerPreview?: string;
  topResults: { title: string; url: string }[];
};

type StoreFile = { version: 1; entries: TavilySearchLogEntry[] };

let writeChain: Promise<void> = Promise.resolve();

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readStore(): Promise<StoreFile> {
  try {
    const raw = await readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw) as StoreFile;
    if (parsed?.version === 1 && Array.isArray(parsed.entries)) {
      return parsed;
    }
  } catch {
    /* missing */
  }
  return { version: 1, entries: [] };
}

async function writeStore(store: StoreFile): Promise<void> {
  await mkdir(dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmp, `${JSON.stringify(store, null, 2)}\n`, "utf-8");
  await rename(tmp, FILE);
}

function trimAnswer(answer: string | undefined, max = 600): string | undefined {
  if (!answer) return undefined;
  const t = answer.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

type NeonRow = {
  id: string;
  query: string;
  created_at: string;
  request_id: string;
  response_time: number;
  answer_preview: string | null;
  top_results: string;
};

function rowToEntry(r: NeonRow): TavilySearchLogEntry {
  let topResults: { title: string; url: string }[] = [];
  try {
    const parsed = JSON.parse(r.top_results) as unknown;
    if (Array.isArray(parsed)) {
      topResults = parsed.filter(
        (x): x is { title: string; url: string } =>
          Boolean(x) && typeof x === "object" && "title" in x && "url" in x,
      ) as { title: string; url: string }[];
    }
  } catch {
    topResults = [];
  }
  return {
    id: r.id,
    query: r.query,
    createdAt: new Date(r.created_at).toISOString(),
    requestId: r.request_id,
    responseTime: Number(r.response_time),
    answerPreview: r.answer_preview ?? undefined,
    topResults,
  };
}

async function appendSearchLogNeon(entry: TavilySearchLogEntry): Promise<void> {
  const sql = getSql();
  const topJson = JSON.stringify(entry.topResults);
  await sql`
    INSERT INTO tavily_search_log (id, query, created_at, request_id, response_time, answer_preview, top_results)
    VALUES (
      ${entry.id},
      ${entry.query},
      ${entry.createdAt}::timestamptz,
      ${entry.requestId},
      ${entry.responseTime},
      ${entry.answerPreview ?? null},
      ${topJson}
    )
  `;
  await sql`
    DELETE FROM tavily_search_log
    WHERE id IN (
      SELECT id FROM tavily_search_log
      ORDER BY created_at DESC
      OFFSET ${MAX_ENTRIES}
    )
  `;
}

async function listSearchLogNeon(limit: number): Promise<TavilySearchLogEntry[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, query, created_at, request_id, response_time, answer_preview, top_results
    FROM tavily_search_log
    ORDER BY created_at DESC
    LIMIT ${limit}
  `) as NeonRow[];
  return rows.map(rowToEntry);
}

async function appendSearchLogFile(entry: TavilySearchLogEntry): Promise<void> {
  const store = await readStore();
  store.entries.unshift(entry);
  if (store.entries.length > MAX_ENTRIES) {
    store.entries = store.entries.slice(0, MAX_ENTRIES);
  }
  await writeStore(store);
}

export async function appendSearchLog(params: {
  query: string;
  requestId: string;
  responseTime: number;
  answer?: string;
  results: { title: string; url: string }[];
}): Promise<TavilySearchLogEntry> {
  const entry: TavilySearchLogEntry = {
    id: randomUUID(),
    query: params.query.trim(),
    createdAt: new Date().toISOString(),
    requestId: params.requestId,
    responseTime: params.responseTime,
    answerPreview: trimAnswer(params.answer),
    topResults: params.results.slice(0, 8),
  };

  await enqueue(async () => {
    if (hasNeonDatabase()) {
      await appendSearchLogNeon(entry);
    } else {
      await appendSearchLogFile(entry);
    }
  });

  return entry;
}

export async function listSearchLog(limit = 50): Promise<TavilySearchLogEntry[]> {
  const n = Math.min(Math.max(1, limit), MAX_ENTRIES);
  if (hasNeonDatabase()) {
    return listSearchLogNeon(n);
  }
  const store = await readStore();
  return store.entries.slice(0, n);
}
