/**
 * Unit tests for JSON-LD serialization XSS escape.
 */
import { describe, expect, it } from "vitest";

import { serializeJsonLd } from "@/lib/serialize-json-ld";

describe("serializeJsonLd", () => {
  it("escapes < so payloads cannot break out of script tags", () => {
    const html = serializeJsonLd({ evil: "</script><script>alert(1)</script>" });
    expect(html).not.toContain("</script>");
    expect(html).toContain("\\u003c");
  });

  it("round-trips normal objects via JSON.parse after unescape is not needed for structure", () => {
    const data = { "@type": "Blog", title: "Hello" };
    expect(JSON.parse(serializeJsonLd(data))).toEqual(data);
  });
});
