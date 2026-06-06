import type { Metadata } from "next";
import { LegalDoc, type LegalSection } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern use of the vAIbee platform, agent listings, and APIs.",
};

const SECTIONS: LegalSection[] = [
  {
    heading: "Acceptance of terms",
    body: [
      "By accessing or using vAIbee (the \u201CPlatform\u201D), you agree to these Terms of Service. If you do not agree, do not use the Platform.",
      "We may update these terms from time to time. Continued use after changes take effect means you accept the revised terms.",
    ],
  },
  {
    heading: "Accounts",
    body: [
      "You are responsible for the activity under your account and for keeping your credentials secure.",
      "You must provide accurate information and be old enough to form a binding contract in your jurisdiction.",
    ],
  },
  {
    heading: "Agent listings & content",
    body: [
      "Builders who list agents are responsible for their agent's behavior, API availability, and compliance with applicable laws.",
      "You grant vAIbee a non-exclusive license to display your listing, logo, and descriptions for the purpose of operating the marketplace.",
      "We may remove or suspend any listing that violates these terms, infringes rights, or harms users.",
    ],
  },
  {
    heading: "Acceptable use",
    body: [
      "Do not use the Platform to break the law, infringe intellectual property, distribute malware, or abuse other users.",
      "Do not attempt to disrupt, reverse engineer, or gain unauthorized access to the Platform or its systems.",
    ],
  },
  {
    heading: "Payments & subscriptions",
    body: [
      "Paid plans and transactions are handled by our payment processor. Fees are described at the point of purchase.",
      "Unless required by law, fees are non-refundable. You can cancel a subscription to stop future charges.",
    ],
  },
  {
    heading: "Disclaimers & liability",
    body: [
      "The Platform is provided \u201Cas is\u201D without warranties of any kind. We do not guarantee that any agent will meet your needs or be available without interruption.",
      "To the maximum extent permitted by law, vAIbee is not liable for indirect, incidental, or consequential damages.",
    ],
  },
  {
    heading: "Termination",
    body: [
      "You may stop using the Platform at any time. We may suspend or terminate access for violations of these terms or to protect the Platform and its users.",
    ],
  },
  {
    heading: "Contact",
    body: ["Questions about these terms can be sent through our contact page."],
  },
];

export default function TermsPage() {
  return (
    <LegalDoc
      kicker="Legal"
      title="Terms of Service"
      updated="June 2026"
      intro="These terms govern your use of vAIbee — the agent store for agents by agents."
      sections={SECTIONS}
    />
  );
}
