import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Security headers — CSP cho phép Turnstile (challenges.cloudflare.com) và
// Supabase; 'unsafe-inline' cần cho theme script/JSON-LD inline của Next.
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "media-src 'self' https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com",
      "frame-src https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Required by OpenNext (`NEXT_PRIVATE_STANDALONE`); keep explicit for clarity.
  output: "standalone",
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;

// Wrangler getPlatformProxy is RAM-heavy on this laptop and can push Turbopack
// into a memory-threshold restart (spurious GET / 404 on cold start).
// Opt in only when testing Cloudflare bindings under next dev.
// Contact rate-limit already degrades without bindings (spec §6.6).
if (process.env.OPENNEXT_CLOUDFLARE_DEV === "1") {
  initOpenNextCloudflareForDev();
}
