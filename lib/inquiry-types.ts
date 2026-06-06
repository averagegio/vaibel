export type InquiryKind = "contact" | "career";

export type InquiryRecord = {
  id: string;
  kind: InquiryKind;
  name: string;
  email: string;
  /** Contact topic (general/support/...), null for careers. */
  topic: string | null;
  /** Career area (engineering/design/...), null for contact. */
  role: string | null;
  /** Optional portfolio/links, careers only. */
  links: string | null;
  /** Contact message body or career pitch. */
  message: string;
  createdAt: string;
};
