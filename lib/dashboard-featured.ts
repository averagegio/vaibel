import type { AgentListing } from "@/lib/agents";

/** Pick the first `count` agents from an already-merged catalog (approved-first ordering preserved). */
export function pickFeaturedAgents(agents: AgentListing[], count = 3): AgentListing[] {
  return agents.slice(0, Math.max(0, count));
}
