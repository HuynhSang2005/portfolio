import { describe, expect, it } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { GET as getFeed } from "@/app/feed.xml/route";
import { SITE_URL } from "@/config/site";

describe("canonical production origin", () => {
  it("uses the subdomain as the single production origin", () => {
    expect(SITE_URL).toBe("https://portfolio.huynhsang.id.vn");
  });

  it("emits the canonical subdomain in robots and sitemap", async () => {
    expect(robots().sitemap).toBe(`${SITE_URL}/sitemap.xml`);

    const entries = await sitemap();
    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: SITE_URL }),
        expect.objectContaining({ url: `${SITE_URL}/blog` }),
      ]),
    );
  });

  it("emits canonical links and GUIDs in the RSS feed", async () => {
    const response = await getFeed();
    const xml = await response.text();

    expect(xml).toContain(`<link>${SITE_URL}/blog</link>`);
    expect(xml).toContain(`${SITE_URL}/blog/sample-post-one`);
  });
});
