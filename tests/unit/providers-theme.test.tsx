import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-query", () => ({
  QueryClient: class MockQueryClient {},
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query">{children}</div>
  ),
}));

vi.mock("@/providers/ui-store-provider", () => ({
  UiStoreProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ui-store">{children}</div>
  ),
}));

import { Providers } from "@/app/providers";

describe("Providers", () => {
  it("wraps children in query and ui-store providers", () => {
    render(
      <Providers>
        <span>child</span>
      </Providers>,
    );

    expect(screen.getByTestId("query")).toBeInTheDocument();
    expect(screen.getByTestId("ui-store")).toBeInTheDocument();
    expect(screen.getByText("child")).toBeInTheDocument();
  });
});
