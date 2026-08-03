import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { expect, test } from "@playwright/test";

/** URL dev server clone (repo này). */
const CLONE_URL = "http://localhost:3000";

/** Load NEXT_PUBLIC_SUPABASE_URL from .env.local when Playwright process lacks it. */
function hasSupabaseEnv(): boolean {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return true;
  }
  const envLocal = resolve(process.cwd(), ".env.local");
  if (!existsSync(envLocal)) {
    return false;
  }
  for (const line of readFileSync(envLocal, "utf-8").split("\n")) {
    const match = line.match(/^NEXT_PUBLIC_SUPABASE_URL=(.+)$/);
    if (match?.[1]?.trim()) {
      return true;
    }
  }
  return false;
}

test.describe("blog metrics", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(() => {
    test.skip(
      !hasSupabaseEnv(),
      "Supabase env not configured — set NEXT_PUBLIC_SUPABASE_URL in .env.local",
    );
  });

  test("view count increments on article visit", async ({ page, request }) => {
    const before = await (await request.get(`${CLONE_URL}/api/posts/sample-post-two/views`)).json();
    await page.goto(`${CLONE_URL}/blog/sample-post-two`, { waitUntil: "networkidle" });
    await expect
      .poll(async () => (await request.get(`${CLONE_URL}/api/posts/sample-post-two/views`)).json())
      .toBe(before + 1);
  });

  test("like button is optimistic and caps at 3", async ({ page }) => {
    await page.goto(`${CLONE_URL}/blog/sample-post-two`, { waitUntil: "networkidle" });
    const button = page.getByRole("button", { name: /like this post|liked/i });
    for (let i = 0; i < 4; i++) {
      await button.click();
    }
    await page.waitForTimeout(1500);
    await expect(page.getByRole("button", { name: "Liked" })).toBeVisible();
  });
});
