import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Avoid Turbopack bundling ESM quirks in twitter-api-v2 (paginator exports). */
  serverExternalPackages: ["twitter-api-v2"],
};

export default nextConfig;
