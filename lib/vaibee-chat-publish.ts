import { serverAdminSecret } from "@/lib/article-publish-auth";
import { normalizeBillingEmail } from "@/lib/billing-store";

function publishFlagEnabled(): boolean {
  const flag = process.env.VAIBEE_CHAT_PUBLISH_ARTICLES?.trim().toLowerCase();
  return flag === "true" || flag === "1" || flag === "yes";
}

function allowedAdminEmails(): Set<string> {
  const raw = process.env.VAIBEE_CHAT_ADMIN_EMAILS?.trim();
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((e) => normalizeBillingEmail(e))
      .filter(Boolean),
  );
}

/** Server-side article publish from Vaibee chat (no client admin secret). */
export function canVaibeeChatPublishArticles(requesterEmail?: string | null): boolean {
  if (!publishFlagEnabled() || !serverAdminSecret()) return false;

  const allow = allowedAdminEmails();
  if (allow.size === 0) return false;

  const email = requesterEmail ? normalizeBillingEmail(requesterEmail) : "";
  return Boolean(email && allow.has(email));
}

export function vaibeeChatPublishDisabledReason(): string {
  if (!serverAdminSecret()) {
    return "VAIBEE_ADMIN_SECRET is not set on the server.";
  }
  if (!publishFlagEnabled()) {
    return "Set VAIBEE_CHAT_PUBLISH_ARTICLES=true on the server.";
  }
  return "Set VAIBEE_CHAT_ADMIN_EMAILS to your signed-in email(s), then sign in before publishing from chat.";
}
