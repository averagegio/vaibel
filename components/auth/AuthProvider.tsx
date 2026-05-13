"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const USERS_KEY = "vaibee_users_v1";
const SESSION_KEY = "vaibee_session_v1";

export type SessionUser = {
  email: string;
  name: string;
  createdAt: string;
  onboardingComplete: boolean;
};

type StoredUser = SessionUser & { password: string };

type AuthContextValue = {
  user: SessionUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
  completeOnboarding: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readUsers(): Record<string, StoredUser> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, StoredUser>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, StoredUser>) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readSessionEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { email?: string };
    return typeof parsed?.email === "string" ? parsed.email : null;
  } catch {
    return null;
  }
}

function writeSessionEmail(email: string | null) {
  if (email) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
  } else {
    window.localStorage.removeItem(SESSION_KEY);
  }
}

function toSession(u: StoredUser): SessionUser {
  return {
    email: u.email,
    name: u.name,
    createdAt: u.createdAt,
    onboardingComplete: u.onboardingComplete,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const email = readSessionEmail();
    if (!email) {
      setUser(null);
      setReady(true);
      return;
    }
    const users = readUsers();
    const found = users[email.toLowerCase()];
    setUser(found ? toSession(found) : null);
    setReady(true);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const key = email.trim().toLowerCase();
    const users = readUsers();
    const found = users[key];
    if (!found || found.password !== password) {
      return { ok: false as const, error: "Email or password is incorrect." };
    }
    writeSessionEmail(key);
    setUser(toSession(found));
    return { ok: true as const };
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const key = email.trim().toLowerCase();
    if (!key || !password) {
      return { ok: false as const, error: "Email and password are required." };
    }
    const users = readUsers();
    if (users[key]) {
      return { ok: false as const, error: "An account with this email already exists." };
    }
    const record: StoredUser = {
      email: key,
      name: name.trim() || "Viber",
      password,
      createdAt: new Date().toISOString(),
      onboardingComplete: false,
    };
    users[key] = record;
    writeUsers(users);
    writeSessionEmail(key);
    setUser(toSession(record));
    return { ok: true as const };
  }, []);

  const signOut = useCallback(() => {
    writeSessionEmail(null);
    setUser(null);
  }, []);

  const completeOnboarding = useCallback(() => {
    const email = user?.email;
    if (!email) return;
    const users = readUsers();
    const found = users[email];
    if (!found) return;
    found.onboardingComplete = true;
    users[email] = found;
    writeUsers(users);
    setUser(toSession(found));
  }, [user?.email]);

  const value = useMemo(
    () => ({
      user,
      ready,
      signIn,
      signUp,
      signOut,
      completeOnboarding,
    }),
    [user, ready, signIn, signUp, signOut, completeOnboarding],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
