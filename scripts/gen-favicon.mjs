/**
 * Build crisp favicon assets from public/vai-bee.png into app/ and public/.
 * Run: node scripts/gen-favicon.mjs
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "public", "vai-bee.png");
const appDir = join(root, "app");
const publicDir = join(root, "public");

function sized(size) {
  return sharp(src)
    .ensureAlpha()
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } });
}

const icon32 = await sized(32).png().toBuffer();
const apple180 = await sized(180).png().toBuffer();

writeFileSync(join(appDir, "icon.png"), icon32);
writeFileSync(join(appDir, "apple-icon.png"), apple180);

let icoBuffer;
try {
  icoBuffer = await sized(32).toFormat("ico").toBuffer();
} catch {
  icoBuffer = icon32;
}
writeFileSync(join(appDir, "favicon.ico"), icoBuffer);
writeFileSync(join(publicDir, "favicon.ico"), icoBuffer);

console.log("Wrote app/icon.png (32px), app/apple-icon.png (180px), app/favicon.ico, public/favicon.ico");
