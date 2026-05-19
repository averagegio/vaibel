import { postArticleAnnouncement, xAutoPostEnabled, type PostTweetResult } from "@/lib/x-server";

export type HiveArticleAnnounceResult = {
  x: PostTweetResult | null;
};

export async function announceHiveArticle(params: {
  title: string;
  excerpt: string;
  articleUrl: string;
  postToX?: boolean;
}): Promise<HiveArticleAnnounceResult> {
  const wantX = params.postToX !== false && xAutoPostEnabled();
  if (!wantX) {
    return { x: null };
  }

  const x = await postArticleAnnouncement({
    title: params.title,
    excerpt: params.excerpt,
    articleUrl: params.articleUrl,
  });

  if (!x.ok) {
    console.error("[vaibel] X announce failed:", x.error);
  }

  return { x };
}
