import { TwitterApi } from "twitter-api-v2";

const MAX_TWEET = 280;
const URL_LEN = 23;

export function isXPostConfigured(): boolean {
  if (oauth1Credentials()) return true;
  return Boolean(oauth2UserToken());
}

function oauth1Credentials(): {
  appKey: string;
  appSecret: string;
  accessToken: string;
  accessSecret: string;
} | null {
  const appKey = process.env.X_API_KEY?.trim() || process.env.TWITTER_API_KEY?.trim();
  const appSecret = process.env.X_API_SECRET?.trim() || process.env.TWITTER_API_SECRET?.trim();
  const accessToken = process.env.X_ACCESS_TOKEN?.trim() || process.env.TWITTER_ACCESS_TOKEN?.trim();
  const accessSecret =
    process.env.X_ACCESS_TOKEN_SECRET?.trim() || process.env.TWITTER_ACCESS_TOKEN_SECRET?.trim();
  if (!appKey || !appSecret || !accessToken || !accessSecret) return null;
  return { appKey, appSecret, accessToken, accessSecret };
}

/** OAuth 2.0 user access token with tweet.write (alternative to OAuth 1.0a four-pack). */
function oauth2UserToken(): string | null {
  const t = process.env.X_USER_ACCESS_TOKEN?.trim();
  if (t) return t;
  const legacy = process.env.X_ACCESS_TOKEN?.trim();
  const hasOAuth1Secret =
    process.env.X_ACCESS_TOKEN_SECRET?.trim() || process.env.TWITTER_ACCESS_TOKEN_SECRET?.trim();
  if (legacy && !hasOAuth1Secret) return legacy;
  return null;
}

export function xAutoPostEnabled(): boolean {
  if (!isXPostConfigured()) return false;
  const flag = process.env.X_AUTO_POST_ARTICLES?.trim().toLowerCase();
  if (flag === "false" || flag === "0" || flag === "no") return false;
  return true;
}

function xClient(): TwitterApi {
  const oauth1 = oauth1Credentials();
  if (oauth1) {
    return new TwitterApi({
      appKey: oauth1.appKey,
      appSecret: oauth1.appSecret,
      accessToken: oauth1.accessToken,
      accessSecret: oauth1.accessSecret,
    });
  }
  const token = oauth2UserToken();
  if (token) {
    return new TwitterApi(token);
  }
  throw new Error("X API credentials are not configured.");
}

export function buildArticleTweetText(title: string, excerpt: string, articleUrl: string): string {
  const url = articleUrl.trim();
  const headline = title.trim();
  const summary = excerpt.trim().replace(/\s+/g, " ");

  const templates = [
    () => {
      const lead = `🐝 New on the hive: ${headline}`;
      const room = MAX_TWEET - URL_LEN - 2;
      if (lead.length + 2 + summary.length <= room) {
        return `${lead}\n\n${summary}\n\n${url}`;
      }
      const short = summary.slice(0, Math.max(0, room - lead.length - 5)) + "…";
      return `${lead}\n\n${short}\n\n${url}`;
    },
    () => {
      const base = `${headline} — ${summary}`;
      const max = MAX_TWEET - URL_LEN - 2;
      const t = base.length <= max ? base : `${base.slice(0, max - 1)}…`;
      return `${t}\n\n${url}`;
    },
  ];

  for (const fn of templates) {
    const text = fn();
    if (text.length <= MAX_TWEET) return text;
  }

  return `${headline.slice(0, MAX_TWEET - URL_LEN - 4)}…\n\n${url}`;
}

export type PostTweetResult =
  | { ok: true; tweetId: string; tweetUrl: string; text: string }
  | { ok: false; error: string };

export async function postTweet(text: string): Promise<PostTweetResult> {
  const body = text.trim();
  if (!body) {
    return { ok: false, error: "Tweet text is empty." };
  }
  if (body.length > MAX_TWEET) {
    return { ok: false, error: `Tweet exceeds ${MAX_TWEET} characters.` };
  }

  try {
    const client = xClient();
    const { data } = await client.v2.tweet(body);
    const tweetId = data.id;
    if (!tweetId) {
      return { ok: false, error: "X API did not return a tweet id." };
    }
    const me = await client.v2.me();
    const username = me.data.username ?? "askvaibee";
    return {
      ok: true,
      tweetId,
      tweetUrl: `https://x.com/${username}/status/${tweetId}`,
      text: body,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "X post failed";
    console.error("[vaibel] postTweet:", e);
    return { ok: false, error: msg };
  }
}

export async function postArticleAnnouncement(params: {
  title: string;
  excerpt: string;
  articleUrl: string;
}): Promise<PostTweetResult> {
  const text = buildArticleTweetText(params.title, params.excerpt, params.articleUrl);
  return postTweet(text);
}
