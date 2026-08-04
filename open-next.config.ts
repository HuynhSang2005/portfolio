// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  // R2 incremental cache — ISR/fetch revalidate trên Workers (bucket portfolio-cache).
  incrementalCache: r2IncrementalCache,
});
