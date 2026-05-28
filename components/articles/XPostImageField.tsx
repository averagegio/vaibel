"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";

const MAX_BYTES = 4 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export type XPostImageValue = {
  base64: string;
  mimeType: string;
  previewUrl: string;
  fileName: string;
} | null;

type Props = {
  value: XPostImageValue;
  onChange: (value: XPostImageValue) => void;
  postToX: boolean;
  onPostToXChange: (v: boolean) => void;
};

function readFile(file: File): Promise<XPostImageValue> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_BYTES) {
      reject(new Error("Image must be 4 MB or smaller."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Could not read image."));
        return;
      }
      const match = result.match(/^data:([^;]+);base64,(.+)$/);
      if (!match?.[1] || !match[2]) {
        reject(new Error("Invalid image format."));
        return;
      }
      resolve({
        mimeType: match[1],
        base64: match[2],
        previewUrl: result,
        fileName: file.name,
      });
    };
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });
}

export function XPostImageField({ value, onChange, postToX, onPostToXChange }: Props) {
  const inputId = useId();
  const [localError, setLocalError] = useState<string | null>(null);

  const clear = useCallback(() => {
    onChange(null);
    setLocalError(null);
  }, [onChange]);

  useEffect(() => {
    return () => {
      if (value?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(value.previewUrl);
      }
    };
  }, [value?.previewUrl]);

  return (
    <section className="rounded-2xl border border-vaibee-cyan/35 bg-[var(--vaibee-cyan-dim)]/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-vaibee-navy">X post (@askvaibee)</h3>
          <p className="mt-1 text-xs text-vaibee-muted">
            Add a thumbnail image before publishing. It attaches to the tweet when X API is configured on the server.
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-vaibee-navy">
          <input
            type="checkbox"
            checked={postToX}
            onChange={(e) => onPostToXChange(e.target.checked)}
            className="h-4 w-4 rounded border-vaibee-border text-vaibee-cyan focus:ring-vaibee-cyan"
          />
          Post to X
        </label>
      </div>

      {postToX ? (
        <div className="mt-4 space-y-3">
          {value ? (
            <div className="flex flex-wrap items-start gap-4">
              <div className="relative h-36 w-56 overflow-hidden rounded-xl border border-vaibee-border bg-black/5">
                <Image
                  src={value.previewUrl}
                  alt="X post thumbnail preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <p className="truncate text-xs font-medium text-vaibee-navy">{value.fileName}</p>
                <p className="text-xs text-vaibee-muted">This image will upload when you publish.</p>
                <button
                  type="button"
                  onClick={clear}
                  className="text-xs font-semibold text-red-700 hover:underline"
                >
                  Remove image
                </button>
              </div>
            </div>
          ) : (
            <label
              htmlFor={inputId}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-vaibee-cyan/50 bg-white/80 px-4 py-8 text-center transition hover:border-vaibee-cyan"
            >
              <span className="text-sm font-semibold text-vaibee-navy">Choose thumbnail image</span>
              <span className="mt-1 text-xs text-vaibee-muted">JPEG, PNG, WebP, or GIF · max 4 MB</span>
            </label>
          )}

          <input
            id={inputId}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              setLocalError(null);
              void readFile(file)
                .then(onChange)
                .catch((err) => {
                  setLocalError(err instanceof Error ? err.message : "Could not load image.");
                });
            }}
          />

          {value ? (
            <label
              htmlFor={inputId}
              className="inline-flex cursor-pointer text-xs font-semibold text-vaibee-cyan hover:underline"
            >
              Replace image
            </label>
          ) : null}

          {localError ? (
            <p className="text-xs font-medium text-red-700" role="alert">
              {localError}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-xs text-vaibee-muted">X posting skipped for this publish.</p>
      )}
    </section>
  );
}
