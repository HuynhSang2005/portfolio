import { expect, test } from "@playwright/test";

const CLONE = "http://localhost:3000";

test("contact page renders header, email fallback and form", async ({ page }) => {
  await page.goto(`${CLONE}/contact`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: /contact/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /@/ })).toHaveAttribute("href", /^mailto:/);
  await expect(page.getByLabel(/^name$/i)).toBeVisible();
  await expect(page.getByLabel(/^email$/i)).toBeVisible();
  await expect(page.getByLabel(/message/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /send message/i })).toBeVisible();
});

test("empty submit shows client-side validation errors", async ({ page }) => {
  await page.goto(`${CLONE}/contact`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByRole("alert").first()).toBeVisible();
});

/**
 * Happy-path submit requires Turnstile site key + Resend (Workers preview for rate limit).
 * Skip clearly when env is missing — do not fail silently.
 */
test("valid client fields reach pending/send without blocking on empty validation", async ({
  page,
}) => {
  const hasTurnstile = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  test.skip(!hasTurnstile, "NEXT_PUBLIC_TURNSTILE_SITE_KEY not set — skip submit smoke");

  await page.goto(`${CLONE}/contact`, { waitUntil: "networkidle" });
  await page.getByLabel(/^name$/i).fill("QA Tester");
  await page.getByLabel(/^email$/i).fill("qa@example.com");
  await page.getByLabel(/message/i).fill("Hello from Playwright contact smoke.");
  // Without a real/always-pass widget token in headed CI, assert client path is ready:
  // Send stays enabled (not stuck on empty-field validation) after filling required fields.
  await expect(page.getByRole("button", { name: /send message/i })).toBeEnabled();
});
