import { expect, test } from "@playwright/test";

/**
 * Contact e2e.
 *
 * Default: `bun run test:e2e` against `bun run dev` (baseURL localhost:3000) —
 * validation + render only (rate limit skipped in next dev).
 *
 * Workers-true (rate limit + Resend on Cloudflare): set
 *   PLAYWRIGHT_BASE_URL=https://huynhsang.id.vn
 * (or the workers.dev URL) after `bun run deploy`. Optional force:
 *   CONTACT_E2E_WORKERS=1
 * Skip clearly when Turnstile / Resend env is missing.
 * Local `bun run preview` / :8787 is not a gate (see DX decision).
 */

const hasTurnstile = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
const hasResend = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);

function isDeployedWorkersBase(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname;
    return host === "huynhsang.id.vn" || host.endsWith(".workers.dev");
  } catch {
    return false;
  }
}

const isWorkersRemote = Boolean(
  isDeployedWorkersBase(process.env.PLAYWRIGHT_BASE_URL) || process.env.CONTACT_E2E_WORKERS === "1",
);

test.describe("contact page — shell", () => {
  test("renders header, email fallback and form", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "load" });
    await expect(page.getByRole("heading", { level: 1, name: /contact/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /@/ })).toHaveAttribute("href", /^mailto:/);
    await expect(page.getByLabel(/^name$/i)).toBeVisible();
    await expect(page.getByLabel(/^email$/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /send message/i })).toBeVisible();
  });

  test("empty submit shows client-side validation errors", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "load" });
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByRole("alert").first()).toBeVisible();
  });
});

test.describe("contact page — Workers remote delivery", () => {
  test.beforeEach(() => {
    test.skip(
      !isWorkersRemote,
      "Set PLAYWRIGHT_BASE_URL=https://huynhsang.id.vn (or *.workers.dev) after deploy",
    );
    test.skip(!hasTurnstile, "NEXT_PUBLIC_TURNSTILE_SITE_KEY not set");
    test.skip(!hasResend, "RESEND_API_KEY / CONTACT_TO_EMAIL not set");
  });

  test("valid submit shows success", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "load" });
    await page.getByLabel(/^name$/i).fill("QA Tester");
    await page.getByLabel(/^email$/i).fill("qa@example.com");
    await page.getByLabel(/message/i).fill("Hello from Playwright contact success path.");

    // Wait for Turnstile token (widget UI is cross-origin; token lands in a hidden input).
    await page.waitForFunction(
      () => {
        const input = document.querySelector(
          'input[name="cf-turnstile-response"]',
        ) as HTMLInputElement | null;
        return Boolean(input?.value && input.value.length > 10);
      },
      undefined,
      { timeout: 30_000 },
    );
    await page.getByRole("button", { name: /send message/i }).click();

    await expect(
      page.getByText(/message sent|thanks for reaching|something went wrong|verification failed/i),
    ).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByText(/message sent|thanks for reaching/i)).toBeVisible();
  });

  test("4th rapid submit is rate-limited", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "load" });

    let sawRateLimit = false;

    for (let i = 1; i <= 6; i++) {
      await page.getByLabel(/^name$/i).fill(`QA Tester ${i}`);
      await page.getByLabel(/^email$/i).fill(`qa${i}@example.com`);
      await page.getByLabel(/message/i).fill(`Rate-limit probe message number ${i}.`);
      await page.waitForFunction(
        () => {
          const input = document.querySelector(
            'input[name="cf-turnstile-response"]',
          ) as HTMLInputElement | null;
          return Boolean(input?.value && input.value.length > 10);
        },
        undefined,
        { timeout: 30_000 },
      );
      await page.getByRole("button", { name: /send message/i }).click();
      const status = page.getByRole("status");
      await expect(status).toBeVisible({ timeout: 60_000 });
      const text = (await status.textContent()) ?? "";
      if (/too many messages|try again in a minute/i.test(text)) {
        sawRateLimit = true;
        break;
      }
      await expect(status).toContainText(/message sent|thanks for reaching/i);
    }

    expect(
      sawRateLimit,
      "Expected Cloudflare CONTACT_RATE_LIMITER (3/60s per colo) to reject a rapid burst",
    ).toBe(true);
  });
});
