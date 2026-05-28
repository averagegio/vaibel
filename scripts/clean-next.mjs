/**
 * Remove Next.js cache dirs (fixes stuck locks / permission errors on Windows).
 * Usage: npm run clean
 */
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const targets = [join(root, ".next"), join(root, "node_modules", ".cache")];

for (const dir of targets) {
  if (!existsSync(dir)) continue;
  rmSync(dir, { recursive: true, force: true });
  console.log("Removed:", dir);
}
