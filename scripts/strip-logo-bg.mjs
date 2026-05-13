/**
 * Remove background from a logo PNG → public/vaibeelogos.png
 *
 * Usage:
 *   npm run strip-logo-bg -- "C:\path\to\input.png"
 * Or drop a source file at public/vaibeelogos-source.png and run:
 *   npm run strip-logo-bg
 */
import { writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { removeBackground } from "@imgly/background-removal-node";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outPath = join(root, "public", "vaibeelogos.png");
const defaultInProject = join(root, "public", "vaibeelogos-source.png");

const inputPath = process.argv[2] ?? defaultInProject;

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
