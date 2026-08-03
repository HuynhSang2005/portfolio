import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Required by OpenNext (`NEXT_PRIVATE_STANDALONE`); keep explicit for clarity.
  output: "standalone",
};

export default nextConfig;

// Wrangler getPlatformProxy is RAM-heavy on this laptop and can push Turbopack
// into a memory-threshold restart (spurious GET / 404 on cold start).
// Opt in only when testing Cloudflare bindings under next dev.
// Contact rate-limit already degrades without bindings (spec §6.6).
if (process.env.OPENNEXT_CLOUDFLARE_DEV === "1") {
  initOpenNextCloudflareForDev();
}
