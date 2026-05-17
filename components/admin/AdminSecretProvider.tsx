"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "vaibee-admin-secret-v1";

type AdminSecretContextValue = {
  secret: string;
  setSecret: (value: string) => void;
  adminHeaders: () => Record<string, string>;
};

export const AdminSecretContext = createContext<AdminSecretContextValue | null>(null);

export function AdminSecretProvider({ children }: { children: React.ReactNode }) {
  const [secret, setSecretState] = useState("");

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored) setSecretState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const setSecret = useCallback((value: string) => {
    setSecretState(value);
    try {
      const trimmed = value.trim();
      if (trimmed) window.sessionStorage.setItem(STORAGE_KEY, trimmed);
      else window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const adminHeaders = useCallback((): Record<string, string> => {
    const s = secret.trim();
    if (!s) return {};
    return { "x-vaibee-admin-secret": s };
  }, [secret]);

  const value = useMemo(
    () => ({ secret, setSecret, adminHeaders }),
    [secret, setSecret, adminHeaders],
  );

  return <AdminSecretContext.Provider value={value}>{children}</AdminSecretContext.Provider>;
}

export function useAdminSecretContext(): AdminSecretContextValue {
  const ctx = useContext(AdminSecretContext);
  if (!ctx) {
    throw new Error("useAdminSecretContext must be used within AdminSecretProvider");
  }
  return ctx;
}
