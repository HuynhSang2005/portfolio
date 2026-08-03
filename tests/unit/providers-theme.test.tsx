import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@wrksz/themes/next", () => ({
  ThemeProvider: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
  }) => (
    <div data-testid="theme-provider" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
}));

vi.mock("@tanstack/react-query", () => ({
  QueryClient: class MockQueryClient {},
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query">{children}</div>
  ),
}));

vi.mock("nuqs/adapters/next/app", () => ({
  NuqsAdapter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="nuqs">{children}</div>
  ),
}));

vi.mock("@/providers/ui-store-provider", () => ({
  UiStoreProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ui-store">{children}</div>
  ),
}));

import { Providers } from "@/app/providers";

describe("Providers", () => {
  it("wraps children in ThemeProvider with system class strategy", () => {
    render(
      <Providers>
        <span>child</span>
      </Providers>,
    );

    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
    const props = JSON.parse(
      screen.getByTestId("theme-provider").getAttribute("data-props") ?? "{}",
    );
    expect(props).toMatchObject({
      attribute: "class",
      defaultTheme: "system",
      enableSystem: true,
      disableTransitionOnChange: true,
    });
    expect(screen.getByText("child")).toBeInTheDocument();
  });
});
