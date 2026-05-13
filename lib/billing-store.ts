import { mkdir, readFile, rename, writeFile } from "fs/promises";
import { dirname, join } from "path";
import type { SubscriptionTier } from "@/lib/stripe-server";

const TIERS = new Set<SubscriptionTier>(["starter", "team", "scale"]);

export type BillingEntitlement = {
  active: boolean;
  tier: SubscriptionTier | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  updatedAt: string;
};

type StoreFile = { version: 1; byEmail: Record<string, BillingEntitlement> };

const FILE = join(process.cwd(), ".data", "subscriptions.json");

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
    if (parsed?.version === 1 && parsed.byEmail && typeof parsed.byEmail === "object") {
      return parsed;
    }
  } catch {
    /* missing or invalid */
  }
  return { version: 1, byEmail: {} };
}

async function writeStore(store: StoreFile): Promise<void> {
  await mkdir(dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmp, `${JSON.stringify(store, null, 2)}\n`, "utf-8");
  await rename(tmp, FILE);
}

export function parseTier(raw: string | null | undefined): SubscriptionTier | null {
  if (!raw || typeof raw !== "string") return null;
  const t = raw.trim() as SubscriptionTier;
  return TIERS.has(t) ? t : null;
}

export function normalizeBillingEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export async function getEntitlement(email: string): Promise<BillingEntitlement | null> {
  const key = normalizeBillingEmail(email);
  if (!key) return null;
  const store = await readStore();
  return store.byEmail[key] ?? null;
}

export async function savePaidEntitlement(
  email: string,
  data: {
    tier: SubscriptionTier;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    active: boolean;
  },
): Promise<void> {
  const key = normalizeBillingEmail(email);
  if (!key) return;
  await enqueue(async () => {
    const store = await readStore();
    store.byEmail[key] = {
      active: data.active,
      tier: data.tier,
      stripeCustomerId: data.stripeCustomerId,
      stripeSubscriptionId: data.stripeSubscriptionId,
      updatedAt: new Date().toISOString(),
    };
    await writeStore(store);
  });
}

export async function updateBySubscriptionId(
  subscriptionId: string,
  patch: { active: boolean; tier?: SubscriptionTier | null },
): Promise<boolean> {
  return enqueue(async () => {
    const store = await readStore();
    let changed = false;
    for (const [email, row] of Object.entries(store.byEmail)) {
      if (row.stripeSubscriptionId === subscriptionId) {
        const nextTier = patch.tier !== undefined ? patch.tier : row.tier;
        store.byEmail[email] = {
          ...row,
          active: patch.active,
          tier: nextTier,
          updatedAt: new Date().toISOString(),
        };
        changed = true;
        break;
      }
    }
    if (changed) await writeStore(store);
    return changed;
  });
}
