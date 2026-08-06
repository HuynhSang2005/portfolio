import { expect, test } from "@playwright/test";

/**
 * Contact e2e.
 *
 * Chạy cục bộ với `bun run dev`: chỉ kiểm tra render và client validation.
 * Turnstile, rate limit và Resend được kiểm tra bằng unit tests tại server boundary.
 */

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
