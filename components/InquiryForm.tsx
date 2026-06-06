"use client";

import { useState } from "react";

export type InquiryField = {
  name: string;
  label: string;
  type?: "text" | "email" | "url" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  minLength?: number;
};

type Props = {
  endpoint: string;
  fields: InquiryField[];
  submitLabel?: string;
  successTitle?: string;
  successBody?: string;
};

const inputClass =
  "w-full rounded-2xl border border-vaibee-border bg-white px-4 py-3 text-sm text-vaibee-navy outline-none transition placeholder:text-vaibee-muted/70 focus:border-vaibee-cyan/50 focus:ring-2 focus:ring-vaibee-cyan/20";

export function InquiryForm({
  endpoint,
  fields,
  submitLabel = "Send",
  successTitle = "Thanks — we got it.",
  successBody = "We will get back to you at the email you provided.",
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    for (const f of fields) {
      const val = String(fd.get(f.name) ?? "").trim();
      if (f.required && !val) {
        setStatus("error");
        setMessage(`${f.label} is required.`);
        return;
      }
      if (f.minLength && val.length > 0 && val.length < f.minLength) {
        setStatus("error");
        setMessage(`${f.label} should be at least ${f.minLength} characters.`);
        return;
      }
      if (f.type === "email" && val) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          setStatus("error");
          setMessage("Enter a valid email address.");
          return;
        }
      }
      if (f.type === "url" && val) {
        try {
          new URL(val);
        } catch {
          setStatus("error");
          setMessage(`${f.label} must be a valid URL.`);
          return;
        }
      }
    }

    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch(endpoint, { method: "POST", body: fd });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setStatus("error");
        setMessage(data?.error ?? "Something went wrong. Try again?");
        return;
      }
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Check your connection and retry.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-3xl border border-vaibee-cyan/35 bg-[var(--vaibee-cyan-dim)] p-8 text-center md:p-10">
        <h2 className="text-lg font-semibold text-vaibee-navy">{successTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-vaibee-muted">{successBody}</p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setMessage(null);
          }}
          className="mt-6 inline-flex items-center justify-center rounded-2xl border border-vaibee-border bg-white px-5 py-3 text-sm font-semibold text-vaibee-navy transition hover:border-vaibee-cyan/40"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      {fields.map((f) => (
        <div key={f.name} className="space-y-2">
          <label htmlFor={f.name} className="block text-sm font-semibold text-vaibee-navy">
            {f.label}
            {f.required ? <span className="text-vaibee-cyan"> *</span> : null}
          </label>
          {f.type === "textarea" ? (
            <textarea
              id={f.name}
              name={f.name}
              rows={f.rows ?? 5}
              placeholder={f.placeholder}
              className={inputClass}
            />
          ) : f.type === "select" ? (
            <select id={f.name} name={f.name} defaultValue="" className={inputClass}>
              <option value="" disabled>
                {f.placeholder ?? "Select one"}
              </option>
              {(f.options ?? []).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={f.name}
              name={f.name}
              type={f.type ?? "text"}
              placeholder={f.placeholder}
              className={inputClass}
            />
          )}
        </div>
      ))}

      {message ? (
        <p
          className={`text-sm ${status === "error" ? "text-red-600" : "text-vaibee-muted"}`}
          role={status === "error" ? "alert" : undefined}
        >
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center rounded-2xl bg-vaibee-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
