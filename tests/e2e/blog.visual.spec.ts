import { expect, test, type Page } from "@playwright/test";

/**
 * Visual diff + behavior checks for Blog (clone :3000).
 *
 * Fixture-driven deltas vs template :6969 (manual side-by-side):
 * - Post titles/descriptions are placeholder copy, not template articles.
 * - Metrics row (views/likes) is masked in article snapshots — live Supabase counts drift baselines.
 */

/** Ngưỡng chênh lệch pixel cho full-page screenshot (5% — nội dung động + font raster). */
const FULL_PAGE_DIFF = { maxDiffPixelRatio: 0.05 } as const;

type Theme = "light" | "dark";

/** Viewport desktop mặc định — khớp matrix P1/P2 visual harness. */
const DESKTOP_VIEWPORT = { width: 1280, height: 800 } as const;

/** Áp theme light/dark — convention P1/P2 harness. */
async function applyTheme(page: Page, theme: Theme) {
  await page.emulateMedia({ colorScheme: theme });
  await page.evaluate((t) => {
    document.documentElement.classList.toggle("dark", t === "dark");
  }, theme);
  await page.waitForTimeout(500);
}

/** Điều hướng blog route và chờ render ổn định. */
async function gotoBlog(page: Page, path: string, theme: Theme) {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto(path, { waitUntil: "networkidle" });
  await applyTheme(page, theme);
}

for (const theme of ["light", "dark"] as const) {
  test.describe(`blog ${theme}`, () => {
    test("index page", async ({ page }) => {
      await gotoBlog(page, "/blog", theme);
      await expect(page).toHaveScreenshot(`blog-index-${theme}.png`, {
        fullPage: true,
        ...FULL_PAGE_DIFF,
      });
    });

    test("article page with code block", async ({ page }) => {
      await gotoBlog(page, "/blog/sample-post-one", theme);
      const metricsRow = page.locator(
        ".mb-8 .mt-2.flex.items-center.gap-3 > span.flex.items-center.gap-3",
      );
      await expect(page).toHaveScreenshot(`blog-article-${theme}.png`, {
        fullPage: true,
        mask: [metricsRow],
        ...FULL_PAGE_DIFF,
      });
    });

    test("headings carry slug ids from the precompiled MDX pipeline", async ({ page }) => {
      await gotoBlog(page, "/blog/sample-post-one", theme);
      const heading = page.locator("h2[id]").first();
      await expect(heading).toBeVisible();
    });
  });
}
