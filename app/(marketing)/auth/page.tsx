import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthScreen } from "@/components/auth/AuthScreen";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in or create a vAIbee viber account.",
};

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-vaibee-muted">Loading…</div>
      }
    >
      <AuthScreen />
    </Suspense>
  );
}
