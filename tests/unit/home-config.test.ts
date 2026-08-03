import { describe, expect, it } from "vitest";

import { EXPERIENCES, experienceSchema } from "@/config/experience";
import { PROJECTS, projectSchema } from "@/config/projects";
import { siteConfig, siteConfigSchema } from "@/config/site";
import { TESTIMONIALS_ROW_1, TESTIMONIALS_ROW_2, testimonialSchema } from "@/config/testimonials";

describe("home configs", () => {
  it("all fixtures pass their own schemas", () => {
    for (const p of PROJECTS) expect(() => projectSchema.parse(p)).not.toThrow();
    for (const e of EXPERIENCES) expect(() => experienceSchema.parse(e)).not.toThrow();
    for (const t of [...TESTIMONIALS_ROW_1, ...TESTIMONIALS_ROW_2])
      expect(() => testimonialSchema.parse(t)).not.toThrow();
  });

  it("site config extension is valid and exposes home fields", () => {
    expect(() => siteConfigSchema.parse(siteConfig)).not.toThrow();
    expect(siteConfig.jobTitle.length).toBeGreaterThan(0);
    expect(siteConfig.bio.length).toBeGreaterThan(0);
    expect(Object.keys(siteConfig.skillsVenn).sort()).toEqual(["bottom", "left", "right", "top"]);
    expect(siteConfig.githubUsername.length).toBeGreaterThan(0);
    expect(siteConfig.pronunciationLang).toBe("vi-VN");
    expect(siteConfig.description.length).toBeGreaterThan(0);
  });

  it("fixtures contain no template-author identity", () => {
    const serialized = JSON.stringify({
      PROJECTS,
      EXPERIENCES,
      TESTIMONIALS_ROW_1,
      TESTIMONIALS_ROW_2,
      siteConfig,
    }).toLowerCase();
    for (const banned of [
      "ruixen",
      "srisomanaath",
      "somanaath",
      "palettebox",
      "hookshelf",
      "tablewise",
      "vancouver",
    ]) {
      expect(serialized).not.toContain(banned);
    }
  });

  it("rejects invalid shapes", () => {
    expect(projectSchema.safeParse({ id: "x" }).success).toBe(false);
    expect(experienceSchema.safeParse({ id: "x", companyName: "Y" }).success).toBe(false);
    expect(testimonialSchema.safeParse({ id: "x", quote: 42 }).success).toBe(false);
  });

  it("exactly one current employer and it is open by default semantics", () => {
    const current = EXPERIENCES.filter((e) => e.isCurrentEmployer);
    expect(current).toHaveLength(1);
  });
});
