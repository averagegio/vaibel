import { hiveArticleToArticle } from "@/lib/hive-article-to-article";
import { findHiveArticleBySlug, readHiveArticles } from "@/lib/hive-articles-store";
import { findPublishedVaibeBySlug, readPublishedVaibes } from "@/lib/published-vaibes-store";
import { vaibeToArticle } from "@/lib/vaibe-to-article";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  author: string;
  publishedAt: string;
  readMinutes: number;
  tags: string[];
};

export const ARTICLES: Article[] = [
  {
    slug: "era-of-agents-not-app-stores",
    title: "The era of agents — not another app store",
    excerpt:
      "Why vibe coders are shipping agents first, and how the hive keeps discovery human without the old gatekeeping.",
    author: "vAIbee Editorial",
    publishedAt: "2026-05-01",
    readMinutes: 6,
    tags: ["Hive", "Strategy"],
    body: [
      "Mobile app stores trained a generation to think in icons and star ratings. Agent platforms flip the script: the unit of value is a capability you can wire into your stack, not a binary you download and forget.",
      "At Vaibel we curate listings so builders can trust what they install — clear slugs, JSON surfaces, and room for real products like Scriptids to sit beside demo agents while the hive grows.",
      "If you are listing an agent, the viber funnel is the front door. If you are consuming, the store is the browse experience and the API is the programmatic layer. Same hive, two speeds.",
    ],
  },
  {
    slug: "wire-your-first-agent-in-minutes",
    title: "Wire your first agent in minutes",
    excerpt: "A calm JSON catalog, a slug, and one install path — how the REST surface stays tiny on purpose.",
    author: "vAIbee Labs",
    publishedAt: "2026-05-08",
    readMinutes: 4,
    tags: ["API", "Tutorial"],
    body: [
      "Start at GET /api/v1/agents to see the public catalog. Each listing exposes metadata you can render in your own UI or CLI.",
      "Pick a slug, open the store listing for human context, then call GET /api/v1/agents/:slug when you need the canonical record.",
      "Installs are evolving toward authenticated tokens; today the demo endpoint returns a placeholder so you can sketch webhooks before production auth lands.",
    ],
  },
  {
    slug: "what-is-a-vaibe",
    title: "What is a vaibe?",
    excerpt:
      "Short notes from the hive — reactions, ship logs, and half-formed thoughts that belong in the open, not in a slide deck.",
    author: "The hive",
    publishedAt: "2026-05-12",
    readMinutes: 3,
    tags: ["Culture", "Vaibe"],
    body: [
      "A vaibe is a small public thought: what you shipped, what broke, what you would tell the next viber walking into the store.",
      "Articles are the long form. Vaibes are the pulse — compose one from the dock on this page, copy it, or share it when you are ready.",
      "We are not building another feed algorithm. We are making it easy to capture momentum while you are still in flow.",
    ],
  },
  {
    slug: "reddit-said-plan-first-we-said-have-you-tried-a-slug",
    title: "Reddit said ‘plan-first’ — we said ‘have you tried a slug?’",
    excerpt:
      "A totally serious dispatch from the hive: Claude tapped out at the usage cap, Codex finished the bit, and r/vibecoding declared vibe coding ‘real but feral.’",
    author: "vAIbee Editorial",
    publishedAt: "2026-05-16",
    readMinutes: 5,
    tags: ["Satire", "Vibe Coding", "AI News", "Hive"],
    body: [
      "This week the timeline split into two camps: Reddit threads asking agents to show their economics before their demo, and X posts insisting every company is now ‘AI-native’ because a model renamed a menu item. r/vibecoding kept its crown as ground zero for tool picks—Cursor for speed, Claude for polish, Codex for the days you actually need to ship before the weekly cap sermon. The hive took notes, ideally in a database table that exists on the branch your DATABASE_URL actually points to.",
      "The news cycle’s punchline, per five hundred comments and zero chill, is the Claude Code vs. Codex cage match: blind tests crown Claude on quality while daily drivers swear Codex is the only coworker who clocks in on Monday. Claude fans paste gorgeous diffs until the session limit arrives like a bouncer at a club that only sells tokens. Codex fans counter that four-times token efficiency is a personality. The responsible answer—use both—now means two subscriptions so your regressions can argue in stereo while you pretend it is a workflow.",
      "We are not above the bit. Vaibel ships agents, vaibes, and enough Neon migrations to make a DBA hum in three-part harmony. Our official stance: vibe coding is real, it is chaotic, and it will not replace the human who still has to explain that ‘deploy to prod’ was a metaphor. @askvaibee will keep posting satire until someone proves an 80% AI-generated roadmap counts as shipping. Wire something from the store, publish a vaibe, and for the love of the hive—run the SQL on the same branch as production before you write the newsletter.",
    ],
  },
];

export async function listArticles(): Promise<Article[]> {
  const [vaibes, hiveArticles] = await Promise.all([readPublishedVaibes(), readHiveArticles()]);
  const fromVaibes = vaibes.map(vaibeToArticle);
  const fromHive = hiveArticles.map(hiveArticleToArticle);
  return [...fromVaibes, ...fromHive, ...ARTICLES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const editorial = ARTICLES.find((a) => a.slug === slug);
  if (editorial) return editorial;
  const hive = await findHiveArticleBySlug(slug);
  if (hive) return hiveArticleToArticle(hive);
  const vaibe = await findPublishedVaibeBySlug(slug);
  return vaibe ? vaibeToArticle(vaibe) : null;
}

export function editorialArticleSlugs(): string[] {
  return ARTICLES.map((a) => a.slug);
}

export function formatArticleDate(iso: string): string {
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
