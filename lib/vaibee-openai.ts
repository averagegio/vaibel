import OpenAI from "openai";
import { canVaibeeChatPublishArticles } from "@/lib/vaibee-chat-publish";
import { executeVaibeeTool, vaibeeToolsEnabled } from "@/lib/vaibee-tools";
import { isTavilyConfigured } from "@/lib/tavily-server";

const BASE_SYSTEM = `You are Vaibee, the concise assistant for vAIbee — an AI agent app store for builders and teams.
Help with agents, the REST API, pricing, Stripe checkout, the dashboard, and navigating the site.
Keep replies clear and scannable (short paragraphs or bullets when helpful). If you are unsure, say so and suggest where to look on the site (e.g. /store, /pricing, /api-docs, /dashboard).`;

function buildSystemPrompt(requesterEmail?: string | null): string {
  const { search, publish } = vaibeeToolsEnabled(requesterEmail);
  const parts = [BASE_SYSTEM];

  if (search || publish) {
    parts.push("\n\nYou have tools for editorial workflows:");
  }
  if (search) {
    parts.push(
      "\n- search_web: find recent AI, vibe coding, Reddit, or X discourse before writing timely pieces.",
    );
  }
  if (publish) {
    parts.push(
      "\n- publish_hive_article: publish a long-form article to the public hive journal (/articles). Use when the user asks you to write and publish an article. Provide title, excerpt, body_paragraphs (array of 3+ paragraphs, each at least 40 characters), and tags (array of strings). Satire and humor are fine when requested. Author defaults to vAIbee Editorial unless specified.",
    );
    parts.push(
      "\nPublishing runs server-side — never ask the user for an admin secret. After publish_hive_article succeeds, share the exact url from the tool result.",
    );
  } else if (isTavilyConfigured()) {
    parts.push(
      "\nArticle publishing via chat is disabled on this server. You may still search the web, but tell the user to use /admin/articles to publish.",
    );
  }

  if (!search && publish) {
    parts.push("\nWeb search is unavailable — rely on the user's brief and your general knowledge.");
  }

  return parts.join("");
}

export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function openaiChatModel(): string {
  return (
    process.env.OPENAI_MODEL?.trim() ||
    process.env.OPENAI_DEFAULT_MODEL?.trim() ||
    "gpt-4o-mini"
  );
}

export type VaibeeChatTurn = { role: "user" | "assistant"; content: string };

export type VaibeeChatResult = {
  reply: string;
  articleUrl?: string;
  toolsUsed: string[];
};

function openAiTools(requesterEmail?: string | null): OpenAI.Chat.ChatCompletionTool[] {
  const tools: OpenAI.Chat.ChatCompletionTool[] = [];

  if (isTavilyConfigured()) {
    tools.push({
      type: "function",
      function: {
        name: "search_web",
        description:
          "Search the web for recent news and discussion (AI, vibe coding, agents, Reddit, X). Use before writing timely articles.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
            max_results: { type: "number", description: "Max results 1-10, default 6" },
          },
          required: ["query"],
          additionalProperties: false,
        },
      },
    });
  }

  if (canVaibeeChatPublishArticles(requesterEmail)) {
    tools.push({
      type: "function",
      function: {
        name: "publish_hive_article",
        description:
          "Publish a long-form hive journal article to the live site. Requires 3+ substantial paragraphs.",
        parameters: {
          type: "object",
          properties: {
            title: { type: "string" },
            excerpt: { type: "string", description: "Card summary, max ~320 chars" },
            body_paragraphs: {
              type: "array",
              items: { type: "string" },
              description: "Each paragraph 40+ characters",
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "e.g. Satire, Vibe Coding, Hive",
            },
            author: { type: "string" },
            slug: { type: "string", description: "Optional URL slug" },
          },
          required: ["title", "excerpt", "body_paragraphs"],
          additionalProperties: false,
        },
      },
    });
  }

  return tools;
}

const MAX_TOOL_ROUNDS = 8;

/**
 * OpenAI chat with optional tool loop (search + server-side article publish).
 */
export async function runVaibeeOpenAIChatWithTools(
  userMessage: string,
  prior: VaibeeChatTurn[],
  appOrigin: string,
  requesterEmail?: string | null,
): Promise<VaibeeChatResult> {
  const openai = new OpenAI();
  const model = openaiChatModel();
  const tools = openAiTools(requesterEmail);

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: buildSystemPrompt(requesterEmail) },
    ...prior.slice(-20).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  const toolsUsed: string[] = [];
  let articleUrl: string | undefined;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      max_tokens: 2000,
      temperature: 0.65,
      tools: tools.length > 0 ? tools : undefined,
      tool_choice: tools.length > 0 ? "auto" : undefined,
    });

    const choice = completion.choices[0]?.message;
    if (!choice) {
      throw new Error("The model returned an empty reply.");
    }

    const toolCalls = choice.tool_calls;
    if (!toolCalls?.length) {
      const text = choice.content?.trim();
      if (!text) {
        throw new Error("The model returned an empty reply.");
      }
      return { reply: text, articleUrl, toolsUsed };
    }

    messages.push({
      role: "assistant",
      content: choice.content ?? null,
      tool_calls: toolCalls,
    });

    for (const call of toolCalls) {
      if (call.type !== "function") continue;
      const fn = call.function;
      const name = fn.name;
      toolsUsed.push(name);

      let parsedArgs: unknown = {};
      try {
        parsedArgs = fn.arguments ? JSON.parse(fn.arguments) : {};
      } catch {
        parsedArgs = {};
      }

      const { result, articlePath } = await executeVaibeeTool(name, parsedArgs, appOrigin, requesterEmail);
      if (articlePath) {
        articleUrl = `${appOrigin.replace(/\/$/, "")}${articlePath}`;
      }

      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: result,
      });
    }
  }

  throw new Error("Too many tool steps — try a simpler request.");
}

/** Simple chat without tools (fallback / tests). */
export async function runVaibeeOpenAIChat(
  userMessage: string,
  prior: VaibeeChatTurn[],
): Promise<string> {
  const openai = new OpenAI();
  const model = openaiChatModel();
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: BASE_SYSTEM },
    ...prior.slice(-24).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  const completion = await openai.chat.completions.create({
    model,
    messages,
    max_tokens: 1200,
    temperature: 0.65,
  });

  const text = completion.choices[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("The model returned an empty reply.");
  }
  return text;
}
