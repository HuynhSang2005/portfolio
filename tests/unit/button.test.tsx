import { readFileSync } from "node:fs";
import { join } from "node:path";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Button, buttonVariants } from "@/components/ui/button";

describe("buttonVariants", () => {
  it("default variant uses pill shape and zinc gradient", () => {
    const classes = buttonVariants({ variant: "default", size: "default" });
    expect(classes).toContain("rounded-full");
    expect(classes).toContain("from-zinc-700");
    expect(classes).toContain("to-zinc-800");
    expect(classes).toContain("active:scale-[0.98]");
  });

  it("supports template sizes default/sm/lg/icon and icon-sm/icon-lg", () => {
    expect(buttonVariants({ size: "default" })).toContain("h-8");
    expect(buttonVariants({ size: "sm" })).toContain("h-7");
    expect(buttonVariants({ size: "lg" })).toContain("h-10");
    expect(buttonVariants({ size: "icon" })).toContain("size-8");
    expect(buttonVariants({ size: "icon-sm" })).toContain("size-7");
    expect(buttonVariants({ size: "icon-lg" })).toContain("size-10");
  });

  it("drops removed base-nova xs sizes from variant config", () => {
    const buttonSrc = readFileSync(join(process.cwd(), "src/components/ui/button.tsx"), "utf8");
    expect(buttonSrc).not.toContain('"xs"');
    expect(buttonSrc).not.toContain('"icon-xs"');
  });
});

describe("Button", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders a button with data-slot attribute", () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole("button", { name: "Click me" });
    expect(btn).toHaveAttribute("data-slot", "button");
    expect(btn.className).toContain("rounded-full");
  });
});
