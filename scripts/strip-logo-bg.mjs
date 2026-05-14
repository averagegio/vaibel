/**
 * Remove background from a logo PNG (writes PNG with alpha).
 *
 * Usage:
 *   npm run strip-logo-bg -- "public/vai bee.png" "public/vai-bee.png"
 *   npm run strip-logo-bg -- "C:\path\to\input.png"              → public/vaibeelogos.png
 * Or drop a source file at public/vaibeelogos-source.png and run:
 *   npm run strip-logo-bg
 */
import { writeFileSync, existsSync } from "node:fs";
import { join, dirname, isAbsolute } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { removeBackground } from "@imgly/background-removal-node";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const defaultOutPath = join(root, "public", "vaibeelogos.png");
const defaultInProject = join(root, "public", "vaibeelogos-source.png");

function resolveAgainstRoot(p) {
  return isAbsolute(p) ? p : join(root, p);
}

const inputPath = process.argv[2] ? resolveAgainstRoot(process.argv[2]) : defaultInProject;
const outPath = process.argv[3] ? resolveAgainstRoot(process.argv[3]) : defaultOutPath;

if (!existsSync(inputPath)) {
  console.error("Input not found:", inputPath);
  console.error("Pass a PNG path as the first argument, or add public/vaibeelogos-source.png");
  process.exit(1);
}

const inputUrl = pathToFileURL(inputPath).href;

console.log("Reading:", inputPath);
console.log("Removing background (first run may download models)…");
const blob = await removeBackground(inputUrl, {
  output: { format: "image/png", quality: 1, type: "foreground" },
  model: "medium",
});

const ab = await blob.arrayBuffer();
writeFileSync(outPath, Buffer.from(ab));
console.log("Wrote:", outPath);
