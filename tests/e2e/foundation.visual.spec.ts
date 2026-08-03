import { expect, test, type Page } from "@playwright/test";

/** URL dev server template gốc (portfolio-template-ui-ux). */
const TEMPLATE_URL = "http://localhost:6969";

/** URL dev server clone (repo này). */
const CLONE_URL = "http://localhost:3000";

/** Ngưỡng chênh lệch pixel cho so sánh ảnh (2% — hấp thụ sai số raster font). */
const DIFF = { maxDiffPixelRatio: 0.02 } as const;

type Theme = "light" | "dark";
type Viewport = { width: number; height: number };

/**
 * Kiểm tra template dev server có phản hồi tại :6969 hay không.
 * Dùng để skip suite fidelity khi server chưa được khởi động thủ công.
 */
async function templateReachable(page: Page): Promise<boolean> {
  try {
    const res = await page.request.get(TEMPLATE_URL, { timeout: 15_000 });
    return res.ok();
  } catch {
    return false;
  }
}

/** Áp theme light/dark trên `document.documentElement`. */
async function applyTheme(page: Page, theme: Theme) {
  await page.evaluate((t) => {
    document.documentElement.classList.toggle("dark", t === "dark");
  }, theme);
  await page.waitForTimeout(500);
}

/**
 * Chụp vùng chrome — mobile: header; desktop: cụm sound/theme cuối dock
 * (bỏ qua navbar/socials vì clone chưa có social URLs thật).
 */
async function shotChrome(page: Page, name: string): Promise<Buffer> {
  if (name === "mobile") {
    const header = page.locator("header").first();
    await header.waitFor({ state: "visible", timeout: 10_000 });
    return header.screenshot();
  }

  const dock = page.locator("footer").first();
  await dock.waitFor({ state: "visible", timeout: 10_000 });
  const box = await dock.boundingBox();
  if (!box) {
    throw new Error("Dock footer has no bounding box");
  }
  const controlsWidth = 140;
  return page.screenshot({
    clip: {
      x: box.x + box.width - controlsWidth,
      y: box.y,
      width: controlsWidth,
      height: box.height,
    },
  });
}

/**
 * Ghi baseline snapshot từ template — chỉ chạy với `--update-snapshots`
 * trên suite `foundation template baselines`.
 */
async function shotTemplateBaseline(page: Page, name: string, theme: Theme, viewport: Viewport) {
  await page.setViewportSize(viewport);
  await page.goto(TEMPLATE_URL, { waitUntil: "networkidle" });
  await applyTheme(page, theme);
  const shot = await shotChrome(page, name);
  expect(shot).toMatchSnapshot(`${name}-${theme}.png`, DIFF);
}

/**
 * So clone với baseline đã ghi từ template — không ghi đè snapshot khi update.
 */
async function shotCloneFidelity(page: Page, name: string, theme: Theme, viewport: Viewport) {
  await page.setViewportSize(viewport);
  await page.goto(CLONE_URL, { waitUntil: "networkidle" });
  await applyTheme(page, theme);
  const shot = await shotChrome(page, name);
  expect(shot).toMatchSnapshot(`${name}-${theme}.png`, DIFF);
}

/**
 * Chụp screenshot chỉ trên clone — dùng khi template không chạy
 * để lưu baseline clone độc lập (`clone-*` snapshots).
 */
async function shotCloneOnly(page: Page, name: string, theme: Theme, viewport: Viewport) {
  await page.setViewportSize(viewport);
  await page.goto(CLONE_URL, { waitUntil: "networkidle" });
  await applyTheme(page, theme);
  const shot = await shotChrome(page, name);
  expect(shot).toMatchSnapshot(`clone-${name}-${theme}.png`, DIFF);
}

test.describe("foundation template baselines", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      !(await templateReachable(page)),
      "Template dev server not running at :6969 — start it to capture baselines",
    );
  });

  test("baseline desktop — light", async ({ page }) => {
    await shotTemplateBaseline(page, "desktop", "light", { width: 1280, height: 800 });
  });

  test("baseline desktop — dark", async ({ page }) => {
    await shotTemplateBaseline(page, "desktop", "dark", { width: 1280, height: 800 });
  });

  test("baseline mobile — light", async ({ page }) => {
    await shotTemplateBaseline(page, "mobile", "light", { width: 390, height: 844 });
  });
});

test.describe("foundation fidelity", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      !(await templateReachable(page)),
      "Template dev server not running at :6969 — start it for fidelity comparison",
    );
  });

  test("desktop chrome — light", async ({ page }) => {
    await shotCloneFidelity(page, "desktop", "light", { width: 1280, height: 800 });
  });

  test("desktop chrome — dark", async ({ page }) => {
    await shotCloneFidelity(page, "desktop", "dark", { width: 1280, height: 800 });
  });

  test("desktop dock present", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(CLONE_URL, { waitUntil: "networkidle" });
    const dock = page.locator("footer").first();
    await expect(dock).toBeVisible();
    await expect(dock.getByRole("link")).toHaveCount(3);
    await expect(dock.getByRole("button", { name: /mute|unmute/i })).toBeVisible();
  });

  test("mobile chrome — light", async ({ page }) => {
    await shotCloneFidelity(page, "mobile", "light", { width: 390, height: 844 });
  });

  test("computed tokens match template", async ({ page }) => {
    const probe = () => {
      /** Chuẩn hóa mọi serialization CSS color (oklch/lab/rgb) về RGBA canvas. */
      const toRgba = (cssColor: string): [number, number, number, number] => {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return [-1, -1, -1, -1];
        }
        ctx.fillStyle = cssColor;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
        return [r, g, b, a];
      };

      const body = getComputedStyle(document.body);

      const borderProbe = document.createElement("div");
      borderProbe.style.border = "1px solid var(--border)";
      document.body.appendChild(borderProbe);
      const borderColor = getComputedStyle(borderProbe).borderTopColor;
      document.body.removeChild(borderProbe);

      return {
        background: toRgba(body.backgroundColor),
        color: toRgba(body.color),
        fontFamily: body.fontFamily,
        borderColor: toRgba(borderColor),
      };
    };

    await page.goto(TEMPLATE_URL, { waitUntil: "networkidle" });
    const templateTokens = await page.evaluate(probe);

    await page.goto(CLONE_URL, { waitUntil: "networkidle" });
    const cloneTokens = await page.evaluate(probe);

    expect(cloneTokens.background).toEqual(templateTokens.background);
    expect(cloneTokens.color).toEqual(templateTokens.color);
    expect(cloneTokens.fontFamily).toBe(templateTokens.fontFamily);
    expect(cloneTokens.borderColor).toEqual(templateTokens.borderColor);
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
