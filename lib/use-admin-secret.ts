"use client";

import { useContext } from "react";
import { AdminSecretContext } from "@/components/admin/AdminSecretProvider";

/** Shared admin secret state (use inside /admin/articles layout). */
export function useAdminSecret() {
  const ctx = useContext(AdminSecretContext);
  if (!ctx) {
    throw new Error("useAdminSecret must be used within AdminSecretProvider (/admin/articles)");
  }
  return ctx;
}
