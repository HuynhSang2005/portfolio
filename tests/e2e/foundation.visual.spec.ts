import { expect, test, type Page } from "@playwright/test";

/** URL dev server template gốc (portfolio-template-ui-ux). */
const TEMPLATE_URL = "http://localhost:6969";

/** URL dev server clone (repo này). */
const CLONE_URL = "http://localhost:3000";

/** Ngưỡng chênh lệch pixel cho so sánh ảnh (2% — hấp thụ sai số raster font). */
const DIFF = { maxDiffPixelRatio: 0.02 } as const;

/**
 * Kiểm tra template dev server có phản hồi tại :6969 hay không.
 * Dùng để skip suite fidelity khi server chưa được khởi động thủ công.
 */
async function templateReachable(page: Page): Promise<boolean> {
  try {
    const res = await page.request.get(TEMPLATE_URL, { timeout: 3_000 });
    return res.ok();
  } catch {
    return false;
  }
}

/**
 * Chụp screenshot cùng viewport/theme trên template rồi clone,
 * so khớp snapshot dùng chung (baseline từ template).
 */
async function shotBoth(
  page: Page,
  name: string,
  theme: "light" | "dark",
  viewport: { width: number; height: number },
) {
  await page.setViewportSize(viewport);

  await page.goto(TEMPLATE_URL, { waitUntil: "networkidle" });
  await page.evaluate((t) => {
    document.documentElement.classList.toggle("dark", t === "dark");
  }, theme);
  await page.waitForTimeout(500);
  const templateShot = await page.screenshot({ fullPage: false });
  expect(templateShot).toMatchSnapshot(`${name}-${theme}.png`, DIFF);

  await page.goto(CLONE_URL, { waitUntil: "networkidle" });
  await page.evaluate((t) => {
    document.documentElement.classList.toggle("dark", t === "dark");
  }, theme);
  await page.waitForTimeout(500);
  const cloneShot = await page.screenshot({ fullPage: false });
  expect(cloneShot).toMatchSnapshot(`${name}-${theme}.png`, DIFF);
}

/**
 * Chụp screenshot chỉ trên clone — dùng khi template không chạy
 * để lưu baseline clone độc lập (`clone-*` snapshots).
 */
async function shotCloneOnly(
  page: Page,
  name: string,
  theme: "light" | "dark",
  viewport: { width: number; height: number },
) {
  await page.setViewportSize(viewport);
  await page.goto(CLONE_URL, { waitUntil: "networkidle" });
  await page.evaluate((t) => {
    document.documentElement.classList.toggle("dark", t === "dark");
  }, theme);
  await page.waitForTimeout(500);
  const shot = await page.screenshot({ fullPage: false });
  expect(shot).toMatchSnapshot(`clone-${name}-${theme}.png`, DIFF);
}

test.describe("foundation fidelity", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      !(await templateReachable(page)),
      "Template dev server not running at :6969 — start it for fidelity comparison",
    );
  });

  test("desktop chrome — light", async ({ page }) => {
    await shotBoth(page, "desktop", "light", { width: 1280, height: 800 });
  });

  test("desktop chrome — dark", async ({ page }) => {
    await shotBoth(page, "desktop", "dark", { width: 1280, height: 800 });
  });

  test("mobile chrome — light", async ({ page }) => {
    await shotBoth(page, "mobile", "light", { width: 390, height: 844 });
  });

  test("computed tokens match template", async ({ page }) => {
    const probe = () => {
      const body = getComputedStyle(document.body);
      const html = getComputedStyle(document.documentElement);
      return {
        background: body.backgroundColor,
        color: body.color,
        fontFamily: body.fontFamily,
        borderColor: html.getPropertyValue("--border"),
      };
    };

    await page.goto(TEMPLATE_URL, { waitUntil: "networkidle" });
    const templateTokens = await page.evaluate(probe);

    await page.goto(CLONE_URL, { waitUntil: "networkidle" });
    const cloneTokens = await page.evaluate(probe);

    expect(cloneTokens.background).toBe(templateTokens.background);
    expect(cloneTokens.color).toBe(templateTokens.color);
    expect(cloneTokens.fontFamily).toBe(templateTokens.fontFamily);
    expect(cloneTokens.borderColor).toBe(templateTokens.borderColor);
  });
});

test.describe("foundation clone baselines", () => {
  test.beforeEach(async ({ page }) => {
    const templateUp = await templateReachable(page);
    test.skip(
      templateUp,
      "Template is running — use foundation fidelity suite for side-by-side comparison",
    );
  });

  test("clone desktop — light", async ({ page }) => {
    await shotCloneOnly(page, "desktop", "light", { width: 1280, height: 800 });
  });

  test("clone desktop — dark", async ({ page }) => {
    await shotCloneOnly(page, "desktop", "dark", { width: 1280, height: 800 });
  });

  test("clone mobile — light", async ({ page }) => {
    await shotCloneOnly(page, "mobile", "light", { width: 390, height: 844 });
  });
});
