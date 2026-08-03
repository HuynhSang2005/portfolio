import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const pagePath = join(process.cwd(), "src/app/page.tsx");
const page = readFileSync(pagePath, "utf8");

describe("home page source", () => {
  it("composes full chrome with ScrollArea and FloatingHeader", () => {
    expect(page).toContain("<ScrollArea useScrollAreaId");
    expect(page).toContain("<FloatingHeader scrollTitle={siteConfig.name} />");
    expect(page).toContain('<Info show={["time", "screen"]} />');
  });

  it("imports layout Separator as default export", () => {
    expect(page).toContain('import Separator from "@/components/layout/separator"');
    expect(page).not.toContain('from "@/components/ui/separator"');
  });

  it("includes generateMetadata and JSON-LD Organization", () => {
    expect(page).toContain("export async function generateMetadata");
    expect(page).toContain('"@type": "Organization"');
  });

  it("wires all home sections and WordmarkFooter", () => {
    expect(page).toContain("<Testimonials />");
    expect(page).toContain("<GitHubContribution />");
    expect(page).toContain("<Projects />");
    expect(page).toContain("<Experiences />");
    expect(page).toContain("<WordmarkFooter brandName={siteConfig.name} />");
    expect(page).toContain('className="h-[clamp(80px,10vh,200px)]');
  });
});
