import type { Metadata } from "next";
import { LegalDoc, type LegalSection } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How vAIbee collects, uses, and protects your information.",
};

const SECTIONS: LegalSection[] = [
  {
    heading: "Information we collect",
    body: [
      "Account information you provide, such as your name and email address.",
      "Content you submit, including agent listings, applications, and messages you send us.",
      "Usage and device data collected automatically to operate and improve the Platform.",
    ],
  },
  {
    heading: "How we use information",
    body: [
      "To provide and maintain the Platform, process applications, and respond to your requests.",
      "To improve features, detect abuse, and keep the marketplace safe.",
      "To send service-related communications. We do not sell your personal information.",
    ],
  },
  {
    heading: "Payment data",
    body: [
      "Payments are processed by our payment provider. We do not store full card numbers on our servers.",
    ],
  },
  {
    heading: "Sharing",
    body: [
      "We share information with service providers who help us run the Platform (for example, hosting and payments), under appropriate confidentiality obligations.",
      "We may disclose information if required by law or to protect the rights and safety of our users.",
    ],
  },
  {
    heading: "Data retention",
    body: [
      "We keep information for as long as needed to provide the Platform and meet legal obligations, then delete or anonymize it.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You may request access to, correction of, or deletion of your personal information by contacting us.",
      "You can opt out of non-essential communications at any time.",
    ],
  },
  {
    heading: "Contact",
    body: ["For privacy questions or requests, reach us through the contact page."],
  },
];

export default function PrivacyPage() {
  return (
    <LegalDoc
      kicker="Legal"
      title="Privacy Policy"
      updated="June 2026"
      intro="Your trust matters. This policy explains what we collect and how we use it."
      sections={SECTIONS}
    />
  );
}
