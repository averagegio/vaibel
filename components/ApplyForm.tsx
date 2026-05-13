"use client";

import { useState } from "react";

export function ApplyForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setStatus("error");
        setMessage(data?.error ?? "Something went wrong. Try again?");
        return;
      }
      setStatus("success");
      setMessage("Thanks — your viber application is in the hive queue.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Check your connection and retry.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-6">
      <div className="rounded-2xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm">
        <label className="block text-sm font-medium text-vaibee-navy">
          Your name
          <input
            name="applicantName"
            required
            autoComplete="name"
            placeholder="Jamie Rivera"
            className="mt-1.5 w-full rounded-xl border border-vaibee-border bg-vaibee-surface px-3 py-2.5 text-sm outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm">
        <label className="block text-sm font-medium text-vaibee-navy">
          Co-founder email
          <input
            name="cofounderEmail"
            type="email"
            required
            autoComplete="email"
            placeholder="cofounder@studio.dev"
            className="mt-1.5 w-full rounded-xl border border-vaibee-border bg-vaibee-surface px-3 py-2.5 text-sm outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm">
        <label className="block text-sm font-medium text-vaibee-navy">
          Company logo
          <input
            name="logo"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="mt-2 block w-full text-sm text-vaibee-muted file:mr-4 file:rounded-lg file:border-0 file:bg-vaibee-navy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-vaibee-navy-soft"
          />
        </label>
        <p className="mt-2 text-xs text-vaibee-muted">PNG, JPG, WebP, or SVG — up to 4&nbsp;MB.</p>
      </div>

      <div className="rounded-2xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm">
        <label className="block text-sm font-medium text-vaibee-navy">
          Agent API base URL
          <input
            name="agentApiUrl"
            type="url"
            required
            placeholder="https://api.yourstudio.dev/v1"
            className="mt-1.5 w-full rounded-xl border border-vaibee-border bg-vaibee-surface px-3 py-2.5 font-mono text-sm outline-none ring-vaibee-cyan/30 focus:border-vaibee-cyan focus:ring-2"
          />
        </label>
        <p className="mt-2 text-xs text-vaibee-muted">
          We will call this from our integration worker to register your agent manifest and health checks.
        </p>
      </div>

      {message ? (
        <p
          className={[
            "rounded-xl px-4 py-3 text-sm",
            status === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border border-rose-200 bg-rose-50 text-rose-900",
          ].join(" ")}
        >
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-2xl bg-vaibee-navy px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-vaibee-navy-soft disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
