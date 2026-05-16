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
