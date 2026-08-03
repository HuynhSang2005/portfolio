import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Section } from "@/components/layout/section";

describe("Section", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders children inside a section element", () => {
    render(
      <Section>
        <h1>Test heading</h1>
      </Section>,
    );
    expect(screen.getByRole("heading", { name: "Test heading" })).toBeInTheDocument();
    expect(screen.getByRole("heading").closest("section")).toBeInTheDocument();
  });

  it("renders four corner marks with border chrome", () => {
    const { container } = render(<Section>Content</Section>);
    const marks = container.querySelectorAll(".border-foreground\\/30");
    expect(marks).toHaveLength(4);
  });

  it("renders side line dividers hidden on mobile", () => {
    const { container } = render(<Section>Content</Section>);
    const sideLines = container.querySelectorAll(".bg-foreground\\/10");
    expect(sideLines).toHaveLength(2);
    for (const line of sideLines) {
      expect(line.className).toContain("hidden");
      expect(line.className).toContain("sm:block");
    }
  });

  it("applies sectionClassName to the outer section", () => {
    const { container } = render(<Section sectionClassName="custom-section">Content</Section>);
    expect(container.querySelector("section.custom-section")).toBeInTheDocument();
  });
});
