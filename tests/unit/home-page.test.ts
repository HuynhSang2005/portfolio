import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const pagePath = join(process.cwd(), "src/app/page.tsx");
const page = readFileSync(pagePath, "utf8");

describe("home page stub", () => {
  it("exercises full chrome with ScrollArea and FloatingHeader", () => {
    expect(page).toContain("<ScrollArea useScrollAreaId>");
    expect(page).toContain("<FloatingHeader scrollTitle={siteConfig.name} />");
    expect(page).toContain('className="content-wrapper"');
    expect(page).toContain('className="content"');
  });

  it("includes Section and layout Separator between content blocks", () => {
    expect(page).toContain("<Section>");
    expect(page).toContain("<Separator />");
    expect(page).toContain('from "@/components/layout/separator"');
    expect(page).not.toContain('from "@/components/ui/separator"');
  });

  it("includes tall placeholder content for scroll testing", () => {
    expect(page).toContain("Array.from({ length: 12 }");
    expect(page).toContain("Placeholder content block");
  });
});
