import { textFromParagraphs } from "@/lib/hive-article-utils";
import { publishHiveArticleServer } from "@/lib/publish-hive-article-server";
import { canVaibeeChatPublishArticles, vaibeeChatPublishDisabledReason } from "@/lib/vaibee-chat-publish";
import { getTavily, isTavilyConfigured } from "@/lib/tavily-server";

export const VAIBEE_TOOL_NAMES = ["search_web", "publish_hive_article"] as const;
export type VaibeeToolName = (typeof VAIBEE_TOOL_NAMES)[number];

export function vaibeeToolsEnabled(requesterEmail?: string | null): { search: boolean; publish: boolean } {
  return {
    search: isTavilyConfigured(),
    publish: canVaibeeChatPublishArticles(requesterEmail),
  };
}

export async function executeVaibeeTool(
  name: string,
  args: unknown,
  appOrigin: string,
  requesterEmail?: string | null,
): Promise<{ result: string; articlePath?: string }> {
  switch (name) {
    case "search_web":
      return { result: await runSearchWeb(args) };
    case "publish_hive_article":
      return runPublishHiveArticle(args, appOrigin, requesterEmail);
    default:
      return { result: JSON.stringify({ ok: false, error: `Unknown tool: ${name}` }) };
  }
}

async function runSearchWeb(args: unknown): Promise<string> {
  if (!isTavilyConfigured()) {
    return JSON.stringify({
      ok: false,
      error: "Web search is not configured (TAVILY_API_KEY missing).",
    });
  }

  const a = args as { query?: string; max_results?: number };
  const query = typeof a.query === "string" ? a.query.trim() : "";
  if (!query) {
    return JSON.stringify({ ok: false, error: "query is required." });
  }

  const maxResults =
    typeof a.max_results === "number" && Number.isFinite(a.max_results)
      ? Math.min(10, Math.max(1, Math.floor(a.max_results)))
      : 6;

  try {
    const tv = getTavily();
    const res = await tv.search(query, {
      maxResults,
      includeAnswer: true,
      searchDepth: "basic",
      topic: "news",
    });

    const snippets = (res.results ?? []).slice(0, maxResults).map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.content?.slice(0, 400),
    }));

    return JSON.stringify({
      ok: true,
      query,
      answer: res.answer ?? null,
      results: snippets,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Search failed";
    return JSON.stringify({ ok: false, error: msg });
  }
}

async function runPublishHiveArticle(
  args: unknown,
  appOrigin: string,
  requesterEmail?: string | null,
): Promise<{ result: string; articlePath?: string }> {
  if (!canVaibeeChatPublishArticles(requesterEmail)) {
    return {
      result: JSON.stringify({
        ok: false,
        error: vaibeeChatPublishDisabledReason(),
      }),
    };
  }

  const a = args as {
    title?: string;
    excerpt?: string;
    body_paragraphs?: unknown;
    tags?: unknown;
    author?: string;
    slug?: string;
    post_to_x?: boolean;
  };

  const paragraphs = Array.isArray(a.body_paragraphs)
    ? a.body_paragraphs.filter((p): p is string => typeof p === "string" && p.trim().length > 0)
    : [];

  const tags = Array.isArray(a.tags)
    ? a.tags.filter((t): t is string => typeof t === "string").join(", ")
    : typeof a.tags === "string"
      ? a.tags
      : "";

  const published = await publishHiveArticleServer({
    title: a.title,
    excerpt: a.excerpt,
    bodyText: textFromParagraphs(paragraphs),
    author: a.author ?? "vAIbee Editorial",
    tags,
    slug: a.slug,
    appOrigin,
    postToX: a.post_to_x !== false,
  });

  if (!published.ok) {
    return { result: JSON.stringify({ ok: false, error: published.error }) };
  }

  const fullUrl = `${appOrigin.replace(/\/$/, "")}${published.path}`;
  return {
    result: JSON.stringify({
      ok: true,
      slug: published.slug,
      path: published.path,
      url: fullUrl,
      xTweetUrl: published.xTweetUrl ?? null,
      xError: published.xError ?? null,
    }),
    articlePath: published.path,
  };
}
