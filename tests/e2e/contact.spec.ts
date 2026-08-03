import { expect, test } from "@playwright/test";

const CLONE = "http://localhost:3000";

test("contact page renders header, email fallback and form", async ({ page }) => {
  await page.goto(`${CLONE}/contact`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: /contact/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /@/ })).toHaveAttribute("href", /^mailto:/);
  await expect(page.getByLabel(/name/i)).toBeVisible();
  await expect(page.getByLabel(/message/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /send message/i })).toBeVisible();
});

test("empty submit shows client-side validation errors", async ({ page }) => {
  await page.goto(`${CLONE}/contact`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByRole("alert").first()).toBeVisible();
});
