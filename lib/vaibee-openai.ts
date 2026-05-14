import OpenAI from "openai";

const VAIBEE_SYSTEM = `You are Vaibee, the concise assistant for vAIbee — an AI agent app store for builders and teams.
Help with agents, the REST API, pricing, Stripe checkout, the dashboard, and navigating the site.
Keep replies clear and scannable (short paragraphs or bullets when helpful). If you are unsure, say so and suggest where to look on the site (e.g. /store, /pricing, /api-docs, /dashboard).`;

export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

/** Model id: OPENAI_MODEL, else OPENAI_DEFAULT_MODEL, else a small general model. */
export function openaiChatModel(): string {
  return (
    process.env.OPENAI_MODEL?.trim() ||
    process.env.OPENAI_DEFAULT_MODEL?.trim() ||
    "gpt-4o-mini"
  );
}

/**
 * Uses the official OpenAI client; picks up OPENAI_API_KEY, OPENAI_ORG_ID, OPENAI_PROJECT_ID,
 * OPENAI_BASE_URL, and OPENAI_WEBHOOK_SECRET from the environment when set (see OpenAI Node SDK).
 */
export async function runVaibeeOpenAIChat(
  userMessage: string,
  prior: { role: "user" | "assistant"; content: string }[],
): Promise<string> {
  const openai = new OpenAI();
  const model = openaiChatModel();
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: VAIBEE_SYSTEM },
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
