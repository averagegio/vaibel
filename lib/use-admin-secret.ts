"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "vaibee-admin-secret-v1";

export function useAdminSecret() {
  const [secret, setSecret] = useState("");

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored) setSecret(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((value: string) => {
    setSecret(value);
    try {
      if (value.trim()) {
        window.sessionStorage.setItem(STORAGE_KEY, value.trim());
      } else {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const adminHeaders = useCallback((): Record<string, string> => {
    const s = secret.trim();
    if (!s) return {};
    return { "x-vaibee-admin-secret": s };
  }, [secret]);

  return { secret, setSecret: persist, adminHeaders };
}
