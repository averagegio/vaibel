#!/usr/bin/env node
/** Print X (Twitter) compose URL for @askvaibee — open while logged into that account. */

const base = (process.env.NEXT_PUBLIC_APP_URL || "https://vaibel.vercel.app").replace(/\/$/, "");
const slug = process.argv[2] || "reddit-said-plan-first-we-said-have-you-tried-a-slug";
const articleUrl = `${base}/articles/${slug}`;

const tweet =
  process.argv[3] ||
  "New from @askvaibee: Reddit said plan-first, we said have you tried a slug? Satire on Claude caps, Codex loyalty, and r/vibecoding going feral. 🐝";

const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(articleUrl)}`;

console.log("Article:", articleUrl);
console.log("\nTweet text:\n", tweet, "\n\n" + articleUrl);
console.log("\nCompose (log in as @askvaibee first):\n", intent);
