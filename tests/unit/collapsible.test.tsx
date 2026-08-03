import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/components/ui/collapsible";

describe("Collapsible (Base UI)", () => {
  afterEach(() => {
    cleanup();
  });

  it("is closed by default and opens on trigger click", () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsiblePanel>Panel body</CollapsiblePanel>
      </Collapsible>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });
    expect(trigger.hasAttribute("data-panel-open")).toBe(false);
    fireEvent.click(trigger);
    expect(trigger.hasAttribute("data-panel-open")).toBe(true);
    expect(screen.getByText("Panel body")).toBeTruthy();
  });

  it("respects defaultOpen", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsiblePanel>Panel body</CollapsiblePanel>
      </Collapsible>,
    );
    expect(screen.getByRole("button", { name: "Toggle" }).hasAttribute("data-panel-open")).toBe(
      true,
    );
  });

  it("panel carries the animation bridge classes", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsiblePanel>Panel body</CollapsiblePanel>
      </Collapsible>,
    );
    const panel = screen.getByText("Panel body");
    expect(panel.className).toContain("data-[open]:animate-collapsible-down");
    expect(panel.className).toContain("--radix-collapsible-content-height");
  });
});
