import { findApprovedListingBySlug, readApprovedListings, type ApprovedListingStored } from "@/lib/approved-listings-store";

export type AgentListing = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  installsLabel: string;
  rating: number;
  author: string;
  /** Set when the row came from an approved viber application */
  source?: "seed" | "approved";
  /** Builder HTTP surface for programmatic installs / webhooks */
  agentApiUrl?: string;
  applicationId?: string;
  /** Product website — App Store–style “developer site” */
  websiteUrl?: string;
  /** Detail page body (falls back to tagline if omitted) */
  longDescription?: string;
  /** Feature bullets on listing detail */
  highlights?: string[];
};

/** Curated seed catalog — shipped in repo; merged with approved listings at runtime */
export const SEED_AGENTS: AgentListing[] = [
  {
    slug: "scriptids",
    name: "Scriptids",
    tagline: "Medication access & intelligence — prescriptions explained without the runaround.",
    category: "Health",
    installsLabel: "Live",
    rating: 4.8,
    author: "Scriptids",
    source: "seed",
    websiteUrl: "https://www.scriptids.com/",
    agentApiUrl: "https://www.scriptids.com/",
    longDescription:
      "Scriptids helps people navigate prescriptions and insurance mechanics in plain language. Ask Scripti for educational context about symptoms and meds (never a substitute for your clinician). Explore prior-authorization signals and drug-intelligence summaries so pharmacy and payer workflows feel less opaque—for consumers and clinic teams.",
    highlights: [
      "Scripti — conversational education about symptoms and prescriptions",
      "Prior authorization prediction — reduce surprises at pickup",
      "Drug intelligence — summarized reporting context for care-team conversations",
      "Separate SaaS paths for clinics and consumer upgrades (Scripti Plus)",
    ],
  },
  {
    slug: "vibe-linter",
    name: "Vibe Linter",
    tagline: "Catches “looks fine” before it ships broken.",
    category: "Quality",
    installsLabel: "12.4k",
    rating: 4.9,
    author: "vAIbee Labs",
    source: "seed",
  },
  {
    slug: "ship-it-sprite",
    name: "Ship-it Sprite",
    tagline: "One-click PR summaries and changelog drafts.",
    category: "Shipping",
    installsLabel: "8.1k",
    rating: 4.8,
    author: "Night Owls Co",
    source: "seed",
  },
  {
    slug: "mocktail-db",
    name: "Mocktail DB",
    tagline: "Spin up fake-but-typed data for UI spikes.",
    category: "Data",
    installsLabel: "21k",
    rating: 4.7,
    author: "Sofa Stack",
    source: "seed",
  },
  {
    slug: "doc-whisperer",
    name: "Doc Whisperer",
    tagline: "Turns TODO comments into README sections.",
    category: "Docs",
    installsLabel: "5.6k",
    rating: 4.9,
    author: "Paper Trail",
    source: "seed",
  },
  {
    slug: "retro-ui-gen",
    name: "Retro UI Gen",
    tagline: "Neobrutalist layouts without the guilt.",
    category: "Design",
    installsLabel: "3.2k",
    rating: 4.6,
    author: "Chrome Dreams",
    source: "seed",
  },
  {
    slug: "api-guardian",
    name: "API Guardian",
    tagline: "Contract tests from your OpenAPI file.",
    category: "APIs",
    installsLabel: "9.9k",
    rating: 4.8,
    author: "Wireframe Friends",
    source: "seed",
  },
];

function approvedToPublic(row: ApprovedListingStored): AgentListing {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    category: row.category,
    installsLabel: row.installsLabel,
    rating: row.rating,
    author: row.author,
    source: "approved",
    agentApiUrl: row.agentApiUrl,
    applicationId: row.applicationId,
  };
}

/** Approved community listings first (newest first), then curated seeds not overridden by slug */
export async function listPublishedAgents(): Promise<AgentListing[]> {
  const approvedRows = await readApprovedListings();
  const sorted = [...approvedRows].sort((a, b) => b.approvedAt.localeCompare(a.approvedAt));
  const approvedPublic = sorted.map(approvedToPublic);
  const taken = new Set(approvedPublic.map((a) => a.slug));
  const seedRest = SEED_AGENTS.filter((s) => !taken.has(s.slug));
  return [...approvedPublic, ...seedRest];
}

export async function getPublishedAgentBySlug(slug: string): Promise<AgentListing | null> {
  const hit = await findApprovedListingBySlug(slug);
  if (hit) return approvedToPublic(hit);
  return SEED_AGENTS.find((a) => a.slug === slug) ?? null;
}
