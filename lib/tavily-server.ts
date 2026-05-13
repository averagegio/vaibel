import { tavily, type TavilyClient } from "@tavily/core";

let client: TavilyClient | null = null;

export function isTavilyConfigured(): boolean {
  return Boolean(process.env.TAVILY_API_KEY?.trim());
}

export function getTavily(): TavilyClient {
  const key = process.env.TAVILY_API_KEY?.trim();
  if (!key) {
    throw new Error("TAVILY_API_KEY is not set");
  }
  if (!client) {
    client = tavily({ apiKey: key, clientName: "vaibel" });
  }
  return client;
}
