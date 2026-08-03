import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Visual diff + kiểm tra hành vi tương tác trang Home (clone :3000).
 *
 * Fixture-driven deltas so với template :6969 (so sánh thủ công + P1 harness):
 * - Identity/bio/job title từ `siteConfig` owner — khác nội dung template gốc.
 * - Dock socials trống cho đến khi có URL thật (template có icon mạng xã hội).
 * - Heatmap phụ thuộc `githubUsername` trong config (có thể empty state).
 * - Projects/experiences dùng placeholder (Example Co, sample projects).
 */

/** URL dev server template gốc (portfolio-template-ui-ux). */
const TEMPLATE_URL = "http://localhost:6969";

/** URL dev server clone (repo này). */
const CLONE_URL = "http://localhost:3000";

/** Ngưỡng chênh lệch pixel cho full-page screenshot (5% — nội dung động + font raster). */
const FULL_PAGE_DIFF = { maxDiffPixelRatio: 0.05 } as const;

type Theme = "light" | "dark";

const SECTIONS = [
  "hero",
  "testimonials",
  "contribution",
  "projects",
  "experiences",
  "wordmark",
] as const;

type HomeSection = (typeof SECTIONS)[number];

/** Viewport desktop mặc định — khớp matrix P1 foundation harness. */
const DESKTOP_VIEWPORT = { width: 1280, height: 800 } as const;

/**
 * Kiểm tra template dev server có phản hồi tại :6969 hay không.
 * Dùng cho probe paired fidelity khi cần so template (optional).
 */
async function templateReachable(page: Page): Promise<boolean> {
  try {
    const res = await page.request.get(TEMPLATE_URL, { timeout: 15_000 });
    return res.ok();
  } catch {
    return false;
  }
}

/** Áp theme light/dark trên `document.documentElement` — convention P1 harness. */
async function applyTheme(page: Page, theme: Theme) {
  await page.emulateMedia({ colorScheme: theme });
  await page.evaluate((t) => {
    document.documentElement.classList.toggle("dark", t === "dark");
  }, theme);
  await page.waitForTimeout(500);
}

/** Điều hướng clone Home và chờ animation reveal ổn định. */
async function gotoHome(page: Page, theme: Theme) {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto(`${CLONE_URL}/`, { waitUntil: "networkidle" });
  await applyTheme(page, theme);
}

/** Locator probe theo section — geometry/presence, không snapshot từng section. */
function sectionProbe(page: Page, section: HomeSection): Locator {
  switch (section) {
    case "hero":
      return page.locator("main h1").first();
    case "testimonials":
      return page.locator("[style*='marquee-scroll']").first();
    case "contribution":
      return page.getByRole("heading", { name: "GitHub Contribution", includeHidden: true });
    case "projects":
      return page.getByRole("heading", { name: "Projects" });
    case "experiences":
      return page.getByRole("heading", { name: "Experience" });
    case "wordmark":
      return page.locator("section .wf").first();
    default: {
      const _exhaustive: never = section;
      return page.locator(`[data-unknown-section="${_exhaustive}"]`);
    }
  }
}

for (const theme of ["light", "dark"] as const) {
  test.describe(`home ${theme}`, () => {
    test("full page matches template structure", async ({ page }) => {
      await gotoHome(page, theme);
      await expect(page).toHaveScreenshot(`home-full-${theme}.png`, {
        fullPage: true,
        ...FULL_PAGE_DIFF,
      });
    });

    for (const section of SECTIONS) {
      test(`section ${section} renders`, async ({ page }) => {
        await gotoHome(page, theme);
        const probe = sectionProbe(page, section);
        await expect(probe).toBeVisible();
        const box = await probe.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThan(0);
        expect(box!.height).toBeGreaterThan(0);
      });
    }
  });
}

test("experiences collapsible toggles with chevron rotation", async ({ page }) => {
  await gotoHome(page, "light");
  const trigger = page.getByRole("button", { name: /Example Co/ });
  await expect(trigger).toHaveAttribute("data-panel-open", "");
  await trigger.click();
  await expect(trigger).not.toHaveAttribute("data-panel-open");
});

test("testimonial marquee pauses on hover", async ({ page }) => {
  await gotoHome(page, "light");
  const group = page
    .locator(".group")
    .filter({ has: page.locator("[style*='marquee-scroll']") })
    .first();
  const track = group.locator("[style*='marquee-scroll']").first();
  await group.scrollIntoViewIfNeeded();
  await group.hover({ position: { x: 20, y: 10 } });
  const playState = await track.evaluate((el) => getComputedStyle(el).animationPlayState);
  expect(playState).toBe("paused");
});

test("sound toggle persists sound-muted to localStorage", async ({ page }) => {
  await gotoHome(page, "light");
  await page.getByRole("button", { name: "Mute sounds" }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("sound-muted"))).toBe("true");
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.getByRole("button", { name: "Unmute sounds" })).toBeVisible();
});

test("no hydration errors in console", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });
  await gotoHome(page, "light");
  expect(errors.filter((e) => /hydrat|did not match/i.test(e))).toEqual([]);
});

test.describe("home template paired probe", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      !(await templateReachable(page)),
      "Template dev server not running at :6969 — start it for paired probes",
    );
  });

  test("section count matches template", async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
    await page.goto(TEMPLATE_URL, { waitUntil: "networkidle" });
    const templateCount = await page.locator("main section").count();

    await page.goto(`${CLONE_URL}/`, { waitUntil: "networkidle" });
    const cloneCount = await page.locator("main section").count();

    expect(cloneCount).toBe(templateCount);
  });
});
