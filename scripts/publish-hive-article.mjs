#!/usr/bin/env node
/**
 * Publish a long-form article via POST /api/admin/articles
 *
 * Usage:
 *   VAIBEE_ADMIN_SECRET=... NEXT_PUBLIC_APP_URL=https://vaibel.vercel.app node scripts/publish-hive-article.mjs
 *
 * Or pass JSON file:
 *   node scripts/publish-hive-article.mjs --file ./article.json
 */

const base = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
const secret = process.env.VAIBEE_ADMIN_SECRET?.trim();

const defaultArticle = {
  title: "Reddit said ‘plan-first’ — we said ‘have you tried a slug?’",
  excerpt:
    "A totally serious dispatch from the hive: Claude tapped out at the usage cap, Codex finished the bit, and r/vibecoding declared vibe coding ‘real but feral.’",
  author: "vAIbee Editorial",
  tags: "Satire, Vibe Coding, AI News, Hive",
  slug: "reddit-said-plan-first-we-said-have-you-tried-a-slug",
  bodyText: `This week the timeline split into two camps: Reddit threads asking agents to show their economics before their demo, and X posts insisting every company is now ‘AI-native’ because a model renamed a menu item. r/vibecoding kept its crown as ground zero for tool picks—Cursor for speed, Claude for polish, Codex for the days you actually need to ship before the weekly cap sermon. The hive took notes, ideally in a database table that exists on the branch your DATABASE_URL actually points to.

The news cycle’s punchline, per five hundred comments and zero chill, is the Claude Code vs. Codex cage match: blind tests crown Claude on quality while daily drivers swear Codex is the only coworker who clocks in on Monday. Claude fans paste gorgeous diffs until the session limit arrives like a bouncer at a club that only sells tokens. Codex fans counter that four-times token efficiency is a personality. The responsible answer—use both—now means two subscriptions so your regressions can argue in stereo while you pretend it is a workflow.

We are not above the bit. Vaibel ships agents, vaibes, and enough Neon migrations to make a DBA hum in three-part harmony. Our official stance: vibe coding is real, it is chaotic, and it will not replace the human who still has to explain that ‘deploy to prod’ was a metaphor. @askvaibee will keep posting satire until someone proves an 80% AI-generated roadmap counts as shipping. Wire something from the store, publish a vaibe, and for the love of the hive—run the SQL on the same branch as production before you write the newsletter.`,
};

async function loadPayload() {
  const fileIdx = process.argv.indexOf("--file");
  if (fileIdx >= 0) {
    const path = process.argv[fileIdx + 1];
    const { readFile } = await import("fs/promises");
    return JSON.parse(await readFile(path, "utf8"));
  }
  return defaultArticle;
}

async function main() {
  if (!secret) {
    console.error("Set VAIBEE_ADMIN_SECRET");
    process.exit(1);
  }
  const payload = await loadPayload();
  const res = await fetch(`${base}/api/admin/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-vaibee-admin-secret": secret,
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("Non-JSON response:", res.status, text.slice(0, 500));
    process.exit(1);
  }
  if (!res.ok || !data.ok) {
    console.error("Publish failed:", data.error || res.status);
    process.exit(1);
  }
  const url = `${base}${data.url || `/articles/${data.slug}`}`;
  console.log("Published:", url);
  console.log("\nX compose (log in as @askvaibee):");
  const tweet =
    "New hive satire: Reddit wants plan-first agents, Claude hit the usage cap, Codex finished the joke. r/vibecoding remains feral. 🐝";
  console.log(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(url)}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
