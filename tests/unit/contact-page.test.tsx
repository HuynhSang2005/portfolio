import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/contact",
}));

vi.mock("@/lib/hooks/use-scroll-direction", () => ({
  useScrollDirection: vi.fn(() => ({
    scrollTop: 0,
    direction: "down",
    visible: false,
  })),
}));

vi.mock("@/features/contact/components/contact-form", () => ({
  ContactForm: () => <div data-testid="contact-form" />,
}));

vi.mock("@/lib/hooks/use-item-hover-sound", () => ({
  useItemHoverSound: () => () => {},
}));

import { UiStoreProvider } from "@/providers/ui-store-provider";

function renderPage(ui: React.ReactElement) {
  return render(<UiStoreProvider>{ui}</UiStoreProvider>);
}

afterEach(() => {
  cleanup();
});

describe("contact page", () => {
  it("renders header, email fallback row and the form island", async () => {
    const { default: ContactPage } = await import("@/app/contact/page");
    renderPage(await ContactPage());
    expect(screen.getByRole("heading", { level: 1, name: /contact/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /@/i }).getAttribute("href")).toMatch(/^mailto:/);
    expect(screen.getByTestId("contact-form")).toBeTruthy();
  }, 30_000);

  it("exposes metadata", async () => {
    const { generateMetadata } = await import("@/app/contact/page");
    expect((await generateMetadata()).title).toBe("Contact");
  }, 30_000);
});
