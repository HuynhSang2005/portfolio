import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("@/lib/hooks/use-scroll-direction", () => ({
  useScrollDirection: vi.fn(() => ({
    scrollTop: 0,
    direction: "down",
    visible: false,
  })),
}));

import Page from "@/app/page";
import { siteConfig } from "@/config/site";
import { UiStoreProvider } from "@/providers/ui-store-provider";

function renderPage(ui: React.ReactElement) {
  return render(<UiStoreProvider>{ui}</UiStoreProvider>);
}

describe("home page composition", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ contributions: [] }),
        }),
      ),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders all sections in template order", async () => {
    const ui = await Page();
    renderPage(ui);

    expect(screen.getByRole("heading", { level: 1, name: siteConfig.name })).toBeTruthy();
    expect(screen.getByText(siteConfig.jobTitle)).toBeTruthy();

    expect(screen.getByRole("heading", { name: "Projects" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Experience" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "GitHub Contribution" })).toBeTruthy();

    expect(screen.getByLabelText(siteConfig.name)).toBeTruthy();
  });

  it("includes the bottom dock spacer", async () => {
    const ui = await Page();
    const { container } = renderPage(ui);
    expect(container.querySelector('[class*="clamp(80px,10vh,200px)"]')).toBeTruthy();
  });
});
