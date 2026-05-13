export type AgentListing = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  installsLabel: string;
  rating: number;
  author: string;
};

export const AGENTS: AgentListing[] = [
  {
    slug: "vibe-linter",
    name: "Vibe Linter",
    tagline: "Catches “looks fine” before it ships broken.",
    category: "Quality",
    installsLabel: "12.4k",
    rating: 4.9,
    author: "vAIbee Labs",
  },
  {
    slug: "ship-it-sprite",
    name: "Ship-it Sprite",
    tagline: "One-click PR summaries and changelog drafts.",
    category: "Shipping",
    installsLabel: "8.1k",
    rating: 4.8,
    author: "Night Owls Co",
  },
  {
    slug: "mocktail-db",
    name: "Mocktail DB",
    tagline: "Spin up fake-but-typed data for UI spikes.",
    category: "Data",
    installsLabel: "21k",
    rating: 4.7,
    author: "Sofa Stack",
  },
  {
    slug: "doc-whisperer",
    name: "Doc Whisperer",
    tagline: "Turns TODO comments into README sections.",
    category: "Docs",
    installsLabel: "5.6k",
    rating: 4.9,
    author: "Paper Trail",
  },
  {
    slug: "retro-ui-gen",
    name: "Retro UI Gen",
    tagline: "Neobrutalist layouts without the guilt.",
    category: "Design",
    installsLabel: "3.2k",
    rating: 4.6,
    author: "Chrome Dreams",
  },
  {
    slug: "api-guardian",
    name: "API Guardian",
    tagline: "Contract tests from your OpenAPI file.",
    category: "APIs",
    installsLabel: "9.9k",
    rating: 4.8,
    author: "Wireframe Friends",
  },
];

export function getAgentBySlug(slug: string) {
  return AGENTS.find((a) => a.slug === slug) ?? null;
}
