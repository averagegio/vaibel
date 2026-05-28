/**
 * Print the URL to use on your phone (Next shows 0.0.0.0 when bound with -H 0.0.0.0).
 * Run: node scripts/print-lan-url.mjs [port]
 */
import { networkInterfaces } from "node:os";

const port = process.argv[2] || "3001";
const hosts = [];

for (const list of Object.values(networkInterfaces())) {
  if (!list) continue;
  for (const n of list) {
    const isV4 = n.family === "IPv4" || n.family === 4;
    if (!isV4 || n.internal) continue;
    if (n.address === "127.0.0.1") continue;
    hosts.push(n.address);
  }
}

/** Prefer real Wi‑Fi/LAN over WSL (172.17.x) and link-local (169.254.x). */
function rank(ip) {
  if (ip.startsWith("192.168.")) return 0;
  if (ip.startsWith("10.")) return 1;
  const m = /^172\.(\d+)\./.exec(ip);
  if (m) {
    const second = Number(m[1]);
    if (second >= 16 && second <= 31) return 2;
    return 7;
  }
  if (ip.startsWith("169.254.")) return 9;
  return 5;
}

hosts.sort((a, b) => rank(a) - rank(b));
const primary = hosts[0];

console.log("");
console.log("  --- Phone (same Wi‑Fi as this PC) ---");
if (primary) {
  console.log(`  Open:  http://${primary}:${port}`);
  const extras = hosts.filter((h) => h !== primary);
  if (extras.length) {
    console.log("  (do not use WSL/link-local: " + extras.join(", ") + ")");
  }
} else {
  console.log("  No LAN IPv4 found; run ipconfig and use http://<Wi-Fi-IP>:" + port);
}
console.log("  PC first: http://localhost:" + port + " (wait until it loads)");
console.log("  Ignore Next “Network: http://0.0.0.0” — use the URL above on your phone.");
console.log("");
