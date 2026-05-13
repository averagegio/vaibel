import { AGENTS, type AgentListing } from "@/lib/agents";

export function featuredAgents(count = 3): AgentListing[] {
  return [...AGENTS]
    .sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name))
    .slice(0, count);
}
