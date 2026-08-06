import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/blog",
  "/blog/sample-post-one",
  "/craft",
  "/craft/hero-bars",
  "/contact",
  "/robots.txt",
  "/sitemap.xml",
  "/feed.xml",
] as const;

test("public routes return successful responses without page errors", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  for (const route of publicRoutes) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), route).toBe(200);
  }

  expect(pageErrors).toEqual([]);
});

test("robots advertises the canonical sitemap", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  await expect(robots.text()).resolves.toContain(
    "Sitemap: https://portfolio.huynhsang.id.vn/sitemap.xml",
  );
});
