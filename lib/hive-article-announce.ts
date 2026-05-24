import {
  postArticleAnnouncement,
  xAutoPostEnabled,
  type PostTweetResult,
  type XMediaAttachment,
} from "@/lib/x-server";

export type HiveArticleAnnounceResult = {
  x: PostTweetResult | null;
};

export async function announceHiveArticle(params: {
  title: string;
  excerpt: string;
  articleUrl: string;
  postToX?: boolean;
  xMedia?: XMediaAttachment;
}): Promise<HiveArticleAnnounceResult> {
  const wantX = params.postToX !== false && xAutoPostEnabled();
  if (!wantX) {
    return { x: null };
  }

  const x = await postArticleAnnouncement({
    title: params.title,
    excerpt: params.excerpt,
    articleUrl: params.articleUrl,
    media: params.xMedia,
  });

  if (!x.ok) {
    console.error("[vaibel] X announce failed:", x.error);
  }

  return { x };
}
