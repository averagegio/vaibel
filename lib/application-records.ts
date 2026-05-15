import { readFile } from "fs/promises";
import path from "path";

export type ApplicationRecord = {
  id: string;
  funnelVersion: number;
  status: "pending_review" | string;
  workflowStage: string;
  applicantName: string;
  cofounderEmail: string;
  agentDisplayName: string;
  agentPitch: string;
  agentApiUrl: string;
  monetizationPlan: string;
  logoFile: string | null;
  createdAt: string;
};

const APPLICATIONS_PATH = path.join(process.cwd(), ".data", "applications.jsonl");

export async function readApplications(): Promise<ApplicationRecord[]> {
  try {
    const raw = await readFile(APPLICATIONS_PATH, "utf8");
    const rows: ApplicationRecord[] = [];
    for (const line of raw.split("\n")) {
      if (!line.trim()) continue;
      try {
        rows.push(JSON.parse(line) as ApplicationRecord);
      } catch {
        /* skip bad line */
      }
    }
    return rows;
  } catch {
    return [];
  }
}

export async function findApplicationById(id: string): Promise<ApplicationRecord | null> {
  const rows = await readApplications();
  return rows.find((r) => r.id === id) ?? null;
}
