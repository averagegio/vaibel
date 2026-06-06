import type { Metadata } from "next";
import { LegalDoc, type LegalSection } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How vAIbee uses cookies and similar technologies.",
};

const SECTIONS: LegalSection[] = [
  {
    heading: "What cookies are",
    body: [
      "Cookies are small text files stored on your device that help websites remember your preferences and how you use them.",
    ],
  },
  {
    heading: "How we use cookies",
    body: [
      "Essential cookies keep you signed in and remember settings like your light/dark theme preference.",
      "Analytics cookies help us understand how the Platform is used so we can improve it.",
    ],
  },
  {
    heading: "Types of cookies",
    body: [
      "Strictly necessary: required for core functionality such as authentication.",
      "Preferences: remember choices like theme and layout.",
      "Analytics: aggregate, de-identified usage measurement.",
    ],
  },
  {
    heading: "Managing cookies",
    body: [
      "You can control or delete cookies through your browser settings. Disabling some cookies may affect how the Platform works.",
    ],
  },
  {
    heading: "Contact",
    body: ["Questions about our cookie use can be sent through the contact page."],
  },
];

export default function CookiesPage() {
  return (
    <LegalDoc
      kicker="Legal"
      title="Cookie Policy"
      updated="June 2026"
      intro="This policy explains how vAIbee uses cookies and similar technologies."
      sections={SECTIONS}
    />
  );
}
