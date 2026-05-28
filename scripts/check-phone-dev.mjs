/**
 * Quick checklist: is dev listening? can this PC reach itself via LAN IP?
 * Usage: node scripts/check-phone-dev.mjs [port]
 */
import { networkInterfaces } from "node:os";
import net from "node:net";

const port = Number(process.argv[2] || "3002");

function lanIps() {
  const hosts = [];
  for (const list of Object.values(networkInterfaces())) {
    if (!list) continue;
    for (const n of list) {
      const isV4 = n.family === "IPv4" || n.family === 4;
      if (!isV4 || n.internal || n.address === "127.0.0.1") continue;
      hosts.push(n.address);
    }
  }
  return hosts.filter((ip) => ip.startsWith("192.168.") || ip.startsWith("10."));
}

function portOpen(host, p) {
  return new Promise((resolve) => {
    const s = net.connect({ host, port: p, timeout: 2000 }, () => {
      s.destroy();
      resolve(true);
    });
    s.on("error", () => resolve(false));
    s.on("timeout", () => {
      s.destroy();
      resolve(false);
    });
  });
}

const wifi = lanIps()[0] ?? null;
const listenLocal = await portOpen("127.0.0.1", port);
const listenLan = wifi ? await portOpen(wifi, port) : false;

console.log("");
console.log(`Port ${port} on 127.0.0.1: ${listenLocal ? "OPEN (dev server running)" : "closed — run: npm run dev:phone2"}`);
if (wifi) {
  console.log(`Port ${port} on ${wifi}:    ${listenLan ? "OPEN (phone should reach this IP)" : "closed — firewall or server not bound to 0.0.0.0"}`);
  console.log(`Phone URL: http://${wifi}:${port}`);
} else {
  console.log("No 192.168.x / 10.x address found — connect PC to Wi‑Fi.");
}
if (listenLocal && wifi && !listenLan) {
  console.log("");
  console.log("Fix: Windows Firewall → allow Node.js on Private network, or add inbound TCP rule for port " + port);
}
console.log("");
